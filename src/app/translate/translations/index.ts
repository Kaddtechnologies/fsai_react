// Import all locales
import en from './locales/en';
import es from './locales/es';
import fr from './locales/fr';
import de from './locales/de';
import it from './locales/it';
import pt from './locales/pt';
import zh from './locales/zh';
import ja from './locales/ja';
import ko from './locales/ko';
import ar from './locales/ar';

// Define a complete set of supported languages
export const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar'];

// Export all translations keyed by language code
export const translations: Record<string, any> = {
  en,
  es,
  fr,
  de,
  it,
  pt,
  zh,
  ja,
  ko,
  ar
};

// Define types for the translation objects
export type TranslationKeys = keyof typeof en;

// Create a useTranslation hook
export const getTranslation = (lang: string, key: TranslationKeys) => {
  // Default to English if the requested language doesn't exist
  const languageDict = translations[lang as keyof typeof translations] || en;
  
  // Return the requested key or the English version as fallback
  return languageDict[key] || en[key];
};