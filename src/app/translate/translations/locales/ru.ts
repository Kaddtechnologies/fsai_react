const translations = {
    // Settings dialog
    settings: {
      title: "Настройки",
      secondaryTitle: "Еще",
      description: "Настройте свой опыт FlowserveAI. Изменения вступят в силу немедленно.",
      language: "Язык",
      theme: "Тема",
      themeOptions: {
        light: "Светлая",
        dark: "Темная",
        system: "Системная"
      },
      save: "Сохранить изменения",
      saveStatus: {
        success: "Настройки сохранены",
        description: "Ваши настройки успешно обновлены"
      },
      tools: "Инструменты",
      preferences: "Предпочтения",
      darkMode: "Темный режим",
      support: "Помощь и поддержка",
      policies: "Политики",
      selectLanguage: "Выберите язык",
      search: "Поиск языков...",
      noLanguageMatch: "Языки, соответствующие вашему поиску, не найдены"
    },
  
    // Tools section
    tools: {
      documents: "Документы",
      documentsDesc: "Просмотр и управление загруженными документами",
      chat: "Чат",
      chatDesc: "Общайтесь с ИИ-помощником Flowserve",
      jobs: "Перевод",
      jobsDesc: "Переводите текст и документы",
      translate: "Перевести",
      translationModule: "Модуль перевода",
      products: "Продукты"
    },
  
    // Support section
    support: {
      help: "Центр помощи",
      helpDesc: "Получите помощь по использованию Flowserve AI"
    },
  
    // Policies section
    policies: {
      privacy: "Политика конфиденциальности",
      privacyDesc: "Как мы обрабатываем ваши данные",
      ai: "Рекомендации по ИИ",
      aiDesc: "Как мы ответственно используем ИИ"
    },
  
    // Empty state
    emptyState: {
      welcome: "Добро пожаловать в FlowserveAI",
      subtitle: "Безопасно подключайтесь и общайтесь с вашими документами, базой знаний и ИИ в сети Flowserve",
      startTyping: "Начните разговор, набрав текст ниже",
      suggestions: {
        aiChat: {
          category: "Продукты",
          text: "Объясните насос Flowserve IDURCO Mark 3 с высоким содержанием кремния"
        },
        documents: {
          category: "Продукты",
          text: "Как мне эксплуатировать насос Flowserve IDURCO Mark 3 из высококремнистого чугуна?"
        },
        products: {
          category: "Льготы",
          text: "Как мне управлять своими инвестициями 401(k)?"
        }
      }
    },
  
    // Welcome dialog
    welcomeDialog: {
      title: "Добро пожаловать в Flowserve AI",
      subtitle: "Ваша единая платформа для интеллектуальной помощи, анализа документов и знаний о продуктах.",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "Ваш цифровой помощник",
        description: "Ведите естественные беседы, чтобы получать ответы, понимать сложные темы и получать помощь в различных задачах, связанных с предложениями Flowserve.",
        capabilities: {
          root: "Что может сделать для вас Flowserve AI?",
          answer: "Отвечать на вопросы",
          explain: "Предоставлять объяснения",
          assist: "Помогать с задачами"
        }
      },
      // Document section
      documents: {
        title: "Анализ документов",
        subtitle: "Общайтесь с вашими документами",
        maxFileSize: "Максимальный размер файла 5 МБ",
        onlyPDF: "Только PDF-файлы",
        vectorSearch: "Семантический поиск на основе векторов",
        extractInfo: "Извлекайте информацию из документов",
        description: "Загружайте свои документы (PDF) и взаимодействуйте с ними непосредственно в чате. Задавайте конкретные вопросы по их содержанию, получайте сводки и извлекайте информацию с помощью нашей технологии семантического поиска.",
        flow: {
          upload: {
            title: "Загрузить документ",
            description: "Безопасно загружайте свои PDF-файлы."
          },
          conversation: {
            title: "Начать разговор",
            description: "Задавайте вопросы о вашем документе."
          },
          insights: {
            title: "Извлечь полезную информацию",
            description: "Получайте сводки и ключевую информацию."
          }
        }
      },
      // Translation section
      translation: {
        title: "Перевод",
        subtitle: "Многоязычная поддержка",
        description: "Переводите текст и документы между различными языками. Используйте специальный инструмент \"Перевести\" на боковой панели.",
        supportedLanguages: "Поддерживаемые языки для текста:",
        supportedDocTypes: "Поддерживаемые типы документов для модуля перевода (в будущем):",
        videoTutorial: "Видеоурок",
        videoComingSoon: "Видеоурок скоро появится.",
        unsupportedVideo: "Ваш браузер не поддерживает тег video.",
        flow: {
          upload: {
            title: "Загрузить",
            description: "Файлы Word, PowerPoint, Excel, PDF."
          },
          selectLanguage: {
            title: "Выберите язык",
            description: "Выберите целевой язык."
          },
          receiveTranslation: {
            title: "Получить перевод",
            description: "Получите переведенный контент."
          },
          provideFeedback: {
            title: "Оставить отзыв",
            description: "Помогите улучшить будущие переводы."
          }
        }
      }
    },
  
    // Chat-related
    chat: {
      newChat: "Новый чат",
      placeholder: "Введите сообщение...",
      placeholderMobile: "Введите сообщение...",
      send: "Отправить",
      typing: "Flowserve AI печатает...",
      loadMore: "Загрузить еще сообщения",
      emptyConversation: "Начать новый разговор",
      uploadFile: "Загрузить файл",
      today: "Сегодня",
      yesterday: "Вчера",
      deleteMessage: "Удалить это сообщение",
      editMessage: "Редактировать это сообщение",
      copyToClipboard: "Скопировать в буфер обмена",
      copied: "Скопировано в буфер обмена",
      loading: "Загрузка...",
      errorLoading: "Ошибка загрузки разговора",
      messageSent: "Сообщение отправлено",
      documentUploadSuccess: "Документ успешно загружен",
      documentUploadError: "Ошибка загрузки документа",
      documentProcessing: "Обработка документа...",
      documentReady: "Документ готов",
      welcome: "Добро пожаловать в чат FlowserveAI",
      welcomeSubtitle: "Общайтесь с вашими документами, базой знаний и ИИ в сети Flowserve",
      newChatCreated: "Новый чат создан",
      conversationDeleted: "Разговор удален",
      conversationRenamed: "Разговор переименован",
      renameCancelledEmpty: {
        title: "Переименование отменено",
        description: "Новое название не может быть пустым"
      },
      renameCancelledUnchanged: {
        title: "Нет изменений",
        description: "Название осталось прежним"
      },
      renameCancelled: "Переименование отменено",
      messageEdited: "Сообщение отредактировано",
      notFound: "Чат {id} не найден",
      noActiveSession: "Нет активной сессии чата",
      selectOrStartNew: "Пожалуйста, выберите чат на боковой панели или начните новый разговор",
      aiDisclaimer: "Ответы ИИ не всегда могут быть точными. Всегда проверяйте важную информацию.",
      enterNewTitle: "Введите новое название",
      containsDocuments: "Этот разговор содержит документы"
    },
  
    // Documents page
    documentsPage: {
      title: "Мои документы",
      description: "Просматривайте и управляйте всеми вашими загруженными документами.",
      noDocuments: {
        title: "Документы не найдены",
        description: "Вы еще не загрузили ни одного документа. Загрузите документы в любом чате, чтобы увидеть их здесь.",
        action: "Перейти в чат"
      },
      document: {
        uploaded: "Загружено",
        size: "Размер",
        viewSummary: "Просмотреть сводку",
        chatAction: "Обсудить документ"
      },
      loading: "Загрузка..."
    },
  
    // Documents page (used in documents/page.tsx)
    documents: {
      title: "Мои документы",
      description: "Просматривайте и управляйте всеми вашими загруженными документами.",
      noDocumentsFound: "Документы не найдены",
      noDocumentsDesc: "Вы еще не загрузили ни одного документа. Загрузите документы в любом чате, чтобы увидеть их здесь.",
      goToChat: "Перейти в чат",
      uploaded: "Загружено",
      size: "Размер",
      viewSummarySnippet: "Просмотреть фрагмент сводки",
      viewFullSummary: "Просмотреть полную сводку",
      fullSummary: "Полная сводка",
      chatAboutDocument: "Обсудить документ",
      rawMarkdownPreview: "Предварительный просмотр необработанного markdown-текста сводки документа"
    },
  
    // Translation page
    translation: {
      new: "Новое задание на перевод",
      edit: "Редактировать задание",
      noActiveJob: "Нет активного задания",
      createNew: "Создайте новое задание или выберите одно из истории",
      createNewButton: "Создать новое задание",
      jobTitle: "Название задания",
      enterJobTitle: "Введите название задания",
      jobType: "Тип задания",
      selectJobType: "Выберите тип задания",
      textTranslation: "Перевод текста",
      documentTranslation: "Перевод документов",
      sourceLanguage: "Исходный язык",
      selectSourceLanguage: "Выберите исходный язык",
      autoDetect: "Автоопределение",
      targetLanguage: "Целевой язык",
      selectTargetLanguage: "Выберите целевой язык",
      enterTextToTranslate: "Введите текст для перевода...",
      characters: "символов",
      copyText: "Скопировать текст",
      speakText: "Произнести текст",
      translationWillAppear: "Перевод появится здесь...",
      copyTranslation: "Скопировать перевод",
      speakTranslation: "Произнести перевод",
      jobHistory: "История заданий",
      newJob: "Новое задание",
      deleteJob: "Удалить задание",
      cancel: "Отмена",
      save: "Сохранить",
      saved: "Сохранено",
      translate: "Перевести",
      translating: "Перевод...",
      completed: "Завершено",
      
      // Toast messages
      jobSaved: "Задание сохранено",
      jobSavedDesc: "'{name}' успешно сохранено",
      jobDeleted: "Задание удалено",
      jobArchived: "Задание архивировано",
      jobUnarchived: "Задание извлечено из архива",
      copiedToClipboard: "Скопировано в буфер обмена",
      jobTypeSwitched: "Тип задания изменен",
      jobTypeSwitchedDesc: "Предыдущие данные удалены",
      nothingToSave: "Нечего сохранять",
      nothingToSaveDesc: "Нет активного задания для сохранения",
      
      // Error messages
      jobTitleRequired: "Требуется название задания",
      jobTitleRequiredDesc: "Пожалуйста, введите название для этого задания",
      jobTitleRequiredDesc2: "Пожалуйста, введите название перед переводом",
      inputRequired: "Требуется текст",
      inputRequiredDesc: "Пожалуйста, введите текст для перевода",
      errorTitle: "Ошибка",
      errorStartTranslationDesc: "Не удалось начать перевод",
      translationError: "Ошибка перевода",
      translationErrorDesc: "Не удалось завершить перевод",
      
      // Status notifications
      translationComplete: "Перевод завершен",
      translationCompleteDesc: "'{title}' успешно переведен",
      documentJobComplete: "Перевод документа завершен",
      documentJobCompleteDesc: "'{title}' успешно обработан",
      documentJobIssues: "Проблемы с заданием на перевод документа",
      documentJobIssuesDesc: "Возникли проблемы при обработке '{title}'",
      jobUpdated: "Задание обновлено",
      jobUpdatedDesc: "'{title}' обновлено",
      
      // File processing messages
      fileLimitReached: "Достигнут лимит файлов",
      fileLimitReachedDesc: "Максимум {max} файлов на задание",
      invalidFileType: "Недопустимый тип файла",
      invalidFileTypeDesc: "'{fileName}' не поддерживается",
      sizeLimitExceeded: "Превышен лимит размера",
      sizeLimitExceededDesc: "Общий размер превышает {max} МБ",
      fileProcessed: "Файл обработан",
      fileProcessedDesc: "'{fileName}' успешно обработан",
      fileFailed: "Сбой обработки файла",
      fileFailedDesc: "Не удалось обработать '{fileName}'",
      allFilesProcessed: "Все файлы обработаны",
      allFilesProcessedDesc: "Все файлы уже обработаны",
      noFilesUploaded: "Нет загруженных файлов",
      noFilesUploadedDesc: "Пожалуйста, загрузите хотя бы один файл",
      noFilesSelected: "Нет выбранных файлов",
      noFilesSelectedDesc: "Пожалуйста, выберите хотя бы один файл",
      downloadSelectedSimulated: "Симулированная загрузка",
      downloadSelectedSimulatedDesc: "Симулированная загрузка для: {fileList}",
      downloadAllZipSimulated: "Симулированная загрузка ZIP",
      downloadAllZipSimulatedDesc: "Симулированная загрузка {count} файлов в ZIP",
      noTranslatedFiles: "Нет переведенных файлов",
      noTranslatedFilesDesc: "Нет переведенных файлов для этого языка",
      downloadSimulated: "Симулированная загрузка",
      downloadSimulatedDesc: "Симулированная загрузка '{fileName}'"
    },
  
    // Common UI elements
    common: {
      close: "Закрыть",
      chat: "Чат",
      unknownError: "Неизвестная ошибка",
      selectedChat: "Выбранный чат",
      appName: "FlowserveAI",
      invalidDate: "Неверная дата",
      logoAlt: "Flowserve AI"
    },
  
    // Action buttons
    actions: {
      rename: "Переименовать",
      delete: "Удалить",
      cancel: "Отмена",
      close: "Закрыть",
      goToChats: "Перейти в чаты",
      copiedToClipboard: "Скопировано в буфер обмена"
    },
  
    // Sidebar elements
    sidebar: {
      conversations: "Недавние разговоры",
      tools: "Инструменты"
    },
  
    // Account section
    account: {
      myAccount: "Мой аккаунт",
      profile: "Профиль",
      logout: "Выйти"
    },
  
    // Alerts
    alerts: {
      deleteConfirm: {
        title: "Удалить разговор?",
        description: "Вы уверены, что хотите удалить \"{title}\"? Это действие нельзя отменить."
      }
    },
  
    // Document related
    document: {
      viewSummarySnippet: "Просмотреть фрагмент сводки",
      viewFullSummary: "Просмотреть полную сводку",
      defaultName: "документ",
      fullSummaryTitle: "Полная сводка: {docName}"
    },
  
    // File uploads
    uploads: {
      fileTooLarge: {
        title: "Файл слишком большой",
        description: "Максимальный размер файла {maxSize} МБ"
      },
      invalidType: {
        title: "Недопустимый тип файла",
        description: "Разрешенные файлы: {allowed}"
      },
      preparing: "Подготовка {fileName} к загрузке...",
      processingAi: "Обработка {fileName} с помощью ИИ...",
      processingComplete: "Обработка {fileName} завершена",
      processingFailed: "Ошибка обработки {fileName}",
      readingFailed: "Ошибка чтения {fileName}",
      uploadFailed: "Ошибка загрузки {fileName}",
      fileProcessed: "Файл обработан",
      fileProcessedSummary: "{fileName} успешно обработан",
      aiError: "Ошибка обработки ИИ",
      couldNotProcess: "Не удалось обработать {fileName}",
      status: {
        pendingUpload: "Ожидание загрузки...",
        uploading: "Загрузка... {progress}%",
        pendingProcessing: "Ожидание обработки ИИ...",
        processing: "Обработка... {progress}%",
        completed: "Завершено",
        failed: "Ошибка"
      }
    },
  
    // Feedback dialog
    feedback: {
      title: "Отправить отзыв",
      description: "Поделитесь своим опытом использования FlowserveAI. Ваш отзыв поможет нам стать лучше.",
      placeholder: "Расскажите нам о своем опыте...",
      send: "Отправить отзыв",
      cancel: "Отмена",
      sending: "Отправка отзыва...",
      success: "Отзыв успешно отправлен!",
      error: "Не удалось отправить отзыв. Пожалуйста, попробуйте еще раз.",
      characterCount: "{count}/3000",
      minCharacters: "Требуется минимум 100 символов"
    }
  };
  
  export default translations;