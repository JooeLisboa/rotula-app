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

import { auth, db } from '@/src/lib/firebase/client';
import type { ForgotPasswordInput, LoginInput, RegisterInput, Session } from '@/src/types/auth';

function mapFirebaseAuthError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return new Error('E-mail ou senha inválidos.');
    case 'auth/email-already-in-use':
      return new Error('Este e-mail já está em uso.');
    case 'auth/weak-password':
      return new Error('A senha é muito fraca.');
    case 'auth/invalid-email':
      return new Error('E-mail inválido.');
    default:
      return error instanceof Error ? error : new Error('Falha de autenticação.');
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
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        handler(null);
        return;
      }

      handler(await toSession(user));
    });
  },

  async login(input: LoginInput): Promise<Session> {
    try {
      const credential = await signInWithEmailAndPassword(auth, input.email, input.password);
      return toSession(credential.user);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },

  async register(input: RegisterInput): Promise<Session> {
    try {
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
      throw mapFirebaseAuthError(error);
    }
  },

  async logout() {
    await signOut(auth);
  },

  async forgotPassword(input: ForgotPasswordInput) {
    try {
      await sendPasswordResetEmail(auth, input.email);
    } catch (error) {
      throw mapFirebaseAuthError(error);
    }
  },
};
