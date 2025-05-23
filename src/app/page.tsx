"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SendHorizonal, Paperclip, Mic, Copy, Volume2, ThumbsUp, ThumbsDown, Edit, FileText, BotMessageSquare, User, AlertTriangle, Loader2, CheckCircle, XCircle, FileSpreadsheet, FileType as FileTypeLucideIcon, MessageCircleWarning, FolderOpen, Package, Brain, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDescriptionComponent, DialogClose } from "@/components/ui/dialog";
import type { Message, Conversation, Document, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateChatTitle } from '@/ai/flows/generate-chat-title';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MOCK_PRODUCTS, searchMockProducts } from '@/data/products';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { MOCK_USER } from './utils/constants';
import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';
import useTranslation from '@/app/hooks/useTranslation';
import * as DocumentContextService from '@/lib/services/document-context';


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
const ALLOWED_EXTENSIONS_STRING = ".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.txt";

const getDocumentTypeFromMime = (mimeType: string, fileName: string): Document['type'] | undefined => {
  if (ALLOWED_FILE_TYPES[mimeType]) {
    return ALLOWED_FILE_TYPES[mimeType];
  }
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

const FileTypeIcon = ({ type, size = 24 }: { type: Document['type'], size?: number }) => {
  switch (type) {
    case 'pdf':
      return <FileText size={size} className="text-red-500" />;
    case 'excel':
      return <FileSpreadsheet size={size} className="text-green-500" />;
    case 'word':
      return <FileText size={size} className="text-blue-500" />;
    case 'powerpoint':
      return <FileTypeLucideIcon size={size} className="text-orange-500" />;
    case 'text':
      return <FileText size={size} className="text-gray-500" />;
    default:
      return <FileText size={size} className="text-muted-foreground" />;
  }
};

async function uploadFileToBackend(file: File, onProgress: (percentage: number) => void): Promise<{ success: boolean; backendId?: string; fileUrl?: string; error?: string }> {
  console.warn("uploadFileToBackend: This is a placeholder. Implement actual backend upload connected to your database and vectorization process.");
  
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
    setTimeout(() => {
      clearInterval(interval);
      onProgress(100);
      if (file.name.includes("fail")) {
        resolve({ success: false, error: "Simulated backend upload failure." });
      } else {
        resolve({ success: true, backendId: `backend-${Date.now()}-${file.name}`, fileUrl: `https://example.com/uploads/${file.name}` });
      }
    }, 2000 + Math.random() * 1000);
  });
}

const translateWithParams = (t: (key: string) => string, key: string, params: Record<string, string | number>) => {
  let translated = t(key);
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    translated = translated.replace(`{${paramKey}}`, String(paramValue));
  });
  return translated;
};

const ChatPage = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const chatIdFromUrl = searchParams.get('chatId');
  const documentIdToDiscuss = searchParams.get('documentIdToDiscuss');
  const { t } = useTranslation();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isChatPageLoading, setIsChatPageLoading] = useState(true);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(t('chat.placeholder'));
  
  const [showFullSummaryModal, setShowFullSummaryModal] = useState(false);
  const [modalSummaryContent, setModalSummaryContent] = useState<{title: string, content: string} | null>(null);

  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Update placeholder based on conversation content and screen size
  useEffect(() => {
    const updatePlaceholder = () => {
      // Only show placeholder if there are no user/AI messages
      const hasUserOrAIMessages = activeConversation?.messages?.some(
        msg => msg.sender === 'user' || msg.sender === 'ai'
      ) || false;
      
      if (window.innerWidth < 640) { // sm breakpoint
        setCurrentPlaceholder(hasUserOrAIMessages ? "" : t('chat.placeholderMobile'));
      } else {
        setCurrentPlaceholder(hasUserOrAIMessages ? "" : t('chat.placeholder'));
      }
    };

    updatePlaceholder();
    window.addEventListener('resize', updatePlaceholder);
    return () => window.removeEventListener('resize', updatePlaceholder);
  }, [activeConversation?.messages, t]);

  // Auto-resize textarea based on content
  const autoResizeTextarea = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const newHeight = Math.min(Math.max(textarea.scrollHeight, 52), 250); // Min 52px, max 250px (~10 rows)
    textarea.style.height = `${newHeight}px`;
  }, []);

  useEffect(() => {
    autoResizeTextarea();
  }, [inputValue, autoResizeTextarea]);
  
  useEffect(() => {
    setIsChatPageLoading(true);
    const storedConversationsJSON = localStorage.getItem('flowserveai-conversations');
    const conversationsFromStorage: Conversation[] = storedConversationsJSON ? JSON.parse(storedConversationsJSON) : [];
    
    setConversations(conversationsFromStorage);

    let newActiveId: string | null = null;

    if (chatIdFromUrl) {
      newActiveId = chatIdFromUrl;
    } else {
      const storedActiveId = localStorage.getItem('flowserveai-activeConversationId');
      if (storedActiveId && conversationsFromStorage.find(c => c.id === storedActiveId)) {
        newActiveId = storedActiveId;
      } else if (conversationsFromStorage.length > 0) {
        newActiveId = conversationsFromStorage[0].id;
      }
    }

    setActiveConversationId(newActiveId);

    if (newActiveId) {
      localStorage.setItem('flowserveai-activeConversationId', newActiveId);
      if (pathname === '/' && chatIdFromUrl !== newActiveId) {
         router.replace(`/?chatId=${newActiveId}${documentIdToDiscuss ? `&documentIdToDiscuss=${documentIdToDiscuss}`: ''}`, { scroll: false });
      }
    } else if (pathname === '/' && chatIdFromUrl) { 
      router.replace(`/`, { scroll: false });
    }
    setIsChatPageLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdFromUrl, pathname]); 

  useEffect(() => {
    if (conversations.length > 0 || localStorage.getItem('flowserveai-conversations')) { 
      localStorage.setItem('flowserveai-conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
       localStorage.setItem('flowserveai-activeConversationId', activeConversationId);
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (documentIdToDiscuss && activeConversationId && conversations.length > 0 && !isChatPageLoading) {
      const allDocsMap = new Map<string, Document>();
      conversations.forEach(c => c.messages.forEach(m => m.attachments?.forEach(doc => {
          if(doc.backendId) allDocsMap.set(doc.backendId, doc); else allDocsMap.set(doc.id, doc);
      })));

      const docToDiscuss = allDocsMap.get(documentIdToDiscuss);

      if (docToDiscuss && docToDiscuss.summary) {
        const convo = conversations.find(c => c.id === activeConversationId);
        if (convo && !convo.messages.some(m => m.data?.discussedDocumentId === documentIdToDiscuss)) {
           const systemMessage: Message = {
            id: `msg-doc-discuss-${Date.now()}`,
            conversationId: activeConversationId,
            content: `Let's discuss the document: **${docToDiscuss.name}**. \nSummary: _${docToDiscuss.summary}_ \n\nWhat would you like to know or discuss about it?`,
            sender: 'ai',
            timestamp: Date.now(),
            type: 'text',
            data: { discussedDocumentId: documentIdToDiscuss } 
          };
          updateConversation([...convo.messages, systemMessage]);
          router.replace(`/?chatId=${activeConversationId}`, { scroll: false });
        }
      } else if (docToDiscuss && docToDiscuss.status !== 'completed'){
         toast({ title: "Document still processing", description: `Please wait for "${docToDiscuss.name}" to finish processing before discussing it.`, variant: "default" });
         router.replace(`/?chatId=${activeConversationId}`, { scroll: false });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentIdToDiscuss, activeConversationId, conversations, router, isChatPageLoading]);

  const scrollToBottom = () => {
    textareaRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [activeConversation?.messages]);

  const updateMessageInData = (messageId: string, dataUpdates: Partial<Message['data']>, attachmentUpdates?: Partial<Document>) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: conv.messages.map(msg => {
              if (msg.id === messageId) {
                const updatedMsg = { ...msg, data: { ...msg.data, ...dataUpdates } };
                if (attachmentUpdates && msg.attachments && msg.attachments.length > 0) {
                  updatedMsg.attachments = [{ ...msg.attachments[0], ...attachmentUpdates }];
                }
                return updatedMsg;
              }
              return msg;
            }),
            updatedAt: Date.now(),
          };
        }
        return conv;
      }).sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };
  
  const updateConversation = useCallback((updatedMessages: Message[], newTitle?: string) => {
    setConversations(prevConvos => {
      const newConversations = prevConvos.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: updatedMessages,
            title: newTitle || conv.title,
            updatedAt: Date.now(),
          };
        }
        return conv;
      }).sort((a, b) => b.updatedAt - a.updatedAt);
      
      localStorage.setItem('flowserveai-conversations', JSON.stringify(newConversations));
      window.dispatchEvent(new CustomEvent('flowserveai-storage-updated', { detail: { key: 'flowserveai-conversations' } }));

      return newConversations;
    });
  }, [activeConversationId]);


  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!activeConversationId || !activeConversation) {
      toast({ title: "Error", description: "No active conversation selected.", variant: "destructive" });
      return;
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      content: inputValue,
      sender: 'user',
      timestamp: Date.now(),
    };

    let updatedMessages = [...(activeConversation.messages || []), userMessage];
    const currentInputValue = inputValue; 
    setInputValue('');
    setIsLoadingAIResponse(true);
    
    updateConversation(updatedMessages); 

    let conversationTitle = activeConversation.title;
    // Check if this is the first text message from user (regardless of document uploads)
    const isFirstUserTextMessage = !activeConversation.messages.some(msg => msg.sender === 'user' && msg.type !== 'document_upload_status');
    
    if ((isFirstUserTextMessage || activeConversation.title === 'New Chat' || activeConversation.title.startsWith('Chat about ')) && currentInputValue.trim()) {
      try {
        const titleResponse = await generateChatTitle({ 
          firstMessage: currentInputValue,
          messages: updatedMessages.map(msg => ({
            content: msg.content,
            isDocument: msg.type === 'document_upload_status'
          }))
        });
        conversationTitle = titleResponse.title;
      } catch (error) {
        console.error("Failed to generate chat title:", error);
      }
    }
    
    try {
      // Prepare conversation history for AI
      const historyForAI = updatedMessages
        .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
        .slice(0, -1) 
        .map(msg => ({
          role: msg.sender as 'user' | 'ai',
          content: msg.content,
          documentIds: msg.attachments?.map(doc => doc.id || doc.backendId || '').filter(Boolean) || []
        }));

      // Use the document context service to prepare documents for AI
      const documentContext = await DocumentContextService.prepareDocumentContext(
        activeConversation,
        currentInputValue,
        3 // Maximum number of documents to include
      ).then(refs => 
        // Convert to the format expected by the generate-chat-response flow
        refs.map(ref => ({
          id: ref.id,
          name: ref.name,
          type: ref.type,
          summary: ref.summary,
          recentlyDiscussed: ref.recentlyDiscussed
        }))
      );

      let aiResponseContent = `FlowserveAI received: "${userMessage.content}"`;
      let aiMessageType: Message['type'] = 'text';
      let aiMessageData: any = null;
      let referencedDocumentIds: string[] = [];

      const productQueryMatch = currentInputValue.toLowerCase().match(/search products? for (.*)/i) || currentInputValue.toLowerCase().match(/find (.*) products?/i) || currentInputValue.toLowerCase().match(/show me (.*) products?/i);
      if (productQueryMatch) {
        const searchTerm = productQueryMatch[1].trim();
        setCurrentPlaceholder(`Searching products for "${searchTerm}"...`);
        const products = searchMockProducts(searchTerm); // Using the mock search
        if (products.length > 0) {
          aiResponseContent = `Found ${products.length} product(s) matching "${searchTerm}":`;
          aiMessageType = 'product_card';
          aiMessageData = { products };
        } else {
          aiResponseContent = `Sorry, I couldn't find any products matching "${searchTerm}".`;
        }
        setCurrentPlaceholder("Ask about products, documents, or chat with AI...");
      } else {
        const aiResult = await generateChatResponse({ 
          userInput: currentInputValue, 
          history: historyForAI,
          documentContext
        });
        aiResponseContent = aiResult.aiResponse;
        
        // If the response referenced documents, store that information
        if (aiResult.referencedDocumentIds?.length) {
          referencedDocumentIds = aiResult.referencedDocumentIds;
          aiMessageData = { ...aiMessageData, referencedDocumentIds };
        }
      }

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        conversationId: activeConversationId,
        content: aiResponseContent,
        sender: 'ai',
        timestamp: Date.now(),
        type: aiMessageType,
        data: aiMessageData,
      };
      updateConversation([...updatedMessages, aiMessage], conversationTitle !== activeConversation.title ? conversationTitle : undefined);
    } catch (error) {
      console.error("Failed to get AI response:", error);
      const errorMessage: Message = {
        id: `msg-err-${Date.now()}`,
        conversationId: activeConversationId,
        content: "Sorry, I encountered an error trying to respond. Please try again.",
        sender: 'ai',
        timestamp: Date.now(),
        type: 'error',
      };
      updateConversation([...updatedMessages, errorMessage], conversationTitle !== activeConversation.title ? conversationTitle : undefined);
      toast({ title: "AI Error", description: "Could not get response from AI.", variant: "destructive" });
      setCurrentPlaceholder("Ask about products, documents, or chat with AI...");
    } finally {
      setIsLoadingAIResponse(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeConversationId) return;
    const file = files[0];

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({ 
        title: t('uploads.fileTooLarge.title'), 
        description: translateWithParams(t, 'uploads.fileTooLarge.description', { maxSize: MAX_FILE_SIZE_MB }), 
        variant: "destructive" 
      });
      if (textareaRef.current) textareaRef.current.value = ""; return;
    }

    const docType = getDocumentTypeFromMime(file.type, file.name);
    if (!docType) {
      toast({ 
        title: t('uploads.invalidType.title'), 
        description: translateWithParams(t, 'uploads.invalidType.description', { allowed: ALLOWED_EXTENSIONS_STRING }), 
        variant: "destructive" 
      });
      if (textareaRef.current) textareaRef.current.value = ""; return;
    }

    const clientDocumentId = `doc-client-${Date.now()}-${file.name}`;
    const initialDocument: Document = {
      id: clientDocumentId, name: file.name, type: docType, uploadedAt: Date.now(),
      size: file.size, status: 'pending_upload', progress: 0,
    };

    const uploadMessageId = `msg-upload-${clientDocumentId}`;
    const uploadStatusMessage: Message = {
      id: uploadMessageId, conversationId: activeConversationId,
      content: translateWithParams(t, 'uploads.preparing', { fileName: file.name }), 
      sender: 'system', timestamp: Date.now(),
      type: 'document_upload_status', attachments: [initialDocument],
      data: { fileName: file.name, documentType: docType, progress: 0, status: 'pending_upload', clientDocId: clientDocumentId }
    };
    
    let currentMessages = activeConversation?.messages || [];
    updateConversation([...currentMessages, uploadStatusMessage]);

    updateMessageInData(uploadMessageId,
      { status: 'uploading_to_backend', progress: 0 },
      { status: 'uploading_to_backend', progress: 0 }
    );

    try {
      const backendResult = await uploadFileToBackend(file, (p) => {
        updateMessageInData(uploadMessageId, { progress: p }, { progress: p });
      });

      if (!backendResult.success || !backendResult.backendId) {
        throw new Error(backendResult.error || "Backend upload failed.");
      }
      
      const backendUploadedDoc: Partial<Document> = { backendId: backendResult.backendId, fileUrl: backendResult.fileUrl, status: 'pending_ai_processing', progress: 50 };
      updateMessageInData(uploadMessageId, 
        { status: 'pending_ai_processing', progress: 50, content: translateWithParams(t, 'uploads.processingAi', { fileName: file.name }) },
        backendUploadedDoc
      );

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        updateMessageInData(uploadMessageId, 
          { status: 'ai_processing', progress: 75 },
          { dataUri, status: 'ai_processing', progress: 75 }
        );

        try {
          const summaryResponse = await summarizeDocument({ documentDataUri: dataUri });
          const finalDocUpdate: Partial<Document> = { summary: summaryResponse.summary, status: 'completed', progress: 100 };
          updateMessageInData(uploadMessageId,
            { status: 'completed', progress: 100, summary: summaryResponse.summary, content: translateWithParams(t, 'uploads.processingComplete', { fileName: file.name }) },
            finalDocUpdate
          );
          toast({ title: t('uploads.fileProcessed'), description: translateWithParams(t, 'uploads.fileProcessedSummary', { fileName: file.name }) });
        } catch (aiError) {
          console.error("AI processing error:", aiError);
          const finalDocUpdate: Partial<Document> = { status: 'failed', progress: 100, error: "AI processing failed." };
          updateMessageInData(uploadMessageId,
            { status: 'failed', progress: 100, error: "AI processing failed.", content: translateWithParams(t, 'uploads.processingFailed', { fileName: file.name }) },
            finalDocUpdate
          );
          toast({ title: t('uploads.aiError'), description: translateWithParams(t, 'uploads.couldNotProcess', { fileName: file.name }), variant: "destructive" });
        }
      };
      reader.onerror = () => {
        const errorMsg = "Failed to read file for AI processing.";
        const finalDocUpdate: Partial<Document> = { status: 'failed', progress: 100, error: errorMsg };
        updateMessageInData(uploadMessageId,
            { status: 'failed', progress: 100, error: errorMsg, content: translateWithParams(t, 'uploads.readingFailed', { fileName: file.name }) },
            finalDocUpdate
        );
        toast({ title: "File Read Error", description: errorMsg, variant: "destructive" });
      };

    } catch (uploadError: any) {
      console.error("Backend upload error:", uploadError);
      const errorMsg = uploadError.message || "An unknown error occurred during upload.";
      const finalDocUpdate: Partial<Document> = { status: 'failed', progress: 100, error: errorMsg };
      updateMessageInData(uploadMessageId,
        { status: 'failed', progress: 100, error: errorMsg, content: translateWithParams(t, 'uploads.uploadFailed', { fileName: file.name }) },
        finalDocUpdate
      );
      toast({ title: "Upload Failed", description: errorMsg, variant: "destructive" });
    }

    if (textareaRef.current) textareaRef.current.value = "";
  };

  const handleCopy = (text: string) => { 
    navigator.clipboard.writeText(text); 
    toast({ title: t('actions.copiedToClipboard') }); 
  };

  const handleTTS = (text: string) => { 
    if (isSpeaking) cancel(); 
    else speak(text); 
  };

  const handleFeedback = (messageId: string, feedback: 'liked' | 'disliked') => { 
    updateConversation((activeConversation?.messages || []).map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    )); 
  };

  const startEdit = (message: Message) => { 
    setEditingMessage(message); 
    setEditValue(message.content); 
  };

  const cancelEdit = () => { 
    setEditingMessage(null); 
    setEditValue(''); 
  };

  const submitEdit = () => {
    if (!editingMessage || !editValue.trim()) return;
    updateConversation((activeConversation?.messages || []).map(msg =>
      msg.id === editingMessage.id ? { ...msg, content: editValue, originalContent: msg.content, timestamp: Date.now(), feedback: undefined } : msg
    ));
    cancelEdit();
    toast({ title: t('chat.messageEdited') });
  };
  
  const handleShowFullSummary = (docName: string, summary: string) => {
    setModalSummaryContent({ 
      title: translateWithParams(t, 'document.fullSummaryTitle', { docName }), 
      content: summary 
    });
    setShowFullSummaryModal(true);
  };

  if (isChatPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
        <p className="text-muted-foreground">{t('chat.loading')}</p>
      </div>
    );
  }

if (!activeConversationId && conversations.length === 0) {
  const startNewChat = () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    setConversations([newConversation]);
    setActiveConversationId(newConversationId);
    router.replace(`/?chatId=${newConversationId}`, { scroll: false });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <img 
        src="/assets/images/flowserve_logo_transparent.svg" 
        alt="Flowserve Logo" 
        className=" h-20 mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2 text-foreground">{t('chat.welcome')}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">{t('chat.welcomeSubtitle')}</p>
      <Button 
        onClick={startNewChat}
        className="bg-primary-gradient hover:opacity-90 text-primary-foreground px-6"
      >
        <BotMessageSquare className="mr-2 h-5 w-5" />
        {t('chat.newChat')}
      </Button>
    </div>
  );
}
  
  if (!activeConversation) {
     const message = activeConversationId 
        ? translateWithParams(t, 'chat.notFound', { id: activeConversationId.substring(0,10) })
        : t('chat.noActiveSession');
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageCircleWarning className="w-24 h-24 mb-6 text-accent-warning opacity-70" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">{message}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">{t('chat.selectOrStartNew')}</p>
         <Button onClick={() => router.push('/')}>{t('actions.goToChats')}</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg shadow-xl overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="max-h-[68vh] sm:max-h-[70vh] md:max-h-[71vh] lg:max-h-[72vh] w-full">
          <div className="space-y-6 p-4 pr-2">
            {activeConversation.messages.map((message) => (
              <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? "justify-end" : "justify-start")}>
                {message.sender === 'ai' && (
                  <Avatar className="h-8 w-8 border-2 border-secondary-gradient"> 
                    <AvatarImage src="/assets/images/flowserve_logo_transparent.svg" alt="Flowserve AI" />
                    <AvatarFallback><BotMessageSquare size={18}/></AvatarFallback> 
                  </Avatar>
                )}
                <div className={cn("max-w-[70%] p-3 rounded-xl shadow", 
                  message.sender === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : 
                  message.sender === 'ai' ? "bg-card text-card-foreground rounded-tl-none" :
                  message.type === 'document_upload_status' ? "bg-card border border-border w-full max-w-[85%]" :
                  "bg-muted text-muted-foreground w-full text-sm text-center"
                )}>
                  {editingMessage?.id === message.id && message.sender === 'user' ? (
                    <div className="space-y-2">
                      <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="min-h-[60px] bg-background text-foreground"
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitEdit(); }}} />
                      <div className="flex gap-2 justify-end"> <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button> <Button size="sm" onClick={submitEdit}>Save</Button> </div>
                    </div>
                  ) : (
                    <>
                      {message.type !== 'document_upload_status' && <p className="whitespace-pre-wrap text-sm">{message.content}</p>}
                      {message.originalContent && <p className="text-xs text-muted-foreground/70 mt-1">(edited)</p>}
                      
                      {message.type === 'document_upload_status' && message.data && message.attachments && message.attachments.length > 0 && (
                        <div className="w-full">
                          <div className="flex items-center gap-3 mb-2">
                            <FileTypeIcon type={message.data.documentType!} size={32} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" title={message.data.fileName}>{message.data.fileName}</p>
                              <p className="text-xs text-muted-foreground">
                                {message.data.status === 'pending_upload' && t('uploads.status.pendingUpload')}
                                {message.data.status === 'uploading_to_backend' && translateWithParams(t, 'uploads.status.uploading', { progress: message.data.progress?.toFixed(0) || 0 })}
                                {message.data.status === 'pending_ai_processing' && t('uploads.status.pendingProcessing')}
                                {message.data.status === 'ai_processing' && translateWithParams(t, 'uploads.status.processing', { progress: message.data.progress?.toFixed(0) || 50 })}
                                {message.data.status === 'completed' && <span className="text-accent-success flex items-center gap-1"><CheckCircle size={14}/>{t('uploads.status.completed')}</span>}
                                {message.data.status === 'failed' && <span className="text-destructive flex items-center gap-1"><XCircle size={14}/>{t('uploads.status.failed')}: {message.data.error || t('common.unknownError')}</span>}
                              </p>
                            </div>
                          </div>
                          {(message.data.status === 'uploading_to_backend' || message.data.status === 'ai_processing' || message.data.status === 'pending_ai_processing') && typeof message.data.progress === 'number' && (
                            <Progress value={message.data.progress} className="h-1.5 w-full mb-2" />
                          )}
                          {message.data.status === 'completed' && message.data.summary && (
                              <div className="mt-2">
                                  <details>
                                      <summary className="text-xs cursor-pointer text-muted-foreground hover:underline">{t('document.viewSummarySnippet')}</summary>
                                      <p className="text-xs mt-1 p-2 bg-muted rounded whitespace-pre-wrap max-h-24 overflow-y-auto">{message.data.summary}</p>
                                  </details>
                                  <Button variant="link" size="sm" className="text-xs h-auto p-0 mt-1" onClick={() => handleShowFullSummary(message.data?.fileName || t('document.defaultName'), message.data?.summary || '')}>
                                      <Eye size={12} className="mr-1" /> {t('document.viewFullSummary')}
                                  </Button>
                              </div>
                          )}
                           {message.data.status === 'failed' && message.data.error && ( <p className="text-xs mt-1 p-2 bg-destructive/10 text-destructive rounded">{message.data.error}</p> )}
                        </div>
                      )}

                      {message.type === 'product_card' && message.data?.products && Array.isArray(message.data.products) && (
                        <div className="mt-2 space-y-3">
                          {(message.data.products as Product[]).map(product => (
                            <Card key={product.id} className="bg-card/70 border-border overflow-hidden shadow-md">
                              <CardHeader className="p-3 flex flex-row items-start gap-3">
                                {product.imageUrl && (
                                  <Image 
                                    src={product.imageUrl} 
                                    alt={product.name} 
                                    width={60} height={60} 
                                    className="rounded-md object-cover aspect-square" 
                                    data-ai-hint={product.name.split(' ').slice(0,2).join(' ').toLowerCase()}
                                  />
                                )}
                                <div className="flex-1">
                                  <CardTitle className="text-base font-semibold">{product.name}</CardTitle>
                                  <CardDescription className="text-xs mt-0.5">SKU: {product.sku}</CardDescription>
                                </div>
                              </CardHeader>
                              <CardContent className="p-3 pt-0 text-xs space-y-1">
                                <p className="line-clamp-3">{product.description}</p>
                                <p><strong className="text-muted-foreground">Availability:</strong> <span className={cn(product.availability === 'In Stock' ? 'text-accent-success' : product.availability === 'Low Stock' ? 'text-accent-warning' : 'text-destructive')}>{product.availability}</span></p>
                                {product.price && <p><strong className="text-muted-foreground">Price:</strong> {product.price}</p>}
                                {Object.entries(product.specifications || {}).length > 0 && (
                                  <details className="mt-1.5">
                                    <summary className="text-xs cursor-pointer text-muted-foreground hover:underline">View Specifications</summary>
                                    <div className="mt-1 p-2 bg-muted/50 rounded text-xs space-y-0.5 max-h-32 overflow-y-auto">
                                      {Object.entries(product.specifications).map(([key, value]) => (
                                        <p key={key}><strong className="text-muted-foreground">{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}</p>
                                      ))}
                                    </div>
                                  </details>
                                )}
                              </CardContent>
                              {/* CardFooter removed here as it's not typically used for product cards like this */}
                            </Card>
                          ))}
                        </div>
                      )}
                      {message.type === 'error' && <p className="text-xs text-destructive mt-1">Error: Could not process request.</p>}
                      
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {message.sender === 'ai' && message.type !== 'error' && message.type !== 'document_upload_status' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(message.content)}><Copy size={14}/></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => handleTTS(message.content)}> {isSpeaking ? <Volume2 size={14} className="text-secondary-gradient"/> : <Volume2 size={14}/>} </Button>
                            <Button variant="ghost" size="icon" className={`h-6 w-6 ${message.feedback === 'liked' ? 'text-accent-success' : 'text-muted-foreground hover:text-accent-success'}`} onClick={() => handleFeedback(message.id, 'liked')}><ThumbsUp size={14}/></Button>
                            <Button variant="ghost" size="icon" className={`h-6 w-6 ${message.feedback === 'disliked' ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`} onClick={() => handleFeedback(message.id, 'disliked')}><ThumbsDown size={14}/></Button>
                          </>
                        )}
                        {message.sender === 'user' && !editingMessage && ( <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground" onClick={() => startEdit(message)}><Edit size={14}/></Button> )}
                      </div>
                    </>
                  )}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-8 w-8"> <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} data-ai-hint="profile avatar"/> <AvatarFallback>{MOCK_USER.name.substring(0,1)}</AvatarFallback> </Avatar>
                )}
              </div>
            ))}
            {isLoadingAIResponse && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8 border-2 border-secondary-gradient"> 
                  <AvatarImage src="/assets/images/flowserve_logo_transparent.svg" alt="Flowserve AI" />
                  <AvatarFallback><BotMessageSquare size={18}/></AvatarFallback> 
                </Avatar>
                <div className="max-w-[70%] p-3 rounded-xl shadow bg-card text-card-foreground rounded-tl-none">
                  <div className="flex items-center space-x-1"> <span className="typing-dot"></span> <span className="typing-dot"></span> <span className="typing-dot"></span> </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border p-4 bg-background">      
        <div className="rounded-xl border border-input bg-muted/30 overflow-hidden flex flex-col">
          <div className="max-h-[250px] overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentPlaceholder}
              className="border-0 min-h-[52px] pt-3 pl-3 resize-none bg-transparent text-foreground focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
              onKeyDown={(e) => { 
                if (e.key === 'Enter' && !e.shiftKey) { 
                  e.preventDefault(); 
                  handleSendMessage(); 
                }
              }} 
            />
          </div>
          <div className="flex items-center px-3 py-2">
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => fileInputRef.current?.click()}>
                <Paperclip size={20} />
                <span className="sr-only">Attach file</span>
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept={ALLOWED_EXTENSIONS_STRING}
                onChange={handleFileUpload}
              />
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled>
                <Mic size={20} />
                <span className="sr-only">Use microphone</span>
              </Button>
            </div>
            <div className="flex-1"></div>
            <Button 
              type="submit" 
              size="icon" 
              className="h-9 w-9 rounded-full bg-primary-gradient text-primary-foreground hover:opacity-90" 
              onClick={handleSendMessage} 
              disabled={isLoadingAIResponse || !inputValue.trim()}
            >
              {isLoadingAIResponse ? <Loader2 className="animate-spin" /> : <SendHorizonal size={18} />}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 px-4">{t('chat.aiDisclaimer')}</p>
      </div>

      {modalSummaryContent && (
        <Dialog open={showFullSummaryModal} onOpenChange={setShowFullSummaryModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{modalSummaryContent.title}</DialogTitle>
              <DialogDescriptionComponent className="text-sm text-muted-foreground">{t('document.rawMarkdownPreview')}</DialogDescriptionComponent>
            </DialogHeader>
            <ScrollArea className="flex-1 min-h-0 py-2 pr-3 -mr-2">
              <pre className="block w-full text-sm whitespace-pre-wrap break-words bg-muted p-3 rounded-md">
                {modalSummaryContent.content}
              </pre>
            </ScrollArea>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mt-4">{t('actions.close')}</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatPage;
