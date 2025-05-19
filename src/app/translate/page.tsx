* 
 * A comprehensive translation management interface that supports:
 * - Text and document translation
 * - Job management with history
 * - User feedback collection
 * - File upload and processing
 * 
 * This is Part 4A: Component declaration, imports, constants, and utility functions
 */

"use client";

// React imports
import { useState, useEffect, useCallback, useRef } from 'react';

// Lucide React icons
import {
  ArrowRightLeft, Copy, Volume2, Trash2, LanguagesIcon, PlusCircle, Search, Filter, 
  Archive, CheckSquare, Square, X, FileText, FileUp, Save, Play, XCircle as XCircleIcon, 
  RotateCcw, Edit3, Download, Share2, Clock, ListFilter, FileSliders, AlertTriangle, 
  Loader2, CheckCircle as CheckCircleIcon, Info, Edit, MessageSquareText, Upload
} from 'lucide-react';

// UI Components
import { Button, buttonVariants } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

// Custom hooks
import { useToast } from '@/hooks/use-toast';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import useTranslation from '@/app/hooks/useTranslation';

// Types
import type { TranslationJob, TranslationJobType, TranslationJobStatus, UploadedFile, TranslatedFileArtifact, UserFeedbackEntry } from '@/lib/types';

// AI translation service
import { translateText } from '@/ai/flows/translate-text';

// Utilities
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * CONSTANTS
 * Configuration values for file handling, validation, and UI limits
 */

// Supported languages for translation
const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ta', name: 'Tamil' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

// Limits for job creation and file handling
const MAX_JOB_TITLE_LENGTH = 100;
const MAX_TEXT_INPUT_LENGTH = 10000;
const MAX_FILES_PER_JOB = 5;
const MAX_TOTAL_UPLOAD_SIZE_MB = 100;
const MAX_TOTAL_UPLOAD_SIZE_BYTES = MAX_TOTAL_UPLOAD_SIZE_MB * 1024 * 1024;

// File type validation
const ALLOWED_DOC_EXTENSIONS = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf', '.txt'];
const ALLOWED_DOC_MIMES: Record<string, string> = {
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/pdf": "pdf",
  "text/plain": "txt",
};

// Feedback functionality constants
const MAX_FEEDBACK_FILE_SIZE_MB = 10;
const MAX_FEEDBACK_FILE_SIZE_BYTES = MAX_FEEDBACK_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_FEEDBACK_FILE_EXTENSIONS = ['.xlsx', '.xls', '.csv', '.txt'];

/**
 * UTILITY COMPONENTS
 * Small reusable components used within the main component
 */

/**
 * JobStatusBadge - Displays the status of a translation job with appropriate styling
 * @param status - The current status of the translation job
 */
const JobStatusBadge: React.FC<{ status: TranslationJobStatus }> = ({ status }) => {
  // Determine badge variant based on status
  const variant: "default" | "secondary" | "destructive" | "outline" =
    status === 'complete' ? 'default' :
    status === 'in-progress' ? 'secondary' :
    status === 'archived' ? 'destructive' :
    status === 'draft' ? 'outline' :
    status === 'failed' ? 'destructive' :
    'outline';
  
  // Apply status-specific text colors
  const textClass = 
    status === 'complete' ? 'text-accent-success' :
    status === 'in-progress' ? 'text-accent-info' :
    status === 'archived' ? 'text-destructive' :
    status === 'draft' ? 'text-muted-foreground' :
    status === 'failed' ? 'text-destructive' :
    'text-muted-foreground';

  // Apply status-specific border colors
  const borderClass = 
    status === 'complete' ? 'border-accent-success/50' :
    status === 'in-progress' ? 'border-accent-info/50' :
    status === 'archived' ? 'border-destructive/50' :
    status === 'draft' ? 'border-border' :
    status === 'failed' ? 'border-destructive/50' :
    'border-border';

  return (
    <Badge variant={variant} className={`capitalize ${textClass} ${borderClass} border`}>
      {status.replace('-', ' ')}
    </Badge>
  );
};

/**
 * Translation parameter helper function
 * Replaces parameters in translation strings with actual values
 * @param t - Translation function
 * @param key - Translation key
 * @param params - Parameters to replace in the translation
 */
const translateWithParams = (t: (key: string) => string, key: string, params: Record<string, string | number>) => {
  let translated = t(key);
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    translated = translated.replace(`{${paramKey}}`, String(paramValue));
  });
  return translated;
};

/**
 * MAIN COMPONENT DECLARATION
 */
const TranslatePage = () => {
  /**
   * HOOKS INITIALIZATION
   * Initialize all required hooks for state management, UI feedback, and functionality
   */
  
  // UI and notification hooks
  const { toast } = useToast();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const { t, language } = useTranslation();
  
  // File input references
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedbackFileInputRef = useRef<HTMLInputElement>(null);

  /**
   * CORE STATE MANAGEMENT
   * State for managing translation jobs, active job, and UI state
   */
  
  // Job management state
  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [activeJob, setActiveJob] = useState<TranslationJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<TranslationJobType>('text');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es');
  
  // Text translation state
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Document translation state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedTranslatedFiles, setSelectedTranslatedFiles] = useState<Record<string, boolean>>({});

  // Form validation and UI state
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [jobIdPendingDeletion, setJobIdPendingDeletion] = useState<string | null>(null);
  
  // History panel state
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState<'all' | TranslationJobType>('all');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<TranslationJobStatus[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  /**
   * FEEDBACK FUNCTIONALITY STATE
   * State for managing user feedback collection and bulk upload features
   */
  
  // Feedback form state
  const [feedbackSourceLang, setFeedbackSourceLang] = useState('');
  const [feedbackTargetLang, setFeedbackTargetLang] = useState('');
  const [feedbackSourceKeyword, setFeedbackSourceKeyword] = useState('');
  const [feedbackTargetKeyword, setFeedbackTargetKeyword] = useState('');
  const [feedbackBulkMode, setFeedbackBulkMode] = useState(false);
  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const [feedbackFileName, setFeedbackFileName] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  // Feedback management state
  const [userFeedbackItems, setUserFeedbackItems] = useState<UserFeedbackEntry[]>([]);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState<string | null>(null);
  const [showDeleteFeedbackConfirm, setShowDeleteFeedbackConfirm] = useState(false);
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState('');

  /**
   * UTILITY FUNCTIONS
   * Helper functions for common operations like language name lookup
   */
  
  /**
   * Get the display name for a language code
   * @param code - Language code (e.g., 'en', 'es')
   * @returns The display name of the language
   */
  const getLanguageName = (code: string) => supportedLanguages.find(l => l.code === code)?.name || code;
  
  /**
   * Check if any uploaded files are PDF files
   * Used to conditionally show PDF-to-DOCX conversion options
   */
  const hasAnyPdfFileInUploads = uploadedFiles.some(file => file.type === 'application/pdf');
/*
 * Main handler functions and core translation logic
 * 
 * This section contains:
 * - useEffect hooks for data persistence
 * - Form management functions
 * - Job lifecycle management
 * - Translation processing logic
 * - File handling functions
 */

  /**
   * DATA PERSISTENCE useEffect HOOKS
   * Handle loading and saving data to/from localStorage
   */

  // Load translation jobs from localStorage on component mount
  useEffect(() => {
    const storedJobs = localStorage.getItem('flowserveai-translation-jobs');
    if (storedJobs) {
      try {
        // Parse and sort jobs by most recently updated
        setJobs(JSON.parse(storedJobs).sort((a: TranslationJob, b: TranslationJob) => b.updatedAt - a.updatedAt));
      } catch (e) {
        console.error("Failed to parse translation jobs from localStorage", e);
        setJobs([]);
      }
    }
  }, []);

  // Save translation jobs to localStorage whenever jobs array changes
  useEffect(() => {
    if (jobs.length > 0 || localStorage.getItem('flowserveai-translation-jobs')) { 
      // Sort jobs by update time before saving
      localStorage.setItem('flowserveai-translation-jobs', JSON.stringify(jobs.sort((a, b) => b.updatedAt - a.updatedAt)));
    } else if (jobs.length === 0 && localStorage.getItem('flowserveai-translation-jobs')) {
      // Remove from storage if no jobs exist
      localStorage.removeItem('flowserveai-translation-jobs');
    }
  }, [jobs]);

  // Load user feedback items from localStorage on component mount
  useEffect(() => {
    const storedFeedback = localStorage.getItem('flowserveai-user-feedback');
    if (storedFeedback) {
      try {
        setUserFeedbackItems(JSON.parse(storedFeedback).sort((a: UserFeedbackEntry, b: UserFeedbackEntry) => b.createdAt - a.createdAt));
      } catch (e) {
        console.error("Failed to parse user feedback from localStorage", e);
        setUserFeedbackItems([]);
      }
    }
  }, []);

  // Save user feedback items to localStorage whenever feedback array changes
  useEffect(() => {
    if (userFeedbackItems.length > 0 || localStorage.getItem('flowserveai-user-feedback')) {
      localStorage.setItem('flowserveai-user-feedback', JSON.stringify(userFeedbackItems.sort((a, b) => b.createdAt - a.createdAt)));
    } else if (userFeedbackItems.length === 0 && localStorage.getItem('flowserveai-user-feedback')) {
      localStorage.removeItem('flowserveai-user-feedback');
    }
  }, [userFeedbackItems]);

  /**
   * FORM VALIDATION AND DIRTY STATE TRACKING
   * Monitor form changes to enable/disable save functionality and warn about unsaved changes
   */

  // Update form dirty state whenever form fields or active job changes
  useEffect(() => {
    if (!activeJob) {
      setIsFormDirty(false); // No active job means no form to be dirty
      return;
    }
    
    // Check each form field against the active job data
    const titleDirty = jobTitle !== activeJob.name;
    const typeDirty = jobType !== activeJob.type;
    const sourceLangDirty = sourceLang !== activeJob.sourceLanguage;
    const targetLangDirty = targetLang !== (activeJob.targetLanguages[0] || 'es'); 
    const inputTextDirty = jobType === 'text' && inputText !== (activeJob.inputText || '');
    
    // Check if document files have changed
    const filesDirty = jobType === 'document' && (
      uploadedFiles.length !== (activeJob.sourceFiles?.length || 0) || 
      !uploadedFiles.every((uf, i) => {
        const ajf = activeJob.sourceFiles?.[i];
        return ajf && uf.id === ajf.id && uf.convertToDocx === ajf.convertToDocx && uf.status === ajf.status;
      })
    );

    setIsFormDirty(titleDirty || typeDirty || sourceLangDirty || targetLangDirty || inputTextDirty || filesDirty);
  }, [jobTitle, jobType, sourceLang, targetLang, inputText, uploadedFiles, activeJob]);

  // Sync activeJob changes back to form when activeJob changes
  useEffect(() => { 
    if (activeJob) { 
      loadJobToForm(activeJob); 
    } else { 
      resetMainFormToEmpty(); 
    } 
  }, [activeJob?.id]);

  /**
   * FORM MANAGEMENT FUNCTIONS
   * Handle form reset, job loading, and state management
   */

  /**
   * Reset the main form to empty state
   * @param fromCancel - Whether this reset is from a cancel action (affects dirty state handling)
   */
  const resetMainFormToEmpty = (fromCancel: boolean = false) => {
    setActiveJob(null);
    setJobTitle('');
    setJobType('text');
    setSourceLang('auto');
    setTargetLang('es');
    setInputText('');
    setUploadedFiles([]);
    setOutputText('');
    setSelectedTranslatedFiles({});
    
    if (fromCancel) {
      setIsFormDirty(false); // Explicitly set false for cancel
    } else {
      setTimeout(() => setIsFormDirty(false), 0); // Ensure dirty check runs after state updates for other resets
    }
  };

  /**
   * Create a new job object template
   * @param type - The type of job to create (text or document)
   * @returns A new TranslationJob object with default values
   */
  const createNewJobObject = (type: TranslationJobType = 'text'): TranslationJob => {
    const newJobId = `job-${Date.now()}`;
    return {
      id: newJobId,
      name: 'Untitled Translation Job',
      type: type,
      status: 'draft',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      sourceLanguage: 'auto',
      targetLanguages: ['es'], 
      sourceFiles: [],
      outputTextByLanguage: {},
      translatedFilesByLanguage: {},
    };
  };

  /**
   * Load a job's data into the form
   * @param job - The job to load, or null to reset the form
   */
  const loadJobToForm = (job: TranslationJob | null) => {
    if (!job) {
      resetMainFormToEmpty();
      return;
    }
    
    setActiveJob(job); 
    setJobTitle(job.name);
    setJobType(job.type);
    setSourceLang(job.sourceLanguage);
    setTargetLang(job.targetLanguages[0] || 'es');
    setInputText(job.inputText || '');
    setUploadedFiles(job.sourceFiles || []);
    setOutputText(job.outputTextByLanguage?.[job.targetLanguages[0]] || '');
    setSelectedTranslatedFiles({});
    setTimeout(() => setIsFormDirty(false), 0); 
  };

  /**
   * JOB LIFECYCLE MANAGEMENT
   * Functions for creating, saving, updating, and managing translation jobs
   */

  /**
   * Core function to update an active job or add it if it's new
   * @param updates - Partial job updates to apply
   * @param newStatus - Optional new status to set
   * @returns The updated job object or null if no active job
   */
  const persistActiveJobDetails = useCallback((updates: Partial<TranslationJob>, newStatus?: TranslationJobStatus): TranslationJob | null => {
    if (!activeJob) return null; 

    // Merge current form state with the active job
    let currentJobData = { ...activeJob };
    currentJobData.name = jobTitle.trim() || 'Untitled Translation Job';
    currentJobData.type = jobType;
    currentJobData.sourceLanguage = sourceLang;
    currentJobData.targetLanguages = [targetLang]; 
    
    // Update job-specific data based on type
    if (jobType === 'text') {
      currentJobData.inputText = inputText;
      currentJobData.outputTextByLanguage = { ...(currentJobData.outputTextByLanguage || {}), [targetLang]: outputText };
    } else {
      currentJobData.sourceFiles = uploadedFiles;
    }
    
    // Create the final job object with updates
    const finalJobToPersist: TranslationJob = {
      ...currentJobData,
      ...updates, 
      status: newStatus || updates.status || currentJobData.status,
      updatedAt: Date.now(),
    };

    // Update the jobs list
    setJobs(prevJobs => {
      const jobExistsInList = prevJobs.some(j => j.id === finalJobToPersist.id);
      if (jobExistsInList) {
        // Update existing job
        return prevJobs.map(j => (j.id === finalJobToPersist.id ? finalJobToPersist : j)).sort((a, b) => b.updatedAt - a.updatedAt);
      }
      // Add new job to list
      return [finalJobToPersist, ...prevJobs].sort((a, b) => b.updatedAt - a.updatedAt);
    });

    setActiveJob(finalJobToPersist); 
    setTimeout(() => setIsFormDirty(false), 0); 
    return finalJobToPersist;
  }, [activeJob, jobTitle, jobType, sourceLang, targetLang, inputText, outputText, uploadedFiles]);

  /**
   * Handle creating a new job
   * @param type - The type of job to create
   */
  const handleNewJob = (type: TranslationJobType = 'text') => {
    if (isFormDirty) {
      // Prompt to save/discard if current form is dirty
      setShowCancelConfirm(true); 
      return; 
    }
    const newJobTemplate = createNewJobObject(type);
    setActiveJob(newJobTemplate); // Set as temporary active job, not yet in the jobs list
    loadJobToForm(newJobTemplate); // Populate form based on this template
  };

  /**
   * Handle selecting a job from history
   * @param jobId - The ID of the job to select
   */
  const handleSelectJobFromHistory = (jobId: string) => {
    if (isFormDirty && activeJob && activeJob.id !== jobId) { 
      // If form is dirty and trying to switch to a different job
      setShowCancelConfirm(true); 
      return;
    }
    const jobToLoad = jobs.find(j => j.id === jobId);
    if (jobToLoad) {
      loadJobToForm(jobToLoad);
    }
  };

  /**
   * Handle changing the job type (text vs document)
   * @param newType - The new job type to switch to
   */
  const handleJobTypeChange = (newType: TranslationJobType) => {
    setJobType(newType); // Always update the local state first

    if (activeJob) {
      // Update existing job when type changes
      const updatedFieldsForTypeSwitch: Partial<TranslationJob> = {
        type: newType,
        status: 'draft', 
        inputText: newType === 'document' ? '' : (activeJob.inputText || ''),
        sourceFiles: newType === 'text' ? [] : (activeJob.sourceFiles || []),
        outputTextByLanguage: {}, 
        translatedFilesByLanguage: {},
        updatedAt: Date.now(),
      };
      
      setActiveJob(prev => prev ? { ...prev, ...updatedFieldsForTypeSwitch } : null);

      // Clear type-specific form fields
      if (newType === 'text') {
        setUploadedFiles([]); 
        setOutputText('');
      } else { 
        setInputText(''); 
        setOutputText('');
      }
      toast({ title: t('translation.jobTypeSwitched'), description: t('translation.jobTypeSwitchedDesc'), variant: "default" });
    } else {
      // No active job, create a new one with the selected type
      handleNewJob(newType);
    }
  };

  /**
   * Ensure the active job is persisted in the jobs list
   * Used before translation to make sure the job exists in localStorage
   * @returns The persisted job or null if no active job
   */
  const ensureActiveJobIsPersisted = () => {
    if (!activeJob) return null;
    
    // Update job with current form values
    let jobToPersist = { ...activeJob };
    jobToPersist.name = jobTitle.trim() || 'Untitled Translation Job';
    jobToPersist.type = jobType;
    jobToPersist.sourceLanguage = sourceLang;
    jobToPersist.targetLanguages = [targetLang];
    if (jobType === 'text') jobToPersist.inputText = inputText;
    else jobToPersist.sourceFiles = uploadedFiles;

    if (!jobs.some(j => j.id === jobToPersist.id)) {
      // This is a new job, add it to the list
      setJobs(prevJobs => [jobToPersist, ...prevJobs].sort((a, b) => b.updatedAt - a.updatedAt));
      setActiveJob(jobToPersist);
      return jobToPersist;
    }
    return activeJob; // Already exists
  };

  /**
   * Handle saving the current job as a draft
   */
  const handleSaveDraft = () => {
    if (!activeJob) {
      toast({ title: t('translation.nothingToSave'), description: t('translation.nothingToSaveDesc'), variant: "default" });
      return;
    }
    if (!jobTitle.trim()) {
      toast({ title: t('translation.jobTitleRequired'), description: t('translation.jobTitleRequiredDesc'), variant: "destructive" });
      return;
    }

    const jobAfterEnsuringPersistence = ensureActiveJobIsPersisted();
    if (!jobAfterEnsuringPersistence) return;

    const savedJob = persistActiveJobDetails(
      { status: jobAfterEnsuringPersistence.status === 'in-progress' ? 'in-progress' : (jobAfterEnsuringPersistence.status === 'complete' ? 'complete' : 'draft') }
    );
    
    if (savedJob) {
      toast({ title: t('translation.jobSaved'), description: translateWithParams(t, 'translation.jobSavedDesc', { name: savedJob.name }) });
    }
  };

  /**
   * Handle canceling the active job
   */
  const handleCancelActiveJob = () => {
    if (isFormDirty) {
      setShowCancelConfirm(true);
    } else {
      performCancelAction();
    }
  };

  /**
   * Perform the actual cancel action (called after confirmation)
   */
  const performCancelAction = () => {
    resetMainFormToEmpty(true);
    toast({ 
      title: t('translation.actionCancelled'), 
      description: t('translation.actionCancelledDesc')
    });
    setShowCancelConfirm(false);
  };

  /**
   * TRANSLATION PROCESSING FUNCTIONS
   * Handle text and document translation workflows
   */

  /**
   * Handle translating a text-based job
   */
  const handleTranslateTextJob = async () => {
    if (!activeJob || jobType !== 'text' || !inputText.trim()) {
      if (!inputText.trim() && jobType === 'text') {
        toast({ title: t('translation.inputRequired'), description: t('translation.inputRequiredDesc'), variant: "destructive" });
      }
      return;
    }
    if (!jobTitle.trim()) {
      toast({ title: t('translation.jobTitleRequired'), description: t('translation.jobTitleRequiredDesc2'), variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setOutputText(''); 
    
    const jobWithProgress = ensureActiveJobIsPersisted();
    if (!jobWithProgress) {
      setIsLoading(false);
      toast({ title: t('translation.errorTitle'), description: t('translation.errorStartTranslationDesc'), variant: "destructive" });
      return;
    }
    
    // Set status to 'in-progress' before API call
    persistActiveJobDetails({}, 'in-progress');

    try {
      // Call the translation API
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l => l.code === sourceLang)?.name || 'English', 
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Spanish',
      });
      
      setOutputText(result.translatedText); 
      persistActiveJobDetails({ 
        outputTextByLanguage: { ...(activeJob?.outputTextByLanguage || {}), [targetLang]: result.translatedText },
      }, 'complete');
      
      toast({ title: t('translation.translationComplete'), description: translateWithParams(t, 'translation.translationCompleteDesc', { title: jobTitle }) });
    } catch (error) {
      console.error("Translation failed:", error);
      persistActiveJobDetails({ errorMessage: t('translation.translationErrorDesc') }, 'failed');
      toast({ title: t('translation.translationError'), description: t('translation.translationErrorDesc'), variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Process a single file for translation (simulated)
   * @param file - The file to process
   * @param currentJob - The current translation job
   * @param targetLangCode - Target language code
   * @returns Promise resolving to the updated file object
   */
  const processSingleFileForJob = async (file: UploadedFile, currentJob: TranslationJob, targetLangCode: string): Promise<UploadedFile> => {
    let currentFileState = { ...file, status: 'processing' as UploadedFile['status'], progress: 10 };
    
    // Update UI for this specific file
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    
    // Simulate upload phase
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
    currentFileState = { ...currentFileState, progress: 30 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));

    // Simulate processing phase
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800));
    currentFileState = { ...currentFileState, progress: 70 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));

    // Simulate translation phase
    console.log(`Simulating translation for ${file.originalName} to ${targetLangCode}`);
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1000));
    
    // Randomly determine success/failure for demo
    const success = Math.random() > 0.1; 
    if (success) {
      currentFileState = { ...currentFileState, status: 'completed', progress: 100 };
      toast({ title: t('translation.fileProcessed'), description: translateWithParams(t, 'translation.fileProcessedDesc', { fileName: currentFileState.originalName }) });
    } else {
      currentFileState = { ...currentFileState, status: 'failed', progress: 100, error: t('translation.fileFailed') };
      toast({ title: t('translation.fileFailed'), description: translateWithParams(t, 'translation.fileFailedDesc', { fileName: currentFileState.originalName }), variant: "destructive" });
    }
    
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    return currentFileState;
  };
  /*
  * UI rendering functions and component layouts
 * 
 * This section contains:
 * - File handling functions (select, process, remove)
 * - Job management functions (delete, archive, filter)
 * - UI interaction handlers (copy, text-to-speech, download)
 * - Feedback system functions
 * - Main rendering functions for different panels
 */

  /**
   * FILE HANDLING FUNCTIONS
   * Functions for managing file uploads, processing, and validation
   */

  /**
   * Handle file selection from input
   * @param event - File input change event
   */
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    let jobContext = activeJob;

    // Create new document job if no active job exists
    if (!jobContext) { 
      const newJobTemplate = createNewJobObject('document');
      setActiveJob(newJobTemplate);
      setJobType('document');
      jobContext = newJobTemplate;
    } else if (jobContext.type !== 'document') { 
      // Switch existing job to document type
      setJobType('document');
      const updatedFieldsForTypeSwitch: Partial<TranslationJob> = {
        type: 'document', status: 'draft', inputText: '', sourceFiles: [], outputTextByLanguage: {},
      };
      const switchedJob = { ...jobContext, ...updatedFieldsForTypeSwitch };
      setActiveJob(switchedJob);
      jobContext = switchedJob;
      setInputText('');
      setOutputText('');
      toast({ title: t('translation.jobTypeSwitched'), description: t('translation.jobTypeSwitchedDesc'), variant: "default" });
    }
    
    processFiles(Array.from(files), jobContext);
    
    // Clear the input value to allow re-selecting the same files
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * Process selected files for upload
   * @param filesToProcess - Array of files to process
   * @param currentJobContext - Current job context for file association
   */
  const processFiles = (filesToProcess: File[], currentJobContext: TranslationJob) => {
    let currentSourceFiles = [...(currentJobContext.sourceFiles || [])];
    let currentTotalSize = currentSourceFiles.reduce((acc, f) => acc + f.size, 0);
    const newUploads: UploadedFile[] = [];

    for (const file of filesToProcess) {
      // Check file count limit
      if (currentSourceFiles.length + newUploads.length >= MAX_FILES_PER_JOB) {
        toast({ title: t('translation.fileLimitReached'), description: translateWithParams(t, 'translation.fileLimitReachedDesc', { max: MAX_FILES_PER_JOB }), variant: "destructive" });
        break;
      }
      
      // Validate file type
      if (!ALLOWED_DOC_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext)) && !ALLOWED_DOC_MIMES[file.type]) {
        toast({ title: t('translation.invalidFileType'), description: translateWithParams(t, 'translation.invalidFileTypeDesc', { fileName: file.name }), variant: "destructive" });
        continue;
      }
      
      // Check total size limit
      if (currentTotalSize + file.size > MAX_TOTAL_UPLOAD_SIZE_BYTES) {
        toast({ title: t('translation.sizeLimitExceeded'), description: translateWithParams(t, 'translation.sizeLimitExceededDesc', { max: MAX_TOTAL_UPLOAD_SIZE_MB }), variant: "destructive" });
        break;
      }

      // Create file object for tracking
      newUploads.push({
        id: `file-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
        originalName: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'queued',
        convertToDocx: file.type === 'application/pdf' ? false : undefined,
      });
      currentTotalSize += file.size;
    }

    if (newUploads.length > 0) {
      const updatedSourceFilesList = [...currentSourceFiles, ...newUploads];
      setUploadedFiles(updatedSourceFilesList);
      
      // Update the active job with new files
      setActiveJob(prev => prev ? { ...prev, sourceFiles: updatedSourceFilesList, type: 'document', status: 'draft' } : null);
    }
  };

  /**
   * Remove an uploaded file from the list
   * @param fileId - ID of the file to remove
   */
  const removeUploadedFile = (fileId: string) => {
    const updatedList = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedList);
    if (activeJob) setActiveJob(prev => prev ? { ...prev, sourceFiles: updatedList } : null);
  };

  /**
   * Toggle PDF to DOCX conversion option
   * @param fileId - ID of the PDF file to toggle conversion for
   */
  const togglePdfToDocx = (fileId: string) => {
    const updatedList = uploadedFiles.map(f => 
      f.id === fileId && f.type === 'application/pdf' 
        ? { ...f, convertToDocx: !f.convertToDocx } 
        : f
    );
    setUploadedFiles(updatedList);
    if (activeJob) setActiveJob(prev => prev ? { ...prev, sourceFiles: updatedList } : null);
  };

  /**
   * Handle document translation job processing
   */
  const handleTranslateDocumentJob = async () => {
    if (!activeJob || jobType !== 'document' || uploadedFiles.filter(f => f.status === 'queued' || f.status === 'failed').length === 0) {
      if (jobType === 'document' && uploadedFiles.every(f => f.status === 'completed' || f.status === 'processing')) {
        toast({ title: t('translation.allFilesProcessed'), description: t('translation.allFilesProcessedDesc'), variant: "default" });
      } else if (jobType === 'document' && uploadedFiles.length === 0) {
        toast({ title: t('translation.noFilesUploaded'), description: t('translation.noFilesUploadedDesc'), variant: "destructive" });
      }
      return;
    }
    
    if (!jobTitle.trim()) {
      toast({ title: t('translation.jobTitleRequired'), description: t('translation.jobTitleRequiredDesc2'), variant: "destructive" });
      return;
    }

    setIsLoading(true);

    const jobForTranslation = ensureActiveJobIsPersisted();
    if (!jobForTranslation) {
      setIsLoading(false);
      toast({ title: t('translation.errorTitle'), description: t('translation.errorStartTranslationDesc'), variant: "destructive" });
      return;
    }

    // Set job status to in-progress
    persistActiveJobDetails({}, 'in-progress');

    let currentSourceFilesState = [...(jobForTranslation.sourceFiles || [])];
    let newTranslatedArtifactsForJob: TranslatedFileArtifact[] = jobForTranslation.translatedFilesByLanguage?.[targetLang] || [];
    let allFilesSucceeded = true;

    // Process each file individually
    for (let i = 0; i < currentSourceFilesState.length; i++) {
      let fileToProcess = currentSourceFilesState[i];
      if (fileToProcess.status === 'completed' || fileToProcess.status === 'processing') {
        continue;
      }

      const processedFile = await processSingleFileForJob(fileToProcess, jobForTranslation, targetLang);
      currentSourceFilesState = currentSourceFilesState.map(f => f.id === processedFile.id ? processedFile : f);

      if (processedFile.status === 'completed') {
        // Add translated file artifact if not already present
        if (!newTranslatedArtifactsForJob.some(art => art.name.startsWith(`translated_${processedFile.originalName.split('.')[0]}_${targetLang}`))) {
          newTranslatedArtifactsForJob.push({
            name: `translated_${processedFile.originalName.split('.')[0]}_${targetLang}.${processedFile.convertToDocx && processedFile.type === 'application/pdf' ? 'docx' : processedFile.originalName.split('.').pop() || 'txt'}`,
            url: '#simulated-download',
            format: processedFile.convertToDocx && processedFile.type === 'application/pdf' ? 'docx' : processedFile.originalName.split('.').pop() || 'txt'
          });
        }
      } else if (processedFile.status === 'failed') {
        allFilesSucceeded = false;
      }

      // Update job with latest progress
      const updatedJob = persistActiveJobDetails({
        sourceFiles: [...currentSourceFilesState],
        translatedFilesByLanguage: { ...(activeJob?.translatedFilesByLanguage || {}), [targetLang]: newTranslatedArtifactsForJob }
      }, 'in-progress');

      if (!updatedJob) break;
    }

    // Determine final job status
    const finalStatus = allFilesSucceeded && currentSourceFilesState.every(f => f.status === 'completed')
      ? 'complete'
      : (currentSourceFilesState.some(f => f.status === 'failed') ? 'failed' : 'in-progress');

    persistActiveJobDetails({ status: finalStatus });

    // Show appropriate completion message
    if (finalStatus === 'complete') {
      toast({ title: t('translation.documentJobComplete'), description: translateWithParams(t, 'translation.documentJobCompleteDesc', { title: jobTitle }) });
    } else if (finalStatus === 'failed') {
      toast({ title: t('translation.documentJobIssues'), description: translateWithParams(t, 'translation.documentJobIssuesDesc', { title: jobTitle }), variant: "destructive" });
    } else if (finalStatus === 'in-progress' && !currentSourceFilesState.some(f => f.status === 'processing' || f.status === 'queued')) {
      toast({ title: t('translation.jobUpdated'), description: translateWithParams(t, 'translation.jobUpdatedDesc', { title: jobTitle }) });
    }
    setIsLoading(false);
  };

  /**
   * JOB MANAGEMENT FUNCTIONS
   * Functions for job operations like delete, archive, and filtering
   */

  /**
   * Request deletion of a job (shows confirmation dialog)
   * @param jobId - ID of the job to delete
   */
  const requestDeleteJob = (jobId: string) => {
    setJobIdPendingDeletion(jobId);
    setShowDeleteConfirmModal(true);
  };

  /**
   * Confirm and execute job deletion
   */
  const confirmDeleteJob = () => {
    if (!jobIdPendingDeletion) return;
    
    setJobs(prev => prev.filter(j => j.id !== jobIdPendingDeletion));
    
    // Clear active job if it's the one being deleted
    if (activeJob?.id === jobIdPendingDeletion) {
      resetMainFormToEmpty(true);
    }
    
    toast({ title: t('translation.jobDeleted') });
    setShowDeleteConfirmModal(false);
    setJobIdPendingDeletion(null);
  };

  /**
   * Handle archiving/unarchiving a job
   * @param jobId - ID of the job to archive/unarchive
   */
  const handleArchiveJob = (jobId: string) => {
    const jobToUpdate = jobs.find(j => j.id === jobId);
    if (jobToUpdate) {
      const newStatus = jobToUpdate.status === 'archived' ? 'draft' : 'archived';
      const updatedJobData: Partial<TranslationJob> = { status: newStatus as TranslationJobStatus, updatedAt: Date.now() };

      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updatedJobData } : j).sort((a, b) => b.updatedAt - a.updatedAt));

      // Update active job if it's the one being archived
      if (activeJob?.id === jobId) {
        const reloadedJob = { ...activeJob, ...updatedJobData };
        setActiveJob(reloadedJob);
        if (newStatus === 'archived' && !showArchived) {
          resetMainFormToEmpty(true); // Clear form if archived and not showing archived
        } else {
          loadJobToForm(reloadedJob); // Reload to reflect status change
        }
      }
      toast({ title: jobToUpdate.status === 'archived' ? t('translation.jobUnarchived') : t('translation.jobArchived') });
    }
  };

  /**
   * Toggle filter status in history panel
   * @param status - Status to toggle in filter
   */
  const toggleHistoryFilterStatus = (status: TranslationJobStatus) => {
    setHistoryFilterStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  /**
   * Filter jobs based on search term, type, status, and archive settings
   */
  const filteredJobs = jobs.filter(job => {
    const nameMatch = historySearchTerm === '' || job.name.toLowerCase().includes(historySearchTerm.toLowerCase());
    const typeMatch = historyFilterType === 'all' || job.type === historyFilterType;
    const statusMatch = historyFilterStatus.length === 0 || historyFilterStatus.includes(job.status);
    const archiveMatch = showArchived ? true : job.status !== 'archived';
    return nameMatch && typeMatch && statusMatch && archiveMatch;
  });

  /**
   * UI INTERACTION HANDLERS
   * Functions for copy, text-to-speech, and download operations
   */

  /**
   * Handle copying text to clipboard
   * @param text - Text to copy
   */
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: t('translation.copiedToClipboard') });
  };

  /**
   * Handle text-to-speech functionality
   * @param text - Text to speak
   */
  const handleTTS = (text: string) => {
    if (!text) return;
    if (isSpeaking) cancel();
    else speak(text);
  };

  /**
   * Toggle selection of translated files for download
   * @param fileName - Name of the file to toggle
   */
  const handleSelectedTranslatedFileToggle = (fileName: string) => {
    setSelectedTranslatedFiles(prev => ({ ...prev, [fileName]: !prev[fileName] }));
  };

  /**
   * Handle downloading selected translated files
   */
  const handleDownloadSelected = () => {
    const filesToDownload = Object.entries(selectedTranslatedFiles)
      .filter(([_, isSelected]) => isSelected)
      .map(([fileName, _]) => fileName);
    
    if (filesToDownload.length === 0) {
      toast({ title: t('translation.noFilesSelected'), description: t('translation.noFilesSelectedDesc'), variant: "destructive" });
      return;
    }
    toast({ title: t('translation.downloadSelectedSimulated'), description: translateWithParams(t, 'translation.downloadSelectedSimulatedDesc', { fileList: filesToDownload.join(', ') }) });
  };

  /**
   * Handle downloading all translated files as ZIP
   */
  const handleDownloadAllZip = () => {
    if (!activeJob || !activeJob.translatedFilesByLanguage?.[targetLang] || activeJob.translatedFilesByLanguage[targetLang].length === 0) {
      toast({ title: t('translation.noTranslatedFiles'), description: t('translation.noTranslatedFilesDesc'), variant: "destructive" });
      return;
    }
    toast({ title: t('translation.downloadAllZipSimulated'), description: translateWithParams(t, 'translation.downloadAllZipSimulatedDesc', { count: activeJob.translatedFilesByLanguage[targetLang].length }) });
  };

  /**
   * FEEDBACK SYSTEM FUNCTIONS
   * Functions for managing user feedback collection and bulk uploads
   */

  /**
   * Handle feedback file selection
   * @param event - File input change event
   */
  const handleFeedbackFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size
      if (file.size > MAX_FEEDBACK_FILE_SIZE_BYTES) {
        toast({ title: t('translation.feedback.errorFileTooLarge'), variant: "destructive" });
        setFeedbackFile(null);
        setFeedbackFileName('');
        return;
      }

      // Validate file type
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !ALLOWED_FEEDBACK_FILE_EXTENSIONS.includes(`.${fileExtension}`)) {
        toast({ title: t('translation.feedback.errorInvalidFileType'), variant: "destructive" });
        setFeedbackFile(null);
        setFeedbackFileName('');
        return;
      }
      
      setFeedbackFile(file);
      setFeedbackFileName(file.name);
    }
    
    // Clear input for re-selection
    if (feedbackFileInputRef.current) feedbackFileInputRef.current.value = "";
  };

  /**
   * Download feedback template (simulated)
   */
  const downloadFeedbackTemplate = () => {
    toast({ title: "Simulated Download", description: "Feedback template download started (simulated)." });
  };

  /**
   * Handle feedback form submission
   */
  const handleFeedbackSubmit = async () => {
    // Validate required fields
    if (!feedbackSourceLang || !feedbackTargetLang) {
      toast({ title: t('common.error'), description: t('translation.feedback.errorMissingFields'), variant: "destructive" });
      return;
    }
    
    if (feedbackBulkMode && !feedbackFile) {
      toast({ title: t('common.error'), description: t('translation.feedback.errorMissingFields'), variant: "destructive" });
      return;
    }
    
    if (!feedbackBulkMode && (!feedbackSourceKeyword.trim() || !feedbackTargetKeyword.trim())) {
      toast({ title: t('common.error'), description: t('translation.feedback.errorMissingFields'), variant: "destructive" });
      return;
    }

    setIsSubmittingFeedback(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create new feedback entry
    const newFeedbackEntry: UserFeedbackEntry = {
      id: `feedback-${Date.now()}`,
      sourceLanguage: feedbackSourceLang,
      targetLanguage: feedbackTargetLang,
      isBulk: feedbackBulkMode,
      createdAt: Date.now(),
      ...(feedbackBulkMode 
        ? { fileName: feedbackFile?.name || 'N/A' } 
        : { sourceKeyword: feedbackSourceKeyword, targetKeyword: feedbackTargetKeyword }
      ),
    };

    setUserFeedbackItems(prev => [newFeedbackEntry, ...prev].sort((a, b) => b.createdAt - a.createdAt));
    toast({ title: t('translation.feedback.feedbackAddedSuccess') });

    // Reset form
    setFeedbackSourceLang('');
    setFeedbackTargetLang('');
    setFeedbackSourceKeyword('');
    setFeedbackTargetKeyword('');
    setFeedbackBulkMode(false);
    setFeedbackFile(null);
    setFeedbackFileName('');
    setIsSubmittingFeedback(false);
  };

  /**
   * Request deletion of feedback item
   * @param id - ID of the feedback item to delete
   */
  const requestDeleteFeedback = (id: string) => {
    setFeedbackIdToDelete(id);
    setShowDeleteFeedbackConfirm(true);
  };

  /**
   * Confirm and execute feedback deletion
   */
  const confirmDeleteFeedback = () => {
    if (!feedbackIdToDelete) return;
    setUserFeedbackItems(prev => prev.filter(item => item.id !== feedbackIdToDelete));
    toast({ title: t('translation.feedback.feedbackDeleted') });
    setShowDeleteFeedbackConfirm(false);
    setFeedbackIdToDelete(null);
  };

  /**
   * Filter feedback items based on search term
   */
  const filteredFeedbackItems = userFeedbackItems.filter(item => {
    if (feedbackSearchTerm === '') return true;
    const searchTermLower = feedbackSearchTerm.toLowerCase();
    return (item.sourceKeyword?.toLowerCase().includes(searchTermLower) ||
            item.targetKeyword?.toLowerCase().includes(searchTermLower) ||
            item.fileName?.toLowerCase().includes(searchTermLower) ||
            getLanguageName(item.sourceLanguage).toLowerCase().includes(searchTermLower) ||
            getLanguageName(item.targetLanguage).toLowerCase().includes(searchTermLower));
  });

  /**
 * 
 * Translation job panel header and empty state
 * 
 * This section contains:
 * - Beginning of renderTranslationJobPanel() function
 * - Card header with title and status badge
 * - Empty state when no job is active
 * - Opening of the form container for active jobs
 */

  /**
   * TRANSLATION JOB PANEL RENDERING FUNCTION
   * Renders the main form for creating/editing translation jobs
   */

  /**
   * Render the main translation job panel
   * Contains the form for creating/editing translation jobs and processing them
   */
  const renderTranslationJobPanel = () => (
    <Card className="flex-1 shadow-xl flex flex-col overflow-hidden min-h-[400px]">
      {/* Header Section */}
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl">
            {activeJob ? (activeJob.name === t('translation.new') && activeJob.status === 'draft' && !jobs.some(j => j.id === activeJob.id) ? t('translation.new') : t('translation.edit')) : t('translation.new')}
          </CardTitle>
          {activeJob && <JobStatusBadge status={activeJob.status} />}
        </div>
        {activeJob && <CardDescription className="text-xs md:text-sm">ID: {activeJob.id.substring(0, 12)}...</CardDescription>}
      </CardHeader>
      
      {/* Scrollable Content Area */}
      <ScrollArea className="flex-grow p-2 md:p-4 relative">
        <div className="space-y-4 h-full">
          {!activeJob ? (
            /* ===== EMPTY STATE - No Active Job ===== */
            <div className="flex flex-col items-center justify-center absolute inset-0 text-center p-0 md:p-8">
              <div className="bg-card/50 rounded-lg border border-border p-4 shadow-sm w-full max-w-[85%]">
                <div className="flex flex-col items-center justify-center py-6">
                  {/* Empty state icon */}
                  <LanguagesIcon className="w-10 h-10 md:w-16 md:h-16 text-primary opacity-50" />
                  
                  {/* Empty state text */}
                  <h3 className="text-base md:text-xl font-medium mt-4 mb-2">{t('translation.noActiveJob')}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 max-w-[200px] mx-auto">{t('translation.createNew')}</p>
                  
                  {/* Create new job button */}
                  <Button onClick={() => handleNewJob()} size="sm" className="w-full md:w-auto md:px-6">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('translation.createNewButton')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* ===== ACTIVE JOB FORM ===== */
            // Note: The rest of the form continues in Part 4E

<>
              {/* ===== JOB TITLE INPUT ===== */}
              <div className="space-y-1">
                <label htmlFor="jobTitle">
                  {t('translation.jobTitle')} <span className="text-destructive">*</span>
                </label>
                <Input 
                  id="jobTitle" 
                  placeholder={t('translation.enterJobTitle')} 
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value.slice(0, MAX_JOB_TITLE_LENGTH))}
                  maxLength={MAX_JOB_TITLE_LENGTH} 
                  disabled={isLoading || activeJob?.status === 'in-progress'}
                />
                {/* Character counter */}
                <p className="text-xs text-muted-foreground text-right">
                  {jobTitle.length}/{MAX_JOB_TITLE_LENGTH}
                </p>
              </div>

              {/* ===== JOB TYPE AND LANGUAGE SELECTION GRID ===== */}
              <div className="grid grid-cols-1 gap-4">
                {/* Job Type Selector */}
                <div className="space-y-1">
                  <label>{t('translation.jobType')}</label>
                  <Select 
                    value={jobType} 
                    onValueChange={(v) => handleJobTypeChange(v as TranslationJobType)} 
                    disabled={isLoading || activeJob?.status === 'in-progress'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('translation.selectJobType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">{t('translation.textTranslation')}</SelectItem>
                      <SelectItem value="document">{t('translation.documentTranslation')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Source Language Selector */}
                <div className="space-y-1">
                  <label>{t('translation.sourceLanguage')}</label>
                  <Select 
                    value={sourceLang} 
                    onValueChange={setSourceLang} 
                    disabled={isLoading || activeJob?.status === 'in-progress'}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('translation.selectSourceLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Auto-detect option */}
                      <SelectItem value="auto">{t('translation.autoDetect')}</SelectItem>
                      {/* All supported languages */}
                      {supportedLanguages.map(l => (
                        <SelectItem key={l.code} value={l.code}>
                          {t(`languages.${l.code}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ===== TARGET LANGUAGE SELECTOR ===== */}
              <div className="space-y-1">
                <label>{t('translation.targetLanguage')}</label>
                <Select 
                  value={targetLang} 
                  onValueChange={setTargetLang} 
                  disabled={isLoading || activeJob?.status === 'in-progress'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('translation.selectTargetLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map(l => (
                      <SelectItem 
                        key={l.code} 
                        value={l.code} 
                        // Disable if same as source (except for auto-detect)
                        disabled={l.code === sourceLang && sourceLang !== 'auto'}
                      >
                        {t(`languages.${l.code}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {jobType === 'text' && (
                <div className="space-y-4">
                  {/* ===== SOURCE TEXT INPUT AREA ===== */}
                  <div>
                    <Textarea 
                      placeholder={t('translation.enterTextToTranslate')} 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value.slice(0, MAX_TEXT_INPUT_LENGTH))}
                      className="min-h-[150px] bg-input focus-visible:ring-1 focus-visible:ring-ring" 
                      rows={6}
                      maxLength={MAX_TEXT_INPUT_LENGTH} 
                      disabled={isLoading || activeJob?.status === 'in-progress'} 
                    />
                    
                    {/* Input controls and character counter */}
                    <div className="flex justify-between items-center mt-1">
                      {/* Character counter */}
                      <p className="text-xs text-muted-foreground">
                        {inputText.length}/{MAX_TEXT_INPUT_LENGTH} {t('translation.characters')}
                      </p>
                      
                      {/* Action buttons for input text */}
                      <div>
                        {/* Copy input text button */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleCopy(inputText)} 
                              disabled={!inputText}
                            >
                              <Copy size={16}/>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('translation.copyText')}</TooltipContent>
                        </Tooltip>
                        
                        {/* Text-to-speech for input text */}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleTTS(inputText)} 
                              disabled={!inputText}
                            >
                              {isSpeaking ? (
                                <Volume2 size={16} className="text-secondary-gradient"/>
                              ) : (
                                <Volume2 size={16}/>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t('translation.speakText')}</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                  
                  {/* ===== TRANSLATED TEXT OUTPUT AREA ===== */}
                  <div>
                    <Textarea 
                      placeholder={t('translation.translationWillAppear')} 
                      value={outputText} 
                      readOnly 
                      className="min-h-[150px] bg-muted text-muted-foreground" 
                      rows={6}
                    />
                    
                    {/* Output controls */}
                    <div className="flex justify-end items-center mt-1">
                      {/* Copy translated text button */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleCopy(outputText)} 
                            disabled={!outputText}
                          >
                            <Copy size={16}/>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('translation.copyTranslation')}</TooltipContent>
                      </Tooltip>
                      
                      {/* Text-to-speech for translated text */}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleTTS(outputText)} 
                            disabled={!outputText}
                          >
                            {isSpeaking ? (
                              <Volume2 size={16} className="text-secondary-gradient"/>
                            ) : (
                              <Volume2 size={16}/>
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t('translation.speakTranslation')}</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              )}
              /**
 * Document translation interface (file upload and management)
 * 
 * This section contains:
 * - File upload drag-and-drop area
 * - File selection and validation
 * - Uploaded files list with progress indicators
 * - PDF to DOCX conversion toggle
 * - File removal functionality
 * - File status indicators (queued, processing, completed, failed)
 */

              {/* ===== DOCUMENT TRANSLATION INTERFACE ===== */}
              {jobType === 'document' && (
                <div className="space-y-4">
                  {/* ===== FILE UPLOAD AREA ===== */}
                  <Card className="border-dashed border-2 hover:border-primary transition-colors">
                    <CardContent className="p-4 md:p-6 text-center">
                      {/* Upload icon */}
                      <FileUp className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-2" />
                      
                      {/* Upload instructions */}
                      <p className="mb-2 text-xs md:text-sm text-muted-foreground">
                        {t('translation.dragDropOrBrowse')}
                      </p>
                      
                      {/* Browse files button */}
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => fileInputRef.current?.click()} 
                        disabled={isLoading || activeJob?.status === 'in-progress'}
                      >
                        {t('translation.browseFiles')}
                      </Button>
                      
                      {/* Hidden file input */}
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        multiple 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept={ALLOWED_DOC_EXTENSIONS.join(',')} 
                      />
                      
                      {/* Upload limits information */}
                      <p className="mt-2 text-xs text-muted-foreground">
                        {translateWithParams(t, 'translation.maxFiles', { 
                          max: MAX_FILES_PER_JOB, 
                          size: MAX_TOTAL_UPLOAD_SIZE_MB 
                        })}
                      </p>
                    </CardContent>
                  </Card>

                  {/* ===== UPLOADED FILES LIST ===== */}
                  {uploadedFiles.length > 0 && (
                    <ScrollArea className="max-h-60 border rounded-md p-2">
                      {/* Files list header */}
                      <div className="flex justify-between items-center mb-2">
                        {/* File count */}
                        <p className="text-sm font-medium">
                          {translateWithParams(t, 'translation.selectedFiles', { 
                            count: uploadedFiles.length, 
                            max: MAX_FILES_PER_JOB 
                          })}
                        </p>
                        
                        {/* PDF conversion help text */}
                        {hasAnyPdfFileInUploads && (
                          <p className="text-xs text-muted-foreground">
                            {t('translation.togglePdfDocx')}
                          </p>
                        )}
                      </div>
                      
                      {/* Files list */}
                      <ul className="space-y-2">
                        {uploadedFiles.map(file => (
                          <li key={file.id} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 text-sm">
                            {/* File info section */}
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {/* File icon */}
                              <FileText size={18} className="text-primary shrink-0" />
                              
                              {/* File name with tooltip */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="truncate flex-1 min-w-0" title={file.originalName}>
                                    {file.originalName}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{file.originalName}</p>
                                </TooltipContent>
                              </Tooltip> 
                              
                              {/* File size */}
                              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            
                            {/* File controls section */}
                            <div className='flex items-center gap-1 shrink-0'>
                              {/* Progress indicator for processing files */}
                              {file.status === 'processing' && file.progress != null && (
                                <div className="w-20 flex items-center gap-1">
                                  <Progress value={file.progress} className="h-1.5 flex-1" />
                                  <span className='text-xs'>{file.progress}%</span>
                                </div>
                              )}
                              
                              {/* Status icons */}
                              {file.status === 'completed' && (
                                <CheckCircleIcon size={16} className="text-accent-success shrink-0" />
                              )}
                              {file.status === 'failed' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <XCircleIcon size={16} className="text-destructive shrink-0 cursor-default" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t('common.failed')}: {file.error || t('common.unknownError')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              
                              {/* PDF to DOCX conversion toggle */}
                              {hasAnyPdfFileInUploads && file.type === 'application/pdf' ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant={file.convertToDocx ? "secondary" : "outline"} 
                                      size="sm" 
                                      className="h-7 px-2 text-xs" 
                                      onClick={() => togglePdfToDocx(file.id)} 
                                      disabled={
                                        isLoading || 
                                        activeJob?.status === 'in-progress' || 
                                        file.status === 'processing' || 
                                        file.status === 'completed'
                                      }
                                    >
                                      <FileSliders size={14} className="mr-1"/> DOCX
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{t('translation.pdfToDocxTooltip')}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                // Spacer to maintain alignment when not all files are PDFs
                                hasAnyPdfFileInUploads && <div className="w-[78px] h-7"></div>
                              )}
                              
                              {/* Remove file button */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 text-destructive" 
                                    onClick={() => removeUploadedFile(file.id)} 
                                    disabled={
                                      isLoading || 
                                      activeJob?.status === 'in-progress' || 
                                      file.status === 'processing' || 
                                      file.status === 'completed'
                                    }
                                  >
                                    <XCircleIcon size={16} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{t('translation.removeFile')}</TooltipContent>
                              </Tooltip> 
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                  /**
 * TranslatePage Component - Part 4H
 * Document translation results and error handling
 * 
 * This section contains:
 * - Translated documents display section
 * - File selection and download controls
 * - Bulk download functionality (selected files and all files as ZIP)
 * - Error display for failed translation jobs
 * - Individual file error handling
 */

                  {/* ===== TRANSLATED DOCUMENTS SECTION ===== */}
                  {activeJob?.status === 'complete' && 
                   activeJob.translatedFilesByLanguage?.[targetLang] && 
                   activeJob.translatedFilesByLanguage[targetLang].length > 0 && (
                    <div>
                      {/* Section header */}
                      <h4 className="text-md font-semibold mb-2 mt-4">
                        {translateWithParams(t, 'translation.translatedDocuments', { 
                          language: getLanguageName(targetLang) 
                        })}
                      </h4>
                      
                      {/* Translated files list */}
                      <ScrollArea className="max-h-48 border rounded-md p-2">
                        <ul className="space-y-2">
                          {(activeJob.translatedFilesByLanguage[targetLang] || []).map(artifact => (
                            <li key={artifact.name} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm gap-2">
                              {/* File selection and info */}
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {/* Selection checkbox */}
                                <Checkbox 
                                  id={`cb-${artifact.name}`} 
                                  checked={!!selectedTranslatedFiles[artifact.name]} 
                                  onCheckedChange={() => handleSelectedTranslatedFileToggle(artifact.name)} 
                                  className="mr-1 shrink-0"
                                />
                                
                                {/* Success file icon */}
                                <FileText size={18} className="text-accent-success shrink-0" />
                                
                                {/* File name with tooltip */}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="truncate flex-1 min-w-0" title={artifact.name}>
                                      {artifact.name}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{artifact.name}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              
                              {/* Individual download button */}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-7 text-xs shrink-0" 
                                onClick={() => toast({
                                  title: t('translation.downloadSimulated'), 
                                  description: translateWithParams(t, 'translation.wouldDownload', { 
                                    fileName: artifact.name 
                                  })
                                })}
                              >
                                <Download size={14} className="mr-1"/> {t('translation.download')}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                      
                      {/* Bulk download controls */}
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-end">
                        {/* Download selected files button */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleDownloadSelected} 
                          disabled={Object.values(selectedTranslatedFiles).every(v => !v)}
                        >
                          <Download className="mr-2 h-4 w-4" /> {t('translation.downloadSelected')}
                        </Button>
                        
                        {/* Download all as ZIP button */}
                        <Button variant="outline" size="sm" onClick={handleDownloadAllZip}>
                          <Archive className="mr-2 h-4 w-4" /> {t('translation.downloadAllZip')}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* ===== ERROR DISPLAY FOR FAILED JOBS ===== */}
                  {activeJob?.status === 'failed' && 
                   (activeJob.errorMessage || uploadedFiles.some(f => f.status === 'failed')) && (
                    <Card className="mt-2 border-destructive bg-destructive/10">
                      {/* Error card header */}
                      <CardHeader className="p-3">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="h-5 w-5" />
                          <CardTitle className="text-base">{t('translation.translationIssues')}</CardTitle>
                        </div>
                      </CardHeader>
                      
                      {/* Error details */}
                      <CardContent className="p-3 pt-0 text-sm text-destructive">
                        {/* General job error message */}
                        {activeJob.errorMessage && (
                          <p>{activeJob.errorMessage || t('translation.processingFailed')}</p>
                        )}
                        
                        {/* Individual file errors */}
                        {uploadedFiles.filter(f => f.status === 'failed').map(f => (
                          <p key={f.id} className="mt-1">
                            {t('translation.fileError')}
                          </p>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
      /**
 * TranslatePage Component - Part 4I
 * Job panel footer with action buttons
 * 
 * This section contains:
 * - Footer action buttons (delete, cancel, save, translate)
 * - Dynamic button states based on job status
 * - Progress indicators and status-specific styling
 * - Responsive layout for mobile and desktop
 * - Completion of the renderTranslationJobPanel function
 */

      {/* ===== JOB PANEL FOOTER WITH ACTION BUTTONS ===== */}
      {activeJob && (
        <CardFooter className="border-t p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          {/* Left side - Destructive actions */}
          <div className="w-full sm:w-auto">
            {/* Delete job button (only shown when not in progress) */}
            {activeJob.status !== 'in-progress' && (
              <Button 
                variant="destructive" 
                onClick={() => requestDeleteJob(activeJob.id)} 
                disabled={isLoading} 
                size="sm" 
                className="mr-2 w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" /> {t('translation.deleteJob')}
              </Button>
            )}
          </div>
          
          {/* Right side - Primary actions */}
          <div className="flex gap-2 w-full sm:w-auto">
            {/* ===== CANCEL BUTTON ===== */}
            {activeJob.status !== 'in-progress' && (
              <Button 
                variant="outline" 
                onClick={handleCancelActiveJob} 
                disabled={isLoading} 
                size="sm" 
                className="flex-1 sm:flex-none"
              >
                <XCircleIcon className="mr-2 h-4 w-4" /> {t('translation.cancel')}
              </Button>
            )}
            
            {/* ===== SAVE DRAFT BUTTON ===== */}
            {activeJob.status !== 'in-progress' && (
              <Button 
                variant="outline" 
                onClick={handleSaveDraft} 
                disabled={
                  isLoading || 
                  !jobTitle.trim() || 
                  (!isFormDirty && 
                   activeJob.status !== 'complete' && 
                   activeJob.status !== 'archived' && 
                   activeJob.status !== 'failed')
                } 
                size="sm" 
                className="flex-1 sm:flex-none"
              >
                <Save className="mr-2 h-4 w-4" />
                {/* Dynamic save button text based on job state */}
                {(activeJob.status === 'complete' || activeJob.status === 'archived' || activeJob.status === 'failed') && isFormDirty 
                  ? t('translation.save') 
                  : (activeJob.status === 'complete' || activeJob.status === 'archived' || activeJob.status === 'failed') && !isFormDirty 
                    ? t('translation.saved') 
                    : t('translation.save')
                }
              </Button>
            )}
            
            {/* ===== TRANSLATE BUTTON ===== */}
            {(activeJob.status === 'draft' || activeJob.status === 'failed') && (
              <Button 
                onClick={jobType === 'text' ? handleTranslateTextJob : handleTranslateDocumentJob} 
                disabled={
                  isLoading || 
                  (jobType === 'text' && !inputText.trim()) || 
                  (jobType === 'document' && 
                   uploadedFiles.filter(f => f.status === 'queued' || f.status === 'failed').length === 0 && 
                   !uploadedFiles.some(f => f.status === 'processing')) || 
                  !jobTitle.trim()
                } 
                className="bg-primary-gradient text-primary-foreground hover:opacity-90 flex-1 sm:flex-none" 
                size="sm"
              >
                {/* Dynamic icon based on loading state */}
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Play className="mr-2 h-4 w-4" />
                )}
                {t('translation.translate')}
              </Button>
            )}
            
            {/* ===== IN-PROGRESS STATUS INDICATOR ===== */}
            {activeJob.status === 'in-progress' && (
              <Button disabled variant="secondary" size="sm" className="w-full sm:w-auto">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('translation.translating')}
              </Button>
            )}
            
            {/* ===== COMPLETED STATUS INDICATOR ===== */}
            {activeJob.status === 'complete' && (
              <Button 
                variant="default" 
                disabled 
                className="bg-accent-success hover:bg-accent-success/90 w-full sm:w-auto" 
                size="sm"
              >
                <CheckSquare className="mr-2 h-4 w-4" /> {t('translation.completed')}
              </Button>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
/**
 * TranslatePage Component - Part 4J
 * History panel rendering function
 * 
 * This section contains:
 * - renderHistoryPanel() function
 * - Job history list with search and filtering
 * - Archive toggle and status filters
 * - Job selection and management actions
 * - Empty state when no jobs match filters
 */

  /**
   * HISTORY PANEL RENDERING FUNCTION
   * Renders the job history panel with search, filters, and job list
   */

  /**
   * Render the job history panel
   * Shows list of previous translation jobs with search and filter capabilities
   */
  
const renderHistoryPanel = () => (
  <Card className="flex-1 shadow-xl flex flex-col overflow-hidden min-h-[400px]">
    {/* ===== HISTORY PANEL HEADER ===== */}
    <CardHeader className="pb-3 p-3">
      <div className="flex flex-col gap-3">
        <CardTitle className="text-xl">{t('translation.jobHistory')}</CardTitle>
        
        {/* New job button */}
        <Button 
          size="sm" 
          onClick={() => handleNewJob()}
          className="bg-primary hover:bg-primary/90 transition-colors self-start w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> 
          <span className="whitespace-nowrap">{t('translation.newJob')}</span>
        </Button>
      </div>
    </CardHeader>
    
    {/* ===== SEARCH AND FILTERS SECTION ===== */}
    <CardContent className="pt-0 px-3 md:px-4 pb-3 md:pb-4">
      <div className="space-y-3 md:space-y-4">
        {/* Search field */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('translation.searchJobs')}
            value={historySearchTerm}
            onChange={(e) => setHistorySearchTerm(e.target.value)}
            className="pl-9 h-9 md:h-10 w-full"
          />
        </div>
        
        {/* Filter controls */}
        <div className="flex flex-col gap-2">
          {/* Job type filter */}
          <div className="w-full">
            <Select 
              value={historyFilterType} 
              onValueChange={(v) => setHistoryFilterType(v as 'all' | TranslationJobType)}
            >
              <SelectTrigger className="h-9 md:h-10 w-full">
                <SelectValue placeholder={t('translation.allTypes')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('translation.allTypes')}</SelectItem>
                <SelectItem value="text">{t('translation.textJobs')}</SelectItem>
                <SelectItem value="document">{t('translation.documentJobs')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Status filter and archive toggle */}
          <div className="flex gap-2">
            {/* Status filter dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 md:h-10 flex-1">
                  <ListFilter className="mr-2 h-4 w-4" /> 
                  <span className="whitespace-nowrap">{t('translation.status')}</span> 
                  {historyFilterStatus.length > 0 && 
                    <Badge variant="secondary" className="ml-2">
                      {historyFilterStatus.length}
                    </Badge>
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>{t('translation.filterByStatus')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['draft', 'in-progress', 'complete', 'failed', 'archived'] as TranslationJobStatus[]).map(status => ( 
                  <DropdownMenuCheckboxItem
                    key={status}
                    checked={historyFilterStatus.includes(status)}
                    onCheckedChange={() => toggleHistoryFilterStatus(status)}
                    className="capitalize"
                  >
                    {status.replace('-', ' ')}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Archive toggle button */}
            <Button 
              variant={showArchived ? "secondary" : "outline"} 
              size="icon" 
              className="h-9 md:h-10 w-10 shrink-0" 
              onClick={() => setShowArchived(!showArchived)}
              title="Show/Hide Archived Jobs"
            >
              <Archive size={16} />
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
    
    {/* ===== JOBS LIST SECTION ===== */}
    <ScrollArea className="flex-grow p-2">
      {filteredJobs.length === 0 ? (
        /* Empty state when no jobs match filters */
        <div className="text-center text-muted-foreground py-6 px-3">
          <div className="bg-slate-800/50 p-3 rounded-full mx-auto mb-3 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center">
            <Info className="h-5 w-5 md:h-6 md:w-6 opacity-70" />
          </div>
          <h3 className="text-sm md:text-base font-medium mb-1">{t('translation.noJobsMatch')}</h3>
          <p className="text-xs opacity-70 max-w-[180px] mx-auto">
            {t('translation.adjustFilters')}
          </p>
        </div>
      ) : (
        /* Jobs list */
        <div className="space-y-3 px-1 md:px-2">
          {filteredJobs.map(job => (
            <Card
              key={job.id}
              className={cn(
                "hover:shadow-md transition-shadow cursor-pointer border",
                activeJob?.id === job.id ? "ring-2 ring-primary border-primary" : "border-border"
              )}
              onClick={() => handleSelectJobFromHistory(job.id)}
            >
              <CardContent className="p-2 md:p-3">
                {/* Job info section */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-grow min-w-0">
                    {/* Job name */}
                    <p className="font-semibold truncate text-sm md:text-base" title={job.name}>
                      {job.name}
                    </p>
                    
                    {/* Job metadata */}
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="capitalize">{job.type}</span>
                      <span className="mx-2">•</span>
                      <Clock size={12} className="mr-1" /> 
                      {format(new Date(job.updatedAt), "MMM d, HH:mm")}
                    </div>
                  </div>
                  
                  {/* Job status badge */}
                  <JobStatusBadge status={job.status} />
                </div>
                
                {/* Job action buttons */}
                <div className="flex justify-end mt-2">
                  {/* Archive/unarchive button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "h-8 w-8", 
                      job.status === 'archived' 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-primary"
                    )}
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleArchiveJob(job.id); 
                    }}
                    title={job.status === 'archived' ? "Unarchive" : "Archive"}
                  >
                    <Archive size={14} />
                  </Button>
                  
                  {/* Delete job button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive" 
                    onClick={(e) => {
                      e.stopPropagation(); 
                      requestDeleteJob(job.id);
                    }}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </ScrollArea>
  </Card>
);

  /**
 * TranslatePage Component - Part 4K
 * Feedback panel rendering function
 * 
 * This section contains:
 * - renderUserFeedbackPanel() function
 * - User feedback collection form
 * - Bulk upload toggle and file handling
 * - Feedback items list with search functionality
 * - Template download and form validation
 */

  /**
   * FEEDBACK PANEL RENDERING FUNCTION
   * Renders the user feedback collection panel
   */

  /**
   * Render the user feedback panel
   * Contains form for collecting user feedback and displaying feedback history
   */
  const renderUserFeedbackPanel = () => (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* ===== MAIN FEEDBACK CARD ===== */}
      <Card>
        {/* Feedback panel header */}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <MessageSquareText size={24} className="text-primary" />
            <CardTitle className="text-xl">{t('translation.feedback.title')}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Instructions section */}
          <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md mb-4 border border-border">
            <Info size={20} className="text-muted-foreground mt-1 shrink-0" />
            <div>
              <h4 className="font-medium text-sm">{t('translation.feedback.instructionsTitle')}</h4>
              <p className="text-xs text-muted-foreground mt-1">{t('translation.feedback.instructionsBody')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('translation.feedback.supportedFormats')}</p>
            </div>
          </div>

          {/* Feedback form section */}
          <div className="border-t border-border pt-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <PlusCircle size={20} className="text-primary"/>
              <h3 className="text-lg font-semibold">{t('translation.feedback.addFeedbackTitle')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{t('translation.feedback.addFeedbackDescription')}</p>

            {/* Language selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Source language selector */}
              <div className="space-y-1">
                <Label htmlFor="feedbackSourceLang">{t('translation.sourceLanguage')}</Label>
                <Select value={feedbackSourceLang} onValueChange={setFeedbackSourceLang} disabled={isSubmittingFeedback}>
                  <SelectTrigger id="feedbackSourceLang">
                    <SelectValue placeholder={t('translation.selectSourceLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map(l => (
                      <SelectItem key={`fb-src-${l.code}`} value={l.code}>
                        {t(`languages.${l.code}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Target language selector */}
              <div className="space-y-1">
                <Label htmlFor="feedbackTargetLang">{t('translation.targetLanguage')}</Label>
                <Select value={feedbackTargetLang} onValueChange={setFeedbackTargetLang} disabled={isSubmittingFeedback}>
                  <SelectTrigger id="feedbackTargetLang">
                    <SelectValue placeholder={t('translation.selectTargetLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedLanguages.map(l => (
                      <SelectItem 
                        key={`fb-tgt-${l.code}`} 
                        value={l.code} 
                        disabled={l.code === feedbackSourceLang && feedbackSourceLang !== ''}
                      >
                        {t(`languages.${l.code}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Keyword input fields (for non-bulk mode) */}
            {!feedbackBulkMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Source language keywords */}
                <Card>
                  <CardHeader className="p-3 border-b">
                    <Label htmlFor="sourceKeyword" className="text-sm">
                      {t('translation.sourceLanguage')} {t('translation.feedback.keywords')}
                    </Label>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Textarea 
                      id="sourceKeyword" 
                      placeholder={t('translation.feedback.sourceKeywordPlaceholder')} 
                      value={feedbackSourceKeyword} 
                      onChange={(e) => setFeedbackSourceKeyword(e.target.value)} 
                      className="min-h-[100px] border-0 rounded-t-none focus-visible:ring-0 resize-none" 
                      disabled={isSubmittingFeedback}
                    />
                  </CardContent>
                </Card>
                
                {/* Target language keywords */}
                <Card>
                  <CardHeader className="p-3 border-b">
                    <Label htmlFor="targetKeyword" className="text-sm">
                      {t('translation.targetLanguage')} {t('translation.feedback.keywords')}
                    </Label>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Textarea 
                      id="targetKeyword" 
                      placeholder={t('translation.feedback.targetKeywordPlaceholder')} 
                      value={feedbackTargetKeyword} 
                      onChange={(e) => setFeedbackTargetKeyword(e.target.value)} 
                      className="min-h-[100px] border-0 rounded-t-none focus-visible:ring-0 resize-none" 
                      disabled={isSubmittingFeedback}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Bulk upload section */}
            <Card className="p-4 mb-6 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Upload size={20} className="text-primary"/>
                  <div>
                    <Label htmlFor="bulk-upload-switch" className="font-medium">
                      {t('translation.feedback.bulkUploadLabel')}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {t('translation.feedback.bulkUploadDescription')}
                    </p>
                  </div>
                </div>
                <Switch 
                  id="bulk-upload-switch" 
                  checked={feedbackBulkMode} 
                  onCheckedChange={setFeedbackBulkMode} 
                  disabled={isSubmittingFeedback} 
                />
              </div>
              
              {/* Bulk mode controls */}
              {feedbackBulkMode && (
                <div className="mt-4 space-y-3">
                  {/* Template download button */}
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={downloadFeedbackTemplate} 
                    className="p-0 h-auto text-xs" 
                    disabled={isSubmittingFeedback}
                  >
                    <Download size={14} className="mr-1"/>
                    {t('translation.feedback.downloadTemplate')}
                  </Button>
                  
                  {/* File upload area */}
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      ref={feedbackFileInputRef}
                      onChange={handleFeedbackFileChange}
                      accept={ALLOWED_FEEDBACK_FILE_EXTENSIONS.join(',')}
                      className="hidden"
                      disabled={isSubmittingFeedback}
                    />
                    
                    {feedbackFile ? (
                      /* File selected state */
                      <div className="flex items-center justify-center gap-2">
                        <FileText size={20} className="text-primary" />
                        <span className="text-sm font-medium">{feedbackFileName}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFeedbackFile(null);
                            setFeedbackFileName('');
                          }}
                          disabled={isSubmittingFeedback}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      /* File selection prompt */
                      <div>
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <Button
                          variant="outline"
                          onClick={() => feedbackFileInputRef.current?.click()}
                          disabled={isSubmittingFeedback}
                        >
                          {t('translation.feedback.selectFile')}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          {t('translation.feedback.supportedFormats')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            {/* Submit button */}
            <div className="flex justify-end">
              <Button
                onClick={handleFeedbackSubmit}
                disabled={isSubmittingFeedback}
                className="min-w-[120px]"
              >
                {isSubmittingFeedback ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquareText className="mr-2 h-4 w-4" />
                )}
                {t('translation.feedback.submitFeedback')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== FEEDBACK HISTORY SECTION ===== */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t('translation.feedback.feedbackHistory')}</CardTitle>
            <Badge variant="secondary">{userFeedbackItems.length}</Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Feedback search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('translation.feedback.searchFeedback')}
              value={feedbackSearchTerm}
              onChange={(e) => setFeedbackSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Feedback items list */}
          <ScrollArea className="max-h-60">
            {filteredFeedbackItems.length === 0 ? (
              <div className="text-center text-muted-foreground py-6">
                <MessageSquareText className="mx-auto h-8 w-8 opacity-50 mb-2" />
                <p className="text-sm">{t('translation.feedback.noFeedbackItems')}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFeedbackItems.map(item => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {getLanguageName(item.sourceLanguage)} → {getLanguageName(item.targetLanguage)}
                          </Badge>
                          {item.isBulk && <Badge variant="secondary" className="text-xs">BULK</Badge>}
                        </div>
                        
                        {item.isBulk ? (
                          <p className="text-sm font-medium">{item.fileName}</p>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-sm">
                              <span className="font-medium">Source:</span> {item.sourceKeyword}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Target:</span> {item.targetKeyword}
                            </p>
                          </div>
                        )}
                        
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(item.createdAt), "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => requestDeleteFeedback(item.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
  /**
 * TranslatePage Component - Part 4L
 * Main component JSX return with modal dialogs and export
 * 
 * This section contains:
 * - Main component JSX return structure
 * - TooltipProvider wrapper
 * - Layout with tab system (translation, history, feedback)
 * - Modal dialogs (cancel confirmation, delete confirmation)
 * - Component export
 */

  /**
   * MAIN COMPONENT JSX RETURN
   * The main render function that puts together all panels and modals
   */
  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-6 max-w-7xl">
        {/* ===== PAGE HEADER ===== */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('translation.pageTitle')}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            {t('translation.pageDescription')}
          </p>
        </div>

        {/* ===== MAIN CONTENT AREA ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          {/* ===== LEFT PANEL - TRANSLATION JOB ===== */}
          <div className="lg:col-span-8">
            {renderTranslationJobPanel()}
          </div>

          {/* ===== RIGHT PANEL - HISTORY ===== */}
          <div className="lg:col-span-4">
            {renderHistoryPanel()}
          </div>
        </div>

        {/* ===== FEEDBACK PANEL (FULL WIDTH) ===== */}
        <div className="w-full">
          {renderUserFeedbackPanel()}
        </div>

        {/* ===== MODAL DIALOGS ===== */}
        
        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <AlertDialogContent className="max-w-[90vw] md:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('translation.discardChanges')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('translation.unsavedChangesDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={() => setShowCancelConfirm(false)}>
                {t('translation.keepEditing')}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={performCancelAction} 
                className={buttonVariants({variant: "destructive"})}
              >
                {t('translation.discardAndReset')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Job Confirmation Dialog */}
        <AlertDialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
          <AlertDialogContent className="max-w-[90vw] md:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('translation.deleteJobConfirm')}</AlertDialogTitle>
              <AlertDialogDescription>
                {translateWithParams(t, 'translation.deleteJobDesc', { 
                  jobName: jobs.find(j => j.id === jobIdPendingDeletion)?.name || 'this job' 
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={() => {
                setShowDeleteConfirmModal(false); 
                setJobIdPendingDeletion(null);
              }}>
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteJob} 
                className={buttonVariants({variant: "destructive"})}
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Feedback Confirmation Dialog */}
        <AlertDialog open={showDeleteFeedbackConfirm} onOpenChange={setShowDeleteFeedbackConfirm}>
          <AlertDialogContent className="max-w-[90vw] md:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>{t('translation.feedback.deleteFeedbackConfirm')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('translation.feedback.deleteFeedbackDesc')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogCancel onClick={() => {
                setShowDeleteFeedbackConfirm(false); 
                setFeedbackIdToDelete(null);
              }}>
                {t('common.cancel')}
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDeleteFeedback} 
                className={buttonVariants({variant: "destructive"})}
              >
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

/**
 * COMPONENT EXPORT
 * Default export of the TranslatePage component
 */
export default TranslatePage;