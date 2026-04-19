import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth, initializeAuth } from "firebase/auth";
// O TypeScript pode não encontrar a tipagem, mas a função existe no SDK nativo
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";
import {
  type FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Platform } from "react-native";
// Importamos no topo de forma moderna (resolve o erro do ESLint)
import AsyncStorage from "@react-native-async-storage/async-storage";

import { assertFirebaseEnv } from "@/src/config/env";
import { logger } from "@/src/lib/observability/logger";

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;

export function getFirebaseApp() {
  if (!firebaseAppInstance) {
    const firebaseConfig = assertFirebaseEnv();
    firebaseAppInstance = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig);
  }

  return firebaseAppInstance;
}

export function getFirebaseAuth() {
  if (!firebaseAuthInstance) {
    const app = getFirebaseApp();

    if (Platform.OS === "web") {
      firebaseAuthInstance = getAuth(app);
      return firebaseAuthInstance;
    }

    try {
      // Passamos o AsyncStorage importado no topo
      const persistence = getReactNativePersistence(AsyncStorage);
      firebaseAuthInstance = initializeAuth(app, { persistence });
    } catch (error) {
      logger.warn(
        "firebase.auth",
        "Falling back to non-persistent auth session on React Native.",
        {
          reason: error instanceof Error ? error.message : String(error),
        },
      );

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

export async function uploadStorageFile(
  path: string,
  blob: Blob | Uint8Array | ArrayBuffer,
) {
  const fileRef = ref(getFirebaseStorage(), path);
  await uploadBytes(fileRef, blob);
  return getDownloadURL(fileRef);
}
