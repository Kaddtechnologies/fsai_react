
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
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
  FileSliders,
  Grid2x2,
} from 'lucide-react';
import type { Conversation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { generateChatTitle } from '@/ai/flows/generate-chat-title';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AppClientLayoutProps {
  children: ReactNode;
}

// Mock user data
const MOCK_USER = {
  name: "Flowserve User",
  email: "user@flowserve.ai",
  avatarUrl: "https://placehold.co/100x100.png", // data-ai-hint: "profile avatar"
};

export default function AppClientLayout({ children }: AppClientLayoutProps) {
  const { toast } = useToast();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Load conversations from local storage (or API in a real app)
    const storedConversations = localStorage.getItem('flowserveai-conversations');
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    }
    const storedActiveId = localStorage.getItem('flowserveai-activeConversationId');
    if(storedActiveId) {
      setActiveConversationId(storedActiveId);
    } else if (conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, []);

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
    // Placeholder title, will be updated after first message
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    // In a real app, you'd navigate to /chat/[newConversationId] or update context
    // For this structure, page.tsx will pick up activeConversationId
    if (pathname !== '/') {
      // Potentially navigate, or rely on page.tsx to handle activeConversationId
    }
    toast({ title: "New chat created" });
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(conversations.length > 1 ? conversations.find(c => c.id !== id)?.id || null : null);
    }
    toast({ title: "Conversation deleted", variant: "destructive" });
  };
  
  const renameConversation = (id: string, newTitle: string) => {
    setConversations(prev => prev.map(conv => conv.id === id ? { ...conv, title: newTitle, updatedAt: Date.now() } : conv));
    toast({ title: "Conversation renamed" });
  };


  if (!isMounted) {
    // Prevent hydration mismatch by not rendering UI that relies on localStorage until mounted
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><BotMessageSquare className="h-12 w-12 animate-pulse text-primary" /></div>;
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
                        onClick={() => setActiveConversationId(conv.id)}
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
                          <DropdownMenuItem onClick={() => {
                            const newTitle = prompt("Enter new title:", conv.title);
                            if (newTitle) renameConversation(conv.id, newTitle);
                          }}>
                            <Edit3 className="mr-2 h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteConversation(conv.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
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
              {/* Placeholder for future tools */}
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
             <SidebarTrigger className="md:hidden" /> {/* Mobile toggle */}
             <h2 className="text-lg font-semibold">
                {pathname === '/' && activeConversationId ? conversations.find(c=>c.id === activeConversationId)?.title : 
                 pathname === '/translate' ? 'Translation Module' : 'FlowserveAI'}
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group-data-[collapsible=icon]:hidden">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search everything..." className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[300px]" />
            </div>
            {/* Add other header items like notifications or quick actions here */}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          {/* Pass conversations and active ID management functions to children if needed via context or props */}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    