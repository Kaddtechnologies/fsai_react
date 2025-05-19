'use client';

/**
 * Storage Initializer Component
 * 
 * This component initializes the storage system for the application:
 * 1. Sets up IndexedDB database and tables
 * 2. Migrates data from localStorage if needed
 * 3. Updates the UI with initialization status
 * 
 * This component should be included high in the component tree to ensure
 * storage is initialized before other components try to use it.
 */

import { useEffect, useState } from 'react';
import { initStorage, shouldUseIndexedDB } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface StorageInitializerProps {
  children: React.ReactNode;
}

export default function StorageInitializer({ children }: StorageInitializerProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Check if we should use IndexedDB
        const useIndexedDB = shouldUseIndexedDB();
        
        // Initialize storage (will set up IndexedDB or use localStorage)
        await initStorage();
        
        console.log(`Storage system initialized with ${useIndexedDB ? 'IndexedDB' : 'localStorage'}`);
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        setInitError(`Storage initialization error: ${(error as Error).message}`);
        
        // Show toast notification about storage issue
        toast({
          title: "Storage initialization failed",
          description: "Falling back to localStorage. Some features may have limited functionality.",
          variant: "destructive"
        });
        
        // Even if initialization fails, we should let the app continue with fallback storage
        setIsInitialized(true);
      }
    };

    initialize();
  }, [toast]);

  // If initialization is still in progress, return null (or a loader)
  // This is usually very quick, so users might not even see it
  if (!isInitialized) {
    return null;
  }

  // If there was an error but we're continuing anyway, we just render the children
  // The error handling would have already shown a toast notification
  return <>{children}</>;
} 