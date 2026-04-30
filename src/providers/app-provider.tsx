import { type PropsWithChildren } from 'react';

import { AuthProvider } from '@/src/providers/auth-provider';
import { LanguageProvider } from '@/src/providers/language-provider';

export function AppProvider({ children }: PropsWithChildren) {
  return (
    <LanguageProvider>
      <AuthProvider>{children}</AuthProvider>
    </LanguageProvider>
  );
}
