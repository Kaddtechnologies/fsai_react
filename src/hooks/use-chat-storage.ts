/**
 * Chat Storage Hook
 * 
 * A custom React hook that provides easy access to the chat storage system
 * with reactive state management for components. This hook allows components
 * to work with conversations, messages, and documents while staying in sync
 * with localStorage updates.
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Conversation, Message, Document } from '@/lib/types';
import * as StorageAPI from '@/lib/storage';
import { processDocumentForSearch } from '@/lib/storage/documents';
import { useToast } from './use-toast';

interface ChatStorageHook {
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | undefined;
  setActiveConversationId: (id: string | null) => void;
  
  // Conversation operations
  createNewConversation: (title?: string) => string;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  
  // Message operations
  updateConversationMessages: (conversationId: string, messages: Message[], newTitle?: string) => void;
  addMessageToConversation: (conversationId: string, message: Message) => void;
  
  // Document operations
  updateMessageWithDocument: (
    messageId: string, 
    documentUpdates: Partial<Document>, 
    dataUpdates?: Partial<Message['data']>
  ) => void;
  
  // State
  isLoading: boolean;
}

export function useChatStorage(): ChatStorageHook {
  const { toast } = useToast();
  const router = useRouter();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the active conversation object
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  
  // Load initial data from localStorage
  useEffect(() => {
    const loadInitialData = () => {
      try {
        setIsLoading(true);
        // Load conversations
        const storedConversations = StorageAPI.getConversations();
        setConversations(storedConversations);
        
        // Get active conversation ID
        const storedActiveId = StorageAPI.getActiveConversationId();
        if (storedActiveId && storedConversations.find(c => c.id === storedActiveId)) {
          setActiveConversationId(storedActiveId);
        } else if (storedConversations.length > 0) {
          setActiveConversationId(storedConversations[0].id);
          StorageAPI.setActiveConversationId(storedConversations[0].id);
        } else {
          setActiveConversationId(null);
          StorageAPI.setActiveConversationId(null);
        }
      } catch (error) {
        console.error('Failed to load chat data:', error);
        toast({
          title: 'Error loading conversations',
          description: 'There was a problem loading your conversations.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
    
    // Listen for storage events (from other tabs or components)
    const handleStorageEvent = (event: StorageEvent | CustomEvent) => {
      let key = '';
      
      if (event instanceof StorageEvent) {
        key = event.key || '';
      } else if (event instanceof CustomEvent && event.detail) {
        key = event.detail.key || '';
      }
      
      if (key === StorageAPI.STORAGE_KEYS.CONVERSATIONS) {
        setConversations(StorageAPI.getConversations());
      } else if (key === StorageAPI.STORAGE_KEYS.ACTIVE_CONVERSATION_ID) {
        setActiveConversationId(StorageAPI.getActiveConversationId());
      }
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageEvent);
    window.addEventListener(StorageAPI.STORAGE_EVENTS.UPDATED, handleStorageEvent as EventListener);
    
    return () => {
      // Clean up event listeners
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener(StorageAPI.STORAGE_EVENTS.UPDATED, handleStorageEvent as EventListener);
    };
  }, [toast]);
  
  // Create a new conversation
  const createNewConversation = useCallback((title?: string): string => {
    const newId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newId,
      title: title || 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Update local state
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newId);
    
    // Update storage
    StorageAPI.upsertConversation(newConversation);
    StorageAPI.setActiveConversationId(newId);
    
    // Update URL with the new active conversation ID
    router.push(`/?chatId=${newId}`);
    
    return newId;
  }, [router]);
  
  // Delete a conversation
  const deleteConversation = useCallback((id: string): void => {
    // Update storage
    const remainingConversations = StorageAPI.deleteConversation(id);
    
    // Update local state
    setConversations(remainingConversations);
    
    // If we deleted the active conversation, update the active ID
    if (activeConversationId === id) {
      const newActiveId = remainingConversations.length > 0 ? remainingConversations[0].id : null;
      setActiveConversationId(newActiveId);
      
      // Update URL
      if (newActiveId) {
        router.push(`/?chatId=${newActiveId}`);
      } else {
        router.push('/');
      }
    }
  }, [activeConversationId, router]);
  
  // Rename a conversation
  const renameConversation = useCallback((id: string, newTitle: string): void => {
    const conversation = conversations.find(c => c.id === id);
    if (!conversation) return;
    
    // Create updated conversation
    const updatedConversation: Conversation = {
      ...conversation,
      title: newTitle,
      updatedAt: Date.now()
    };
    
    // Update storage and state
    StorageAPI.upsertConversation(updatedConversation);
    setConversations(prev => 
      prev.map(c => c.id === id ? updatedConversation : c)
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
  }, [conversations]);
  
  // Update messages in a conversation
  const updateConversationMessages = useCallback((
    conversationId: string, 
    messages: Message[], 
    newTitle?: string
  ): void => {
    const updatedConversation = StorageAPI.updateConversationMessages(
      conversationId, 
      messages, 
      newTitle
    );
    
    if (updatedConversation) {
      // Update local state
      setConversations(prev => 
        prev.map(c => c.id === conversationId ? updatedConversation : c)
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    }
  }, []);
  
  // Add a single message to a conversation
  const addMessageToConversation = useCallback((
    conversationId: string, 
    message: Message
  ): void => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const updatedMessages = [...conversation.messages, message];
    updateConversationMessages(conversationId, updatedMessages);
    
    // If this message contains document attachments, process them for search
    if (message.attachments?.length && message.attachments.some(doc => doc.status === 'completed' && doc.dataUri)) {
      message.attachments.forEach(doc => {
        if (doc.status === 'completed' && doc.dataUri) {
          // Process the document asynchronously
          processDocumentForSearch(doc).catch(err => {
            console.error('Failed to process document for search:', err);
          });
        }
      });
    }
  }, [conversations, updateConversationMessages]);
  
  // Update a document in a message
  const updateMessageWithDocument = useCallback((
    messageId: string, 
    documentUpdates: Partial<Document>, 
    dataUpdates?: Partial<Message['data']>
  ): void => {
    // Find the conversation and message
    let updatedConversation: Conversation | undefined;
    
    for (const conversation of conversations) {
      const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
      if (messageIndex >= 0) {
        // Clone the conversation
        const updatedMessages = [...conversation.messages];
        const originalMessage = updatedMessages[messageIndex];
        
        // Update the message
        updatedMessages[messageIndex] = {
          ...originalMessage,
          data: {
            ...originalMessage.data,
            ...dataUpdates
          },
          attachments: originalMessage.attachments?.map(doc => ({
            ...doc,
            ...documentUpdates
          }))
        };
        
        // Update the conversation
        updateConversationMessages(conversation.id, updatedMessages);
        updatedConversation = {
          ...conversation,
          messages: updatedMessages,
          updatedAt: Date.now()
        };
        
        // Process document for search if it's completed and has dataUri
        if (
          documentUpdates.status === 'completed' && 
          (documentUpdates.dataUri || originalMessage.attachments?.[0]?.dataUri)
        ) {
          const docToProcess = {
            ...originalMessage.attachments?.[0],
            ...documentUpdates
          };
          
          processDocumentForSearch(docToProcess as Document).catch(err => {
            console.error('Failed to process document for search:', err);
          });
        }
        
        break;
      }
    }
    
    if (updatedConversation) {
      // Update local state
      setConversations(prev => 
        prev.map(c => c.id === updatedConversation?.id ? updatedConversation : c)
          .sort((a, b) => b.updatedAt - a.updatedAt)
      );
    }
  }, [conversations, updateConversationMessages]);
  
  return {
    conversations,
    activeConversationId,
    activeConversation,
    setActiveConversationId: useCallback((id: string | null) => {
      StorageAPI.setActiveConversationId(id);
      setActiveConversationId(id);
    }, []),
    
    createNewConversation,
    deleteConversation,
    renameConversation,
    
    updateConversationMessages,
    addMessageToConversation,
    
    updateMessageWithDocument,
    
    isLoading
  };
} 