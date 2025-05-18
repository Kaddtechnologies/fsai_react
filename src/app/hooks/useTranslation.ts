"use client";

import { useState, useEffect } from 'react';
import { translations } from '../translate/translations';

/**
 * Custom hook for accessing translations based on the selected language
 * - Loads the language from localStorage and falls back to 'en'
 * - Provides a function to get any translation string
 * - Updates automatically when the language is changed
 */
export const useTranslation = () => {
  const [language, setLanguage] = useState<string>('en');

  // Load language from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('flowserveai-language') || 'en';
      setLanguage(savedLanguage);
    }
  }, []);

  // Listen for language change events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'flowserveai-language' && e.newValue) {
        setLanguage(e.newValue);
      }
    };

    const handleSettingsUpdate = (e: CustomEvent) => {
      if (e.detail && e.detail.language) {
        setLanguage(e.detail.language);
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('flowserveai-settings-updated', handleSettingsUpdate as EventListener);

    // Clean up event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('flowserveai-settings-updated', handleSettingsUpdate as EventListener);
    };
  }, []);

  /**
   * Get a translation string for the current language
   * Falls back to English if the key doesn't exist in the selected language
   */
  const t = (key: string) => {
    // Get the translation dictionary for the current language, fallback to English
    const languageDict = translations[language as keyof typeof translations] || translations.en;
    
    // Use the dot notation key to navigate the nested object (e.g., 'chat.send')
    const keys = key.split('.');
    let result: any = languageDict;
    
    // Navigate through the object structure
    for (const k of keys) {
      if (result === undefined || result === null) break;
      result = result[k];
    }
    
    // If we didn't find the key in the current language, fallback to English
    if (result === undefined || result === null) {
      let fallback = translations.en;
      for (const fallbackKey of keys) {
        if (fallback === undefined || fallback === null) break;
        fallback = fallback[fallbackKey];
      }
      return fallback || key; // If even English doesn't have it, return the key itself
    }
    
    return result || key;
  };

  return {
    language,
    t
  };
};

export default useTranslation;