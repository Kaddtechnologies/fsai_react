
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ArrowRightLeft, Copy, Volume2, Trash2, LanguagesIcon, PlusCircle, Search, Filter, Archive, CheckSquare, Square, X,
  FileText, FileUp, Save, Play, XCircle as XCircleIcon, RotateCcw, Edit3, Download, Share2, Clock, ListFilter, FileSliders, AlertTriangle, Loader2, CheckCircle as CheckCircleIcon, Info, Edit, MessageSquareText, UploadCloud, Upload
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { translateText } from '@/ai/flows/translate-text';
import type { TranslationJob, TranslationJobType, TranslationJobStatus, UploadedFile, TranslatedFileArtifact, UserFeedbackEntry } from '@/lib/types';
import { useSpeechSynthesis } from '@/hooks/use-speech-synthesis';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import useTranslation from '@/app/hooks/useTranslation';

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

const MAX_JOB_TITLE_LENGTH = 100;
const MAX_TEXT_INPUT_LENGTH = 10000;
const MAX_FILES_PER_JOB = 5;
const MAX_TOTAL_UPLOAD_SIZE_MB = 100;
const MAX_TOTAL_UPLOAD_SIZE_BYTES = MAX_TOTAL_UPLOAD_SIZE_MB * 1024 * 1024;
const ALLOWED_DOC_EXTENSIONS = ['.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.pdf', '.txt'];
const ALLOWED_FEEDBACK_FILE_EXTENSIONS = ['.csv', '.tsv', '.xlsx'];
const MAX_FEEDBACK_FILE_SIZE_MB = 5;
const MAX_FEEDBACK_FILE_SIZE_BYTES = MAX_FEEDBACK_FILE_SIZE_MB * 1024 * 1024;


const JobStatusBadge: React.FC<{ status: TranslationJobStatus }> = ({ status }) => {
  const { t } = useTranslation();
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
      {t(`translation.statusEnum.${status}` as any) || status.replace('-', ' ')}
    </Badge>
  );
};

const translateWithParams = (t: (key: string) => string, key: string, params: Record<string, string | number>) => {
  let translated = t(key);
  Object.entries(params).forEach(([paramKey, paramValue]) => {
    translated = translated.replace(`{${paramKey}}`, String(paramValue));
  });
  return translated;
};

const TranslatePage = () => {
  const { toast } = useToast();
  const { speak, cancel, isSpeaking } = useSpeechSynthesis();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const feedbackFileInputRef = useRef<HTMLInputElement>(null);
  const { t, language } = useTranslation();

  // View state for the right panel
  const [activeView, setActiveView] = useState<'jobs' | 'feedback'>('jobs');

  // Translation Job states
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
  const [showDeleteJobConfirmModal, setShowDeleteJobConfirmModal] = useState(false);
  const [jobIdPendingDeletion, setJobIdPendingDeletion] = useState<string | null>(null);
  
  // Job History panel states
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [historyFilterType, setHistoryFilterType] = useState<'all' | TranslationJobType>('all');
  const [historyFilterStatus, setHistoryFilterStatus] = useState<TranslationJobStatus[]>([]);
  const [showArchived, setShowArchived] = useState(false);

  // User Feedback states
  const [feedbackSourceLang, setFeedbackSourceLang] = useState('');
  const [feedbackTargetLang, setFeedbackTargetLang] = useState('');
  const [feedbackSourceKeyword, setFeedbackSourceKeyword] = useState('');
  const [feedbackTargetKeyword, setFeedbackTargetKeyword] = useState('');
  const [feedbackBulkMode, setFeedbackBulkMode] = useState(false);
  const [feedbackFile, setFeedbackFile] = useState<File | null>(null);
  const [feedbackFileName, setFeedbackFileName] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [userFeedbackItems, setUserFeedbackItems] = useState<UserFeedbackEntry[]>([]);
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState('');
  const [showDeleteFeedbackConfirm, setShowDeleteFeedbackConfirm] = useState(false);
  const [feedbackIdToDelete, setFeedbackIdToDelete] = useState<string | null>(null);


  // Load jobs from localStorage
  useEffect(() => {
    const storedJobs = localStorage.getItem('flowserveai-translation-jobs');
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs).sort((a:TranslationJob,b:TranslationJob) => b.updatedAt - a.updatedAt));
      } catch (e) { console.error("Failed to parse translation jobs from localStorage", e); setJobs([]); }
    }
    const storedFeedback = localStorage.getItem('flowserveai-user-feedback');
    if (storedFeedback) {
      try {
        setUserFeedbackItems(JSON.parse(storedFeedback).sort((a:UserFeedbackEntry,b:UserFeedbackEntry) => b.createdAt - a.createdAt));
      } catch (e) { console.error("Failed to parse user feedback from localStorage", e); setUserFeedbackItems([]); }
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

  // Save feedback items to localStorage
  useEffect(() => {
    if (userFeedbackItems.length > 0 || localStorage.getItem('flowserveai-user-feedback')) {
      localStorage.setItem('flowserveai-user-feedback', JSON.stringify(userFeedbackItems.sort((a,b) => b.createdAt - a.createdAt)));
    } else if (userFeedbackItems.length === 0 && localStorage.getItem('flowserveai-user-feedback')) {
      localStorage.removeItem('flowserveai-user-feedback');
    }
  }, [userFeedbackItems]);


  // Update isFormDirty state for translation job form
  useEffect(() => {
    if (!activeJob || activeView !== 'jobs') {
      setIsFormDirty(false); 
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
  }, [jobTitle, jobType, sourceLang, targetLang, inputText, uploadedFiles, activeJob, activeView]);


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
    if(fromCancel) setIsFormDirty(false);
    else setTimeout(() => setIsFormDirty(false),0);
  };
  
  const createNewJobObject = (type: TranslationJobType = 'text'): TranslationJob => {
    const newJobId = `job-${Date.now()}`;
    return {
      id: newJobId, name: t('translation.new'), type: type, status: 'draft', createdAt: Date.now(), updatedAt: Date.now(),
      sourceLanguage: 'auto', targetLanguages: ['es'], sourceFiles: [], outputTextByLanguage: {}, translatedFilesByLanguage: {},
    };
  };
  
  const loadJobToForm = (job: TranslationJob | null) => {
    if (!job) { resetMainFormToEmpty(); return; }
    setActiveJob(job); setJobTitle(job.name); setJobType(job.type);
    setSourceLang(job.sourceLanguage); setTargetLang(job.targetLanguages[0] || 'es');
    setInputText(job.inputText || ''); setUploadedFiles(job.sourceFiles || []);
    setOutputText(job.outputTextByLanguage?.[job.targetLanguages[0]] || '');
    setSelectedTranslatedFiles({});
    setTimeout(() => setIsFormDirty(false), 0); 
  };

  const persistActiveJobDetails = useCallback((updates: Partial<TranslationJob>, newStatus?: TranslationJobStatus): TranslationJob | null => {
    if (!activeJob) return null; 
    let currentJobData = { ...activeJob };
    currentJobData.name = jobTitle.trim() || t('translation.new');
    currentJobData.type = jobType; currentJobData.sourceLanguage = sourceLang;
    currentJobData.targetLanguages = [targetLang]; 
    if (jobType === 'text') {
        currentJobData.inputText = inputText;
        currentJobData.outputTextByLanguage = { ...(currentJobData.outputTextByLanguage || {}), [targetLang]: outputText };
    } else { currentJobData.sourceFiles = uploadedFiles; }
    
    const finalJobToPersist: TranslationJob = {
      ...currentJobData, ...updates, 
      status: newStatus || updates.status || currentJobData.status, updatedAt: Date.now(),
    };

    setJobs(prevJobs => {
      const jobExistsInList = prevJobs.some(j => j.id === finalJobToPersist.id);
      if (jobExistsInList) {
        return prevJobs.map(j => (j.id === finalJobToPersist.id ? finalJobToPersist : j)).sort((a, b) => b.updatedAt - a.updatedAt);
      }
      return [finalJobToPersist, ...prevJobs].sort((a, b) => b.updatedAt - a.updatedAt);
    });
    setActiveJob(finalJobToPersist); 
    setTimeout(() => setIsFormDirty(false), 0); 
    return finalJobToPersist;
  }, [activeJob, jobTitle, jobType, sourceLang, targetLang, inputText, outputText, uploadedFiles, t]);


  const handleNewJob = (type: TranslationJobType = 'text') => {
    if (isFormDirty && activeView === 'jobs') { setShowCancelConfirm(true); return; }
    const newJobTemplate = createNewJobObject(type);
    setActiveJob(newJobTemplate); 
    loadJobToForm(newJobTemplate); 
  };

  const handleSelectJobFromHistory = (jobId: string) => {
    if (isFormDirty && activeJob && activeJob.id !== jobId && activeView === 'jobs') { setShowCancelConfirm(true); return; }
    const jobToLoad = jobs.find(j => j.id === jobId);
    if (jobToLoad) { loadJobToForm(jobToLoad); }
  };

  const handleJobTypeChange = (newType: TranslationJobType) => {
    setJobType(newType); 
    if (activeJob) {
      const updatedFieldsForTypeSwitch: Partial<TranslationJob> = {
        type: newType, status: 'draft', 
        inputText: newType === 'document' ? '' : (activeJob.inputText || ''),
        sourceFiles: newType === 'text' ? [] : (activeJob.sourceFiles || []),
        outputTextByLanguage: {}, translatedFilesByLanguage: {}, updatedAt: Date.now(),
      };
      setActiveJob(prev => prev ? { ...prev, ...updatedFieldsForTypeSwitch } : null);
      if (newType === 'text') { setUploadedFiles([]); setOutputText(''); } 
      else { setInputText(''); setOutputText(''); }
    } else { handleNewJob(newType); }
  };

  const ensureActiveJobIsPersisted = () => {
    if (!activeJob) return null;
    let jobToPersist = { ...activeJob };
    jobToPersist.name = jobTitle.trim() || t('translation.new');
    jobToPersist.type = jobType; jobToPersist.sourceLanguage = sourceLang;
    jobToPersist.targetLanguages = [targetLang];
    if (jobType === 'text') jobToPersist.inputText = inputText;
    else jobToPersist.sourceFiles = uploadedFiles;

    if (!jobs.some(j => j.id === jobToPersist.id)) {
        setJobs(prevJobs => [jobToPersist, ...prevJobs].sort((a, b) => b.updatedAt - a.updatedAt));
        setActiveJob(jobToPersist); 
        return jobToPersist;
    }
    return activeJob; 
  };

  const handleSaveDraft = () => {
    if (!activeJob) { toast({ title: t('translation.nothingToSave'), description: t('translation.createOrSelectToSave'), variant: "default" }); return; }
    if (!jobTitle.trim()) { toast({ title: t('translation.jobTitleRequired'), description: t('translation.enterJobTitle'), variant: "destructive" }); return; }
    const jobAfterEnsuringPersistence = ensureActiveJobIsPersisted();
    if (!jobAfterEnsuringPersistence) return;
    const savedJob = persistActiveJobDetails(
        { status: jobAfterEnsuringPersistence.status === 'in-progress' ? 'in-progress' : (jobAfterEnsuringPersistence.status === 'complete' ? 'complete' : 'draft') }
    );
    if (savedJob) { toast({ title: t('translation.jobSaved'), description: translateWithParams(t, 'translation.jobSavedDesc', { jobName: savedJob.name }) }); }
  };
  
  const handleCancelActiveJob = () => {
    if (isFormDirty && activeView === 'jobs') { setShowCancelConfirm(true); } 
    else { performCancelAction(); }
  };

  const performCancelAction = () => {
    const isNewPristineJob = activeJob && activeJob.name === t('translation.new') &&
                             (activeJob.type === 'text' ? !activeJob.inputText : !activeJob.sourceFiles || activeJob.sourceFiles.length === 0) &&
                             !jobs.some(j => j.id === activeJob.id);

    if (isNewPristineJob && activeJob) {
        setJobs(prev => prev.filter(j => j.id !== activeJob.id));
        toast({ title: t('translation.jobCancelled'), description: t('translation.jobCancelledDesc') });
    } else {
        toast({ title: t('translation.changesDiscarded'), description: t('translation.changesDiscardedDesc') });
    }
    resetMainFormToEmpty(true);
    setShowCancelConfirm(false);
  };

  const handleTranslateTextJob = async () => {
    if (!activeJob || jobType !== 'text' || !inputText.trim()) {
        if (!inputText.trim() && jobType === 'text') { toast({ title: t('translation.inputRequired'), description: t('translation.enterTextToTranslate'), variant: "destructive" }); }
        return;
    }
    if (!jobTitle.trim()) { toast({ title: t('translation.jobTitleRequired'), description: t('translation.enterJobTitleBeforeTranslating'), variant: "destructive" }); return; }
    setIsLoading(true); setOutputText(''); 
    const jobWithProgress = ensureActiveJobIsPersisted();
    if(!jobWithProgress) { setIsLoading(false); toast({ title: t('common.error'), description: t('translation.errorStartTranslation'), variant: "destructive" }); return; }
    persistActiveJobDetails({}, 'in-progress');
    try {
      const result = await translateText({
        text: inputText,
        sourceLanguage: sourceLang === 'auto' ? 'English' : supportedLanguages.find(l => l.code === sourceLang)?.name || 'English', 
        targetLanguage: supportedLanguages.find(l => l.code === targetLang)?.name || 'Spanish',
      });
      setOutputText(result.translatedText); 
      persistActiveJobDetails({ outputTextByLanguage: { ...(activeJob?.outputTextByLanguage || {}), [targetLang]: result.translatedText }, }, 'complete');
      toast({ title: t('translation.translationComplete'), description: translateWithParams(t, 'translation.jobFinished', { jobName: jobTitle }) });
    } catch (error) {
      console.error("Translation failed:", error);
      persistActiveJobDetails({ errorMessage: "Translation API call failed." }, 'failed');
      toast({ title: t('translation.translationError'), description: t('translation.couldNotTranslateText'), variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const processSingleFileForJob = async (file: UploadedFile, currentJob: TranslationJob, targetLangCode: string): Promise<UploadedFile> => {
    let currentFileState = { ...file, status: 'processing' as UploadedFile['status'], progress: 10 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    await new Promise(resolve => setTimeout(resolve, 700 + Math.random() * 500)); 
    currentFileState = { ...currentFileState, progress: 30 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800)); 
    currentFileState = { ...currentFileState, progress: 70 };
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    console.log(`Simulating translation for ${file.originalName} to ${targetLangCode}`);
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 1000)); 
    const success = Math.random() > 0.1; 
    if (success) {
      currentFileState = { ...currentFileState, status: 'completed', progress: 100 };
      toast({ title: t('translation.fileProcessed'), description: translateWithParams(t, 'translation.fileTranslationComplete', { fileName: currentFileState.originalName }) });
    } else {
      currentFileState = { ...currentFileState, status: 'failed', progress: 100, error: t('translation.simulatedProcessingFailure') };
      toast({ title: t('translation.fileFailed'), description: translateWithParams(t, 'translation.fileFailedToTranslate', { fileName: currentFileState.originalName }), variant: "destructive" });
    }
    setUploadedFiles(prev => prev.map(f => f.id === currentFileState.id ? currentFileState : f));
    return currentFileState;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; if (!files) return;
    let jobContext = activeJob;
    if (!jobContext) { 
      const newJobTemplate = createNewJobObject('document');
      setActiveJob(newJobTemplate); setJobType('document'); 
      jobContext = newJobTemplate;
    } else if (jobContext.type !== 'document') { 
      setJobType('document'); 
      const updatedFieldsForTypeSwitch: Partial<TranslationJob> = { type: 'document', status: 'draft', inputText: '', sourceFiles: [], outputTextByLanguage: {}, };
      const switchedJob = { ...jobContext, ...updatedFieldsForTypeSwitch };
      setActiveJob(switchedJob); jobContext = switchedJob;
      setInputText(''); setOutputText('');
      toast({ title: t('translation.jobTypeSwitched'), description: t('translation.switchedToDocTranslation')});
    }
    processFiles(Array.from(files), jobContext); 
    if(fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const processFiles = (filesToProcess: File[], currentJobContext: TranslationJob) => {
     let currentSourceFiles = [...(currentJobContext.sourceFiles || [])];
     let currentTotalSize = currentSourceFiles.reduce((acc, f) => acc + f.size, 0);
     const newUploads: UploadedFile[] = [];
    for (const file of filesToProcess) {
      if (currentSourceFiles.length + newUploads.length >= MAX_FILES_PER_JOB) { toast({ title: t('translation.fileLimitReached'), description: translateWithParams(t, 'translation.maxFilesPerJob', { max: MAX_FILES_PER_JOB }), variant: "destructive" }); break; }
      if (!ALLOWED_DOC_EXTENSIONS.some(ext => file.name.toLowerCase().endsWith(ext))) { toast({ title: t('translation.invalidFileType'), description: translateWithParams(t, 'translation.notSupportedDocType', { fileName: file.name }), variant: "destructive" }); continue; }
      if (currentTotalSize + file.size > MAX_TOTAL_UPLOAD_SIZE_BYTES) { toast({ title: t('translation.sizeLimitExceeded'), description: translateWithParams(t, 'translation.totalUploadSizeExceeded', { size: MAX_TOTAL_UPLOAD_SIZE_MB }), variant: "destructive" }); break; }
      newUploads.push({
        id: `file-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`, originalName: file.name, size: file.size, type: file.type,
        progress: 0, status: 'queued', convertToDocx: file.type === 'application/pdf' ? false : undefined,
      });
      currentTotalSize += file.size;
    }
    if (newUploads.length > 0) {
      const updatedSourceFilesList = [...currentSourceFiles, ...newUploads];
      setUploadedFiles(updatedSourceFilesList); 
      setActiveJob(prev => prev ? { ...prev, sourceFiles: updatedSourceFilesList, type: 'document', status: 'draft' } : null);
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
        if (jobType === 'document' && uploadedFiles.every(f => f.status === 'completed' || f.status === 'processing')) { toast({title: t('translation.allFilesProcessed'), description: t('translation.noNewFilesToTranslate'), variant: "default"}); }
        else if (jobType === 'document' && uploadedFiles.length === 0) { toast({title: t('translation.noFilesUploaded'), description: t('translation.pleaseUploadDocs'), variant: "destructive"}); }
        return;
    }
    if (!jobTitle.trim()) { toast({ title: t('translation.jobTitleRequired'), description: t('translation.enterJobTitleBeforeTranslating'), variant: "destructive" }); return; }
    setIsLoading(true);
    const jobForTranslation = ensureActiveJobIsPersisted();
    if (!jobForTranslation) { setIsLoading(false); toast({ title: t('common.error'), description: t('translation.errorStartTranslation'), variant: "destructive" }); return; }
    persistActiveJobDetails({}, 'in-progress');
    let currentSourceFilesState = [...(jobForTranslation.sourceFiles || [])]; 
    let newTranslatedArtifactsForJob: TranslatedFileArtifact[] = jobForTranslation.translatedFilesByLanguage?.[targetLang] || [];
    let allFilesSucceeded = true;
    for (let i = 0; i < currentSourceFilesState.length; i++) {
        let fileToProcess = currentSourceFilesState[i];
        if (fileToProcess.status === 'completed' || fileToProcess.status === 'processing') { continue; }
        const processedFile = await processSingleFileForJob(fileToProcess, jobForTranslation, targetLang);
        currentSourceFilesState = currentSourceFilesState.map(f => f.id === processedFile.id ? processedFile : f);
        if (processedFile.status === 'completed') {
            if (!newTranslatedArtifactsForJob.some(art => art.name.startsWith(`translated_${processedFile.originalName.split('.')[0]}_${targetLang}`))) {
                newTranslatedArtifactsForJob.push({
                    name: `translated_${processedFile.originalName.split('.')[0]}_${targetLang}.${processedFile.convertToDocx && processedFile.type ==='application/pdf' ? 'docx' : processedFile.originalName.split('.').pop() || 'txt'}`,
                    url: '#simulated-download', format: processedFile.convertToDocx && processedFile.type ==='application/pdf' ? 'docx' : processedFile.originalName.split('.').pop() || 'txt'
                });
            }
        } else if (processedFile.status === 'failed') { allFilesSucceeded = false; }
        const updatedJob = persistActiveJobDetails({ sourceFiles: [...currentSourceFilesState], translatedFilesByLanguage: { ...(activeJob?.translatedFilesByLanguage || {}), [targetLang]: newTranslatedArtifactsForJob } }, 'in-progress'); 
        if(!updatedJob) break; 
    }
    const finalStatus = allFilesSucceeded && currentSourceFilesState.every(f => f.status === 'completed') ? 'complete' : (currentSourceFilesState.some(f=> f.status === 'failed') ? 'failed' : 'in-progress');
    persistActiveJobDetails({ status: finalStatus }); 
    if (finalStatus === 'complete') { toast({ title: t('translation.docJobComplete'), description: translateWithParams(t, 'translation.jobFinishedProcessing', { jobName: jobTitle }) }); }
    else if (finalStatus === 'failed') { toast({ title: t('translation.docJobIssues'), description: translateWithParams(t, 'translation.jobCompletedWithErrors', { jobName: jobTitle }), variant: "destructive" }); }
    else if (finalStatus === 'in-progress' && !currentSourceFilesState.some(f => f.status === 'processing' || f.status === 'queued')) { toast({ title: t('translation.jobUpdate'), description: translateWithParams(t, 'translation.jobStatusUpdated', { jobName: jobTitle })}); }
    setIsLoading(false);
  };

  const handleSelectedTranslatedFileToggle = (fileName: string) => { setSelectedTranslatedFiles(prev => ({...prev, [fileName]: !prev[fileName]})); };
  const handleDownloadSelected = () => {
    const filesToDownload = Object.entries(selectedTranslatedFiles).filter(([_,isSelected]) => isSelected).map(([fileName,_]) => fileName);
    if (filesToDownload.length === 0) { toast({title: t('translation.noFilesSelected'), description: t('translation.pleaseSelectFilesToDownload'), variant: "destructive"}); return; }
    toast({title: t('translation.downloadSelectedSimulated'), description: translateWithParams(t, 'translation.simulatingDownloadOf', { files: filesToDownload.join(', ') })});
  };
  const handleDownloadAllZip = () => {
    if (!activeJob || !activeJob.translatedFilesByLanguage?.[targetLang] || activeJob.translatedFilesByLanguage[targetLang].length === 0) { toast({title: t('translation.noTranslatedFiles'), description: t('translation.noTranslatedFilesToDownload'), variant: "destructive"}); return; }
    toast({title: t('translation.downloadAllZipSimulated'), description: translateWithParams(t, 'translation.simulatingZipDownload', { count: activeJob.translatedFilesByLanguage[targetLang].length })});
  };

  const filteredJobs = jobs.filter(job => {
    const nameMatch = historySearchTerm === '' || job.name.toLowerCase().includes(historySearchTerm.toLowerCase());
    const typeMatch = historyFilterType === 'all' || job.type === historyFilterType;
    const statusMatch = historyFilterStatus.length === 0 || historyFilterStatus.includes(job.status);
    const archiveMatch = showArchived ? true : job.status !== 'archived'; 
    return nameMatch && typeMatch && statusMatch && archiveMatch;
  });

  const toggleHistoryFilterStatus = (status: TranslationJobStatus) => { setHistoryFilterStatus(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]); };
  
  const requestDeleteJob = (jobId: string) => { setJobIdPendingDeletion(jobId); setShowDeleteJobConfirmModal(true); };
  const confirmDeleteJob = () => {
    if (!jobIdPendingDeletion) return;
    setJobs(prev => prev.filter(j => j.id !== jobIdPendingDeletion));
    if (activeJob?.id === jobIdPendingDeletion) { resetMainFormToEmpty(true); }
    toast({ title: t('translation.jobDeleted') });
    setShowDeleteJobConfirmModal(false); setJobIdPendingDeletion(null);
  };

  const handleArchiveJob = (jobId: string) => {
     const jobToUpdate = jobs.find(j => j.id === jobId);
     if (jobToUpdate) {
        const newStatus = jobToUpdate.status === 'archived' ? 'draft' : 'archived'; 
        const updatedJobData: Partial<TranslationJob> = {status: newStatus as TranslationJobStatus, updatedAt: Date.now()};
        setJobs(prev => prev.map(j => j.id === jobId ? {...j, ...updatedJobData} : j).sort((a,b) => b.updatedAt - a.updatedAt));
        if (activeJob?.id === jobId) {
             const reloadedJob = {...activeJob, ...updatedJobData };
             setActiveJob(reloadedJob); 
             if (newStatus === 'archived' && !showArchived) { resetMainFormToEmpty(true); } 
             else { loadJobToForm(reloadedJob); }
        }
        toast({ title: jobToUpdate.status === 'archived' ? t('translation.jobUnarchived') : t('translation.jobArchived') });
     }
  };

  const handleCopy = (text: string) => { if (!text) return; navigator.clipboard.writeText(text); toast({ title: t('translation.copiedToClipboard') }); };
  const handleTTS = (text: string) => { if(!text) return; if (isSpeaking) cancel(); else speak(text); };
  const getLanguageName = (code: string) => supportedLanguages.find(l => l.code === code)?.name || code;
  const hasAnyPdfFileInUploads = uploadedFiles.some(file => file.type === 'application/pdf');

  // User Feedback Form Logic
  const handleFeedbackFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FEEDBACK_FILE_SIZE_BYTES) {
        toast({ title: t('translation.feedback.errorFileTooLarge'), variant: "destructive" });
        setFeedbackFile(null); setFeedbackFileName('');
        return;
      }
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !ALLOWED_FEEDBACK_FILE_EXTENSIONS.includes(`.${fileExtension}`)) {
        toast({ title: t('translation.feedback.errorInvalidFileType'), variant: "destructive" });
        setFeedbackFile(null); setFeedbackFileName('');
        return;
      }
      setFeedbackFile(file);
      setFeedbackFileName(file.name);
    }
     if (feedbackFileInputRef.current) feedbackFileInputRef.current.value = "";
  };

  const downloadFeedbackTemplate = () => {
    toast({ title: "Simulated Download", description: "Feedback template download started (simulated)." });
  };

  const handleFeedbackSubmit = async () => {
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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const newFeedbackEntry: UserFeedbackEntry = {
      id: `feedback-${Date.now()}`,
      sourceLanguage: feedbackSourceLang,
      targetLanguage: feedbackTargetLang,
      isBulk: feedbackBulkMode,
      createdAt: Date.now(),
      ...(feedbackBulkMode ? { fileName: feedbackFile?.name || 'N/A' } : { sourceKeyword: feedbackSourceKeyword, targetKeyword: feedbackTargetKeyword }),
    };

    setUserFeedbackItems(prev => [newFeedbackEntry, ...prev].sort((a, b) => b.createdAt - a.createdAt));
    toast({ title: t('translation.feedback.feedbackAddedSuccess') });

    // Reset form
    setFeedbackSourceLang(''); setFeedbackTargetLang('');
    setFeedbackSourceKeyword(''); setFeedbackTargetKeyword('');
    setFeedbackBulkMode(false); setFeedbackFile(null); setFeedbackFileName('');
    setIsSubmittingFeedback(false);
  };
  
  const requestDeleteFeedback = (id: string) => { setFeedbackIdToDelete(id); setShowDeleteFeedbackConfirm(true); };
  const confirmDeleteFeedback = () => {
    if (!feedbackIdToDelete) return;
    setUserFeedbackItems(prev => prev.filter(item => item.id !== feedbackIdToDelete));
    toast({ title: t('translation.feedback.feedbackDeleted') });
    setShowDeleteFeedbackConfirm(false); setFeedbackIdToDelete(null);
  };

  const filteredFeedbackItems = userFeedbackItems.filter(item => {
    if (feedbackSearchTerm === '') return true;
    const searchTermLower = feedbackSearchTerm.toLowerCase();
    return (item.sourceKeyword?.toLowerCase().includes(searchTermLower) ||
            item.targetKeyword?.toLowerCase().includes(searchTermLower) ||
            item.fileName?.toLowerCase().includes(searchTermLower) ||
            getLanguageName(item.sourceLanguage).toLowerCase().includes(searchTermLower) ||
            getLanguageName(item.targetLanguage).toLowerCase().includes(searchTermLower) );
  });

  useEffect(() => { if (activeJob) { loadJobToForm(activeJob); } else { resetMainFormToEmpty(); } }, [activeJob?.id]);

  const renderTranslationJobPanel = () => (
    <Card className="flex-1 shadow-xl flex flex-col overflow-hidden min-h-[400px]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl md:text-2xl">
              {activeJob ? (activeJob.name === t('translation.new') && activeJob.status === 'draft' && !jobs.some(j => j.id === activeJob.id) ? t('translation.new') : t('translation.edit')) : t('translation.new')}
            </CardTitle>
            {activeJob && <JobStatusBadge status={activeJob.status} />}
          </div>
            {activeJob && <CardDescription className="text-xs md:text-sm">ID: {activeJob.id.substring(0,12)}...</CardDescription>}
        </CardHeader>
        <ScrollArea className="flex-grow p-2 md:p-4 relative">
          <div className="space-y-4 h-full">
          {!activeJob ? (
            <div className="flex flex-col items-center justify-center absolute inset-0 text-center p-0 md:p-8">
              <div className="bg-card/50 rounded-lg border border-border p-4 shadow-sm w-full max-w-[85%]">
                <div className="flex flex-col items-center justify-center py-6">
                  <LanguagesIcon className="w-10 h-10 md:w-16 md:h-16 text-primary opacity-50" />
                  <h3 className="text-base md:text-xl font-medium mt-4 mb-2">{t('translation.noActiveJob')}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-4 max-w-[200px] mx-auto">{t('translation.createNew')}</p>
                  <Button onClick={()=>handleNewJob()} size="sm" className="w-full md:w-auto md:px-6">
                    <PlusCircle className="mr-2 h-4 w-4" /> {t('translation.createNewButton')}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <Label htmlFor="jobTitle">{t('translation.jobTitle')} <span className="text-destructive">*</span></Label>
                <Input id="jobTitle" placeholder={t('translation.enterJobTitle')} value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value.slice(0, MAX_JOB_TITLE_LENGTH))}
                  maxLength={MAX_JOB_TITLE_LENGTH} disabled={isLoading || activeJob?.status === 'in-progress'}/>
                <p className="text-xs text-muted-foreground text-right">{jobTitle.length}/{MAX_JOB_TITLE_LENGTH}</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label>{t('translation.jobType')}</Label>
                  <Select value={jobType} onValueChange={(v) => handleJobTypeChange(v as TranslationJobType)} disabled={isLoading || activeJob?.status === 'in-progress'}>
                    <SelectTrigger><SelectValue placeholder={t('translation.selectJobType')} /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">{t('translation.textTranslation')}</SelectItem>
                      <SelectItem value="document">{t('translation.documentTranslation')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                  <div className="space-y-1">
                    <Label>{t('translation.sourceLanguage')}</Label>
                    <Select value={sourceLang} onValueChange={setSourceLang} disabled={isLoading || activeJob?.status === 'in-progress'}>
                      <SelectTrigger><SelectValue placeholder={t('translation.selectSourceLanguage')} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">{t('translation.autoDetect')}</SelectItem>
                        {supportedLanguages.map(l => <SelectItem key={l.code} value={l.code}>{t(`languages.${l.code}`)}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
              </div>
              <div className="space-y-1">
                  <Label>{t('translation.targetLanguage')}</Label>
                  <Select value={targetLang} onValueChange={setTargetLang} disabled={isLoading || activeJob?.status === 'in-progress'}>
                    <SelectTrigger><SelectValue placeholder={t('translation.selectTargetLanguage')} /></SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map(l => <SelectItem key={l.code} value={l.code} disabled={l.code === sourceLang && sourceLang !== 'auto'}>{t(`languages.${l.code}`)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              {jobType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <Textarea placeholder={t('translation.enterTextToTranslate')} value={inputText}
                      onChange={(e) => setInputText(e.target.value.slice(0, MAX_TEXT_INPUT_LENGTH))}
                      className="min-h-[150px] bg-input focus-visible:ring-1 focus-visible:ring-ring" rows={6}
                      maxLength={MAX_TEXT_INPUT_LENGTH} disabled={isLoading || activeJob?.status === 'in-progress'} />
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">{inputText.length}/{MAX_TEXT_INPUT_LENGTH} {t('translation.characters')}</p>
                        <div>
                          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleCopy(inputText)} disabled={!inputText}><Copy size={16}/></Button></TooltipTrigger><TooltipContent>{t('translation.copyText')}</TooltipContent></Tooltip>
                          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleTTS(inputText)} disabled={!inputText}>{isSpeaking ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}</Button></TooltipTrigger><TooltipContent>{t('translation.speakText')}</TooltipContent></Tooltip>
                        </div>
                      </div>
                  </div>
                  <div>
                    <Textarea placeholder={t('translation.translationWillAppear')} value={outputText} readOnly className="min-h-[150px] bg-muted text-muted-foreground" rows={6}/>
                    <div className="flex justify-end items-center mt-1">
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleCopy(outputText)} disabled={!outputText}><Copy size={16}/></Button></TooltipTrigger><TooltipContent>{t('translation.copyTranslation')}</TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" onClick={() => handleTTS(outputText)} disabled={!outputText}>{isSpeaking ? <Volume2 size={16} className="text-secondary-gradient"/> : <Volume2 size={16}/>}</Button></TooltipTrigger><TooltipContent>{t('translation.speakTranslation')}</TooltipContent></Tooltip>
                    </div>
                  </div>
                </div>
              )}
              {jobType === 'document' && (
                <div className="space-y-4">
                  <Card className="border-dashed border-2 hover:border-primary transition-colors">
                    <CardContent className="p-4 md:p-6 text-center">
                      <FileUp className="mx-auto h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-2" />
                      <p className="mb-2 text-xs md:text-sm text-muted-foreground">{t('translation.dragDropOrBrowse')}</p>
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading || activeJob?.status === 'in-progress'}>{t('translation.browseFiles')}</Button>
                      <input type="file" ref={fileInputRef} multiple onChange={handleFileSelect} className="hidden" accept={ALLOWED_DOC_EXTENSIONS.join(',')} />
                      <p className="mt-2 text-xs text-muted-foreground">{translateWithParams(t, 'translation.maxFiles', { max: MAX_FILES_PER_JOB, size: MAX_TOTAL_UPLOAD_SIZE_MB })}</p>
                    </CardContent>
                  </Card>
                  {uploadedFiles.length > 0 && (
                    <ScrollArea className="max-h-60 border rounded-md p-2">
                      <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium">{translateWithParams(t, 'translation.selectedFiles', { count: uploadedFiles.length, max: MAX_FILES_PER_JOB })}</p>
                          {hasAnyPdfFileInUploads && <p className="text-xs text-muted-foreground">{t('translation.togglePdfDocx')}</p>}
                      </div>
                      <ul className="space-y-2">
                        {uploadedFiles.map(file => (
                          <li key={file.id} className="flex items-center justify-between gap-2 p-2 rounded bg-muted/50 text-sm">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <FileText size={18} className="text-primary shrink-0" />
                              <Tooltip><TooltipTrigger asChild><span className="truncate flex-1 min-w-0" title={file.originalName}>{file.originalName}</span></TooltipTrigger><TooltipContent><p>{file.originalName}</p></TooltipContent></Tooltip>
                              <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            <div className='flex items-center gap-1 shrink-0'>
                              {file.status === 'processing' && file.progress != null && (<div className="w-20 flex items-center gap-1"><Progress value={file.progress} className="h-1.5 flex-1" /><span className='text-xs'>{file.progress}%</span></div>)}
                              {file.status === 'completed' && <CheckCircleIcon size={16} className="text-accent-success shrink-0" />}
                              {file.status === 'failed' && <Tooltip><TooltipTrigger asChild><XCircleIcon size={16} className="text-destructive shrink-0 cursor-default" /></TooltipTrigger><TooltipContent><p>{t('common.failed')}: {file.error || t('common.unknownError')}</p></TooltipContent></Tooltip>}
                              {hasAnyPdfFileInUploads && file.type === 'application/pdf' ? (<Tooltip><TooltipTrigger asChild><Button variant={file.convertToDocx ? "secondary" : "outline"} size="sm" className="h-7 px-2 text-xs" onClick={() => togglePdfToDocx(file.id)} disabled={isLoading || activeJob?.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}><FileSliders size={14} className="mr-1"/> DOCX</Button></TooltipTrigger><TooltipContent><p>{t('translation.pdfToDocxTooltip')}</p></TooltipContent></Tooltip>) : (hasAnyPdfFileInUploads && <div className="w-[78px] h-7"></div> )}
                              <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeUploadedFile(file.id)} disabled={isLoading || activeJob?.status === 'in-progress' || file.status === 'processing' || file.status === 'completed'}><XCircleIcon size={16} /></Button></TooltipTrigger><TooltipContent>{t('translation.removeFile')}</TooltipContent></Tooltip>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  )}
                  {activeJob?.status === 'complete' && activeJob.translatedFilesByLanguage?.[targetLang] && activeJob.translatedFilesByLanguage[targetLang].length > 0 && (
                      <div>
                      <h4 className="text-md font-semibold mb-2 mt-4">{translateWithParams(t, 'translation.translatedDocuments', { language: getLanguageName(targetLang) })}</h4>
                        <ScrollArea className="max-h-48 border rounded-md p-2">
                          <ul className="space-y-2">
                          {(activeJob.translatedFilesByLanguage[targetLang] || []).map(artifact => (
                              <li key={artifact.name} className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm gap-2">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <Checkbox id={`cb-${artifact.name}`} checked={!!selectedTranslatedFiles[artifact.name]} onCheckedChange={() => handleSelectedTranslatedFileToggle(artifact.name)} className="mr-1 shrink-0"/>
                                    <FileText size={18} className="text-accent-success shrink-0" />
                                    <Tooltip><TooltipTrigger asChild><span className="truncate flex-1 min-w-0" title={artifact.name}>{artifact.name}</span></TooltipTrigger><TooltipContent><p>{artifact.name}</p></TooltipContent></Tooltip>
                                </div>
                                <Button variant="outline" size="sm" className="h-7 text-xs shrink-0" onClick={() => toast({title: t('translation.downloadSimulated'), description: translateWithParams(t, 'translation.wouldDownload', { fileName: artifact.name })})}><Download size={14} className="mr-1"/> {t('translation.download')}</Button>
                              </li>
                          ))}
                          </ul>
                        </ScrollArea>
                        <div className="flex flex-col sm:flex-row gap-2 mt-2 justify-end">
                          <Button variant="outline" size="sm" onClick={handleDownloadSelected} disabled={Object.values(selectedTranslatedFiles).every(v => !v)}><Download className="mr-2 h-4 w-4" /> {t('translation.downloadSelected')}</Button>
                          <Button variant="outline" size="sm" onClick={handleDownloadAllZip}><Archive className="mr-2 h-4 w-4" /> {t('translation.downloadAllZip')}</Button>
                        </div>
                      </div>
                  )}
                  {activeJob?.status === 'failed' && (activeJob.errorMessage || uploadedFiles.some(f => f.status === 'failed')) && (
                      <Card className="mt-2 border-destructive bg-destructive/10">
                          <CardHeader className="p-3"><div className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /><CardTitle className="text-base">{t('translation.translationIssues')}</CardTitle></div></CardHeader>
                          <CardContent className="p-3 pt-0 text-sm text-destructive">
                              {activeJob.errorMessage && <p>{activeJob.errorMessage}</p>}
                              {uploadedFiles.filter(f => f.status === 'failed').map(f => (<p key={f.id} className="mt-1">{t('translation.fileError', { fileName: f.originalName, error: (f.error || t('translation.processingFailed')) })}</p>))}
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
          <CardFooter className="border-t p-3 md:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="w-full sm:w-auto">
              {activeJob.status !== 'in-progress' && (<Button variant="destructive" onClick={() => requestDeleteJob(activeJob.id)} disabled={isLoading} size="sm" className="mr-2 w-full sm:w-auto"><Trash2 className="mr-2 h-4 w-4" /> {t('translation.deleteJob')}</Button>)}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {activeJob.status !== 'in-progress' && (<Button variant="outline" onClick={handleCancelActiveJob} disabled={isLoading} size="sm" className="flex-1 sm:flex-none"><XCircleIcon className="mr-2 h-4 w-4" /> {t('translation.cancel')}</Button>)}
              {activeJob.status !== 'in-progress' && (<Button variant="outline" onClick={handleSaveDraft} disabled={isLoading || !jobTitle.trim() || (!isFormDirty && activeJob.status !== 'complete' && activeJob.status !== 'archived' && activeJob.status !== 'failed')} size="sm" className="flex-1 sm:flex-none"><Save className="mr-2 h-4 w-4" /> { (activeJob.status === 'complete' || activeJob.status === 'archived' || activeJob.status === 'failed') && isFormDirty ? t('translation.save') : (activeJob.status === 'complete' || activeJob.status === 'archived' || activeJob.status === 'failed') && !isFormDirty ? t('translation.saved') : t('translation.save') }</Button>)}
              {(activeJob.status === 'draft' || activeJob.status === 'failed') && (<Button onClick={jobType === 'text' ? handleTranslateTextJob : handleTranslateDocumentJob} disabled={isLoading || (jobType === 'text' && !inputText.trim()) || (jobType === 'document' && uploadedFiles.filter(f => f.status === 'queued' || f.status === 'failed').length === 0 && !uploadedFiles.some(f => f.status === 'processing')) || !jobTitle.trim()} className="bg-primary-gradient text-primary-foreground hover:opacity-90 flex-1 sm:flex-none" size="sm">{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />} {t('translation.translate')}</Button>)}
              {activeJob.status === 'in-progress' && <Button disabled variant="secondary" size="sm" className="w-full sm:w-auto"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('translation.translating')}</Button>}
              {activeJob.status === 'complete' && (<Button variant="default" disabled className="bg-accent-success hover:bg-accent-success/90 w-full sm:w-auto" size="sm"><CheckSquare className="mr-2 h-4 w-4" /> {t('translation.completed')}</Button>)}
            </div>
          </CardFooter>
        )}
    </Card>
  );

  const renderUserFeedbackPanel = () => (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <MessageSquareText size={24} className="text-primary" />
            <CardTitle className="text-xl">{t('translation.feedback.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
            <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-md mb-4 border border-border">
                <Info size={20} className="text-muted-foreground mt-1 shrink-0" />
                <div>
                    <h4 className="font-medium text-sm">{t('translation.feedback.instructionsTitle')}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{t('translation.feedback.instructionsBody')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('translation.feedback.supportedFormats')}</p>
                </div>
            </div>

            <div className="border-t border-border pt-4 mb-4">
                {/* Placeholder for top "Submit Feedback" and "View Glossary" buttons if strictly following image - or combine logic */}
                {/* <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm"><MessageSquareText size={16} className="mr-2"/>{t('translation.feedback.topSubmitFeedback')}</Button>
                    <Button variant="outline" size="sm" disabled><ListFilter size={16} className="mr-2"/>{t('translation.feedback.viewGlossary')}</Button>
                </div>
                <div className="border-b border-border mb-4 -mx-6"></div> */}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
                <PlusCircle size={20} className="text-primary"/>
                <h3 className="text-lg font-semibold">{t('translation.feedback.addFeedbackTitle')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">{t('translation.feedback.addFeedbackDescription')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                    <Label htmlFor="feedbackSourceLang">{t('translation.sourceLanguage')}</Label>
                    <Select value={feedbackSourceLang} onValueChange={setFeedbackSourceLang} disabled={isSubmittingFeedback}>
                        <SelectTrigger id="feedbackSourceLang"><SelectValue placeholder={t('translation.selectSourceLanguage')} /></SelectTrigger>
                        <SelectContent>{supportedLanguages.map(l => <SelectItem key={`fb-src-${l.code}`} value={l.code}>{t(`languages.${l.code}`)}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="feedbackTargetLang">{t('translation.targetLanguage')}</Label>
                    <Select value={feedbackTargetLang} onValueChange={setFeedbackTargetLang} disabled={isSubmittingFeedback}>
                        <SelectTrigger id="feedbackTargetLang"><SelectValue placeholder={t('translation.selectTargetLanguage')} /></SelectTrigger>
                        <SelectContent>{supportedLanguages.map(l => <SelectItem key={`fb-tgt-${l.code}`} value={l.code} disabled={l.code === feedbackSourceLang && feedbackSourceLang !== ''}>{t(`languages.${l.code}`)}</SelectItem>)}</SelectContent>
                    </Select>
                </div>
            </div>

            {!feedbackBulkMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="p-3 border-b"><Label htmlFor="sourceKeyword" className="text-sm">{t('translation.sourceLanguage')} {t('translation.feedback.keywords')}</Label></CardHeader>
                  <CardContent className="p-0"><Textarea id="sourceKeyword" placeholder={t('translation.feedback.sourceKeywordPlaceholder')} value={feedbackSourceKeyword} onChange={(e) => setFeedbackSourceKeyword(e.target.value)} className="min-h-[100px] border-0 rounded-t-none focus-visible:ring-0 resize-none" disabled={isSubmittingFeedback}/></CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-3 border-b"><Label htmlFor="targetKeyword" className="text-sm">{t('translation.targetLanguage')} {t('translation.feedback.keywords')}</Label></CardHeader>
                  <CardContent className="p-0"><Textarea id="targetKeyword" placeholder={t('translation.feedback.targetKeywordPlaceholder')} value={feedbackTargetKeyword} onChange={(e) => setFeedbackTargetKeyword(e.target.value)} className="min-h-[100px] border-0 rounded-t-none focus-visible:ring-0 resize-none" disabled={isSubmittingFeedback}/></CardContent>
                </Card>
              </div>
            )}
            
            <Card className="p-4 mb-6 bg-muted/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Upload size={20} className="text-primary"/>
                        <div>
                            <Label htmlFor="bulk-upload-switch" className="font-medium">{t('translation.feedback.bulkUploadLabel')}</Label>
                            <p className="text-xs text-muted-foreground">{t('translation.feedback.bulkUploadDescription')}</p>
                        </div>
                    </div>
                    <Switch id="bulk-upload-switch" checked={feedbackBulkMode} onCheckedChange={setFeedbackBulkMode} disabled={isSubmittingFeedback} />
                </div>
                {feedbackBulkMode && (
                    <Button variant="link" size="sm" onClick={downloadFeedbackTemplate} className="mt-2 p-0 h-auto text-xs" disabled={isSubmittingFeedback}>
                        <Download size={14} className="mr-1"/>{t('translation.feedback.downloadTemplate')}
                    </Button>
                )}
            </Card>

            {feedbackBulkMode && (
                <div className="mb-6">
                    <div onClick={() => feedbackFileInputRef.current?.click()} className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-muted-foreground/50 rounded-lg cursor-pointer bg-card hover:bg-muted/50 transition-colors">
                        <UploadCloud size={40} className="text-muted-foreground mb-3" />
                        <p className="mb-2 text-sm text-muted-foreground">{t('translation.feedback.dragDropOrBrowse')}</p>
                        <Button type="button" variant="outline" size="sm" className="pointer-events-none">{t('translation.feedback.chooseFile')}</Button>
                        <input ref={feedbackFileInputRef} type="file" className="hidden" onChange={handleFeedbackFileChange} accept={ALLOWED_FEEDBACK_FILE_EXTENSIONS.join(',')} disabled={isSubmittingFeedback} />
                    </div>
                    {feedbackFileName && <p className="text-sm text-muted-foreground mt-2">{t('translation.feedback.fileSelected', { fileName: feedbackFileName })}</p>}
                </div>
            )}

            <Button onClick={handleFeedbackSubmit} className="w-full bg-primary-gradient text-primary-foreground hover:opacity-90" disabled={isSubmittingFeedback || (!feedbackSourceLang || !feedbackTargetLang) || (feedbackBulkMode && !feedbackFile) || (!feedbackBulkMode && (!feedbackSourceKeyword.trim() || !feedbackTargetKeyword.trim()))}>
                {isSubmittingFeedback ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircleIcon size={18} className="mr-2"/>}
                {t('translation.feedback.submitFeedback')}
            </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="flex flex-col md:flex-row h-auto min-h-[calc(100vh-var(--header-height,4rem)-2rem)] md:h-[calc(100vh-var(--header-height,4rem)-2rem)] gap-4 p-1">
        
        {/* Main Content Panel (Translation Job or Feedback Form) */}
        {activeView === 'jobs' ? renderTranslationJobPanel() : renderUserFeedbackPanel()}

        {/* Right Sidebar Panel (Job History or Feedback History) */}
        <Card className="w-full md:w-2/5 shadow-xl flex flex-col overflow-hidden min-h-[400px] md:max-h-[calc(100vh-var(--header-height,4rem)-2rem-0.5rem)]"> {/* Adjusted max-h */}
          <CardHeader className="border-b p-3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{t('translation.workspace')}</h2>
              <Button size="sm" onClick={() => activeView === 'jobs' ? handleNewJob() : { /* TODO: New Feedback action? */ }}>
                <PlusCircle className="h-4 w-4 mr-2" />
                {activeView === 'jobs' ? t('translation.newJob') : t('translation.feedback.newFeedbackAction')}
              </Button>
            </div>
            <div className="bg-muted p-1 rounded-lg border shadow-sm">
              <div className="grid grid-cols-2 gap-1">
                <Button variant={activeView === 'jobs' ? 'default' : 'ghost'} onClick={() => setActiveView('jobs')} className={cn("flex-1 h-9 text-xs gap-1.5 justify-center", activeView === 'jobs' && "bg-primary-gradient text-primary-foreground")}>
                  <ListFilter size={14}/> {t('translation.jobHistory')} {jobs.length > 0 && <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">{jobs.length}</Badge>}
                </Button>
                <Button variant={activeView === 'feedback' ? 'default' : 'ghost'} onClick={() => setActiveView('feedback')} className={cn("flex-1 h-9 text-xs gap-1.5 justify-center", activeView === 'feedback' && "bg-primary-gradient text-primary-foreground")}>
                  <MessageSquareText size={14}/> {t('translation.feedback.tabLabel')} {userFeedbackItems.length > 0 && <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">{userFeedbackItems.length}</Badge>}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {activeView === 'jobs' && (
            <>
              <CardContent className="pt-3 px-3 md:px-4 pb-3 md:pb-4">
                <div className="space-y-3 md:space-y-4">
                  <div className="relative">
                    <Input placeholder={t('translation.searchJobs')} value={historySearchTerm} onChange={(e) => setHistorySearchTerm(e.target.value)} className="h-9 md:h-10 w-full" prependIcon={<Search size={16} className="text-muted-foreground" />}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="w-full">
                      <Select value={historyFilterType} onValueChange={(v) => setHistoryFilterType(v as 'all' | TranslationJobType)}>
                        <SelectTrigger className="h-9 md:h-10 w-full"><SelectValue placeholder={t('translation.allTypes')} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t('translation.allTypes')}</SelectItem>
                          <SelectItem value="text">{t('translation.textJobs')}</SelectItem>
                          <SelectItem value="document">{t('translation.documentJobs')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-9 md:h-10 flex-1"><ListFilter className="mr-2 h-4 w-4" /> <span className="whitespace-nowrap">{t('translation.status')}</span> {historyFilterStatus.length > 0 && <Badge variant="secondary" className="ml-2">{historyFilterStatus.length}</Badge>}</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>{t('translation.filterByStatus')}</DropdownMenuLabel><DropdownMenuSeparator />
                          {(['draft', 'in-progress', 'complete', 'failed', 'archived'] as TranslationJobStatus[]).map(status => (<DropdownMenuCheckboxItem key={status} checked={historyFilterStatus.includes(status)} onCheckedChange={() => toggleHistoryFilterStatus(status)} className="capitalize">{t(`translation.statusEnum.${status}` as any) || status.replace('-', ' ')}</DropdownMenuCheckboxItem>))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant={showArchived ? "secondary" : "outline"} size="icon" className="h-9 md:h-10 w-10 shrink-0" onClick={() => setShowArchived(!showArchived)} title={t('translation.showHideArchived')}><Archive size={16} /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <ScrollArea className="flex-grow p-2">
                {filteredJobs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-6 px-3"><div className="bg-muted/30 p-3 rounded-full mx-auto mb-3 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center"><Info className="h-5 w-5 md:h-6 md:w-6 opacity-70" /></div><h3 className="text-sm md:text-base font-medium mb-1">{t('translation.noJobsMatch')}</h3><p className="text-xs opacity-70 max-w-[180px] mx-auto">{t('translation.adjustFilters')}</p></div>
                ) : (
                  <div className="space-y-3 px-1 md:px-2">
                    {filteredJobs.map(job => (
                      <Card key={job.id} className={cn("hover:shadow-md transition-shadow cursor-pointer border", activeJob?.id === job.id ? "ring-2 ring-primary border-primary" : "border-border")} onClick={() => handleSelectJobFromHistory(job.id)}>
                        <CardContent className="p-2 md:p-3">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-grow min-w-0"><p className="font-semibold truncate text-sm md:text-base" title={job.name}>{job.name}</p><div className="flex items-center text-xs text-muted-foreground mt-1"><span className="capitalize">{t(`translation.jobTypeEnum.${job.type}` as any) || job.type}</span><span className="mx-2">•</span><Clock size={12} className="mr-1" /> {format(new Date(job.updatedAt), "MMM d, HH:mm")}</div></div>
                            <JobStatusBadge status={job.status} />
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button variant="ghost" size="icon" className={cn("h-8 w-8", job.status === 'archived' ? "text-primary" : "text-muted-foreground hover:text-primary")} onClick={(e) => { e.stopPropagation(); handleArchiveJob(job.id); }} title={job.status === 'archived' ? t('translation.unarchive') : t('translation.archive')}><Archive size={14} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={(e) => {e.stopPropagation(); requestDeleteJob(job.id);}} title={t('actions.delete')}><Trash2 size={14} /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}
          {activeView === 'feedback' && (
             <>
                <CardContent className="pt-3 px-3 md:px-4 pb-3 md:pb-4">
                    <Input placeholder={t('translation.feedback.searchFeedback')} value={feedbackSearchTerm} onChange={(e) => setFeedbackSearchTerm(e.target.value)} className="h-9 md:h-10 w-full" prependIcon={<Search size={16} className="text-muted-foreground" />}/>
                </CardContent>
                <ScrollArea className="flex-grow p-2">
                    {filteredFeedbackItems.length === 0 ? (
                        <div className="text-center text-muted-foreground py-6 px-3"><div className="bg-muted/30 p-3 rounded-full mx-auto mb-3 w-10 h-10 md:w-14 md:h-14 flex items-center justify-center"><Info className="h-5 w-5 md:h-6 md:w-6 opacity-70" /></div><h3 className="text-sm md:text-base font-medium mb-1">{t('translation.feedback.noFeedback')}</h3></div>
                    ) : (
                        <div className="space-y-3 px-1 md:px-2">
                            {filteredFeedbackItems.map(item => (
                                <Card key={item.id} className="border-border">
                                    <CardContent className="p-2 md:p-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-grow min-w-0">
                                                {item.isBulk ? (
                                                    <p className="font-semibold truncate text-sm" title={item.fileName}>{t('translation.feedback.bulkFile')}: {item.fileName}</p>
                                                ) : (
                                                    <p className="font-semibold truncate text-sm" title={`${item.sourceKeyword} -> ${item.targetKeyword}`}>{item.sourceKeyword} <ArrowRightLeft size={12} className="inline mx-1"/> {item.targetKeyword}</p>
                                                )}
                                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                                    <span>{t(`languages.${item.sourceLanguage}`)} <ArrowRightLeft size={10} className="inline mx-0.5"/> {t(`languages.${item.targetLanguage}`)}</span>
                                                    <span className="mx-2">•</span>
                                                    <Clock size={12} className="mr-1" /> {format(new Date(item.createdAt), "MMM d, HH:mm")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => requestDeleteFeedback(item.id)} title={t('actions.delete')}><Trash2 size={14} /></Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </ScrollArea>
             </>
          )}
        </Card>
      </div>

      <AlertDialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
        <AlertDialogContent className="max-w-[90vw] md:max-w-md">
          <AlertDialogHeader><AlertDialogTitle>{t('translation.discardChanges')}</AlertDialogTitle><AlertDialogDescription>{t('translation.unsavedChangesDesc')}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2"><AlertDialogCancel onClick={() => setShowCancelConfirm(false)}>{t('translation.keepEditing')}</AlertDialogCancel><AlertDialogAction onClick={performCancelAction} className={buttonVariants({variant: "destructive"})}>{t('translation.discardAndReset')}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteJobConfirmModal} onOpenChange={setShowDeleteJobConfirmModal}>
        <AlertDialogContent className="max-w-[90vw] md:max-w-md">
          <AlertDialogHeader><AlertDialogTitle>{t('translation.deleteJobConfirm')}</AlertDialogTitle><AlertDialogDescription>{translateWithParams(t, 'translation.deleteJobDesc', { jobName: jobs.find(j => j.id === jobIdPendingDeletion)?.name || t('translation.thisJob') })}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2"><AlertDialogCancel onClick={() => {setShowDeleteJobConfirmModal(false); setJobIdPendingDeletion(null);}}>{t('actions.cancel')}</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteJob} className={buttonVariants({variant: "destructive"})}>{t('actions.delete')}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteFeedbackConfirm} onOpenChange={setShowDeleteFeedbackConfirm}>
        <AlertDialogContent className="max-w-[90vw] md:max-w-md">
          <AlertDialogHeader><AlertDialogTitle>{t('translation.feedback.deleteFeedbackConfirmTitle')}</AlertDialogTitle><AlertDialogDescription>{t('translation.feedback.deleteFeedbackConfirmDesc')}</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2"><AlertDialogCancel onClick={() => {setShowDeleteFeedbackConfirm(false); setFeedbackIdToDelete(null);}}>{t('actions.cancel')}</AlertDialogCancel><AlertDialogAction onClick={confirmDeleteFeedback} className={buttonVariants({variant: "destructive"})}>{t('actions.delete')}</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default TranslatePage;
