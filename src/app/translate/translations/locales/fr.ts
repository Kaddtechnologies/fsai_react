const translations = {
  // Settings dialog
  settings: {
    title: "Paramètres",
    secondaryTitle: "Plus",
    description: "Personnalisez votre expérience FlowserveAI. Les changements sont appliqués immédiatement.",
    language: "Langue",
    theme: "Thème",
    themeOptions: {
      light: "Clair",
      dark: "Sombre",
      system: "Système"
    },
    save: "Enregistrer les modifications",
    saveStatus: {
      success: "Paramètres enregistrés",
      description: "Vos paramètres ont été mis à jour avec succès"
    },
    tools: "Outils",
    preferences: "Préférences",
    darkMode: "Mode sombre",
    support: "Aide et assistance",
    policies: "Politiques",
    selectLanguage: "Sélectionner une langue",
    search: "Rechercher des langues...",
    noLanguageMatch: "Aucune langue ne correspond à votre recherche"
  },

  // Tools section
  tools: {
    documents: "Documents",
    documentsDesc: "Afficher et gérer les documents téléchargés",
    chat: "Chat",
    chatDesc: "Discuter avec l'assistant Flowserve AI",
    jobs: "Traduction",
    jobsDesc: "Traduire du texte et des documents",
    translate: "Traduire",
    translationModule: "Module de traduction",
    products: "Produits"
  },

  // Support section
  support: {
    help: "Centre d'aide",
    helpDesc: "Obtenir de l'aide pour utiliser Flowserve AI"
  },

  // Policies section
  policies: {
    privacy: "Politique de confidentialité",
    privacyDesc: "Comment nous traitons vos données",
    ai: "Directives d'IA",
    aiDesc: "Comment nous utilisons l'IA de manière responsable"
  },

  // Empty state
  emptyState: {
    welcome: "Bienvenue sur FlowserveAI",
    subtitle: "Connectez-vous et discutez en toute sécurité avec vos documents, votre base de connaissances et l'IA sur le réseau Flowserve",
    startTyping: "Commencez une conversation en tapant ci-dessous",
    suggestions: {
      aiChat: {
        category: "Produits",
        text: "Expliquez la pompe à haute teneur en silicium Flowserve IDURCO Mark 3"
      },
      documents: {
        category: "Produits",
        text: "Comment faire fonctionner la pompe en fonte à haute teneur en silicium Flowserve IDURCO Mark 3?"
      },
      products: {
        category: "Avantages",
        text: "Comment gérer mes investissements 401(k)?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Bienvenue sur Flowserve AI",
    subtitle: "Votre plateforme unifiée pour l'assistance intelligente, l'analyse de documents et les connaissances sur les produits.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Votre assistant numérique",
      description: "Engagez des conversations naturelles pour obtenir des réponses, comprendre des sujets complexes et recevoir de l'aide pour diverses tâches liées aux offres de Flowserve.",
      capabilities: {
        root: "Que peut faire Flowserve AI pour vous ?",
        answer: "Répondre aux questions",
        explain: "Fournir des explications",
        assist: "Aider avec les tâches"
      }
    },
    // Document section
    documents: {
      title: "Analyse de documents",
      subtitle: "Discutez avec vos documents",
      maxFileSize: "Taille maximale de fichier 5 Mo",
      onlyPDF: "Fichiers PDF uniquement",
      vectorSearch: "Recherche sémantique basée sur les vecteurs",
      extractInfo: "Extraire des informations des documents",
      description: "Téléchargez vos documents (PDF) et interagissez avec eux directement dans le chat. Posez des questions spécifiques sur leur contenu, obtenez des résumés et extrayez des informations grâce à notre technologie de recherche sémantique.",
      flow: {
        upload: {
          title: "Télécharger un document",
          description: "Téléchargez vos fichiers PDF en toute sécurité."
        },
        conversation: {
          title: "Commencer une conversation",
          description: "Posez des questions sur votre document."
        },
        insights: {
          title: "Obtenir des insights",
          description: "Obtenez des résumés et des informations clés."
        }
      }
    },
    // Translation section
    translation: {
      title: "Traduction",
      subtitle: "Support multilingue",
      description: "Traduisez du texte et des documents entre différentes langues. Utilisez l'outil dédié \"Traduire\" dans la barre latérale.",
      supportedLanguages: "Langues prises en charge pour le texte :",
      supportedDocTypes: "Types de documents pris en charge pour le module de traduction (à venir) :",
      videoTutorial: "Tutoriel vidéo",
      videoComingSoon: "Le tutoriel vidéo sera bientôt disponible.",
      unsupportedVideo: "Votre navigateur ne prend pas en charge la balise vidéo.",
      flow: {
        upload: {
          title: "Télécharger",
          description: "Fichiers Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Sélectionner une langue",
          description: "Choisissez votre langue cible."
        },
        receiveTranslation: {
          title: "Recevoir la traduction",
          description: "Obtenez votre contenu traduit."
        },
        provideFeedback: {
          title: "Fournir des commentaires",
          description: "Aidez à améliorer les futures traductions."
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "Nouvelle conversation",
    placeholder: "Saisissez un message...",
    placeholderMobile: "Saisissez un message...",
    send: "Envoyer",
    typing: "Flowserve AI est en train d'écrire...",
    loadMore: "Charger plus de messages",
    emptyConversation: "Commencer une nouvelle conversation",
    uploadFile: "Télécharger un fichier",
    today: "Aujourd'hui",
    yesterday: "Hier",
    deleteMessage: "Supprimer ce message",
    editMessage: "Modifier ce message",
    copyToClipboard: "Copier dans le presse-papiers",
    copied: "Copié dans le presse-papiers",
    loading: "Chargement...",
    errorLoading: "Erreur lors du chargement de la conversation",
    messageSent: "Message envoyé",
    documentUploadSuccess: "Document téléchargé avec succès",
    documentUploadError: "Erreur lors du téléchargement du document",
    documentProcessing: "Traitement du document...",
    documentReady: "Document prêt",
    welcome: "Bienvenue sur le chat FlowserveAI",
    welcomeSubtitle: "Discutez avec vos documents, votre base de connaissances et l'IA sur le réseau Flowserve",
    newChatCreated: "Nouvelle conversation créée",
    conversationDeleted: "Conversation supprimée",
    conversationRenamed: "Conversation renommée",
    renameCancelledEmpty: {
      title: "Renommage annulé",
      description: "Le nouveau titre ne peut pas être vide"
    },
    renameCancelledUnchanged: {
      title: "Aucun changement",
      description: "Le titre reste inchangé"
    },
    renameCancelled: "Renommage annulé",
    messageEdited: "Message modifié",
    notFound: "Chat {id} introuvable",
    noActiveSession: "Aucune session de chat active",
    selectOrStartNew: "Veuillez sélectionner un chat dans la barre latérale ou démarrer une nouvelle conversation",
    aiDisclaimer: "Les réponses de l'IA peuvent ne pas toujours être précises. Vérifiez toujours les informations importantes.",
    enterNewTitle: "Entrez un nouveau titre",
    containsDocuments: "Cette conversation contient des documents"
  },

  // Documents page
  documentsPage: {
    title: "Mes documents",
    description: "Parcourez et gérez tous vos documents téléchargés.",
    noDocuments: {
      title: "Aucun document trouvé",
      description: "Vous n'avez pas encore téléchargé de documents. Téléchargez des documents dans n'importe quel chat pour les voir ici.",
      action: "Aller au chat"
    },
    document: {
      uploaded: "Téléchargé",
      size: "Taille",
      viewSummary: "Voir le résumé",
      chatAction: "Discuter du document"
    },
    loading: "Chargement..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "Mes documents",
    description: "Parcourez et gérez tous vos documents téléchargés.",
    noDocumentsFound: "Aucun document trouvé",
    noDocumentsDesc: "Vous n'avez pas encore téléchargé de documents. Téléchargez des documents dans n'importe quel chat pour les voir ici.",
    goToChat: "Aller au chat",
    uploaded: "Téléchargé",
    size: "Taille",
    viewSummarySnippet: "Voir l'extrait de résumé",
    viewFullSummary: "Voir le résumé complet",
    fullSummary: "Résumé complet",
    chatAboutDocument: "Discuter du document",
    rawMarkdownPreview: "Aperçu brut en markdown du résumé de document"
  },

  // Translation page
  translation: {
    new: "Nouvelle tâche de traduction",
    edit: "Modifier la tâche",
    noActiveJob: "Aucune tâche active",
    createNew: "Créez une nouvelle tâche ou sélectionnez-en une dans l'historique",
    createNewButton: "Créer une nouvelle tâche",
    jobTitle: "Titre de la tâche",
    enterJobTitle: "Entrez le titre de la tâche",
    jobType: "Type de tâche",
    selectJobType: "Sélectionnez le type de tâche",
    textTranslation: "Traduction de texte",
    documentTranslation: "Traduction de document",
    sourceLanguage: "Langue source",
    selectSourceLanguage: "Sélectionnez la langue source",
    autoDetect: "Détection automatique",
    targetLanguage: "Langue cible",
    selectTargetLanguage: "Sélectionnez la langue cible",
    enterTextToTranslate: "Entrez le texte à traduire...",
    characters: "caractères",
    copyText: "Copier le texte",
    speakText: "Prononcer le texte",
    translationWillAppear: "La traduction apparaîtra ici...",
    copyTranslation: "Copier la traduction",
    speakTranslation: "Prononcer la traduction",
    jobHistory: "Historique des tâches",
    newJob: "Nouvelle tâche",
    deleteJob: "Supprimer la tâche",
    cancel: "Annuler",
    save: "Enregistrer",
    saved: "Enregistré",
    translate: "Traduire",
    translating: "Traduction en cours...",
    completed: "Terminé",
    
    // Toast messages
    jobSaved: "Tâche enregistrée",
    jobSavedDesc: "'{name}' a été enregistré avec succès",
    jobDeleted: "Tâche supprimée",
    jobArchived: "Tâche archivée",
    jobUnarchived: "Tâche désarchivée",
    copiedToClipboard: "Copié dans le presse-papiers",
    jobTypeSwitched: "Type de tâche modifié",
    jobTypeSwitchedDesc: "Les données précédentes ont été effacées",
    nothingToSave: "Rien à enregistrer",
    nothingToSaveDesc: "Aucune tâche active à enregistrer",
    
    // Error messages
    jobTitleRequired: "Titre de tâche requis",
    jobTitleRequiredDesc: "Veuillez entrer un titre pour cette tâche",
    jobTitleRequiredDesc2: "Veuillez entrer un titre avant de traduire",
    inputRequired: "Texte requis",
    inputRequiredDesc: "Veuillez saisir du texte à traduire",
    errorTitle: "Erreur",
    errorStartTranslationDesc: "Impossible de démarrer la traduction",
    translationError: "Erreur de traduction",
    translationErrorDesc: "La traduction n'a pas pu être terminée",
    
    // Status notifications
    translationComplete: "Traduction terminée",
    translationCompleteDesc: "'{title}' a été traduit avec succès",
    documentJobComplete: "Traduction de document terminée",
    documentJobCompleteDesc: "'{title}' a été traité avec succès",
    documentJobIssues: "Problèmes avec la tâche de document",
    documentJobIssuesDesc: "'{title}' a rencontré des problèmes pendant le traitement",
    jobUpdated: "Tâche mise à jour",
    jobUpdatedDesc: "'{title}' a été mis à jour",
    
    // File processing messages
    fileLimitReached: "Limite de fichiers atteinte",
    fileLimitReachedDesc: "Maximum de {max} fichiers par tâche",
    invalidFileType: "Type de fichier non valide",
    invalidFileTypeDesc: "'{fileName}' n'est pas pris en charge",
    sizeLimitExceeded: "Limite de taille dépassée",
    sizeLimitExceededDesc: "La taille totale dépasse {max} Mo",
    fileProcessed: "Fichier traité",
    fileProcessedDesc: "'{fileName}' a été traité avec succès",
    fileFailed: "Échec du traitement du fichier",
    fileFailedDesc: "'{fileName}' n'a pas pu être traité",
    allFilesProcessed: "Tous les fichiers traités",
    allFilesProcessedDesc: "Tous les fichiers ont déjà été traités",
    noFilesUploaded: "Aucun fichier téléchargé",
    noFilesUploadedDesc: "Veuillez télécharger au moins un fichier",
    noFilesSelected: "Aucun fichier sélectionné",
    noFilesSelectedDesc: "Veuillez sélectionner au moins un fichier",
    downloadSelectedSimulated: "Téléchargement simulé",
    downloadSelectedSimulatedDesc: "Téléchargement simulé pour: {fileList}",
    downloadAllZipSimulated: "Téléchargement ZIP simulé",
    downloadAllZipSimulatedDesc: "Téléchargement simulé de {count} fichiers en ZIP",
    noTranslatedFiles: "Aucun fichier traduit",
    noTranslatedFilesDesc: "Aucun fichier traduit disponible pour cette langue",
    downloadSimulated: "Téléchargement simulé",
    downloadSimulatedDesc: "Téléchargement simulé de '{fileName}'",

    // Additional UI elements
    allTypes: "Tous les types",
    textJobs: "Tâches de texte",
    documentJobs: "Tâches de document",
    status: "Statut",
    filterByStatus: "Filtrer par statut",
    noJobsMatch: "Aucune tâche ne correspond aux critères",
    adjustFilters: "Essayez d'ajuster vos filtres",
    searchJobs: "Rechercher des tâches",
    discardChanges: "Abandonner les modifications non enregistrées ?",
    unsavedChangesDesc: "Vous avez des modifications non enregistrées. Voulez-vous vraiment les abandonner et annuler l'édition de cette tâche ?",
    keepEditing: "Continuer l'édition",
    discardAndReset: "Abandonner et réinitialiser",
    deleteJobConfirm: "Supprimer la tâche ?",
    deleteJobDesc: "Êtes-vous sûr de vouloir supprimer la tâche \"{jobName}\" ? Cette action ne peut pas être annulée.",
    maxFiles: "Max. {max} fichiers. Max. {size} Mo au total.",
    browseFiles: "Parcourir les fichiers",
    selectedFiles: "Fichiers sélectionnés ({count}/{max}) :",
    togglePdfDocx: "Basculer PDF→DOCX",
    pdfToDocxTooltip: "Convertir PDF en DOCX lors de la traduction",
    removeFile: "Supprimer le fichier",
    translatedDocuments: "Documents traduits pour {language} :",
    download: "Télécharger",
    downloadSelected: "Télécharger la sélection",
    downloadAllZip: "Tout télécharger en ZIP",
    translationIssues: "Problèmes de traduction",
    actionCancelled: "Action annulée",
    actionCancelledDesc: "L'opération en cours a été annulée."
  },

  // Language names
  languages: {
    en: "Anglais",
    es: "Espagnol",
    ta: "Tamoul",
    hi: "Hindi",
    ru: "Russe",
    fr: "Français",
    de: "Allemand",
    it: "Italien",
    pt: "Portugais",
    zh: "Chinois (simplifié)",
    ja: "Japonais",
    ko: "Coréen",
    ar: "Arabe"
  },

  // Common UI elements
  common: {
    close: "Fermer",
    chat: "Chat",
    unknownError: "Erreur inconnue",
    selectedChat: "Chat sélectionné",
    appName: "FlowserveAI",
    invalidDate: "Date invalide",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "Renommer",
    delete: "Supprimer",
    cancel: "Annuler",
    close: "Fermer",
    goToChats: "Aller aux chats",
    copiedToClipboard: "Copié dans le presse-papiers"
  },

  // Sidebar elements
  sidebar: {
    conversations: "Conversations récentes",
    tools: "Outils"
  },

  // Account section
  account: {
    myAccount: "Mon compte",
    profile: "Profil",
    logout: "Déconnexion"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "Supprimer la conversation ?",
      description: "Êtes-vous sûr de vouloir supprimer \"{title}\" ? Cette action ne peut pas être annulée."
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "Voir l'extrait de résumé",
    viewFullSummary: "Voir le résumé complet",
    defaultName: "Document",
    fullSummaryTitle: "Résumé complet : {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "Fichier trop volumineux",
      description: "La taille maximale du fichier est de {maxSize} Mo"
    },
    invalidType: {
      title: "Type de fichier non valide",
      description: "Fichiers autorisés : {allowed}"
    },
    preparing: "Préparation de {fileName} pour le téléchargement...",
    processingAi: "Traitement de {fileName} avec l'IA...",
    processingComplete: "Traitement de {fileName} terminé",
    processingFailed: "Échec du traitement de {fileName}",
    readingFailed: "Échec de la lecture de {fileName}",
    uploadFailed: "Échec du téléchargement de {fileName}",
    fileProcessed: "Fichier traité",
    fileProcessedSummary: "{fileName} traité avec succès",
    aiError: "Erreur de traitement IA",
    couldNotProcess: "Impossible de traiter {fileName}",
    status: {
      pendingUpload: "Téléchargement en attente...",
      uploading: "Téléchargement... {progress}%",
      pendingProcessing: "Traitement IA en attente...",
      processing: "Traitement... {progress}%",
      completed: "Terminé",
      failed: "Échec"
    }
  },

  // Feedback dialog
  feedback: {
    title: "Envoyer des commentaires",
    description: "Partagez votre expérience avec FlowserveAI. Vos commentaires nous aident à nous améliorer.",
    placeholder: "Parlez-nous de votre expérience...",
    send: "Envoyer des commentaires",
    cancel: "Annuler",
    sending: "Envoi des commentaires...",
    success: "Commentaires envoyés avec succès !",
    error: "Échec de l'envoi des commentaires. Veuillez réessayer.",
    characterCount: "{count}/3000",
    minCharacters: "Minimum de 100 caractères requis"
  }
};

export default translations;