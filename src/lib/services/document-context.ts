/**
 * Document Context Service
 * 
 * This service provides utility functions for preparing document context
 * for AI interactions. It helps detect document references, extract relevant
 * content for AI processing, and maintain context across conversations.
 */

import { Document, Message, Conversation } from '@/lib/types';
import * as DocumentService from './document-service';

/**
 * Maximum character length to extract from a document for context
 * Keeping this relatively small to avoid token limits
 */
const MAX_CONTENT_LENGTH = 15000;

/**
 * Interface for document reference in AI context
 */
export interface DocumentReference {
  id: string;
  name: string;
  type: Document['type'];
  summary?: string;
  content?: string;
  relevantSections?: Array<{
    heading?: string;
    content: string;
    relevanceScore: number;
  }>;
  recentlyDiscussed?: boolean;
}

/**
 * Prepare document references for the AI based on conversation context
 * 
 * @param conversation Current conversation
 * @param query User's current query
 * @param maxDocuments Maximum number of documents to include (default: 3)
 * @returns Array of document references with metadata and relevant content
 */
export async function prepareDocumentContext(
  conversation: Conversation,
  query: string,
  maxDocuments: number = 3
): Promise<DocumentReference[]> {
  // Extract mentioned document IDs from conversation
  const mentionedDocIds = extractDocumentReferences(conversation, query);
  
  if (mentionedDocIds.length === 0) {
    return [];
  }
  
  // Limit to the most relevant documents
  const limitedDocIds = mentionedDocIds.slice(0, maxDocuments);
  
  // Prepare full document references
  return Promise.all(
    limitedDocIds.map(async docId => {
      const docWithContext = DocumentService.findDocumentById(docId);
      if (!docWithContext) {
        return null;
      }
      
      const { document } = docWithContext;
      
      // Prepare base reference
      const reference: DocumentReference = {
        id: document.backendId || document.id,
        name: document.name,
        type: document.type,
        summary: document.summary,
        recentlyDiscussed: isRecentlyDiscussed(conversation, docId)
      };
      
      // Extract content if available
      try {
        const content = await DocumentService.getDocumentTextContent(document);
        if (content) {
          // Limit content length
          reference.content = content.slice(0, MAX_CONTENT_LENGTH);
          
          // If query is specific, try to extract relevant sections
          if (query.length > 10 && reference.content.length > 1000) {
            reference.relevantSections = extractRelevantSections(reference.content, query);
          }
        }
      } catch (error) {
        console.error(`Error extracting content for document ${docId}:`, error);
      }
      
      return reference;
    })
  ).then(refs => refs.filter((ref): ref is DocumentReference => ref !== null));
}

/**
 * Extract document references from conversation and query
 * 
 * @param conversation The current conversation
 * @param query The user's query
 * @returns Array of document IDs, ordered by relevance
 */
export function extractDocumentReferences(
  conversation: Conversation, 
  query: string
): string[] {
  const documentIds = new Set<string>();
  const recentMessageCount = 5; // Consider only the N most recent messages
  
  // First, check for explicit document mentions in the query
  const explicitMentions = extractExplicitDocumentMentions(conversation, query);
  explicitMentions.forEach(id => documentIds.add(id));
  
  // Check recent messages for document references
  const recentMessages = conversation.messages
    .slice(-recentMessageCount);
  
  recentMessages.forEach(message => {
    // Check for discussedDocumentId in message data
    if (message.data?.discussedDocumentId) {
      documentIds.add(message.data.discussedDocumentId);
    }
    
    // Check for document attachments
    if (message.attachments?.length) {
      message.attachments.forEach(doc => {
        if (doc.status === 'completed') {
          documentIds.add(doc.backendId || doc.id);
        }
      });
    }
    
    // Check for referenced document IDs in message data
    if (message.data?.referencedDocumentIds && Array.isArray(message.data.referencedDocumentIds)) {
      message.data.referencedDocumentIds.forEach(id => documentIds.add(id));
    }
  });
  
  // If no documents found and the query seems to be about documents, check all messages
  if (documentIds.size === 0 && querySeemsToBeSeeking(query)) {
    conversation.messages.forEach(message => {
      if (message.attachments?.length) {
        message.attachments.forEach(doc => {
          if (doc.status === 'completed') {
            documentIds.add(doc.backendId || doc.id);
          }
        });
      }
    });
  }
  
  return Array.from(documentIds);
}

/**
 * Extract explicit document mentions from user query
 * 
 * @param conversation Current conversation
 * @param query User's query
 * @returns Array of document IDs mentioned explicitly
 */
function extractExplicitDocumentMentions(
  conversation: Conversation,
  query: string
): string[] {
  const documentIds: string[] = [];
  const queryLower = query.toLowerCase();
  
  // Get all documents in the conversation
  const allDocuments = conversation.messages
    .flatMap(msg => msg.attachments || [])
    .filter(doc => doc.status === 'completed');
  
  // Check for document name mentions
  allDocuments.forEach(doc => {
    if (queryLower.includes(doc.name.toLowerCase())) {
      documentIds.push(doc.backendId || doc.id);
    }
  });
  
  return documentIds;
}

/**
 * Check if a specific document was recently discussed
 * 
 * @param conversation Current conversation
 * @param documentId Document ID to check
 * @param messageLimit Number of recent messages to check
 * @returns True if the document was recently discussed
 */
function isRecentlyDiscussed(
  conversation: Conversation,
  documentId: string,
  messageLimit: number = 5
): boolean {
  const recentMessages = conversation.messages
    .slice(-messageLimit);
  
  return recentMessages.some(msg => 
    msg.data?.discussedDocumentId === documentId || 
    msg.data?.referencedDocumentIds?.includes(documentId)
  );
}

/**
 * Check if a query is seeking information about documents
 * 
 * @param query The user's query
 * @returns True if the query seems to be seeking document information
 */
function querySeemsToBeSeeking(query: string): boolean {
  const seekingPhrases = [
    'document', 'file', 'pdf', 'report', 'spreadsheet', 'excel',
    'attachment', 'uploaded', 'summary', 'content'
  ];
  
  const queryLower = query.toLowerCase();
  
  return seekingPhrases.some(phrase => queryLower.includes(phrase));
}

/**
 * Extract sections from document content that are most relevant to the query
 * 
 * @param content Full document content
 * @param query User query
 * @param maxSections Maximum number of sections to extract
 * @returns Array of relevant sections with relevance scores
 */
function extractRelevantSections(
  content: string,
  query: string,
  maxSections: number = 3
): Array<{heading?: string; content: string; relevanceScore: number}> {
  // Simple implementation - split by paragraphs and score each
  const paragraphs = content.split(/\n\n+/);
  
  // Score paragraphs based on term overlap with query
  const scoredParagraphs = paragraphs
    .map((paragraph, index) => {
      // Skip very short paragraphs
      if (paragraph.length < 20) return null;
      
      // Calculate relevance score based on term overlap
      const queryTerms = query.toLowerCase().split(/\s+/);
      const paragraphLower = paragraph.toLowerCase();
      
      let score = 0;
      queryTerms.forEach(term => {
        if (term.length < 3) return; // Skip very short terms
        if (paragraphLower.includes(term)) {
          // Add score based on term frequency
          const regex = new RegExp(term, 'gi');
          const matches = paragraphLower.match(regex);
          score += matches ? matches.length : 0;
        }
      });
      
      // Boost score for paragraphs with potential headings
      const prevParagraph = index > 0 ? paragraphs[index - 1] : '';
      const hasPotentialHeading = prevParagraph.length < 100 && /^[A-Z0-9]/.test(prevParagraph);
      
      if (hasPotentialHeading) {
        score *= 1.2;
      }
      
      return {
        heading: hasPotentialHeading ? prevParagraph : undefined,
        content: paragraph,
        relevanceScore: score
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
  
  // Sort by relevance score and limit
  return scoredParagraphs
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxSections);
}

/**
 * Prepare a comprehensive document context object for a specific document
 * 
 * @param documentId ID of the document to analyze
 * @param query User query to guide content extraction
 * @returns Document reference with relevant content
 */
export async function prepareDocumentDetail(
  documentId: string,
  query: string
): Promise<DocumentReference | null> {
  const docWithContext = DocumentService.findDocumentById(documentId);
  if (!docWithContext) return null;
  
  const { document } = docWithContext;
  
  // Prepare the reference object
  const reference: DocumentReference = {
    id: document.backendId || document.id,
    name: document.name,
    type: document.type,
    summary: document.summary
  };
  
  // Extract content
  try {
    const content = await DocumentService.getDocumentTextContent(document);
    if (content) {
      // Extract most relevant sections based on query
      if (query && query.length > 5) {
        reference.relevantSections = extractRelevantSections(
          content,
          query,
          5 // Get more sections for detailed analysis
        );
      }
      
      // Include limited full content
      reference.content = content.slice(0, MAX_CONTENT_LENGTH);
    }
  } catch (error) {
    console.error(`Error preparing document detail for ${documentId}:`, error);
  }
  
  return reference;
} 