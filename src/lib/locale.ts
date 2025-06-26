// src/lib/locale.ts
import { enUS, ptBR, fr } from 'date-fns/locale';

export type AppLocale = 'en' | 'pt' | 'fr';

export const dateLocales: Record<AppLocale, Locale> = {
  en: enUS,
  pt: ptBR,
  fr: fr,
};
