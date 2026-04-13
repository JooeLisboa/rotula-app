export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.rotula.app/v1',
  apiMode: process.env.EXPO_PUBLIC_API_MODE ?? 'mock',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
} as const;

export const isMockApi = env.apiMode !== 'live';
