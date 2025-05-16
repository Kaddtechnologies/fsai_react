
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRightLeft, Copy, Volume2, Trash2, LanguagesIcon, PlusCircle, Search, Filter, Archive, CheckSquare, Square,
  FileText, FileUp, Save, Play, XCircle, RotateCcw, Edit3, Download, Share2, Clock, ListFilter, X, FileSliders, AlertTriangle, Loader2
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
    status === 'complete' ? 'default' : // Green (primary is red by default, default is better for green)
    status === 'in-progress' ? 'secondary' : // Blue (using secondary as blue indicator)
    status === 'archived' ? 'destructive' : // Red
    status === 'draft' ? 'outline' : // Gray
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
  const [isLoading, setIsLoading] = useState(false); // For AI translation calls

  // Main area form state (bound to activeJob)
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState<TranslationJobType>('text');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('es'); // Single target for now
  const [inputText, setInputText] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [outputText, setOutputText] = useState(''); // For text jobs

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
    if (jobs.length > 0 || localStorage.getItem('flowserveai-translation-jobs')) { // only write if there are jobs or if the item exists (to clear it)
        localStorage.setItem('flowserveai-translation-jobs', JSON.stringify(jobs.sort((a,b) => b.updatedAt - a.updatedAt)));
    }
  }, [jobs]);

  const resetMainForm = () => {
    setJobTitle('');
    setJobType('text');
    setSourceLang('auto');
    setTargetLang('es');
    setInputText('');
    setUploadedFiles([]);
    setOutputText('');
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
      targetLanguages: ['es'], // Default target language
    };
  };

  const handleNewJob = (type: TranslationJobType = 'text') => {
    const newJob = createNewJobObject(type);
    setActiveJob(newJob);
    setJobs(prev => [newJob, ...prev].sort((a,b) => b.updatedAt - a.updatedAt));
    loadJobToForm(newJob); // Populate form from new job
  };

  const loadJobToForm = (job: TranslationJob) => {
    setActiveJob(job);
    setJobTitle(job.name);
    setJobType(job.type);
    setSourceLang(job.sourceLanguage);
    setTargetLang(job.targetLanguages[0] || 'es');
    setInputText(job.inputText || '');
    setUploadedFiles(job.sourceFiles || []);
    setOutputText(job.outputTextByLanguage?.[job.targetLanguages[0]] || '');
  };

  const handleSelectJobFromHistory = (jobId: string) => {
    const jobToLoad = jobs.find(j => j.id === jobId);
    if (jobToLoad) {
      if (activeJob?.status === 'draft' && activeJob.id !== jobToLoad.id && activeJob.name === 'Untitled Translation Job' && !activeJob.inputText && (!activeJob.sourceFiles || activeJob.sourceFiles.length === 0) ) {
        // If current active job is an empty, untitled draft, replace it without prompt
        setJobs(prev => prev.filter(j => j.id !== activeJob.id));
      } else if (activeJob?.status === 'draft' && activeJob.id !== jobToLoad.id) {
         // Consider asking to save current draft or implement auto-save more robustly
         // For now, just switch
      }
      loadJobToForm(jobToLoad);
    }
  };

  const updateActiveJobDetails = (updates: Partial<TranslationJob>) => {
    if (!activeJob) return null; // Or create a new job if no active one? For now, return null.
    
    const updatedJob = { ...activeJob, ...updates, updatedAt: Date.now() };
    setActiveJob(updatedJob);
    setJobs(prevJobs => {
        const jobExists = prevJobs.some(j => j.id === updatedJob.id);
        if (jobExists) {
            return prevJobs.map(j => j.id === updatedJob.id ? updatedJob : j).sort((a,b) => b.updatedAt - a.updatedAt);
        }
        // If job doesn't exist (e.g., created on file upload when no activeJob), add it
        return [updatedJob, ...prevJobs].sort((a,b) => b.updatedAt - a.updatedAt);
    });
    return updatedJob;
  };

  const handleJobTypeChange = (newType: TranslationJobType) => {
    setJobType(newType);
    if (activeJob) {
      updateActiveJobDetails({ type: newType, sourceFiles: newType === 'text' ? [] : activeJob.sourceFiles, inputText: newType === 'document' ? '' : activeJob.inputText });
      if (newType === 'text') {
        setUploadedFiles([]); // Clear uploaded files if switching to text
      } else {
        setInputText(''); // Clear input text if switching to document
        setOutputText('');
      }
    } else {
      // If no active job, create a new one of the selected type
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
      status: 'draft', 
      inputText: jobType === 'text' ? inputText : undefined,
      sourceFiles: jobType === 'document' ? uploadedFiles : undefined,
      outputTextByLanguage: jobType === 'text' ? { [targetLang]: outputText } : activeJob.outputTextByLanguage,
    };
    updateActiveJobDetails(currentJobDetails);
    toast({ title: "Draft Saved", description: `Job "${jobTitle}" saved as draft.` });
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
        status: 'in-progress', 
        name: jobTitle, 
        inputText, 
        sourceLanguage: sourceLang, 
        targetLanguages: [targetLang] 
    });

    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l => l.code === sourceLang)?.name || 'English', // Default to English if auto/unknown
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Spanish', // Default to Spanish if unknown
      });
      setOutputText(result.translatedText);
      updateActiveJobDetails({
        status: 'complete',
        outputTextByLanguage: { ...(jobWithProgress?.outputTextByLanguage || {}), [targetLang]: result.translatedText },
      });
      toast({ title: "Translation Complete", description: `Job "${jobTitle}" finished.` });
    } catch (error) {
      console.error("Translation failed:", error);
      updateActiveJobDetails({ status: 'failed', errorMessage: "Translation API call failed." });
      toast({ title: "Translation Error", description: "Could not translate text.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };


  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    
    let currentActiveJob = activeJob;
    if (!currentActiveJob) {
      const newJob = createNewJobObject('document');
      setActiveJob(newJob); // Set it as active
      setJobs(prev => [newJob, ...prev].sort((a,b) => b.updatedAt - a.updatedAt)); // Add to jobs list
      loadJobToForm(newJob); // Load it into the form, which also sets jobType state
      currentActiveJob = newJob; // Use this new job for processing
      setJobType('document'); // Explicitly set form's jobType state
    } else if (currentActiveJob.type !== 'document') {
      // If there is an active job but it's a text job, switch it
      currentActiveJob = updateActiveJobDetails({ type: 'document', inputText: '', outputTextByLanguage: {} })!;
      setJobType('document'); // Update the form's jobType state
      setInputText(''); // Clear text fields
      setOutputText('');
      toast({ title: "Job type switched", description: "Switched to Document Translation mode."});
    }

    processFiles(Array.from(files), currentActiveJob);
    if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  const processFiles = (filesToProcess: File[], jobToUpdate: TranslationJob) => {
    if (!jobToUpdate || jobToUpdate.type !== 'document') {
       // This case should ideally be handled by handleFileSelect ensuring jobToUpdate is correct.
       toast({ title: "Error", description: "Cannot process files without a document job.", variant: "destructive" });
       return;
    }

    let currentTotalSize = (jobToUpdate.sourceFiles || []).reduce((acc, f) => acc + f.size, 0);
    const newUploads: UploadedFile[] = [];
    const existingFiles = jobToUpdate.sourceFiles || [];

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
        fileObject: file, // Keep the File object for potential direct upload later
        convertToDocx: file.type === 'application/pdf' ? false : undefined, // Default PDF to DOCX conversion
      });
      currentTotalSize += file.size;
    }

    if (newUploads.length > 0) {
      const updatedSourceFiles = [...existingFiles, ...newUploads];
      setUploadedFiles(updatedSourceFiles); // Update local state for UI
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
        status: 'in-progress', 
        name: jobTitle, 
        sourceLanguage: sourceLang, 
        targetLanguages: [targetLang] 
    });
    
    setUploadedFiles(prev => prev.map(f => ({...f, status: 'processing', progress: 20})));

    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    setUploadedFiles(prev => prev.map(f => ({...f, status: 'processing', progress: 60})));
    await new Promise(resolve => setTimeout(resolve, 1500));

    setUploadedFiles(prev => prev.map(f => ({...f, status: 'completed', progress: 100})));
    
    const mockTranslatedFiles: Record<string, TranslatedFileArtifact[]> = {
      [targetLang]: uploadedFiles.map(f => ({
        name: `translated_${f.originalName.split('.')[0]}_${targetLang}.${f.convertToDocx && f.type ==='application/pdf' ? 'docx' : f.originalName.split('.').pop() || 'txt'}`,
        url: '#simulated-download', // Placeholder URL
        format: f.convertToDocx && f.type ==='application/pdf' ? 'docx' : f.originalName.split('.').pop() || 'txt'
      }))
    };

    updateActiveJobDetails({ status: 'complete', translatedFilesByLanguage: mockTranslatedFiles });
    toast({ title: "Document Translation Complete (Simulated)", description: `Job "${jobTitle}" finished.` });
    setIsLoading(false);
  };


  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.name.toLowerCase().includes(historySearchTerm.toLowerCase());
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
      setActiveJob(null);
      resetMainForm();
    }
    toast({ title: "Job Deleted" });
  };

  const handleArchiveJob = (jobId: string) => {
     const jobToUpdate = jobs.find(j => j.id === jobId);
     if (jobToUpdate) {
        const newStatus = jobToUpdate.status === 'archived' ? (jobToUpdate.inputText || (jobToUpdate.sourceFiles && jobToUpdate.sourceFiles.length > 0) ? 'draft' : 'draft') : 'archived';
        const updatedJob: TranslationJob = {...jobToUpdate, status: newStatus as TranslationJobStatus, updatedAt: Date.now()};
        setJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j).sort((a,b) => b.updatedAt - a.updatedAt));
        if (activeJob?.id === jobId) {
            loadJobToForm(updatedJob); // Reload job to form to reflect status change
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

  const isEditingExistingJob = activeJob && jobs.some(j => j.id === activeJob.id && j.status !== 'draft');

  return (
    <TooltipProvider>
      <div className="flex h-[calc(100vh-var(--header-height,4rem)-2rem)] gap-4 p-1"> {/* Adjust header height var if needed */}
        {/* Main Translation Area */}
        <Card className="flex-grow-[3] basis-0 shadow-xl flex flex-col overflow-hidden"> {/* 60% width approx */}
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl">
                {activeJob ? (activeJob.name === 'Untitled Translation Job' && !isEditingExistingJob ? 'New Translation Job' : 'Edit Job') : 'New Translation Job'}
              </CardTitle>
              {activeJob && <JobStatusBadge status={activeJob.status} />}
            </div>
             {activeJob && <CardDescription>ID: {activeJob.id}</CardDescription>}
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
                    disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}
                  />
                  <p className="text-xs text-muted-foreground text-right">{jobTitle.length}/{MAX_JOB_TITLE_LENGTH}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Job Type</label>
                    <Select 
                        value={jobType} 
                        onValueChange={(v) => handleJobTypeChange(v as TranslationJobType)} 
                        disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed' && !((activeJob.sourceFiles && activeJob.sourceFiles.length > 0) || activeJob.inputText )) }
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
                     <Select value={sourceLang} onValueChange={setSourceLang} disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}>
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
                   <Select value={targetLang} onValueChange={setTargetLang} disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}>
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
                        disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}
                      />
                       <div className="flex justify-between items-center mt-1">
                          <p className="text-xs text-muted-foreground">{inputText.length}/{MAX_TEXT_INPUT_LENGTH} characters</p>
                          <div>
                            <Button variant="ghost" size="icon" onClick={() => handleCopy(inputText)} disabled={!inputText}><Copy size={16}/></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleTTS(inputText)} disabled={!inputText}>
                              {isSpeaking && inputText === (document.activeElement as HTMLTextAreaElement)?.value ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
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
                           {isSpeaking && outputText === (document.activeElement as HTMLTextAreaElement)?.value ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}
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
                        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}>
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
                      <ScrollArea className="h-48 border rounded-md p-2">
                        <p className="text-sm font-medium mb-2">Selected Files ({uploadedFiles.length}/{MAX_FILES_PER_JOB}):</p>
                        <ul className="space-y-2">
                          {uploadedFiles.map(file => (
                            <li key={file.id} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 text-sm">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText size={18} className="text-primary shrink-0" />
                                <span className="truncate" title={file.originalName}>{file.originalName}</span>
                                <span className="text-xs text-muted-foreground whitespace-nowrap">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                              </div>
                              <div className='flex items-center gap-1'>
                                {file.type === 'application/pdf' && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button variant={file.convertToDocx ? "secondary" : "outline"} size="sm" className="h-7 px-2 text-xs" onClick={() => togglePdfToDocx(file.id)} disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}>
                                        <FileSliders size={14} className="mr-1"/> DOCX
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Convert PDF to DOCX on translation</TooltipContent>
                                  </Tooltip>
                                )}
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeUploadedFile(file.id)} disabled={isLoading || (activeJob.status !== 'draft' && activeJob.status !== 'failed')}><XCircle size={16} /></Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>
                    )}
                    {activeJob.status === 'complete' && activeJob.translatedFilesByLanguage?.[targetLang] && (
                       <div>
                        <h4 className="text-md font-semibold mb-2">Translated Documents for {getLanguageName(targetLang)}:</h4>
                         <ul className="space-y-2">
                          {(activeJob.translatedFilesByLanguage[targetLang] || []).map(file => (
                            <li key={file.name} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm">
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText size={18} className="text-accent-success shrink-0" />
                                <span className="truncate" title={file.name}>{file.name}</span>
                              </div>
                              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast({title: "Download (Simulated)", description: `Would download ${file.name}`})}>
                                <Download size={14} className="mr-1"/> Download
                              </Button>
                            </li>
                          ))}
                        </ul>
                       </div>
                    )}
                    {activeJob.status === 'failed' && activeJob.errorMessage && (
                        <Alert variant="destructive" className="mt-2">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                {activeJob.errorMessage}
                            </AlertDescription>
                        </Alert>
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
          {activeJob && (
            <CardFooter className="border-t p-4 flex justify-end gap-2">
              {(activeJob.status === 'draft' || activeJob.status === 'failed') && (
                <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading || !jobTitle.trim()}>
                  <Save className="mr-2 h-4 w-4" /> Save Draft
                </Button>
              )}
              {(activeJob.status === 'draft' || activeJob.status === 'failed') && (
                <Button
                  onClick={jobType === 'text' ? handleTranslateTextJob : handleTranslateDocumentJob}
                  disabled={isLoading || (jobType === 'text' && !inputText.trim()) || (jobType === 'document' && uploadedFiles.length === 0) || !jobTitle.trim()}
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

        {/* Job History Panel */}
        <Card className="flex-grow-[2] basis-0 shadow-xl flex flex-col overflow-hidden"> {/* 40% width approx */}
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
                    {(['draft', 'in-progress', 'complete', 'failed'] as TranslationJobStatus[]).map(status => (
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
                <Search className="mx-auto h-12 w-12 opacity-30 mb-2" />
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
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteJob(job.id)} className={buttonVariants({variant: "destructive"})}>Delete</AlertDialogAction>
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
    </TooltipProvider>
  );
};

export default TranslatePage;
