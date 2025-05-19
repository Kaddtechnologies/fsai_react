/**
 * Document Upload Hook
 * 
 * A custom React hook that handles document uploads and processing.
 * This hook integrates with the chat storage system and handles:
 * - Upload validation
 * - Document processing
 * - Local vectorization for search
 * - Status updates
 */

import { useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { Document, Message } from '@/lib/types';
import { processDocumentForSearch } from '@/lib/storage/documents';
import { summarizeDocument } from '@/ai/flows/summarize-document';

// Constants for validation
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const ALLOWED_FILE_TYPES: Record<string, Document['type']> = {
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
  "application/vnd.ms-powerpoint": "powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "powerpoint",
  "application/vnd.ms-excel": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "application/pdf": "pdf",
  "text/plain": "text",
};

export const ALLOWED_EXTENSIONS_STRING = ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt";

interface UseDocumentUploadOptions {
  onMessageUpdate: (messageId: string, documentUpdates: Partial<Document>, dataUpdates?: Partial<Message['data']>) => void;
  translateFn: (key: string, params?: Record<string, string | number>) => string;
}

interface UseDocumentUploadResult {
  handleFileUpload: (file: File, conversationId: string) => Promise<{
    uploadMessageId: string;
    initialDocument: Document;
    messageContent: string;
  }>;
  validateFile: (file: File) => { valid: boolean; error?: string };
  getDocumentTypeFromMime: (mimeType: string, fileName: string) => Document['type'] | undefined;
}

/**
 * Helper function to determine document type from MIME type or filename
 */
const getDocumentTypeFromMime = (mimeType: string, fileName: string): Document['type'] | undefined => {
  if (ALLOWED_FILE_TYPES[mimeType]) {
    return ALLOWED_FILE_TYPES[mimeType];
  }
  
  // Fallback to extension if MIME type not recognized
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension) {
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['ppt', 'pptx'].includes(extension)) return 'powerpoint';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (extension === 'pdf') return 'pdf';
    if (extension === 'txt') return 'text';
  }
  
  return undefined;
};

/**
 * Mock backend upload function - would be replaced with actual API call
 */
const uploadFileToBackend = async (
  file: File, 
  onProgress: (percentage: number) => void
): Promise<{ 
  success: boolean; 
  backendId?: string; 
  fileUrl?: string; 
  error?: string 
}> => {
  console.warn("uploadFileToBackend: This is a placeholder. Implement actual backend upload connected to your database and vectorization process.");
  
  // Simulate upload progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    if (progress <= 100) {
      onProgress(progress);
    } else {
      clearInterval(interval);
    }
  }, 200);

  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      clearInterval(interval);
      onProgress(100);
      
      // Simulate failure if filename contains "fail"
      if (file.name.includes("fail")) {
        resolve({ success: false, error: "Simulated backend upload failure." });
      } else {
        resolve({ 
          success: true, 
          backendId: `backend-${Date.now()}-${file.name}`, 
          fileUrl: `https://example.com/uploads/${file.name}` 
        });
      }
    }, 2000 + Math.random() * 1000);
  });
};

export function useDocumentUpload({ 
  onMessageUpdate, 
  translateFn 
}: UseDocumentUploadOptions): UseDocumentUploadResult {
  const { toast } = useToast();
  
  /**
   * Validate a file before upload
   */
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { 
        valid: false, 
        error: translateFn('uploads.fileTooLarge.description', { maxSize: MAX_FILE_SIZE_MB })
      };
    }
    
    // Check file type
    const docType = getDocumentTypeFromMime(file.type, file.name);
    if (!docType) {
      return { 
        valid: false, 
        error: translateFn('uploads.invalidType.description', { allowed: ALLOWED_EXTENSIONS_STRING })
      };
    }
    
    return { valid: true };
  }, [translateFn]);
  
  /**
   * Handle file upload and processing
   * This function:
   * 1. Creates an initial document upload message
   * 2. Uploads the file to the backend (mock)
   * 3. Processes the document with AI 
   * 4. Updates the message status throughout the process
   * 5. Vectorizes the document for local search
   */
  const handleFileUpload = useCallback(async (
    file: File, 
    conversationId: string
  ): Promise<{
    uploadMessageId: string;
    initialDocument: Document;
    messageContent: string;
  }> => {
    // Get document type
    const docType = getDocumentTypeFromMime(file.type, file.name) as Document['type'];
    
    // Create initial document object
    const clientDocumentId = `doc-client-${Date.now()}-${file.name}`;
    const initialDocument: Document = {
      id: clientDocumentId, 
      name: file.name, 
      type: docType, 
      uploadedAt: Date.now(),
      size: file.size, 
      status: 'pending_upload', 
      progress: 0,
    };
    
    // Create initial message
    const uploadMessageId = `msg-upload-${clientDocumentId}`;
    const messageContent = translateFn('uploads.preparing', { fileName: file.name });
    
    // Return early with initial state
    return {
      uploadMessageId,
      initialDocument,
      messageContent
    };
  }, [translateFn]);
  
  return {
    handleFileUpload,
    validateFile,
    getDocumentTypeFromMime
  };
} 