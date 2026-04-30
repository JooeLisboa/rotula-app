import { type PropsWithChildren } from 'react';

import { LanguageContextProvider } from '@/src/i18n/language-context';

export function LanguageProvider({ children }: PropsWithChildren) {
  return <LanguageContextProvider>{children}</LanguageContextProvider>;
}
