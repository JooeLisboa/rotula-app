import { captureError, trackEvent } from '@/src/lib/observability/monitoring';
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

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const unsubscribe = authService.onSessionChanged((nextSession) => {
      setSession(nextSession);
      setIsInitializing(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (payload: LoginInput) => {
    setIsAuthenticating(true);

    try {
      const nextSession = await authService.login(payload);
      setSession(nextSession);
      trackEvent('auth_login_success', { userId: nextSession.user.id });
    } catch (error) {
      trackEvent('auth_login_failure', { email: payload.email });
      captureError(error, { scope: 'auth.login' });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterInput) => {
    setIsAuthenticating(true);

    try {
      const nextSession = await authService.register(payload);
      setSession(nextSession);
      trackEvent('auth_register_success', { userId: nextSession.user.id });
    } catch (error) {
      trackEvent('auth_register_failure', { email: payload.email });
      captureError(error, { scope: 'auth.register' });
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setSession(null);
      trackEvent('auth_logout', {});
    } catch (error) {
      captureError(error, { scope: 'auth.logout' });
      throw error;
    }
  }, []);

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
