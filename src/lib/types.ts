

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
  status: 'pending_upload' | 'uploading_to_backend' | 'pending_ai_processing' | 'ai_processing' | 'completed' | 'failed';
  progress: number; // Overall progress (0-100), can be mapped from different stages
  summary?: string;
  dataUri?: string; // For client-side operations like sending to summarizeDocument flow for now
  error?: string; // Store error message if any step fails
}

export type TranslationJobType = 'text' | 'document';
export type TranslationJobStatus = 'draft' | 'in-progress' | 'complete' | 'archived' | 'failed';

export interface UploadedFile {
  id: string; // client-generated unique ID for the file instance in a job
  originalName: string;
  size: number; // bytes
  type: string; // MIME type
  progress: number; // 0-100 for upload/processing
  status: 'queued' | 'uploading' | 'processing' | 'completed' | 'failed';
  error?: string;
  dataUri?: string; // for client-side processing or preview
  convertToDocx?: boolean; // for PDF files
  fileObject?: File; // Store the actual file object temporarily for upload
}

export interface TranslatedFileArtifact {
  name: string;
  url: string; // Simulated download URL or path to translated file
  format: string; // e.g., 'pdf', 'docx'
}

export interface TranslationJob {
  id: string;
  name: string; // Job title, user-defined
  type: TranslationJobType;
  status: TranslationJobStatus;
  createdAt: number;
  updatedAt: number;

  sourceLanguage: string; // Language code (e.g., 'en', 'auto')
  targetLanguages: string[]; // Array of language codes

  // For text jobs
  inputText?: string;
  outputTextByLanguage?: Record<string, string>; // { 'es': 'Hola mundo', 'fr': 'Bonjour le monde' }

  // For document jobs
  sourceFiles?: UploadedFile[];
  translatedFilesByLanguage?: Record<string, TranslatedFileArtifact[]>; // { 'es': [file1_es, file2_es], 'fr': [file1_fr, file2_fr] }

  emailNotifications?: boolean; // User preference
  errorMessage?: string; // If the job itself failed
}

export interface Project {
  id: string;
  name: string;
  color: string;
  files: Document[];
  messages: Message[];
  createdAt: number;
  updatedAt: number;
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
