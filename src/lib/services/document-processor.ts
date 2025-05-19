/**
 * Document Processor Service
 * 
 * This service handles the complete lifecycle of document processing:
 * 1. Backend upload (or simulation in local-only mode)
 * 2. AI processing and summarization
 * 3. Text extraction and vectorization
 * 4. Status updates throughout the process
 * 
 * It provides a clean interface for the UI components to process documents
 * while abstracting the complexity of the various processing stages.
 */

import { Document, Message } from '@/lib/types';
import { processDocumentForSearch } from '@/lib/storage/documents';
import { summarizeDocument } from '@/ai/flows/summarize-document';

// Interface for processor options
interface ProcessorOptions {
  // Callback for progress updates
  onProgress: (status: Document['status'], progress: number) => void;
  // Callback when processing is complete
  onComplete: (document: Document) => void;
  // Callback for errors
  onError: (error: string) => void;
}

// Interface for file upload result from backend
interface FileUploadResult {
  success: boolean;
  backendId?: string;
  fileUrl?: string;
  error?: string;
}

/**
 * Simulate a backend file upload
 * 
 * In a real application, this would be replaced with API calls to your backend.
 * 
 * @param file The file to upload
 * @param onProgress Progress callback
 * @returns Upload result
 */
async function simulateBackendUpload(
  file: File,
  onProgress: (progress: number) => void
): Promise<FileUploadResult> {
  console.warn("Using simulated backend upload. In production, implement actual API calls.");
  
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

  // Simulate network delay and processing
  return new Promise((resolve) => {
    setTimeout(() => {
      clearInterval(interval);
      onProgress(100);
      
      // Simulate failure if filename contains "fail"
      if (file.name.toLowerCase().includes("fail")) {
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
}

/**
 * Process a document through all stages
 * 
 * @param document The initial document object
 * @param file The file to process
 * @param options Processing options with callbacks
 */
export async function processDocument(
  document: Document,
  file: File,
  options: ProcessorOptions
): Promise<void> {
  try {
    // STAGE 1: Upload to backend
    options.onProgress('uploading_to_backend', 0);
    
    const backendResult = await simulateBackendUpload(file, (progress) => {
      options.onProgress('uploading_to_backend', progress);
    });

    if (!backendResult.success || !backendResult.backendId) {
      throw new Error(backendResult.error || "Backend upload failed.");
    }
    
    // Update document with backend information
    const backendDocument: Partial<Document> = { 
      backendId: backendResult.backendId, 
      fileUrl: backendResult.fileUrl, 
      status: 'pending_ai_processing', 
      progress: 50 
    };
    
    options.onProgress('pending_ai_processing', 50);
    
    // STAGE 2: Extract text content
    options.onProgress('ai_processing', 60);
    
    // Read file data as DataURI for local processing
    const dataUri = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file for AI processing"));
    });
    
    options.onProgress('ai_processing', 70);
    
    // Update document with dataURI
    const documentWithData = { 
      ...document, 
      ...backendDocument, 
      dataUri, 
      status: 'ai_processing' as Document['status'],
      progress: 70
    };
    
    // STAGE 3: AI Processing (summarization)
    try {
      options.onProgress('ai_processing', 80);
      
      const summaryResponse = await summarizeDocument({ 
        documentDataUri: dataUri 
      });
      
      // STAGE 4: Vectorization for search
      options.onProgress('ai_processing', 90);
      
      const finalDocument: Document = { 
        ...documentWithData, 
        summary: summaryResponse.summary, 
        status: 'completed', 
        progress: 100 
      };
      
      // Process document for local search
      await processDocumentForSearch(finalDocument);
      
      // Complete
      options.onProgress('completed', 100);
      options.onComplete(finalDocument);
      
    } catch (aiError) {
      console.error("AI processing error:", aiError);
      
      // Even with AI failure, we still have the document
      const errorDocument: Document = { 
        ...documentWithData, 
        status: 'failed', 
        progress: 100, 
        error: "AI processing failed." 
      };
      
      options.onError("AI processing failed.");
    }
    
  } catch (error: any) {
    console.error("Document processing error:", error);
    options.onError(error.message || "An unknown error occurred during document processing.");
  }
}

/**
 * Create AI-generated summary for a document
 * Fallback to processing the document text directly if no AI service is available
 * 
 * @param document The document to summarize
 * @returns Promise with the updated document
 */
export async function createDocumentSummary(document: Document): Promise<Document> {
  if (!document.dataUri) {
    throw new Error("Document has no data URI for summarization");
  }
  
  try {
    // Try to use AI summarization service
    const summaryResponse = await summarizeDocument({ 
      documentDataUri: document.dataUri 
    });
    
    return {
      ...document,
      summary: summaryResponse.summary
    };
    
  } catch (error) {
    console.error("AI summarization failed, using fallback approach:", error);
    
    // Fallback: Extract a simple summary from text
    // This would be a simple approach when AI summarization isn't available
    const extractSimpleSummary = (text: string): string => {
      // Get first ~500 characters as preview
      const preview = text.substring(0, 500);
      // Remove extra whitespace
      const cleaned = preview.replace(/\s+/g, ' ').trim();
      // Add ellipsis if truncated
      return cleaned + (text.length > 500 ? '...' : '');
    };
    
    // Try to read first 500 chars directly from dataUri (for text files)
    if (document.type === 'text') {
      try {
        const base64Content = document.dataUri.split(',')[1];
        const textContent = atob(base64Content);
        const simpleSummary = extractSimpleSummary(textContent);
        
        return {
          ...document,
          summary: `Document Preview: ${simpleSummary}`
        };
      } catch (e) {
        console.error("Failed to extract text from dataUri:", e);
      }
    }
    
    // Last resort fallback
    return {
      ...document,
      summary: `${document.type.toUpperCase()} document: ${document.name} (${(document.size / 1024).toFixed(1)} KB)`
    };
  }
} 