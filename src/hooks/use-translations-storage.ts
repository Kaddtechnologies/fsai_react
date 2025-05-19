/**
 * Translations Storage Hook
 * 
 * This hook provides functionality for managing translation jobs with IndexedDB,
 * allowing components to easily save, retrieve, and delete translations.
 * 
 * Features:
 * - Stores complete translation history with all source and target languages
 * - Preserves translations across browser sessions
 * - Supports document translations with file references
 * - Provides reactive state updates when translations change
 */

import { useState, useEffect, useCallback } from 'react';
import { TranslationJob } from '@/lib/types';
import * as StorageAPI from '@/lib/storage';
import { useToast } from './use-toast';

export function useTranslationsStorage() {
  const [translations, setTranslations] = useState<TranslationJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initial loading of translations
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        setIsLoading(true);
        // Get translations from storage
        const storedTranslations = await StorageAPI.getTranslationsAsync();
        setTranslations(storedTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
        toast({
          title: 'Error loading translations',
          description: 'There was a problem loading your translation history.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();

    // Listen for storage events (from other tabs or components)
    const handleStorageEvent = (event: StorageEvent | CustomEvent) => {
      let key = '';

      if (event instanceof StorageEvent) {
        key = event.key || '';
      } else if (event instanceof CustomEvent && event.detail) {
        key = event.detail.key || '';
      }

      if (key === 'translations-updated' || key === 'flowserveai-translations' || key.includes('translations')) {
        loadTranslations();
      }
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener(StorageAPI.STORAGE_EVENTS.UPDATED, handleStorageEvent as EventListener);

    return () => {
      // Clean up event listeners
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener(StorageAPI.STORAGE_EVENTS.UPDATED, handleStorageEvent as EventListener);
    };
  }, [toast]);

  /**
   * Save a translation job
   */
  const saveTranslation = useCallback(async (translation: TranslationJob) => {
    try {
      // Ensure updatedAt is set
      const updatedTranslation = {
        ...translation,
        updatedAt: Date.now()
      };

      // Save to storage
      await StorageAPI.saveTranslation(updatedTranslation);

      // Update local state
      setTranslations(prev => {
        const exists = prev.some(t => t.id === translation.id);
        if (exists) {
          return prev.map(t => t.id === translation.id ? updatedTranslation : t)
            .sort((a, b) => b.updatedAt - a.updatedAt);
        } else {
          return [updatedTranslation, ...prev]
            .sort((a, b) => b.updatedAt - a.updatedAt);
        }
      });

      return true;
    } catch (error) {
      console.error('Failed to save translation:', error);
      toast({
        title: 'Error saving translation',
        description: 'There was a problem saving your translation.',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  /**
   * Delete a translation job
   */
  const deleteTranslation = useCallback(async (id: string) => {
    try {
      // Delete from storage
      await StorageAPI.deleteTranslation(id);

      // Update local state
      setTranslations(prev => prev.filter(t => t.id !== id));

      toast({
        title: 'Translation deleted',
        description: 'The translation has been successfully removed.',
        variant: 'default'
      });

      return true;
    } catch (error) {
      console.error('Failed to delete translation:', error);
      toast({
        title: 'Error deleting translation',
        description: 'There was a problem deleting your translation.',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  /**
   * Get a translation by ID
   */
  const getTranslation = useCallback((id: string) => {
    return translations.find(t => t.id === id) || null;
  }, [translations]);

  /**
   * Get translations filtered by type
   */
  const getTranslationsByType = useCallback((type: 'text' | 'document') => {
    return translations.filter(t => t.type === type);
  }, [translations]);

  /**
   * Clear all translations
   */
  const clearAllTranslations = useCallback(async () => {
    try {
      // Special case for the translations store
      if (StorageAPI.shouldUseIndexedDB()) {
        const IndexedDB = await import('@/lib/storage/indexedDB');
        await IndexedDB.clearStore(IndexedDB.STORES.TRANSLATIONS);
      } else {
        localStorage.removeItem('flowserveai-translations');
      }

      // Update local state
      setTranslations([]);
      
      StorageAPI.dispatchStorageEvent('translations-updated');
      
      toast({
        title: 'Translations cleared',
        description: 'All translation history has been removed.',
        variant: 'default'
      });
      
      return true;
    } catch (error) {
      console.error('Failed to clear translations:', error);
      toast({
        title: 'Error clearing translations',
        description: 'There was a problem clearing your translation history.',
        variant: 'destructive'
      });
      return false;
    }
  }, [toast]);

  return {
    translations,
    isLoading,
    saveTranslation,
    deleteTranslation,
    getTranslation,
    getTranslationsByType,
    clearAllTranslations
  };
} 