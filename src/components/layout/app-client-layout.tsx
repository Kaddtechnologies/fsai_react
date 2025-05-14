
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
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
  Loader2,
} from 'lucide-react';
import type { Conversation } from '@/lib/types';
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


interface AppClientLayoutProps {
  children: ReactNode;
}

const MOCK_USER = {
  name: "Flowserve User",
  email: "user@flowserve.ai",
  avatarUrl: "https://placehold.co/100x100.png", // data-ai-hint: "profile avatar"
};

export default function AppClientLayout({ children }: AppClientLayoutProps) {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedConversations = localStorage.getItem('flowserveai-conversations');
    let loadedConversations: Conversation[] = [];
    if (storedConversations) {
      try {
        loadedConversations = JSON.parse(storedConversations);
        setConversations(loadedConversations);
      } catch (e) {
        console.error("Failed to parse conversations from localStorage", e);
        localStorage.removeItem('flowserveai-conversations');
      }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const chatIdFromUrl = urlParams.get('chatId');
    const storedActiveId = localStorage.getItem('flowserveai-activeConversationId');

    if (chatIdFromUrl) {
      setActiveConversationId(chatIdFromUrl);
      if(chatIdFromUrl !== storedActiveId) {
        localStorage.setItem('flowserveai-activeConversationId', chatIdFromUrl);
      }
    } else if (storedActiveId && loadedConversations.find(c => c.id === storedActiveId)) {
      setActiveConversationId(storedActiveId);
      if (pathname === '/') { // Only redirect if on chat page
         router.replace(`/?chatId=${storedActiveId}`);
      }
    } else if (loadedConversations.length > 0 && pathname ==='/') { // Only redirect if on chat page and no other ID set
      const firstConvId = loadedConversations[0].id;
      setActiveConversationId(firstConvId);
      router.replace(`/?chatId=${firstConvId}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted, pathname]); // Added pathname to re-evaluate if user navigates manually

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('flowserveai-conversations', JSON.stringify(conversations));
    }
  }, [conversations, isMounted]);
  
  useEffect(() => {
    if (isMounted && activeConversationId) {
      localStorage.setItem('flowserveai-activeConversationId', activeConversationId);
    }
  }, [activeConversationId, isMounted]);


  const createNewChat = async () => {
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat', 
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    const updatedConversations = [newConversation, ...conversations];
    setConversations(updatedConversations);
    setActiveConversationId(newConversationId);

    if (isMounted) {
      localStorage.setItem('flowserveai-conversations', JSON.stringify(updatedConversations));
      localStorage.setItem('flowserveai-activeConversationId', newConversationId);
    }
    
    router.push(`/?chatId=${newConversationId}`);
    toast({ title: "New chat created" });
  };

  const requestDeleteConversation = (id: string) => {
    setDeletingConvId(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteConversation = () => {
    if (!deletingConvId) return;

    const currentConversations = conversations; // Capture current state for filtering
    const remainingConversations = currentConversations.filter(conv => conv.id !== deletingConvId);
    setConversations(remainingConversations);

    if (activeConversationId === deletingConvId) {
      const newActiveId = remainingConversations.length > 0 ? remainingConversations[0].id : null;
      setActiveConversationId(newActiveId);
      if (newActiveId) {
        router.push(`/?chatId=${newActiveId}`);
      } else {
        router.push('/'); 
      }
    }
    toast({ title: "Conversation deleted", variant: "destructive" });
    setDeleteConfirmOpen(false);
    setDeletingConvId(null);
  };
  
  const renameConversation = (id: string, currentTitle: string) => {
    const newTitle = window.prompt("Enter new title for the chat:", currentTitle);
    if (newTitle && newTitle.trim() && newTitle.trim() !== currentTitle) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === id ? { ...conv, title: newTitle.trim(), updatedAt: Date.now() } : conv
        )
      );
      toast({ title: "Conversation renamed" });
    } else if (newTitle === "") { // User entered empty string
      toast({ title: "Rename cancelled", description: "Title cannot be empty.", variant: "destructive"});
    } else if (newTitle !== null) { // User clicked OK but title is same or only whitespace
       toast({ title: "Rename cancelled", description: "Title was not changed.", variant: "default"});
    }
    // If newTitle is null (user clicked cancel), do nothing
  };


  if (!isMounted) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r border-sidebar-border">
        <SidebarHeader className="p-4 items-center">
          <Link href="/" className="flex items-center gap-2">
            <BotMessageSquare className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">FlowserveAI</h1>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center bg-primary-gradient text-primary-foreground hover:opacity-90" onClick={createNewChat}>
                <MessageSquarePlus />
                <span className="group-data-[collapsible=icon]:hidden ml-2">New Chat</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Conversations</span>
            </SidebarGroupLabel>
            <ScrollArea className="h-[calc(100vh-380px)] group-data-[collapsible=icon]:h-[calc(100vh-280px)]">
              <SidebarMenu>
                {conversations.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <Link href={`/?chatId=${conv.id}`} passHref legacyBehavior>
                      <SidebarMenuButton
                        isActive={activeConversationId === conv.id && pathname === '/'}
                        onClick={() => {
                          setActiveConversationId(conv.id);
                        }}
                        className="truncate group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
                        tooltip={conv.title}
                      >
                        <BotMessageSquare />
                        <span className="group-data-[collapsible=icon]:hidden truncate flex-1">{conv.title}</span>
                      </SidebarMenuButton>
                    </Link>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 group-data-[collapsible=icon]:hidden">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          <DropdownMenuItem onClick={() => renameConversation(conv.id, conv.title) }>
                            <Edit3 className="mr-2 h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => requestDeleteConversation(conv.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
             <SidebarGroupLabel>Tools</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/translate" passHref legacyBehavior>
                  <SidebarMenuButton isActive={pathname === '/translate'} tooltip="Translate">
                    <Languages />
                    <span className="group-data-[collapsible=icon]:hidden">Translate</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton tooltip="Documents" disabled>
                  <FileText /> <span className="group-data-[collapsible=icon]:hidden">Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Products" disabled>
                  <Briefcase /> <span className="group-data-[collapsible=icon]:hidden">Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border">
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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled><Users className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem disabled><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled>
                <LogOut className="mr-2 h-4 w-4" /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2">
             <SidebarTrigger className="md:hidden" />
             <h2 className="text-lg font-semibold">
                {pathname === '/' && activeConversationId ? (conversations.find(c=>c.id === activeConversationId)?.title || 'Chat') : 
                 pathname === '/translate' ? 'Translation Module' : 'FlowserveAI'}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group-data-[collapsible=icon]:hidden">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search everything..." className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[300px]" />
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
            <AlertDialogCancel onClick={() => setDeletingConvId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}
