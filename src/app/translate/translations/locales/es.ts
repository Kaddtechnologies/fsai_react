const translations = {
  // Settings dialog
  settings: {
    title: "Configuración",
    secondaryTitle: "Más",
    description: "Personaliza tu experiencia con FlowserveAI. Los cambios se aplicarán inmediatamente.",
    language: "Idioma",
    theme: "Tema",
    themeOptions: {
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema"
    },
    save: "Guardar cambios",
    saveStatus: {
      success: "Configuración guardada",
      description: "Tu configuración se ha actualizado exitosamente"
    },
    tools: "Herramientas",
    preferences: "Preferencias",
    darkMode: "Modo Oscuro",
    support: "Ayuda y Soporte",
    policies: "Políticas",
    selectLanguage: "Seleccionar Idioma",
    search: "Buscar idiomas...",
    noLanguageMatch: "Ningún idioma coincide con tu búsqueda"
  },
  
  // Tools section
  tools: {
    documents: "Documentos",
    documentsDesc: "Ve y gestiona tus documentos subidos",
    chat: "Chat",
    chatDesc: "Chatea con el asistente de Flowserve AI",
    jobs: "Traducción",
    jobsDesc: "Traduce texto y documentos",
    translate: "Traducir",
    translationModule: "Módulo de Traducción",
    products: "Productos"
  },
  
  // Support section
  support: {
    help: "Centro de Ayuda",
    helpDesc: "Obtén ayuda para usar Flowserve AI"
  },
  
  // Policies section
  policies: {
    privacy: "Política de Privacidad",
    privacyDesc: "Cómo manejamos tus datos",
    ai: "Directrices de IA",
    aiDesc: "Cómo usamos la IA de manera responsable"
  },
  
  // Empty state
  emptyState: {
    welcome: "Bienvenido a FlowserveAI",
    subtitle: "Conecta de forma segura y chatea con tus documentos, base de conocimientos e IA en la red de Flowserve",
    startTyping: "Inicia una conversación escribiendo abajo",
    suggestions: {
      aiChat: {
        category: "Productos",
        text: "Explica la bomba Flowserve IDURCO Mark 3 de alto silicio"
      },
      documents: {
        category: "Productos",
        text: "¿Cómo opero la bomba Flowserve IDURCO Mark 3 de hierro de alto silicio?"
      },
      products: {
        category: "Beneficios",
        text: "¿Cómo gestiono mis inversiones de 401(k)?"
      }
    }
  },
  
  // Welcome dialog
  welcomeDialog: {
    title: "Bienvenido a Flowserve AI",
    subtitle: "Tu plataforma unificada para asistencia inteligente, análisis de documentos y conocimiento de productos.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Tu Asistente Digital",
      description: "Participa en conversaciones naturales para obtener respuestas, entender temas complejos y recibir asistencia con varias tareas relacionadas con las ofertas de Flowserve.",
      capabilities: {
        root: "¿Qué puede hacer Flowserve AI por ti?",
        answer: "Responder preguntas",
        explain: "Proporcionar explicaciones",
        assist: "Asistir con tareas"
      }
    },
    // Document section
    documents: {
      title: "Análisis de Documentos",
      subtitle: "Chatea con tus Documentos",
      maxFileSize: "Tamaño máximo de archivo 5MB",
      onlyPDF: "Solo archivos PDF",
      vectorSearch: "Búsqueda semántica impulsada por vectores",
      extractInfo: "Extraer información de documentos",
      description: "Sube tus documentos (PDFs) e interactúa con ellos directamente en el chat. Haz preguntas específicas sobre su contenido, obtén resúmenes y extrae información con nuestra tecnología de búsqueda semántica.",
      flow: {
        upload: {
          title: "Subir Documento",
          description: "Sube tus archivos PDF de forma segura."
        },
        conversation: {
          title: "Iniciar Conversación",
          description: "Haz preguntas sobre tu documento."
        },
        insights: {
          title: "Extraer Conocimientos",
          description: "Obtén resúmenes e información clave."
        }
      }
    },
    // Translation section
    translation: {
      title: "Traducción",
      subtitle: "Soporte Multiidioma",
      description: "Traduce texto y documentos entre varios idiomas. Usa la herramienta dedicada \"Traducir\" en la barra lateral.",
      supportedLanguages: "Idiomas Soportados para Texto:",
      supportedDocTypes: "Tipos de Documentos Soportados para el Módulo de Traducción (Futuro):",
      videoTutorial: "Tutorial en Video",
      videoComingSoon: "Tutorial en video próximamente.",
      unsupportedVideo: "Tu navegador no soporta la etiqueta de video.",
      flow: {
        upload: {
          title: "Subir",
          description: "Archivos Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Seleccionar Idioma",
          description: "Elige tu idioma de destino."
        },
        receiveTranslation: {
          title: "Recibir Traducción",
          description: "Obtén tu contenido traducido."
        },
        provideFeedback: {
          title: "Proporcionar Comentarios",
          description: "Ayuda a mejorar futuras traducciones."
        }
      }
    }
  },
  
  // Chat-related
  chat: {
    newChat: "Nuevo Chat",
    placeholder: "Escribe un mensaje...",
    placeholderMobile: "Escribe un mensaje...",
    send: "Enviar",
    typing: "Flowserve AI está escribiendo...",
    loadMore: "Cargar más mensajes",
    emptyConversation: "Iniciar una nueva conversación",
    uploadFile: "Subir un archivo",
    today: "Hoy",
    yesterday: "Ayer",
    deleteMessage: "Eliminar este mensaje",
    editMessage: "Editar este mensaje",
    copyToClipboard: "Copiar al portapapeles",
    copied: "Copiado al portapapeles",
    loading: "Cargando...",
    errorLoading: "Error al cargar la conversación",
    messageSent: "Mensaje enviado",
    documentUploadSuccess: "Documento subido exitosamente",
    documentUploadError: "Error al subir documento",
    documentProcessing: "Procesando documento...",
    documentReady: "Documento listo",
    welcome: "Bienvenido al Chat de FlowserveAI",
    welcomeSubtitle: "Chatea con tus documentos, base de conocimientos e IA en la red de Flowserve",
    newChatCreated: "Nuevo chat creado",
    conversationDeleted: "Conversación eliminada",
    conversationRenamed: "Conversación renombrada",
    renameCancelledEmpty: {
      title: "Renombrar cancelado",
      description: "El nuevo título no puede estar vacío"
    },
    renameCancelledUnchanged: {
      title: "Sin cambios",
      description: "El título permanece sin cambios"
    },
    renameCancelled: "Renombrar cancelado",
    messageEdited: "Mensaje editado",
    notFound: "Chat {id} no encontrado",
    noActiveSession: "No hay sesión de chat activa",
    selectOrStartNew: "Por favor selecciona un chat de la barra lateral o inicia una nueva conversación",
    aiDisclaimer: "Las respuestas de IA pueden no ser siempre precisas. Siempre verifica información importante.",
    enterNewTitle: "Ingresa nuevo título",
    containsDocuments: "Esta conversación contiene documentos",
  },
  
  // Documents page
  documentsPage: {
    title: "Mis Documentos",
    description: "Navega y gestiona todos tus documentos subidos.",
    noDocuments: {
      title: "No se encontraron documentos",
      description: "Aún no has subido ningún documento. Sube documentos en cualquier chat para verlos aquí.",
      action: "Ir al Chat"
    },
    document: {
      uploaded: "Subido",
      size: "Tamaño",
      viewSummary: "Ver Resumen",
      chatAction: "Chatear sobre Documento"
    },
    loading: "Cargando..."
  },
  
  // Documents page (used in documents/page.tsx)
  documents: {
    title: "Mis Documentos",
    description: "Navega y gestiona todos tus documentos subidos.",
    noDocumentsFound: "No se encontraron documentos",
    noDocumentsDesc: "Aún no has subido ningún documento. Sube documentos en cualquier chat para verlos aquí.",
    goToChat: "Ir al Chat",
    uploaded: "Subido",
    size: "Tamaño",
    viewSummarySnippet: "Ver fragmento de resumen",
    viewFullSummary: "Ver resumen completo",
    fullSummary: "Resumen Completo",
    chatAboutDocument: "Chatear sobre Documento",
    rawMarkdownPreview: "Vista previa en markdown del resumen del documento"
  },
  
  // Translation page
  translation: {
    new: "Nuevo Trabajo de Traducción",
    edit: "Editar Trabajo",
    noActiveJob: "No hay Trabajo Activo",
    createNew: "Crea un nuevo trabajo o selecciona uno del historial",
    createNewButton: "Crear Nuevo Trabajo",
    jobTitle: "Título del Trabajo",
    enterJobTitle: "Ingresa título del trabajo",
    jobType: "Tipo de Trabajo",
    selectJobType: "Selecciona tipo de trabajo",
    textTranslation: "Traducción de Texto",
    documentTranslation: "Traducción de Documento",
    sourceLanguage: "Idioma Origen",
    selectSourceLanguage: "Selecciona idioma origen",
    autoDetect: "Detección automática",
    targetLanguage: "Idioma Destino",
    selectTargetLanguage: "Selecciona idioma destino",
    enterTextToTranslate: "Ingresa texto a traducir...",
    characters: "caracteres",
    copyText: "Copiar texto",
    speakText: "Hablar texto",
    translationWillAppear: "La traducción aparecerá aquí...",
    copyTranslation: "Copiar traducción",
    speakTranslation: "Hablar traducción",
    jobHistory: "Historial de Trabajos",
    newJob: "Nuevo Trabajo",
    deleteJob: "Eliminar Trabajo",
    cancel: "Cancelar",
    save: "Guardar",
    saved: "Guardado",
    translate: "Traducir",
    translating: "Traduciendo...",
    completed: "Completado",
    
    // Add more translation keys
    allTypes: "Todos los Tipos",
    textJobs: "Trabajos de Texto",
    documentJobs: "Trabajos de Documento",
    status: "Estado",
    filterByStatus: "Filtrar por Estado",
    noJobsMatch: "Ningún trabajo coincide con los criterios",
    adjustFilters: "Intenta ajustar tus filtros",
    searchJobs: "Buscar trabajos",
    discardChanges: "¿Descartar Cambios No Guardados?",
    unsavedChangesDesc: "Tienes cambios no guardados. ¿Estás seguro de que quieres descartarlos y cancelar la edición de este trabajo?",
    keepEditing: "Seguir Editando",
    discardAndReset: "Descartar y Reiniciar",
    deleteJobConfirm: "¿Eliminar Trabajo?",
    deleteJobDesc: "¿Estás seguro de que quieres eliminar el trabajo \"{jobName}\"? Esta acción no se puede deshacer.",
    maxFiles: "Máx {max} archivos. Máx {size}MB total.",
    browseFiles: "Explorar Archivos",
    selectedFiles: "Archivos Seleccionados ({count}/{max}):",
    togglePdfDocx: "Alternar PDF→DOCX",
    pdfToDocxTooltip: "Convertir PDF a DOCX en traducción",
    removeFile: "Eliminar archivo",
    translatedDocuments: "Documentos Traducidos para {language}:",
    download: "Descargar",
    downloadSelected: "Descargar Seleccionados",
    downloadAllZip: "Descargar Todo como ZIP",
    translationIssues: "Problemas de Traducción",
    actionCancelled: "Acción Cancelada",
    actionCancelledDesc: "La operación actual fue cancelada.",
    
    // Adding toast messages
    nothingToSave: "Nada que guardar",
    nothingToSaveDesc: "Crea o selecciona un trabajo para guardar.",
    jobTitleRequired: "Título del trabajo requerido",
    jobTitleRequiredDesc: "Por favor ingresa un título para el trabajo.",
    jobTitleRequiredDesc2: "Por favor ingresa un título para el trabajo antes de traducir.",
    jobSaved: "Trabajo Guardado",
    jobSavedDesc: "Trabajo \"{name}\" guardado.",
    
    // Translation job errors/notifications
    inputRequired: "Entrada requerida",
    inputRequiredDesc: "Por favor ingresa texto para traducir.",
    errorTitle: "Error",
    errorStartTranslationDesc: "No se pudo iniciar la traducción. Trabajo activo no encontrado.",
    translationComplete: "Traducción Completada",
    translationCompleteDesc: "Trabajo \"{title}\" terminado.",
    translationError: "Error de Traducción",
    translationErrorDesc: "No se pudo traducir el texto.",
    
    // File processing messages
    fileProcessed: "Archivo Procesado",
    fileProcessedDesc: "Traducción de {fileName} completada (simulada).",
    fileFailed: "Archivo Falló",
    fileFailedDesc: "{fileName} falló al traducir (simulado).",
    
    // Document translation messages
    allFilesProcessed: "Todos los archivos procesados o en progreso",
    allFilesProcessedDesc: "No hay nuevos archivos para traducir en este trabajo.",
    noFilesUploaded: "No hay archivos subidos",
    noFilesUploadedDesc: "Por favor sube documentos para traducir.",
    
    // File issues
    fileLimitReached: "Límite de archivos alcanzado",
    fileLimitReachedDesc: "Máximo {max} archivos por trabajo.",
    invalidFileType: "Tipo de archivo inválido",
    invalidFileTypeDesc: "{fileName} no es un tipo de documento soportado.",
    sizeLimitExceeded: "Límite de tamaño excedido",
    sizeLimitExceededDesc: "El tamaño total de carga no puede exceder {max}MB.",
    
    // Document job notifications
    jobTypeSwitched: "Tipo de trabajo cambiado",
    jobTypeSwitchedDesc: "Cambiado a modo de Traducción de Documentos.",
    documentJobComplete: "Trabajo de Traducción de Documentos Completado",
    documentJobCompleteDesc: "Trabajo \"{title}\" terminó de procesar todos los archivos.",
    documentJobIssues: "Problemas en Trabajo de Traducción de Documentos",
    documentJobIssuesDesc: "Trabajo \"{title}\" completado con algunos errores.",
    jobUpdated: "Trabajo Actualizado",
    jobUpdatedDesc: "Estado del trabajo \"{title}\" actualizado.",
    
    // Download actions
    downloadSimulated: "Descarga (Simulada)",
    downloadSimulatedDesc: "Se descargaría {fileName}",
    noFilesSelected: "No hay archivos seleccionados",
    noFilesSelectedDesc: "Por favor selecciona archivos para descargar.",
    downloadSelectedSimulated: "Descarga Seleccionada (Simulada)",
    downloadSelectedSimulatedDesc: "Simulando descarga de: {fileList}",
    downloadAllZipSimulated: "Descargar Todo como ZIP (Simulado)",
    downloadAllZipSimulatedDesc: "Simulando descarga ZIP para todos los {count} archivos.",
    noTranslatedFiles: "No hay archivos traducidos",
    noTranslatedFilesDesc: "No hay archivos traducidos para descargar.",
    
    // Deletion
    jobDeleted: "Trabajo Eliminado",
    
    // Archive actions
    jobArchived: "Trabajo Archivado",
    jobUnarchived: "Trabajo Desarchivado",
    
    // Copied message
    copiedToClipboard: "Copiado al portapapeles"
  },
  
  // Common UI elements
  common: {
    close: "Cerrar",
    chat: "Chat",
    unknownError: "Error desconocido",
    selectedChat: "Chat Seleccionado",
    appName: "FlowserveAI",
    invalidDate: "Fecha inválida",
    logoAlt: "Flowserve AI"
  },
  
  // Action buttons
  actions: {
    rename: "Renombrar",
    delete: "Eliminar",
    cancel: "Cancelar",
    close: "Cerrar",
    goToChats: "Ir a Chats",
    copiedToClipboard: "Copiado al portapapeles"
  },
  
  // Sidebar elements
  sidebar: {
    conversations: "Conversaciones Recientes",
    tools: "Herramientas"
  },
  
  // Account section
  account: {
    myAccount: "Mi Cuenta",
    profile: "Perfil",
    logout: "Cerrar Sesión"
  },
  
  // Alerts
  alerts: {
    deleteConfirm: {
      title: "¿Eliminar Conversación?",
      description: "¿Estás seguro de que quieres eliminar \"{title}\"? Esto no se puede deshacer."
    }
  },
  
  // Document related
  document: {
    viewSummarySnippet: "Ver fragmento de resumen",
    viewFullSummary: "Ver resumen completo",
    defaultName: "documento",
    fullSummaryTitle: "Resumen Completo: {docName}"
  },
  
  // File uploads
  uploads: {
    fileTooLarge: {
      title: "Archivo Demasiado Grande",
      description: "El tamaño máximo de archivo es {maxSize}MB"
    },
    invalidType: {
      title: "Tipo de Archivo Inválido",
      description: "Archivos permitidos: {allowed}"
    },
    preparing: "Preparando {fileName} para subir...",
    processingAi: "Procesando {fileName} con IA...",
    processingComplete: "Procesamiento de {fileName} completado",
    processingFailed: "Procesamiento de {fileName} falló",
    readingFailed: "Lectura de {fileName} falló",
    uploadFailed: "Subida de {fileName} falló",
    fileProcessed: "Archivo Procesado",
    fileProcessedSummary: "Procesó {fileName} exitosamente",
    aiError: "Error de Procesamiento de IA",
    couldNotProcess: "No se pudo procesar {fileName}",
    status: {
      pendingUpload: "Subida pendiente...",
      uploading: "Subiendo... {progress}%",
      pendingProcessing: "Procesamiento de IA pendiente...",
      processing: "Procesando... {progress}%",
      completed: "Completado",
      failed: "Falló"
    }
  },
  
  // Feedback dialog
  feedback: {
    title: "Enviar Comentarios",
    description: "Comparte tu experiencia con FlowserveAI. Tus comentarios nos ayudan a mejorar.",
    placeholder: "Cuéntanos sobre tu experiencia...",
    send: "Enviar Comentarios",
    cancel: "Cancelar",
    sending: "Enviando comentarios...",
    success: "¡Comentarios enviados exitosamente!",
    error: "Error al enviar comentarios. Por favor intenta de nuevo.",
    characterCount: "{count}/3000",
    minCharacters: "Se requieren mínimo 100 caracteres"
  }
};

export default translations;