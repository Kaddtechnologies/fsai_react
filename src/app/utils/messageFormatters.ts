// chat/utils/messageFormatters.ts
/**
 * Message formatting utilities
 * Handles timestamp formatting, code detection, and message parsing
 */

import { format, formatRelative, differenceInMinutes, isToday, isYesterday } from 'date-fns';
import { TIMESTAMP_FORMATS, LANGUAGE_MAP } from './constants';

/**
 * Formats a timestamp based on user preferences and relative time
 * @param timestamp - Unix timestamp in milliseconds
 * @param formatType - Type of format to use ('relative', 'absolute', 'timeOnly')
 * @returns Formatted timestamp string
 */
export const formatTimestamp = (
  timestamp: number, 
  formatType: keyof typeof TIMESTAMP_FORMATS = 'relative'
): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // For relative formatting, use custom logic for better UX
  if (formatType === 'relative') {
    const minutes = differenceInMinutes(now, date);
    
    // Less than 1 minute ago
    if (minutes < 1) {
      return 'Just now';
    }
    
    // Less than 1 hour ago
    if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    // Today: show time only
    if (isToday(date)) {
      return format(date, 'h:mm a');
    }
    
    // Yesterday: show "Yesterday" + time
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }
    
    // Within last 7 days: show day name + time
    const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff < 7) {
      return format(date, 'EEEE at h:mm a');
    }
    
    // Older: show full date
    return format(date, 'MMM d, yyyy at h:mm a');
  }
  
  // For absolute formatting
  if (formatType === 'absolute') {
    return format(date, 'MMM d, yyyy h:mm a');
  }
  
  // For time only
  if (formatType === 'timeOnly') {
    return format(date, 'h:mm a');
  }
  
  // Fallback
  return format(date, 'MMM d, yyyy h:mm a');
};

/**
 * Detects code blocks in a message and extracts them with language info
 * @param content - Message content to parse
 * @returns Array of code blocks with metadata
 */
export const detectCodeBlocks = (content: string): Array<{
  language: string;
  code: string;
  startLine: number;
  endLine: number;
}> => {
  const codeBlocks: Array<{
    language: string;
    code: string;
    startLine: number;
    endLine: number;
  }> = [];
  
  // Match markdown code blocks with optional language
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'plaintext';
    const code = match[2];
    const startLine = content.substring(0, match.index).split('\n').length;
    const endLine = startLine + code.split('\n').length - 1;
    
    codeBlocks.push({
      language: language.toLowerCase(),
      code: code.trim(),
      startLine,
      endLine,
    });
  }
  
  // Also detect inline code (single backticks)
  const inlineCodeRegex = /`([^`]+)`/g;
  while ((match = inlineCodeRegex.exec(content)) !== null) {
    const code = match[1];
    const startLine = content.substring(0, match.index).split('\n').length;
    
    // Try to detect language from content
    const detectedLang = detectLanguageFromCode(code);
    
    codeBlocks.push({
      language: detectedLang,
      code: code,
      startLine,
      endLine: startLine,
    });
  }
  
  return codeBlocks;
};

/**
 * Attempts to detect programming language from code content
 * @param code - Code string to analyze
 * @returns Detected language or 'plaintext'
 */
export const detectLanguageFromCode = (code: string): string => {
  // Simple heuristics for language detection
  const patterns: Record<string, RegExp[]> = {
    javascript: [
      /\b(const|let|var|function|=>|async|await)\b/,
      /\b(console\.log|document\.|window\.)\b/,
    ],
    typescript: [
      /\b(interface|type|enum|namespace|implements)\b/,
      /\b(public|private|protected|readonly)\b/,
      /:\s*(string|number|boolean|any|void)\b/,
    ],
    python: [
      /\b(def|class|import|from|if|elif|else|for|while)\b/,
      /\b(print|len|range|str|int|float)\b/,
      /#.*$/m,
    ],
    java: [
      /\b(public|private|protected|class|interface|extends|implements)\b/,
      /\b(String|int|boolean|void|new)\b/,
      /System\.out\.println/,
    ],
    csharp: [
      /\b(using|namespace|class|public|private|protected|internal)\b/,
      /\b(string|int|bool|void|var|new)\b/,
      /Console\.WriteLine/,
    ],
    html: [
      /<[a-z][\s\S]*>/i,
      /<\/[a-z]+>/i,
      /\b(class|id|href|src)="/,
    ],
    css: [
      /[.#][\w-]+\s*{/,
      /\b(color|background|margin|padding|font-size):/,
      /@media|@import|@keyframes/,
    ],
    sql: [
      /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|DROP)\b/i,
      /\b(TABLE|DATABASE|JOIN|ON|AND|OR)\b/i,
    ],
  };
  
  // Check each pattern
  for (const [language, regexArray] of Object.entries(patterns)) {
    let matches = 0;
    for (const regex of regexArray) {
      if (regex.test(code)) {
        matches++;
      }
    }
    // If at least half the patterns match, consider it detected
    if (matches >= regexArray.length / 2) {
      return language;
    }
  }
  
  return 'plaintext';
};

/**
 * Extracts URLs from message content
 * @param content - Message content
 * @returns Array of URLs found in the message
 */
export const extractUrls = (content: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const matches = content.match(urlRegex);
  return matches || [];
};

/**
 * Formats file size for display
 * @param bytes - File size in bytes
 * @returns Human-readable file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Truncates text to a maximum length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Escapes HTML entities in text to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Highlights search terms in text
 * @param text - Text to highlight in
 * @param searchTerm - Term to highlight
 * @returns Text with highlighted terms
 */
export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Escapes special regex characters
 * @param string - String to escape
 * @returns Escaped string
 */
const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Detects if a message contains sensitive information
 * @param content - Message content to check
 * @returns Whether the message might contain sensitive data
 */
export const detectSensitiveInfo = (content: string): boolean => {
  const patterns = [
    /\b\d{3}-\d{2}-\d{4}\b/, // SSN
    /\b\d{16}\b/, // Credit card
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
  ];
  
  return patterns.some(pattern => pattern.test(content));
};