// This is a placeholder translation file for Arabic
// In a production app, these would be properly translated

const translations = {
  // Settings dialog
  settings: {
    title: "الإعدادات",
    secondaryTitle: "المزيد",
    description: "قم بتخصيص تجربة FlowserveAI الخاصة بك. سيتم تطبيق التغييرات على الفور.",
    language: "اللغة",
    theme: "المظهر",
    themeOptions: {
      light: "فاتح",
      dark: "داكن",
      system: "نظام"
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
    search: "البحث عن اللغات...",
    noLanguageMatch: "لا توجد لغات تطابق بحثك"
  },
  
  // Empty state
  // Tools section
  tools: {
    documents: "المستندات",
    documentsDesc: "عرض وإدارة المستندات التي قمت بتحميلها",
    chat: "الدردشة",
    chatDesc: "الدردشة مع مساعد Flowserve للذكاء الاصطناعي",
    jobs: "الترجمة",
    jobsDesc: "ترجمة النصوص والمستندات",
    translate: "ترجمة",
    translationModule: "وحدة الترجمة",
    products: "المنتجات"
  },
  
  // Support section
  support: {
    help: "مركز المساعدة",
    helpDesc: "الحصول على مساعدة في استخدام Flowserve AI"
  },
  
  // Policies section
  policies: {
    privacy: "سياسة الخصوصية",
    privacyDesc: "كيفية التعامل مع بياناتك",
    ai: "إرشادات الذكاء الاصطناعي",
    aiDesc: "كيفية استخدامنا للذكاء الاصطناعي بمسؤولية"
  },
  
  // Empty state
  emptyState: {
    welcome: "مرحبًا بك في FlowserveAI",
    subtitle: "اتصل بشكل آمن وتحدث مع المستندات الخاصة بك وقاعدة المعرفة والذكاء الاصطناعي على شبكة Flowserve",
    startTyping: "ابدأ محادثة من خلال الكتابة أدناه",
    suggestions: {
      aiChat: {
        category: "دردشة الذكاء الاصطناعي",
        text: "كيف تعمل المضخات الطاردة المركزية؟"
      },
      documents: {
        category: "المستندات",
        text: "تلخيص مستندات الصيانة الخاصة بي"
      },
      products: {
        category: "المنتجات",
        text: "البحث عن صمامات التحكم في التدفق"
      }
    }
  },
  
  // Welcome dialog
  welcomeDialog: {
    title: "مرحبًا بك في Flowserve AI",
    subtitle: "منصتك الموحدة للمساعدة الذكية وتحليل المستندات ومعرفة المنتجات.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "مساعدك الرقمي",
      description: "شارك في محادثات طبيعية للحصول على إجابات وفهم المواضيع المعقدة وتلقي المساعدة في المهام المختلفة المتعلقة بعروض Flowserve.",
      capabilities: {
        root: "ماذا يمكن أن يفعل Flowserve AI من أجلك؟",
        answer: "الإجابة على الأسئلة",
        explain: "تقديم التفسيرات",
        assist: "المساعدة في المهام"
      }
    },
    // Document section
    documents: {
      title: "تحليل المستند",
      subtitle: "الدردشة مع مستنداتك",
      maxFileSize: "الحد الأقصى لحجم الملف 5 ميجابايت",
      onlyPDF: "ملفات PDF فقط",
      vectorSearch: "بحث دلالي مدعوم بالمتجهات",
      description: "قم بتحميل مستنداتك (ملفات PDF) وتفاعل معها مباشرة في الدردشة. اطرح أسئلة محددة حول محتواها، واحصل على ملخصات، واستخرج المعلومات باستخدام تقنية البحث الدلالي لدينا.",
      flow: {
        upload: {
          title: "تحميل المستند",
          description: "قم بتحميل ملفات PDF الخاصة بك بشكل آمن."
        },
        conversation: {
          title: "بدء المحادثة",
          description: "اطرح أسئلة حول المستند الخاص بك."
        },
        insights: {
          title: "استخراج الأفكار",
          description: "احصل على ملخصات ومعلومات أساسية."
        }
      }
    },
    // Translation section
    translation: {
      title: "الترجمة",
      subtitle: "دعم متعدد اللغات",
      description: "ترجمة النص والمستندات بين مختلف اللغات. استخدم أداة \"الترجمة\" المخصصة في الشريط الجانبي.",
      supportedLanguages: "اللغات المدعومة للنص:",
      supportedDocTypes: "أنواع المستندات المدعومة لوحدة الترجمة (المستقبلية):",
      videoTutorial: "فيديو تعليمي",
      videoComingSoon: "الفيديو التعليمي قادم قريباً.",
      unsupportedVideo: "متصفحك لا يدعم علامة الفيديو",
      flow: {
        upload: {
          title: "تحميل",
          description: "ملفات Word و PowerPoint و Excel و PDF."
        },
        selectLanguage: {
          title: "اختر اللغة",
          description: "اختر اللغة المستهدفة."
        },
        receiveTranslation: {
          title: "استلام الترجمة",
          description: "احصل على المحتوى المترجم الخاص بك."
        },
        provideFeedback: {
          title: "تقديم التعليقات",
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
    uploadFile: "تحميل ملف",
    today: "اليوم",
    yesterday: "الأمس",
    deleteMessage: "حذف هذه الرسالة",
    editMessage: "تعديل هذه الرسالة",
    copyToClipboard: "نسخ إلى الحافظة",
    copied: "تم النسخ إلى الحافظة",
    loading: "جار التحميل...",
    errorLoading: "خطأ في تحميل المحادثة",
    messageSent: "تم إرسال الرسالة",
    documentUploadSuccess: "تم تحميل المستند بنجاح",
    documentUploadError: "خطأ في تحميل المستند",
    documentProcessing: "معالجة المستند...",
    documentReady: "المستند جاهز",
    welcome: "مرحبًا بك في دردشة FlowserveAI",
    welcomeSubtitle: "الدردشة مع المستندات الخاصة بك وقاعدة المعرفة والذكاء الاصطناعي على شبكة Flowserve",
    newChatCreated: "تم إنشاء دردشة جديدة",
    conversationDeleted: "تم حذف المحادثة",
    conversationRenamed: "تمت إعادة تسمية المحادثة",
    renameCancelledEmpty: {
      title: "تم إلغاء إعادة التسمية",
      description: "لا يمكن أن يكون العنوان الجديد فارغًا"
    },
    renameCancelledUnchanged: {
      title: "لا توجد تغييرات",
      description: "يظل العنوان دون تغيير"
    },
    renameCancelled: "تم إلغاء إعادة التسمية",
    messageEdited: "تم تعديل الرسالة",
    notFound: "لم يتم العثور على الدردشة {id}",
    noActiveSession: "لا توجد جلسة دردشة نشطة",
    selectOrStartNew: "يرجى تحديد دردشة من الشريط الجانبي أو بدء محادثة جديدة",
    aiDisclaimer: "قد لا تكون ردود الذكاء الاصطناعي دقيقة دائمًا. تحقق دائمًا من المعلومات المهمة.",
    enterNewTitle: "أدخل عنوانًا جديدًا",
    containsDocuments: "تحتوي هذه المحادثة على مستندات"
  },
  
  // Documents page
  documentsPage: {
    title: "المستندات الخاصة بي",
    description: "تصفح وإدارة جميع المستندات التي قمت بتحميلها.",
    noDocuments: {
      title: "لم يتم العثور على مستندات",
      description: "لم تقم بتحميل أي مستندات بعد. قم بتحميل المستندات في أي دردشة لرؤيتها هنا.",
      action: "الذهاب إلى الدردشة"
    },
    document: {
      uploaded: "تم التحميل",
      size: "الحجم",
      viewSummary: "عرض الملخص",
      chatAction: "الدردشة حول المستند"
    },
    loading: "جار التحميل..."
  },
  
  // Documents page (used in documents/page.tsx)
  documents: {
    title: "المستندات الخاصة بي",
    description: "تصفح وإدارة جميع المستندات التي قمت بتحميلها.",
    noDocumentsFound: "لم يتم العثور على مستندات",
    noDocumentsDesc: "لم تقم بتحميل أي مستندات بعد. قم بتحميل المستندات في أي دردشة لرؤيتها هنا.",
    goToChat: "الذهاب إلى الدردشة",
    uploaded: "تم التحميل",
    size: "الحجم",
    viewSummarySnippet: "عرض مقتطف الملخص",
    viewFullSummary: "عرض الملخص الكامل",
    fullSummary: "الملخص الكامل",
    chatAboutDocument: "الدردشة حول المستند",
    rawMarkdownPreview: "معاينة النص البرمجي الخام لملخص المستند"
  },
  
  // Translation page
  translation: {
    new: "مهمة ترجمة جديدة",
    edit: "تعديل المهمة",
    noActiveJob: "لا توجد مهمة نشطة",
    createNew: "إنشاء مهمة جديدة أو تحديد واحدة من السجل",
    createNewButton: "إنشاء مهمة جديدة",
    jobTitle: "عنوان المهمة",
    enterJobTitle: "أدخل عنوان المهمة",
    jobType: "نوع المهمة",
    selectJobType: "حدد نوع المهمة",
    textTranslation: "ترجمة نصية",
    documentTranslation: "ترجمة مستند",
    sourceLanguage: "اللغة المصدر",
    selectSourceLanguage: "حدد اللغة المصدر",
    autoDetect: "كشف تلقائي",
    targetLanguage: "اللغة الهدف",
    selectTargetLanguage: "حدد اللغة الهدف",
    enterTextToTranslate: "أدخل النص المراد ترجمته...",
    characters: "حرف",
    copyText: "نسخ النص",
    speakText: "نطق النص",
    translationWillAppear: "ستظهر الترجمة هنا...",
    copyTranslation: "نسخ الترجمة",
    speakTranslation: "نطق الترجمة",
    jobHistory: "سجل المهام",
    newJob: "مهمة جديدة",
    deleteJob: "حذف المهمة",
    cancel: "إلغاء",
    save: "حفظ",
    saved: "تم الحفظ",
    translate: "ترجمة",
    translating: "جاري الترجمة...",
    completed: "مكتمل",
    
    // Add more translation keys
    allTypes: "جميع الأنواع",
    textJobs: "مهام نصية",
    documentJobs: "مهام مستندات",
    status: "الحالة",
    filterByStatus: "تصفية حسب الحالة",
    noJobsMatch: "لا توجد مهام تطابق المعايير",
    adjustFilters: "حاول ضبط المرشحات الخاصة بك",
    searchJobs: "البحث عن المهام",
    discardChanges: "تجاهل التغييرات غير المحفوظة؟",
    unsavedChangesDesc: "لديك تغييرات غير محفوظة. هل أنت متأكد من أنك تريد تجاهلها وإلغاء تعديل هذه المهمة؟",
    keepEditing: "استمرار التعديل",
    discardAndReset: "تجاهل وإعادة الضبط",
    deleteJobConfirm: "حذف المهمة؟",
    deleteJobDesc: "هل أنت متأكد من أنك تريد حذف المهمة \"{jobName}\"؟ لا يمكن التراجع عن هذا الإجراء.",
    maxFiles: "بحد أقصى {max} ملفات. بحد أقصى {size} ميجابايت إجمالي.",
    browseFiles: "تصفح الملفات",
    selectedFiles: "الملفات المحددة ({count}/{max}):",
    togglePdfDocx: "تبديل PDF→DOCX",
    pdfToDocxTooltip: "تحويل PDF إلى DOCX عند الترجمة",
    removeFile: "إزالة الملف",
    translatedDocuments: "المستندات المترجمة لـ {language}:",
    download: "تنزيل",
    downloadSelected: "تنزيل المحدد",
    downloadAllZip: "تنزيل الكل كملف ZIP",
    translationIssues: "مشاكل الترجمة",
    actionCancelled: "تم إلغاء الإجراء",
    actionCancelledDesc: "تم إلغاء العملية الحالية."
  },
  
  // Common UI elements
  common: {
    close: "إغلاق",
    chat: "دردشة",
    unknownError: "خطأ غير معروف",
    selectedChat: "الدردشة المحددة",
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
    goToChats: "الذهاب إلى الدردشات",
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
      description: "هل أنت متأكد من أنك تريد حذف \"{title}\"؟ لا يمكن التراجع عن هذا."
    }
  },
  
  // Document related
  document: {
    viewSummarySnippet: "عرض مقتطف الملخص",
    viewFullSummary: "عرض الملخص الكامل",
    defaultName: "مستند",
    fullSummaryTitle: "الملخص الكامل: {docName}"
  },
  
  // File uploads
  uploads: {
    fileTooLarge: {
      title: "الملف كبير جدًا",
      description: "الحد الأقصى لحجم الملف هو {maxSize} ميجابايت"
    },
    invalidType: {
      title: "نوع ملف غير صالح",
      description: "الملفات المسموح بها: {allowed}"
    },
    preparing: "تجهيز {fileName} للتحميل...",
    processingAi: "معالجة {fileName} بالذكاء الاصطناعي...",
    processingComplete: "اكتملت معالجة {fileName}",
    processingFailed: "فشلت معالجة {fileName}",
    readingFailed: "فشلت قراءة {fileName}",
    uploadFailed: "فشل تحميل {fileName}",
    fileProcessed: "تمت معالجة الملف",
    fileProcessedSummary: "تمت معالجة {fileName} بنجاح",
    aiError: "خطأ في معالجة الذكاء الاصطناعي",
    couldNotProcess: "تعذرت معالجة {fileName}",
    status: {
      pendingUpload: "في انتظار التحميل...",
      uploading: "جاري التحميل... {progress}%",
      pendingProcessing: "في انتظار معالجة الذكاء الاصطناعي...",
      processing: "جاري المعالجة... {progress}%",
      completed: "مكتمل",
      failed: "فشل"
    }
  },
  
  // Feedback dialog
  feedback: {
    title: "إرسال الملاحظات",
    description: "شارك تجربتك مع FlowserveAI. ملاحظاتك تساعدنا على التحسين.",
    placeholder: "أخبرنا عن تجربتك...",
    send: "إرسال الملاحظات",
    cancel: "إلغاء",
    sending: "جاري إرسال الملاحظات...",
    success: "تم إرسال الملاحظات بنجاح!",
    error: "فشل إرسال الملاحظات. يرجى المحاولة مرة أخرى.",
    characterCount: "{count}/3000",
    minCharacters: "مطلوب 100 حرف على الأقل"
  },
  
  // Quick Actions
  quickActions: {
    title: "إجراءات سريعة",
    questions: {
      espp: {
        question: "ما هو خطة شراء أسهم الموظفين (ESPP)؟",
        answer: `# خطة شراء أسهم الموظفين (ESPP)

## نظرة عامة
تسمح خطة ESPP للموظفين المؤهلين بشراء أسهم Flowserve بخصم من خلال خصومات الرواتب.

## الميزات الرئيسية
- شراء الأسهم بخصم 15%
- خصومات تلقائية من الرواتب
- فترات شراء ربع سنوية
- بدون رسوم وساطة
- استحقاق فوري

## الأهلية
- موظفون منتظمون بدوام كامل
- الحد الأدنى 90 يوم من العمل
- غير في إجازة

## كيفية المشاركة
1. التسجيل خلال فترة التسجيل المفتوحة
2. اختيار نسبة المساهمة (1-10% من التعويض المؤهل)
3. يتم خصم الأموال من كل راتب
4. يتم شراء الأسهم ربع سنوياً بخصم 15%

## الاعتبارات الضريبية
- تتم المشتريات بالدولار بعد الضريبة
- تخضع الأرباح للضريبة كدخل عادي أو مكاسب رأسمالية
- استشر مستشاراً ضريبياً للحصول على إرشادات محددة`
      },
      retirement: {
        question: "كيف أدير استثماراتي في 401(k)؟",
        answer: `# إدارة استثمارات 401(k)

## نظرة عامة
تقدم خطة Flowserve 401(k) مجموعة من خيارات الاستثمار لمساعدتك على الادخار للتقاعد.

## الميزات الرئيسية
- مساهمة الشركة حتى 6% من التعويض المؤهل
- استحقاق فوري لمساهمة الشركة
- مجموعة واسعة من خيارات الاستثمار
- إدارة استثمار احترافية
- الوصول إلى الحساب عبر الإنترنت

## خيارات الاستثمار
1. صناديق التاريخ المستهدف
2. صناديق المؤشرات
3. صناديق الإدارة النشطة
4. صندوق أسهم الشركة
5. صندوق القيمة المستقرة

## كيفية الإدارة
1. سجل الدخول إلى حسابك على [بوابة التقاعد]
2. راجع التوزيعات الحالية
3. اضبط نسبة المساهمة
4. أعد موازنة المحفظة حسب الحاجة
5. راقب الأداء بانتظام

## أفضل الممارسات
- ساهم بنسبة 6% على الأقل للحصول على مساهمة الشركة الكاملة
- تنويع عبر فئات الأصول المختلفة
- راجع وأعد الموازنة سنوياً
- فكر في صناديق التاريخ المستهدف للبساطة
- زيادة المساهمات مع زيادة الرواتب`
      }
    }
  }
};

export default translations;