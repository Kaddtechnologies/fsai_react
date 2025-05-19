const translations = {
  // Settings dialog
  settings: {
    title: "Einstellungen",
    secondaryTitle: "Mehr",
    description: "Passen Sie Ihre FlowserveAI-Erfahrung an. Änderungen werden sofort übernommen.",
    language: "Sprache",
    theme: "Thema",
    themeOptions: {
      light: "Hell",
      dark: "Dunkel",
      system: "System"
    },
    save: "Änderungen speichern",
    saveStatus: {
      success: "Einstellungen gespeichert",
      description: "Ihre Einstellungen wurden erfolgreich aktualisiert"
    },
    tools: "Werkzeuge",
    preferences: "Präferenzen",
    darkMode: "Dunkelmodus",
    support: "Hilfe & Support",
    policies: "Richtlinien",
    selectLanguage: "Sprache auswählen",
    search: "Sprachen suchen...",
    noLanguageMatch: "Keine Sprachen stimmen mit Ihrer Suche überein"
  },

  // Tools section
  tools: {
    documents: "Dokumente",
    documentsDesc: "Hochgeladene Dokumente anzeigen und verwalten",
    chat: "Chat",
    chatDesc: "Chatten Sie mit dem Flowserve AI-Assistenten",
    jobs: "Übersetzung",
    jobsDesc: "Text und Dokumente übersetzen",
    translate: "Übersetzen",
    translationModule: "Übersetzungsmodul",
    products: "Produkte"
  },

  // Support section
  support: {
    help: "Hilfezentrum",
    helpDesc: "Hilfe zur Verwendung von Flowserve AI erhalten"
  },

  // Policies section
  policies: {
    privacy: "Datenschutzrichtlinie",
    privacyDesc: "Wie wir Ihre Daten behandeln",
    ai: "KI-Richtlinien",
    aiDesc: "Wie wir KI verantwortungsvoll einsetzen"
  },

  // Empty state
  emptyState: {
    welcome: "Willkommen bei FlowserveAI",
    subtitle: "Verbinden Sie sich sicher und chatten Sie mit Ihren Dokumenten, Ihrer Wissensdatenbank und KI im Flowserve-Netzwerk",
    startTyping: "Starten Sie eine Unterhaltung, indem Sie unten tippen",
    suggestions: {
      aiChat: {
        category: "Produkte",
        text: "Erklären Sie die Flowserve IDURCO Mark 3 Hochsiliziumpumpe"
      },
      documents: {
        category: "Produkte",
        text: "Wie bediene ich die Flowserve IDURCO Mark 3 Hochsiliziumeisenpumpe?"
      },
      products: {
        category: "Vorteile",
        text: "Wie verwalte ich meine 401(k)-Investitionen?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Willkommen bei Flowserve AI",
    subtitle: "Ihre einheitliche Plattform für intelligente Unterstützung, Dokumentenanalyse und Produktwissen.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Ihr digitaler Assistent",
      description: "Führen Sie natürliche Gespräche, um Antworten zu erhalten, komplexe Themen zu verstehen und Unterstützung bei verschiedenen Aufgaben im Zusammenhang mit den Angeboten von Flowserve zu erhalten.",
      capabilities: {
        root: "Was kann Flowserve AI für Sie tun?",
        answer: "Fragen beantworten",
        explain: "Erklärungen liefern",
        assist: "Bei Aufgaben unterstützen"
      }
    },
    // Document section
    documents: {
      title: "Dokumentenanalyse",
      subtitle: "Chatten Sie mit Ihren Dokumenten",
      maxFileSize: "Maximale Dateigröße 5 MB",
      onlyPDF: "Nur PDF-Dateien",
      vectorSearch: "Vektorbasierte semantische Suche",
      extractInfo: "Informationen aus Dokumenten extrahieren",
      description: "Laden Sie Ihre Dokumente (PDFs) hoch und interagieren Sie direkt im Chat mit ihnen. Stellen Sie spezifische Fragen zu deren Inhalt, erhalten Sie Zusammenfassungen und extrahieren Sie Informationen mit unserer semantischen Suchtechnologie.",
      flow: {
        upload: {
          title: "Dokument hochladen",
          description: "Laden Sie Ihre PDF-Dateien sicher hoch."
        },
        conversation: {
          title: "Gespräch beginnen",
          description: "Stellen Sie Fragen zu Ihrem Dokument."
        },
        insights: {
          title: "Erkenntnisse gewinnen",
          description: "Erhalten Sie Zusammenfassungen und wichtige Informationen."
        }
      }
    },
    // Translation section
    translation: {
      title: "Übersetzung",
      subtitle: "Mehrsprachige Unterstützung",
      description: "Übersetzen Sie Texte und Dokumente zwischen verschiedenen Sprachen. Verwenden Sie das spezielle Werkzeug \"Übersetzen\" in der Seitenleiste.",
      supportedLanguages: "Unterstützte Sprachen für Text:",
      supportedDocTypes: "Unterstützte Dokumenttypen für das Übersetzungsmodul (zukünftig):",
      videoTutorial: "Videoanleitung",
      videoComingSoon: "Videoanleitung in Kürze verfügbar.",
      unsupportedVideo: "Ihr Browser unterstützt das Video-Tag nicht.",
      flow: {
        upload: {
          title: "Hochladen",
          description: "Word-, PowerPoint-, Excel-, PDF-Dateien."
        },
        selectLanguage: {
          title: "Sprache auswählen",
          description: "Wählen Sie Ihre Zielsprache."
        },
        receiveTranslation: {
          title: "Übersetzung erhalten",
          description: "Erhalten Sie Ihre übersetzten Inhalte."
        },
        provideFeedback: {
          title: "Feedback geben",
          description: "Helfen Sie mit, zukünftige Übersetzungen zu verbessern."
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "Neuer Chat",
    placeholder: "Nachricht eingeben...",
    placeholderMobile: "Nachricht eingeben...",
    send: "Senden",
    typing: "Flowserve AI tippt...",
    loadMore: "Weitere Nachrichten laden",
    emptyConversation: "Neue Unterhaltung beginnen",
    uploadFile: "Datei hochladen",
    today: "Heute",
    yesterday: "Gestern",
    deleteMessage: "Diese Nachricht löschen",
    editMessage: "Diese Nachricht bearbeiten",
    copyToClipboard: "In die Zwischenablage kopieren",
    copied: "In die Zwischenablage kopiert",
    loading: "Lädt...",
    errorLoading: "Fehler beim Laden der Unterhaltung",
    messageSent: "Nachricht gesendet",
    documentUploadSuccess: "Dokument erfolgreich hochgeladen",
    documentUploadError: "Fehler beim Hochladen des Dokuments",
    documentProcessing: "Dokument wird verarbeitet...",
    documentReady: "Dokument bereit",
    welcome: "Willkommen beim FlowserveAI Chat",
    welcomeSubtitle: "Chatten Sie mit Ihren Dokumenten, Ihrer Wissensdatenbank und KI im Flowserve-Netzwerk",
    newChatCreated: "Neuer Chat erstellt",
    conversationDeleted: "Unterhaltung gelöscht",
    conversationRenamed: "Unterhaltung umbenannt",
    renameCancelledEmpty: {
      title: "Umbenennung abgebrochen",
      description: "Der neue Titel darf nicht leer sein"
    },
    renameCancelledUnchanged: {
      title: "Keine Änderungen",
      description: "Der Titel bleibt unverändert"
    },
    renameCancelled: "Umbenennung abgebrochen",
    messageEdited: "Nachricht bearbeitet",
    notFound: "Chat {id} nicht gefunden",
    noActiveSession: "Keine aktive Chat-Sitzung",
    selectOrStartNew: "Bitte wählen Sie einen Chat aus der Seitenleiste aus oder starten Sie eine neue Unterhaltung",
    aiDisclaimer: "KI-Antworten sind möglicherweise nicht immer korrekt. Überprüfen Sie wichtige Informationen immer.",
    enterNewTitle: "Neuen Titel eingeben",
    containsDocuments: "Diese Unterhaltung enthält Dokumente"
  },

  // Documents page
  documentsPage: {
    title: "Meine Dokumente",
    description: "Durchsuchen und verwalten Sie alle Ihre hochgeladenen Dokumente.",
    noDocuments: {
      title: "Keine Dokumente gefunden",
      description: "Sie haben noch keine Dokumente hochgeladen. Laden Sie Dokumente in einem beliebigen Chat hoch, um sie hier anzuzeigen.",
      action: "Zum Chat gehen"
    },
    document: {
      uploaded: "Hochgeladen",
      size: "Größe",
      viewSummary: "Zusammenfassung anzeigen",
      chatAction: "Über Dokument chatten"
    },
    loading: "Lädt..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "Meine Dokumente",
    description: "Durchsuchen und verwalten Sie alle Ihre hochgeladenen Dokumente.",
    noDocumentsFound: "Keine Dokumente gefunden",
    noDocumentsDesc: "Sie haben noch keine Dokumente hochgeladen. Laden Sie Dokumente in einem beliebigen Chat hoch, um sie hier anzuzeigen.",
    goToChat: "Zum Chat gehen",
    uploaded: "Hochgeladen",
    size: "Größe",
    viewSummarySnippet: "Zusammenfassungs-Snippet anzeigen",
    viewFullSummary: "Vollständige Zusammenfassung anzeigen",
    fullSummary: "Vollständige Zusammenfassung",
    chatAboutDocument: "Über Dokument chatten",
    rawMarkdownPreview: "Rohe Markdown-Vorschau der Dokumentzusammenfassung"
  },

  // Translation page
  translation: {
    new: "Neuer Übersetzungsauftrag",
    edit: "Auftrag bearbeiten",
    noActiveJob: "Kein aktiver Auftrag",
    createNew: "Erstellen Sie einen neuen Auftrag oder wählen Sie einen aus dem Verlauf aus",
    createNewButton: "Neuen Auftrag erstellen",
    jobTitle: "Auftragstitel",
    enterJobTitle: "Auftragstitel eingeben",
    jobType: "Auftragstyp",
    selectJobType: "Auftragstyp auswählen",
    textTranslation: "Textübersetzung",
    documentTranslation: "Dokumentübersetzung",
    sourceLanguage: "Ausgangssprache",
    selectSourceLanguage: "Ausgangssprache auswählen",
    autoDetect: "Automatisch erkennen",
    targetLanguage: "Zielsprache",
    selectTargetLanguage: "Zielsprache auswählen",
    enterTextToTranslate: "Zu übersetzenden Text eingeben...",
    characters: "Zeichen",
    copyText: "Text kopieren",
    speakText: "Text sprechen",
    translationWillAppear: "Übersetzung wird hier angezeigt...",
    copyTranslation: "Übersetzung kopieren",
    speakTranslation: "Übersetzung sprechen",
    jobHistory: "Auftragsverlauf",
    newJob: "Neuer Auftrag",
    deleteJob: "Auftrag löschen",
    cancel: "Abbrechen",
    save: "Speichern",
    saved: "Gespeichert",
    translate: "Übersetzen",
    translating: "Übersetzt...",
    completed: "Abgeschlossen",
    
    // Toast messages
    jobSaved: "Auftrag gespeichert",
    jobSavedDesc: "'{name}' wurde erfolgreich gespeichert",
    jobDeleted: "Auftrag gelöscht",
    jobArchived: "Auftrag archiviert",
    jobUnarchived: "Auftrag aus Archiv entfernt",
    copiedToClipboard: "In die Zwischenablage kopiert",
    jobTypeSwitched: "Auftragstyp gewechselt",
    jobTypeSwitchedDesc: "Vorherige Daten wurden gelöscht",
    nothingToSave: "Nichts zu speichern",
    nothingToSaveDesc: "Kein aktiver Auftrag zum Speichern",
    
    // Error messages
    jobTitleRequired: "Auftragstitel erforderlich",
    jobTitleRequiredDesc: "Bitte geben Sie einen Titel für diesen Auftrag ein",
    jobTitleRequiredDesc2: "Bitte geben Sie einen Titel ein, bevor Sie übersetzen",
    inputRequired: "Text erforderlich",
    inputRequiredDesc: "Bitte geben Sie Text zum Übersetzen ein",
    errorTitle: "Fehler",
    errorStartTranslationDesc: "Übersetzung konnte nicht gestartet werden",
    translationError: "Übersetzungsfehler",
    translationErrorDesc: "Übersetzung konnte nicht abgeschlossen werden",
    
    // Status notifications
    translationComplete: "Übersetzung abgeschlossen",
    translationCompleteDesc: "'{title}' wurde erfolgreich übersetzt",
    documentJobComplete: "Dokumentübersetzung abgeschlossen",
    documentJobCompleteDesc: "'{title}' wurde erfolgreich verarbeitet",
    documentJobIssues: "Probleme bei der Dokumentübersetzung",
    documentJobIssuesDesc: "Bei der Verarbeitung von '{title}' sind Probleme aufgetreten",
    jobUpdated: "Auftrag aktualisiert",
    jobUpdatedDesc: "'{title}' wurde aktualisiert",
    
    // File processing messages
    fileLimitReached: "Dateilimit erreicht",
    fileLimitReachedDesc: "Maximal {max} Dateien pro Auftrag",
    invalidFileType: "Ungültiger Dateityp",
    invalidFileTypeDesc: "'{fileName}' wird nicht unterstützt",
    sizeLimitExceeded: "Größenlimit überschritten",
    sizeLimitExceededDesc: "Gesamtgröße überschreitet {max} MB",
    fileProcessed: "Datei verarbeitet",
    fileProcessedDesc: "'{fileName}' wurde erfolgreich verarbeitet",
    fileFailed: "Dateiverarbeitung fehlgeschlagen",
    fileFailedDesc: "'{fileName}' konnte nicht verarbeitet werden",
    allFilesProcessed: "Alle Dateien verarbeitet",
    allFilesProcessedDesc: "Alle Dateien wurden bereits verarbeitet",
    noFilesUploaded: "Keine Dateien hochgeladen",
    noFilesUploadedDesc: "Bitte laden Sie mindestens eine Datei hoch",
    noFilesSelected: "Keine Dateien ausgewählt",
    noFilesSelectedDesc: "Bitte wählen Sie mindestens eine Datei aus",
    downloadSelectedSimulated: "Simulierter Download",
    downloadSelectedSimulatedDesc: "Simulierter Download für: {fileList}",
    downloadAllZipSimulated: "Simulierter ZIP-Download",
    downloadAllZipSimulatedDesc: "Simulierter Download von {count} Dateien als ZIP",
    noTranslatedFiles: "Keine übersetzten Dateien",
    noTranslatedFilesDesc: "Es gibt keine übersetzten Dateien für diese Sprache",
    downloadSimulated: "Simulierter Download",
    downloadSimulatedDesc: "Simulierter Download von '{fileName}'"
  },

  // Common UI elements
  common: {
    close: "Schließen",
    chat: "Chat",
    unknownError: "Unbekannter Fehler",
    selectedChat: "Ausgewählter Chat",
    appName: "FlowserveAI",
    invalidDate: "Ungültiges Datum",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "Umbenennen",
    delete: "Löschen",
    cancel: "Abbrechen",
    close: "Schließen",
    goToChats: "Zu den Chats gehen",
    copiedToClipboard: "In die Zwischenablage kopiert"
  },

  // Sidebar elements
  sidebar: {
    conversations: "Letzte Unterhaltungen",
    tools: "Werkzeuge"
  },

  // Account section
  account: {
    myAccount: "Mein Konto",
    profile: "Profil",
    logout: "Abmelden"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "Unterhaltung löschen?",
      description: "Sind Sie sicher, dass Sie \"{title}\" löschen möchten? Dies kann nicht rückgängig gemacht werden."
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "Zusammenfassungs-Snippet anzeigen",
    viewFullSummary: "Vollständige Zusammenfassung anzeigen",
    defaultName: "Dokument",
    fullSummaryTitle: "Vollständige Zusammenfassung: {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "Datei zu groß",
      description: "Maximale Dateigröße ist {maxSize}MB"
    },
    invalidType: {
      title: "Ungültiger Dateityp",
      description: "Erlaubte Dateien: {allowed}"
    },
    preparing: "Vorbereitung von {fileName} für den Upload...",
    processingAi: "Verarbeitung von {fileName} mit KI...",
    processingComplete: "Verarbeitung von {fileName} abgeschlossen",
    processingFailed: "Verarbeitung von {fileName} fehlgeschlagen",
    readingFailed: "Lesen von {fileName} fehlgeschlagen",
    uploadFailed: "Upload von {fileName} fehlgeschlagen",
    fileProcessed: "Datei verarbeitet",
    fileProcessedSummary: "{fileName} erfolgreich verarbeitet",
    aiError: "KI-Verarbeitungsfehler",
    couldNotProcess: "{fileName} konnte nicht verarbeitet werden",
    status: {
      pendingUpload: "Upload ausstehend...",
      uploading: "Lädt hoch... {progress}%",
      pendingProcessing: "KI-Verarbeitung ausstehend...",
      processing: "Verarbeitet... {progress}%",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen"
    }
  },

  // Feedback dialog
  feedback: {
    title: "Feedback senden",
    description: "Teilen Sie Ihre Erfahrungen mit FlowserveAI. Ihr Feedback hilft uns, uns zu verbessern.",
    placeholder: "Erzählen Sie uns von Ihren Erfahrungen...",
    send: "Feedback senden",
    cancel: "Abbrechen",
    sending: "Feedback wird gesendet...",
    success: "Feedback erfolgreich gesendet!",
    error: "Feedback konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    characterCount: "{count}/3000",
    minCharacters: "Mindestens 100 Zeichen erforderlich"
  }
};

export default translations;