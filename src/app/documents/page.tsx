
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, FileSpreadsheet, FileType as FileTypeLucideIcon, FileSearch, MessageSquarePlus, AlertTriangle, FolderOpen, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription as DialogDescriptionComponent, DialogClose } from "@/components/ui/dialog";
import type { Conversation, Document } from '@/lib/types';
import { format } from 'date-fns';
// Removed: import ReactMarkdown from 'react-markdown';

const FileTypeIcon = ({ type, size = 20 }: { type: Document['type'], size?: number }) => {
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

const DocumentsPage = () => {
  const router = useRouter();
  const [allDocuments, setAllDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullSummaryModal, setShowFullSummaryModal] = useState(false);
  const [modalSummaryContent, setModalSummaryContent] = useState<{title: string, content: string} | null>(null);


  useEffect(() => {
    const storedConversations = localStorage.getItem('flowserveai-conversations');
    if (storedConversations) {
      try {
        const conversations: Conversation[] = JSON.parse(storedConversations);
        const uniqueDocumentsMap = new Map<string, Document>();

        conversations.forEach(conv => {
          conv.messages.forEach(msg => {
            if (msg.attachments && msg.attachments.length > 0) {
              msg.attachments.forEach(doc => {
                // Only add if completed and not already in map (prefer latest version if multiple client IDs exist for same backendId/name)
                if (doc.status === 'completed' && !uniqueDocumentsMap.has(doc.backendId || doc.id)) {
                   uniqueDocumentsMap.set(doc.backendId || doc.id, doc);
                }
              });
            }
          });
        });
        const docsArray = Array.from(uniqueDocumentsMap.values()).sort((a, b) => b.uploadedAt - a.uploadedAt);
        setAllDocuments(docsArray);
      } catch (e) {
        console.error("Failed to parse documents from localStorage", e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleChatAboutDocument = (docId: string) => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: `Chat about ${allDocuments.find(d => (d.backendId || d.id) === docId)?.name || 'Document'}`,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const storedConversations = localStorage.getItem('flowserveai-conversations');
    let conversations: Conversation[] = [];
    if (storedConversations) {
      conversations = JSON.parse(storedConversations);
    }
    const updatedConversations = [newConversation, ...conversations].sort((a,b) => b.updatedAt - a.updatedAt);
    localStorage.setItem('flowserveai-conversations', JSON.stringify(updatedConversations));
    localStorage.setItem('flowserveai-activeConversationId', newConversationId);
    
    router.push(`/?chatId=${newConversationId}&documentIdToDiscuss=${docId}`);
  };
  
  const handleShowFullSummary = (docName: string, summary: string) => {
    setModalSummaryContent({ title: `Full Summary: ${docName}`, content: summary });
    setShowFullSummaryModal(true);
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (allDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <FolderOpen className="w-24 h-24 mb-6 text-primary opacity-50" />
        <h2 className="text-2xl font-semibold mb-2 text-foreground">No Documents Found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          You haven't uploaded any documents yet. Upload documents in any chat to see them here.
        </p>
        <Button asChild>
          <Link href="/">Go to Chat</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="shadow-2xl">
        <CardHeader className="text-center border-b">
          <FileSearch className="w-12 h-12 mx-auto text-primary mb-2" />
          <CardTitle className="text-3xl font-bold">My Documents</CardTitle>
          <CardDescription>Browse and manage all your uploaded documents.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)]"> {/* Adjust height as needed */}
            <div className="divide-y divide-border">
              {allDocuments.map(doc => (
                <div key={doc.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileTypeIcon type={doc.type} size={28} />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-medium text-foreground truncate" title={doc.name}>{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {format(new Date(doc.uploadedAt), "MMM d, yyyy HH:mm")} | Size: {(doc.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        {doc.summary && (
                           <div className="mt-1">
                               <details>
                                   <summary className="text-xs cursor-pointer text-muted-foreground hover:underline">View Summary Snippet</summary>
                                   <p className="text-xs mt-1 p-1.5 bg-muted rounded whitespace-pre-wrap max-h-20 overflow-y-auto">{doc.summary}</p>
                               </details>
                               <Button variant="link" size="sm" className="text-xs h-auto p-0 mt-0.5" onClick={() => handleShowFullSummary(doc.name, doc.summary || '')}>
                                   <Eye size={12} className="mr-1" /> View Full Raw Markdown Summary
                               </Button>
                           </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleChatAboutDocument(doc.backendId || doc.id)}
                      className="shrink-0"
                    >
                      <MessageSquarePlus size={16} className="mr-2" />
                      Chat about Document
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
       {modalSummaryContent && (
        <Dialog open={showFullSummaryModal} onOpenChange={setShowFullSummaryModal}>
          <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{modalSummaryContent.title}</DialogTitle>
              <DialogDescriptionComponent className="text-sm text-muted-foreground">Raw Markdown Preview. Install 'react-markdown' for styled rendering.</DialogDescriptionComponent>
            </DialogHeader>
            <ScrollArea className="flex-1 min-h-0 py-2 pr-3 -mr-2">
              <pre className="block w-full text-sm whitespace-pre-wrap break-words bg-muted p-3 rounded-md">
                {modalSummaryContent.content}
              </pre>
            </ScrollArea>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="mt-4">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DocumentsPage;
    

    