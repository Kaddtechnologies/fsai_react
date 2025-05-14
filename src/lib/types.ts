
export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: number;
  type?: 'text' | 'document_summary' | 'product_card' | 'error' | 'document_upload_status';
  processing?: boolean; // For AI responses or document processing
  attachments?: Document[]; // For user messages with uploads
  data?: any; // For rich content like product cards or document summaries
  feedback?: 'liked' | 'disliked';
  originalContent?: string; // For edited messages
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  imageUrl?: string;
  specifications: Record<string, string>;
  availability: 'In Stock' | 'Out of Stock' | 'Low Stock';
  price?: string; // Optional price
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'excel' | 'image' | 'text'; // Mime type or simplified type
  uploadedAt: number;
  size: number; // in bytes
  processingStatus?: 'uploading' | 'processing' | 'completed' | 'failed';
  summary?: string; // Optional summary after processing
  searchableChunks?: any[]; // Placeholder for searchable content
  dataUri?: string; // For passing to AI flows
}

export interface TranslationEntry {
  id: string;
  inputText: string;
  outputText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

    