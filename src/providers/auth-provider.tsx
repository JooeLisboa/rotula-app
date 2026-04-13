import { apiClient } from '@/src/lib/api/http-client';
import { captureError, trackEvent } from '@/src/lib/observability/monitoring';
import { persistentStore } from '@/src/lib/storage/persistent-store';
import { authService } from '@/src/services/auth/auth-service';
import type { LoginInput, RegisterInput, Session } from '@/src/types/auth';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

interface AuthContextValue {
  session: Session | null;
  isInitializing: boolean;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginInput) => Promise<void>;
  register: (payload: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
}

const SESSION_KEY = 'rotula.session.v1';

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      try {
        const storedSession = await persistentStore.getItem<Session>(SESSION_KEY);
        if (active && storedSession) {
          setSession(storedSession);
        }
      } catch (error) {
        captureError(error, { scope: 'auth.bootstrap' });
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    }

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    apiClient.setTokenProvider(() => session?.accessToken ?? null);
  }, [session]);

  const persistSession = useCallback(async (value: Session | null) => {
    if (!value) {
      await persistentStore.removeItem(SESSION_KEY);
      return;
    }

    await persistentStore.setItem(SESSION_KEY, value);
  }, []);

  const login = useCallback(
    async (payload: LoginInput) => {
      setIsAuthenticating(true);

      try {
        const nextSession = await authService.login(payload);
        setSession(nextSession);
        await persistSession(nextSession);
        trackEvent('login_success', { userId: nextSession.user.id });
      } catch (error) {
        trackEvent('login_failure', { email: payload.email });
        captureError(error, { scope: 'auth.login' });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistSession]
  );

  const register = useCallback(
    async (payload: RegisterInput) => {
      setIsAuthenticating(true);

      try {
        const nextSession = await authService.register(payload);
        setSession(nextSession);
        await persistSession(nextSession);
        trackEvent('register_success', { userId: nextSession.user.id });
      } catch (error) {
        trackEvent('register_failure', { email: payload.email });
        captureError(error, { scope: 'auth.register' });
        throw error;
      } finally {
        setIsAuthenticating(false);
      }
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setSession(null);
      await persistSession(null);
      trackEvent('logout', {});
    } catch (error) {
      captureError(error, { scope: 'auth.logout' });
      throw error;
    }
  }, [persistSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isInitializing,
      isAuthenticating,
      isAuthenticated: Boolean(session?.accessToken),
      login,
      register,
      logout,
    }),
    [session, isInitializing, isAuthenticating, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
