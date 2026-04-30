import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { EventName, trackEvent } from '@/src/analytics/events';
import type { Language, TranslationKey } from '@/src/i18n/types';
import { translations } from '@/src/i18n/translations';

const STORAGE_KEY = 'rotula.language';
const DEFAULT_LANGUAGE: Language = 'pt';

type LanguageContextValue = {
  language: Language;
  setLanguage: (nextLanguage: Language) => Promise<void>;
  toggleLanguage: () => Promise<void>;
  t: (key: TranslationKey) => string;
};

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageContextProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    let mounted = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!mounted || (value !== 'pt' && value !== 'en')) return;
        setLanguageState(value);
      })
      .catch(() => undefined);
    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    trackEvent(EventName.LanguageChanged, { language: nextLanguage });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch {
      // fallback seguro: mantém estado em memória
    }
  }, []);

  const toggleLanguage = useCallback(async () => {
    await setLanguage(language === 'pt' ? 'en' : 'pt');
  }, [language, setLanguage]);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key] ?? translations[DEFAULT_LANGUAGE][key] ?? key;
    },
    [language]
  );

  const value = useMemo(() => ({ language, setLanguage, toggleLanguage, t }), [language, setLanguage, toggleLanguage, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
