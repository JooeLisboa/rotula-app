import { env } from '@/src/config/env';
import { logger } from '@/src/lib/observability/logger';

type EventPayload = Record<string, unknown>;

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
    captureError(error, { isFatal });
    currentHandler?.(error, isFatal);
  });
}

export function trackEvent(event: string, payload?: EventPayload) {
  logger.info('event', event, payload);
}

export function captureError(error: unknown, metadata?: EventPayload) {
  const normalized = error instanceof Error ? error : new Error(String(error));

  logger.error('error', normalized.message, {
    stack: normalized.stack,
    ...metadata,
  });
}
