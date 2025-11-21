
"use client";

import type { ReactNode } from 'react';
import { useState, useEffect, useCallback, useRef, useMemo, Fragment, memo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BotMessageSquare,
  FileText,
  Languages,
  MessageSquarePlus,
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
  EllipsisVertical,
  MessageSquare,
  User,
  MessageCircle,
  Menu,
  X,
  Plus,
<<<<<<< HEAD
  Search,
  LucideEdit3
=======
  Folder,
  Search
>>>>>>> ad9e4af (I want to add new features. I want a project feature where users can cre)
} from 'lucide-react';
import type { Conversation, Message, ConversationType, Document, Project } from '@/lib/types';
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatRelative } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import WelcomeDialog from '@/components/help/welcome-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { Separator } from '@/components/ui/separator';
import SettingsSidePanel from '@/components/settings/settings.sidepanel';
import { MOCK_USER } from '@/app/utils/constants';
import useTranslation from '@/app/hooks/useTranslation';
import FeedbackDialog from '@/components/feedback/feedback-dialog';
import SettingsDialog from '@/components/settings/settings-dialog';
// Define Loader2 directly in the file
const Loader2 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
);

interface AppClientLayoutProps {
  children: ReactNode;
}


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

// We need to create a wrapper component that handles loading before using SidebarProvider
function AppWrapper({ children }: AppClientLayoutProps): JSX.Element {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    setIsMounted(true);

    // Initialize dark mode from localStorage
    if (typeof window !== 'undefined') {
      const darkMode = localStorage.getItem('flowserveai-darkMode');
      if (darkMode === 'false') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }

    // Listen for dark mode changes
    const handleSettingsUpdate = (event: CustomEvent) => {
      if (event.detail && typeof event.detail.darkMode !== 'undefined') {
        if (event.detail.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    window.addEventListener('flowserveai-settings-updated', handleSettingsUpdate as EventListener);

    return () => {
      window.removeEventListener('flowserveai-settings-updated', handleSettingsUpdate as EventListener);
    };
  }, []);
  
  if (!isMounted) {
    return <div className="flex h-screen w-screen items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      {children}
    </SidebarProvider>
  );
}

// Conversation list component 
const ConversationList = memo(({ 
  conversations, 
  searchQuery, 
  activeConversationId,
  onConversationSelect,
  onRename,
  onDelete,
  formatDate,
  getMessagePreview,
  getUnreadCount,
  t
}: { 
  conversations: Conversation[],
  searchQuery: string,
  activeConversationId: string | null,
  onConversationSelect: (id: string) => void,
  onRename: (id: string, title: string) => void,
  onDelete: (id: string) => void,
  formatDate: (date: Date) => string,
  getMessagePreview: (messages: Message[]) => string,
  getUnreadCount: (id: string) => number,
  t: (key: string) => string
}) => {
  const filteredConversations = searchQuery.trim() === '' 
    ? conversations 
    : conversations.filter(conv => 
        conv.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  if (filteredConversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        No conversations found
      </div>
    );
  }
  
  return (
    <>
      {filteredConversations.map((conv) => {
        const lastMessagePreview = getMessagePreview(conv.messages);
        const unreadCount = getUnreadCount(conv.id);
        const formattedDate = formatDate(new Date(conv.updatedAt));
        
        return (
          <div 
            key={conv.id}
            className={`relative p-4 border-b border-gray-700 hover:bg-[#2a2f45] ${activeConversationId === conv.id ? 'bg-[#2a3050]' : ''}`}
          >
            <div 
              className="cursor-pointer"
              onClick={() => onConversationSelect(conv.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-white">{conv.title}</h3>
                {unreadCount > 0 && (
                  <span className="bg-primary-gradient text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1 line-clamp-1">{lastMessagePreview}</p>
              <p className="text-gray-500 text-xs mt-2">{formattedDate}</p>
            </div>
            
            {/* Actions menu */}
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-1 text-gray-400 hover:text-white focus:outline-none"
                    onClick={(e) => e.stopPropagation()} // Stop event bubbling
                  >
                    <EllipsisVertical size={16} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="left" align="end" className="bg-[#2a2f45] text-white border-gray-700">
                  <DropdownMenuItem 
                    className="hover:bg-[#3a3f55] cursor-pointer focus:bg-[#3a3f55]"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event bubbling
                      onRename(conv.id, conv.title);
                    }}
                  >
                    <Edit3 className="mr-2 h-4 w-4" /> {t('actions.rename')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-red-400 hover:bg-[#3a3f55] cursor-pointer focus:bg-[#3a3f55]"
                    onClick={(e) => {
                      e.stopPropagation(); // Stop event bubbling
                      onDelete(conv.id);
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        );
      })}
    </>
  );
});

ConversationList.displayName = 'ConversationList';

function AppContent({ children }: { children: ReactNode }): JSX.Element
  {
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sidebarContext = useSidebar();
  const isMobile = useIsMobile();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const { t } = useTranslation();
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingConv, setRenamingConv] = useState<{id: string, title: string} | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isWelcomeDialogOpen, setIsWelcomeDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add a ref to track if we've already loaded from storage
  const hasLoadedFromStorage = useRef(false);

  // Memoized callbacks for Sheet components to prevent render loops
  const handleSheetOpenChange = useCallback((open: boolean) => {
    // Avoid needless re-renders by only updating when the state actually changes
    if (open !== sidebarContext.open) {
      sidebarContext.setOpen(open);
    }
  }, [sidebarContext]);
  
  const handleToggleSidebar = useCallback(() => {
    sidebarContext.setOpen(!sidebarContext.open);
  }, [sidebarContext]);

  const handleMoreSheetOpenChange = useCallback((open: boolean) => {
    // Only update if state is changing
    if (open !== isMoreSheetOpen) {
      setIsMoreSheetOpen(open);
    }
  }, [isMoreSheetOpen]);

  const handleToggleMoreSheet = useCallback(() => {
    setIsMoreSheetOpen(!isMoreSheetOpen);
  }, [isMoreSheetOpen]);

  // Load state from the storage system using our new API
  // Stable callback for loading state from localStorage
  const loadStateFromLocalStorage = useCallback(() => {
    // Only run this once
    if (hasLoadedFromStorage.current) return;
    
    if (typeof window === 'undefined') return;
    
    // Get conversations from storage using stable utilities
    const loadedConversations = storageUtils.getConversations();
    setConversations(loadedConversations);
    
    const storedProjects = localStorage.getItem('flowserveai-projects');
    if (storedProjects) {
        try {
            setProjects(JSON.parse(storedProjects));
        } catch (e) {
            console.error("Failed to parse projects from localStorage", e);
        }
    }

    // Determine the active conversation ID from URL or storage
    const chatIdFromUrl = searchParams.get('chatId');
    const storedActiveId = storageUtils.getActiveConversationId();
    let currentActiveId = chatIdFromUrl;

    if (!currentActiveId && storedActiveId && loadedConversations.find((c: { id: any; }) => c.id === storedActiveId)) {
      currentActiveId = storedActiveId;
    }
    if (!currentActiveId && loadedConversations.length > 0 && pathname === '/') {
      currentActiveId = loadedConversations[0].id;
    }
    
    setActiveConversationId(currentActiveId);

    // Sync active ID with storage and URL
    if (currentActiveId) {
      if (currentActiveId !== storedActiveId) {
        storageUtils.setActiveConversationId(currentActiveId);
      }
      if (pathname === '/' && (!chatIdFromUrl || chatIdFromUrl !== currentActiveId)) {
        const documentIdToDiscuss = searchParams.get('documentIdToDiscuss');
        router.replace(`/?chatId=${currentActiveId}${documentIdToDiscuss ? `&documentIdToDiscuss=${documentIdToDiscuss}`: ''}`, { scroll: false });
      }
    } else if (pathname === '/' && chatIdFromUrl) {
      router.replace('/', {scroll: false});
    }
    
    // Mark as loaded to prevent multiple loads
    hasLoadedFromStorage.current = true;
  }, [pathname, router, searchParams]);

  // Define handleStorageUpdate outside of useEffect
  const handleStorageUpdate = useCallback((event: StorageEvent | CustomEvent) => {
    // Don't respond to storage events until after initial load
    if (!hasLoadedFromStorage.current) return;
    
    let key: string | null = null;
    if (event instanceof StorageEvent) {
      key = event.key;
    } else if (event instanceof CustomEvent && event.detail) {
      key = event.detail.key;
    }

    if (key === 'flowserveai-conversations' || key === 'flowserveai-activeConversationId') {
      // Instead of calling loadStateFromLocalStorage which would be blocked,
      // do a simplified reload of just what changed
      if (typeof window !== 'undefined') {
        if (key === 'flowserveai-conversations') {
          const loadedConversations = storageUtils.getConversations();
          setConversations(loadedConversations);
        } else if (key === 'flowserveai-activeConversationId') {
          const storedActiveId = storageUtils.getActiveConversationId();
          if (storedActiveId !== activeConversationId) {
            setActiveConversationId(storedActiveId);
          }
        }
      }
    }
  }, [activeConversationId]);

  useEffect(() => {
    loadStateFromLocalStorage();

<<<<<<< HEAD
=======
    const handleStorageUpdate = (event: StorageEvent | CustomEvent) => {
      let key: string | null = null;
      if (event instanceof StorageEvent) {
          key = event.key;
      } else if (event instanceof CustomEvent && event.detail) {
          key = event.detail.key;
      }

      if (key === 'flowserveai-conversations' || key === 'flowserveai-activeConversationId' || key === 'flowserveai-projects') {
        loadStateFromLocalStorage();
      }
    };

>>>>>>> ad9e4af (I want to add new features. I want a project feature where users can cre)
    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('flowserveai-storage-updated', handleStorageUpdate as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('flowserveai-storage-updated', handleStorageUpdate as EventListener);
    };
  }, [loadStateFromLocalStorage, handleStorageUpdate]);

  // Sync conversations to storage - with change detection to avoid loops
  useEffect(() => {
    // Wait until after initial load to start syncing back to storage
    if (!hasLoadedFromStorage.current) return;
    
    if (conversations.length > 0) {
      // Use JSON comparison to prevent unnecessary updates
      const currentStoredConversations = storageUtils.getConversations();
      const currentJSON = JSON.stringify(currentStoredConversations);
      const newJSON = JSON.stringify(conversations);
      
      if (currentJSON !== newJSON) {
        storageUtils.setConversations(conversations);
      }
    } else if (conversations.length === 0) {
      const currentStoredConversations = storageUtils.getConversations();
      // Only update if there are currently stored conversations
      if (currentStoredConversations && currentStoredConversations.length > 0) {
        storageUtils.setConversations([]);
        storageUtils.setActiveConversationId(null);
      }
    }
  }, [conversations]);

  // Sync active conversation ID to storage - with change detection
  useEffect(() => {
    // Wait until after initial load to start syncing back to storage
    if (!hasLoadedFromStorage.current) return;
    
    const currentStoredId = storageUtils.getActiveConversationId();
    if (activeConversationId && activeConversationId !== currentStoredId) {
      storageUtils.setActiveConversationId(activeConversationId);
    } else if (!activeConversationId && conversations.length === 0 && currentStoredId !== null) {
      storageUtils.setActiveConversationId(null);
    }
  }, [activeConversationId, conversations.length]);

  const createNewChat = async () => {
    // Import directly to avoid circular dependencies
    const { upsertConversation, setActiveConversationId } = require('@/lib/storage');
    
    const newConversationId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConversationId,
      title: t('chat.newChat'),
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Update storage with new conversation
    upsertConversation(newConversation);
    
    // Update local state
    setConversations(prev => [newConversation, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
    setActiveConversationId(newConversationId);
    
    // Update URL
    router.push(`/?chatId=${newConversationId}`);
    
    // Close the sidebar when creating a new chat
    if (isMobile) {
      sidebarContext.setOpen(false);
    }
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
    toast({ title: t('chat.conversationDeleted') });
    setDeleteConfirmOpen(false);
    setDeletingConvId(null);
  };

  const requestRenameConversation = (id: string, currentTitle: string) => {
    setRenamingConv({ id, title: currentTitle });
    setNewTitle(currentTitle);
    setRenameDialogOpen(true);
  };

  const confirmRenameConversation = () => {
    if (!renamingConv) return;
    
    if (newTitle.trim() === "") {
      toast({ 
        title: t('chat.renameCancelledEmpty.title'), 
        description: t('chat.renameCancelledEmpty.description'), 
        variant: "destructive"
      });
      return;
    }
    
    if (newTitle.trim() === renamingConv.title) {
      toast({ 
        title: t('chat.renameCancelledUnchanged.title'), 
        description: t('chat.renameCancelledUnchanged.description'), 
        variant: "default"
      });
      setRenameDialogOpen(false);
      setRenamingConv(null);
      return;
    }
    
    setConversations(prev =>
      prev.map(conv =>
        conv.id === renamingConv.id ? { ...conv, title: newTitle.trim(), updatedAt: Date.now() } : conv
      ).sort((a,b) => b.updatedAt - a.updatedAt)
    );
    
    toast({ title: t('chat.conversationRenamed') });
    setRenameDialogOpen(false);
    setRenamingConv(null);
  };

  const cancelRenameConversation = () => {
    setRenameDialogOpen(false);
    setRenamingConv(null);
    toast({ title: t('chat.renameCancelled'), variant: "default"});
  };

  const checkHasDocuments = (messages: Message[]): boolean => {
    return messages.some(msg => msg.attachments && msg.attachments.some(att => att.status === 'completed' && (att as Document).fileUrl));
  };

  // Add the translateWithParams helper function
  const translateWithParams = (t: (key: string) => string, key: string, params: Record<string, string | number>) => {
    let translated = t(key);
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translated = translated.replace(`{${paramKey}}`, String(paramValue));
    });
    return translated;
  };

  // Function to get the last message preview text
  const getLastMessagePreview = (messages: Message[]): string => {
    const userOrAiMessages = messages.filter(msg => msg.sender === 'user' || msg.sender === 'ai');
    if (userOrAiMessages.length === 0) return '';
    
    const lastMessage = userOrAiMessages[userOrAiMessages.length - 1];
    return lastMessage.content.length > 60 
      ? lastMessage.content.substring(0, 60) + '...' 
      : lastMessage.content;
  };

  // Function to get unread message count (mock for now)
  const getUnreadCount = (conversationId: string): number => {
    // This is a mock implementation - in a real app, you would track unread messages
    // For demo purposes, we'll return a random number for some conversations
    if (conversationId.endsWith('2')) return 2;
    if (conversationId.endsWith('1')) return 1;
    return 0;
  };

  // Function to render individual conversation items in the mobile view
  const renderConversationItem = (conv: Conversation) => {
    const lastMessagePreview = getLastMessagePreview(conv.messages);
    const unreadCount = getUnreadCount(conv.id);
    const formattedDate = formatDateForMobile(new Date(conv.updatedAt));
    
    return (
      <div 
        key={conv.id}
        className={`relative p-4 border-b border-gray-700 hover:bg-[#2a2f45] ${activeConversationId === conv.id ? 'bg-[#2a3050]' : ''}`}
      >
        <div 
          className="cursor-pointer"
          onClick={() => handleMobileConversationSelect(conv.id)}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white">{conv.title}</h3>
            {unreadCount > 0 && (
              <span className="bg-primary-gradient text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm mt-1 line-clamp-1">{lastMessagePreview}</p>
          <p className="text-gray-500 text-xs mt-2">{formattedDate}</p>
        </div>
        
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="p-1 text-gray-400 hover:text-white focus:outline-none"
                onClick={(e) => e.stopPropagation()} 
              >
                <EllipsisVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left" align="end" className="bg-[#2a2f45] text-white border-gray-700">
              <DropdownMenuItem 
                className="hover:bg-[#3a3f55] cursor-pointer focus:bg-[#3a3f55]"
                onClick={(e) => {
                  e.stopPropagation();
                  requestRenameConversation(conv.id, conv.title);
                }}
              >
                <Edit3 className="mr-2 h-4 w-4" /> {t('actions.rename')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-400 hover:bg-[#3a3f55] cursor-pointer focus:bg-[#3a3f55]"
                onClick={(e) => {
                  e.stopPropagation();
                  requestDeleteConversation(conv.id);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  // Handle conversation selection in mobile view
  const handleMobileConversationSelect = useCallback((id: string) => {
    setActiveConversationId(id);
    router.push(`/?chatId=${id}`);
    // Close sidebar after selection
    handleSheetOpenChange(false);
  }, [setActiveConversationId, router, handleSheetOpenChange]);

  // Create a wrapper for formatRelativeCustom that matches the expected signature
  const formatDateForMobile = useCallback((date: Date) => {
    // @ts-ignore - formatRelativeCustom actually accepts Date objects, but has a wider type signature
    return formatRelativeCustom(date, new Date());
  }, []);

  return (
<<<<<<< HEAD
    <>
      {/* Mobile Sidebar - Simplified Implementation */}
=======
    <SidebarProvider>
      {/* Mobile Sidebar */}
>>>>>>> ad9e4af (I want to add new features. I want a project feature where users can cre)
      {isMobile && (
        <Sheet 
          open={sidebarContext.open} 
          onOpenChange={handleSheetOpenChange}
        >
          <SheetContent 
            side="left" 
            className="p-0 w-full max-w-[100vw] sm:max-w-[350px] bg-[#1e2231] text-white"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h2 className="text-2xl font-bold">Conversations</h2>
                <div className="flex items-center gap-4 pr-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      createNewChat();
                    }}
                    className="bg-primary-gradient rounded-md p-2 text-white"
                  >
                    <LucideEdit3 size={24} />
                  </button>
                
                </div>
              </div>
              
              {/* Search */}
              <div className="p-4 border-b border-gray-700">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full py-2 pl-10 pr-4 bg-[#2a2f45] text-white rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Conversation List without useMemo */}
              <div className="flex-1 overflow-y-auto">
                {searchQuery.trim() === '' 
                  ? conversations.length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No conversations found
                      </div>
                    ) : conversations.map(renderConversationItem)
                  : conversations.filter(conv => 
                      conv.title.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length === 0 ? (
                      <div className="p-4 text-center text-gray-400">
                        No conversations found
                      </div>
                    ) : conversations
                        .filter(conv => conv.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map(renderConversationItem)
                }
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
      
      {/* Desktop Sidebar */}
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r border-sidebar-border md:block hidden">
        <SidebarHeader className="p-4 items-center">
          <Link href="/" className="flex items-center" onClick={() => {
             if (pathname === '/') {
                if (conversations.length > 0 && !activeConversationId) {
                    const firstConvId = conversations[0].id;
                    setActiveConversationId(firstConvId);
                    router.push(`/?chatId=${firstConvId}`);
                }
             }
          }}>
            <div className="h-8 w-8 flex items-center justify-center">
              <img src="/assets/images/flowserve_logo_transparent.svg" alt={t('common.logoAlt')} className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">{t('common.appName')}</h1>
          </Link>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button variant="outline" className="w-full justify-start group-data-[collapsible=icon]:justify-center bg-primary-gradient text-primary-foreground hover:opacity-90" onClick={createNewChat}>
                <MessageSquarePlus /> <span className="group-data-[collapsible=icon]:hidden ml-2">{t('chat.newChat')}</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
          
          <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="flex items-center justify-between">
                  <span>Projects</span>
              </SidebarGroupLabel>
              <SidebarMenu>
                  {projects.map((project) => (
                      <SidebarMenuItem key={project.id}>
                          <Link href={`/projects?projectId=${project.id}`} passHref>
                              <SidebarMenuButton
                                  isActive={searchParams.get('projectId') === project.id}
                                  tooltip={project.name}
                                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                              >
                                  <span
                                      className="w-2 h-2 rounded-full shrink-0"
                                      style={{ backgroundColor: project.color }}
                                  />
                                  <span className="group-data-[collapsible=icon]:hidden ml-2 truncate">
                                      {project.name}
                                  </span>
                              </SidebarMenuButton>
                          </Link>
                      </SidebarMenuItem>
                  ))}
                  <SidebarMenuItem>
                      <Link href="/projects" passHref>
                          <SidebarMenuButton
                              isActive={pathname === '/projects' && !searchParams.get('projectId')}
                              tooltip="Manage Projects"
                              className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                          >
                              <Folder />
                              <span className="group-data-[collapsible=icon]:hidden ml-2">
                                  Manage Projects
                              </span>
                          </SidebarMenuButton>
                      </Link>
                  </SidebarMenuItem>
              </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="flex items-center justify-between"> <span>{t('sidebar.conversations')}</span> </SidebarGroupLabel>
            <div className="h-[calc(100vh-480px)] group-data-[collapsible=icon]:h-[calc(100vh-380px)] overflow-y-auto pr-2">
              <ScrollArea>
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
                            "w-full h-auto flex-col items-start p-2",
                            {"bg-sidebar-accent/80 hover:bg-sidebar-accent": activeConversationId === conv.id && pathname === '/'},
                            "group-data-[collapsible=icon]:flex-row group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                        )}
                        tooltip={{
                          children: <div className="max-w-xs break-words p-1" title={displayTitle}>{displayTitle}</div>,
                           hidden: !(typeof window !== 'undefined' && window.innerWidth >= 768 && document.querySelector('[data-sidebar="sidebar"]')?.getAttribute('data-state') === 'collapsed' && (pathname === '/' || pathname.startsWith('/?chatId'))),
                        }}
                      >
                        <div> {/* This div was the fix for "Invalid prop data-sidebar supplied to React.Fragment" */}
                          <div className="flex items-center w-full group-data-[collapsible=icon]:justify-center" title={displayTitle}>
                        <div className="flex items-center  group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                          <ConversationTypeIcon type={convType} />
                          <span
                            className="ml-2 group-data-[collapsible=icon]:hidden truncate flex-1 min-w-0"
                            style={{maxWidth: '160px'}} // Reverted to fixed max-width for title
                            title={displayTitle}
                          >
                            {displayTitle}
                          </span>
                          <span className="flex items-center gap-1">
                          <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex items-center cursor-default">
                                    <Paperclip size={12} className="shrink-0 text-sidebar-primary" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="p-1.5 text-xs bg-popover text-popover-foreground">
                                  <p>{t('chat.containsDocuments')}</p>
                                </TooltipContent>
                              </Tooltip>
                          </span>
                        </div>
                          </div>
                          <div className={cn(
                              "text-xs text-sidebar-foreground/80 mt-1.5 flex items-center justify-between w-full",
                              "group-data-[collapsible=icon]:hidden"
                          )}>
                            <span className="flex items-center gap-1">
                              {hasDocuments && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="flex items-center cursor-default">
                                      <Paperclip size={12} className="shrink-0 text-sidebar-primary" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="p-1.5 text-xs bg-popover text-popover-foreground">
                                    <p>{t('chat.containsDocuments')}</p>
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
                               <Button variant="ghost" size="icon" className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground">
                                <EllipsisVertical className="h-4 w-4" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                            <DropdownMenuItem onClick={() => requestRenameConversation(conv.id, conv.title) }> <Edit3 className="mr-2 h-4 w-4" /> {t('actions.rename')} </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => requestDeleteConversation(conv.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10"> <Trash2 className="mr-2 h-4 w-4" /> {t('actions.delete')} </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                );
              })}
              </SidebarMenu>
              </ScrollArea>
            </div>
          </SidebarGroup>

          <SidebarGroup className="mt-auto">
             <SidebarGroupLabel>{t('sidebar.tools')}</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/documents" passHref legacyBehavior={false}>
                  <SidebarMenuButton 
                    isActive={pathname === '/documents'} 
                    tooltip={t('tools.documents')}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                  >
                    <FileText className="shrink-0" /> <span className="group-data-[collapsible=icon]:hidden ml-2">{t('tools.documents')}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/translate" passHref legacyBehavior={false}>
                  <SidebarMenuButton 
                    isActive={pathname === '/translate'} 
                    tooltip={t('tools.translate')}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                  >
                    <Languages className="shrink-0" /> <span className="group-data-[collapsible=icon]:hidden ml-2">{t('tools.translate')}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip={t('tools.products')} 
                  disabled
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                >
                  <Briefcase className="shrink-0" /> <span className="group-data-[collapsible=icon]:hidden ml-2">{t('tools.products')}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 mt-auto border-t border-sidebar-border space-y-2">
          <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsWelcomeDialogOpen(true)} 
                  tooltip={t('support.help')}
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                >
                    <HelpCircle className="shrink-0" /> <span className="group-data-[collapsible=icon]:hidden ml-2">{t('support.help')}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={() => setIsSettingsDialogOpen(true)} 
                  tooltip={t('settings.title')}
                  className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:mx-auto"
                >
                    <Settings className="shrink-0" /> <span className="group-data-[collapsible=icon]:hidden ml-2">{t('settings.title')}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
           </SidebarMenu>

           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-start group-data-[collapsible=icon]:justify-center p-2 group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:mx-auto"
              >
                <Avatar className="h-8 w-8 shrink-0">
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
              <DropdownMenuLabel>{t('account.myAccount')}</DropdownMenuLabel> <DropdownMenuSeparator />
              <DropdownMenuItem disabled><Users className="mr-2 h-4 w-4" /> {t('account.profile')}</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsSettingsDialogOpen(true)}><Settings className="mr-2 h-4 w-4" /> {t('settings.title')}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled> <LogOut className="mr-2 h-4 w-4" /> {t('account.logout')} </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            {isMobile ? (
              <button 
                onClick={handleToggleSidebar}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <Menu size={20} />
              </button>
            ) : (
              <SidebarTrigger />
            )}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold truncate max-w-[calc(100vw-150px)] sm:max-w-xs md:max-w-md">
                {pathname === '/' && activeConversationId ? (conversations.find(c=>c.id === activeConversationId)?.title || t('common.chat')) :
                 pathname === '/translate' ? t('tools.translationModule') :
                 pathname === '/documents' ? t('tools.documents') :
                 pathname === '/projects' ? 'Projects' :
                 t('common.appName')}
              </h2>
              {isMobile && (
                <p className="text-xs text-muted-foreground">
                  {t('common.appName')}
                </p>
              )}
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setIsFeedbackDialogOpen(true)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <MessageCircle size={20} />
            </button>
          )}
        </header>
        <main className={cn(
          "flex-1 overflow-auto p-4 sm:p-6",
          isMobile && "pb-20" // Add padding at the bottom to account for the mobile navigation bar
        )}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-slate-200 dark:border-slate-700 flex justify-around items-center px-2 z-10">
          <button
            className={`flex flex-col items-center justify-center px-3 ${pathname === '/documents' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => router.push('/documents')}
          >
            <div className={`p-1.5 rounded-full ${pathname === '/documents' ? 'bg-primary/10' : ''}`}>
              <FileText size={20} />
            </div>
            <span className="text-xs mt-1">{t('tools.documents')}</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center px-3 ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => router.push('/')}
          >
            <div className={`p-1.5 rounded-full ${pathname === '/' ? 'bg-primary/10' : ''}`}>
              <MessageSquare size={20} />
            </div>
            <span className="text-xs mt-1">{t('common.chat')}</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center px-3 ${pathname === '/translate' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => router.push('/translate')}
          >
            <div className={`p-1.5 rounded-full ${pathname === '/translate' ? 'bg-primary/10' : ''}`}>
              <Languages size={20} />
            </div>
            <span className="text-xs mt-1">{t('tools.translate')}</span>
          </button>
          <button
            className={`flex flex-col items-center justify-center px-3 ${isMoreSheetOpen ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={handleToggleMoreSheet}
          >
            <div className={`p-1.5 rounded-full ${isMoreSheetOpen ? 'bg-primary/10' : ''}`}>
              <Settings size={20} />
            </div>
            <span className="text-xs mt-1">{t('settings.secondaryTitle')}</span>
          </button>
        </div>}
        
        {/* Restore Settings Panel with proper callback */}
        {isMobile && <SettingsSidePanel 
          isOpen={isMoreSheetOpen} 
          setIsOpen={handleMoreSheetOpenChange} 
        />}
      </SidebarInset>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle id="delete-dialog-title">{t('alerts.deleteConfirm.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {translateWithParams(t, 'alerts.deleteConfirm.description', { title: conversations.find(c => c.id === deletingConvId)?.title || t('common.selectedChat') })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setDeletingConvId(null); setDeleteConfirmOpen(false); }}>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteConversation} className={buttonVariants({ variant: "destructive" })}> {t('actions.delete')} </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Rename Dialog */}
      <AlertDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <AlertDialogContent aria-labelledby="rename-dialog-title">
          <AlertDialogHeader>
            <AlertDialogTitle id="rename-dialog-title">{t('chat.enterNewTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {renamingConv && `Current title: ${renamingConv.title}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <label htmlFor="new-conversation-title" className="sr-only">New conversation title</label>
            <Input 
              id="new-conversation-title"
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)} 
              placeholder={t('chat.enterNewTitle')}
              className="w-full"
              autoFocus
              aria-describedby="rename-dialog-description"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  confirmRenameConversation();
                }
              }}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRenameConversation}>{t('actions.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRenameConversation}>{t('actions.rename')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <WelcomeDialog open={isWelcomeDialogOpen} onOpenChange={setIsWelcomeDialogOpen} />
      <FeedbackDialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen} />
<<<<<<< HEAD
      {!isMobile && <SettingsDialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen} />}
    </>
=======
      {isMobile && <MoreBottomSheet isOpen={isMoreSheetOpen} setIsOpen={setIsMoreSheetOpen} />}
    </SidebarProvider>
>>>>>>> ad9e4af (I want to add new features. I want a project feature where users can cre)
  );
}
// Memoized storage utility functions
const storageUtils = {
  getConversations: () => {
    try {
      const { getConversations } = require('@/lib/storage');
      return getConversations();
    } catch (e) {
      console.error("Failed to retrieve conversations from storage", e);
      return [];
    }
  },
  getActiveConversationId: () => {
    try {
      const { getActiveConversationId } = require('@/lib/storage');
      return getActiveConversationId();
    } catch (e) {
      console.error("Failed to retrieve active conversation ID", e);
      return null;
    }
  },
  setActiveConversationId: (id: string | null) => {
    try {
      const { setActiveConversationId } = require('@/lib/storage');
      setActiveConversationId(id);
    } catch (e) {
      console.error("Failed to set active conversation ID", e);
    }
  },
  upsertConversation: (conversation: Conversation) => {
    try {
      const { upsertConversation } = require('@/lib/storage');
      upsertConversation(conversation);
    } catch (e) {
      console.error("Failed to upsert conversation", e);
    }
  },
  setConversations: (conversations: Conversation[]) => {
    try {
      const { setConversations } = require('@/lib/storage');
      setConversations(conversations);
    } catch (e) {
      console.error("Failed to set conversations", e);
    }
  }
};
export default function AppClientLayout({ children }: AppClientLayoutProps): JSX.Element {
  return (
    <AppWrapper>
      <AppContent>{children}</AppContent>
    </AppWrapper>
  );
}
