type Metadata = Record<string, unknown>;

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value);
  } catch {
    return '[unserializable-metadata]';
  }
}

function format(scope: string, message: string, metadata?: Metadata) {
  return `[${scope}] ${message}${metadata ? ` ${safeStringify(metadata)}` : ''}`;
}

export const logger = {
  info(scope: string, message: string, metadata?: Metadata) {
    console.info(format(scope, message, metadata));
  },
  warn(scope: string, message: string, metadata?: Metadata) {
    console.warn(format(scope, message, metadata));
  },
  error(scope: string, message: string, metadata?: Metadata) {
    console.error(format(scope, message, metadata));
  },
};
