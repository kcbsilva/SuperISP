// src/contexts/LocaleContext.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import translations from '@/translations'; // Import translation data

export type Locale = 'en' | 'pt'; // Removed 'fr'

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
  return typeof current === 'string' ? current : undefined; // Return only if it's a string
};


export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('pt'); // Default to Portuguese
  const [isMounted, setIsMounted] = useState(false); // Prevent hydration mismatch

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem('locale') as Locale | null;
    if (storedLocale && ['en', 'pt'].includes(storedLocale)) { // Removed 'fr'
      setLocaleState(storedLocale);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    if (['en', 'pt'].includes(newLocale)) { // Removed 'fr'
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
    const currentTranslations = (translations as Translations)[locale] || translations.en;
    const fallbackTranslations = translations.en;

    const translatedValue = getTranslationValue(currentTranslations, key);
    if (translatedValue !== undefined) {
        return translatedValue;
    }

    // Try fallback locale (English)
    const fallbackValue = getTranslationValue(fallbackTranslations, key);
    if (fallbackValue !== undefined) {
        return fallbackValue;
    }

    // Return the provided fallback or the key itself if no translation found
    return fallback ?? key;
  }, [locale, isMounted]);

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
