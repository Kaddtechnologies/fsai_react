const translations = {
  // Settings dialog
  settings: {
    title: "Paramètres",
    secondaryTitle: "Plus",
    description: "Personnalisez votre expérience FlowserveAI. Les modifications s'appliqueront immédiatement.",
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
    selectLanguage: "Sélectionner la langue",
    search: "Rechercher des langues...",
    noLanguageMatch: "Aucune langue ne correspond à votre recherche"
  },

  // Tools section
  tools: {
    documents: "Documents",
    documentsDesc: "Affichez et gérez vos documents téléchargés",
    chat: "Chat",
    chatDesc: "Discutez avec l'assistant Flowserve AI",
    jobs: "Traduction",
    jobsDesc: "Traduisez du texte et des documents",
    translate: "Traduire",
    translationModule: "Module de traduction",
    products: "Produits"
  },

  // Support section
  support: {
    help: "Centre d'aide",
    helpDesc: "Obtenez de l'aide pour utiliser Flowserve AI"
  },

  // Policies section
  policies: {
    privacy: "Politique de confidentialité",
    privacyDesc: "Comment nous traitons vos données",
    ai: "Directives IA",
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
        text: "Expliquez la pompe Flowserve IDURCO Mark 3 à haute teneur en silicium"
      },
      documents: {
        category: "Produits",
        text: "Comment utiliser la pompe Flowserve IDURCO Mark 3 en fonte à haute teneur en silicium ?"
      },
      products: {
        category: "Avantages",
        text: "Comment gérer mes investissements 401(k) ?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Bienvenue sur Flowserve AI",
    subtitle: "Votre plateforme unifiée pour une assistance intelligente, l'analyse de documents et la connaissance des produits.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Votre assistant numérique",
      description: "Engagez des conversations naturelles pour obtenir des réponses, comprendre des sujets complexes et recevoir de l'aide pour diverses tâches liées aux offres de Flowserve.",
      capabilities: {
        root: "Que peut faire Flowserve AI pour vous ?",
        answer: "Répondre aux questions",
        explain: "Fournir des explications",
        assist: "Aider aux tâches"
      }
    },
    // Document section
    documents: {
      title: "Analyse de documents",
      subtitle: "Discutez avec vos documents",
      maxFileSize: "Taille maximale du fichier 5 Mo",
      onlyPDF: "Fichiers PDF uniquement",
      vectorSearch: "Recherche sémantique basée sur des vecteurs",
      extractInfo: "Extraire des informations des documents",
      description: "Téléchargez vos documents (PDF) et interagissez directement avec eux dans le chat. Posez des questions spécifiques sur leur contenu, obtenez des résumés et extrayez des informations grâce à notre technologie de recherche sémantique.",
      flow: {
        upload: {
          title: "Télécharger le document",
          description: "Téléchargez vos fichiers PDF en toute sécurité."
        },
        conversation: {
          title: "Démarrer la conversation",
          description: "Posez des questions sur votre document."
        },
        insights: {
          title: "Extraire des informations",
          description: "Obtenez des résumés et des informations clés."
        }
      }
    },
    // Translation section
    translation: {
      title: "Traduction",
      subtitle: "Prise en charge multilingue",
      description: "Traduisez du texte et des documents entre différentes langues. Utilisez l'outil dédié \"Traduire\" dans la barre latérale.",
      supportedLanguages: "Langues prises en charge pour le texte :",
      supportedDocTypes: "Types de documents pris en charge pour le module de traduction (futur) :",
      videoTutorial: "Tutoriel vidéo",
      videoComingSoon: "Tutoriel vidéo bientôt disponible.",
      unsupportedVideo: "Votre navigateur ne prend pas en charge la balise vidéo.",
      flow: {
        upload: {
          title: "Télécharger",
          description: "Fichiers Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Sélectionner la langue",
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
    newChat: "Nouveau chat",
    placeholder: "Tapez un message...",
    placeholderMobile: "Tapez un message...",
    send: "Envoyer",
    typing: "Flowserve AI est en train d'écrire...",
    loadMore: "Charger plus de messages",
    emptyConversation: "Démarrer une nouvelle conversation",
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
    newChatCreated: "Nouveau chat créé",
    conversationDeleted: "Conversation supprimée",
    conversationRenamed: "Conversation renommée",
    renameCancelledEmpty: {
      title: "Renommage annulé",
      description: "Le nouveau titre ne peut pas être vide"
    },
    renameCancelledUnchanged: {
      title: "Aucune modification",
      description: "Le titre reste inchangé"
    },
    renameCancelled: "Renommage annulé",
    messageEdited: "Message modifié",
    notFound: "Chat {id} introuvable",
    noActiveSession: "Aucune session de chat active",
    selectOrStartNew: "Veuillez sélectionner un chat dans la barre latérale ou démarrer une nouvelle conversation",
    aiDisclaimer: "Les réponses de l'IA ne sont pas toujours exactes. Vérifiez toujours les informations importantes.",
    enterNewTitle: "Saisir un nouveau titre",
    containsDocuments: "Cette conversation contient des documents"
  },

  // Documents page
  documentsPage: {
    title: "Mes documents",
    description: "Parcourez et gérez tous vos documents téléchargés.",
    noDocuments: {
      title: "Aucun document trouvé",
      description: "Vous n'avez encore téléchargé aucun document. Téléchargez des documents dans n'importe quel chat pour les voir ici.",
      action: "Aller au chat"
    },
    document: {
      uploaded: "Téléchargé",
      size: "Taille",
      viewSummary: "Afficher le résumé",
      chatAction: "Discuter du document"
    },
    loading: "Chargement..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "Mes documents",
    description: "Parcourez et gérez tous vos documents téléchargés.",
    noDocumentsFound: "Aucun document trouvé",
    noDocumentsDesc: "Vous n'avez encore téléchargé aucun document. Téléchargez des documents dans n'importe quel chat pour les voir ici.",
    goToChat: "Aller au chat",
    uploaded: "Téléchargé",
    size: "Taille",
    viewSummarySnippet: "Afficher l'extrait du résumé",
    viewFullSummary: "Afficher le résumé complet",
    fullSummary: "Résumé complet",
    chatAboutDocument: "Discuter du document",
    rawMarkdownPreview: "Aperçu markdown brut du résumé du document"
  },

  // Translation page
  translation: {
    new: "Nouvelle tâche de traduction",
    edit: "Modifier la tâche",
    noActiveJob: "Aucune tâche active",
    createNew: "Créez une nouvelle tâche ou sélectionnez-en une dans l'historique",
    createNewButton: "Créer une nouvelle tâche",
    jobTitle: "Titre de la tâche",
    enterJobTitle: "Saisir le titre de la tâche",
    jobType: "Type de tâche",
    selectJobType: "Sélectionner le type de tâche",
    textTranslation: "Traduction de texte",
    documentTranslation: "Traduction de documents",
    sourceLanguage: "Langue source",
    selectSourceLanguage: "Sélectionner la langue source",
    autoDetect: "Détection automatique",
    targetLanguage: "Langue cible",
    selectTargetLanguage: "Sélectionner la langue cible",
    enterTextToTranslate: "Saisir le texte à traduire...",
    characters: "caractères",
    copyText: "Copier le texte",
    speakText: "Lire le texte à voix haute",
    translationWillAppear: "La traduction apparaîtra ici...",
    copyTranslation: "Copier la traduction",
    speakTranslation: "Lire la traduction à voix haute",
    jobHistory: "Historique des tâches",
    newJob: "Nouvelle tâche",
    deleteJob: "Supprimer la tâche",
    cancel: "Annuler",
    save: "Enregistrer",
    saved: "Enregistré",
    translate: "Traduire",
    translating: "Traduction en cours...",
    completed: "Terminé",

    // Add more translation keys
    allTypes: "Tous les types",
    textJobs: "Tâches de texte",
    documentJobs: "Tâches de document",
    status: "Statut",
    filterByStatus: "Filtrer par statut",
    noJobsMatch: "Aucune tâche ne correspond aux critères",
    adjustFilters: "Essayez d'ajuster vos filtres",
    searchJobs: "Rechercher des tâches",
    discardChanges: "Annuler les modifications non enregistrées ?",
    unsavedChangesDesc: "Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir les annuler et annuler la modification de cette tâche ?",
    keepEditing: "Continuer la modification",
    discardAndReset: "Annuler et réinitialiser",
    deleteJobConfirm: "Supprimer la tâche ?",
    deleteJobDesc: "Êtes-vous sûr de vouloir supprimer la tâche « {jobName} » ? Cette action est irréversible.",
    maxFiles: "Max {max} fichiers. Max {size}Mo au total.",
    browseFiles: "Parcourir les fichiers",
    selectedFiles: "Fichiers sélectionnés ({count}/{max}) :",
    togglePdfDocx: "Basculer PDF→DOCX",
    pdfToDocxTooltip: "Convertir PDF en DOCX lors de la traduction",
    removeFile: "Supprimer le fichier",
    translatedDocuments: "Documents traduits pour {language} :",
    download: "Télécharger",
    downloadSelected: "Télécharger la sélection",
    downloadAllZip: "Télécharger tout en ZIP",
    translationIssues: "Problèmes de traduction",
    actionCancelled: "Action annulée",
    actionCancelledDesc: "L'opération en cours a été annulée."
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
      description: "Êtes-vous sûr de vouloir supprimer « {title} » ? Cette action est irréversible."
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "Afficher l'extrait du résumé",
    viewFullSummary: "Afficher le résumé complet",
    defaultName: "document",
    fullSummaryTitle: "Résumé complet : {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "Fichier trop volumineux",
      description: "La taille maximale du fichier est de {maxSize}Mo"
    },
    invalidType: {
      title: "Type de fichier invalide",
      description: "Fichiers autorisés : {allowed}"
    },
    preparing: "Préparation de {fileName} pour le téléchargement...",
    processingAi: "Traitement de {fileName} avec l'IA...",
    processingComplete: "Le traitement de {fileName} est terminé",
    processingFailed: "Le traitement de {fileName} a échoué",
    readingFailed: "La lecture de {fileName} a échoué",
    uploadFailed: "Le téléchargement de {fileName} a échoué",
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
    minCharacters: "Minimum 100 caractères requis"
  }
};

export default translations;