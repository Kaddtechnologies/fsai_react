const translations = {
  // Settings dialog
  settings: {
    title: "Impostazioni",
    secondaryTitle: "Altro",
    description: "Personalizza la tua esperienza FlowserveAI. Le modifiche verranno applicate immediatamente.",
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
    documentsDesc: "Visualizza e gestisci i tuoi documenti caricati",
    chat: "Chat",
    chatDesc: "Chatta con l'assistente AI di Flowserve",
    jobs: "Traduzione",
    jobsDesc: "Traduci testo e documenti",
    translate: "Traduci",
    translationModule: "Modulo di traduzione",
    products: "Prodotti"
  },

  // Support section
  support: {
    help: "Centro assistenza",
    helpDesc: "Ottieni aiuto per l'utilizzo di Flowserve AI"
  },

  // Policies section
  policies: {
    privacy: "Informativa sulla privacy",
    privacyDesc: "Come gestiamo i tuoi dati",
    ai: "Linee guida AI",
    aiDesc: "Come utilizziamo l'AI in modo responsabile"
  },

  // Empty state
  emptyState: {
    welcome: "Benvenuto in FlowserveAI",
    subtitle: "Connettiti e chatta in modo sicuro con i tuoi documenti, la base di conoscenza e l'AI sulla rete Flowserve",
    startTyping: "Inizia una conversazione digitando qui sotto",
    suggestions: {
      aiChat: {
        category: "Prodotti",
        text: "Spiega la pompa Flowserve IDURCO Mark 3 ad alto contenuto di silicio"
      },
      documents: {
        category: "Prodotti",
        text: "Come si utilizza la pompa Flowserve IDURCO Mark 3 in ferro ad alto contenuto di silicio?"
      },
      products: {
        category: "Benefici",
        text: "Come gestisco i miei investimenti 401(k)?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Benvenuto in Flowserve AI",
    subtitle: "La tua piattaforma unificata per assistenza intelligente, analisi dei documenti e conoscenza dei prodotti.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Il tuo assistente digitale",
      description: "Intraprendi conversazioni naturali per ottenere risposte, comprendere argomenti complessi e ricevere assistenza per varie attività relative alle offerte di Flowserve.",
      capabilities: {
        root: "Cosa può fare Flowserve AI per te?",
        answer: "Rispondere alle domande",
        explain: "Fornire spiegazioni",
        assist: "Assistere nelle attività"
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
      description: "Carica i tuoi documenti (PDF) e interagisci direttamente con essi nella chat. Poni domande specifiche sul loro contenuto, ottieni riepiloghi ed estrai informazioni con la nostra tecnologia di ricerca semantica.",
      flow: {
        upload: {
          title: "Carica documento",
          description: "Carica in modo sicuro i tuoi file PDF."
        },
        conversation: {
          title: "Inizia conversazione",
          description: "Poni domande sul tuo documento."
        },
        insights: {
          title: "Estrai approfondimenti",
          description: "Ottieni riepiloghi e informazioni chiave."
        }
      }
    },
    // Translation section
    translation: {
      title: "Traduzione",
      subtitle: "Supporto multilingue",
      description: "Traduci testo e documenti tra varie lingue. Utilizza lo strumento dedicato \"Traduci\" nella barra laterale.",
      supportedLanguages: "Lingue supportate per il testo:",
      supportedDocTypes: "Tipi di documento supportati per il modulo di traduzione (futuro):",
      videoTutorial: "Tutorial video",
      videoComingSoon: "Tutorial video in arrivo.",
      unsupportedVideo: "Il tuo browser non supporta il tag video.",
      flow: {
        upload: {
          title: "Carica",
          description: "File Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Seleziona lingua",
          description: "Scegli la lingua di destinazione."
        },
        receiveTranslation: {
          title: "Ricevi traduzione",
          description: "Ottieni il tuo contenuto tradotto."
        },
        provideFeedback: {
          title: "Fornisci feedback",
          description: "Aiutaci a migliorare le traduzioni future."
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
    uploadFile: "Carica un file",
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
    documentProcessing: "Elaborazione del documento...",
    documentReady: "Documento pronto",
    welcome: "Benvenuto nella chat di FlowserveAI",
    welcomeSubtitle: "Chatta con i tuoi documenti, la base di conoscenza e l'AI sulla rete Flowserve",
    newChatCreated: "Nuova chat creata",
    conversationDeleted: "Conversazione eliminata",
    conversationRenamed: "Conversazione rinominata",
    renameCancelledEmpty: {
      title: "Rinomina annullata",
      description: "Il nuovo titolo non può essere vuoto"
    },
    renameCancelledUnchanged: {
      title: "Nessuna modifica",
      description: "Il titolo rimane invariato"
    },
    renameCancelled: "Rinomina annullata",
    messageEdited: "Messaggio modificato",
    notFound: "Chat {id} non trovata",
    noActiveSession: "Nessuna sessione di chat attiva",
    selectOrStartNew: "Seleziona una chat dalla barra laterale o inizia una nuova conversazione",
    aiDisclaimer: "Le risposte dell'IA potrebbero non essere sempre accurate. Verifica sempre le informazioni importanti.",
    enterNewTitle: "Inserisci nuovo titolo",
    containsDocuments: "Questa conversazione contiene documenti"
  },

  // Documents page
  documentsPage: {
    title: "I miei documenti",
    description: "Sfoglia e gestisci tutti i tuoi documenti caricati.",
    noDocuments: {
      title: "Nessun documento trovato",
      description: "Non hai ancora caricato nessun documento. Carica documenti in qualsiasi chat per vederli qui.",
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
    noDocumentsDesc: "Non hai ancora caricato nessun documento. Carica documenti in qualsiasi chat per vederli qui.",
    goToChat: "Vai alla chat",
    uploaded: "Caricato",
    size: "Dimensione",
    viewSummarySnippet: "Visualizza frammento di riepilogo",
    viewFullSummary: "Visualizza riepilogo completo",
    fullSummary: "Riepilogo completo",
    chatAboutDocument: "Chatta sul documento",
    rawMarkdownPreview: "Anteprima markdown grezza del riepilogo del documento"
  },

  // Translation page
  translation: {
    new: "Nuovo processo di traduzione",
    edit: "Modifica processo",
    noActiveJob: "Nessun processo attivo",
    createNew: "Crea un nuovo processo o selezionane uno dalla cronologia",
    createNewButton: "Crea nuovo processo",
    jobTitle: "Titolo del processo",
    enterJobTitle: "Inserisci titolo del processo",
    jobType: "Tipo di processo",
    selectJobType: "Seleziona tipo di processo",
    textTranslation: "Traduzione testo",
    documentTranslation: "Traduzione documento",
    sourceLanguage: "Lingua di origine",
    selectSourceLanguage: "Seleziona lingua di origine",
    autoDetect: "Rilevamento automatico",
    targetLanguage: "Lingua di destinazione",
    selectTargetLanguage: "Seleziona lingua di destinazione",
    enterTextToTranslate: "Inserisci testo da tradurre...",
    characters: "caratteri",
    copyText: "Copia testo",
    speakText: "Leggi testo",
    translationWillAppear: "La traduzione apparirà qui...",
    copyTranslation: "Copia traduzione",
    speakTranslation: "Leggi traduzione",
    jobHistory: "Cronologia processi",
    newJob: "Nuovo processo",
    deleteJob: "Elimina processo",
    cancel: "Annulla",
    save: "Salva",
    saved: "Salvato",
    translate: "Traduci",
    translating: "Traduzione in corso...",
    completed: "Completato",

    // Add more translation keys
    allTypes: "Tutti i tipi",
    textJobs: "Processi di testo",
    documentJobs: "Processi di documenti",
    status: "Stato",
    filterByStatus: "Filtra per stato",
    noJobsMatch: "Nessun processo corrisponde ai criteri",
    adjustFilters: "Prova a modificare i filtri",
    searchJobs: "Cerca processi",
    discardChanges: "Annullare le modifiche non salvate?",
    unsavedChangesDesc: "Hai modifiche non salvate. Sei sicuro di volerle annullare e interrompere la modifica di questo processo?",
    keepEditing: "Continua a modificare",
    discardAndReset: "Annulla e reimposta",
    deleteJobConfirm: "Eliminare il processo?",
    deleteJobDesc: "Sei sicuro di voler eliminare il processo \"{jobName}\"? Questa azione non può essere annullata.",
    maxFiles: "Max {max} file. Max {size}MB totali.",
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
    logout: "Esci"
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
    viewSummarySnippet: "Visualizza frammento di riepilogo",
    viewFullSummary: "Visualizza riepilogo completo",
    defaultName: "documento",
    fullSummaryTitle: "Riepilogo completo: {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "File troppo grande",
      description: "La dimensione massima del file è {maxSize}MB"
    },
    invalidType: {
      title: "Tipo di file non valido",
      description: "File consentiti: {allowed}"
    },
    preparing: "Preparazione di {fileName} per il caricamento...",
    processingAi: "Elaborazione di {fileName} con AI...",
    processingComplete: "L'elaborazione di {fileName} è completa",
    processingFailed: "L'elaborazione di {fileName} è fallita",
    readingFailed: "La lettura di {fileName} è fallita",
    uploadFailed: "Il caricamento di {fileName} è fallito",
    fileProcessed: "File elaborato",
    fileProcessedSummary: "{fileName} elaborato con successo",
    aiError: "Errore di elaborazione AI",
    couldNotProcess: "Impossibile elaborare {fileName}",
    status: {
      pendingUpload: "Caricamento in sospeso...",
      uploading: "Caricamento... {progress}%",
      pendingProcessing: "Elaborazione AI in sospeso...",
      processing: "Elaborazione... {progress}%",
      completed: "Completato",
      failed: "Fallito"
    }
  },

  // Feedback dialog
  feedback: {
    title: "Invia feedback",
    description: "Condividi la tua esperienza con FlowserveAI. Il tuo feedback ci aiuta a migliorare.",
    placeholder: "Raccontaci la tuaesperienza...",
    send: "Invia feedback",
    cancel: "Annulla",
    sending: "Invio feedback...",
    success: "Feedback inviato con successo!",
    error: "Impossibile inviare il feedback. Riprova.",
    characterCount: "{count}/3000",
    minCharacters: "Minimo 100 caratteri richiesti"
  }
};

export default translations;