/**
 * Document Service
 * 
 * This service provides functionality for document operations:
 * - Searching documents
 * - Extracting document content
 * - Managing document attachments across conversations
 * 
 * It integrates with the storage system to provide a unified interface
 * for all document-related operations.
 */

import { Document, Message, Conversation } from '@/lib/types';
import * as StorageAPI from '@/lib/storage';
import { 
  searchDocuments, 
  extractTextFromDataUri,
  processDocumentForSearch,
  getVectorizedDocuments,
  extractAndProcessDocumentsFromMessages
} from '@/lib/storage/documents';

/**
 * Find all documents across all conversations
 * 
 * @returns Array of all documents with their conversation context
 */
export function getAllDocuments(): Array<{
  document: Document,
  conversationId: string,
  messageId: string
}> {
  const conversations = StorageAPI.getConversations();
  const results: Array<{
    document: Document,
    conversationId: string,
    messageId: string
  }> = [];
  
  conversations.forEach(conversation => {
    conversation.messages.forEach(message => {
      if (message.attachments?.length) {
        message.attachments.forEach(doc => {
          results.push({
            document: doc,
            conversationId: conversation.id,
            messageId: message.id
          });
        });
      }
    });
  });
  
  return results;
}

/**
 * Search for documents matching a query
 * 
 * @param query The search query
 * @param limit Maximum number of results
 * @returns Array of documents with their conversation context
 */
export async function searchForDocuments(
  query: string, 
  limit: number = 5
): Promise<Array<{
  document: Document,
  score: number,
  conversationId: string,
  messageId: string
}>> {
  // First, search the document index
  const documentMatches = searchDocuments(query, limit);
  
  if (documentMatches.length === 0) {
    return [];
  }
  
  // Get all documents with conversation context
  const allDocuments = getAllDocuments();
  
  // Map search results to full document objects with context
  return documentMatches
    .map(match => {
      const docWithContext = allDocuments.find(
        d => d.document.id === match.id || d.document.backendId === match.id
      );
      
      if (!docWithContext) return null;
      
      return {
        document: docWithContext.document,
        score: match.score,
        conversationId: docWithContext.conversationId,
        messageId: docWithContext.messageId
      };
    })
    .filter((result): result is NonNullable<typeof result> => result !== null)
    .sort((a, b) => b.score - a.score);
}

/**
 * Extract text content from a document
 * 
 * @param document The document to process
 * @returns The extracted text content or null if extraction failed
 */
export async function getDocumentTextContent(document: Document): Promise<string | null> {
  if (!document.dataUri) {
    return document.summary || null;
  }
  
  return extractTextFromDataUri(document.dataUri, document.type);
}

/**
 * Init document vector storage from all conversations
 * This rebuilds the document search index from scratch
 */
export async function initDocumentVectorStorage(): Promise<void> {
  const conversations = StorageAPI.getConversations();
  const allMessages: Message[] = [];
  
  conversations.forEach(conversation => {
    allMessages.push(...conversation.messages);
  });
  
  await extractAndProcessDocumentsFromMessages(allMessages);
}

/**
 * Get a list of all vectorized documents for UI display
 */
export function getSearchableDocuments() {
  return getVectorizedDocuments();
}

/**
 * Find a specific document by ID across all conversations
 * 
 * @param documentId The document ID to find
 * @returns The document with its conversation context or null if not found
 */
export function findDocumentById(documentId: string): {
  document: Document,
  conversationId: string,
  messageId: string
} | null {
  const allDocuments = getAllDocuments();
  return allDocuments.find(d => 
    d.document.id === documentId || 
    d.document.backendId === documentId
  ) || null;
}

/**
 * Get all conversations related to a specific document
 * 
 * @param documentId The document ID
 * @returns Array of conversations that contain the document
 */
export function getConversationsWithDocument(documentId: string): Conversation[] {
  const conversations = StorageAPI.getConversations();
  
  return conversations.filter(conversation => 
    conversation.messages.some(message => 
      message.attachments?.some(doc => 
        doc.id === documentId || doc.backendId === documentId
      ) ||
      message.data?.discussedDocumentId === documentId
    )
  );
} 