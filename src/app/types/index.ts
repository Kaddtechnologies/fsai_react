// chat/types/index.ts
/**
 * Type definitions for the chat module
 * These interfaces extend the base types from @/lib/types
 */

import type { Message, Conversation, Document } from '@/lib/types';

/**
 * Extended message type with additional chat-specific properties
 */
export interface ChatMessage extends Message {
  // ISO string timestamp for consistent date handling
  timestamp: number;
  // Additional metadata for message features
  metadata?: {
    // Language code for translated messages (e.g., 'es', 'fr')
    originalLanguage?: string;
    translatedLanguage?: string;
    // File preview data
    filePreview?: {
      thumbnailUrl?: string;
      fileType: string;
      dimensions?: { width: number; height: number };
    };
    // Code block metadata
    codeBlocks?: Array<{
      language: string;
      code: string;
      startLine: number;
      endLine: number;
    }>;
  };
}

/**
 * Main chat state interface
 * Manages all state for the chat feature
 */
export interface ChatState {
  // Array of all user conversations
  conversations: Conversation[];
  // Currently active conversation ID
  activeConversationId: string | null;
  // Loading state for AI responses
  isLoadingAIResponse: boolean;
  // Current input field value
  inputValue: string;
  // Message being edited (null if none)
  editingMessage: Message | null;
  // Which contexts are active (AI, documents, products)
  activeContexts: {
    ai: boolean;
    documents: boolean;
    products: boolean;
  };
  // Whether to show quick suggestions
  showSuggestions: boolean;
  // Whether to show scroll-to-bottom button
  showScrollButton: boolean;
  // Count of unread messages while scrolled up
  unreadMessageCount: number;
  // Current user's preferred language
  userLanguage: string;
  // Language to translate messages to
  targetTranslationLanguage: string | null;
}

/**
 * File upload state interface
 * Tracks the progress and status of file uploads
 */
export interface FileUploadState {
  // Whether a file is currently uploading
  isUploading: boolean;
  // Upload progress percentage (0-100)
  progress: number;
  // Error message if upload failed
  error: string | null;
  // Currently uploading file info
  currentFile?: {
    name: string;
    size: number;
    type: string;
  };
}

/**
 * Typing indicator state
 * Shows when someone is typing in the chat
 */
export interface TypingIndicator {
  // Whether AI is currently typing
  isAITyping: boolean;
  // When typing started (for timeout)
  typingStartedAt?: number;
  // Optional typing message
  typingMessage?: string;
}

/**
 * Chat context menu items
 * For right-click actions on messages
 */
export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  action: (message: ChatMessage) => void;
  // Whether this item should be shown for this message
  shouldShow?: (message: ChatMessage) => boolean;
  // Divider after this item
  divider?: boolean;
}

/**
 * File thumbnail configuration
 * Settings for generating file previews
 */
export interface FileThumbnailConfig {
  // Maximum dimensions for thumbnails
  maxWidth: number;
  maxHeight: number;
  // Supported file types for preview generation
  supportedTypes: string[];
  // Whether to generate thumbnails on client
  clientSideGeneration: boolean;
  // Fallback icon for unsupported types
  fallbackIcon: React.ComponentType<{ size?: number }>;
}

/**
 * Code syntax highlighting configuration
 */
export interface CodeHighlightConfig {
  // Available themes for syntax highlighting
  theme: 'vs-dark' | 'github-light' | 'monokai';
  // Whether to show line numbers
  showLineNumbers: boolean;
  // Whether to enable copy button
  enableCopyButton: boolean;
  // Supported languages
  supportedLanguages: string[];
}

/**
 * Translation configuration
 */
export interface TranslationConfig {
  defaultLanguage: string | null;
  // Available languages for translation
  availableLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
  // Auto-detect user language
  autoDetect: boolean;
  // Translation API endpoint
  apiEndpoint: string;
  // Whether to cache translations
  enableCache: boolean;
}

export interface Suggestion {
  id: string;
  text: string;
  context: 'ai' | 'documents' | 'products';
  answer?: string;
}