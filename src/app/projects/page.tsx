
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    PlusCircle, Folder, File as FileIcon, Trash2, Edit, ChevronRight, Share2, UploadCloud, 
    Settings, MoreVertical, Search, Check, Image, Sparkles, Globe, Loader2, XCircle,
    FileText, FileSpreadsheet, FileType as FileTypeLucideIcon, CheckCircle, BotMessageSquare, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { summarizeDocument } from '@/ai/flows/summarize-document';
import { generateChatResponse } from '@/ai/flows/generate-chat-response';
import type { Project, Document, Message } from '@/lib/types';
import { MOCK_USER } from '@/app/utils/constants';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";


const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#8A6FDF', '#FF9F1C'];
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

// Placeholder for a real backend upload function
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
        resolve({ success: true, backendId: `backend-proj-${Date.now()}-${file.name}`, fileUrl: `https://example.com/uploads/projects/${file.name}` });
      }
    }, 2000 + Math.random() * 1000);
  });
}

const FileTypeIcon = ({ type, size = 20 }: { type: Document['type'], size?: number }) => {
    switch (type) {
      case 'pdf': return <FileText size={size} className="text-red-500" />;
      case 'excel': return <FileSpreadsheet size={size} className="text-green-500" />;
      case 'word': return <FileText size={size} className="text-blue-500" />;
      case 'powerpoint': return <FileTypeLucideIcon size={size} className="text-orange-500" />;
      case 'text': return <FileText size={size} className="text-gray-500" />;
      default: return <FileIcon size={size} className="text-muted-foreground" />;
    }
  };


const ProjectsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState(COLORS[0]);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for project chat
  const [chatInputValue, setChatInputValue] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);


  useEffect(() => {
    const storedProjects = localStorage.getItem('flowserveai-projects');
    if (storedProjects) {
      try {
        const parsedProjects: Project[] = JSON.parse(storedProjects);
        setProjects(parsedProjects);
        
        const projectId = searchParams.get('projectId');
        if (projectId) {
            const project = parsedProjects.find(p => p.id === projectId);
            setActiveProject(project || null);
            setChatMessages(project?.messages || []);
        }

      } catch (error) {
        console.error("Failed to parse projects from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (projects.length > 0 || localStorage.getItem('flowserveai-projects')) {
        localStorage.setItem('flowserveai-projects', JSON.stringify(projects));
    }
    // Announce the change to other components like the sidebar
    window.dispatchEvent(new CustomEvent('flowserveai-storage-updated', { detail: { key: 'flowserveai-projects' } }));
  }, [projects]);


  useEffect(() => {
    const projectId = searchParams.get('projectId');
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      setActiveProject(project || null);
      setChatMessages(project?.messages || []);
    } else {
      setActiveProject(null);
      setChatMessages([]);
    }
  }, [searchParams, projects]);

  const updateProjectProperty = <K extends keyof Project>(projectId: string, property: K, value: Project[K]) => {
    setProjects(prevProjects => 
        prevProjects.map(p => {
            if (p.id === projectId) {
                return { ...p, [property]: value, updatedAt: Date.now() };
            }
            return p;
        }).sort((a,b) => b.updatedAt - a.updatedAt)
    );
  };
  
  const updateProjectFile = (projectId: string, fileId: string, updates: Partial<Document>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const updatedFiles = project.files.map(f => f.id === fileId ? { ...f, ...updates } : f);
    updateProjectProperty(projectId, 'files', updatedFiles);
  };


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeProject) return;

    setIsUploading(true);
    let allUploadsSuccessful = true;

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({ title: "File Too Large", description: `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB limit.`, variant: "destructive" });
        allUploadsSuccessful = false;
        continue;
      }
  
      const docType = getDocumentTypeFromMime(file.type, file.name);
      if (!docType) {
        toast({ title: "Invalid File Type", description: `"${file.name}" is not a supported file type.`, variant: "destructive" });
        allUploadsSuccessful = false;
        continue;
      }
  
      const clientDocumentId = `doc-proj-${Date.now()}-${file.name}`;
      const initialDocument: Document = {
        id: clientDocumentId, name: file.name, type: docType, uploadedAt: Date.now(),
        size: file.size, status: 'pending_upload', progress: 0,
      };

      // Add file to active project state immediately
      const currentProject = projects.find(p => p.id === activeProject.id);
      if (currentProject) {
        const updatedFiles = [initialDocument, ...(currentProject.files || [])];
        updateProjectProperty(activeProject.id, 'files', updatedFiles);
      }
      
      // Simulate upload
      updateProjectFile(activeProject.id, clientDocumentId, { status: 'uploading_to_backend', progress: 10 });
      const backendResult = await uploadFileToBackend(file, (p) => {
        updateProjectFile(activeProject.id, clientDocumentId, { progress: p });
      });

      if (!backendResult.success || !backendResult.backendId) {
        updateProjectFile(activeProject.id, clientDocumentId, { status: 'failed', error: backendResult.error || "Backend upload failed." });
        allUploadsSuccessful = false;
        continue;
      }

      updateProjectFile(activeProject.id, clientDocumentId, { backendId: backendResult.backendId, fileUrl: backendResult.fileUrl, status: 'pending_ai_processing' });

      // Simulate AI summarization
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        updateProjectFile(activeProject.id, clientDocumentId, { status: 'ai_processing', progress: 75, dataUri });
        try {
          const summaryResponse = await summarizeDocument({ documentDataUri: dataUri });
          updateProjectFile(activeProject.id, clientDocumentId, { summary: summaryResponse.summary, status: 'completed', progress: 100 });
        } catch (aiError) {
          console.error("AI summarization error:", aiError);
          updateProjectFile(activeProject.id, clientDocumentId, { status: 'failed', error: "AI processing failed." });
          allUploadsSuccessful = false;
        }
      };
      reader.onerror = () => {
        updateProjectFile(activeProject.id, clientDocumentId, { status: 'failed', error: "Failed to read file for AI processing." });
        allUploadsSuccessful = false;
      };
    }
    
    if (allUploadsSuccessful) {
        toast({ title: "Uploads Complete", description: "All files have been processed." });
    } else {
        toast({ title: "Uploads Finished with Errors", description: "Some files could not be processed.", variant: "destructive" });
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const handleCreateProject = () => {
    if (newProjectName.trim() === '') return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: newProjectName,
      color: newProjectColor,
      files: [],
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedProjects = [...projects, newProject].sort((a, b) => b.createdAt - a.createdAt);
    setProjects(updatedProjects);
    
    setNewProjectName('');
    setNewProjectColor(COLORS[0]);
    setIsCreateProjectDialogOpen(false);
    router.push(`/projects?projectId=${newProject.id}`);
  };
  
  const handleDeleteProject = (projectId: string) => {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      setProjects(updatedProjects);
      if (activeProject?.id === projectId) {
          router.push('/projects');
      }
      toast({ title: "Project Deleted", description: "The project has been successfully deleted." });
  };

  const handleDeleteFile = (fileId: string) => {
    if (!activeProject) return;
    const updatedFiles = activeProject.files.filter(f => f.id !== fileId);
    updateProjectProperty(activeProject.id, 'files', updatedFiles);
    toast({ title: "File removed", description: `File has been removed from the project.` });
  };
  
  const handleProjectChatSend = async () => {
    if (!chatInputValue.trim() || !activeProject) return;
    
    const userMessage: Message = {
      id: `proj-msg-${Date.now()}`,
      conversationId: activeProject.id,
      content: chatInputValue,
      sender: 'user',
      timestamp: Date.now(),
    };
    
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInputValue('');
    setIsChatLoading(true);

    try {
        const historyForAI = updatedMessages
            .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
            .slice(0, -1)
            .map(msg => ({
                role: msg.sender as 'user' | 'ai',
                content: msg.content
            }));
            
        const projectContext = {
            name: activeProject.name,
            fileSummaries: activeProject.files
                .filter(f => f.status === 'completed' && f.summary)
                .map(f => `File: ${f.name}\nSummary: ${f.summary}`)
                .join('\n\n---\n\n')
        };
        
        const aiResult = await generateChatResponse({
            userInput: userMessage.content,
            history: historyForAI,
            projectContext: projectContext
        });

        const aiMessage: Message = {
            id: `proj-msg-${Date.now() + 1}`,
            conversationId: activeProject.id,
            content: aiResult.aiResponse,
            sender: 'ai',
            timestamp: Date.now(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setChatMessages(finalMessages);
        updateProjectProperty(activeProject.id, 'messages', finalMessages);
    } catch(e) {
        console.error("Project chat AI error:", e);
        const errorMessage: Message = {
            id: `proj-msg-err-${Date.now()}`,
            conversationId: activeProject.id,
            content: "Sorry, I encountered an error. Please try again.",
            sender: 'ai',
            timestamp: Date.now(),
            type: 'error',
        };
        const finalMessages = [...updatedMessages, errorMessage];
        setChatMessages(finalMessages);
        updateProjectProperty(activeProject.id, 'messages', finalMessages);
        toast({ title: "AI Error", description: "Could not get a response.", variant: "destructive" });
    } finally {
        setIsChatLoading(false);
    }
  };


  const renderProjectList = () => (
    <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Projects</h1>
            <Button onClick={() => setIsCreateProjectDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Project
            </Button>
        </div>
      {projects.length === 0 ? (
        <Card className="text-center p-8 border-dashed">
            <Folder className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first project.</p>
          <Button className="mt-4" onClick={() => setIsCreateProjectDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Create Project
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex-grow cursor-pointer" onClick={() => router.push(`/projects?projectId=${project.id}`)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }}></span>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>{project.files.length} files</p>
                    <p>Updated: {new Date(project.updatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </div>
              <div className="p-4 pt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full" onClick={(e) => e.stopPropagation()}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project "{project.name}".
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderProjectDetail = () => {
    if (!activeProject) return null;

    return (
    <TooltipProvider>
        <div className="flex h-full gap-6">
            {/* Main Content: Files and Chat */}
            <div className="flex-1 flex flex-col gap-6">
                {/* File Management */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Project Knowledge</CardTitle>
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                            {isUploading ? 'Uploading...' : 'Upload Files'}
                        </Button>
                        <input type="file" ref={fileInputRef} multiple onChange={handleFileUpload} className="hidden" accept={ALLOWED_EXTENSIONS_STRING} />
                    </CardHeader>
                    <CardContent>
                        {activeProject.files.length === 0 ? (
                            <div className="text-center py-8 border-dashed border-2 rounded-lg">
                                <FileIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-medium">No files uploaded</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Upload documents to start building your project's knowledge base.</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-48">
                                <div className="space-y-2">
                                    {activeProject.files.map(file => (
                                        <div key={file.id} className="flex items-center justify-between p-2 rounded-md border">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <FileTypeIcon type={file.type} />
                                                <div className="flex-1 min-w-0">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <p className="font-medium truncate" title={file.name}>{file.name}</p>
                                                        </TooltipTrigger>
                                                        <TooltipContent><p>{file.name}</p></TooltipContent>
                                                    </Tooltip>
                                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                                        {(file.status === 'uploading_to_backend' || file.status === 'ai_processing') && file.progress < 100 && (
                                                            <Progress value={file.progress} className="w-24 h-1" />
                                                        )}
                                                        {file.status === 'completed' && <CheckCircle size={14} className="text-green-500" />}
                                                        {file.status === 'failed' && <XCircle size={14} className="text-red-500" title={file.error} />}
                                                        <span>{(file.size / (1024*1024)).toFixed(2)} MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteFile(file.id)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>

                {/* Project Chat */}
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Project Chat</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-end">
                        <ScrollArea className="flex-grow p-4 border rounded-md mb-4 h-96">
                          <div className="space-y-4">
                            {chatMessages.map(msg => (
                                <div key={msg.id} className={cn("flex items-start gap-3", msg.sender === 'user' ? "justify-end" : "justify-start")}>
                                   {msg.sender === 'ai' && (
                                       <Avatar className="h-8 w-8 border-2 border-primary">
                                         <AvatarFallback><BotMessageSquare /></AvatarFallback>
                                       </Avatar>
                                   )}
                                    <div className={cn("max-w-[75%] p-3 rounded-lg shadow-sm", msg.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-card")}>
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                   {msg.sender === 'user' && (
                                       <Avatar className="h-8 w-8">
                                            <AvatarImage src={MOCK_USER.avatarUrl} />
                                            <AvatarFallback>{MOCK_USER.name.substring(0,1)}</AvatarFallback>
                                       </Avatar>
                                   )}
                                </div>
                            ))}
                            {isChatLoading && (
                                <div className="flex items-start gap-3 justify-start">
                                    <Avatar className="h-8 w-8 border-2 border-primary">
                                        <AvatarFallback><BotMessageSquare /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-[75%] p-3 rounded-lg shadow-sm bg-card">
                                        <div className="flex items-center space-x-1"> <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span> <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span> <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span> </div>
                                    </div>
                                </div>
                            )}
                           </div>
                        </ScrollArea>
                         <div className="relative">
                            <Textarea 
                                placeholder={`Chat with ${activeProject.name}...`} 
                                className="pr-20"
                                value={chatInputValue}
                                onChange={(e) => setChatInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleProjectChatSend();
                                    }
                                }}
                                disabled={isChatLoading}
                            />
                             <div className="absolute bottom-2 right-2 flex items-center gap-1">
                                <Button variant="ghost" size="icon" disabled><Sparkles className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" disabled><Image className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" disabled><Globe className="h-4 w-4" /></Button>
                                <Button size="sm" onClick={handleProjectChatSend} disabled={!chatInputValue.trim() || isChatLoading}>
                                  {isChatLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send'}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Sidebar: Details and Connectors */}
            <div className="w-1/3 flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                             <span className="w-4 h-4 rounded-full" style={{ backgroundColor: activeProject.color }}></span>
                            {activeProject.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" className="w-full justify-between" disabled>Edit Project <Edit className="h-4 w-4" /></Button>
                         <Button variant="outline" className="w-full justify-between mt-2" disabled>Share Project <Share2 className="h-4 w-4" /></Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Knowledge Connectors</CardTitle>
                        <CardDescription>Sync external knowledge sources.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <div className="flex items-center justify-between p-3 rounded-md border">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Microsoft_Office_SharePoint_%282019%E2%80%93present%29.svg/2089px-Microsoft_Office_SharePoint_%282019%E2%80%93present%29.svg.png" />
                                    <AvatarFallback>SP</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">SharePoint</span>
                            </div>
                            <Button variant="secondary">Connect</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-md border">
                            <div className="flex items-center gap-3">
                                 <Avatar className="h-8 w-8">
                                    <AvatarImage src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2048px-Microsoft_logo.svg.png" />
                                    <AvatarFallback>M</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">Microsoft 365</span>
                            </div>
                            <Button variant="secondary">Connect</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </TooltipProvider>
    );
  };

  return (
    <div className="container mx-auto py-8">
      {activeProject ? renderProjectDetail() : renderProjectList()}

      <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Organize your knowledge and chats into a new project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-name" className="text-right">Name</Label>
              <Input
                id="project-name"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="col-span-3"
                placeholder="E.g., Q3 Marketing Campaign"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Color</Label>
              <div className="col-span-3 flex gap-2">
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewProjectColor(color)}
                    className="w-8 h-8 rounded-full transition-all"
                    style={{ backgroundColor: color, outline: newProjectColor === color ? `2px solid hsl(var(--ring))` : 'none' }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleCreateProject}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsPage;
 
    