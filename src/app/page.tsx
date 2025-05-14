
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { SendHorizonal, Paperclip, Mic, Copy, Volume2, ThumbsUp, ThumbsDown, Edit, FileText, BotMessageSquare, User, AlertTriangle, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Message, Conversation, Document, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateChatTitle } from '@/ai/flows/generate-chat-title';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { generateChatResponse } from '@/ai/flows/generate-chat-response'; // Import new flow
// import { searchDocuments } from '@/ai/flows/search-documents'; // For future use
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

const ChatPage = () => {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const chatIdFromUrl = searchParams.get('chatId');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(chatIdFromUrl);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editValue, setEditValue] = useState('');

  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeConversation = conversations.find(conv => conv.id === activeConversationId);

  // Load and save conversations from/to localStorage
  useEffect(() => {
    const storedConversations = localStorage.getItem('flowserveai-conversations');
    if (storedConversations) {
      try {
        const parsedConversations = JSON.parse(storedConversations);
        setConversations(parsedConversations);
         // Ensure activeConversationId from URL is preferred, then localStorage, then first conv
        const storedActiveId = localStorage.getItem('flowserveai-activeConversationId');
        if (chatIdFromUrl) {
          setActiveConversationId(chatIdFromUrl);
          if(chatIdFromUrl !== storedActiveId) localStorage.setItem('flowserveai-activeConversationId', chatIdFromUrl);
        } else if (storedActiveId && parsedConversations.find((c: Conversation) => c.id === storedActiveId)) {
          setActiveConversationId(storedActiveId);
        } else if (parsedConversations.length > 0 && !activeConversationId) {
           setActiveConversationId(parsedConversations[0].id);
        }

      } catch (e) {
        console.error("Failed to parse conversations from localStorage", e);
        localStorage.removeItem('flowserveai-conversations'); // Clear corrupted data
      }
    }
  }, [chatIdFromUrl]); // Removed conversations and activeConversationId from deps to avoid potential loops on initial load.

  useEffect(() => {
    localStorage.setItem('flowserveai-conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
       localStorage.setItem('flowserveai-activeConversationId', activeConversationId);
    }
  }, [activeConversationId]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [activeConversation?.messages]);

  const updateConversation = useCallback((updatedMessages: Message[], newTitle?: string) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: updatedMessages,
            title: newTitle || conv.title,
            updatedAt: Date.now(),
          };
        }
        return conv;
      })
    );
  }, [activeConversationId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !activeConversation?.messages.some(msg => msg.attachments && msg.attachments.length > 0 && msg.processing)) return;
    if (!activeConversationId || !activeConversation) { // Ensure activeConversation exists
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

    const currentMessages = activeConversation.messages || [];
    let updatedMessages = [...currentMessages, userMessage];
    updateConversation(updatedMessages);
    const currentInputValue = inputValue; // Capture inputValue before clearing
    setInputValue('');
    setIsLoading(true);

    let conversationTitle = activeConversation.title;
    if (currentMessages.length === 0 && currentInputValue.trim() && activeConversation.title === 'New Chat') {
      try {
        const titleResponse = await generateChatTitle({ firstMessage: currentInputValue });
        conversationTitle = titleResponse.title;
        // Update title in conversations state directly, as updateConversation might use stale closure for title
         setConversations(prev =>
          prev.map(conv => 
            conv.id === activeConversationId ? { ...conv, title: conversationTitle, messages: updatedMessages, updatedAt: Date.now() } : conv
          )
        );
      } catch (error) {
        console.error("Failed to generate chat title:", error);
        // Keep going with default title 'New Chat' or current title
      }
    }
    
    // AI response generation
    try {
      const historyForAI = updatedMessages // Use updatedMessages up to the user's latest message
        .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
        .slice(0, -1) // Exclude the latest user message from history, it's the primary input
        .map(msg => ({
          role: msg.sender as 'user' | 'ai',
          content: msg.content
        }));

      let aiResponseContent = `FlowserveAI received: "${userMessage.content}"`; // Default content
      let aiMessageType: Message['type'] = 'text';
      let aiMessageData: any = null;

      const productQueryMatch = currentInputValue.toLowerCase().match(/search products for (.*)/i) || currentInputValue.toLowerCase().match(/find (.*) products/i);
      if (productQueryMatch) {
        const searchTerm = productQueryMatch[1];
        const products = searchMockProducts(searchTerm);
        if (products.length > 0) {
          aiResponseContent = `Found ${products.length} product(s) matching "${searchTerm}":`;
          aiMessageType = 'product_card';
          aiMessageData = products;
        } else {
          aiResponseContent = `Sorry, I couldn't find any products matching "${searchTerm}".`;
        }
      } else {
        // Call Genkit flow for general chat response
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
      // Ensure title is preserved if it was updated
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
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeConversationId) return;

    const file = files[0];
    const documentId = `doc-${Date.now()}`;
    const newDocument: Document = {
      id: documentId,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : (file.type.includes('excel') || file.type.includes('spreadsheetml') ? 'excel' : 'text')),
      uploadedAt: Date.now(),
      size: file.size,
      processingStatus: 'uploading',
    };

    const uploadStatusMessage: Message = {
        id: `msg-upload-${documentId}`,
        conversationId: activeConversationId,
        content: `Uploading ${file.name}...`,
        sender: 'system',
        timestamp: Date.now(),
        type: 'document_upload_status',
        processing: true,
        attachments: [newDocument],
        data: { progress: 0, fileName: file.name, status: 'uploading' }
    };
    
    let currentMessages = activeConversation?.messages || [];
    updateConversation([...currentMessages, uploadStatusMessage]);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const dataUri = reader.result as string;
        newDocument.dataUri = dataUri;
        
        currentMessages = conversations.find(c => c.id === activeConversationId)?.messages || [];
        updateConversation(currentMessages.map(m => m.id === uploadStatusMessage.id ? {...m, data: {...m.data, progress: 50, status: 'processing'}, content: `Processing ${file.name}...`} : m));

        try {
            const summaryResponse = await summarizeDocument({ documentDataUri: dataUri });
            newDocument.summary = summaryResponse.summary;
            newDocument.processingStatus = 'completed';
            
            currentMessages = conversations.find(c => c.id === activeConversationId)?.messages || [];
            updateConversation(currentMessages.map(m => m.id === uploadStatusMessage.id ? {
                ...m, 
                content: `Processed ${file.name}. Summary available.`, 
                processing: false, 
                attachments: [{...newDocument}],
                data: {...m.data, progress: 100, status: 'completed', summary: summaryResponse.summary}
            } : m));

            toast({ title: "File processed", description: `${file.name} summarized successfully.` });

        } catch (error) {
            console.error("Failed to summarize document:", error);
            newDocument.processingStatus = 'failed';
            currentMessages = conversations.find(c => c.id === activeConversationId)?.messages || [];
            updateConversation(currentMessages.map(m => m.id === uploadStatusMessage.id ? {
                ...m, 
                content: `Failed to process ${file.name}.`, 
                processing: false, 
                attachments: [{...newDocument}],
                data: {...m.data, progress: 100, status: 'failed'}
            } : m));
            toast({ title: "Processing failed", description: `Could not process ${file.name}.`, variant: "destructive" });
        }
    };
    reader.onerror = () => {
        newDocument.processingStatus = 'failed';
         currentMessages = conversations.find(c => c.id === activeConversationId)?.messages || [];
         updateConversation(currentMessages.map(m => m.id === uploadStatusMessage.id ? {
            ...m, 
            content: `Failed to upload ${file.name}.`, 
            processing: false, 
            attachments: [{...newDocument}],
            data: {...m.data, progress: 0, status: 'failed'}
        } : m));
        toast({ title: "Upload failed", description: `Could not upload ${file.name}.`, variant: "destructive" });
    };
    
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleTTS = (text: string) => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(text);
    }
  };
  
  const handleFeedback = (messageId: string, feedback: 'liked' | 'disliked') => {
    const currentMessages = activeConversation?.messages || [];
    const updatedMessages = currentMessages.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    );
    updateConversation(updatedMessages);
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
    const currentMessages = activeConversation?.messages || [];
    const updatedMessages = currentMessages.map(msg =>
      msg.id === editingMessage.id
        ? { ...msg, content: editValue, originalContent: msg.content, timestamp: Date.now(), feedback: undefined } // Clear feedback on edit
        : msg
    );
    updateConversation(updatedMessages);
    cancelEdit();
    toast({ title: "Message edited" });
  };
  
  if (conversations.length === 0 && !chatIdFromUrl) { // Check chatIdFromUrl to allow direct linking to new chat
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <BotMessageSquare className="w-24 h-24 mb-6 text-primary opacity-50" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">Welcome to FlowserveAI</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start a new conversation to chat with AI, manage documents, and browse products.
        </p>
        <p className="text-sm text-muted-foreground">Click "New Chat" in the sidebar to begin.</p>
      </div>
    );
  }

  if (!activeConversation && chatIdFromUrl && conversations.find(c => c.id === chatIdFromUrl)) {
     // Still loading or activeConversation not yet found from URL, show loader or minimal state
     return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <Loader2 className="w-16 h-16 mb-4 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading chat...</p>
        </div>
     );
  }
  
  if (!activeConversation) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <AlertTriangle className="w-24 h-24 mb-6 text-accent-warning opacity-70" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">No Active Chat</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Please select a conversation from the sidebar or start a new one. If you just created one, it might be loading.
        </p>
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
                <Avatar className="h-8 w-8 border-2 border-secondary-gradient">
                  <AvatarFallback><BotMessageSquare size={18}/></AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-[70%] p-3 rounded-xl shadow", 
                message.sender === 'user' ? "bg-primary text-primary-foreground rounded-tr-none" : 
                message.sender === 'ai' ? "bg-card text-card-foreground rounded-tl-none" :
                "bg-muted text-muted-foreground w-full text-sm text-center"
              )}>
                {editingMessage?.id === message.id && message.sender === 'user' ? (
                  <div className="space-y-2">
                    <Textarea 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)} 
                      className="min-h-[60px] bg-background text-foreground"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          submitEdit();
                        }
                      }}
                    />
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancel</Button>
                      <Button size="sm" onClick={submitEdit}>Save</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    {message.originalContent && (
                       <p className="text-xs text-muted-foreground/70 mt-1">(edited)</p>
                    )}
                    {message.type === 'document_upload_status' && message.data && (
                        <div className="mt-2 p-2 border border-border rounded-md bg-background/50">
                            <div className="flex items-center gap-2 mb-1">
                                <FileText size={16} className="text-muted-foreground"/>
                                <span className="font-medium text-xs">{message.data.fileName}</span>
                            </div>
                            {message.data.status === 'uploading' && <Progress value={0} className="h-1.5"/>}
                            {message.data.status === 'processing' && <Progress value={message.data.progress || 50} className="h-1.5"/>}
                            {message.data.status === 'completed' && <div className="text-xs text-accent-success flex items-center gap-1"><CheckCircle size={14}/>Completed</div>}
                            {message.data.status === 'failed' && <div className="text-xs text-destructive flex items-center gap-1"><XCircle size={14}/>Failed</div>}
                            {message.data.summary && (
                                <details className="mt-2">
                                    <summary className="text-xs cursor-pointer text-muted-foreground">View Summary</summary>
                                    <p className="text-xs mt-1 p-1 bg-muted rounded">{message.data.summary}</p>
                                </details>
                            )}
                        </div>
                    )}
                    {message.type === 'product_card' && message.data && Array.isArray(message.data) && (
                      <div className="mt-2 space-y-2">
                        {(message.data as Product[]).map(product => (
                          <Card key={product.id} className="bg-muted/50">
                            <CardHeader className="p-3">
                              {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={80} height={80} className="rounded-md mb-2 object-cover" data-ai-hint="product item" />}
                              <CardTitle className="text-sm">{product.name}</CardTitle>
                              <CardDescription className="text-xs">SKU: {product.sku}</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 text-xs">
                              <p>{product.description}</p>
                              <p className="mt-1"><strong>Availability:</strong> {product.availability}</p>
                              {product.price && <p><strong>Price:</strong> {product.price}</p>}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                     {message.type === 'error' && (
                      <p className="text-xs text-destructive mt-1">Error: Could not process request.</p>
                    )}
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {message.sender === 'ai' && message.type !== 'error' && (
                        <>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => handleCopy(message.content)}><Copy size={14}/></Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => handleTTS(message.content)}>
                            {isSpeaking ? <Volume2 size={14} className="text-secondary-gradient"/> : <Volume2 size={14}/>}
                          </Button>
                          <Button variant="ghost" size="icon" className={`h-6 w-6 ${message.feedback === 'liked' ? 'text-accent-success' : 'text-muted-foreground hover:text-accent-success'}`} onClick={() => handleFeedback(message.id, 'liked')}><ThumbsUp size={14}/></Button>
                          <Button variant="ghost" size="icon" className={`h-6 w-6 ${message.feedback === 'disliked' ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`} onClick={() => handleFeedback(message.id, 'disliked')}><ThumbsDown size={14}/></Button>
                        </>
                      )}
                      {message.sender === 'user' && !editingMessage && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground" onClick={() => startEdit(message)}><Edit size={14}/></Button>
                      )}
                    </div>
                  </>
                )}
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{MOCK_USER.name.substring(0,1)}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start">
               <Avatar className="h-8 w-8 border-2 border-secondary-gradient">
                  <AvatarFallback><BotMessageSquare size={18}/></AvatarFallback>
                </Avatar>
              <div className="max-w-[70%] p-3 rounded-xl shadow bg-card text-card-foreground rounded-tl-none">
                <div className="flex items-center space-x-1">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className="relative">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message or drop files..."
            className="pr-28 pl-24 min-h-[52px] resize-none bg-input text-foreground focus-visible:ring-1 focus-visible:ring-ring" // Changed pl-10 to pl-24
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
          />
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center">
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
              <Paperclip />
              <span className="sr-only">Attach file</span>
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <Button variant="ghost" size="icon" disabled> {/* Mic still disabled for now */}
              <Mic />
              <span className="sr-only">Use microphone</span>
            </Button>
          </div>
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-gradient text-primary-foreground hover:opacity-90" 
            onClick={handleSendMessage}
            disabled={isLoading || (!inputValue.trim() && !(activeConversation?.messages.some(msg => msg.attachments && msg.attachments.length > 0 && msg.processing)))}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <SendHorizonal />}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
