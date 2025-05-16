
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRightLeft, Copy, Volume2, Trash2, LanguagesIcon, PlusCircle, Search, Filter, Archive, CheckSquare, Square, X,
  FileText, FileUp, Save, Play, XCircle as XCircleIcon, RotateCcw, Edit3, Download, Share2, Clock, ListFilter, FileSliders, AlertTriangle, Loader2, CheckCircle as CheckCircleIcon, Info
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
  const { speak, cancel, isSpeaking, utterance } = useSpeechSynthesis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [activeJob, setActiveJob] = useState<TranslationJob | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  // Main area form state controlled by activeJob, but with local overrides for editing
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

  // Job history panel state
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState<TranslationJobType | 'all'>('all');
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
    }
  }, [jobs]);

  // Update isFormDirty state
  useEffect(() => {
    if (!activeJob) {
      setIsFormDirty(jobTitle !== '' || jobType !== 'text' || sourceLang !== 'auto' || targetLang !== 'es' || inputText !== '' || uploadedFiles.length > 0);
      return;
    }
    const titleDirty = jobTitle !== activeJob.name;
    const typeDirty = jobType !== activeJob.type;
    const sourceLangDirty = sourceLang !== activeJob.sourceLanguage;
    const targetLangDirty = targetLang !== (activeJob.targetLanguages[0] || 'es');
    const inputTextDirty = inputText !== (activeJob.inputText || '');
    
    const filesDirty = uploadedFiles.length !== (activeJob.sourceFiles?.length || 0) || 
                       !uploadedFiles.every((uf, i) => {
                         const ajf = activeJob.sourceFiles?.[i];
                         return ajf && uf.id === ajf.id && uf.convertToDocx === ajf.convertToDocx && uf.status === ajf.status;
                       });

    setIsFormDirty(titleDirty || typeDirty || sourceLangDirty || targetLangDirty || inputTextDirty || filesDirty);
  }, [jobTitle, jobType, sourceLang, targetLang, inputText, uploadedFiles, activeJob]);


  const resetMainFormToEmpty = () => {
    setActiveJob(null);
    setJobTitle('');
    setJobType('text');
    setSourceLang('auto');
    setTargetLang('es');
    setInputText('');
    setUploadedFiles([]);
    setOutputText('');
    setSelectedTranslatedFiles({});
    setTimeout(() => setIsFormDirty(false),0);
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

  const updateActiveJobDetails = useCallback((updates: Partial<TranslationJob>, newStatus?: TranslationJobStatus) => {
    if (!activeJob) return null;
    
    const updatedJobData = { 
      ...activeJob, 
      ...updates, 
      status: newStatus || updates.status || activeJob.status, 
      updatedAt: Date.now() 
    };

    setJobs(prevJobs => { 
        const jobExists = prevJobs.some(j => j.id === updatedJobData.id);
        if (jobExists) {
            return prevJobs.map(j => j.id === updatedJobData.id ? updatedJobData : j).sort((a,b) => b.updatedAt - a.updatedAt);
        }
        return [updatedJobData, ...prevJobs].sort((a,b) => b.updatedAt - a.updatedAt);
    });
    
    setActiveJob(updatedJobData);
    
    if (updates.status && updates.status !== activeJob.status) { // Check against old activeJob.status
        setTimeout(() => setIsFormDirty(false), 0);
    } else if (newStatus && newStatus !== activeJob.status){
        setTimeout(() => setIsFormDirty(false), 0);
    }
    return updatedJobData;
  }, [activeJob, setJobs, setActiveJob, setIsFormDirty]);

  const handleNewJob = (type: TranslationJobType = 'text') => {
    if (activeJob && activeJob.name === 'Untitled Translation Job' && activeJob.status === 'draft' && !isFormDirty) {
      const isPristineInList = jobs.find(j => j.id === activeJob.id && j.name === 'Untitled Translation Job' && !j.inputText && (!j.sourceFiles || j.sourceFiles.length === 0) && j.status === 'draft');
      if (isPristineInList) {
        setJobs(prev => prev.filter(j => j.id !== activeJob.id));
      }
    }
    const newJob = createNewJobObject(type);
    setJobs(prev => [newJob, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
    loadJobToForm(newJob);
  };

  const handleSelectJobFromHistory = (jobId: string) => {
    const jobToLoad = jobs.find(j => j.id === jobId);
    if (jobToLoad) {
      if (activeJob && activeJob.id !== jobToLoad.id && activeJob.name === 'Untitled Translation Job' && activeJob.status === 'draft' && !isFormDirty) {
         const isPristineInList = jobs.find(j => j.id === activeJob.id && j.name === 'Untitled Translation Job' && !j.inputText && (!j.sourceFiles || j.sourceFiles.length === 0) && j.status === 'draft');
         if (isPristineInList) {
           setJobs(prev => prev.filter(j => j.id !== activeJob.id));
         }
      }
      loadJobToForm(jobToLoad);
    }
  };

  const handleJobTypeChange = (newType: TranslationJobType) => {
    // Always update the local state controlling the Select component first
    setJobType(newType);

    if (activeJob) {
      // If there's an active job, update its type and reset relevant fields
      updateActiveJobDetails({
        type: newType,
        status: 'draft', // Changing type implies starting a new draft or modifying one
        inputText: newType === 'document' ? '' : (activeJob.inputText || ''),
        sourceFiles: newType === 'text' ? [] : (activeJob.sourceFiles || []),
        outputTextByLanguage: {}, // Clear previous translations
        translatedFilesByLanguage: {}, // Clear previous file translations
        updatedAt: Date.now(),
      });

      // Update UI input fields based on the new type
      if (newType === 'text') {
        setUploadedFiles([]); // Clear uploaded files UI if switching to text
      } else { // newType is 'document'
        setInputText(''); // Clear text input UI if switching to document
        setOutputText(''); // Clear text output UI
      }
      toast({ title: "Job Type Switched", description: `Now editing as a ${newType} translation job.`, variant: "default" });

    } else {
      // No active job, so create a new one with the selected type
      const newJob = createNewJobObject(newType);
      setJobs(prev => [newJob, ...prev].sort((a, b) => b.updatedAt - a.updatedAt));
      loadJobToForm(newJob); // loadJobToForm will set activeJob and sync all form fields, including jobType from newJob.type
    }
  };

  const handleSaveDraft = () => {
    if (!activeJob) {
      // If no active job, but form has content, create a new draft.
      if (jobTitle.trim() || inputText.trim() || uploadedFiles.length > 0) {
        const newDraft = createNewJobObject(jobType);
        const draftToSave: TranslationJob = {
          ...newDraft,
          name: jobTitle.trim() || 'Untitled Translation Job',
          type: jobType,
          sourceLanguage: sourceLang,
          targetLanguages: [targetLang],
          inputText: jobType === 'text' ? inputText : undefined,
          sourceFiles: jobType === 'document' ? uploadedFiles : undefined,
          outputTextByLanguage: jobType === 'text' && outputText ? { [targetLang]: outputText } : {},
          translatedFilesByLanguage: {}, // Fresh draft has no translated files
        };
        setJobs(prev => [draftToSave, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
        setActiveJob(draftToSave);
        loadJobToForm(draftToSave); // Reload to sync all states and set isFormDirty to false
        toast({ title: "Draft Saved", description: `New job "${draftToSave.name}" saved as draft.` });
        return;
      } else {
        toast({ title: "Nothing to save", description: "Create or select a job to save.", variant: "default" });
        return;
      }
    }
    
    if (!jobTitle.trim()) {
      toast({ title: "Job title required", description: "Please enter a title for the job.", variant: "destructive" });
      return;
    }

    const currentJobDetails: Partial<TranslationJob> = {
      name: jobTitle,
      type: jobType, // jobType state should be the source of truth for the current edit session
      sourceLanguage: sourceLang,
      targetLanguages: [targetLang],
      status: activeJob.status === 'failed' ? 'draft' : (activeJob.status === 'in-progress' ? 'in-progress' : 'draft'), // Keep in-progress if it was, otherwise draft
      inputText: jobType === 'text' ? inputText : activeJob.inputText, // Preserve if switching away then back
      sourceFiles: jobType === 'document' ? uploadedFiles : activeJob.sourceFiles, // Preserve if switching
      outputTextByLanguage: jobType === 'text' && outputText ? { ...activeJob.outputTextByLanguage, [targetLang]: outputText } : activeJob.outputTextByLanguage,
      // translatedFilesByLanguage should not be cleared by save draft, only by type change or new translation
    };
    
    const savedJob = updateActiveJobDetails(currentJobDetails);
    if (savedJob) {
        loadJobToForm(savedJob); // Important to reload the form to reset isFormDirty with latest saved state
        toast({ title: "Draft Saved", description: `Job "${jobTitle}" saved.` });
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
    if (activeJob && activeJob.name === 'Untitled Translation Job' && 
        !activeJob.inputText && 
        (!activeJob.sourceFiles || activeJob.sourceFiles.length === 0) &&
        Object.keys(activeJob.outputTextByLanguage || {}).length === 0 &&
        Object.keys(activeJob.translatedFilesByLanguage || {}).length === 0
        ) {
      // If it's a truly pristine, unsaved "Untitled" job, remove it from the list
      const jobInList = jobs.find(j => j.id === activeJob.id);
      if (jobInList && jobInList.name === 'Untitled Translation Job' && 
          !jobInList.inputText && 
          (!jobInList.sourceFiles || jobInList.sourceFiles.length === 0) &&
          Object.keys(jobInList.outputTextByLanguage || {}).length === 0 &&
          Object.keys(jobInList.translatedFilesByLanguage || {}).length === 0 &&
          jobInList.status === 'draft'
          ) {
        setJobs(prev => prev.filter(j => j.id !== activeJob.id));
      }
    }
    resetMainFormToEmpty(); // Reset to the empty "No active job" state
    toast({ title: "Job Cancelled", description: "Active job cleared." });
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
    setOutputText(''); // Clear previous output for this targetLang
    
    // Ensure current form state is saved to activeJob before starting translation
    const jobWithProgress = updateActiveJobDetails({ 
        name: jobTitle, 
        inputText, 
        sourceLanguage: sourceLang, 
        targetLanguages: [targetLang] 
    }, 'in-progress');

    if (!jobWithProgress) { // Should not happen if activeJob exists
      setIsLoading(false);
      return;
    }

    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l => l.code === sourceLang)?.name || 'English', 
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Spanish',
      });
      setOutputText(result.translatedText);
      updateActiveJobDetails({
        outputTextByLanguage: { ...(jobWithProgress.outputTextByLanguage || {}), [targetLang]: result.translatedText },
      }, 'complete');
      toast({ title: "Translation Complete", description: `Job "${jobTitle}" finished.` });
    } catch (error) {
      console.error("Translation failed:", error);
      updateActiveJobDetails({ errorMessage: "Translation API call failed." }, 'failed');
      toast({ title: "Translation Error", description: "Could not translate text.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const processSingleFileForJob = async (file: UploadedFile, job: TranslationJob, targetLangCode: string): Promise<UploadedFile> => {
    let currentFileState = { ...file, status: 'processing' as UploadedFile['status'], progress: 10 };
    
    // Update this specific file in the overall uploadedFiles state for UI
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500));
    currentFileState = { ...currentFileState, progress: 30 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));

    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800));
    currentFileState = { ...currentFileState, progress: 70 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));

    // Simulate actual translation API call for the document (placeholder)
    // In a real scenario, you'd upload the file or its content to a translation service
    console.log(`Simulating translation for ${file.originalName} to ${targetLangCode}`);
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1000));
    
    // Simulate completion or failure
    const success = Math.random() > 0.1; // 90% success rate for simulation
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
    
    let currentJobForUpload = activeJob;

    if (!currentJobForUpload) { // No active job, create one
      const newJob = createNewJobObject('document');
      setJobs(prev => [newJob, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
      loadJobToForm(newJob);
      currentJobForUpload = newJob;
      setJobType('document'); // ensure UI select matches
    } else if (currentJobForUpload.type !== 'document') { // Active job is text, switch it
      updateActiveJobDetails({ 
        type: 'document', 
        inputText: '', 
        outputTextByLanguage: {},
        status: 'draft',
      });
      setJobType('document'); // Update UI select
      setInputText(''); 
      setOutputText('');
      setUploadedFiles(currentJobForUpload.sourceFiles || []); // Keep existing files if any after type switch
      toast({ title: "Job type switched", description: "Switched to Document Translation mode."});
      // updateActiveJobDetails returns the updated job, assign it back if needed for immediate use
      currentJobForUpload = jobs.find(j => j.id === activeJob!.id) || activeJob!; // Re-fetch from jobs or use current activeJob
    }
    
    const jobToUpdateWithFiles = currentJobForUpload!; // Assert non-null as it's handled above
    processFiles(Array.from(files), jobToUpdateWithFiles);
    
    if(fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const processFiles = (filesToProcess: File[], jobToUpdate: TranslationJob) => {
     if (jobToUpdate.type !== 'document') { // Should be handled by handleFileSelect logic now
       toast({ title: "Error", description: "Cannot process files: job is not a document job.", variant: "destructive" });
       return;
    }

    let currentTotalSize = (jobToUpdate.sourceFiles || []).reduce((acc, f) => acc + f.size, 0);
    const newUploads: UploadedFile[] = [];
    const existingFiles = [...(jobToUpdate.sourceFiles || [])]; 

    for (const file of filesToProcess) {
      if (existingFiles.length + newUploads.length >= MAX_FILES_PER_JOB) {
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
        id: `file-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`, // Sanitize name for ID
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
      const updatedSourceFiles = [...existingFiles, ...newUploads];
      setUploadedFiles(updatedSourceFiles); 
      updateActiveJobDetails({ sourceFiles: updatedSourceFiles, status: 'draft' });
      toast({ title: "Files Added", description: `${newUploads.length} file(s) added to the job.` });
    }
  };
  
  const removeUploadedFile = (fileId: string) => {
    const updatedList = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedList);
    if(activeJob) updateActiveJobDetails({ sourceFiles: updatedList });
  };

  const togglePdfToDocx = (fileId: string) => {
    const updatedList = uploadedFiles.map(f => f.id === fileId && f.type === 'application/pdf' ? {...f, convertToDocx: !f.convertToDocx} : f );
    setUploadedFiles(updatedList);
     if(activeJob) updateActiveJobDetails({ sourceFiles: updatedList });
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
    const jobForTranslation = updateActiveJobDetails({ 
        name: jobTitle, 
        sourceLanguage: sourceLang, 
        targetLanguages: [targetLang] 
    }, 'in-progress');

    if (!jobForTranslation) {
      setIsLoading(false);
      return;
    }

    let currentSourceFilesState = [...(jobForTranslation.sourceFiles || [])]; 
    const newTranslatedArtifactsForJob: TranslatedFileArtifact[] = activeJob.translatedFilesByLanguage?.[targetLang] || [];
    let allFilesSucceeded = true;

    for (let i = 0; i < currentSourceFilesState.length; i++) {
        let fileToProcess = currentSourceFilesState[i];
        if (fileToProcess.status === 'completed' || fileToProcess.status === 'processing') { // Skip already completed or currently processing by another call
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
        // Update activeJob with the latest source files state after each file
        updateActiveJobDetails({ sourceFiles: [...currentSourceFilesState] });
    }
    
    updateActiveJobDetails({ 
        status: allFilesSucceeded && currentSourceFilesState.every(f => f.status === 'completed') ? 'complete' : (currentSourceFilesState.some(f=> f.status === 'failed') ? 'failed' : 'in-progress'), 
        translatedFilesByLanguage: { ...activeJob.translatedFilesByLanguage, [targetLang]: newTranslatedArtifactsForJob }, 
        sourceFiles: currentSourceFilesState 
    });
    
    if (allFilesSucceeded && currentSourceFilesState.every(f => f.status === 'completed')) {
      toast({ title: "Document Translation Job Complete", description: `Job "${jobTitle}" finished processing all files.` });
    } else if (currentSourceFilesState.some(f=> f.status === 'failed')) {
      toast({ title: "Document Translation Job Issues", description: `Job "${jobTitle}" completed with some errors.`, variant: "destructive" });
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
    // Actual download logic would go here
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
    const archiveMatch = showArchived ? true : job.status !== 'archived'; // Show all if showArchived is true, else only non-archived
    return nameMatch && typeMatch && statusMatch && archiveMatch;
  });

  const toggleHistoryFilterStatus = (status: TranslationJobStatus) => {
    setHistoryFilterStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (activeJob?.id === jobId) {
      resetMainFormToEmpty();
    }
    toast({ title: "Job Deleted" });
  };

  const handleArchiveJob = (jobId: string) => {
     const jobToUpdate = jobs.find(j => j.id === jobId);
     if (jobToUpdate) {
        const newStatus = jobToUpdate.status === 'archived' ? 'draft' : 'archived'; // Simplified: unarchive to draft
        const updatedJobData: Partial<TranslationJob> = {status: newStatus as TranslationJobStatus, updatedAt: Date.now()};
        
        setJobs(prev => prev.map(j => j.id === jobId ? {...j, ...updatedJobData} : j).sort((a,b) => b.updatedAt - a.updatedAt));
        
        if (activeJob?.id === jobId) {
             setActiveJob(prevActive => prevActive ? {...prevActive, ...updatedJobData} : null);
             if (newStatus === 'archived' && prevActive) { 
                 // If current job is archived, reset the form unless user wants to view archived jobs
                 if (!showArchived) resetMainFormToEmpty(); else loadJobToForm({...prevActive, ...updatedJobData});
             } else if (prevActive) {
                 loadJobToForm({...prevActive, ...updatedJobData}); // Reload to reflect unarchived status
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


  // Effect to update form fields when activeJob changes (e.g., from history selection)
  useEffect(() => {
    if (activeJob) {
        loadJobToForm(activeJob);
    } else {
        resetMainFormToEmpty();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeJob?.id]); // Only re-run if activeJob ID changes, to avoid loops with other state updates

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-var(--header-height,4rem)-2rem)] gap-4 p-1">
        <Card className="flex-grow-[3] basis-0 shadow-xl flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">
                {activeJob ? (activeJob.name === 'Untitled Translation Job' && activeJob.status === 'draft' && !isFormDirty ? 'New Translation Job' : 'Edit Job') : 'New Translation Job'}
              </CardTitle>
              {activeJob && <JobStatusBadge status={activeJob.status} />}
            </div>
             {activeJob && <CardDescription>ID: {activeJob.id.substring(0,12)}...</CardDescription>}
          </CardHeader>
          <ScrollArea className="flex-grow p-4">
            <div className="space-y-4">
            {!activeJob ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <LanguagesIcon className="w-16 h-16 mb-4 text-primary opacity-50" />
                <p className="text-muted-foreground mb-4">No active job. Create a new job or select one from the history.</p>
                <Button onClick={()=>handleNewJob()}><PlusCircle className="mr-2 h-4 w-4" /> Create New Job</Button>
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
                    disabled={isLoading || (activeJob?.status === 'in-progress' && activeJob.type === 'text') || (activeJob?.status === 'complete' && activeJob.type !== 'text' && !isFormDirty)} // Allow editing title for completed text jobs if dirty
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
                                {isSpeaking && utterance?.text === inputText ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
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
                             {isSpeaking && utterance?.text === outputText ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
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

                                {file.type === 'application/pdf' ? (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant={file.convertToDocx ? "secondary" : "outline"} size="sm" className="h-7 px-2 text-xs" onClick={() => togglePdfToDocx(file.id)} disabled={isLoading || activeJob?.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}>
                                        <FileSliders size={14} className="mr-1"/> DOCX
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Convert PDF to DOCX on translation</p></TooltipContent>
                                  </Tooltip>
                                ) : (
                                  hasAnyPdfFileInUploads && <div className="w-[78px] h-7"></div> /* Placeholder for alignment */
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
                            {(activeJob.translatedFilesByLanguage[targetLang] || []).map(file => (
                                <li key={file.name} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm gap-2">
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <Checkbox 
                                        id={`cb-${file.name}`} 
                                        checked={!!selectedTranslatedFiles[file.name]}
                                        onCheckedChange={() => handleSelectedTranslatedFileToggle(file.name)}
                                        className="mr-1 shrink-0"
                                      />
                                      <FileText size={18} className="text-accent-success shrink-0" />
                                      <Tooltip>
                                        <TooltipTrigger asChild><span className="truncate flex-1 min-w-0" title={file.name}>{file.name}</span></TooltipTrigger>
                                        <TooltipContent><p>{file.name}</p></TooltipContent>
                                      </Tooltip>
                                  </div>
                                  <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={() => toast({title: "Download (Simulated)", description: `Would download ${file.name}`})}>
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
            <CardFooter className="border-t p-4 flex justify-end gap-2">
              {activeJob.status !== 'in-progress' && (
                 <Button variant="outline" onClick={handleCancelActiveJob} disabled={isLoading}>
                   <XCircleIcon className="mr-2 h-4 w-4" /> Cancel
                 </Button>
              )}

              {activeJob.status !== 'in-progress' && (
                <Button 
                    variant="outline" 
                    onClick={handleSaveDraft} 
                    disabled={isLoading || !jobTitle.trim() || (!isFormDirty && activeJob.status !== 'complete' && activeJob.status !== 'archived')}
                >
                  <Save className="mr-2 h-4 w-4" /> 
                  { (activeJob.status === 'complete' || activeJob.status === 'archived') && isFormDirty ? 'Save Changes' : 
                    (activeJob.status === 'complete' || activeJob.status === 'archived') && !isFormDirty ? 'Saved' : 'Save Draft' }
                </Button>
              )}

              {(activeJob.status === 'draft' || activeJob.status === 'failed') && (
                <Button
                  onClick={jobType === 'text' ? handleTranslateTextJob : handleTranslateDocumentJob}
                  disabled={isLoading || 
                            (jobType === 'text' && !inputText.trim()) || 
                            (jobType === 'document' && uploadedFiles.filter(f => f.status === 'queued' || f.status === 'failed').length === 0) || 
                            !jobTitle.trim()}
                  className="bg-primary-gradient text-primary-foreground hover:opacity-90"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Translate
                </Button>
              )}
              {activeJob.status === 'in-progress' && <Button disabled variant="secondary"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</Button>}
              {activeJob.status === 'complete' && (
                <Button variant="default" disabled className="bg-accent-success hover:bg-accent-success/90">
                  <CheckSquare className="mr-2 h-4 w-4" /> Completed
                </Button>
              )}
            </CardFooter>
          )}
        </Card>

        <Card className="flex-grow-[2] basis-0 shadow-xl flex flex-col overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl">Job History</CardTitle>
               <Button variant="outline" size="sm" onClick={()=>handleNewJob()}><PlusCircle className="mr-2 h-4 w-4" /> New Job</Button>
            </div>
            <div className="mt-2 space-y-2">
              <Input
                placeholder="Search job names..."
                value={historySearchTerm}
                onChange={(e) => setHistorySearchTerm(e.target.value)}
                className="h-9"
                prependIcon={<Search size={16} className="text-muted-foreground" />}
              />
              <div className="flex gap-2 items-center">
                <Select value={historyFilterType} onValueChange={(v) => setHistoryFilterType(v as any)}>
                  <SelectTrigger className="h-9 text-xs flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="text">Text Jobs</SelectItem>
                    <SelectItem value="document">Document Jobs</SelectItem>
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-9 text-xs flex-1">
                      <ListFilter className="mr-2 h-4 w-4" /> Status ({historyFilterStatus.length > 0 ? historyFilterStatus.length : 'All'})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(['draft', 'in-progress', 'complete', 'failed', 'archived'] as TranslationJobStatus[]).map(status => ( // Ensure 'archived' is an option if needed
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
                 <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant={showArchived ? "secondary" : "outline"} size="icon" className="h-9 w-9" onClick={() => setShowArchived(!showArchived)}>
                        <Archive size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{showArchived ? "Showing Archived" : "Show Archived"}</TooltipContent> 
                  </Tooltip>
              </div>
            </div>
          </CardHeader>
          <ScrollArea className="flex-grow p-2">
            {filteredJobs.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Info className="mx-auto h-12 w-12 opacity-30 mb-2" />
                No jobs match your criteria.
              </div>
            ) : (
              <div className="space-y-2">
                {filteredJobs.map(job => (
                  <Card
                    key={job.id}
                    className={cn(
                        "hover:shadow-md transition-shadow cursor-pointer",
                        activeJob?.id === job.id && "ring-2 ring-primary border-primary"
                    )}
                    onClick={() => handleSelectJobFromHistory(job.id)}
                  >
                    <CardContent className="p-3 text-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-grow min-w-0">
                           <p className="font-semibold truncate text-base" title={job.name}>{job.name}</p>
                           <p className="text-xs text-muted-foreground">Type: <span className="capitalize">{job.type}</span></p>
                        </div>
                        <JobStatusBadge status={job.status} />
                      </div>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                         <span><Clock size={12} className="inline mr-1" /> {format(new Date(job.updatedAt), "MMM d, HH:mm")}</span>
                        <div className="flex gap-1">
                           <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); handleArchiveJob(job.id); }}>
                                <Archive size={14} className={job.status === 'archived' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}/>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{job.status === 'archived' ? "Unarchive" : "Archive"}</TooltipContent>
                          </Tooltip>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                               <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 size={14} className="text-muted-foreground hover:text-destructive"/>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Job</TooltipContent>
                              </Tooltip>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader><AlertDialogTitle>Delete Job?</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to delete the job "{job.name}"? This action cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={(e) => {e.stopPropagation(); handleDeleteJob(job.id);}} className={buttonVariants({variant: "destructive"})}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </div>
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
    </TooltipProvider>
  );
};

export default TranslatePage;


    