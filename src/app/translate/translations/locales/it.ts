const translations = {
  // Settings dialog
  settings: {
    title: "Impostazioni",
    secondaryTitle: "Altro",
    description: "Personalizza la tua esperienza FlowserveAI. Le modifiche vengono applicate immediatamente.",
    language: "Lingua",
    theme: "Tema",
    themeOptions: {
      light: "Chiaro",
      dark: "Scuro",
      system: "Sistema"
    },
    save: "Salva modifiche",
    saveStatus: {
      success: "Impostazioni salvate",
      description: "Le tue impostazioni sono state aggiornate con successo"
    },
    tools: "Strumenti",
    preferences: "Preferenze",
    darkMode: "Modalità scura",
    support: "Aiuto e supporto",
    policies: "Politiche",
    selectLanguage: "Seleziona lingua",
    search: "Cerca lingue...",
    noLanguageMatch: "Nessuna lingua corrisponde alla tua ricerca"
  },

  // Tools section
  tools: {
    documents: "Documenti",
    documentsDesc: "Visualizza e gestisci i documenti caricati",
    chat: "Chat",
    chatDesc: "Chatta con l'assistente Flowserve AI",
    jobs: "Traduzione",
    jobsDesc: "Traduci testo e documenti",
    translate: "Traduci",
    translationModule: "Modulo di traduzione",
    products: "Prodotti"
  },

  // Support section
  support: {
    help: "Centro assistenza",
    helpDesc: "Ottieni aiuto sull'utilizzo di Flowserve AI"
  },

  // Policies section
  policies: {
    privacy: "Informativa sulla privacy",
    privacyDesc: "Come trattiamo i tuoi dati",
    ai: "Linee guida sull'IA",
    aiDesc: "Come utilizziamo l'IA in modo responsabile"
  },

  // Empty state
  emptyState: {
    welcome: "Benvenuto su FlowserveAI",
    subtitle: "Connettiti e chatta in sicurezza con i tuoi documenti, la tua base di conoscenza e l'IA sulla rete Flowserve",
    startTyping: "Inizia una conversazione digitando qui sotto",
    suggestions: {
      aiChat: {
        category: "Prodotti",
        text: "Spiega la pompa ad alto contenuto di silicio Flowserve IDURCO Mark 3"
      },
      documents: {
        category: "Prodotti",
        text: "Come si opera la pompa in ferro ad alto contenuto di silicio Flowserve IDURCO Mark 3?"
      },
      products: {
        category: "Benefici",
        text: "Come gestisco i miei investimenti 401(k)?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Benvenuto su Flowserve AI",
    subtitle: "La tua piattaforma unificata per assistenza intelligente, analisi dei documenti e conoscenza dei prodotti.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Il tuo assistente digitale",
      description: "Impegnati in conversazioni naturali per ottenere risposte, comprendere argomenti complessi e ricevere assistenza su varie attività relative alle offerte Flowserve.",
      capabilities: {
        root: "Cosa può fare Flowserve AI per te?",
        answer: "Rispondere alle domande",
        explain: "Fornire spiegazioni",
        assist: "Assistere con le attività"
      }
    },
    // Document section
    documents: {
      title: "Analisi dei documenti",
      subtitle: "Chatta con i tuoi documenti",
      maxFileSize: "Dimensione massima file 5 MB",
      onlyPDF: "Solo file PDF",
      vectorSearch: "Ricerca semantica basata su vettori",
      extractInfo: "Estrai informazioni dai documenti",
      description: "Carica i tuoi documenti (PDF) e interagisci direttamente con essi nella chat. Fai domande specifiche sul loro contenuto, ottieni riassunti ed estrai informazioni utilizzando la nostra tecnologia di ricerca semantica.",
      flow: {
        upload: {
          title: "Carica documento",
          description: "Carica i tuoi file PDF in sicurezza."
        },
        conversation: {
          title: "Inizia una conversazione",
          description: "Fai domande sul tuo documento."
        },
        insights: {
          title: "Ottieni insight",
          description: "Ottieni riassunti e informazioni chiave."
        }
      }
    },
    // Translation section
    translation: {
      title: "Traduzione",
      subtitle: "Supporto multilingue",
      description: "Traduci testo e documenti tra diverse lingue. Utilizza lo strumento dedicato \"Traduci\" nella barra laterale.",
      supportedLanguages: "Lingue supportate per il testo:",
      supportedDocTypes: "Tipi di documenti supportati per il modulo di traduzione (in arrivo):",
      videoTutorial: "Tutorial video",
      videoComingSoon: "Il tutorial video sarà presto disponibile.",
      unsupportedVideo: "Il tuo browser non supporta il tag video.",
      flow: {
        upload: {
          title: "Carica",
          description: "File Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Seleziona lingua",
          description: "Scegli la tua lingua di destinazione."
        },
        receiveTranslation: {
          title: "Ricevi traduzione",
          description: "Ottieni i tuoi contenuti tradotti."
        },
        provideFeedback: {
          title: "Fornisci feedback",
          description: "Aiuta a migliorare le future traduzioni."
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "Nuova chat",
    placeholder: "Scrivi un messaggio...",
    placeholderMobile: "Scrivi un messaggio...",
    send: "Invia",
    typing: "Flowserve AI sta scrivendo...",
    loadMore: "Carica altri messaggi",
    emptyConversation: "Inizia una nuova conversazione",
    uploadFile: "Carica file",
    today: "Oggi",
    yesterday: "Ieri",
    deleteMessage: "Elimina questo messaggio",
    editMessage: "Modifica questo messaggio",
    copyToClipboard: "Copia negli appunti",
    copied: "Copiato negli appunti",
    loading: "Caricamento...",
    errorLoading: "Errore durante il caricamento della conversazione",
    messageSent: "Messaggio inviato",
    documentUploadSuccess: "Documento caricato con successo",
    documentUploadError: "Errore durante il caricamento del documento",
    documentProcessing: "Elaborazione del documento in corso...",
    documentReady: "Documento pronto",
    welcome: "Benvenuto nella chat FlowserveAI",
    welcomeSubtitle: "Chatta con i tuoi documenti, la tua base di conoscenza e l'IA sulla rete Flowserve",
    newChatCreated: "Nuova chat creata",
    conversationDeleted: "Conversazione eliminata",
    conversationRenamed: "Conversazione rinominata",
    renameCancelledEmpty: {
      title: "Ridenominazione annullata",
      description: "Il nuovo titolo non può essere vuoto"
    },
    renameCancelledUnchanged: {
      title: "Nessuna modifica",
      description: "Il titolo rimane invariato"
    },
    renameCancelled: "Ridenominazione annullata",
    messageEdited: "Messaggio modificato",
    notFound: "Chat {id} non trovata",
    noActiveSession: "Nessuna sessione di chat attiva",
    selectOrStartNew: "Seleziona una chat dalla barra laterale o inizia una nuova conversazione",
    aiDisclaimer: "Le risposte dell'IA potrebbero non essere sempre accurate. Verifica sempre le informazioni importanti.",
    enterNewTitle: "Inserisci un nuovo titolo",
    containsDocuments: "Questa conversazione contiene documenti"
  },

  // Documents page
  documentsPage: {
    title: "I miei documenti",
    description: "Sfoglia e gestisci tutti i tuoi documenti caricati.",
    noDocuments: {
      title: "Nessun documento trovato",
      description: "Non hai ancora caricato documenti. Carica documenti in qualsiasi chat per vederli qui.",
      action: "Vai alla chat"
    },
    document: {
      uploaded: "Caricato",
      size: "Dimensione",
      viewSummary: "Visualizza riepilogo",
      chatAction: "Chatta sul documento"
    },
    loading: "Caricamento..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "I miei documenti",
    description: "Sfoglia e gestisci tutti i tuoi documenti caricati.",
    noDocumentsFound: "Nessun documento trovato",
    noDocumentsDesc: "Non hai ancora caricato documenti. Carica documenti in qualsiasi chat per vederli qui.",
    goToChat: "Vai alla chat",
    uploaded: "Caricato",
    size: "Dimensione",
    viewSummarySnippet: "Visualizza estratto di riepilogo",
    viewFullSummary: "Visualizza riepilogo completo",
    fullSummary: "Riepilogo completo",
    chatAboutDocument: "Chatta sul documento",
    rawMarkdownPreview: "Anteprima markdown grezza del riepilogo del documento"
  },

  // Translation page
  translation: {
    new: "Nuova attività di traduzione",
    edit: "Modifica attività",
    noActiveJob: "Nessuna attività attiva",
    createNew: "Crea una nuova attività o selezionane una dalla cronologia",
    createNewButton: "Crea nuova attività",
    jobTitle: "Titolo attività",
    enterJobTitle: "Inserisci titolo attività",
    jobType: "Tipo di attività",
    selectJobType: "Seleziona tipo di attività",
    textTranslation: "Traduzione testo",
    documentTranslation: "Traduzione documento",
    sourceLanguage: "Lingua di origine",
    selectSourceLanguage: "Seleziona lingua di origine",
    autoDetect: "Rilevamento automatico",
    targetLanguage: "Lingua di destinazione",
    selectTargetLanguage: "Seleziona lingua di destinazione",
    enterTextToTranslate: "Inserisci il testo da tradurre...",
    characters: "caratteri",
    copyText: "Copia testo",
    speakText: "Pronuncia testo",
    translationWillAppear: "La traduzione apparirà qui...",
    copyTranslation: "Copia traduzione",
    speakTranslation: "Pronuncia traduzione",
    jobHistory: "Cronologia attività",
    newJob: "Nuova attività",
    deleteJob: "Elimina attività",
    cancel: "Annulla",
    save: "Salva",
    saved: "Salvato",
    translate: "Traduci",
    translating: "Traduzione in corso...",
    completed: "Completato",
    
    // Toast messages
    jobSaved: "Attività salvata",
    jobSavedDesc: "'{name}' è stata salvata con successo",
    jobDeleted: "Attività eliminata",
    jobArchived: "Attività archiviata",
    jobUnarchived: "Attività disarchiviata",
    copiedToClipboard: "Copiato negli appunti",
    jobTypeSwitched: "Tipo di attività modificato",
    jobTypeSwitchedDesc: "I dati precedenti sono stati cancellati",
    nothingToSave: "Niente da salvare",
    nothingToSaveDesc: "Nessuna attività attiva da salvare",
    
    // Error messages
    jobTitleRequired: "Titolo attività richiesto",
    jobTitleRequiredDesc: "Inserisci un titolo per questa attività",
    jobTitleRequiredDesc2: "Inserisci un titolo prima di tradurre",
    inputRequired: "Testo richiesto",
    inputRequiredDesc: "Inserisci del testo da tradurre",
    errorTitle: "Errore",
    errorStartTranslationDesc: "Impossibile avviare la traduzione",
    translationError: "Errore di traduzione",
    translationErrorDesc: "Non è stato possibile completare la traduzione",
    
    // Status notifications
    translationComplete: "Traduzione completata",
    translationCompleteDesc: "'{title}' è stato tradotto con successo",
    documentJobComplete: "Traduzione documento completata",
    documentJobCompleteDesc: "'{title}' è stato elaborato con successo",
    documentJobIssues: "Problemi con l'attività documento",
    documentJobIssuesDesc: "'{title}' ha riscontrato problemi durante l'elaborazione",
    jobUpdated: "Attività aggiornata",
    jobUpdatedDesc: "'{title}' è stato aggiornato",
    
    // File processing messages
    fileLimitReached: "Limite di file raggiunto",
    fileLimitReachedDesc: "Massimo {max} file per attività",
    invalidFileType: "Tipo di file non valido",
    invalidFileTypeDesc: "'{fileName}' non è supportato",
    sizeLimitExceeded: "Limite di dimensione superato",
    sizeLimitExceededDesc: "La dimensione totale supera {max} MB",
    fileProcessed: "File elaborato",
    fileProcessedDesc: "'{fileName}' è stato elaborato con successo",
    fileFailed: "Elaborazione file fallita",
    fileFailedDesc: "Non è stato possibile elaborare '{fileName}'",
    allFilesProcessed: "Tutti i file elaborati",
    allFilesProcessedDesc: "Tutti i file sono già stati elaborati",
    noFilesUploaded: "Nessun file caricato",
    noFilesUploadedDesc: "Carica almeno un file",
    noFilesSelected: "Nessun file selezionato",
    noFilesSelectedDesc: "Seleziona almeno un file",
    downloadSelectedSimulated: "Download simulato",
    downloadSelectedSimulatedDesc: "Download simulato per: {fileList}",
    downloadAllZipSimulated: "Download ZIP simulato",
    downloadAllZipSimulatedDesc: "Download simulato di {count} file in ZIP",
    noTranslatedFiles: "Nessun file tradotto",
    noTranslatedFilesDesc: "Nessun file tradotto disponibile per questa lingua",
    downloadSimulated: "Download simulato",
    downloadSimulatedDesc: "Download simulato di '{fileName}'",

    // Additional UI elements
    allTypes: "Tutti i tipi",
    textJobs: "Attività di testo",
    documentJobs: "Attività di documento",
    status: "Stato",
    filterByStatus: "Filtra per stato",
    noJobsMatch: "Nessuna attività corrisponde ai criteri",
    adjustFilters: "Prova a regolare i tuoi filtri",
    searchJobs: "Cerca attività",
    discardChanges: "Scartare le modifiche non salvate?",
    unsavedChangesDesc: "Hai modifiche non salvate. Sei sicuro di volerle scartare e annullare la modifica di questa attività?",
    keepEditing: "Continua a modificare",
    discardAndReset: "Scarta e reimposta",
    deleteJobConfirm: "Eliminare l'attività?",
    deleteJobDesc: "Sei sicuro di voler eliminare l'attività \"{jobName}\"? Questa azione non può essere annullata.",
    maxFiles: "Max {max} file. Max {size} MB totali.",
    browseFiles: "Sfoglia file",
    selectedFiles: "File selezionati ({count}/{max}):",
    togglePdfDocx: "Attiva/disattiva PDF→DOCX",
    pdfToDocxTooltip: "Converti PDF in DOCX durante la traduzione",
    removeFile: "Rimuovi file",
    translatedDocuments: "Documenti tradotti per {language}:",
    download: "Scarica",
    downloadSelected: "Scarica selezionati",
    downloadAllZip: "Scarica tutto come ZIP",
    translationIssues: "Problemi di traduzione",
    actionCancelled: "Azione annullata",
    actionCancelledDesc: "L'operazione corrente è stata annullata."
  },

  // Language names
  languages: {
    en: "Inglese",
    es: "Spagnolo",
    ta: "Tamil",
    hi: "Hindi",
    ru: "Russo",
    fr: "Francese",
    de: "Tedesco",
    it: "Italiano",
    pt: "Portoghese",
    zh: "Cinese (semplificato)",
    ja: "Giapponese",
    ko: "Coreano",
    ar: "Arabo"
  },

  // Common UI elements
  common: {
    close: "Chiudi",
    chat: "Chat",
    unknownError: "Errore sconosciuto",
    selectedChat: "Chat selezionata",
    appName: "FlowserveAI",
    invalidDate: "Data non valida",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "Rinomina",
    delete: "Elimina",
    cancel: "Annulla",
    close: "Chiudi",
    goToChats: "Vai alle chat",
    copiedToClipboard: "Copiato negli appunti"
  },

  // Sidebar elements
  sidebar: {
    conversations: "Conversazioni recenti",
    tools: "Strumenti"
  },

  // Account section
  account: {
    myAccount: "Il mio account",
    profile: "Profilo",
    logout: "Disconnetti"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "Eliminare la conversazione?",
      description: "Sei sicuro di voler eliminare \"{title}\"? Questa azione non può essere annullata."
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "Visualizza estratto di riepilogo",
    viewFullSummary: "Visualizza riepilogo completo",
    defaultName: "Documento",
    fullSummaryTitle: "Riepilogo completo: {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "File troppo grande",
      description: "La dimensione massima del file è {maxSize} MB"
    },
    invalidType: {
      title: "Tipo di file non valido",
      description: "File consentiti: {allowed}"
    },
    preparing: "Preparazione di {fileName} per il caricamento...",
    processingAi: "Elaborazione di {fileName} con l'IA...",
    processingComplete: "Elaborazione di {fileName} completata",
    processingFailed: "Elaborazione di {fileName} fallita",
    readingFailed: "Lettura di {fileName} fallita",
    uploadFailed: "Caricamento di {fileName} fallito",
    fileProcessed: "File elaborato",
    fileProcessedSummary: "{fileName} elaborato con successo",
    aiError: "Errore di elaborazione IA",
    couldNotProcess: "Impossibile elaborare {fileName}",
    status: {
      pendingUpload: "Caricamento in attesa...",
      uploading: "Caricamento... {progress}%",
      pendingProcessing: "Elaborazione IA in attesa...",
      processing: "Elaborazione... {progress}%",
      completed: "Completato",
      failed: "Fallito"
    }
  },

  // Feedback dialog
  feedback: {
    title: "Invia feedback",
    description: "Condividi la tua esperienza con FlowserveAI. Il tuo feedback ci aiuta a migliorare.",
    placeholder: "Raccontaci la tua esperienza...",
    send: "Invia feedback",
    cancel: "Annulla",
    sending: "Invio feedback in corso...",
    success: "Feedback inviato con successo!",
    error: "Invio feedback fallito. Per favore riprova.",
    characterCount: "{count}/3000",
    minCharacters: "Minimo 100 caratteri richiesti"
  }
};

export default translations;