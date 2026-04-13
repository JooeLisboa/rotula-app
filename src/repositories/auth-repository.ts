import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { getFirebaseAuth, getFirebaseDb } from '@/src/lib/firebase/client';
import type { ForgotPasswordInput, LoginInput, RegisterInput, Session } from '@/src/types/auth';

type AuthError = Error & { code?: string; originalMessage?: string };

function createAuthError(message: string, error: unknown): AuthError {
  const baseError = error instanceof Error ? error : new Error(typeof error === 'string' ? error : 'Falha de autenticação.');
  const normalized = new Error(message) as AuthError;
  normalized.code = error instanceof FirebaseError ? error.code : undefined;
  normalized.originalMessage = baseError.message;
  normalized.stack = baseError.stack;
  return normalized;
}

function mapFirebaseAuthError(error: unknown) {
  const code = error instanceof FirebaseError ? error.code : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return createAuthError('E-mail ou senha inválidos.', error);
    case 'auth/email-already-in-use':
      return createAuthError('Este e-mail já está em uso.', error);
    case 'auth/weak-password':
      return createAuthError('A senha é muito fraca.', error);
    case 'auth/invalid-email':
      return createAuthError('E-mail inválido.', error);
    case 'auth/network-request-failed':
      return createAuthError('Falha de conexão. Verifique sua internet e tente novamente.', error);
    default:
      return createAuthError('Não foi possível autenticar agora. Tente novamente.', error);
  }
}

async function toSession(user: User): Promise<Session> {
  const accessToken = await user.getIdToken();

  return {
    accessToken,
    refreshToken: user.refreshToken,
    user: {
      id: user.uid,
      email: user.email ?? '',
      name: user.displayName ?? user.email?.split('@')[0] ?? 'Usuário',
    },
  };
}

export const authRepository = {
  onSessionChanged(handler: (session: Session | null) => void) {
    return onAuthStateChanged(getFirebaseAuth(), async (user) => {
      if (!user) {
        handler(null);
        return;
      }

      handler(await toSession(user));
    });
  },

  async login(input: LoginInput): Promise<Session> {
    try {
      const credential = await signInWithEmailAndPassword(getFirebaseAuth(), input.email, input.password);
      return toSession(credential.user);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },

  async register(input: RegisterInput): Promise<Session> {
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();
      const credential = await createUserWithEmailAndPassword(auth, input.email, input.password);
      await updateProfile(credential.user, { displayName: input.name });

      await setDoc(
        doc(db, 'users', credential.user.uid),
        {
          uid: credential.user.uid,
          email: input.email,
          name: input.name,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, 'user_profiles', credential.user.uid),
        {
          uid: credential.user.uid,
          email: input.email,
          name: input.name,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, 'user_preferences', credential.user.uid),
        {
          uid: credential.user.uid,
          notificationsEnabled: true,
          locale: 'pt-BR',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      return toSession(credential.user);
    } catch (error) {
      await signOut(getFirebaseAuth()).catch(() => undefined);
      throw mapFirebaseAuthError(error);
    }
  },

  async logout() {
    await signOut(getFirebaseAuth());
  },

  async forgotPassword(input: ForgotPasswordInput) {
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), input.email);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },
};
