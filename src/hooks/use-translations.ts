import { useState, useEffect, useCallback } from 'react';

export function useTranslations() {
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flowserveai-language') || 'en';
    }
    return 'en';
  });

  // Load translations based on current language
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const translationModule = await import(`@/app/translate/translations/locales/${currentLanguage}`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translations for ${currentLanguage}`, error);
        if (currentLanguage !== 'en') {
          const fallbackModule = await import('@/app/translate/translations/locales/en');
          setTranslations(fallbackModule.default);
        }
      }
    };
    
    loadTranslations();
  }, [currentLanguage]);

  // Listen for language changes from other components
  useEffect(() => {
    const handleSettingsUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.language) {
        setCurrentLanguage(event.detail.language);
      }
    };

    window.addEventListener('flowserveai-settings-updated', handleSettingsUpdate as EventListener);
    return () => {
      window.removeEventListener('flowserveai-settings-updated', handleSettingsUpdate as EventListener);
    };
  }, []);

  // Translation function
  const t = useCallback((key: string, fallback?: string): string => {
    const parts = key.split('.');
    let value: any = translations;
    
    for (const part of parts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : fallback || key;
  }, [translations]);

  return { t, currentLanguage };
} 