function readEnv(value: string | undefined) {
  const normalized = value?.trim();
  return normalized && normalized.length > 0 ? normalized : undefined;
}

export const env = {
  firebaseApiKey: readEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
  firebaseAuthDomain: readEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
  firebaseProjectId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
  firebaseStorageBucket: readEnv(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
  firebaseMessagingSenderId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  firebaseAppId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
  sentryDsn: readEnv(process.env.EXPO_PUBLIC_SENTRY_DSN),
} as const;

export function hasFirebaseEnv() {
  return Boolean(
    env.firebaseApiKey &&
      env.firebaseAuthDomain &&
      env.firebaseProjectId &&
      env.firebaseStorageBucket &&
      env.firebaseMessagingSenderId &&
      env.firebaseAppId
  );
}

export function assertFirebaseEnv() {
  const required = {
    EXPO_PUBLIC_FIREBASE_API_KEY: env.firebaseApiKey,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: env.firebaseAuthDomain,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: env.firebaseProjectId,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: env.firebaseStorageBucket,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: env.firebaseMessagingSenderId,
    EXPO_PUBLIC_FIREBASE_APP_ID: env.firebaseAppId,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required Firebase env var(s): ${missing.join(', ')}`);
  }

  return {
    apiKey: required.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: required.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: required.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: required.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: required.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: required.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
}
