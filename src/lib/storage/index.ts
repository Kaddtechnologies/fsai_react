/**
 * Storage System - Core Module
 * 
 * This module provides a unified interface for persistent storage operations
 * in the FlowserveAI application. It handles conversations, documents, and
 * vectorization of document content for local search capabilities.
 * 
 * Primary storage: IndexedDB (for better performance and capacity)
 * Fallback storage: localStorage (for compatibility)
 */

import { Conversation, Document, Message, TranslationJob } from '../types';
import * as IndexedDB from './indexedDB';

// Storage keys
export const STORAGE_KEYS = {
  CONVERSATIONS: 'flowserveai-conversations',
  ACTIVE_CONVERSATION_ID: 'flowserveai-activeConversationId',
  DOCUMENT_VECTORS: 'flowserveai-document-vectors',
  SETTINGS: 'flowserveai-settings',
  DARK_MODE: 'flowserveai-darkMode',
};

// Custom event names for storage updates
export const STORAGE_EVENTS = {
  UPDATED: 'flowserveai-storage-updated',
  IDB_UPDATED: 'flowserveai-idb-updated',
};

/**
 * Check if IndexedDB is available and should be used as primary storage
 */
export function shouldUseIndexedDB(): boolean {
  try {
    return IndexedDB.isIndexedDBSupported();
  } catch (error) {
    return false;
  }
}

/**
 * Initialize the storage system
 * This migrates data from localStorage if needed and prepares IndexedDB
 */
export async function initStorage(): Promise<void> {
  if (shouldUseIndexedDB()) {
    try {
      // Initialize IndexedDB
      await IndexedDB.initDatabase();
      
      // Migrate data from localStorage if needed
      await IndexedDB.migrateFromLocalStorage();
      
      console.log('Storage system initialized with IndexedDB');
    } catch (error) {
      console.error('Failed to initialize IndexedDB storage:', error);
    }
  } else {
    console.log('Using localStorage for storage (IndexedDB not available)');
  }
}

/**
 * Dispatches a custom event to notify components of storage changes
 * This is particularly useful for cross-component communication
 */
export function dispatchStorageEvent(key: string, value?: any): void {
  const event = new CustomEvent(STORAGE_EVENTS.UPDATED, {
    detail: { key, value }
  });
  window.dispatchEvent(event);
}

/**
 * Gets all conversations from storage
 * @returns Array of conversations sorted by latest update
 */
export async function getConversationsAsync(): Promise<Conversation[]> {
  try {
    if (shouldUseIndexedDB()) {
      // Get from IndexedDB
      const conversations = await IndexedDB.getAllItems<Conversation>(IndexedDB.STORES.CONVERSATIONS);
      return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      // Fallback to localStorage
      const storedData = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!storedData) return [];
      
      const conversations: Conversation[] = JSON.parse(storedData);
      return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  } catch (error) {
    console.error('Failed to retrieve conversations from storage:', error);
    return [];
  }
}

/**
 * Gets all conversations from storage (synchronous version)
 * For backward compatibility with components that don't use async/await
 * @returns Array of conversations sorted by latest update
 */
export function getConversations(): Conversation[] {
  try {
    if (shouldUseIndexedDB()) {
      // Return cached conversations or empty array if not available yet
      // The actual async loading will happen elsewhere
      const storedData = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!storedData) return [];
      
      const conversations: Conversation[] = JSON.parse(storedData);
      return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    } else {
      // Use localStorage directly
      const storedData = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!storedData) return [];
      
      const conversations: Conversation[] = JSON.parse(storedData);
      return conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    }
  } catch (error) {
    console.error('Failed to retrieve conversations from localStorage:', error);
    return [];
  }
}

/**
 * Sets all conversations in storage
 * @param conversations Array of conversations to store
 */
export async function setConversationsAsync(conversations: Conversation[]): Promise<void> {
  try {
    // Sort conversations by update time before storing
    const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    
    if (shouldUseIndexedDB()) {
      // Clear existing conversations
      await IndexedDB.clearStore(IndexedDB.STORES.CONVERSATIONS);
      
      // Add all conversations in a batch
      const db = await IndexedDB.getDatabase();
      const transaction = db.transaction(IndexedDB.STORES.CONVERSATIONS, 'readwrite');
      const store = transaction.objectStore(IndexedDB.STORES.CONVERSATIONS);
      
      for (const conversation of sortedConversations) {
        store.put(conversation);
      }
      
      // Wait for transaction to complete
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => {
          // Also update localStorage as a cache for synchronous access
          localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sortedConversations));
          dispatchStorageEvent(STORAGE_KEYS.CONVERSATIONS);
          resolve();
        };
        transaction.onerror = () => reject(transaction.error);
      });
    } else {
      // Fallback to localStorage
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sortedConversations));
      dispatchStorageEvent(STORAGE_KEYS.CONVERSATIONS);
    }
  } catch (error) {
    console.error('Failed to save conversations to storage:', error);
  }
}

/**
 * Sets all conversations in storage (synchronous version)
 * For backward compatibility with components that don't use async/await
 * @param conversations Array of conversations to store
 */
export function setConversations(conversations: Conversation[]): void {
  try {
    // Sort conversations by update time before storing
    const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    
    // Always update localStorage for immediate access
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sortedConversations));
    dispatchStorageEvent(STORAGE_KEYS.CONVERSATIONS);
    
    // Also update IndexedDB asynchronously if available
    if (shouldUseIndexedDB()) {
      setConversationsAsync(conversations).catch(err => {
        console.error('Failed to update IndexedDB:', err);
      });
    }
  } catch (error) {
    console.error('Failed to save conversations to localStorage:', error);
  }
}

/**
 * Gets the active conversation ID from storage
 */
export function getActiveConversationId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
}

/**
 * Sets the active conversation ID in storage
 */
export function setActiveConversationId(id: string | null): void {
  if (id) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID, id);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
  }
  dispatchStorageEvent(STORAGE_KEYS.ACTIVE_CONVERSATION_ID, id);
}

/**
 * Adds or updates a single conversation (async version)
 * @param conversation The conversation to update
 * @returns The updated array of all conversations
 */
export async function upsertConversationAsync(conversation: Conversation): Promise<Conversation[]> {
  try {
    // Update timestamp
    const updatedConversation = {
      ...conversation,
      updatedAt: Date.now()
    };
    
    if (shouldUseIndexedDB()) {
      // Update in IndexedDB
      await IndexedDB.putItem(IndexedDB.STORES.CONVERSATIONS, updatedConversation);
      
      // Get all conversations with the change
      const allConversations = await getConversationsAsync();
      
      // Update localStorage cache for synchronous access
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(allConversations));
      
      return allConversations;
    } else {
      // Fallback to localStorage
      const allConversations = getConversations();
      const existingIndex = allConversations.findIndex(c => c.id === conversation.id);
      
      if (existingIndex >= 0) {
        allConversations[existingIndex] = updatedConversation;
      } else {
        allConversations.push({
          ...updatedConversation,
          createdAt: updatedConversation.createdAt || Date.now()
        });
      }
      
      const sortedConversations = allConversations.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(sortedConversations));
      dispatchStorageEvent(STORAGE_KEYS.CONVERSATIONS);
      
      return sortedConversations;
    }
  } catch (error) {
    console.error('Failed to upsert conversation:', error);
    return getConversations();
  }
}

/**
 * Adds or updates a single conversation
 * @param conversation The conversation to update
 * @returns The updated array of all conversations
 */
export function upsertConversation(conversation: Conversation): Conversation[] {
  // Update with current timestamp
  const updatedConversation = {
    ...conversation,
    updatedAt: Date.now()
  };
  
  // Get current conversations
  const allConversations = getConversations();
  const existingIndex = allConversations.findIndex(c => c.id === conversation.id);
  
  // Update or add
  if (existingIndex >= 0) {
    allConversations[existingIndex] = updatedConversation;
  } else {
    allConversations.push({
      ...updatedConversation,
      createdAt: updatedConversation.createdAt || Date.now()
    });
  }
  
  // Sort and save
  const sortedConversations = allConversations.sort((a, b) => b.updatedAt - a.updatedAt);
  setConversations(sortedConversations);
  
  return sortedConversations;
}

/**
 * Deletes a conversation by ID
 * @param id The conversation ID to delete
 * @returns The updated array of remaining conversations
 */
export function deleteConversation(id: string): Conversation[] {
  // Update localStorage first for immediate feedback
  const allConversations = getConversations();
  const filteredConversations = allConversations.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filteredConversations));
  
  // If we deleted the active conversation, update the active ID
  const activeId = getActiveConversationId();
  if (activeId === id) {
    setActiveConversationId(filteredConversations.length > 0 ? filteredConversations[0].id : null);
  }
  
  // Also delete from IndexedDB if available
  if (shouldUseIndexedDB()) {
    IndexedDB.deleteItem(IndexedDB.STORES.CONVERSATIONS, id).catch(err => {
      console.error('Failed to delete conversation from IndexedDB:', err);
    });
  }
  
  dispatchStorageEvent(STORAGE_KEYS.CONVERSATIONS);
  return filteredConversations;
}

/**
 * Updates messages in a specific conversation
 * @param conversationId The conversation to update
 * @param messages The new message array
 * @param newTitle Optional new title for the conversation
 * @returns The updated conversation or null if not found
 */
export function updateConversationMessages(
  conversationId: string, 
  messages: Message[], 
  newTitle?: string
): Conversation | null {
  // Get current conversations
  const allConversations = getConversations();
  const conversationIndex = allConversations.findIndex(c => c.id === conversationId);
  
  if (conversationIndex === -1) return null;
  
  // Create updated conversation
  const updatedConversation = {
    ...allConversations[conversationIndex],
    messages,
    updatedAt: Date.now()
  };
  
  if (newTitle) {
    updatedConversation.title = newTitle;
  }
  
  // Update in storage
  allConversations[conversationIndex] = updatedConversation;
  setConversations(allConversations);
  
  return updatedConversation;
}

/**
 * Save a translation job to storage
 * 
 * @param translation The translation job to save
 */
export async function saveTranslation(translation: TranslationJob): Promise<void> {
  if (shouldUseIndexedDB()) {
    try {
      await IndexedDB.putItem(IndexedDB.STORES.TRANSLATIONS, translation);
    } catch (error) {
      console.error('Failed to save translation to IndexedDB:', error);
      // Fallback to localStorage for critical data
      const translations = getTranslations();
      const index = translations.findIndex(t => t.id === translation.id);
      
      if (index >= 0) {
        translations[index] = translation;
      } else {
        translations.push(translation);
      }
      
      localStorage.setItem('flowserveai-translations', JSON.stringify(translations));
    }
  } else {
    // Use localStorage
    const translations = getTranslations();
    const index = translations.findIndex(t => t.id === translation.id);
    
    if (index >= 0) {
      translations[index] = translation;
    } else {
      translations.push(translation);
    }
    
    localStorage.setItem('flowserveai-translations', JSON.stringify(translations));
  }
  
  dispatchStorageEvent('translations-updated');
}

/**
 * Get all translation jobs from storage
 * 
 * @returns Array of translation jobs
 */
export async function getTranslationsAsync(): Promise<TranslationJob[]> {
  if (shouldUseIndexedDB()) {
    try {
      const translations = await IndexedDB.getAllItems<TranslationJob>(IndexedDB.STORES.TRANSLATIONS);
      return translations.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Failed to get translations from IndexedDB:', error);
      // Fallback to localStorage
      return getTranslations();
    }
  } else {
    // Use localStorage
    return getTranslations();
  }
}

/**
 * Get all translation jobs from localStorage
 * Synchronous version for backward compatibility
 */
export function getTranslations(): TranslationJob[] {
  try {
    const storedData = localStorage.getItem('flowserveai-translations');
    if (!storedData) return [];
    
    const translations: TranslationJob[] = JSON.parse(storedData);
    return translations.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch (error) {
    console.error('Failed to retrieve translations from localStorage:', error);
    return [];
  }
}

/**
 * Delete a translation job
 * 
 * @param id The translation ID to delete
 */
export async function deleteTranslation(id: string): Promise<void> {
  if (shouldUseIndexedDB()) {
    try {
      await IndexedDB.deleteItem(IndexedDB.STORES.TRANSLATIONS, id);
    } catch (error) {
      console.error('Failed to delete translation from IndexedDB:', error);
      // Fallback to localStorage
      const translations = getTranslations().filter(t => t.id !== id);
      localStorage.setItem('flowserveai-translations', JSON.stringify(translations));
    }
  } else {
    // Use localStorage
    const translations = getTranslations().filter(t => t.id !== id);
    localStorage.setItem('flowserveai-translations', JSON.stringify(translations));
  }
  
  dispatchStorageEvent('translations-updated');
}

/**
 * Clear all storage data (for logout or reset)
 */
export async function clearAllStorageData(): Promise<void> {
  // Clear localStorage
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
  localStorage.removeItem(STORAGE_KEYS.DOCUMENT_VECTORS);
  localStorage.removeItem('flowserveai-translations');
  // Don't remove settings by default
  // localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  
  // Clear IndexedDB if available
  if (shouldUseIndexedDB()) {
    try {
      await IndexedDB.clearStore(IndexedDB.STORES.CONVERSATIONS);
      await IndexedDB.clearStore(IndexedDB.STORES.DOCUMENTS);
      await IndexedDB.clearStore(IndexedDB.STORES.DOCUMENT_VECTORS);
      await IndexedDB.clearStore(IndexedDB.STORES.TRANSLATIONS);
    } catch (error) {
      console.error('Failed to clear IndexedDB stores:', error);
    }
  }
  
  // Dispatch events for any listeners
  dispatchStorageEvent(STORAGE_KEYS.CONVERSATIONS);
  dispatchStorageEvent(STORAGE_KEYS.ACTIVE_CONVERSATION_ID);
  dispatchStorageEvent(STORAGE_KEYS.DOCUMENT_VECTORS);
  dispatchStorageEvent('translations-updated');
} 