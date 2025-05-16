
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
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [jobs, setJobs] = useState<TranslationJob[]>([]);
  const [activeJob, setActiveJob] = useState<TranslationJob | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  // Main area form state (bound to activeJob or directly manipulated)
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<TranslationJobType>('text');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es'); 
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [outputText, setOutputText] = useState(''); 

  const [isFormDirty, setIsFormDirty] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedTranslatedFiles, setSelectedTranslatedFiles] = useState<Record<string, boolean>>({});


  // Job history panel state
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState<TranslationJobType | 'all'>('all');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<TranslationJobStatus[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // Load jobs from localStorage
  useEffect(() => {
    const storedJobs = localStorage.getItem('flowserveai-translation-jobs');
    if (storedJobs) {
      setJobs(JSON.parse(storedJobs).sort((a:TranslationJob,b:TranslationJob) => b.updatedAt - a.updatedAt));
    }
  }, []);

  // Save jobs to localStorage
  useEffect(() => {
    if (jobs.length > 0 || localStorage.getItem('flowserveai-translation-jobs')) { 
        localStorage.setItem('flowserveai-translation-jobs', JSON.stringify(jobs.sort((a,b) => b.updatedAt - a.updatedAt)));
    }
  }, [jobs]);

  // Track form dirty state
  useEffect(() => {
    if (!activeJob) {
      setIsFormDirty(false);
      return;
    }
    const titleDirty = jobTitle !== activeJob.name;
    const typeDirty = jobType !== activeJob.type;
    const sourceLangDirty = sourceLang !== activeJob.sourceLanguage;
    const targetLangDirty = targetLang !== (activeJob.targetLanguages[0] || 'es');
    const inputTextDirty = inputText !== (activeJob.inputText || '');
    // Basic check for uploadedFiles, more sophisticated check might involve deep comparison or length
    const filesDirty = uploadedFiles.length !== (activeJob.sourceFiles?.length || 0) || 
                       !uploadedFiles.every((uf, i) => activeJob.sourceFiles && activeJob.sourceFiles[i] && uf.id === activeJob.sourceFiles[i].id && uf.convertToDocx === activeJob.sourceFiles[i].convertToDocx);

    setIsFormDirty(titleDirty || typeDirty || sourceLangDirty || targetLangDirty || inputTextDirty || filesDirty);
  }, [jobTitle, jobType, sourceLang, targetLang, inputText, uploadedFiles, activeJob]);


  const resetMainForm = (clearActiveJob = true) => {
    if (clearActiveJob) setActiveJob(null);
    setJobTitle('');
    setJobType('text');
    setSourceLang('auto');
    setTargetLang('es');
    setInputText('');
    setUploadedFiles([]);
    setOutputText('');
    setSelectedTranslatedFiles({});
    setIsFormDirty(false);
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
    };
  };

  const handleNewJob = (type: TranslationJobType = 'text') => {
    // If current activeJob is an unsaved, pristine "Untitled Translation Job", remove it
    if (activeJob && activeJob.name === 'Untitled Translation Job' && activeJob.status === 'draft' && !activeJob.inputText && (!activeJob.sourceFiles || activeJob.sourceFiles.length === 0)) {
      const isPristineInList = jobs.find(j => j.id === activeJob.id && j.name === 'Untitled Translation Job' && !j.inputText && (!j.sourceFiles || j.sourceFiles.length === 0) && j.status === 'draft');
      if (isPristineInList) {
        setJobs(prev => prev.filter(j => j.id !== activeJob.id));
      }
    }

    const newJob = createNewJobObject(type);
    setActiveJob(newJob); // Set new job as active first
    setJobs(prev => [newJob, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
    loadJobToForm(newJob); // Then load its details into the form
  };

  const loadJobToForm = (job: TranslationJob | null) => {
    if (!job) {
      resetMainForm();
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
    // setIsFormDirty(false) will be triggered by the useEffect dependency on activeJob
    // Use a timeout to ensure activeJob has updated before checking dirty state
    setTimeout(() => setIsFormDirty(false), 0);
  };

  const handleSelectJobFromHistory = (jobId: string) => {
    const jobToLoad = jobs.find(j => j.id === jobId);
    if (jobToLoad) {
      // If current activeJob is an unsaved, pristine "Untitled Translation Job", remove it before loading another
      if (activeJob && activeJob.id !== jobToLoad.id && activeJob.name === 'Untitled Translation Job' && activeJob.status === 'draft' && !isFormDirty) {
         const isPristineInList = jobs.find(j => j.id === activeJob.id && j.name === 'Untitled Translation Job' && !j.inputText && (!j.sourceFiles || j.sourceFiles.length === 0) && j.status === 'draft');
         if (isPristineInList) {
           setJobs(prev => prev.filter(j => j.id !== activeJob.id));
         }
      }
      loadJobToForm(jobToLoad);
    }
  };

  const updateActiveJobDetails = (updates: Partial<TranslationJob>, newStatus?: TranslationJobStatus) => {
    if (!activeJob) return null; 
    
    const updatedJob = { 
      ...activeJob, 
      ...updates, 
      status: newStatus || updates.status || activeJob.status, 
      updatedAt: Date.now() 
    };

    setActiveJob(updatedJob); 
    setJobs(prevJobs => { 
        const jobExists = prevJobs.some(j => j.id === updatedJob.id);
        if (jobExists) {
            return prevJobs.map(j => j.id === updatedJob.id ? updatedJob : j).sort((a,b) => b.updatedAt - a.updatedAt);
        }
        return [updatedJob, ...prevJobs].sort((a,b) => b.updatedAt - a.updatedAt);
    });
    // If status changes, form dirtiness might need re-evaluation or reset
    if (newStatus && newStatus !== activeJob.status) {
        setTimeout(() => setIsFormDirty(false), 0);
    }
    return updatedJob;
  };

  const handleJobTypeChange = (newType: TranslationJobType) => {
    setJobType(newType); 
    if (activeJob) {
      const updatedDetails: Partial<TranslationJob> = { 
        type: newType, 
        sourceFiles: newType === 'text' ? [] : activeJob.sourceFiles || [], 
        inputText: newType === 'document' ? '' : activeJob.inputText || '',
        outputTextByLanguage: {}, 
        translatedFilesByLanguage: {} 
      };
      updateActiveJobDetails(updatedDetails);
      if (newType === 'text') setUploadedFiles([]);
      else { setInputText(''); setOutputText('');}
    } else {
      handleNewJob(newType);
    }
  };

  const handleSaveDraft = () => {
    if (!activeJob) {
      toast({ title: "No active job", description: "Create or select a job to save.", variant: "destructive" });
      return;
    }
    if (!jobTitle.trim()) {
      toast({ title: "Job title required", description: "Please enter a title for the job.", variant: "destructive" });
      return;
    }
    const currentJobDetails: Partial<TranslationJob> = {
      name: jobTitle,
      type: jobType,
      sourceLanguage: sourceLang,
      targetLanguages: [targetLang],
      // status is not changed by save draft, unless it was 'failed' then it can become 'draft'
      status: activeJob.status === 'failed' ? 'draft' : activeJob.status,
      inputText: jobType === 'text' ? inputText : undefined,
      sourceFiles: jobType === 'document' ? uploadedFiles : undefined,
      outputTextByLanguage: jobType === 'text' && outputText ? { [targetLang]: outputText } : activeJob.outputTextByLanguage,
    };
    updateActiveJobDetails(currentJobDetails);
    setTimeout(() => setIsFormDirty(false), 0); // Reset dirty state after save
    toast({ title: "Draft Saved", description: `Job "${jobTitle}" saved as draft.` });
  };
  
  const handleCancelJob = () => {
    if (!activeJob) return;

    if (isFormDirty) {
      setShowCancelConfirm(true);
    } else {
      // If not dirty (e.g. pristine new job, or just opened an existing job)
      // If it's a pristine "Untitled Translation Job", remove it from list
      if (activeJob.name === 'Untitled Translation Job' && !activeJob.inputText && (!activeJob.sourceFiles || activeJob.sourceFiles.length === 0)) {
         const jobInList = jobs.find(j => j.id === activeJob.id);
         if (jobInList && jobInList.name === 'Untitled Translation Job' && !jobInList.inputText && (!jobInList.sourceFiles || jobInList.sourceFiles.length === 0)) {
           setJobs(prev => prev.filter(j => j.id !== activeJob.id));
         }
      }
      resetMainForm();
      toast({ title: "Job Cancelled" });
    }
  };

  const confirmCancelJob = () => {
    if (activeJob && activeJob.name === 'Untitled Translation Job' && !activeJob.inputText && (!activeJob.sourceFiles || activeJob.sourceFiles.length === 0)) {
        const jobInList = jobs.find(j => j.id === activeJob.id);
        if (jobInList && jobInList.name === 'Untitled Translation Job' && !jobInList.inputText && (!jobInList.sourceFiles || jobInList.sourceFiles.length === 0)) {
            setJobs(prev => prev.filter(j => j.id !== activeJob.id));
        }
    }
    resetMainForm();
    toast({ title: "Changes Discarded" });
    setShowCancelConfirm(false);
  };


  const handleTranslateTextJob = async () => {
    if (!activeJob || jobType !== 'text' || !inputText.trim()) return;
    if (!jobTitle.trim()) {
        toast({ title: "Job title required", description: "Please enter a title for the job before translating.", variant: "destructive" });
        return;
    }

    setIsLoading(true);
    setOutputText('');
    const jobWithProgress = updateActiveJobDetails({ 
        name: jobTitle, 
        inputText, 
        sourceLanguage: sourceLang, 
        targetLanguages: [targetLang] 
    }, 'in-progress');

    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l => l.code === sourceLang)?.name || 'English', 
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Spanish',
      });
      setOutputText(result.translatedText);
      updateActiveJobDetails({
        outputTextByLanguage: { ...(jobWithProgress?.outputTextByLanguage || {}), [targetLang]: result.translatedText },
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


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    let currentJobForUpload = activeJob;

    if (!currentJobForUpload) {
      const newJob = createNewJobObject('document');
      setJobs(prev => [newJob, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
      loadJobToForm(newJob); 
      currentJobForUpload = newJob; 
      setJobType('document'); // Explicitly set in form state
    } else if (currentJobForUpload.type !== 'document') {
      handleJobTypeChange('document'); // This will update activeJob
      // Need to get the updated job from state, as updateActiveJobDetails is async
      // For simplicity, we'll assume handleJobTypeChange correctly sets activeJob.type for next steps
      // or grab it after a small delay, or re-fetch from jobs list.
      // For now, we rely on handleJobTypeChange updating the job type.
      currentJobForUpload = {...currentJobForUpload, type: 'document', sourceFiles: [], inputText: '', outputTextByLanguage: {}}; // reflect change locally
      toast({ title: "Job type switched", description: "Switched to Document Translation mode."});
    }
    
    // Ensure currentJobForUpload is the one from state after potential type change
    // This is tricky because setState is async. A ref or passing the job object might be more robust.
    // For now, we proceed with the potentially modified currentJobForUpload.
    // A safer way would be to use a callback with setJobs if `activeJob` needs to be used immediately after an update.
    // Or, processFiles should fetch the latest `activeJob` from `jobs` list.
    
    const jobToUpdate = jobs.find(j => j.id === currentJobForUpload!.id) || currentJobForUpload!;
    processFiles(Array.from(files), jobToUpdate);
    
    if(fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const processFiles = (filesToProcess: File[], jobToUpdate: TranslationJob) => {
     if (jobToUpdate.type !== 'document') {
       toast({ title: "Error", description: "Cannot process files: job is not a document job.", variant: "destructive" });
       return;
    }

    let currentTotalSize = (jobToUpdate.sourceFiles || []).reduce((acc, f) => acc + f.size, 0);
    const newUploads: UploadedFile[] = [];
    const existingFiles = [...(jobToUpdate.sourceFiles || [])]; // clone to avoid direct state mutation before setState

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
        id: `file-${Date.now()}-${file.name}`,
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
      setUploadedFiles(updatedSourceFiles); // Update UI state for uploaded files
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
    if (!activeJob || jobType !== 'document' || uploadedFiles.length === 0) return;
     if (!jobTitle.trim()) {
        toast({ title: "Job title required", description: "Please enter a title for the job before translating.", variant: "destructive" });
        return;
    }
    
    setIsLoading(true);
    updateActiveJobDetails({ 
        name: jobTitle, 
        sourceLanguage: sourceLang, 
        targetLanguages: [targetLang] 
    }, 'in-progress');

    let currentFiles = [...uploadedFiles]; // Work with a copy for updates

    const processedFiles: UploadedFile[] = [];
    const translatedArtifacts: TranslatedFileArtifact[] = [];

    for (let i = 0; i < currentFiles.length; i++) {
        const file = currentFiles[i];
        
        // Simulate uploading/initial processing
        currentFiles = currentFiles.map(f => f.id === file.id ? {...f, status: 'processing', progress: 20} : f);
        setUploadedFiles(currentFiles); // Update UI
        updateActiveJobDetails({sourceFiles: currentFiles}); // Persist to activeJob
        await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay

        // Simulate main processing
        currentFiles = currentFiles.map(f => f.id === file.id ? {...f, status: 'processing', progress: 60} : f);
        setUploadedFiles(currentFiles);
        updateActiveJobDetails({sourceFiles: currentFiles});
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        // Simulate completion
        const completedFile = {...file, status: 'completed', progress: 100} as UploadedFile;
        currentFiles = currentFiles.map(f => f.id === file.id ? completedFile : f);
        setUploadedFiles(currentFiles);
        updateActiveJobDetails({sourceFiles: currentFiles});
        processedFiles.push(completedFile);

        translatedArtifacts.push({
            name: `translated_${completedFile.originalName.split('.')[0]}_${targetLang}.${completedFile.convertToDocx && completedFile.type ==='application/pdf' ? 'docx' : completedFile.originalName.split('.').pop() || 'txt'}`,
            url: '#simulated-download', 
            format: completedFile.convertToDocx && completedFile.type ==='application/pdf' ? 'docx' : completedFile.originalName.split('.').pop() || 'txt'
        });
        toast({ title: "File Processed", description: `${completedFile.originalName} translation complete (simulated).` });
        await new Promise(resolve => setTimeout(resolve, 300)); // Small delay between files
    }
    
    updateActiveJobDetails({ 
        status: 'complete', 
        translatedFilesByLanguage: { [targetLang]: translatedArtifacts }, 
        sourceFiles: processedFiles 
    });
    toast({ title: "Document Translation Job Complete (Simulated)", description: `Job "${jobTitle}" finished.` });
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
    // Actual ZIP creation and download logic would go here
  };


  const filteredJobs = jobs.filter(job => {
    const matchesSearch = historySearchTerm === '' || job.name.toLowerCase().includes(historySearchTerm.toLowerCase());
    const matchesType = historyFilterType === 'all' || job.type === historyFilterType;
    const matchesStatus = historyFilterStatus.length === 0 || historyFilterStatus.includes(job.status);
    const matchesArchive = showArchived ? job.status === 'archived' : job.status !== 'archived';
    return matchesSearch && matchesType && matchesStatus && matchesArchive;
  });

  const toggleHistoryFilterStatus = (status: TranslationJobStatus) => {
    setHistoryFilterStatus(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };
  
  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    if (activeJob?.id === jobId) {
      resetMainForm();
    }
    toast({ title: "Job Deleted" });
  };

  const handleArchiveJob = (jobId: string) => {
     const jobToUpdate = jobs.find(j => j.id === jobId);
     if (jobToUpdate) {
        const newStatus = jobToUpdate.status === 'archived' ? (jobToUpdate.inputText || (jobToUpdate.sourceFiles && jobToUpdate.sourceFiles.length > 0) ? 'draft' : 'draft') : 'archived';
        const updatedJobData: Partial<TranslationJob> = {status: newStatus as TranslationJobStatus};
        
        setJobs(prev => prev.map(j => j.id === jobId ? {...j, ...updatedJobData, updatedAt: Date.now()} : j).sort((a,b) => b.updatedAt - a.updatedAt));
        
        if (activeJob?.id === jobId) {
             setActiveJob(prevActive => prevActive ? {...prevActive, ...updatedJobData, updatedAt: Date.now()} : null);
             if (newStatus === 'archived') { /* Potentially disable form fields if desired */ }
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

  const hasPdfFile = uploadedFiles.some(file => file.type === 'application/pdf');

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
          <CardContent className="flex-grow overflow-y-auto space-y-4 p-4">
            {!activeJob ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
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
                    disabled={isLoading || activeJob.status === 'in-progress'}
                  />
                  <p className="text-xs text-muted-foreground text-right">{jobTitle.length}/{MAX_JOB_TITLE_LENGTH}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select 
                        value={jobType} 
                        onValueChange={(v) => handleJobTypeChange(v as TranslationJobType)} 
                        disabled={isLoading || activeJob.status === 'in-progress'}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Translation</SelectItem>
                        <SelectItem value="document">Document Translation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-1">
                     <label className="text-sm font-medium">Source Language</label>
                     <Select value={sourceLang} onValueChange={setSourceLang} disabled={isLoading || activeJob.status === 'in-progress'}>
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
                   <Select value={targetLang} onValueChange={setTargetLang} disabled={isLoading || activeJob.status === 'in-progress'}>
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
                        disabled={isLoading || activeJob.status === 'in-progress'}
                      />
                       <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">{inputText.length}/{MAX_TEXT_INPUT_LENGTH} characters</p>
                          <div>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(inputText)} disabled={!inputText}><Copy size={16}/></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleTTS(inputText)} disabled={!inputText}>
                              {isSpeaking && utterance?.text === inputText ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
                            </Button>
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
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(outputText)} disabled={!outputText}><Copy size={16}/></Button>
                          <Button variant="ghost" size="icon" onClick={() => handleTTS(outputText)} disabled={!outputText}>
                           {isSpeaking && utterance?.text === outputText ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
                          </Button>
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
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || activeJob.status === 'in-progress'}>
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
                        <p className="text-sm font-medium mb-2">Selected Files ({uploadedFiles.length}/{MAX_FILES_PER_JOB}):</p>
                        <ul className="space-y-2">
                          {uploadedFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 text-sm">
                              <div className={cn("flex items-center gap-2 min-w-0", hasPdfFile ? "flex-grow-[2]" : "flex-grow")}>
                                <FileText size={18} className="text-primary shrink-0" />
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="truncate" title={file.originalName}>{file.originalName}</span>
                                  </TooltipTrigger>
                                  <TooltipContent><p>{file.originalName}</p></TooltipContent>
                                </Tooltip>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              {file.status === 'processing' && file.progress != null && (
                                <div className="w-20 flex items-center gap-1">
                                  <Progress value={file.progress} className="h-1.5 flex-1" />
                                  <span className='text-xs'>{file.progress}%</span>
                                </div>
                              )}
                              {file.status === 'completed' && <CheckCircleIcon size={16} className="text-accent-success shrink-0" />}
                              {file.status === 'failed' && <XCircleIcon size={16} className="text-destructive shrink-0" />}
                              
                              <div className='flex items-center gap-1 shrink-0'>
                                {hasPdfFile && file.type === 'application/pdf' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant={file.convertToDocx ? "secondary" : "outline"} size="sm" className="h-7 px-2 text-xs" onClick={() => togglePdfToDocx(file.id)} disabled={isLoading || activeJob.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}>
                                        <FileSliders size={14} className="mr-1"/> DOCX
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Convert PDF to DOCX on translation</p></TooltipContent>
                                  </Tooltip>
                                )}
                                {hasPdfFile && file.type !== 'application/pdf' && <div className="w-[78px]"></div> /* Placeholder for alignment */}
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeUploadedFile(file.id)} disabled={isLoading || activeJob.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}><XCircleIcon size={16} /></Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    )}
                    {activeJob.status === 'complete' && activeJob.translatedFilesByLanguage?.[targetLang] && activeJob.translatedFilesByLanguage[targetLang].length > 0 && (
                       <div>
                        <h4 className="text-md font-semibold mb-2 mt-4">Translated Documents for {getLanguageName(targetLang)}:</h4>
                         <ScrollArea className="max-h-48 border rounded-md p-2">
                            <ul className="space-y-2">
                            {(activeJob.translatedFilesByLanguage[targetLang] || []).map(file => (
                                <li key={file.name} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Checkbox 
                                      id={`cb-${file.name}`} 
                                      checked={!!selectedTranslatedFiles[file.name]}
                                      onCheckedChange={() => handleSelectedTranslatedFileToggle(file.name)}
                                      className="mr-2"
                                    />
                                    <FileText size={18} className="text-accent-success shrink-0" />
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <span className="truncate flex-1" title={file.name}>{file.name}</span>
                                      </TooltipTrigger>
                                      <TooltipContent><p>{file.name}</p></TooltipContent>
                                    </Tooltip>
                                </div>
                                <Button variant="outline" size="sm" className="h-7 text-xs ml-2" onClick={() => toast({title: "Download (Simulated)", description: `Would download ${file.name}`})}>
                                    <Download size={14} className="mr-1"/> Download
                                </Button>
                                </li>
                            ))}
                            </ul>
                         </ScrollArea>
                         <div className="flex gap-2 mt-2 justify-end">
                            <Button variant="outline" size="sm" onClick={handleDownloadSelected} disabled={Object.values(selectedTranslatedFiles).every(v => !v)}>
                                <Download className="mr-2 h-4 w-4" /> Download Selected (Simulated)
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownloadAllZip}>
                                <Archive className="mr-2 h-4 w-4" /> Download All as ZIP (Simulated)
                            </Button>
                         </div>
                       </div>
                    )}
                    {activeJob.status === 'failed' && activeJob.errorMessage && (
                        <Card className="mt-2 border-destructive bg-destructive/10">
                            <CardHeader className="p-3">
                                <div className="flex items-center gap-2 text-destructive">
                                    <AlertTriangle className="h-5 w-5" />
                                    <CardTitle className="text-base">Translation Failed</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 pt-0 text-sm text-destructive">
                                {activeJob.errorMessage}
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
          </CardContent>
          {activeJob && (
            <CardFooter className="border-t p-4 flex justify-end gap-2">
              {activeJob.status !== 'in-progress' && (
                 <Button variant="outline" onClick={handleCancelJob} disabled={isLoading}>
                   <XCircleIcon className="mr-2 h-4 w-4" /> Cancel
                 </Button>
              )}

              {(activeJob.status === 'draft' || activeJob.status === 'failed' || activeJob.status === 'complete' || activeJob.status === 'archived') && activeJob.status !== 'in-progress' && (
                <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading || !jobTitle.trim() || !isFormDirty}>
                  <Save className="mr-2 h-4 w-4" /> {activeJob.status === 'complete' || activeJob.status === 'archived' ? 'Save Changes' : 'Save Draft'}
                </Button>
              )}
              {(activeJob.status === 'draft' || activeJob.status === 'failed') && (
                <Button
                  onClick={jobType === 'text' ? handleTranslateTextJob : handleTranslateDocumentJob}
                  disabled={isLoading || (jobType === 'text' && !inputText.trim()) || (jobType === 'document' && uploadedFiles.filter(f => f.status !== 'completed').length === 0) || !jobTitle.trim()}
                  className="bg-primary-gradient text-primary-foreground hover:opacity-90"
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Translate
                </Button>
              )}
              {activeJob.status === 'in-progress' && <Button disabled variant="secondary"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...</Button>}
              {activeJob.status === 'complete' && <Button variant="default" disabled className="bg-accent-success hover:bg-accent-success/90"><CheckSquare className="mr-2 h-4 w-4" /> Completed</Button>}
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
                    {(['draft', 'in-progress', 'complete', 'archived', 'failed'] as TranslationJobStatus[]).map(status => (
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
                    <TooltipContent>{showArchived ? "Hide Archived" : "Show Archived"}</TooltipContent>
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
            <AlertDialogAction onClick={confirmCancelJob} className={buttonVariants({variant: "destructive"})}>Discard & Cancel</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default TranslatePage;


    