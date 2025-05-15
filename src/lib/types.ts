
export interface Message {
  id: string;
  conversationId: string;
  content: string;
  sender: 'user' | 'ai' | 'system';
  timestamp: number;
  type?: 'text' | 'document_summary' | 'product_card' | 'error' | 'document_upload_status';
  processing?: boolean; // For AI responses
  attachments?: Document[];
  data?: {
    // For document_upload_status
    fileName?: string;
    documentType?: Document['type'];
    progress?: number; // 0-100
    status?: Document['status'];
    summary?: string;
    error?: string;
    // For product_card (can be an array or single object)
    products?: Product[] | Product; 
    // For other data types as needed
    [key: string]: any;
  };
  feedback?: 'liked' | 'disliked';
  originalContent?: string; // For edited messages
}

export type ConversationType = 'ai' | 'document' | 'product' | 'mixed';

export interface Conversation {
  id:string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  // Optional: could be computed on the fly or stored if performance becomes an issue
  type?: ConversationType; 
}

export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  imageUrl?: string;
  specifications: Record<string, string | string[]>; // Allow string arrays for specs
  availability: 'In Stock' | 'Out of Stock' | 'Low Stock' | 'Varies by configuration';
  price?: string;
}

export interface Document {
  id: string; // Client-side generated ID
  backendId?: string; // ID from your backend after successful upload
  fileUrl?: string; // URL if stored in a CDN/backend
  name: string;
  type: 'pdf' | 'excel' | 'word' | 'powerpoint' | 'text';
  uploadedAt: number;
  size: number; // in bytes
  // Status reflects the entire lifecycle:
  // pending_upload: File selected, not yet sent to backend
  // uploading_to_backend: File is being sent to your backend
  // pending_ai_processing: Backend upload complete, awaiting AI summarization/vectorization
  // ai_processing: AI is working on the document
  // completed: All steps finished, document ready
  // failed: Any step failed
  status: 'pending_upload' | 'uploading_to_backend' | 'pending_ai_processing' | 'ai_processing' | 'completed' | 'failed';
  progress: number; // Overall progress (0-100), can be mapped from different stages
  summary?: string;
  dataUri?: string; // For client-side operations like sending to summarizeDocument flow for now
  error?: string; // Store error message if any step fails
}

export interface TranslationEntry {
  id: string;
  inputText: string;
  outputText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}

// For Welcome Dialog Charts
export interface ChartNode {
  id: string;
  label: string;
  children?: ChartNode[];
}

export interface FlowStep {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}
