import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, type Auth, type Persistence } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, type FirebaseStorage, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';

import { assertFirebaseEnv } from '@/src/config/env';
import { logger } from '@/src/lib/observability/logger';

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;

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

export function getFirebaseApp() {
  if (!firebaseAppInstance) {
    const firebaseConfig = assertFirebaseEnv();
    firebaseAppInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseAppInstance;
}

export function getFirebaseAuth() {
  if (!firebaseAuthInstance) {
    const app = getFirebaseApp();

    if (Platform.OS === 'web') {
      firebaseAuthInstance = getAuth(app);
      return firebaseAuthInstance;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const persistence = createReactNativePersistence(AsyncStorage);
      firebaseAuthInstance = initializeAuth(app, { persistence });
    } catch (error) {
      logger.warn('firebase.auth', 'Falling back to non-persistent auth session on React Native.', {
        reason: error instanceof Error ? error.message : String(error),
      });

      firebaseAuthInstance = getAuth(app);
    }
  }

  return firebaseAuthInstance;
}

export function getFirebaseDb() {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }

  return firestoreInstance;
}

export function getFirebaseStorage() {
  if (!firebaseStorageInstance) {
    firebaseStorageInstance = getStorage(getFirebaseApp());
  }

  return firebaseStorageInstance;
}

export async function uploadStorageFile(path: string, blob: Blob | Uint8Array | ArrayBuffer) {
  const fileRef = ref(getFirebaseStorage(), path);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
}
