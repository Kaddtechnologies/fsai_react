// Additional type definitions for the translation page

import { TranslationJob, TranslatedFileArtifact, UploadedFile } from "@/lib/types";

export interface UserFeedbackEntry {
    id: string;
    sourceLanguage: string;
    targetLanguage: string;
    isBulk: boolean;
    createdAt: number;
    
    // For single keyword feedback
    sourceKeyword?: string;
    targetKeyword?: string;
    
    // For bulk file feedback
    fileName?: string;
  }
  
  // You may also need to add these properties to the existing TranslationJob interface
  // if they're not already defined:
  export interface TranslationJobExtended extends TranslationJob {
    // Add any missing properties that might be referenced in the code
    errorMessage?: string;
    inputText?: string;
    outputTextByLanguage?: Record<string, string>;
    translatedFilesByLanguage?: Record<string, TranslatedFileArtifact[]>;
    sourceFiles?: UploadedFile[];
  }