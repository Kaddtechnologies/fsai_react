/**
 * IndexedDB Storage Service
 * 
 * This module provides low-level access to IndexedDB for storing large data like documents
 * and translations. It offers better storage capacity and performance than localStorage.
 */

import { Conversation, Document, TranslationJob } from '../types';
import { STORAGE_EVENTS, dispatchStorageEvent } from './index';

// Database configuration
const DB_NAME = 'flowserveai-db';
const DB_VERSION = 1;

// Store names
export const STORES = {
  CONVERSATIONS: 'conversations',
  DOCUMENTS: 'documents',
  DOCUMENT_VECTORS: 'document-vectors',
  TRANSLATIONS: 'translations'
};

// Interface for database connection
interface DBConnection {
  db: IDBDatabase | null;
  isInitializing: boolean;
  initPromise: Promise<IDBDatabase> | null;
}

// Database connection state
const dbConnection: DBConnection = {
  db: null,
  isInitializing: false,
  initPromise: null
};

/**
 * Initialize the IndexedDB database
 * This creates the database and object stores if they don't exist
 */
export function initDatabase(): Promise<IDBDatabase> {
  // Return existing promise if initialization is in progress
  if (dbConnection.initPromise) {
    return dbConnection.initPromise;
  }

  // Create new initialization promise
  dbConnection.isInitializing = true;
  dbConnection.initPromise = new Promise<IDBDatabase>((resolve, reject) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      // Handle database upgrade (called when DB is created or version changes)
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains(STORES.CONVERSATIONS)) {
          // Use conversation ID as key
          const conversationStore = db.createObjectStore(STORES.CONVERSATIONS, { keyPath: 'id' });
          // Create indexes for faster retrieval
          conversationStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
          // Use document ID as key
          const documentStore = db.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id' });
          // Create indexes for faster retrieval
          documentStore.createIndex('backendId', 'backendId', { unique: false });
          documentStore.createIndex('conversationId', 'conversationId', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.DOCUMENT_VECTORS)) {
          // Use document ID as key
          db.createObjectStore(STORES.DOCUMENT_VECTORS, { keyPath: 'documentId' });
        }

        if (!db.objectStoreNames.contains(STORES.TRANSLATIONS)) {
          // Use translation ID as key
          const translationStore = db.createObjectStore(STORES.TRANSLATIONS, { keyPath: 'id' });
          // Create indexes for faster retrieval
          translationStore.createIndex('updatedAt', 'updatedAt', { unique: false });
          translationStore.createIndex('type', 'type', { unique: false });
        }
      };

      // Handle success
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Set up error handling
        db.onerror = (event) => {
          console.error('IndexedDB error:', event);
        };
        
        // Store reference to database
        dbConnection.db = db;
        dbConnection.isInitializing = false;
        resolve(db);
      };

      // Handle error
      request.onerror = (event) => {
        dbConnection.isInitializing = false;
        dbConnection.initPromise = null;
        console.error('Error opening IndexedDB:', event);
        reject(new Error('Could not open IndexedDB'));
      };
    } catch (error) {
      dbConnection.isInitializing = false;
      dbConnection.initPromise = null;
      console.error('Error initializing IndexedDB:', error);
      reject(error);
    }
  });

  return dbConnection.initPromise;
}

/**
 * Get the database connection, initializing if necessary
 */
export async function getDatabase(): Promise<IDBDatabase> {
  if (dbConnection.db) {
    return dbConnection.db;
  }
  
  return initDatabase();
}

/**
 * Create a transaction for a store
 * 
 * @param storeName The store to access
 * @param mode Transaction mode (readonly or readwrite)
 * @returns The transaction and store objects
 */
export async function createTransaction(
  storeName: string,
  mode: IDBTransactionMode = 'readonly'
): Promise<{ 
  transaction: IDBTransaction, 
  store: IDBObjectStore 
}> {
  const db = await getDatabase();
  
  const transaction = db.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);
  
  return { transaction, store };
}

/**
 * Generic function to get all items from a store
 * 
 * @param storeName The store to get items from
 * @returns Promise with the array of items
 */
export async function getAllItems<T>(storeName: string): Promise<T[]> {
  try {
    const { store } = await createTransaction(storeName);
    
    return new Promise<T[]>((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        console.error(`Error getting all items from ${storeName}:`, event);
        reject(new Error(`Failed to get items from ${storeName}`));
      };
    });
  } catch (error) {
    console.error(`Error in getAllItems for ${storeName}:`, error);
    return [];
  }
}

/**
 * Generic function to get an item by its key
 * 
 * @param storeName The store to get the item from
 * @param key The key to look up
 * @returns Promise with the item or null if not found
 */
export async function getItem<T>(storeName: string, key: string): Promise<T | null> {
  try {
    const { store } = await createTransaction(storeName);
    
    return new Promise<T | null>((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = (event) => {
        console.error(`Error getting item from ${storeName}:`, event);
        reject(new Error(`Failed to get item from ${storeName}`));
      };
    });
  } catch (error) {
    console.error(`Error in getItem for ${storeName}:`, error);
    return null;
  }
}

/**
 * Generic function to add or update an item in a store
 * 
 * @param storeName The store to update
 * @param item The item to add or update
 * @returns Promise that resolves when the operation is complete
 */
export async function putItem<T>(storeName: string, item: T): Promise<void> {
  try {
    const { store, transaction } = await createTransaction(storeName, 'readwrite');
    
    return new Promise<void>((resolve, reject) => {
      const request = store.put(item);
      
      transaction.oncomplete = () => {
        // Notify about store update
        dispatchStorageEvent(`idb-${storeName}-updated`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error(`Error putting item in ${storeName}:`, event);
        reject(new Error(`Failed to put item in ${storeName}`));
      };
    });
  } catch (error) {
    console.error(`Error in putItem for ${storeName}:`, error);
    throw error;
  }
}

/**
 * Generic function to delete an item from a store
 * 
 * @param storeName The store to delete from
 * @param key The key to delete
 * @returns Promise that resolves when the operation is complete
 */
export async function deleteItem(storeName: string, key: string): Promise<void> {
  try {
    const { store, transaction } = await createTransaction(storeName, 'readwrite');
    
    return new Promise<void>((resolve, reject) => {
      const request = store.delete(key);
      
      transaction.oncomplete = () => {
        // Notify about store update
        dispatchStorageEvent(`idb-${storeName}-updated`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error(`Error deleting item from ${storeName}:`, event);
        reject(new Error(`Failed to delete item from ${storeName}`));
      };
    });
  } catch (error) {
    console.error(`Error in deleteItem for ${storeName}:`, error);
    throw error;
  }
}

/**
 * Generic function to clear all items from a store
 * 
 * @param storeName The store to clear
 * @returns Promise that resolves when the operation is complete
 */
export async function clearStore(storeName: string): Promise<void> {
  try {
    const { store, transaction } = await createTransaction(storeName, 'readwrite');
    
    return new Promise<void>((resolve, reject) => {
      const request = store.clear();
      
      transaction.oncomplete = () => {
        // Notify about store update
        dispatchStorageEvent(`idb-${storeName}-updated`);
        resolve();
      };
      
      transaction.onerror = (event) => {
        console.error(`Error clearing store ${storeName}:`, event);
        reject(new Error(`Failed to clear store ${storeName}`));
      };
    });
  } catch (error) {
    console.error(`Error in clearStore for ${storeName}:`, error);
    throw error;
  }
}

/**
 * Check if IndexedDB is supported and available in the current browser
 */
export function isIndexedDBSupported(): boolean {
  return Boolean(window?.indexedDB);
}

/**
 * Migrate data from localStorage to IndexedDB
 * This helps transition from the old storage to the new one
 */
export async function migrateFromLocalStorage(): Promise<void> {
  // Skip if IndexedDB is not supported
  if (!isIndexedDBSupported()) {
    console.warn('IndexedDB not supported, skipping migration');
    return;
  }
  
  try {
    // Get items from localStorage
    const conversations = localStorage.getItem('flowserveai-conversations');
    const documentVectors = localStorage.getItem('flowserveai-document-vectors');
    
    // Migrate conversations
    if (conversations) {
      try {
        const parsedConversations: Conversation[] = JSON.parse(conversations);
        
        // Use a transaction for atomicity
        const db = await getDatabase();
        const transaction = db.transaction([STORES.CONVERSATIONS, STORES.DOCUMENTS], 'readwrite');
        const conversationStore = transaction.objectStore(STORES.CONVERSATIONS);
        const documentStore = transaction.objectStore(STORES.DOCUMENTS);
        
        // Add conversations
        for (const conversation of parsedConversations) {
          // Extract documents and add separately
          if (conversation.messages) {
            for (const message of conversation.messages) {
              if (message.attachments?.length) {
                for (const doc of message.attachments) {
                  if (doc.status === 'completed') {
                    // Add document with conversation context
                    documentStore.put({
                      ...doc,
                      conversationId: conversation.id,
                      messageId: message.id
                    });
                  }
                }
              }
            }
          }
          
          // Add conversation
          conversationStore.put(conversation);
        }
        
        // Wait for transaction to complete
        await new Promise<void>((resolve, reject) => {
          transaction.oncomplete = () => resolve();
          transaction.onerror = () => reject(transaction.error);
        });
        
        console.log('Migrated conversations from localStorage to IndexedDB');
      } catch (error) {
        console.error('Error migrating conversations:', error);
      }
    }
    
    // Migrate document vectors
    if (documentVectors) {
      try {
        const parsedVectors = JSON.parse(documentVectors);
        
        // Use dedicated transaction
        const { store } = await createTransaction(STORES.DOCUMENT_VECTORS, 'readwrite');
        
        // Add vectors
        if (parsedVectors.vectors) {
          for (const vector of parsedVectors.vectors) {
            store.put(vector);
          }
        }
        
        console.log('Migrated document vectors from localStorage to IndexedDB');
      } catch (error) {
        console.error('Error migrating document vectors:', error);
      }
    }
    
    // Migration completed successfully, can clear localStorage if desired
    // This is commented out to keep a backup in case of issues
    // localStorage.removeItem('flowserveai-conversations');
    // localStorage.removeItem('flowserveai-document-vectors');
    
  } catch (error) {
    console.error('Error during localStorage migration:', error);
  }
} 