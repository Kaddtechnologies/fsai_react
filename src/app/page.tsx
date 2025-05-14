
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SendHorizonal, Paperclip, Mic, Copy, Volume2, ThumbsUp, ThumbsDown, Edit, FileText, BotMessageSquare, User, AlertTriangle, Loader2, CheckCircle, XCircle, FileSpreadsheet, FileType as FileTypeLucideIcon, MessageCircleWarning, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, Conversation, Document, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateChatTitle } from '@/ai/flows/generate-chat-title';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MOCK_PRODUCTS, searchMockProducts } from '@/data/products';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';

// Mock user
const MOCK_USER = {
  id: "user-123",
  name: "Flowserve User",
  avatarUrl: "https://placehold.co/100x100.png", // data-ai-hint: "profile avatar"
};

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


const ChatPage = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const chatIdFromUrl = searchParams.get('chatId');
  const documentIdToDiscuss = searchParams.get('documentIdToDiscuss');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isLoadingAIResponse, setIsLoadingAIResponse] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isChatPageLoading, setIsChatPageLoading] = useState(true);

  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

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
      // If URL had an ID, but we couldn't make it active (e.g., not found, or no convos at all)
      // and we are on the chat page, redirect to base to show appropriate empty/welcome state.
      router.replace(`/`, { scroll: false });
    }
    setIsChatPageLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatIdFromUrl, pathname]); // documentIdToDiscuss removed as it's handled in a separate effect

  useEffect(() => {
    if (conversations.length > 0) { // Only save if there are actual conversations
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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
                  // Ensure to merge with existing attachment data, not replace it entirely.
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
      
      // Directly update localStorage here to ensure it's the latest version
      localStorage.setItem('flowserveai-conversations', JSON.stringify(newConversations));
      // Trigger a custom event that AppClientLayout can listen to, to refresh its state
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
    const currentInputValue = inputValue; // Capture before clearing
    setInputValue('');
    setIsLoadingAIResponse(true);
    
    // Optimistically update UI with user message
    updateConversation(updatedMessages); 

    let conversationTitle = activeConversation.title;
    if (activeConversation.messages.length === 0 && currentInputValue.trim() && (activeConversation.title === 'New Chat' || activeConversation.title.startsWith('Chat about '))) {
      try {
        const titleResponse = await generateChatTitle({ firstMessage: currentInputValue });
        conversationTitle = titleResponse.title;
      } catch (error) {
        console.error("Failed to generate chat title:", error);
        // Keep existing title or 'New Chat'
      }
    }
    
    try {
      const historyForAI = updatedMessages
        .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
        .slice(0, -1) 
        .map(msg => ({
          role: msg.sender as 'user' | 'ai',
          content: msg.content + 
                   (msg.attachments && msg.attachments.length > 0 && msg.attachments[0].status === 'completed' ? 
                      ` (User attached a document: ${msg.attachments[0].name}. Its summary is: ${msg.attachments[0].summary || 'Summary not available.'})` 
                      : '')
        }));

      let aiResponseContent = `FlowserveAI received: "${userMessage.content}"`;
      let aiMessageType: Message['type'] = 'text';
      let aiMessageData: any = null;

      const productQueryMatch = currentInputValue.toLowerCase().match(/search products for (.*)/i) || currentInputValue.toLowerCase().match(/find (.*) products/i);
      if (productQueryMatch) {
        const searchTerm = productQueryMatch[1];
        const products = searchMockProducts(searchTerm);
        if (products.length > 0) {
          aiResponseContent = `Found ${products.length} product(s) matching "${searchTerm}":`;
          aiMessageType = 'product_card';
          aiMessageData = { products };
        } else {
          aiResponseContent = `Sorry, I couldn't find any products matching "${searchTerm}".`;
        }
      } else {
        const aiResult = await generateChatResponse({ userInput: currentInputValue, history: historyForAI });
        aiResponseContent = aiResult.aiResponse;
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
    } finally {
      setIsLoadingAIResponse(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeConversationId) return;
    const file = files[0];

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({ title: "File too large", description: `File size cannot exceed ${MAX_FILE_SIZE_MB}MB.`, variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = ""; return;
    }

    const docType = getDocumentTypeFromMime(file.type, file.name);
    if (!docType) {
      toast({ title: "Invalid file type", description: `Allowed: ${ALLOWED_EXTENSIONS_STRING}.`, variant: "destructive" });
      if (fileInputRef.current) fileInputRef.current.value = ""; return;
    }

    const clientDocumentId = `doc-client-${Date.now()}-${file.name}`;
    const initialDocument: Document = {
      id: clientDocumentId, name: file.name, type: docType, uploadedAt: Date.now(),
      size: file.size, status: 'pending_upload', progress: 0,
    };

    const uploadMessageId = `msg-upload-${clientDocumentId}`;
    const uploadStatusMessage: Message = {
      id: uploadMessageId, conversationId: activeConversationId,
      content: `Preparing to upload ${file.name}...`, sender: 'system', timestamp: Date.now(),
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
        { status: 'pending_ai_processing', progress: 50, content: `Uploaded ${file.name}. Processing with AI...` },
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
            { status: 'completed', progress: 100, summary: summaryResponse.summary, content: `Successfully processed ${file.name}. Summary is available.` },
            finalDocUpdate
          );
          toast({ title: "File processed", description: `${file.name} uploaded and summarized.` });
        } catch (aiError) {
          console.error("AI processing error:", aiError);
          const finalDocUpdate: Partial<Document> = { status: 'failed', progress: 100, error: "AI processing failed." };
          updateMessageInData(uploadMessageId,
            { status: 'failed', progress: 100, error: "AI processing failed.", content: `Failed to process ${file.name} with AI.` },
            finalDocUpdate
          );
          toast({ title: "AI Error", description: `Could not process ${file.name}.`, variant: "destructive" });
        }
      };
      reader.onerror = () => {
        const errorMsg = "Failed to read file for AI processing.";
        const finalDocUpdate: Partial<Document> = { status: 'failed', progress: 100, error: errorMsg };
        updateMessageInData(uploadMessageId,
            { status: 'failed', progress: 100, error: errorMsg, content: `Error reading ${file.name}.` },
            finalDocUpdate
        );
        toast({ title: "File Read Error", description: errorMsg, variant: "destructive" });
      };

    } catch (uploadError: any) {
      console.error("Backend upload error:", uploadError);
      const errorMsg = uploadError.message || "An unknown error occurred during upload.";
      const finalDocUpdate: Partial<Document> = { status: 'failed', progress: 100, error: errorMsg };
      updateMessageInData(uploadMessageId,
        { status: 'failed', progress: 100, error: errorMsg, content: `Failed to upload ${file.name}.` },
        finalDocUpdate
      );
      toast({ title: "Upload Failed", description: errorMsg, variant: "destructive" });
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); toast({ title: "Copied to clipboard" }); };
  const handleTTS = (text: string) => { if (isSpeaking) cancel(); else speak(text); };
  const handleFeedback = (messageId: string, feedback: 'liked' | 'disliked') => { updateConversation((activeConversation?.messages || []).map(msg => msg.id === messageId ? { ...msg, feedback } : msg)); };
  const startEdit = (message: Message) => { setEditingMessage(message); setEditValue(message.content); };
  const cancelEdit = () => { setEditingMessage(null); setEditValue(''); };
  const submitEdit = () => {
    if (!editingMessage || !editValue.trim()) return;
    updateConversation((activeConversation?.messages || []).map(msg =>
      msg.id === editingMessage.id ? { ...msg, content: editValue, originalContent: msg.content, timestamp: Date.now(), feedback: undefined } : msg
    ));
    cancelEdit();
    toast({ title: "Message edited" });
  };
  
  if (isChatPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
        <p className="text-muted-foreground">Loading chat...</p>
      </div>
    );
  }

  if (!activeConversationId && conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <BotMessageSquare className="w-24 h-24 mb-6 text-primary opacity-50" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to FlowserveAI</h2>
        <p className="text-muted-foreground mb-6 max-w-md">Start a new conversation by typing below or select one from the sidebar.</p>
      </div>
    );
  }
  
  if (!activeConversation) {
     const message = activeConversationId 
        ? `Chat with ID ${activeConversationId.substring(0,10)}... not found.`
        : "No active chat session.";
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <MessageCircleWarning className="w-24 h-24 mb-6 text-accent-warning opacity-70" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">{message}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">Please select an existing conversation from the sidebar or start a new one.</p>
         <Button onClick={() => router.push('/')}>Go to Chats</Button> {/* Or a create new chat button */}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-9rem)] bg-background rounded-lg shadow-xl">
      <ScrollArea className="flex-1 p-4 pr-2">
        <div className="space-y-6">
          {activeConversation.messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? "justify-end" : "justify-start")}>
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 border-2 border-secondary-gradient"> <AvatarFallback><BotMessageSquare size={18}/></AvatarFallback> </Avatar>
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
                              {message.data.status === 'pending_upload' && 'Waiting for upload...'}
                              {message.data.status === 'uploading_to_backend' && `Uploading... (${message.data.progress?.toFixed(0) || 0}%)`}
                              {message.data.status === 'pending_ai_processing' && 'Processing with AI...'}
                              {message.data.status === 'ai_processing' && `Processing with AI... (${message.data.progress?.toFixed(0) || 50}%)`}
                              {message.data.status === 'completed' && <span className="text-accent-success flex items-center gap-1"><CheckCircle size={14}/>Completed</span>}
                              {message.data.status === 'failed' && <span className="text-destructive flex items-center gap-1"><XCircle size={14}/>Failed: {message.data.error || "Unknown error"}</span>}
                            </p>
                          </div>
                        </div>
                        {(message.data.status === 'uploading_to_backend' || message.data.status === 'ai_processing' || message.data.status === 'pending_ai_processing') && typeof message.data.progress === 'number' && message.data.status !== 'completed' && message.data.status !== 'failed' && (
                          <Progress value={message.data.progress} className="h-1.5 w-full mb-2" />
                        )}
                        {message.data.status === 'completed' && message.data.summary && (
                            <details className="mt-2"> <summary className="text-xs cursor-pointer text-muted-foreground hover:underline">View Summary</summary> <p className="text-xs mt-1 p-2 bg-muted rounded whitespace-pre-wrap max-h-24 overflow-y-auto">{message.data.summary}</p> </details>
                        )}
                         {message.data.status === 'failed' && message.data.error && ( <p className="text-xs mt-1 p-2 bg-destructive/10 text-destructive rounded">{message.data.error}</p> )}
                      </div>
                    )}

                    {message.type === 'product_card' && message.data?.products && Array.isArray(message.data.products) && (
                      <div className="mt-2 space-y-2">
                        {(message.data.products as Product[]).map(product => (
                          <Card key={product.id} className="bg-muted/50">
                            <CardHeader className="p-3"> {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="rounded-md mb-2 object-cover" data-ai-hint="product item" />} <CardTitle className="text-sm">{product.name}</CardTitle> <CardDescription className="text-xs">SKU: {product.sku}</CardDescription> </CardHeader>
                            <CardContent className="p-3 text-xs"> <p>{product.description}</p> <p className="mt-1"><strong>Availability:</strong> {product.availability}</p> {product.price && <p><strong>Price:</strong> {product.price}</p>} </CardContent>
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
               <Avatar className="h-8 w-8 border-2 border-secondary-gradient"> <AvatarFallback><BotMessageSquare size={18}/></AvatarFallback> </Avatar>
              <div className="max-w-[70%] p-3 rounded-xl shadow bg-card text-card-foreground rounded-tl-none">
                <div className="flex items-center space-x-1"> <span className="typing-dot"></span> <span className="typing-dot"></span> <span className="typing-dot"></span> </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="relative">
          <Textarea
            value={inputValue} onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message or drop files..."
            className="pr-28 pl-24 min-h-[52px] resize-none bg-input text-foreground focus-visible:ring-1 focus-visible:ring-ring"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}} rows={1} />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}> <Paperclip /> <span className="sr-only">Attach file</span> </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept={ALLOWED_EXTENSIONS_STRING} />
            <Button variant="ghost" size="icon" disabled> <Mic /> <span className="sr-only">Use microphone</span> </Button>
          </div>
          <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-gradient text-primary-foreground hover:opacity-90" 
            onClick={handleSendMessage} disabled={isLoadingAIResponse || !inputValue.trim()}>
            {isLoadingAIResponse ? <Loader2 className="animate-spin" /> : <SendHorizonal />} <span className="sr-only">Send message</span>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 px-4">Flowserve AI can make mistakes. Please validate important information.</p>
      </div>
    </div>
  );
};

export default ChatPage;

    