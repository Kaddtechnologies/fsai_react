// chat/constants.ts
/**
 * Constants used throughout the chat module
 * Centralizes configuration values for easy maintenance
 */

import { CodeHighlightConfig, FileThumbnailConfig, TranslationConfig } from "../types";


/**
 * File upload size limits
 */
export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Supported file types for upload
 * Maps MIME types to our internal document types
 */
export const ALLOWED_FILE_TYPES: Record<string, string> = {
  "application/msword": "word",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
  "application/vnd.ms-powerpoint": "powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "powerpoint",
  "application/vnd.ms-excel": "excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
  "application/pdf": "pdf",
  "text/plain": "text",
  // Additional types for thumbnails
  "image/jpeg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/webp": "image",
  "video/mp4": "video",
  "video/webm": "video",
};

/**
 * File extensions allowed for upload
 */
export const ALLOWED_EXTENSIONS_STRING = ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm";

/**
 * Mock user for development
 * Replace with actual user data in production
 */
export const MOCK_USER = {
  id: "user-123",
  name: "Dylan Jacobs",
  email: "dylan.jacobs@flowserve.com",
  avatarUrl: "https://randomuser.me/api/portraits/men/20.jpg", // data-ai-hint: "profile avatar"
  preferredLanguage: "en",
  preferredTranslationLanguage: "es",
};

/**
 * Timestamp format options
 */
export const TIMESTAMP_FORMATS = {
  relative: {
    // Shows "2 minutes ago", "Yesterday", etc.
    style: 'relative' as const,
    numeric: 'auto' as const,
  },
  absolute: {
    // Shows "Jan 15, 2024 3:45 PM"
    dateStyle: 'medium' as const,
    timeStyle: 'short' as const,
  },
  timeOnly: {
    // Shows "3:45 PM"
    timeStyle: 'short' as const,
  },
} as const;

/**
 * Typing indicator configuration
 */
export const TYPING_INDICATOR_CONFIG = {
  // How long to show typing indicator after last activity
  timeout: 3000,
  // Debounce delay for typing events
  debounceDelay: 500,
  // Animation frames for dots
  animationFrames: ['.', '..', '...'],
  // Animation speed in ms
  animationSpeed: 500,
};

/**
 * File thumbnail configuration
 */
export const FILE_THUMBNAIL_CONFIG: FileThumbnailConfig = {
  maxWidth: 200,
  maxHeight: 200,
  supportedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
  clientSideGeneration: true,
  // Default fallback icon imported separately
  fallbackIcon: null as any, // Will be set in component
};

/**
 * Code syntax highlighting configuration
 */
export const CODE_HIGHLIGHT_CONFIG: CodeHighlightConfig = {
  theme: 'vs-dark',
  showLineNumbers: true,
  enableCopyButton: true,
  supportedLanguages: [
    'javascript',
    'typescript',
    'python',
    'java',
    'csharp',
    'cpp',
    'go',
    'rust',
    'sql',
    'html',
    'css',
    'json',
    'yaml',
    'markdown',
    'bash',
    'powershell',
  ],
};

/**
 * Translation configuration
 */
export const TRANSLATION_CONFIG: TranslationConfig = {
  availableLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  ],
  autoDetect: true,
  apiEndpoint: '/api/translate',
  enableCache: true,
};

/**
 * Supported code languages for detection
 * Maps file extensions to language identifiers
 */
export const LANGUAGE_MAP: Record<string, string> = {
  'js': 'javascript',
  'jsx': 'javascript',
  'ts': 'typescript',
  'tsx': 'typescript',
  'py': 'python',
  'java': 'java',
  'cs': 'csharp',
  'cpp': 'cpp',
  'c': 'c',
  'h': 'c',
  'hpp': 'cpp',
  'go': 'go',
  'rs': 'rust',
  'sql': 'sql',
  'html': 'html',
  'css': 'css',
  'scss': 'scss',
  'json': 'json',
  'yaml': 'yaml',
  'yml': 'yaml',
  'md': 'markdown',
  'sh': 'bash',
  'ps1': 'powershell',
  'xml': 'xml',
  'php': 'php',
  'rb': 'ruby',
  'swift': 'swift',
  'kt': 'kotlin',
  'r': 'r',
  'dart': 'dart',
};

/**
 * PDF viewer configuration
 */
export const PDF_VIEWER_CONFIG = {
  // Initial zoom level (1 = 100%)
  defaultZoom: 1,
  // Enable text selection in PDFs
  enableTextSelection: true,
  // Show page numbers
  showPageNumbers: true,
  // Enable print button
  enablePrint: true,
  // Enable download button
  enableDownload: true,
  // Maximum file size for inline viewing (MB)
  maxInlineSize: 10,
};

/**
 * Drag and drop configuration
 */
export const DRAG_DROP_CONFIG = {
  // Accepted file types (same as upload)
  acceptedTypes: ALLOWED_EXTENSIONS_STRING,
  // Show drop zone overlay
  showDropZone: true,
  // Drop zone message
  dropZoneMessage: 'Drop files here to upload',
  // Multiple file upload
  allowMultiple: false,
  // Maximum files per drop
  maxFiles: 5,
};

/**
 * Message action delays and timeouts
 */
export const MESSAGE_TIMINGS = {
  // How long to show "Sending..." state
  sendingTimeout: 1000,
  // Copy feedback duration
  copyFeedbackDuration: 2000,
  // Edit mode timeout (auto-cancel)
  editTimeout: 300000, // 5 minutes
  // Message fade-in animation duration
  fadeInDuration: 200,
};

/**
 * Scroll behavior configuration
 */
export const SCROLL_CONFIG = {
  // Distance from bottom to show scroll button
  scrollThreshold: 200,
  // Smooth scroll duration
  smoothScrollDuration: 300,
  // Auto-scroll on new message
  autoScrollOnNewMessage: true,
  // Preserve scroll position on window resize
  preserveScrollOnResize: true,
};
