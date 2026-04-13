import { AuthProvider } from '@/src/providers/auth-provider';
import { type PropsWithChildren } from 'react';

export function AppProvider({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
