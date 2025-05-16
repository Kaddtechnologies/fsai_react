
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  SidebarProvider, // Reverted alias
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BotMessageSquare,
  FileText,
  Languages,
  MessageSquarePlus,
  Search,
  Settings,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronRight,
  LogOut,
  Users,
  Briefcase,
  Paperclip,
  HelpCircle,
  Package,
  FileQuestion,
  Brain,
} from 'lucide-react';
import type { Conversation, Message, ConversationType, Document } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import WelcomeDialog from '@/components/help/welcome-dialog';

// Define Loader2 directly in the file
const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

interface AppClientLayoutProps {
  children: ReactNode;
}

const MOCK_USER = {
  name: "Flowserve User",
  email: "user@flowserve.ai",
  avatarUrl: "https://placehold.co/100x100.png", // data-ai-hint: "profile avatar"
};

const formatRelativeLocale = {
  lastWeek: "eeee", // e.g., "Monday"
  yesterday: "'Yesterday'",
  today: "'Today'",
  tomorrow: "'Tomorrow'",
  nextWeek: "eeee",
  other: "MMM d", // e.g., "Sep 12"
};

const formatRelativeCustom = (date: number | Date, baseDate: number | Date) => {
  try {
    return formatRelative(date, baseDate, {
      locale: { ...enUS, formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale] || formatRelativeLocale.other, }
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid date"; // Fallback for invalid dates
  }
};

const getConversationType = (messages: Message[]): ConversationType => {
  const hasDocumentMessages = messages.some(msg => msg.type === 'document_summary' || msg.type === 'document_upload_status' || (msg.attachments && msg.attachments.length > 0));
  const hasProductMessages = messages.some(msg => msg.type === 'product_card');

  if (hasDocumentMessages && hasProductMessages) return 'mixed';
  if (hasDocumentMessages) return 'document';
  if (hasProductMessages) return 'product';
  return 'ai';
};

const ConversationTypeIcon = ({ type }: { type: ConversationType }) => {
  switch (type) {
    case 'document': return <FileQuestion size={14} className="text-sidebar-primary shrink-0" />;
    case 'product': return <Package size={14} className="text-sidebar-primary shrink-0" />;
    case 'mixed': return <Brain size={14} className="text-sidebar-primary shrink-0" />;
    case 'ai':
    default: return <BotMessageSquare size={14} className="text-sidebar-foreground/70 shrink-0" />;
  }
};

export default function AppClientLayout({ children }: AppClientLayoutProps): JSX.Element {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null);
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);

  const loadStateFromLocalStorage = useCallback(() => {
    if (typeof window === 'undefined') return;
    const storedConversations = localStorage.getItem('flowserveai-conversations');
    let loadedConversations: Conversation[] = [];
    if (storedConversations) {
      try {
        loadedConversations = JSON.parse(storedConversations);
        loadedConversations.sort((a, b) => b.updatedAt - a.updatedAt);
      } catch (e) {
        console.error("Failed to parse conversations from localStorage", e);
        localStorage.removeItem('flowserveai-conversations');
      }
    }
    setConversations(loadedConversations);

    const chatIdFromUrl = searchParams.get('chatId');
    const storedActiveId = localStorage.getItem('flowserveai-activeConversationId');

    let currentActiveId = chatIdFromUrl;

    if (!currentActiveId && storedActiveId && loadedConversations.find(c => c.id === storedActiveId)) {
      currentActiveId = storedActiveId;
    }
    if (!currentActiveId && loadedConversations.length > 0 && pathname === '/') {
      currentActiveId = loadedConversations[0].id;
    }
    
    setActiveConversationId(currentActiveId);

    if (currentActiveId) {
      if(currentActiveId !== storedActiveId) {
        localStorage.setItem('flowserveai-activeConversationId', currentActiveId);
      }
      if (pathname === '/' && (!chatIdFromUrl || chatIdFromUrl !== currentActiveId)) {
         const documentIdToDiscuss = searchParams.get('documentIdToDiscuss');
         router.replace(`/?chatId=${currentActiveId}${documentIdToDiscuss ? `&documentIdToDiscuss=${documentIdToDiscuss}`: ''}`, { scroll: false });
      }
    } else if (pathname === '/' && chatIdFromUrl) {
      router.replace('/', {scroll: false});
    }
  }, [pathname, router, searchParams]);


  useEffect(() => {
    setIsMounted(true);
    loadStateFromLocalStorage();

    const handleStorageUpdate = (event: StorageEvent | CustomEvent) => {
      let key: string | null = null;
      if (event instanceof StorageEvent) {
          key = event.key;
      } else if (event instanceof CustomEvent && event.detail) {
          key = event.detail.key;
      }

      if (key === 'flowserveai-conversations' || key === 'flowserveai-activeConversationId') {
        loadStateFromLocalStorage();
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('flowserveai-storage-updated', handleStorageUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('flowserveai-storage-updated', handleStorageUpdate as EventListener);
    };
  }, [loadStateFromLocalStorage]);


  useEffect(() => {
    if (isMounted && conversations.length > 0) {
      const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem('flowserveai-conversations', JSON.stringify(sortedConversations));
    } else if (isMounted && conversations.length === 0) {
      localStorage.removeItem('flowserveai-conversations');
      localStorage.removeItem('flowserveai-activeConversationId');
    }
  }, [conversations, isMounted]);

  useEffect(() => {
    if (isMounted && activeConversationId) {
      localStorage.setItem('flowserveai-activeConversationId', activeConversationId);
    } else if (isMounted && !activeConversationId && conversations.length === 0) {
       localStorage.removeItem('flowserveai-activeConversationId');
    }
  }, [activeConversationId, isMounted, conversations.length]);


  const createNewChat = async () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setConversations(prev => [newConversation, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
    setActiveConversationId(newConversationId);
    router.push(`/?chatId=${newConversationId}`);
    toast({ title: "New chat created" });
  };

  const requestDeleteConversation = (id: string) => {
    setDeletingConvId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteConversation = () => {
    if (!deletingConvId) return;

    const updatedConversations = conversations.filter(conv => conv.id !== deletingConvId);
    setConversations(updatedConversations);

    if (activeConversationId === deletingConvId) {
      const newActiveId = updatedConversations.length > 0 ? updatedConversations[0].id : null;
      setActiveConversationId(newActiveId);
      if (newActiveId) {
        router.push(`/?chatId=${newActiveId}`);
      } else {
        router.push('/');
      }
    }
    toast({ title: "Conversation deleted" });
    setDeleteConfirmOpen(false);
    setDeletingConvId(null);
  };

  const renameConversation = (id: string, currentTitle: string) => {
    const newTitle = window.prompt("Enter new title for the chat:", currentTitle);
    if (newTitle && newTitle.trim() && newTitle.trim() !== currentTitle) {
      setConversations(prev =>
        prev.map(conv =>
          conv.id === id ? { ...conv, title: newTitle.trim(), updatedAt: Date.now() } : conv
        ).sort((a,b) => b.updatedAt - a.updatedAt)
      );
      toast({ title: "Conversation renamed" });
    } else if (newTitle !== null && newTitle.trim() === "") {
      toast({ title: "Rename cancelled", description: "Title cannot be empty.", variant: "destructive"});
    } else if (newTitle !== null && newTitle.trim() === currentTitle) {
       toast({ title: "Rename cancelled", description: "Title was not changed.", variant: "default"});
    } else if (newTitle === null) {
      toast({ title: "Rename cancelled", variant: "default"});
    }
  };

  const checkHasDocuments = (messages: Message[]): boolean => {
    return messages.some(msg => msg.attachments && msg.attachments.some(att => att.status === 'completed'));
  };


  if (!isMounted) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4 items-center">
          <Link href="/" className="flex items-center gap-2" onClick={() => {
             if (pathname === '/') {
                if (conversations.length > 0 && !activeConversationId) {
                    const firstConvId = conversations[0].id;
                    setActiveConversationId(firstConvId);
                    router.push(`/?chatId=${firstConvId}`);
                }
             }
          }}>
            <BotMessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">FlowserveAI</h1>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center bg-primary-gradient text-primary-foreground hover:opacity-90" onClick={createNewChat}>
                <MessageSquarePlus /> <span className="group-data-[collapsible=icon]:hidden ml-2">New Chat</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="flex items-center justify-between"> <span>Conversations</span> </SidebarGroupLabel>
            <ScrollArea className="h-[calc(100vh-480px)] group-data-[collapsible=icon]:h-[calc(100vh-380px)]">
              <SidebarMenu>
                {conversations.map((conv) => {
                  const hasDocuments = checkHasDocuments(conv.messages);
                  const formattedDate = formatRelativeCustom(new Date(conv.updatedAt), new Date());
                  const displayTitle = conv.title;
                  const convType = getConversationType(conv.messages);

                  return (
                  <SidebarMenuItem
                    key={conv.id}
                    className="flex items-center justify-between border-b border-sidebar-border/20 last:border-b-0 py-1.5 px-1"
                  >
                    <Link
                        href={`/?chatId=${conv.id}`}
                        className="flex-grow min-w-0"
                        onClick={() => setActiveConversationId(conv.id)}
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={activeConversationId === conv.id && pathname === '/'}
                        className={cn(
                            "w-full h-auto flex-col items-start p-2.5",
                            {"bg-sidebar-accent/80 hover:bg-sidebar-accent": activeConversationId === conv.id && pathname === '/'},
                            "group-data-[collapsible=icon]:flex-row group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:h-12"
                        )}
                        tooltip={{
                          children: <div className="max-w-xs break-words p-1" title={displayTitle}>{displayTitle}</div>,
                           hidden: !(isMounted && (typeof window !== 'undefined' && window.innerWidth >= 768) && document.querySelector('[data-sidebar="sidebar"]')?.getAttribute('data-state') === 'collapsed' && (pathname === '/' || pathname.startsWith('/?chatId'))),
                        }}
                      >
                        <div>
                          <div className="flex items-center w-full group-data-[collapsible=icon]:justify-center" title={displayTitle}>
                            <ConversationTypeIcon type={convType} />
                            <span
                              className="ml-2 group-data-[collapsible=icon]:hidden truncate flex-1 min-w-0"
                              style={{maxWidth: '160px'}}
                              title={displayTitle}
                            >
                              {displayTitle}
                            </span>
                          </div>
                          <div className={cn(
                              "text-xs text-sidebar-foreground/80 mt-1.5 flex items-center justify-between w-full",
                              "group-data-[collapsible=icon]:hidden"
                          )}>
                            <span className="flex items-center gap-1 cursor-default">
                              {hasDocuments && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center cursor-default">
                                      <Paperclip size={12} className="shrink-0 text-sidebar-primary" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="p-1.5 text-xs bg-popover text-popover-foreground">
                                    <p>Contains documents</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </span>
                            <span className="truncate">
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </Link>
                    <div className="flex-shrink-0 group-data-[collapsible=icon]:hidden ml-1 mr-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-7 w-7">
                                <ChevronDown className="h-4 w-4 text-sidebar-foreground/70 hover:text-sidebar-foreground" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem onClick={() => renameConversation(conv.id, conv.title) }> <Edit3 className="mr-2 h-4 w-4" /> Rename </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => requestDeleteConversation(conv.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10"> <Trash2 className="mr-2 h-4 w-4" /> Delete </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                );
              })}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
             <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/documents" passHref legacyBehavior={false}>
                  <SidebarMenuButton isActive={pathname === '/documents'} tooltip="Documents">
                    <FileText /> <span className="group-data-[collapsible=icon]:hidden">Documents</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/translate" passHref legacyBehavior={false}>
                  <SidebarMenuButton isActive={pathname === '/translate'} tooltip="Translate">
                    <Languages /> <span className="group-data-[collapsible=icon]:hidden">Translate</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Products" disabled>
                  <Briefcase /> <span className="group-data-[collapsible=icon]:hidden">Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setIsWelcomeDialogOpen(true)} tooltip="Help & Information">
                    <HelpCircle /> <span className="group-data-[collapsible=icon]:hidden">Help & Information</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>

           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={MOCK_USER.avatarUrl} alt={MOCK_USER.name} data-ai-hint="profile avatar"/>
                  <AvatarFallback>{MOCK_USER.name.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="ml-2 group-data-[collapsible=icon]:hidden text-left">
                  <p className="text-sm font-medium truncate">{MOCK_USER.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{MOCK_USER.email}</p>
                </div>
                 <ChevronRight className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel> <DropdownMenuSeparator />
              <DropdownMenuItem disabled><Users className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem disabled><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled> <LogOut className="mr-2 h-4 w-4" /> Log out </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" />
             <h2 className="text-lg font-semibold truncate max-w-[calc(100vw-150px)] sm:max-w-xs md:max-w-md">
                {pathname === '/' && activeConversationId ? (conversations.find(c=>c.id === activeConversationId)?.title || 'Chat') :
                 pathname === '/translate' ? 'Translation Module' :
                 pathname === '/documents' ? 'Documents' :
                 'FlowserveAI'}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group-data-[collapsible=icon]:hidden">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search everything..." className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[300px]" disabled />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {children}
        </main>
      </SidebarInset>
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the conversation titled &quot;{conversations.find(c => c.id === deletingConvId)?.title || 'Selected Chat'}&quot; and all of its messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeletingConvId(null); setDeleteConfirmOpen(false); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation} className={buttonVariants({ variant: "destructive" })}> Delete </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setIsWelcomeDialogOpen} />
    </SidebarProvider>
  );
}

    