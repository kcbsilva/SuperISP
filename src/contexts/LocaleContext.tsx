// src/contexts/LocaleContext.tsx

'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import translations from '@/translations';
import {
  enUS as enUSLocale,
  ptBR as ptBRLocale,
  fr as frLocale,
} from 'date-fns/locale';

export type Locale = 'en' | 'pt' | 'fr';

type TranslationDict = { [key: string]: string | TranslationDict };
type Translations = { [key in Locale]: TranslationDict };

interface LocaleContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (
    key: string,
    varsOrFallback?: Record<string, string | number> | string,
    maybeFallback?: string
  ) => string;
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

const getTranslationValue = (
  dict: TranslationDict,
  key: string
): string | undefined => {
  const keys = key.split('.');
  let current: string | TranslationDict | undefined = dict;

  for (const k of keys) {
    if (
      typeof current !== 'object' ||
      current === null ||
      !(k in current)
    ) {
      return undefined;
    }
    current = current[k];
  }

  return typeof current === 'string' ? current : undefined;
};

export const dateLocales: Record<string, typeof enUSLocale> = {
  en: enUSLocale,
  pt: ptBRLocale,
  fr: frLocale,
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale && ['en', 'pt', 'fr'].includes(storedLocale)) {
      setLocaleState(storedLocale);
    } else {
      setLocaleState('en');
      localStorage.setItem('locale', 'en');
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (['en', 'pt', 'fr'].includes(newLocale)) {
      setLocaleState(newLocale);
      localStorage.setItem('locale', newLocale);
    }
  }, []);

  const t = useCallback(
    (
      key: string,
      varsOrFallback?: Record<string, string | number> | string,
      maybeFallback?: string
    ): string => {
      if (!isMounted) {
        return typeof varsOrFallback === 'string'
          ? varsOrFallback
          : maybeFallback ?? key;
      }

      const currentTranslations =
        (translations as Translations)[locale] || translations['en'];
      let translated =
        getTranslationValue(currentTranslations, key) ??
        (typeof varsOrFallback === 'string'
          ? varsOrFallback
          : maybeFallback ?? key);

      if (typeof translated !== 'string') {
        return key;
      }

      // Interpolation: replace {key} in string
      if (varsOrFallback && typeof varsOrFallback === 'object') {
        for (const [k, v] of Object.entries(varsOrFallback)) {
          translated = translated.replace(new RegExp(`{${k}}`, 'g'), String(v));
        }
      }

      return translated;
    },
    [isMounted, locale]
  );

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextProps => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
