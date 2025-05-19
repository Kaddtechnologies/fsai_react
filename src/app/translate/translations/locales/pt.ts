const translations = {
  // Settings dialog
  settings: {
    title: "Configurações",
    secondaryTitle: "Mais",
    description: "Personalize sua experiência FlowserveAI. As alterações serão aplicadas imediatamente.",
    language: "Idioma",
    theme: "Tema",
    themeOptions: {
      light: "Claro",
      dark: "Escuro",
      system: "Sistema"
    },
    save: "Salvar alterações",
    saveStatus: {
      success: "Configurações salvas",
      description: "Suas configurações foram atualizadas com sucesso"
    },
    tools: "Ferramentas",
    preferences: "Preferências",
    darkMode: "Modo Escuro",
    support: "Ajuda e Suporte",
    policies: "Políticas",
    selectLanguage: "Selecionar Idioma",
    search: "Pesquisar idiomas...",
    noLanguageMatch: "Nenhum idioma corresponde à sua pesquisa"
  },

  // Tools section
  tools: {
    documents: "Documentos",
    documentsDesc: "Visualize e gerencie seus documentos carregados",
    chat: "Chat",
    chatDesc: "Converse com o assistente Flowserve AI",
    jobs: "Tradução",
    jobsDesc: "Traduza textos e documentos",
    translate: "Traduzir",
    translationModule: "Módulo de Tradução",
    products: "Produtos"
  },

  // Support section
  support: {
    help: "Central de Ajuda",
    helpDesc: "Obtenha ajuda para usar o Flowserve AI"
  },

  // Policies section
  policies: {
    privacy: "Política de Privacidade",
    privacyDesc: "Como lidamos com seus dados",
    ai: "Diretrizes de IA",
    aiDesc: "Como usamos IA com responsabilidade"
  },

  // Empty state
  emptyState: {
    welcome: "Bem-vindo ao FlowserveAI",
    subtitle: "Conecte-se e converse com segurança com seus documentos, base de conhecimento e IA na Rede Flowserve",
    startTyping: "Comece uma conversa digitando abaixo",
    suggestions: {
      aiChat: {
        category: "Produtos",
        text: "Explique a bomba de alta sílica Flowserve IDURCO Mark 3"
      },
      documents: {
        category: "Produtos",
        text: "Como opero a bomba de ferro com alto teor de silício Flowserve IDURCO Mark 3?"
      },
      products: {
        category: "Benefícios",
        text: "Como gerencio meus investimentos 401(k)?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Bem-vindo ao Flowserve AI",
    subtitle: "Sua plataforma unificada para assistência inteligente, análise de documentos e conhecimento de produtos.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Seu Assistente Digital",
      description: "Participe de conversas naturais para obter respostas, entender tópicos complexos e receber assistência com várias tarefas relacionadas às ofertas da Flowserve.",
      capabilities: {
        root: "O que o Flowserve AI pode fazer por você?",
        answer: "Responder perguntas",
        explain: "Fornecer explicações",
        assist: "Ajudar com tarefas"
      }
    },
    // Document section
    documents: {
      title: "Análise de Documentos",
      subtitle: "Converse com Seus Documentos",
      maxFileSize: "Tamanho Máximo do Arquivo 5MB",
      onlyPDF: "Apenas arquivos PDF",
      vectorSearch: "Pesquisa semântica com tecnologia vetorial",
      extractInfo: "Extrair informações de documentos",
      description: "Carregue seus documentos (PDFs) e interaja com eles diretamente no chat. Faça perguntas específicas sobre o conteúdo deles, obtenha resumos e extraia informações com nossa tecnologia de pesquisa semântica.",
      flow: {
        upload: {
          title: "Carregar Documento",
          description: "Carregue seus arquivos PDF com segurança."
        },
        conversation: {
          title: "Iniciar Conversa",
          description: "Faça perguntas sobre seu documento."
        },
        insights: {
          title: "Extrair Insights",
          description: "Obtenha resumos e informações importantes."
        }
      }
    },
    // Translation section
    translation: {
      title: "Tradução",
      subtitle: "Suporte Multilíngue",
      description: "Traduza textos e documentos entre vários idiomas. Use a ferramenta dedicada \"Traduzir\" na barra lateral.",
      supportedLanguages: "Idiomas Suportados para Texto:",
      supportedDocTypes: "Tipos de Documentos Suportados para o Módulo de Tradução (Futuro):",
      videoTutorial: "Tutorial em Vídeo",
      videoComingSoon: "Tutorial em vídeo em breve.",
      unsupportedVideo: "Seu navegador não suporta a tag de vídeo.",
      flow: {
        upload: {
          title: "Carregar",
          description: "Arquivos Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Selecionar Idioma",
          description: "Escolha o idioma de destino."
        },
        receiveTranslation: {
          title: "Receber Tradução",
          description: "Obtenha seu conteúdo traduzido."
        },
        provideFeedback: {
          title: "Fornecer Feedback",
          description: "Ajude a melhorar futuras traduções."
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "Novo Chat",
    placeholder: "Digite uma mensagem...",
    placeholderMobile: "Digite uma mensagem...",
    send: "Enviar",
    typing: "Flowserve AI está digitando...",
    loadMore: "Carregar mais mensagens",
    emptyConversation: "Iniciar uma nova conversa",
    uploadFile: "Carregar um arquivo",
    today: "Hoje",
    yesterday: "Ontem",
    deleteMessage: "Excluir esta mensagem",
    editMessage: "Editar esta mensagem",
    copyToClipboard: "Copiar para a área de transferência",
    copied: "Copiado para a área de transferência",
    loading: "Carregando...",
    errorLoading: "Erro ao carregar conversa",
    messageSent: "Mensagem enviada",
    documentUploadSuccess: "Documento carregado com sucesso",
    documentUploadError: "Erro ao carregar documento",
    documentProcessing: "Processando documento...",
    documentReady: "Documento pronto",
    welcome: "Bem-vindo ao Chat FlowserveAI",
    welcomeSubtitle: "Converse com seus documentos, base de conhecimento e IA na Rede Flowserve",
    newChatCreated: "Novo chat criado",
    conversationDeleted: "Conversa excluída",
    conversationRenamed: "Conversa renomeada",
    renameCancelledEmpty: {
      title: "Renomeação cancelada",
      description: "O novo título não pode estar vazio"
    },
    renameCancelledUnchanged: {
      title: "Sem alterações",
      description: "O título permanece inalterado"
    },
    renameCancelled: "Renomeação cancelada",
    messageEdited: "Mensagem editada",
    notFound: "Chat {id} não encontrado",
    noActiveSession: "Nenhuma sessão de chat ativa",
    selectOrStartNew: "Selecione um chat na barra lateral ou inicie uma nova conversa",
    aiDisclaimer: "As respostas da IA podem nem sempre ser precisas. Sempre verifique informações importantes.",
    enterNewTitle: "Digite o novo título",
    containsDocuments: "Esta conversa contém documentos"
  },

  // Documents page
  documentsPage: {
    title: "Meus Documentos",
    description: "Navegue e gerencie todos os seus documentos carregados.",
    noDocuments: {
      title: "Nenhum Documento Encontrado",
      description: "Você ainda não carregou nenhum documento. Carregue documentos em qualquer chat para vê-los aqui.",
      action: "Ir para o Chat"
    },
    document: {
      uploaded: "Carregado",
      size: "Tamanho",
      viewSummary: "Ver Resumo",
      chatAction: "Conversar sobre o Documento"
    },
    loading: "Carregando..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "Meus Documentos",
    description: "Navegue e gerencie todos os seus documentos carregados.",
    noDocumentsFound: "Nenhum Documento Encontrado",
    noDocumentsDesc: "Você ainda não carregou nenhum documento. Carregue documentos em qualquer chat para vê-los aqui.",
    goToChat: "Ir para o Chat",
    uploaded: "Carregado",
    size: "Tamanho",
    viewSummarySnippet: "Ver trecho do resumo",
    viewFullSummary: "Ver resumo completo",
    fullSummary: "Resumo Completo",
    chatAboutDocument: "Conversar sobre o Documento",
    rawMarkdownPreview: "Pré-visualização markdown bruta do resumo do documento"
  },

  // Translation page
  translation: {
    new: "Novo Trabalho de Tradução",
    edit: "Editar Trabalho",
    noActiveJob: "Nenhum Trabalho Ativo",
    createNew: "Crie um novo trabalho ou selecione um do histórico",
    createNewButton: "Criar Novo Trabalho",
    jobTitle: "Título do Trabalho",
    enterJobTitle: "Digite o título do trabalho",
    jobType: "Tipo de Trabalho",
    selectJobType: "Selecione o tipo de trabalho",
    textTranslation: "Tradução de Texto",
    documentTranslation: "Tradução de Documento",
    sourceLanguage: "Idioma de Origem",
    selectSourceLanguage: "Selecione o idioma de origem",
    autoDetect: "Detectar automaticamente",
    targetLanguage: "Idioma de Destino",
    selectTargetLanguage: "Selecione o idioma de destino",
    enterTextToTranslate: "Digite o texto para traduzir...",
    characters: "caracteres",
    copyText: "Copiar texto",
    speakText: "Falar texto",
    translationWillAppear: "A tradução aparecerá aqui...",
    copyTranslation: "Copiar tradução",
    speakTranslation: "Falar tradução",
    jobHistory: "Histórico de Trabalhos",
    newJob: "Novo Trabalho",
    deleteJob: "Excluir Trabalho",
    cancel: "Cancelar",
    save: "Salvar",
    saved: "Salvo",
    translate: "Traduzir",
    translating: "Traduzindo...",
    completed: "Concluído",
    
    // Toast messages
    jobSaved: "Trabalho salvo",
    jobSavedDesc: "'{name}' foi salvo com sucesso",
    jobDeleted: "Trabalho excluído",
    jobArchived: "Trabalho arquivado",
    jobUnarchived: "Trabalho desarquivado",
    copiedToClipboard: "Copiado para a área de transferência",
    jobTypeSwitched: "Tipo de trabalho alterado",
    jobTypeSwitchedDesc: "Dados anteriores foram excluídos",
    nothingToSave: "Nada para salvar",
    nothingToSaveDesc: "Nenhum trabalho ativo para salvar",
    
    // Error messages
    jobTitleRequired: "Título do trabalho obrigatório",
    jobTitleRequiredDesc: "Por favor, insira um título para este trabalho",
    jobTitleRequiredDesc2: "Por favor, insira um título antes de traduzir",
    inputRequired: "Texto obrigatório",
    inputRequiredDesc: "Por favor, insira um texto para traduzir",
    errorTitle: "Erro",
    errorStartTranslationDesc: "Não foi possível iniciar a tradução",
    translationError: "Erro de tradução",
    translationErrorDesc: "Não foi possível concluir a tradução",
    
    // Status notifications
    translationComplete: "Tradução concluída",
    translationCompleteDesc: "'{title}' foi traduzido com sucesso",
    documentJobComplete: "Tradução de documento concluída",
    documentJobCompleteDesc: "'{title}' foi processado com sucesso",
    documentJobIssues: "Problemas no trabalho de documento",
    documentJobIssuesDesc: "Encontrou problemas ao processar '{title}'",
    jobUpdated: "Trabalho atualizado",
    jobUpdatedDesc: "'{title}' foi atualizado",
    
    // File processing messages
    fileLimitReached: "Limite de arquivo atingido",
    fileLimitReachedDesc: "Máximo de {max} arquivos por trabalho",
    invalidFileType: "Tipo de arquivo inválido",
    invalidFileTypeDesc: "'{fileName}' não é suportado",
    sizeLimitExceeded: "Limite de tamanho excedido",
    sizeLimitExceededDesc: "Tamanho total excede {max} MB",
    fileProcessed: "Arquivo processado",
    fileProcessedDesc: "'{fileName}' foi processado com sucesso",
    fileFailed: "Falha no processamento do arquivo",
    fileFailedDesc: "Não foi possível processar '{fileName}'",
    allFilesProcessed: "Todos os arquivos processados",
    allFilesProcessedDesc: "Todos os arquivos já foram processados",
    noFilesUploaded: "Nenhum arquivo carregado",
    noFilesUploadedDesc: "Por favor, carregue pelo menos um arquivo",
    noFilesSelected: "Nenhum arquivo selecionado",
    noFilesSelectedDesc: "Por favor, selecione pelo menos um arquivo",
    downloadSelectedSimulated: "Download simulado",
    downloadSelectedSimulatedDesc: "Download simulado para: {fileList}",
    downloadAllZipSimulated: "Download ZIP simulado",
    downloadAllZipSimulatedDesc: "Download simulado de {count} arquivos como ZIP",
    noTranslatedFiles: "Sem arquivos traduzidos",
    noTranslatedFilesDesc: "Não há arquivos traduzidos para este idioma",
    downloadSimulated: "Download simulado",
    downloadSimulatedDesc: "Download simulado de '{fileName}'"
  },

  // Common UI elements
  common: {
    close: "Fechar",
    chat: "Chat",
    unknownError: "Erro desconhecido",
    selectedChat: "Chat Selecionado",
    appName: "FlowserveAI",
    invalidDate: "Data inválida",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "Renomear",
    delete: "Excluir",
    cancel: "Cancelar",
    close: "Fechar",
    goToChats: "Ir para Chats",
    copiedToClipboard: "Copiado para a área de transferência"
  },

  // Sidebar elements
  sidebar: {
    conversations: "Conversas Recentes",
    tools: "Ferramentas"
  },

  // Account section
  account: {
    myAccount: "Minha Conta",
    profile: "Perfil",
    logout: "Sair"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "Excluir Conversa?",
      description: "Tem certeza de que deseja excluir \"{title}\"? Isso não pode ser desfeito."
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "Ver trecho do resumo",
    viewFullSummary: "Ver resumo completo",
    defaultName: "documento",
    fullSummaryTitle: "Resumo Completo: {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "Arquivo Muito Grande",
      description: "O tamanho máximo do arquivo é {maxSize}MB"
    },
    invalidType: {
      title: "Tipo de Arquivo Inválido",
      description: "Arquivos permitidos: {allowed}"
    },
    preparing: "Preparando {fileName} para upload...",
    processingAi: "Processando {fileName} com IA...",
    processingComplete: "O processamento de {fileName} está completo",
    processingFailed: "Falha no processamento de {fileName}",
    readingFailed: "Falha na leitura de {fileName}",
    uploadFailed: "Falha no upload de {fileName}",
    fileProcessed: "Arquivo Processado",
    fileProcessedSummary: "{fileName} processado com sucesso",
    aiError: "Erro de Processamento de IA",
    couldNotProcess: "Não foi possível processar {fileName}",
    status: {
      pendingUpload: "Upload pendente...",
      uploading: "Carregando... {progress}%",
      pendingProcessing: "Processamento de IA pendente...",
      processing: "Processando... {progress}%",
      completed: "Concluído",
      failed: "Falhou"
    }
  },

  // Feedback dialog
  feedback: {
    title: "Enviar Feedback",
    description: "Compartilhe sua experiência com o FlowserveAI. Seu feedback nos ajuda a melhorar.",
    placeholder: "Conte-nos sobre sua experiência...",
    send: "Enviar Feedback",
    cancel: "Cancelar",
    sending: "Enviando feedback...",
    success: "Feedback enviado com sucesso!",
    error: "Falha ao enviar feedback. Tente novamente.",
    characterCount: "{count}/3000",
    minCharacters: "Mínimo de 100 caracteres obrigatório"
  }
};

export default translations;