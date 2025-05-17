"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRightLeft, Copy, Volume2, Trash2, LanguagesIcon, PlusCircle, Search, Filter, Archive, CheckSquare, Square, X,
  FileText, FileUp, Save, Play, XCircle as XCircleIcon, RotateCcw, Edit3, Download, Share2, Clock, ListFilter, FileSliders, AlertTriangle, Loader2, CheckCircle as CheckCircleIcon, Info, Edit
} from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';
import type { TranslationJob, TranslationJobType, TranslationJobStatus, UploadedFile, TranslatedFileArtifact } from '@/lib/types';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
];

const MAX_JOB_TITLE_LENGTH = 100;
const MAX_TEXT_INPUT_LENGTH = 10000;
const MAX_FILES_PER_JOB = 5;
const MAX_TOTAL_UPLOAD_SIZE_MB = 100;
const MAX_TOTAL_UPLOAD_SIZE_BYTES = MAX_TOTAL_UPLOAD_SIZE_MB * 1024 * 1024;
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


const JobStatusBadge: React.FC<{ status: TranslationJobStatus }> = ({ status }) => {
  const variant: "default" | "secondary" | "destructive" | "outline" =
    status === 'complete' ? 'default' :
    status === 'in-progress' ? 'secondary' :
    status === 'archived' ? 'destructive' :
    status === 'draft' ? 'outline' :
    status === 'failed' ? 'destructive' :
    'outline';
  
  const textClass = 
    status === 'complete' ? 'text-accent-success' :
    status === 'in-progress' ? 'text-accent-info' :
    status === 'archived' ? 'text-destructive' :
    status === 'draft' ? 'text-muted-foreground' :
    status === 'failed' ? 'text-destructive' :
    'text-muted-foreground';

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


const TranslatePage = () => {
  const { toast } = useToast();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [activeJob, setActiveJob] = useState<TranslationJob | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<TranslationJobType>('text');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es'); 
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [outputText, setOutputText] = useState(''); 
  const [selectedTranslatedFiles, setSelectedTranslatedFiles] = useState<Record<string, boolean>>({});

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [jobIdPendingDeletion, setJobIdPendingDeletion] = useState<string | null>(null);
  
  // History panel states
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState<'all' | TranslationJobType>('all');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<TranslationJobStatus[]>([]);
  const [showArchived, setShowArchived] = useState(false);


  // Load jobs from localStorage
  useEffect(() => {
    const storedJobs = localStorage.getItem('flowserveai-translation-jobs');
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs).sort((a:TranslationJob,b:TranslationJob) => b.updatedAt - a.updatedAt));
      } catch (e) {
        console.error("Failed to parse translation jobs from localStorage", e);
        setJobs([]);
      }
    }
  }, []);

  // Save jobs to localStorage
  useEffect(() => {
    if (jobs.length > 0 || localStorage.getItem('flowserveai-translation-jobs')) { 
        localStorage.setItem('flowserveai-translation-jobs', JSON.stringify(jobs.sort((a,b) => b.updatedAt - a.updatedAt)));
    } else if (jobs.length === 0 && localStorage.getItem('flowserveai-translation-jobs')) {
        localStorage.removeItem('flowserveai-translation-jobs');
    }
  }, [jobs]);

  // Update isFormDirty state
  useEffect(() => {
    if (!activeJob) {
      setIsFormDirty(false); // No active job, no form to be dirty
      return;
    }
    
    const titleDirty = jobTitle !== activeJob.name;
    const typeDirty = jobType !== activeJob.type;
    const sourceLangDirty = sourceLang !== activeJob.sourceLanguage;
    const targetLangDirty = targetLang !== (activeJob.targetLanguages[0] || 'es'); 
    const inputTextDirty = jobType === 'text' && inputText !== (activeJob.inputText || '');
    
    const filesDirty = jobType === 'document' && (
                       uploadedFiles.length !== (activeJob.sourceFiles?.length || 0) || 
                       !uploadedFiles.every((uf, i) => {
                         const ajf = activeJob.sourceFiles?.[i];
                         return ajf && uf.id === ajf.id && uf.convertToDocx === ajf.convertToDocx && uf.status === ajf.status;
                       }));

    setIsFormDirty(titleDirty || typeDirty || sourceLangDirty || targetLangDirty || inputTextDirty || filesDirty);
  }, [jobTitle, jobType, sourceLang, targetLang, inputText, uploadedFiles, activeJob]);


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
    if(fromCancel) setIsFormDirty(false); // Explicitly set false for cancel.
    else setTimeout(() => setIsFormDirty(false),0); // Ensure dirty check runs after state updates for other resets
  };
  
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

  // Core function to update an active job, or add it if it's new
  const persistActiveJobDetails = useCallback((updates: Partial<TranslationJob>, newStatus?: TranslationJobStatus): TranslationJob | null => {
    if (!activeJob) return null; 

    let currentJobData = { ...activeJob };

    currentJobData.name = jobTitle.trim() || 'Untitled Translation Job';
    currentJobData.type = jobType;
    currentJobData.sourceLanguage = sourceLang;
    currentJobData.targetLanguages = [targetLang]; 
    if (jobType === 'text') {
        currentJobData.inputText = inputText;
        currentJobData.outputTextByLanguage = { ...(currentJobData.outputTextByLanguage || {}), [targetLang]: outputText };
    } else {
        currentJobData.sourceFiles = uploadedFiles;
    }
    
    const finalJobToPersist: TranslationJob = {
      ...currentJobData,
      ...updates, 
      status: newStatus || updates.status || currentJobData.status,
      updatedAt: Date.now(),
    };

    setJobs(prevJobs => {
      const jobExistsInList = prevJobs.some(j => j.id === finalJobToPersist.id);
      if (jobExistsInList) {
        return prevJobs.map(j => (j.id === finalJobToPersist.id ? finalJobToPersist : j)).sort((a, b) => b.updatedAt - a.updatedAt);
      }
      // This path is for brand new jobs that are now being persisted (e.g., on first save/translate)
      return [finalJobToPersist, ...prevJobs].sort((a, b) => b.updatedAt - a.updatedAt);
    });

    setActiveJob(finalJobToPersist); 
    setTimeout(() => setIsFormDirty(false), 0); 
    return finalJobToPersist;
  }, [activeJob, jobTitle, jobType, sourceLang, targetLang, inputText, outputText, uploadedFiles, setJobs, setActiveJob, setIsFormDirty]);


  const handleNewJob = (type: TranslationJobType = 'text') => {
    if (isFormDirty) {
        setShowCancelConfirm(true); // Prompt to save/discard if current form is dirty
        // If user confirms discard, performCancelAction will eventually call handleNewJob again without dirty form
        return; 
    }
    const newJobTemplate = createNewJobObject(type);
    setActiveJob(newJobTemplate); // This is a temporary active job, not yet in the `jobs` list
    loadJobToForm(newJobTemplate); // Populate form based on this template
  };

  const handleSelectJobFromHistory = (jobId: string) => {
    if (isFormDirty && activeJob && activeJob.id !== jobId) { // If form is dirty and trying to switch to a DIFFERENT job
        setShowCancelConfirm(true); 
        // TODO: Consider saving the jobIdToLoad and loading it if performCancelAction is chosen
        return;
    }
    const jobToLoad = jobs.find(j => j.id === jobId);
    if (jobToLoad) {
      loadJobToForm(jobToLoad);
    }
  };

  const handleJobTypeChange = (newType: TranslationJobType) => {
    setJobType(newType); // Always update the local state controlling the Select component first

    if (activeJob) {
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

      if (newType === 'text') {
        setUploadedFiles([]); 
        setOutputText(''); // Also clear output for new type
      } else { 
        setInputText(''); 
        setOutputText('');
      }
      // toast({ title: "Job Type Switched", description: `Switched to ${newType} translation. Save or translate to confirm.`, variant: "default" });
    } else {
      // No active job, so set up a new temporary one with the selected type
      handleNewJob(newType);
    }
  };

  const ensureActiveJobIsPersisted = () => {
    if (!activeJob) return null;
    
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
        setActiveJob(jobToPersist); // Ensure activeJob state is the one in the list
        return jobToPersist;
    }
    return activeJob; // Already exists, no need to re-add, just ensure current form values are used
  };


  const handleSaveDraft = () => {
    if (!activeJob) {
        toast({ title: "Nothing to save", description: "Create or select a job to save.", variant: "default" });
        return;
    }
    if (!jobTitle.trim()) {
      toast({ title: "Job title required", description: "Please enter a title for the job.", variant: "destructive" });
      return;
    }

    const jobAfterEnsuringPersistence = ensureActiveJobIsPersisted();
    if (!jobAfterEnsuringPersistence) return; // Should not happen if activeJob exists

    const savedJob = persistActiveJobDetails(
        { status: jobAfterEnsuringPersistence.status === 'in-progress' ? 'in-progress' : (jobAfterEnsuringPersistence.status === 'complete' ? 'complete' : 'draft') }
    );
    
    if (savedJob) {
        toast({ title: "Job Saved", description: `Job "${savedJob.name}" saved.` });
    }
  };
  
  const handleCancelActiveJob = () => {
    if (isFormDirty) {
      setShowCancelConfirm(true);
    } else {
      performCancelAction();
    }
  };

  const performCancelAction = () => {
    resetMainFormToEmpty(true); // true to signal it's from cancel, resets dirty flag immediately
    toast({ title: "Action Cancelled", description: "Current operation was cancelled." });
    setShowCancelConfirm(false);
  };


  const handleTranslateTextJob = async () => {
    if (!activeJob || jobType !== 'text' || !inputText.trim()) {
        if (!inputText.trim() && jobType === 'text') {
             toast({ title: "Input required", description: "Please enter text to translate.", variant: "destructive" });
        }
        return;
    }
    if (!jobTitle.trim()) {
        toast({ title: "Job title required", description: "Please enter a title for the job before translating.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    setOutputText(''); 
    
    const jobWithProgress = ensureActiveJobIsPersisted();
    if(!jobWithProgress) {
      setIsLoading(false);
      toast({ title: "Error", description: "Could not start translation. Active job not found.", variant: "destructive" });
      return;
    }
    
    // Set status to 'in-progress' before API call
    persistActiveJobDetails({}, 'in-progress');


    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l => l.code === sourceLang)?.name || 'English', 
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Spanish',
      });
      setOutputText(result.translatedText); 
      persistActiveJobDetails({ 
        outputTextByLanguage: { ...(activeJob?.outputTextByLanguage || {}), [targetLang]: result.translatedText },
      }, 'complete');
      toast({ title: "Translation Complete", description: `Job "${jobTitle}" finished.` });
    } catch (error) {
      console.error("Translation failed:", error);
      persistActiveJobDetails({ errorMessage: "Translation API call failed." }, 'failed');
      toast({ title: "Translation Error", description: "Could not translate text.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const processSingleFileForJob = async (file: UploadedFile, currentJob: TranslationJob, targetLangCode: string): Promise<UploadedFile> => {
    let currentFileState = { ...file, status: 'processing' as UploadedFile['status'], progress: 10 };
    
    // Update UI for this specific file
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500)); // Simulate upload
    currentFileState = { ...currentFileState, progress: 30 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800)); // Simulate processing
    currentFileState = { ...currentFileState, progress: 70 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));

    console.log(`Simulating translation for ${file.originalName} to ${targetLangCode}`);
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1000)); // Simulate translation
    
    const success = Math.random() > 0.1; 
    if (success) {
      currentFileState = { ...currentFileState, status: 'completed', progress: 100 };
      toast({ title: "File Processed", description: `${currentFileState.originalName} translation complete (simulated).` });
    } else {
      currentFileState = { ...currentFileState, status: 'failed', progress: 100, error: "Simulated processing failure." };
      toast({ title: "File Failed", description: `${currentFileState.originalName} failed to translate (simulated).`, variant: "destructive" });
    }
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    return currentFileState;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    let jobContext = activeJob;

    if (!jobContext) { 
      const newJobTemplate = createNewJobObject('document');
      setActiveJob(newJobTemplate); // Set as temp active job
      setJobType('document'); // Ensure UI state matches
      jobContext = newJobTemplate;
      // Don't loadToForm yet, processFiles will update `uploadedFiles` and then form fields derive from `activeJob`
    } else if (jobContext.type !== 'document') { 
      setJobType('document'); // Update UI select
      const updatedFieldsForTypeSwitch: Partial<TranslationJob> = {
        type: 'document', status: 'draft', inputText: '', sourceFiles: [], outputTextByLanguage: {},
      };
      const switchedJob = { ...jobContext, ...updatedFieldsForTypeSwitch };
      setActiveJob(switchedJob);
      jobContext = switchedJob;
      setInputText(''); // Clear text fields explicitly
      setOutputText('');
      toast({ title: "Job type switched", description: "Switched to Document Translation mode."});
    }
    
    processFiles(Array.from(files), jobContext); // Pass the current jobContext
    
    if(fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const processFiles = (filesToProcess: File[], currentJobContext: TranslationJob) => {
     let currentSourceFiles = [...(currentJobContext.sourceFiles || [])];
     let currentTotalSize = currentSourceFiles.reduce((acc, f) => acc + f.size, 0);
     const newUploads: UploadedFile[] = [];

    for (const file of filesToProcess) {
      if (currentSourceFiles.length + newUploads.length >= MAX_FILES_PER_JOB) {
        toast({ title: "File limit reached", description: `Maximum ${MAX_FILES_PER_JOB} files per job.`, variant: "destructive" });
        break;
      }
      if (!ALLOWED_DOC_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext)) && !ALLOWED_DOC_MIMES[file.type]) {
        toast({ title: "Invalid file type", description: `${file.name} is not a supported document type.`, variant: "destructive" });
        continue;
      }
      if (currentTotalSize + file.size > MAX_TOTAL_UPLOAD_SIZE_BYTES) {
        toast({ title: "Size limit exceeded", description: `Total upload size cannot exceed ${MAX_TOTAL_UPLOAD_SIZE_MB}MB.`, variant: "destructive" });
        break;
      }

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
      setUploadedFiles(updatedSourceFilesList); // Update UI state for file list
      
      // Update the temporary activeJob with these new files. 
      // It will be persisted on save/translate if it's a new job.
      setActiveJob(prev => prev ? { ...prev, sourceFiles: updatedSourceFilesList, type: 'document', status: 'draft' } : null);
      // toast({ title: "Files Added", description: `${newUploads.length} file(s) added to the job. Save or translate to confirm.` });
    }
  };
  
  const removeUploadedFile = (fileId: string) => {
    const updatedList = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedList);
    if(activeJob) setActiveJob(prev => prev ? {...prev, sourceFiles: updatedList} : null);
  };

  const togglePdfToDocx = (fileId: string) => {
    const updatedList = uploadedFiles.map(f => f.id === fileId && f.type === 'application/pdf' ? {...f, convertToDocx: !f.convertToDocx} : f );
    setUploadedFiles(updatedList);
    if(activeJob) setActiveJob(prev => prev ? {...prev, sourceFiles: updatedList} : null);
  };
  
  const handleTranslateDocumentJob = async () => {
    if (!activeJob || jobType !== 'document' || uploadedFiles.filter(f => f.status === 'queued' || f.status === 'failed').length === 0) {
        if (jobType === 'document' && uploadedFiles.every(f => f.status === 'completed' || f.status === 'processing')) {
            toast({title: "All files processed or in progress", description: "No new files to translate in this job.", variant: "default"});
        } else if (jobType === 'document' && uploadedFiles.length === 0) {
             toast({title: "No files uploaded", description: "Please upload documents to translate.", variant: "destructive"});
        }
        return;
    }
     if (!jobTitle.trim()) {
        toast({ title: "Job title required", description: "Please enter a title for the job before translating.", variant: "destructive" });
        return;
    }
    
    setIsLoading(true);
    
    const jobForTranslation = ensureActiveJobIsPersisted();
    if (!jobForTranslation) {
      setIsLoading(false);
      toast({ title: "Error", description: "Could not start translation. Active job not found.", variant: "destructive" });
      return;
    }
    
    // Set job status to in-progress before processing files
    persistActiveJobDetails({}, 'in-progress');


    let currentSourceFilesState = [...(jobForTranslation.sourceFiles || [])]; 
    let newTranslatedArtifactsForJob: TranslatedFileArtifact[] = jobForTranslation.translatedFilesByLanguage?.[targetLang] || [];
    let allFilesSucceeded = true;

    for (let i = 0; i < currentSourceFilesState.length; i++) {
        let fileToProcess = currentSourceFilesState[i];
        if (fileToProcess.status === 'completed' || fileToProcess.status === 'processing') { 
            continue;
        }
        
        const processedFile = await processSingleFileForJob(fileToProcess, jobForTranslation, targetLang);
        currentSourceFilesState = currentSourceFilesState.map(f => f.id === processedFile.id ? processedFile : f);

        if (processedFile.status === 'completed') {
            if (!newTranslatedArtifactsForJob.some(art => art.name.startsWith(`translated_${processedFile.originalName.split('.')[0]}_${targetLang}`))) {
                newTranslatedArtifactsForJob.push({
                    name: `translated_${processedFile.originalName.split('.')[0]}_${targetLang}.${processedFile.convertToDocx && processedFile.type ==='application/pdf' ? 'docx' : processedFile.originalName.split('.').pop() || 'txt'}`,
                    url: '#simulated-download', 
                    format: processedFile.convertToDocx && processedFile.type ==='application/pdf' ? 'docx' : processedFile.originalName.split('.').pop() || 'txt'
                });
            }
        } else if (processedFile.status === 'failed') {
            allFilesSucceeded = false;
        }
        
        // Update the overall job with the latest source files and translated artifacts list
        const updatedJob = persistActiveJobDetails({ 
          sourceFiles: [...currentSourceFilesState],
          translatedFilesByLanguage: { ...(activeJob?.translatedFilesByLanguage || {}), [targetLang]: newTranslatedArtifactsForJob }
        }, 'in-progress'); 

        if(!updatedJob) break; 
    }
    
    const finalStatus = allFilesSucceeded && currentSourceFilesState.every(f => f.status === 'completed') 
        ? 'complete' 
        : (currentSourceFilesState.some(f=> f.status === 'failed') ? 'failed' : 'in-progress');
    
    persistActiveJobDetails({ status: finalStatus }); // Persist final job status
    
    if (finalStatus === 'complete') {
      toast({ title: "Document Translation Job Complete", description: `Job "${jobTitle}" finished processing all files.` });
    } else if (finalStatus === 'failed') {
      toast({ title: "Document Translation Job Issues", description: `Job "${jobTitle}" completed with some errors.`, variant: "destructive" });
    } else if (finalStatus === 'in-progress' && !currentSourceFilesState.some(f => f.status === 'processing' || f.status === 'queued')) {
      toast({ title: "Job Update", description: `Job "${jobTitle}" status updated.`});
    }
    setIsLoading(false);
  };

  const handleSelectedTranslatedFileToggle = (fileName: string) => {
    setSelectedTranslatedFiles(prev => ({...prev, [fileName]: !prev[fileName]}));
  };

  const handleDownloadSelected = () => {
    const filesToDownload = Object.entries(selectedTranslatedFiles)
        .filter(([_,isSelected]) => isSelected)
        .map(([fileName,_]) => fileName);
    if (filesToDownload.length === 0) {
        toast({title: "No files selected", description: "Please select files to download.", variant: "destructive"});
        return;
    }
    toast({title: "Download Selected (Simulated)", description: `Simulating download of: ${filesToDownload.join(', ')}`});
  };

  const handleDownloadAllZip = () => {
    if (!activeJob || !activeJob.translatedFilesByLanguage?.[targetLang] || activeJob.translatedFilesByLanguage[targetLang].length === 0) {
        toast({title: "No translated files", description: "There are no translated files to download.", variant: "destructive"});
        return;
    }
    toast({title: "Download All as ZIP (Simulated)", description: `Simulating ZIP download for all ${activeJob.translatedFilesByLanguage[targetLang].length} files.`});
  };


  const filteredJobs = jobs.filter(job => {
    const nameMatch = historySearchTerm === '' || job.name.toLowerCase().includes(historySearchTerm.toLowerCase());
    const typeMatch = historyFilterType === 'all' || job.type === historyFilterType;
    const statusMatch = historyFilterStatus.length === 0 || historyFilterStatus.includes(job.status);
    const archiveMatch = showArchived ? true : job.status !== 'archived'; 
    return nameMatch && typeMatch && statusMatch && archiveMatch;
  });

  const toggleHistoryFilterStatus = (status: TranslationJobStatus) => {
    setHistoryFilterStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const requestDeleteJob = (jobId: string) => {
    setJobIdPendingDeletion(jobId);
    setShowDeleteConfirmModal(true);
  };

  const confirmDeleteJob = () => {
    if (!jobIdPendingDeletion) return;
    setJobs(prev => prev.filter(j => j.id !== jobIdPendingDeletion));
    if (activeJob?.id === jobIdPendingDeletion) {
      resetMainFormToEmpty(true);
    }
    toast({ title: "Job Deleted" });
    setShowDeleteConfirmModal(false);
    setJobIdPendingDeletion(null);
  };

  const handleArchiveJob = (jobId: string) => {
     const jobToUpdate = jobs.find(j => j.id === jobId);
     if (jobToUpdate) {
        const newStatus = jobToUpdate.status === 'archived' ? 'draft' : 'archived'; 
        const updatedJobData: Partial<TranslationJob> = {status: newStatus as TranslationJobStatus, updatedAt: Date.now()};
        
        setJobs(prev => prev.map(j => j.id === jobId ? {...j, ...updatedJobData} : j).sort((a,b) => b.updatedAt - a.updatedAt));
        
        if (activeJob?.id === jobId) {
             const reloadedJob = {...activeJob, ...updatedJobData };
             setActiveJob(reloadedJob); // Update active job with new status
             if (newStatus === 'archived' && !showArchived) { 
                 resetMainFormToEmpty(true); // Clear form if archived and not showing archived
             } else {
                 loadJobToForm(reloadedJob); // Reload to reflect status change in form
             }
        }
        toast({ title: jobToUpdate.status === 'archived' ? "Job Unarchived" : "Job Archived" });
     }
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleTTS = (text: string) => {
    if(!text) return;
    if (isSpeaking) cancel(); else speak(text);
  };
  
  const getLanguageName = (code: string) => supportedLanguages.find(l => l.code === code)?.name || code;
  const hasAnyPdfFileInUploads = uploadedFiles.some(file => file.type === 'application/pdf');

  useEffect(() => {
    // This effect will correctly populate the form if activeJob is set by `handleNewJob`
    // or by selecting from history.
    if (activeJob) {
        loadJobToForm(activeJob);
    } else {
        resetMainFormToEmpty();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJob?.id]); // Only re-run if activeJob *instance* changes (by ID), or if activeJob becomes null

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-var(--header-height,4rem)-2rem)] gap-4 p-1">
        <Card className="flex-grow-[3] basis-0 shadow-xl flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">
                {activeJob ? (activeJob.name === 'Untitled Translation Job' && activeJob.status === 'draft' && !isFormDirty && !jobs.some(j => j.id === activeJob.id) ? 'New Translation Job' : 'Edit Job') : 'New Translation Job'}
              </CardTitle>
              {activeJob && <JobStatusBadge status={activeJob.status} />}
            </div>
             {activeJob && <CardDescription>ID: {activeJob.id.substring(0,12)}...</CardDescription>}
          </CardHeader>
          <ScrollArea className="flex-grow p-4 relative">
            <div className="space-y-4 h-full">
            {!activeJob ? (
              <div className="flex flex-col items-center justify-center absolute inset-0 text-center p-8">
                <div className="bg-card/50 rounded-lg border border-border p-6 shadow-sm w-full max-w-[280px] sm:max-w-sm">
                  <LanguagesIcon className="w-16 h-16 mx-auto mb-5 text-primary opacity-50" />
                  <h3 className="text-xl font-medium mb-2">No Active Job</h3>
                  <p className="text-muted-foreground mb-6">Create a new job or select one from the history panel to get started.</p>
                  <Button onClick={()=>handleNewJob()} className="w-full">
                    <PlusCircle className="mr-2 h-5 w-5" /> Create New Job
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-1">
                  <label htmlFor="jobTitle" className="text-sm font-medium">Job Title <span className="text-destructive">*</span></label>
                  <Input
                    id="jobTitle"
                    placeholder="Enter job title (e.g., Marketing Brochure Q3)"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value.slice(0, MAX_JOB_TITLE_LENGTH))}
                    maxLength={MAX_JOB_TITLE_LENGTH}
                    disabled={isLoading || activeJob?.status === 'in-progress'}
                  />
                  <p className="text-xs text-muted-foreground text-right">{jobTitle.length}/{MAX_JOB_TITLE_LENGTH}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select 
                        value={jobType} 
                        onValueChange={(v) => handleJobTypeChange(v as TranslationJobType)} 
                        disabled={isLoading || activeJob?.status === 'in-progress'}
                    >
                      <SelectTrigger><SelectValue placeholder="Select job type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Translation</SelectItem>
                        <SelectItem value="document">Document Translation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-1">
                     <label className="text-sm font-medium">Source Language</label>
                     <Select value={sourceLang} onValueChange={setSourceLang} disabled={isLoading || activeJob?.status === 'in-progress'}>
                       <SelectTrigger><SelectValue placeholder="Select source language" /></SelectTrigger>
                       <SelectContent>
                         <SelectItem value="auto">Auto-detect</SelectItem>
                         {supportedLanguages.map(l => <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>)}
                       </SelectContent>
                     </Select>
                   </div>
                </div>
                
                <div className="space-y-1">
                   <label className="text-sm font-medium">Target Language</label>
                   <Select value={targetLang} onValueChange={setTargetLang} disabled={isLoading || activeJob?.status === 'in-progress'}>
                     <SelectTrigger><SelectValue placeholder="Select target language" /></SelectTrigger>
                     <SelectContent>
                       {supportedLanguages.map(l => <SelectItem key={l.code} value={l.code} disabled={l.code === sourceLang && sourceLang !== 'auto'}>{l.name}</SelectItem>)}
                     </SelectContent>
                   </Select>
                 </div>

                {jobType === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="Enter text to translate..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value.slice(0, MAX_TEXT_INPUT_LENGTH))}
                        className="min-h-[150px] bg-input focus-visible:ring-1 focus-visible:ring-ring"
                        rows={6}
                        maxLength={MAX_TEXT_INPUT_LENGTH}
                        disabled={isLoading || activeJob?.status === 'in-progress'}
                      />
                       <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">{inputText.length}/{MAX_TEXT_INPUT_LENGTH} characters</p>
                          <div>
                            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleCopy(inputText)} disabled={!inputText}><Copy size={16}/></Button></TooltipTrigger><TooltipContent>Copy text</TooltipContent></Tooltip>
                            <Tooltip><TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleTTS(inputText)} disabled={!inputText}>
                                {isSpeaking ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
                              </Button>
                            </TooltipTrigger><TooltipContent>Speak text</TooltipContent></Tooltip>
                          </div>
                       </div>
                    </div>
                    <div>
                      <Textarea
                        placeholder="Translation will appear here..."
                        value={outputText}
                        readOnly
                        className="min-h-[150px] bg-muted text-muted-foreground"
                        rows={6}
                      />
                      <div className="flex justify-end items-center mt-1">
                          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleCopy(outputText)} disabled={!outputText}><Copy size={16}/></Button></TooltipTrigger><TooltipContent>Copy translation</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleTTS(outputText)} disabled={!outputText}>
                             {isSpeaking ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
                           </Button>
                          </TooltipTrigger><TooltipContent>Speak translation</TooltipContent></Tooltip>
                      </div>
                    </div>
                  </div>
                )}

                {jobType === 'document' && (
                  <div className="space-y-4">
                    <Card className="border-dashed border-2 hover:border-primary transition-colors">
                      <CardContent className="p-6 text-center">
                        <FileUp className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="mb-2 text-sm text-muted-foreground">Drag & drop files here or</p>
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || activeJob?.status === 'in-progress'}>
                          Browse Files
                        </Button>
                        <input type="file" ref={fileInputRef} multiple onChange={handleFileSelect} className="hidden" accept={ALLOWED_DOC_EXTENSIONS.join(',')} />
                        <p className="mt-2 text-xs text-muted-foreground">
                          Max {MAX_FILES_PER_JOB} files. Max {MAX_TOTAL_UPLOAD_SIZE_MB}MB total.
                          Supported: {ALLOWED_DOC_EXTENSIONS.join(', ')}
                        </p>
                      </CardContent>
                    </Card>
                    {uploadedFiles.length > 0 && (
                      <ScrollArea className="max-h-60 border rounded-md p-2">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">Selected Files ({uploadedFiles.length}/{MAX_FILES_PER_JOB}):</p>
                            {hasAnyPdfFileInUploads && <p className="text-xs text-muted-foreground">Toggle PDF to DOCX conversion</p>}
                        </div>
                        <ul className="space-y-2">
                          {uploadedFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 text-sm">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <FileText size={18} className="text-primary shrink-0" />
                                <Tooltip>
                                  <TooltipTrigger asChild><span className="truncate flex-1 min-w-0" title={file.originalName}>{file.originalName}</span></TooltipTrigger>
                                  <TooltipContent><p>{file.originalName}</p></TooltipContent>
                                </Tooltip>
                                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              
                              <div className='flex items-center gap-1 shrink-0'>
                                {file.status === 'processing' && file.progress != null && (
                                  <div className="w-20 flex items-center gap-1">
                                    <Progress value={file.progress} className="h-1.5 flex-1" />
                                    <span className='text-xs'>{file.progress}%</span>
                                  </div>
                                )}
                                {file.status === 'completed' && <CheckCircleIcon size={16} className="text-accent-success shrink-0" />}
                                {file.status === 'failed' && 
                                  <Tooltip>
                                    <TooltipTrigger asChild><XCircleIcon size={16} className="text-destructive shrink-0 cursor-default" /></TooltipTrigger>
                                    <TooltipContent><p>Failed: {file.error || "Unknown error"}</p></TooltipContent>
                                  </Tooltip>
                                }

                                {hasAnyPdfFileInUploads && file.type === 'application/pdf' ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant={file.convertToDocx ? "secondary" : "outline"} size="sm" className="h-7 px-2 text-xs" onClick={() => togglePdfToDocx(file.id)} disabled={isLoading || activeJob?.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}>
                                        <FileSliders size={14} className="mr-1"/> DOCX
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Convert PDF to DOCX on translation</p></TooltipContent>
                                  </Tooltip>
                                ) : (
                                  hasAnyPdfFileInUploads && <div className="w-[78px] h-7"></div> 
                                )}
                                <Tooltip><TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeUploadedFile(file.id)} disabled={isLoading || activeJob?.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}><XCircleIcon size={16} /></Button>
                                </TooltipTrigger><TooltipContent>Remove file</TooltipContent></Tooltip>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    )}
                    {activeJob?.status === 'complete' && activeJob.translatedFilesByLanguage?.[targetLang] && activeJob.translatedFilesByLanguage[targetLang].length > 0 && (
                       <div>
                        <h4 className="text-md font-semibold mb-2 mt-4">Translated Documents for {getLanguageName(targetLang)}:</h4>
                         <ScrollArea className="max-h-48 border rounded-md p-2">
                            <ul className="space-y-2">
                            {(activeJob.translatedFilesByLanguage[targetLang] || []).map(artifact => (
                                <li key={artifact.name} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm gap-2">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <Checkbox 
                                        id={`cb-${artifact.name}`} 
                                        checked={!!selectedTranslatedFiles[artifact.name]}
                                        onCheckedChange={() => handleSelectedTranslatedFileToggle(artifact.name)}
                                        className="mr-1 shrink-0"
                                      />
                                      <FileText size={18} className="text-accent-success shrink-0" />
                                      <Tooltip>
                                        <TooltipTrigger asChild><span className="truncate flex-1 min-w-0" title={artifact.name}>{artifact.name}</span></TooltipTrigger>
                                        <TooltipContent><p>{artifact.name}</p></TooltipContent>
                                      </Tooltip>
                                  </div>
                                  <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={() => toast({title: "Download (Simulated)", description: `Would download ${artifact.name}`})}>
                                      <Download size={14} className="mr-1"/> Download
                                  </Button>
                                </li>
                            ))}
                            </ul>
                         </ScrollArea>
                         <div className="flex gap-2 mt-2 justify-end">
                            <Button variant="outline" size="sm" onClick={handleDownloadSelected} disabled={Object.values(selectedTranslatedFiles).every(v => !v)}>
                                <Download className="mr-2 h-4 w-4" /> Download Selected
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownloadAllZip}>
                                <Archive className="mr-2 h-4 w-4" /> Download All as ZIP
                            </Button>
                         </div>
                       </div>
                    )}
                    {activeJob?.status === 'failed' && (activeJob.errorMessage || uploadedFiles.some(f => f.status === 'failed')) && (
                        <Card className="mt-2 border-destructive bg-destructive/10">
                            <CardHeader className="p-3">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    <CardTitle className="text-base">Translation Issues</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 text-sm text-destructive">
                                {activeJob.errorMessage && <p>{activeJob.errorMessage}</p>}
                                {uploadedFiles.filter(f => f.status === 'failed').map(f => (
                                    <p key={f.id} className="mt-1">File {f.originalName}: {f.error || "Processing failed."}</p>
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
          {activeJob && (
            <CardFooter className="border-t p-4 flex justify-between items-center">
              <div>
                {activeJob.status !== 'in-progress' && (
                    <Button 
                        variant="destructive" 
                        onClick={() => requestDeleteJob(activeJob.id)} 
                        disabled={isLoading}
                        size="sm"
                        className="mr-2"
                    >
                       <Trash2 className="mr-2 h-4 w-4" /> Delete Job
                    </Button>
                )}
              </div>
              <div className="flex gap-2">
                {activeJob.status !== 'in-progress' && (
                   <Button variant="outline" onClick={handleCancelActiveJob} disabled={isLoading} size="sm">
                     <XCircleIcon className="mr-2 h-4 w-4" /> Cancel
                   </Button>
                )}

                {activeJob.status !== 'in-progress' && (
                  <Button 
                      variant="outline" 
                      onClick={handleSaveDraft} 
                      disabled={isLoading || !jobTitle.trim() || (!isFormDirty && activeJob.status !== 'complete' && activeJob.status !== 'archived' && activeJob.status !== 'failed')}
                      size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" /> 
                    { (activeJob.status === 'complete' || activeJob.status === 'archived' || activeJob.status === 'failed') && isFormDirty ? 'Save Changes' : 
                      (activeJob.status === 'complete' || activeJob.status === 'archived' || activeJob.status === 'failed') && !isFormDirty ? 'Saved' : 'Save Draft' }
                  </Button>
                )}

                {(activeJob.status === 'draft' || activeJob.status === 'failed') && (
                  <Button
                    onClick={jobType === 'text' ? handleTranslateTextJob : handleTranslateDocumentJob}
                    disabled={isLoading || 
                              (jobType === 'text' && !inputText.trim()) || 
                              (jobType === 'document' && uploadedFiles.filter(f => f.status === 'queued' || f.status === 'failed').length === 0 && !uploadedFiles.some(f => f.status === 'processing')) || 
                              !jobTitle.trim()}
                    className="bg-primary-gradient text-primary-foreground hover:opacity-90"
                    size="sm"
                  >
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                    Translate
                  </Button>
                )}
                {activeJob.status === 'in-progress' && <Button disabled variant="secondary" size="sm"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</Button>}
                {activeJob.status === 'complete' && (
                  <Button variant="default" disabled className="bg-accent-success hover:bg-accent-success/90" size="sm">
                    <CheckSquare className="mr-2 h-4 w-4" /> Completed
                  </Button>
                )}
              </div>
            </CardFooter>
          )}
        </Card>

          <Card className="flex-grow-[2] basis-0 shadow-xl flex flex-col overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">
          <CardTitle className="text-xl">Job History</CardTitle>
          <Button 
            size="sm" 
            onClick={() => handleNewJob()}
            className="bg-primary hover:bg-primary/90 transition-colors self-start w-full"
          >
            <PlusCircle className="mr-2 h-4 w-4" /> New Job
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-4 pb-4">
        <div className="space-y-4">
          {/* Improved search field with better positioning */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={historySearchTerm}
              onChange={(e) => setHistorySearchTerm(e.target.value)}
              className="pl-9 h-10 w-full"
            />
          </div>
          
          {/* Responsive filter section */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <Select 
                value={historyFilterType} 
                onValueChange={(v) => setHistoryFilterType(v as 'all' | TranslationJobType)}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text Jobs</SelectItem>
                  <SelectItem value="document">Document Jobs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-10 flex-1">
                    <ListFilter className="mr-2 h-4 w-4" /> 
                    Status {historyFilterStatus.length > 0 && 
                      <Badge variant="secondary" className="ml-2">
                        {historyFilterStatus.length}
                      </Badge>
                    }
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
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
              
              {/* Enhanced archive button with active state */}
              <Button 
                variant={showArchived ? "secondary" : "outline"} 
                size="icon" 
                className="h-10 w-10 shrink-0" 
                onClick={() => setShowArchived(!showArchived)}
                title="Show/Hide Archived Jobs"
              >
                <Archive size={16} />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Improved scroll area with better empty state */}
      <ScrollArea className="flex-grow p-2">
        {filteredJobs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 px-4">
            <div className="bg-slate-800/50 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
              <Info className="h-8 w-8 opacity-70" />
            </div>
            <h3 className="text-lg font-medium mb-2">No jobs match your criteria</h3>
            <p className="max-w-sm mx-auto text-sm opacity-70">
              Try adjusting your filters or add new jobs to start tracking your progress
            </p>
          </div>
        ) : (
          <div className="space-y-3 px-2">
            {filteredJobs.map(job => (
              <Card
                key={job.id}
                className={cn(
                  "hover:shadow-md transition-shadow cursor-pointer border",
                  activeJob?.id === job.id ? "ring-2 ring-primary border-primary" : "border-border"
                )}
                onClick={() => handleSelectJobFromHistory(job.id)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold truncate text-base" title={job.name}>{job.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span className="capitalize">{job.type}</span>
                        <span className="mx-2">•</span>
                        <Clock size={12} className="mr-1" /> 
                        {format(new Date(job.updatedAt), "MMM d, HH:mm")}
                      </div>
                    </div>
                    <JobStatusBadge status={job.status} />
                  </div>
                  
                  {/* Action buttons with improved hover states */}
                  <div className="flex justify-end mt-2">
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
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Unsaved Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them and cancel editing this job?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelConfirm(false)}>Keep Editing</AlertDialogCancel>
            <AlertDialogAction onClick={performCancelAction} className={buttonVariants({variant: "destructive"})}>Discard & Reset</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirmModal} onOpenChange={setShowDeleteConfirmModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the job "{jobs.find(j => j.id === jobIdPendingDeletion)?.name || 'this job'}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {setShowDeleteConfirmModal(false); setJobIdPendingDeletion(null);}}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteJob} className={buttonVariants({variant: "destructive"})}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </TooltipProvider>
  );
};

export default TranslatePage;


    