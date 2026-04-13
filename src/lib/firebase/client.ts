import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Persistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';

import { env } from '@/src/config/env';
import { logger } from '@/src/lib/observability/logger';

const firebaseConfig = {
  apiKey: env.firebaseApiKey,
  authDomain: env.firebaseAuthDomain,
  projectId: env.firebaseProjectId,
  storageBucket: env.firebaseStorageBucket,
  messagingSenderId: env.firebaseMessagingSenderId,
  appId: env.firebaseAppId,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createReactNativePersistence(asyncStorage: {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
}): Persistence {
  return {
    type: 'LOCAL',
    async _isAvailable() {
      try {
        const testKey = '@auth_persistence_test';
        await asyncStorage.setItem(testKey, 'ok');
        await asyncStorage.removeItem(testKey);
        return true;
      } catch {
        return false;
      }
    },
    _set: (key: string, value: unknown) => asyncStorage.setItem(key, JSON.stringify(value)),
    async _get<T>(key: string): Promise<T | null> {
      const value = await asyncStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    },
    _remove: (key: string) => asyncStorage.removeItem(key),
    _addListener: () => {},
    _removeListener: () => {},
  } as Persistence;
}

function createAuth() {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const persistence = createReactNativePersistence(AsyncStorage);

    return initializeAuth(app, { persistence });
  } catch (error) {
    logger.warn('firebase.auth', 'Falling back to non-persistent auth session on React Native.', {
      reason: error instanceof Error ? error.message : String(error),
    });

    return getAuth(app);
  }
}

export const firebaseApp = app;
export const auth = createAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function uploadStorageFile(path: string, blob: Blob | Uint8Array | ArrayBuffer) {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
}
