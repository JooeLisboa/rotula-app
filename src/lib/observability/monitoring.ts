import { env } from '@/src/config/env';
import { logger } from '@/src/lib/observability/logger';

type EventPayload = Record<string, unknown>;

type SerializedError = {
  message: string;
  code?: string;
  stack?: string;
  name?: string;
  raw?: unknown;
};

let isInitialized = false;

function getErrorUtils(): {
  getGlobalHandler?: () => (error: unknown, isFatal?: boolean) => void;
  setGlobalHandler?: (handler: (error: unknown, isFatal?: boolean) => void) => void;
} | null {
  return (globalThis as { ErrorUtils?: unknown }).ErrorUtils as {
    getGlobalHandler?: () => (error: unknown, isFatal?: boolean) => void;
    setGlobalHandler?: (handler: (error: unknown, isFatal?: boolean) => void) => void;
  } | null;
}

function serializeError(error: unknown): SerializedError {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as { code?: string }).code,
    };
  }

  if (typeof error === 'string') {
    return { message: error, raw: error };
  }

  if (error === null) {
    return { message: 'Unknown error (null).', raw: error };
  }

  if (error === undefined) {
    return { message: 'Unknown error (undefined).', raw: error };
  }

  if (typeof error === 'object') {
    const objectError = error as { message?: unknown; code?: unknown; stack?: unknown; name?: unknown };
    return {
      message: typeof objectError.message === 'string' ? objectError.message : 'Unknown object error.',
      code: typeof objectError.code === 'string' ? objectError.code : undefined,
      stack: typeof objectError.stack === 'string' ? objectError.stack : undefined,
      name: typeof objectError.name === 'string' ? objectError.name : undefined,
      raw: error,
    };
  }

  return { message: `Unknown error type: ${typeof error}.`, raw: error };
}

export function initMonitoring() {
  if (isInitialized) {
    return;
  }

  isInitialized = true;
  logger.info('monitoring', 'Observability initialized', {
    sentryConfigured: Boolean(env.sentryDsn),
  });

  const errorUtils = getErrorUtils();
  const currentHandler = errorUtils?.getGlobalHandler?.();

  errorUtils?.setGlobalHandler?.((error: unknown, isFatal?: boolean) => {
    captureError(error, { isFatal, source: 'global-handler' });
    currentHandler?.(error, isFatal);
  });
}

export function trackEvent(event: string, payload?: EventPayload) {
  logger.info('event', event, payload);
}

export function captureError(error: unknown, metadata?: EventPayload) {
  const serialized = serializeError(error);

  logger.error('error', serialized.message, {
    code: serialized.code,
    name: serialized.name,
    stack: serialized.stack,
    raw: serialized.raw,
    ...metadata,
  });
}
