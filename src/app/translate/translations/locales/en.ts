const translations = {
  // Settings dialog
  settings: {
    title: "Settings",
    secondaryTitle: "More",
    description: "Customize your FlowserveAI experience. Changes will apply immediately.",
    language: "Language",
    theme: "Theme",
    themeOptions: {
      light: "Light",
      dark: "Dark",
      system: "System"
    },
    save: "Save changes",
    saveStatus: {
      success: "Settings saved",
      description: "Your settings have been updated successfully"
    },
    tools: "Tools",
    preferences: "Preferences",
    darkMode: "Dark Mode",
    support: "Help & Support",
    policies: "Policies",
    selectLanguage: "Select Language",
    search: "Search languages...",
    noLanguageMatch: "No languages match your search"
  },
  
  // Tools section
  tools: {
    documents: "Documents",
    documentsDesc: "View and manage your uploaded documents",
    chat: "Chat",
    chatDesc: "Chat with Flowserve AI assistant",
    jobs: "Translation",
    jobsDesc: "Translate text and documents",
    translate: "Translate",
    translationModule: "Translation Module",
    products: "Products"
  },
  
  // Support section
  support: {
    help: "Help Center",
    helpDesc: "Get help with using Flowserve AI"
  },
  
  // Policies section
  policies: {
    privacy: "Privacy Policy",
    privacyDesc: "How we handle your data",
    ai: "AI Guidelines",
    aiDesc: "How we use AI responsibly"
  },
  
  // Empty state
  emptyState: {
    welcome: "Welcome to FlowserveAI",
    subtitle: "Securely Connect and Chat with your Documents, Knowledgebase, and AI on the Flowserve Network",
    startTyping: "Start a conversation by typing below",
    suggestions: {
      aiChat: {
        category: "Products",
        text: "Explain the Flowserve IDURCO Mark 3 High silicon pump"
      },
      documents: {
        category: "Products",
        text: "How do I operate the Flowserve IDURCO Mark 3 High Silicon Iron Pump?"
      },
      products: {
        category: "Benefits",
        text: "How do I manage my 401(k) investments?"
      }
    }
  },
  
  // Welcome dialog
  welcomeDialog: {
    title: "Welcome to Flowserve AI",
    subtitle: "Your unified platform for intelligent assistance, document analysis, and product knowledge.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Your Digital Assistant",
      description: "Engage in natural conversations to get answers, understand complex topics, and receive assistance with various tasks related to Flowserve's offerings.",
      capabilities: {
        root: "What can Flowserve AI do for you?",
        answer: "Answer questions",
        explain: "Provide explanations",
        assist: "Assist with tasks"
      }
    },
    // Document section
    documents: {
      title: "Document Analysis",
      subtitle: "Chat with Your Documents",
      maxFileSize: "Max File Size 5MB",
      onlyPDF: "Only PDF files",
      vectorSearch: "Vector-powered semantic search",
      extractInfo: "Extract info from documents",
      description: "Upload your documents (PDFs) and interact with them directly in the chat. Ask specific questions about their content, get summaries, and extract information with our semantic search technology.",
      flow: {
        upload: {
          title: "Upload Document",
          description: "Securely upload your PDF files."
        },
        conversation: {
          title: "Start Conversation",
          description: "Ask questions about your document."
        },
        insights: {
          title: "Extract Insights",
          description: "Get summaries and key information."
        }
      }
    },
    // Translation section
    translation: {
      title: "Translation",
      subtitle: "Multi-Language Support",
      description: "Translate text and documents between various languages. Use the dedicated \"Translate\" tool in the sidebar.",
      supportedLanguages: "Supported Languages for Text:",
      supportedDocTypes: "Supported Document Types for Translation Module (Future):",
      videoTutorial: "Video Tutorial",
      videoComingSoon: "Video tutorial coming soon.",
      unsupportedVideo: "Your browser does not support the video tag.",
      flow: {
        upload: {
          title: "Upload",
          description: "Word, PowerPoint, Excel, PDF files."
        },
        selectLanguage: {
          title: "Select Language",
          description: "Choose your target language."
        },
        receiveTranslation: {
          title: "Receive Translation",
          description: "Get your translated content."
        },
        provideFeedback: {
          title: "Provide Feedback",
          description: "Help improve future translations."
        }
      }
    }
  },
  
  // Chat-related
  chat: {
    newChat: "New Chat",
    placeholder: "Type a message...",
    placeholderMobile: "Type a message...",
    send: "Send",
    typing: "Flowserve AI is typing...",
    loadMore: "Load more messages",
    emptyConversation: "Start a new conversation",
    uploadFile: "Upload a file",
    today: "Today",
    yesterday: "Yesterday",
    deleteMessage: "Delete this message",
    editMessage: "Edit this message",
    copyToClipboard: "Copy to clipboard",
    copied: "Copied to clipboard",
    loading: "Loading...",
    errorLoading: "Error loading conversation",
    messageSent: "Message sent",
    documentUploadSuccess: "Document uploaded successfully",
    documentUploadError: "Error uploading document",
    documentProcessing: "Document processing...",
    documentReady: "Document ready",
    welcome: "Welcome to FlowserveAI Chat",
    welcomeSubtitle: "Chat with your documents, knowledgebase, and AI on the Flowserve Network",
    newChatCreated: "New chat created",
    conversationDeleted: "Conversation deleted",
    conversationRenamed: "Conversation renamed",
    renameCancelledEmpty: {
      title: "Rename cancelled",
      description: "The new title cannot be empty"
    },
    renameCancelledUnchanged: {
      title: "No changes",
      description: "The title remains unchanged"
    },
    renameCancelled: "Rename cancelled",
    messageEdited: "Message edited",
    notFound: "Chat {id} not found",
    noActiveSession: "No active chat session",
    selectOrStartNew: "Please select a chat from the sidebar or start a new conversation",
    aiDisclaimer: "AI responses may not always be accurate. Always verify important information.",
    enterNewTitle: "Enter new title",
    containsDocuments: "This conversation contains documents",
  },
  
  // Documents page
  documentsPage: {
    title: "My Documents",
    description: "Browse and manage all your uploaded documents.",
    noDocuments: {
      title: "No Documents Found",
      description: "You haven't uploaded any documents yet. Upload documents in any chat to see them here.",
      action: "Go to Chat"
    },
    document: {
      uploaded: "Uploaded",
      size: "Size",
      viewSummary: "View Summary",
      chatAction: "Chat about Document"
    },
    loading: "Loading..."
  },
  
  // Documents page (used in documents/page.tsx)
  documents: {
    title: "My Documents",
    description: "Browse and manage all your uploaded documents.",
    noDocumentsFound: "No Documents Found",
    noDocumentsDesc: "You haven't uploaded any documents yet. Upload documents in any chat to see them here.",
    goToChat: "Go to Chat",
    uploaded: "Uploaded",
    size: "Size",
    viewSummarySnippet: "View summary snippet",
    viewFullSummary: "View full summary",
    fullSummary: "Full Summary",
    chatAboutDocument: "Chat about Document",
    rawMarkdownPreview: "Raw markdown preview of the document summary"
  },
  
  // Translation page
  translation: {
    new: "New Translation Job",
    edit: "Edit Job",
    noActiveJob: "No Active Job",
    createNew: "Create a new job or select one from history",
    createNewButton: "Create New Job",
    jobTitle: "Job Title",
    enterJobTitle: "Enter job title",
    jobType: "Job Type",
    selectJobType: "Select job type",
    textTranslation: "Text Translation",
    documentTranslation: "Document Translation",
    sourceLanguage: "Source Language",
    selectSourceLanguage: "Select source language",
    autoDetect: "Auto-detect",
    targetLanguage: "Target Language",
    selectTargetLanguage: "Select target language",
    enterTextToTranslate: "Enter text to translate...",
    characters: "characters",
    copyText: "Copy text",
    speakText: "Speak text",
    translationWillAppear: "Translation will appear here...",
    copyTranslation: "Copy translation",
    speakTranslation: "Speak translation",
    jobHistory: "Job History",
    newJob: "New Job",
    deleteJob: "Delete Job",
    cancel: "Cancel",
    save: "Save",
    saved: "Saved",
    translate: "Translate",
    translating: "Translating...",
    completed: "Completed",
    
    // Add more translation keys
    allTypes: "All Types",
    textJobs: "Text Jobs",
    documentJobs: "Document Jobs",
    status: "Status",
    filterByStatus: "Filter by Status",
    noJobsMatch: "No jobs match criteria",
    adjustFilters: "Try adjusting your filters",
    searchJobs: "Search jobs",
    discardChanges: "Discard Unsaved Changes?",
    unsavedChangesDesc: "You have unsaved changes. Are you sure you want to discard them and cancel editing this job?",
    keepEditing: "Keep Editing",
    discardAndReset: "Discard & Reset",
    deleteJobConfirm: "Delete Job?",
    deleteJobDesc: "Are you sure you want to delete the job \"{jobName}\"? This action cannot be undone.",
    maxFiles: "Max {max} files. Max {size}MB total.",
    browseFiles: "Browse Files",
    selectedFiles: "Selected Files ({count}/{max}):",
    togglePdfDocx: "Toggle PDF→DOCX",
    pdfToDocxTooltip: "Convert PDF to DOCX on translation",
    removeFile: "Remove file",
    translatedDocuments: "Translated Documents for {language}:",
    download: "Download",
    downloadSelected: "Download Selected",
    downloadAllZip: "Download All as ZIP",
    translationIssues: "Translation Issues",
    actionCancelled: "Action Cancelled",
    actionCancelledDesc: "Current operation was cancelled."
  },
  
  // Common UI elements
  common: {
    close: "Close",
    chat: "Chat",
    unknownError: "Unknown error",
    selectedChat: "Selected Chat",
    appName: "FlowserveAI",
    invalidDate: "Invalid date",
    logoAlt: "Flowserve AI"
  },
  
  // Action buttons
  actions: {
    rename: "Rename",
    delete: "Delete",
    cancel: "Cancel",
    close: "Close",
    goToChats: "Go to Chats",
    copiedToClipboard: "Copied to clipboard"
  },
  
  // Sidebar elements
  sidebar: {
    conversations: "Recent Conversations",
    tools: "Tools"
  },
  
  // Account section
  account: {
    myAccount: "My Account",
    profile: "Profile",
    logout: "Logout"
  },
  
  // Alerts
  alerts: {
    deleteConfirm: {
      title: "Delete Conversation?",
      description: "Are you sure you want to delete \"{title}\"? This cannot be undone."
    }
  },
  
  // Document related
  document: {
    viewSummarySnippet: "View summary snippet",
    viewFullSummary: "View full summary",
    defaultName: "document",
    fullSummaryTitle: "Full Summary: {docName}"
  },
  
  // File uploads
  uploads: {
    fileTooLarge: {
      title: "File Too Large",
      description: "Maximum file size is {maxSize}MB"
    },
    invalidType: {
      title: "Invalid File Type",
      description: "Allowed files: {allowed}"
    },
    preparing: "Preparing {fileName} for upload...",
    processingAi: "Processing {fileName} with AI...",
    processingComplete: "Processing of {fileName} is complete",
    processingFailed: "Processing of {fileName} failed",
    readingFailed: "Reading {fileName} failed",
    uploadFailed: "Upload of {fileName} failed",
    fileProcessed: "File Processed",
    fileProcessedSummary: "Processed {fileName} successfully",
    aiError: "AI Processing Error",
    couldNotProcess: "Could not process {fileName}",
    status: {
      pendingUpload: "Pending upload...",
      uploading: "Uploading... {progress}%",
      pendingProcessing: "Pending AI processing...",
      processing: "Processing... {progress}%",
      completed: "Completed",
      failed: "Failed"
    }
  },
  
  // Feedback dialog
  feedback: {
    title: "Send Feedback",
    description: "Share your experience with FlowserveAI. Your feedback helps us improve.",
    placeholder: "Tell us about your experience...",
    send: "Send Feedback",
    cancel: "Cancel",
    sending: "Sending feedback...",
    success: "Feedback sent successfully!",
    error: "Failed to send feedback. Please try again.",
    characterCount: "{count}/3000",
    minCharacters: "Minimum 100 characters required"
  }
};

export default translations;
