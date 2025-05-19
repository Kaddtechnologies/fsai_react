/**
 * Document Storage and Vectorization Module
 * 
 * This module provides functionality for storing and retrieving documents 
 * in IndexedDB, as well as simple vectorization for search capabilities.
 * 
 * Since browser environments don't support full vector databases,
 * we implement a simplified approach for document search:
 * 1. Parse document text content
 * 2. Create a term frequency index
 * 3. Store the index along with document metadata
 * 4. Provide search methods to find relevant documents
 */

import { Document, Message } from '../types';
import { STORAGE_KEYS, dispatchStorageEvent, shouldUseIndexedDB } from './index';
import * as IndexedDB from './indexedDB';

// Interface for document vector storage
interface DocumentVector {
  documentId: string;
  backendId?: string;
  terms: Record<string, number>; // term -> frequency
  name: string;
  type: Document['type'];
  summary?: string;
  timestamp: number;
}

interface DocumentVectorStorage {
  version: number;
  vectors: DocumentVector[];
}

// A simple English stopwords list to improve vectorization
const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
  'be', 'been', 'being', 'to', 'of', 'for', 'with', 'by', 'about',
  'against', 'between', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
  'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
  'own', 'same', 'so', 'than', 'too', 'very', 'can', 'will', 'just', 'should',
  'now', 'if', 'its', 'it\'s', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 
  'ourselves', 'you', 'your', 'yours', 'yourself', 'he', 'him', 'his', 'himself',
]);

/**
 * Extracts text content from a dataUri (currently focused on text-like documents)
 * 
 * This is a simplified implementation. In a production environment,
 * you would use specialized libraries for different file formats:
 * - PDF: pdf.js
 * - DOCX: docx.js
 * - XLSX: xlsx.js
 * - etc.
 * 
 * @param dataUri Data URI of the document
 * @param fileType Type of document
 * @returns Extracted text content or null if extraction failed
 */
export async function extractTextFromDataUri(dataUri: string, fileType: Document['type']): Promise<string | null> {
  try {
    // For text files, extract the content directly
    if (fileType === 'text') {
      // Get the base64 part
      const base64Content = dataUri.split(',')[1];
      // Decode to text
      return atob(base64Content);
    }
    
    // For other file types, we would need specialized libraries
    // This is a placeholder that would be replaced with actual implementations
    console.warn(`Text extraction for ${fileType} files not fully implemented. Using placeholder extraction.`);
    
    // Return the summary as a fallback if available (e.g., from AI processing)
    return `This is a ${fileType} document. Full text extraction would require specialized libraries.`;
    
  } catch (error) {
    console.error('Failed to extract text from document:', error);
    return null;
  }
}

/**
 * Creates a simple term frequency vector from text content
 * 
 * @param text The document text content
 * @returns A record mapping terms to their frequencies
 */
export function createTermFrequencyVector(text: string): Record<string, number> {
  const terms: Record<string, number> = {};
  
  // Normalize text: lowercase and remove special characters
  const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
  
  // Split into words
  const words = normalizedText.split(/\s+/).filter(word => 
    word.length > 1 && !STOPWORDS.has(word)
  );
  
  // Count frequencies
  for (const word of words) {
    terms[word] = (terms[word] || 0) + 1;
  }
  
  return terms;
}

/**
 * Get document vectors from storage
 * Prefers IndexedDB but falls back to localStorage if needed
 */
export async function getDocumentVectorsAsync(): Promise<DocumentVectorStorage> {
  if (shouldUseIndexedDB()) {
    try {
      // Get vectors from IndexedDB
      const vectors = await IndexedDB.getAllItems<DocumentVector>(IndexedDB.STORES.DOCUMENT_VECTORS);
      
      return {
        version: 1,
        vectors: vectors
      };
    } catch (error) {
      console.error('Failed to get document vectors from IndexedDB:', error);
      // Fall back to localStorage
      return getDocumentVectors();
    }
  } else {
    // Use localStorage directly
    return getDocumentVectors();
  }
}

/**
 * Get document vectors from localStorage
 * Synchronous version for backward compatibility
 */
export function getDocumentVectors(): DocumentVectorStorage {
  try {
    const storedData = localStorage.getItem(STORAGE_KEYS.DOCUMENT_VECTORS);
    if (!storedData) {
      return { version: 1, vectors: [] };
    }
    
    return JSON.parse(storedData) as DocumentVectorStorage;
  } catch (error) {
    console.error('Failed to retrieve document vectors from localStorage:', error);
    return { version: 1, vectors: [] };
  }
}

/**
 * Save document vectors to storage
 * Uses both IndexedDB and localStorage for redundancy
 */
export async function setDocumentVectorsAsync(vectorStorage: DocumentVectorStorage): Promise<void> {
  // Save to localStorage for immediate access and as a fallback
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_VECTORS, JSON.stringify(vectorStorage));
  } catch (error) {
    console.error('Failed to save document vectors to localStorage:', error);
  }
  
  // Also save to IndexedDB if available
  if (shouldUseIndexedDB()) {
    try {
      // Clear existing vectors
      await IndexedDB.clearStore(IndexedDB.STORES.DOCUMENT_VECTORS);
      
      // Add all vectors in a batch
      const db = await IndexedDB.getDatabase();
      const transaction = db.transaction(IndexedDB.STORES.DOCUMENT_VECTORS, 'readwrite');
      const store = transaction.objectStore(IndexedDB.STORES.DOCUMENT_VECTORS);
      
      for (const vector of vectorStorage.vectors) {
        store.put(vector);
      }
      
      // Wait for transaction to complete
      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (error) {
      console.error('Failed to save document vectors to IndexedDB:', error);
    }
  }
  
  // Notify components about the update
  dispatchStorageEvent(STORAGE_KEYS.DOCUMENT_VECTORS);
}

/**
 * Save document vectors to storage
 * Synchronous version that triggers async save for IndexedDB
 */
export function setDocumentVectors(vectorStorage: DocumentVectorStorage): void {
  // Save to localStorage immediately
  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_VECTORS, JSON.stringify(vectorStorage));
    dispatchStorageEvent(STORAGE_KEYS.DOCUMENT_VECTORS);
  } catch (error) {
    console.error('Failed to save document vectors to localStorage:', error);
  }
  
  // Also save to IndexedDB asynchronously
  if (shouldUseIndexedDB()) {
    setDocumentVectorsAsync(vectorStorage).catch(error => {
      console.error('Failed to save document vectors to IndexedDB:', error);
    });
  }
}

/**
 * Process a document to extract text and create vectors
 * 
 * @param document The document to process
 * @returns True if processing was successful
 */
export async function processDocumentForSearch(document: Document): Promise<boolean> {
  if (!document.dataUri) {
    console.warn(`Document ${document.id} has no dataUri, skipping vectorization`);
    return false;
  }
  
  // Extract text content
  const textContent = await extractTextFromDataUri(document.dataUri, document.type);
  if (!textContent) {
    console.error(`Failed to extract text from document ${document.id}`);
    return false;
  }
  
  // Create term frequency vector
  const terms = createTermFrequencyVector(textContent);
  
  // Create document vector
  const documentVector: DocumentVector = {
    documentId: document.id,
    backendId: document.backendId,
    terms,
    name: document.name,
    type: document.type,
    summary: document.summary,
    timestamp: Date.now()
  };
  
  // Store document in IndexedDB if available
  if (shouldUseIndexedDB()) {
    try {
      // Store the full document (including binary data) in the DOCUMENTS store
      await IndexedDB.putItem(IndexedDB.STORES.DOCUMENTS, {
        ...document,
        vectorized: true,
        vectorizedAt: Date.now()
      });
      
      // Store the vector separately
      await IndexedDB.putItem(IndexedDB.STORES.DOCUMENT_VECTORS, documentVector);
      
      // No need to update vectorStorage in this case as we're using individual stores
    } catch (error) {
      console.error('Failed to store document in IndexedDB:', error);
      // Fall back to localStorage
      storeDocumentVectorInLocalStorage(documentVector);
    }
  } else {
    // Fall back to localStorage
    storeDocumentVectorInLocalStorage(documentVector);
  }
  
  return true;
}

/**
 * Helper function to store a document vector in localStorage
 */
function storeDocumentVectorInLocalStorage(documentVector: DocumentVector): void {
  // Get existing vectors
  const vectorStorage = getDocumentVectors();
  
  // Remove any existing vectors for this document
  vectorStorage.vectors = vectorStorage.vectors.filter(v => 
    v.documentId !== documentVector.documentId && 
    (!documentVector.backendId || v.backendId !== documentVector.backendId)
  );
  
  // Add the new vector
  vectorStorage.vectors.push(documentVector);
  
  // Save to localStorage
  setDocumentVectors(vectorStorage);
}

/**
 * Search for documents matching a query
 * 
 * @param query Search query
 * @param limit Maximum number of results (default: 5)
 * @returns Array of matching document IDs with scores
 */
export async function searchDocumentsAsync(query: string, limit: number = 5): Promise<Array<{id: string, score: number}>> {
  // Get document vectors
  const vectorStorage = await getDocumentVectorsAsync();
  
  if (!vectorStorage.vectors || vectorStorage.vectors.length === 0) {
    return [];
  }
  
  return performDocumentSearch(query, vectorStorage.vectors, limit);
}

/**
 * Search for documents matching a query (synchronous version)
 */
export function searchDocuments(query: string, limit: number = 5): Array<{id: string, score: number}> {
  // Get document vectors from localStorage
  const { vectors } = getDocumentVectors();
  
  if (vectors.length === 0) return [];
  
  return performDocumentSearch(query, vectors, limit);
}

/**
 * Core search algorithm implementation
 */
function performDocumentSearch(
  query: string, 
  vectors: DocumentVector[], 
  limit: number
): Array<{id: string, score: number}> {
  // Normalize query and create query terms
  const normalizedQuery = query.toLowerCase().replace(/[^\w\s]/g, ' ');
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => 
    term.length > 1 && !STOPWORDS.has(term)
  );
  
  if (queryTerms.length === 0) return [];
  
  // Score each document
  const results = vectors.map(vector => {
    let score = 0;
    
    // For each query term, add its frequency in the document to the score
    for (const term of queryTerms) {
      if (vector.terms[term]) {
        score += vector.terms[term];
      }
      
      // Boost score for partial matches (prefix matching)
      for (const docTerm in vector.terms) {
        if (docTerm.startsWith(term)) {
          score += vector.terms[docTerm] * 0.5; // Half weight for prefix matches
        }
      }
    }
    
    // Adjust score by recency (newer documents score higher)
    const ageInDays = (Date.now() - vector.timestamp) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - (ageInDays / 30)); // Boost decreases over 30 days
    
    score = score * (1 + recencyBoost * 0.2); // 20% max boost for recency
    
    return {
      id: vector.documentId,
      score
    };
  });
  
  // Sort by score and limit results
  return results
    .filter(result => result.score > 0)  // Only include results with positive scores
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get a list of all vectorized documents (async version)
 */
export async function getVectorizedDocumentsAsync(): Promise<Array<{
  id: string,
  backendId?: string,
  name: string,
  type: Document['type'],
  summary?: string,
  timestamp: number
}>> {
  if (shouldUseIndexedDB()) {
    try {
      const vectors = await IndexedDB.getAllItems<DocumentVector>(IndexedDB.STORES.DOCUMENT_VECTORS);
      
      return vectors.map(v => ({
        id: v.documentId,
        backendId: v.backendId,
        name: v.name,
        type: v.type,
        summary: v.summary,
        timestamp: v.timestamp
      }));
    } catch (error) {
      console.error('Failed to get vectorized documents from IndexedDB:', error);
      // Fall back to localStorage
      return getVectorizedDocuments();
    }
  } else {
    // Use localStorage directly
    return getVectorizedDocuments();
  }
}

/**
 * Get a list of all vectorized documents
 * Synchronous version for backward compatibility
 */
export function getVectorizedDocuments(): Array<{
  id: string,
  backendId?: string,
  name: string,
  type: Document['type'],
  summary?: string,
  timestamp: number
}> {
  const { vectors } = getDocumentVectors();
  
  return vectors.map(v => ({
    id: v.documentId,
    backendId: v.backendId,
    name: v.name,
    type: v.type,
    summary: v.summary,
    timestamp: v.timestamp
  }));
}

/**
 * Extract all documents from conversations for searching
 * 
 * This can be used to rebuild the document vector storage from conversations
 * if needed (e.g., after clearing localStorage or on app initialization)
 * 
 * @param messages All messages containing document attachments
 * @returns Promise that resolves when processing is complete
 */
export async function extractAndProcessDocumentsFromMessages(messages: Message[]): Promise<void> {
  // Get all document attachments from messages
  const documents: Document[] = [];
  
  messages.forEach(message => {
    if (message.attachments?.length) {
      message.attachments.forEach(doc => {
        if (doc.status === 'completed' && doc.dataUri) {
          documents.push(doc);
        }
      });
    }
  });
  
  // Process each document
  const processPromises = documents.map(doc => processDocumentForSearch(doc));
  
  // Wait for all to complete
  await Promise.all(processPromises);
}

/**
 * Delete a document from vector storage (async version)
 */
export async function deleteDocumentVectorAsync(documentId: string): Promise<void> {
  if (shouldUseIndexedDB()) {
    try {
      // Delete from document store
      await IndexedDB.deleteItem(IndexedDB.STORES.DOCUMENTS, documentId);
      
      // Delete from vector store
      await IndexedDB.deleteItem(IndexedDB.STORES.DOCUMENT_VECTORS, documentId);
    } catch (error) {
      console.error('Failed to delete document from IndexedDB:', error);
      
      // Fall back to localStorage
      deleteDocumentVectorFromLocalStorage(documentId);
    }
  } else {
    // Use localStorage directly
    deleteDocumentVectorFromLocalStorage(documentId);
  }
}

/**
 * Delete a document from vector storage
 * Synchronous version that triggers async delete for IndexedDB
 */
export function deleteDocumentVector(documentId: string): void {
  // Delete from localStorage directly
  deleteDocumentVectorFromLocalStorage(documentId);
  
  // Also delete from IndexedDB asynchronously
  if (shouldUseIndexedDB()) {
    deleteDocumentVectorAsync(documentId).catch(error => {
      console.error('Failed to delete document from IndexedDB:', error);
    });
  }
}

/**
 * Helper function to delete a document vector from localStorage
 */
function deleteDocumentVectorFromLocalStorage(documentId: string): void {
  const vectorStorage = getDocumentVectors();
  
  vectorStorage.vectors = vectorStorage.vectors.filter(v => v.documentId !== documentId);
  
  localStorage.setItem(STORAGE_KEYS.DOCUMENT_VECTORS, JSON.stringify(vectorStorage));
  dispatchStorageEvent(STORAGE_KEYS.DOCUMENT_VECTORS);
} 