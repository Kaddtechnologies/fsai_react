// This is a placeholder translation file for Arabic
// In a production app, these would be properly translated

const translations = {
  // Settings dialog
  settings: {
    title: "الإعدادات",
    secondaryTitle: "المزيد",
    description: "قم بتخصيص تجربة FlowserveAI الخاصة بك. يتم تطبيق التغييرات فوراً.",
    language: "اللغة",
    theme: "المظهر",
    themeOptions: {
      light: "فاتح",
      dark: "داكن",
      system: "النظام"
    },
    save: "حفظ التغييرات",
    saveStatus: {
      success: "تم حفظ الإعدادات",
      description: "تم تحديث إعداداتك بنجاح"
    },
    tools: "الأدوات",
    preferences: "التفضيلات",
    darkMode: "الوضع الداكن",
    support: "المساعدة والدعم",
    policies: "السياسات",
    selectLanguage: "اختر اللغة",
    search: "البحث عن لغات...",
    noLanguageMatch: "لا توجد لغات تطابق بحثك"
  },
  
  // Empty state
  // Tools section
  tools: {
    documents: "المستندات",
    documentsDesc: "عرض وإدارة المستندات المرفوعة",
    chat: "المحادثة",
    chatDesc: "التحدث مع مساعد Flowserve AI",
    jobs: "الترجمة",
    jobsDesc: "ترجمة النصوص والمستندات",
    translate: "ترجمة",
    translationModule: "وحدة الترجمة",
    products: "المنتجات"
  },
  
  // Support section
  support: {
    help: "مركز المساعدة",
    helpDesc: "الحصول على مساعدة لاستخدام Flowserve AI"
  },
  
  // Policies section
  policies: {
    privacy: "سياسة الخصوصية",
    privacyDesc: "كيف نتعامل مع بياناتك",
    ai: "إرشادات الذكاء الاصطناعي",
    aiDesc: "كيف نستخدم الذكاء الاصطناعي بمسؤولية"
  },
  
  // Empty state
  emptyState: {
    welcome: "مرحباً بك في FlowserveAI",
    subtitle: "اتصل وتحدث بأمان مع مستنداتك وقاعدة معرفتك والذكاء الاصطناعي على شبكة Flowserve",
    startTyping: "ابدأ محادثة بالكتابة أدناه",
    suggestions: {
      aiChat: {
        category: "المنتجات",
        text: "اشرح مضخة Flowserve IDURCO Mark 3 عالية السيليكون"
      },
      documents: {
        category: "المنتجات",
        text: "كيف أقوم بتشغيل مضخة Flowserve IDURCO Mark 3 حديد السيليكون العالي؟"
      },
      products: {
        category: "المزايا",
        text: "كيف أقوم بإدارة استثمارات 401(k) الخاصة بي؟"
      }
    }
  },
  
  // Welcome dialog
  welcomeDialog: {
    title: "مرحباً بك في Flowserve AI",
    subtitle: "منصتك الموحدة للدعم الذكي وتحليل المستندات ومعرفة المنتجات.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "مساعدك الرقمي",
      description: "شارك في محادثات طبيعية للحصول على إجابات وفهم الموضوعات المعقدة والحصول على مساعدة في المهام المختلفة المتعلقة بعروض Flowserve.",
      capabilities: {
        root: "ما الذي يمكن أن يفعله Flowserve AI لأجلك؟",
        answer: "الإجابة على الأسئلة",
        explain: "تقديم التفسيرات",
        assist: "المساعدة في المهام"
      }
    },
    // Document section
    documents: {
      title: "تحليل المستندات",
      subtitle: "الدردشة مع مستنداتك",
      maxFileSize: "الحجم الأقصى للملف 5 ميغابايت",
      onlyPDF: "ملفات PDF فقط",
      vectorSearch: "بحث دلالي قائم على المتجهات",
      extractInfo: "استخراج المعلومات من المستندات",
      description: "قم برفع مستنداتك (PDF) والتفاعل معها مباشرة في الدردشة. اطرح أسئلة محددة حول محتواها، واحصل على ملخصات، واستخرج المعلومات باستخدام تقنية البحث الدلالي لدينا.",
      flow: {
        upload: {
          title: "رفع مستند",
          description: "قم برفع ملفات PDF الخاصة بك بأمان."
        },
        conversation: {
          title: "بدء محادثة",
          description: "اطرح أسئلة حول مستندك."
        },
        insights: {
          title: "الحصول على رؤى",
          description: "احصل على ملخصات ومعلومات رئيسية."
        }
      }
    },
    // Translation section
    translation: {
      title: "الترجمة",
      subtitle: "دعم متعدد اللغات",
      description: "ترجمة النصوص والمستندات بين اللغات المختلفة. استخدم أداة \"الترجمة\" المخصصة في الشريط الجانبي.",
      supportedLanguages: "اللغات المدعومة للنص:",
      supportedDocTypes: "أنواع المستندات المدعومة لوحدة الترجمة (قادمة):",
      videoTutorial: "فيديو تعليمي",
      videoComingSoon: "الفيديو التعليمي سيكون متاحاً قريباً.",
      unsupportedVideo: "متصفحك لا يدعم وسم الفيديو.",
      flow: {
        upload: {
          title: "رفع",
          description: "ملفات Word وPowerPoint وExcel وPDF."
        },
        selectLanguage: {
          title: "اختر لغة",
          description: "اختر لغتك المستهدفة."
        },
        receiveTranslation: {
          title: "استلام الترجمة",
          description: "احصل على المحتوى المترجم الخاص بك."
        },
        provideFeedback: {
          title: "تقديم الملاحظات",
          description: "ساعد في تحسين الترجمات المستقبلية."
        }
      }
    }
  },
  
  // Chat-related
  chat: {
    newChat: "محادثة جديدة",
    placeholder: "اكتب رسالة...",
    placeholderMobile: "اكتب رسالة...",
    send: "إرسال",
    typing: "Flowserve AI يكتب...",
    loadMore: "تحميل المزيد من الرسائل",
    emptyConversation: "بدء محادثة جديدة",
    uploadFile: "رفع ملف",
    today: "اليوم",
    yesterday: "أمس",
    deleteMessage: "حذف هذه الرسالة",
    editMessage: "تعديل هذه الرسالة",
    copyToClipboard: "نسخ إلى الحافظة",
    copied: "تم النسخ إلى الحافظة",
    loading: "جاري التحميل...",
    errorLoading: "خطأ في تحميل المحادثة",
    messageSent: "تم إرسال الرسالة",
    documentUploadSuccess: "تم رفع المستند بنجاح",
    documentUploadError: "خطأ في رفع المستند",
    documentProcessing: "جاري معالجة المستند...",
    documentReady: "المستند جاهز",
    welcome: "مرحباً بك في دردشة FlowserveAI",
    welcomeSubtitle: "دردش مع مستنداتك وقاعدة معرفتك والذكاء الاصطناعي على شبكة Flowserve",
    newChatCreated: "تم إنشاء محادثة جديدة",
    conversationDeleted: "تم حذف المحادثة",
    conversationRenamed: "تمت إعادة تسمية المحادثة",
    renameCancelledEmpty: {
      title: "تم إلغاء إعادة التسمية",
      description: "لا يمكن أن يكون العنوان الجديد فارغًا"
    },
    renameCancelledUnchanged: {
      title: "لا يوجد تغيير",
      description: "العنوان لم يتغير"
    },
    renameCancelled: "تم إلغاء إعادة التسمية",
    messageEdited: "تم تعديل الرسالة",
    notFound: "محادثة {id} غير موجودة",
    noActiveSession: "لا توجد جلسة محادثة نشطة",
    selectOrStartNew: "يرجى اختيار محادثة من الشريط الجانبي أو بدء محادثة جديدة",
    aiDisclaimer: "ردود الذكاء الاصطناعي قد لا تكون دقيقة دائمًا. يرجى التحقق دائمًا من المعلومات المهمة.",
    enterNewTitle: "أدخل عنوانًا جديدًا",
    containsDocuments: "تحتوي هذه المحادثة على مستندات"
  },
  
  // Documents page
  documentsPage: {
    title: "مستنداتي",
    description: "تصفح وإدارة جميع المستندات التي قمت برفعها.",
    noDocuments: {
      title: "لم يتم العثور على مستندات",
      description: "لم تقم برفع أي مستندات بعد. قم برفع مستندات في أي محادثة لرؤيتها هنا.",
      action: "الذهاب إلى المحادثة"
    },
    document: {
      uploaded: "تم الرفع",
      size: "الحجم",
      viewSummary: "عرض الملخص",
      chatAction: "الدردشة حول المستند"
    },
    loading: "جاري التحميل..."
  },
  
  // Documents page (used in documents/page.tsx)
  documents: {
    title: "مستنداتي",
    description: "تصفح وإدارة جميع المستندات التي قمت برفعها.",
    noDocumentsFound: "لم يتم العثور على مستندات",
    noDocumentsDesc: "لم تقم برفع أي مستندات بعد. قم برفع مستندات في أي محادثة لرؤيتها هنا.",
    goToChat: "الذهاب إلى المحادثة",
    uploaded: "تم الرفع",
    size: "الحجم",
    viewSummarySnippet: "عرض مقتطف الملخص",
    viewFullSummary: "عرض الملخص الكامل",
    fullSummary: "الملخص الكامل",
    chatAboutDocument: "الدردشة حول المستند",
    rawMarkdownPreview: "معاينة ماركداون خام لملخص المستند"
  },
  
  // Translation page
  translation: {
    new: "مهمة ترجمة جديدة",
    edit: "تعديل المهمة",
    noActiveJob: "لا توجد مهمة نشطة",
    createNew: "قم بإنشاء مهمة جديدة أو اختر واحدة من السجل",
    createNewButton: "إنشاء مهمة جديدة",
    jobTitle: "عنوان المهمة",
    enterJobTitle: "أدخل عنوان المهمة",
    jobType: "نوع المهمة",
    selectJobType: "اختر نوع المهمة",
    textTranslation: "ترجمة نصية",
    documentTranslation: "ترجمة المستندات",
    sourceLanguage: "اللغة المصدر",
    selectSourceLanguage: "اختر اللغة المصدر",
    autoDetect: "كشف تلقائي",
    targetLanguage: "اللغة الهدف",
    selectTargetLanguage: "اختر اللغة الهدف",
    enterTextToTranslate: "أدخل النص المراد ترجمته...",
    characters: "حروف",
    copyText: "نسخ النص",
    speakText: "قراءة النص",
    translationWillAppear: "ستظهر الترجمة هنا...",
    copyTranslation: "نسخ الترجمة",
    speakTranslation: "قراءة الترجمة",
    jobHistory: "سجل المهام",
    newJob: "مهمة جديدة",
    deleteJob: "حذف المهمة",
    cancel: "إلغاء",
    save: "حفظ",
    saved: "تم الحفظ",
    translate: "ترجمة",
    translating: "جاري الترجمة...",
    completed: "مكتمل",
    
    // Toast messages
    jobSaved: "تم حفظ المهمة",
    jobSavedDesc: "تم حفظ '{name}' بنجاح",
    jobDeleted: "تم حذف المهمة",
    jobArchived: "تمت أرشفة المهمة",
    jobUnarchived: "تمت إزالة المهمة من الأرشيف",
    copiedToClipboard: "تم النسخ إلى الحافظة",
    jobTypeSwitched: "تم تغيير نوع المهمة",
    jobTypeSwitchedDesc: "تم مسح البيانات السابقة",
    nothingToSave: "لا شيء للحفظ",
    nothingToSaveDesc: "لا توجد مهمة نشطة للحفظ",
    
    // Error messages
    jobTitleRequired: "عنوان المهمة مطلوب",
    jobTitleRequiredDesc: "الرجاء إدخال عنوان لهذه المهمة",
    jobTitleRequiredDesc2: "الرجاء إدخال عنوان قبل الترجمة",
    inputRequired: "النص مطلوب",
    inputRequiredDesc: "الرجاء إدخال نص للترجمة",
    errorTitle: "خطأ",
    errorStartTranslationDesc: "تعذر بدء الترجمة",
    translationError: "خطأ في الترجمة",
    translationErrorDesc: "تعذر إكمال الترجمة",
    
    // Status notifications
    translationComplete: "اكتملت الترجمة",
    translationCompleteDesc: "تمت ترجمة '{title}' بنجاح",
    documentJobComplete: "اكتملت ترجمة المستند",
    documentJobCompleteDesc: "تمت معالجة '{title}' بنجاح",
    documentJobIssues: "مشاكل في مهمة المستند",
    documentJobIssuesDesc: "واجه '{title}' مشاكل أثناء المعالجة",
    jobUpdated: "تم تحديث المهمة",
    jobUpdatedDesc: "تم تحديث '{title}'",
    
    // File processing messages
    fileLimitReached: "تم الوصول إلى حد الملفات",
    fileLimitReachedDesc: "الحجم الإجمالي يتجاوز {max} ميغابايت",
    invalidFileType: "نوع ملف غير صالح",
    invalidFileTypeDesc: "'{fileName}' غير مدعوم",
    sizeLimitExceeded: "تم تجاوز حد الحجم",
    sizeLimitExceededDesc: "الحجم الإجمالي يتجاوز {max} ميغابايت",
    fileProcessed: "تمت معالجة الملف",
    fileProcessedDesc: "تمت معالجة {fileName} بنجاح",
    fileFailed: "فشلت معالجة الملف",
    fileFailedDesc: "تعذرت معالجة {fileName}",
    allFilesProcessed: "تمت معالجة جميع الملفات",
    allFilesProcessedDesc: "تمت معالجة جميع الملفات بالفعل",
    noFilesUploaded: "لم يتم رفع ملفات",
    noFilesUploadedDesc: "الرجاء رفع ملف واحد على الأقل",
    noFilesSelected: "لم يتم اختيار ملفات",
    noFilesSelectedDesc: "الرجاء تحديد ملف واحد على الأقل",
    downloadSelectedSimulated: "تنزيل محاكى",
    downloadSelectedSimulatedDesc: "تنزيل محاكى لـ: {fileList}",
    downloadAllZipSimulated: "تنزيل ZIP محاكى",
    downloadAllZipSimulatedDesc: "تنزيل محاكى لـ {count} ملفات بصيغة ZIP",
    noTranslatedFiles: "لا توجد ملفات مترجمة",
    noTranslatedFilesDesc: "لا توجد ملفات مترجمة متاحة لهذه اللغة",
    downloadSimulated: "تنزيل محاكى",
    downloadSimulatedDesc: "تنزيل محاكى لـ '{fileName}'",

    // Additional UI elements
    allTypes: "جميع الأنواع",
    textJobs: "مهام نصية",
    documentJobs: "مهام المستندات",
    status: "الحالة",
    filterByStatus: "تصفية حسب الحالة",
    noJobsMatch: "لا توجد مهام تطابق المعايير",
    adjustFilters: "حاول ضبط المرشحات الخاصة بك",
    searchJobs: "البحث عن المهام",
    discardChanges: "تجاهل التغييرات غير المحفوظة؟",
    unsavedChangesDesc: "لديك تغييرات غير محفوظة. هل أنت متأكد من أنك تريد تجاهلها وإلغاء تحرير هذه المهمة؟",
    keepEditing: "متابعة التحرير",
    discardAndReset: "تجاهل وإعادة ضبط",
    deleteJobConfirm: "حذف المهمة؟",
    deleteJobDesc: "هل أنت متأكد من أنك تريد حذف المهمة \"{jobName}\"؟ هذا الإجراء لا يمكن التراجع عنه.",
    maxFiles: "بحد أقصى {max} ملفات. بحد أقصى {size} ميغابايت إجمالاً.",
    browseFiles: "تصفح الملفات",
    selectedFiles: "الملفات المحددة ({count}/{max}):",
    togglePdfDocx: "تبديل PDF→DOCX",
    pdfToDocxTooltip: "تحويل PDF إلى DOCX عند الترجمة",
    removeFile: "إزالة الملف",
    translatedDocuments: "المستندات المترجمة للغة {language}:",
    download: "تنزيل",
    downloadSelected: "تنزيل المحدد",
    downloadAllZip: "تنزيل الكل كملف ZIP",
    translationIssues: "مشاكل الترجمة",
    actionCancelled: "تم إلغاء الإجراء",
    actionCancelledDesc: "تم إلغاء العملية الحالية."
  },
  
  // Language names
  languages: {
    en: "الإنجليزية",
    es: "الإسبانية",
    ta: "التاميلية",
    hi: "الهندية",
    ru: "الروسية",
    fr: "الفرنسية",
    de: "الألمانية",
    it: "الإيطالية",
    pt: "البرتغالية",
    zh: "الصينية (المبسطة)",
    ja: "اليابانية",
    ko: "الكورية",
    ar: "العربية"
  },
  
  // Common UI elements
  common: {
    close: "إغلاق",
    chat: "محادثة",
    unknownError: "خطأ غير معروف",
    selectedChat: "المحادثة المحددة",
    appName: "FlowserveAI",
    invalidDate: "تاريخ غير صالح",
    logoAlt: "Flowserve AI"
  },
  
  // Action buttons
  actions: {
    rename: "إعادة تسمية",
    delete: "حذف",
    cancel: "إلغاء",
    close: "إغلاق",
    goToChats: "الذهاب إلى المحادثات",
    copiedToClipboard: "تم النسخ إلى الحافظة"
  },
  
  // Sidebar elements
  sidebar: {
    conversations: "المحادثات الأخيرة",
    tools: "الأدوات"
  },
  
  // Account section
  account: {
    myAccount: "حسابي",
    profile: "الملف الشخصي",
    logout: "تسجيل الخروج"
  },
  
  // Alerts
  alerts: {
    deleteConfirm: {
      title: "حذف المحادثة؟",
      description: "هل أنت متأكد من أنك تريد حذف \"{title}\"؟ لا يمكن التراجع عن هذا الإجراء."
    }
  },
  
  // Document related
  document: {
    viewSummarySnippet: "عرض مقتطف الملخص",
    viewFullSummary: "عرض الملخص الكامل",
    defaultName: "مستند",
    fullSummaryTitle: "ملخص كامل: {docName}"
  },
  
  // File uploads
  uploads: {
    fileTooLarge: {
      title: "الملف كبير جدًا",
      description: "الحجم الأقصى للملف هو {maxSize} ميغابايت"
    },
    invalidType: {
      title: "نوع ملف غير صالح",
      description: "الملفات المسموح بها: {allowed}"
    },
    preparing: "تحضير {fileName} للرفع...",
    processingAi: "معالجة {fileName} بالذكاء الاصطناعي...",
    processingComplete: "اكتملت معالجة {fileName}",
    processingFailed: "فشلت معالجة {fileName}",
    readingFailed: "فشلت قراءة {fileName}",
    uploadFailed: "فشل رفع {fileName}",
    fileProcessed: "تمت معالجة الملف",
    fileProcessedSummary: "تمت معالجة {fileName} بنجاح",
    aiError: "خطأ في معالجة الذكاء الاصطناعي",
    couldNotProcess: "تعذرت معالجة {fileName}",
    status: {
      pendingUpload: "بانتظار الرفع...",
      uploading: "جاري الرفع... {progress}%",
      pendingProcessing: "بانتظار معالجة الذكاء الاصطناعي...",
      processing: "جاري المعالجة... {progress}%",
      completed: "مكتمل",
      failed: "فشل"
    }
  },
  
  // Feedback dialog
  feedback: {
    title: "إرسال ملاحظات",
    description: "شارك تجربتك مع FlowserveAI. ملاحظاتك تساعدنا في التحسين.",
    placeholder: "أخبرنا عن تجربتك...",
    send: "إرسال الملاحظات",
    cancel: "إلغاء",
    sending: "جاري إرسال الملاحظات...",
    success: "تم إرسال الملاحظات بنجاح!",
    error: "فشل إرسال الملاحظات. يرجى المحاولة مرة أخرى.",
    characterCount: "{count}/3000",
    minCharacters: "مطلوب 100 حرف على الأقل"
  }
};

export default translations;