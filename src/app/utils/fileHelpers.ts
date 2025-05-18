// chat/utils/fileHelpers.ts
/**
 * File handling utilities
 * Manages file type detection, thumbnail generation, and file operations
 */

import { Document } from '@/lib/types';
import { ALLOWED_FILE_TYPES, FILE_THUMBNAIL_CONFIG } from './constants';
import { formatFileSize } from './messageFormatters';

/**
 * Detects document type from MIME type or file extension
 * @param mimeType - MIME type of the file
 * @param fileName - Name of the file
 * @returns Document type or undefined if not supported
 */
export const getDocumentTypeFromMime = (
  mimeType: string, 
  fileName: string
): Document['type'] | undefined => {
  // First check MIME type mapping
  if (ALLOWED_FILE_TYPES[mimeType]) {
    return ALLOWED_FILE_TYPES[mimeType] as Document['type'];
  }
  
  // Fallback to extension-based detection
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (extension) {
    // Document types
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['ppt', 'pptx'].includes(extension)) return 'powerpoint';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    if (extension === 'pdf') return 'pdf';
    if (extension === 'txt') return 'text';   
  }
  
  return undefined;
};

/**
 * Generates thumbnail for image files
 * @param file - File object to generate thumbnail from
 * @param maxWidth - Maximum width of thumbnail
 * @param maxHeight - Maximum height of thumbnail
 * @returns Promise resolving to thumbnail data URL
 */
export const generateImageThumbnail = async (
  file: File,
  maxWidth: number = FILE_THUMBNAIL_CONFIG.maxWidth,
  maxHeight: number = FILE_THUMBNAIL_CONFIG.maxHeight
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(dataUrl);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Generates thumbnail for PDF files (first page)
 * @param file - PDF file to generate thumbnail from
 * @returns Promise resolving to thumbnail data URL
 */
export const generatePdfThumbnail = async (file: File): Promise<string> => {
  // This would require a PDF.js implementation
  // For now, return a placeholder SVG that represents a PDF icon
  return new Promise((resolve) => {
    // PDF icon placeholder
    const pdfIcon = `
      <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="#F3F4F6"/>
        <rect x="50" y="30" width="100" height="140" rx="8" fill="#DC2626"/>
        <path d="M75 60H125M75 80H125M75 100H125M75 120H110" stroke="white" stroke-width="4" stroke-linecap="round"/>
        <text x="100" y="150" text-anchor="middle" fill="white" font-size="20" font-weight="bold">PDF</text>
      </svg>
    `;
    const base64 = btoa(pdfIcon);
    resolve(`data:image/svg+xml;base64,${base64}`);
  });
};

/**
 * Generates thumbnail for video files (first frame)
 * @param file - Video file to generate thumbnail from
 * @returns Promise resolving to thumbnail data URL
 */
export const generateVideoThumbnail = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    
    video.onloadedmetadata = () => {
      // Set canvas dimensions to video dimensions
      canvas.width = FILE_THUMBNAIL_CONFIG.maxWidth;
      canvas.height = FILE_THUMBNAIL_CONFIG.maxHeight;
      
      // Seek to 1 second to avoid black frames
      video.currentTime = 1;
    };
    
    video.onseeked = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw the video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(dataUrl);
      
      // Clean up
      URL.revokeObjectURL(video.src);
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video'));
      URL.revokeObjectURL(video.src);
    };
    
    // Load video from file
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Generates thumbnail for any supported file type
 * @param file - File to generate thumbnail from
 * @returns Promise resolving to thumbnail data URL or null if not supported
 */
export const generateFileThumbnail = async (file: File): Promise<string | null> => {
  try {
    if (file.type.startsWith('image/')) {
      return await generateImageThumbnail(file);
    } else if (file.type === 'application/pdf') {
      return await generatePdfThumbnail(file);
    } else if (file.type.startsWith('video/')) {
      return await generateVideoThumbnail(file);
    }
    
    // Return null for unsupported types
    return null;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return null;
  }
};

/**
 * Checks if a file type supports thumbnail generation
 * @param mimeType - MIME type to check
 * @returns Whether thumbnails are supported
 */
export const supportsThumbnail = (mimeType: string): boolean => {
  return FILE_THUMBNAIL_CONFIG.supportedTypes.includes(mimeType);
};

/**
 * Validates if a file is within size limits
 * @param file - File to validate
 * @param maxSizeBytes - Maximum size in bytes
 * @returns Whether file is valid and any error message
 */
export const validateFileSize = (
  file: File, 
  maxSizeBytes: number
): { valid: boolean; error?: string } => {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = Math.round(maxSizeBytes / (1024 * 1024));
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    };
  }
  return { valid: true };
};

/**
 * Validates if a file type is allowed
 * @param file - File to validate
 * @param allowedTypes - Map of allowed MIME types
 * @returns Whether file type is valid and any error message
 */
export const validateFileType = (
  file: File,
  allowedTypes: Record<string, any>
): { valid: boolean; error?: string } => {
  const fileType = getDocumentTypeFromMime(file.type, file.name);
  
  if (!fileType) {
    return {
      valid: false,
      error: `File type ${file.type} is not supported`
    };
  }
  
  return { valid: true };
};

/**
 * Creates a file from base64 data
 * @param base64 - Base64 encoded file data
 * @param filename - Name for the file
 * @param mimeType - MIME type of the file
 * @returns File object
 */
export const base64ToFile = (
  base64: string, 
  filename: string, 
  mimeType: string
): File => {
  // Remove data URL prefix if present
  const base64Data = base64.split(',')[1] || base64;
  
  // Convert base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  // Create file
  return new File([bytes], filename, { type: mimeType });
};

/**
 * Formats file metadata for display
 * @param file - File object
 * @returns Formatted metadata object
 */
export const getFileMetadata = (file: File) => {
  return {
    name: file.name,
    size: formatFileSize(file.size),
    type: file.type,
    extension: file.name.split('.').pop()?.toLowerCase() || '',
    lastModified: new Date(file.lastModified),
  };
};

/**
 * Checks if drag and drop is supported in the browser
 * @returns Whether drag and drop is available
 */
export const isDragDropSupported = (): boolean => {
  const div = document.createElement('div');
  return (
    'draggable' in div || 
    ('ondragstart' in div && 'ondrop' in div)
  ) && 
  'FormData' in window && 
  'FileReader' in window;
};

/**
 * Reads file content as text
 * @param file - File to read
 * @returns Promise resolving to file content
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};