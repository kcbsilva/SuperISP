// src/contexts/LocaleContext.tsx

'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import translations from '@/translations'; // Import translation data
import { enUS as enUSLocale, ptBR as ptBRLocale, fr as frLocale } from 'date-fns/locale';

export type Locale = 'en' | 'pt' | 'fr';

// Define the shape of the translation dictionary
type TranslationDict = { [key: string]: string | TranslationDict };
type Translations = { [key in Locale]: TranslationDict };

interface LocaleContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string; // Translation function
}

const LocaleContext = createContext<LocaleContextProps | undefined>(undefined);

// Helper function to get nested translation values
const getTranslationValue = (dict: TranslationDict, key: string): string | undefined => {
  const keys = key.split('.');
  let current: string | TranslationDict | undefined = dict;
  
  for (const k of keys) {
    if (typeof current !== 'object' || current === null || !(k in current)) {
      return undefined; // Key not found or not an object
    }
    current = current[k];
  }
  
  // Only return if it's a string, otherwise return undefined
  return typeof current === 'string' ? current : undefined;
};

export const dateLocales: Record<string, typeof enUSLocale> = {
  en: enUSLocale,
  pt: ptBRLocale,
  fr: frLocale,
};

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [isMounted, setIsMounted] = useState(false); // Prevent hydration mismatch

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

  // Memoize the translation function to avoid unnecessary re-renders
  const t = useCallback((key: string, fallback?: string): string => {
    if (!isMounted) {
      // Return fallback or key during SSR or before hydration
      return fallback ?? key;
    }
    
    const currentTranslations = (translations as Translations)[locale] || (translations as Translations)['en'];
    
    const translatedValue = getTranslationValue(currentTranslations, key);
    
    if (translatedValue !== undefined) {
        return translatedValue;
    }
    
    // Return the provided fallback or the key itself if no translation found
    return fallback ?? key;
  }, [isMounted]);

  // Only provide context value once mounted to ensure localStorage is read
  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    t,
  }), [locale, setLocale, t]);

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