import AsyncStorage from '@react-native-async-storage/async-storage';
import { type FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth, initializeAuth } from 'firebase/auth';
// @ts-ignore - compat no React Native
import { getReactNativePersistence } from 'firebase/auth';
import { type Firestore, getFirestore } from 'firebase/firestore';
import { type FirebaseStorage, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { Platform } from 'react-native';

import { assertFirebaseEnv, hasFirebaseEnv } from '@/src/config/env';
import { logger } from '@/src/lib/observability/logger';

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;

export function isFirebaseConfigured() {
  return hasFirebaseEnv();
}

function assertConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase não configurado. Confira as variáveis EXPO_PUBLIC_FIREBASE_* no .env.');
  }
}

export function getFirebaseApp() {
  assertConfigured();

  if (!firebaseAppInstance) {
    const firebaseConfig = assertFirebaseEnv();
    firebaseAppInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  return firebaseAppInstance;
}

export function getFirebaseAuth() {
  assertConfigured();

  if (!firebaseAuthInstance) {
    const app = getFirebaseApp();

    if (Platform.OS === 'web') {
      firebaseAuthInstance = getAuth(app);
      return firebaseAuthInstance;
    }

    try {
      const persistence = getReactNativePersistence(AsyncStorage);
      firebaseAuthInstance = initializeAuth(app, { persistence });
    } catch (error) {
      logger.warn('firebase.auth', 'Sessão persistente indisponível. Usando fallback sem persistência.', {
        reason: error instanceof Error ? error.message : String(error),
      });

      firebaseAuthInstance = getAuth(app);
    }
  }

  return firebaseAuthInstance;
}

export function getFirebaseDb() {
  assertConfigured();

  if (!firestoreInstance) {
    firestoreInstance = getFirestore(getFirebaseApp());
  }

  return firestoreInstance;
}

export function getFirebaseStorage() {
  assertConfigured();

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
