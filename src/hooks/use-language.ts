import { LanguageContext } from '@/src/i18n/language-context';
import { useContext } from 'react';

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider.');
  }

  return context;
}
