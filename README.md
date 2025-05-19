# FlowserveAI Chat Persistence System

This document explains the robust chat persistence system that saves conversations to local storage and handles document uploads effectively.

## System Architecture

The chat persistence system is organized in a clean, modular structure to provide a clear separation of concerns:

```
src/
├── lib/
│   ├── storage/
│   │   ├── index.ts           # Core storage API
│   │   ├── documents.ts       # Document storage & vectorization
│   │   └── indexedDB.ts       # IndexedDB low-level API
│   ├── services/
│   │   ├── document-service.ts    # Document operations API
│   │   └── document-processor.ts  # Document processing pipeline
│   └── types.ts               # Type definitions
├── hooks/
│   ├── use-chat-storage.ts        # React hook for chat storage
│   ├── use-document-upload.ts     # React hook for document uploads
│   └── use-translations-storage.ts # React hook for translation storage
├── components/
│   └── storage/
│       └── storage-initializer.tsx # Component to initialize storage
```

## Core Components

### 1. Storage System (`src/lib/storage/`)

This module provides the core persistence functionality with tiered storage approach:

- **Primary Storage**: IndexedDB for improved performance and higher storage limits
- **Fallback Storage**: localStorage for compatibility with older browsers
- **`index.ts`**: Central storage API with functions for managing conversations and active conversation state
- **`documents.ts`**: Document storage with local vectorization for search capabilities
- **`indexedDB.ts`**: Low-level IndexedDB operations

### 2. Services (`src/lib/services/`)

These services provide higher-level functionality:

- **`document-service.ts`**: Document operations (search, retrieval, etc.)
- **`document-processor.ts`**: Complete document processing pipeline:
  - Upload to backend (simulated)
  - Processing with AI
  - Text extraction
  - Vectorization

### 3. React Hooks (`src/hooks/`)

Custom hooks that integrate the storage system with React components:

- **`use-chat-storage.ts`**: Hook for conversation management
- **`use-document-upload.ts`**: Hook for document upload and processing
- **`use-translations-storage.ts`**: Hook for translation job management

### 4. Storage Initialization

The storage system is initialized on application startup:

- **`storage-initializer.tsx`**: Component that initializes IndexedDB and migrates data
- Automatic fallback to localStorage if IndexedDB is not supported

## Database Schema

The IndexedDB database includes the following object stores:

1. **conversations**: Store for chat conversations
   - Key: conversation ID 
   - Indexes: updatedAt

2. **documents**: Store for document files with binary data
   - Key: document ID
   - Indexes: backendId, conversationId

3. **document-vectors**: Store for document vectors (for search)
   - Key: documentId

4. **translations**: Store for translation jobs
   - Key: translation ID
   - Indexes: updatedAt, type

## Document Vectorization

Since browsers don't support full vector databases, we implement a simplified approach:

1. **Text Extraction**: Parse document text from DataURIs
2. **Term Frequency Index**: Create a simple term frequency index
3. **Stopword Filtering**: Remove common words to improve search quality
4. **Persistent Storage**: Store vectors in IndexedDB for better performance
5. **Search API**: Relevance-based search with recency boost

## Implementation Highlights

### Tiered Storage Access 

The system uses a tiered approach for data access:

```typescript
// Check if IndexedDB is supported
if (shouldUseIndexedDB()) {
  try {
    // Try IndexedDB first
    const data = await getFromIndexedDB();
    return data;
  } catch (error) {
    // Fall back to localStorage on error
    const fallbackData = getFromLocalStorage();
    return fallbackData;
  }
} else {
  // Use localStorage directly
  const data = getFromLocalStorage();
  return data;
}
```

### Automatic Migration

The system automatically migrates data from localStorage to IndexedDB:

```typescript
// Sample migration code
export async function migrateFromLocalStorage(): Promise<void> {
  // Get items from localStorage
  const conversations = localStorage.getItem('flowserveai-conversations');
  
  if (conversations) {
    try {
      const parsedConversations = JSON.parse(conversations);
      
      // Store in IndexedDB
      for (const conversation of parsedConversations) {
        await indexedDB.putItem('conversations', conversation);
      }
      
      console.log('Migrated conversations from localStorage to IndexedDB');
    } catch (error) {
      console.error('Error migrating conversations:', error);
    }
  }
}
```

### Synchronous and Asynchronous APIs

To support both older and newer code patterns, the system provides both synchronous and asynchronous methods:

```typescript
// Async API (preferred)
const conversations = await getConversationsAsync();

// Sync API (for backward compatibility)
const conversationsSync = getConversations();
```

## Translations Storage

The translation system utilizes IndexedDB for efficient storage of:

1. Text translations (source and target text content)
2. Document translations (file references and metadata)
3. Translation history for reuse and reference

## Cross-Tab Synchronization

The system maintains synchronization across tabs using the `storage` event and custom events:

```typescript
// Listen for storage changes
window.addEventListener('storage', handleStorageEvent);
window.addEventListener('flowserveai-storage-updated', handleStorageEvent);
```

## Fallback Approaches

When ideal technologies aren't available, the system implements these fallbacks:

1. **AI Unavailable**: Extract document preview as simple summary
2. **IndexedDB Unavailable**: Store in localStorage (with size limitations)
3. **Advanced Formats**: Provide placeholder extraction for complex document types

## Usage Examples

### Using the Chat Storage Hook

```typescript
const { 
  conversations,
  activeConversation,
  createNewConversation,
  addMessageToConversation
} = useChatStorage();

// Create a new conversation
const newConvId = createNewConversation('New Chat');

// Add a message
const message = {
  id: `msg-${Date.now()}`,
  conversationId: newConvId,
  content: 'Hello world',
  sender: 'user',
  timestamp: Date.now()
};
addMessageToConversation(newConvId, message);
```

### Saving a Translation Job

```typescript
const { saveTranslation } = useTranslationsStorage();

// Create a new translation job
const translationJob: TranslationJob = {
  id: `translation-${Date.now()}`,
  name: 'My Translation',
  type: 'text',
  status: 'complete',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  sourceLanguage: 'en',
  targetLanguages: ['es', 'fr'],
  inputText: 'Hello world',
  outputTextByLanguage: {
    'es': 'Hola mundo',
    'fr': 'Bonjour le monde'
  }
};

// Save it to IndexedDB
await saveTranslation(translationJob);
```

## Future Improvements

1. **Encryption**: Add client-side encryption for sensitive conversations
2. **IndexedDB**: ✅ Implemented IndexedDB for larger storage capacity and better performance
3. **Web Workers**: Move document processing to background threads
4. **PDF.js Integration**: Add native PDF text extraction
5. **WASM-based Vector DB**: Implement a lightweight vector database in WebAssembly
