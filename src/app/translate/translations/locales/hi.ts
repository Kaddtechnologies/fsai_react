const translations = {
    // Settings dialog
    settings: {
      title: "सेटिंग्स",
      secondaryTitle: "अधिक",
      description: "अपने FlowserveAI अनुभव को अनुकूलित करें। परिवर्तन तुरंत लागू होंगे।",
      language: "भाषा",
      theme: "थीम",
      themeOptions: {
        light: "हल्का",
        dark: "गहरा",
        system: "सिस्टम"
      },
      save: "परिवर्तन सहेजें",
      saveStatus: {
        success: "सेटिंग्स सहेजी गईं",
        description: "आपकी सेटिंग्स सफलतापूर्वक अपडेट कर दी गई हैं"
      },
      tools: "उपकरण",
      preferences: "वरीयताएँ",
      darkMode: "डार्क मोड",
      support: "सहायता और समर्थन",
      policies: "नीतियाँ",
      selectLanguage: "भाषा चुनें",
      search: "भाषाएँ खोजें...",
      noLanguageMatch: "आपकी खोज से कोई भाषा मेल नहीं खाती"
    },
  
    // Tools section
    tools: {
      documents: "दस्तावेज़",
      documentsDesc: "अपने अपलोड किए गए दस्तावेज़ देखें और प्रबंधित करें",
      chat: "चैट",
      chatDesc: "Flowserve AI सहायक के साथ चैट करें",
      jobs: "अनुवाद",
      jobsDesc: "पाठ और दस्तावेज़ों का अनुवाद करें",
      translate: "अनुवाद करें",
      translationModule: "अनुवाद मॉड्यूल",
      products: "उत्पाद"
    },
  
    // Support section
    support: {
      help: "सहायता केंद्र",
      helpDesc: "Flowserve AI का उपयोग करने में सहायता प्राप्त करें"
    },
  
    // Policies section
    policies: {
      privacy: "गोपनीयता नीति",
      privacyDesc: "हम आपके डेटा को कैसे संभालते हैं",
      ai: "AI दिशानिर्देश",
      aiDesc: "हम AI का जिम्मेदारी से उपयोग कैसे करते हैं"
    },
  
    // Empty state
    emptyState: {
      welcome: "FlowserveAI में आपका स्वागत है",
      subtitle: "Flowserve नेटवर्क पर अपने दस्तावेज़ों, ज्ञानकोष और AI के साथ सुरक्षित रूप से जुड़ें और चैट करें",
      startTyping: "नीचे टाइप करके बातचीत शुरू करें",
      suggestions: {
        aiChat: {
          category: "उत्पाद",
          text: "Flowserve IDURCO Mark 3 उच्च सिलिकॉन पंप की व्याख्या करें"
        },
        documents: {
          category: "उत्पाद",
          text: "मैं Flowserve IDURCO Mark 3 उच्च सिलिकॉन आयरन पंप का संचालन कैसे करूँ?"
        },
        products: {
          category: "लाभ",
          text: "मैं अपने 401(k) निवेशों का प्रबंधन कैसे करूँ?"
        }
      }
    },
  
    // Welcome dialog
    welcomeDialog: {
      title: "Flowserve AI में आपका स्वागत है",
      subtitle: "बुद्धिमान सहायता, दस्तावेज़ विश्लेषण और उत्पाद ज्ञान के लिए आपका एकीकृत मंच।",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "आपका डिजिटल सहायक",
        description: "उत्तर पाने, जटिल विषयों को समझने और Flowserve की पेशकशों से संबंधित विभिन्न कार्यों में सहायता प्राप्त करने के लिए प्राकृतिक बातचीत में संलग्न हों।",
        capabilities: {
          root: "Flowserve AI आपके लिए क्या कर सकता है?",
          answer: "प्रश्नों के उत्तर दें",
          explain: "स्पष्टीकरण प्रदान करें",
          assist: "कार्यों में सहायता करें"
        }
      },
      // Document section
      documents: {
        title: "दस्तावेज़ विश्लेषण",
        subtitle: "अपने दस्तावेज़ों के साथ चैट करें",
        maxFileSize: "अधिकतम फ़ाइल आकार 5MB",
        onlyPDF: "केवल PDF फ़ाइलें",
        vectorSearch: "वेक्टर-संचालित सिमेंटिक खोज",
        extractInfo: "दस्तावेज़ों से जानकारी निकालें",
        description: "अपने दस्तावेज़ (PDF) अपलोड करें और चैट में सीधे उनके साथ बातचीत करें। उनकी सामग्री के बारे में विशिष्ट प्रश्न पूछें, सारांश प्राप्त करें, और हमारी सिमेंटिक खोज तकनीक का उपयोग करके जानकारी निकालें।",
        flow: {
          upload: {
            title: "दस्तावेज़ अपलोड करें",
            description: "अपनी PDF फ़ाइलें सुरक्षित रूप से अपलोड करें।"
          },
          conversation: {
            title: "बातचीत शुरू करें",
            description: "अपने दस्तावेज़ के बारे में प्रश्न पूछें।"
          },
          insights: {
            title: "अंतर्दृष्टि निकालें",
            description: "सारांश और मुख्य जानकारी प्राप्त करें।"
          }
        }
      },
      // Translation section
      translation: {
        title: "अनुवाद",
        subtitle: "बहुभाषी समर्थन",
        description: "विभिन्न भाषाओं के बीच पाठ और दस्तावेज़ों का अनुवाद करें। साइडबार में समर्पित \"अनुवाद\" उपकरण का उपयोग करें।",
        supportedLanguages: "पाठ के लिए समर्थित भाषाएँ:",
        supportedDocTypes: "अनुवाद मॉड्यूल के लिए समर्थित दस्तावेज़ प्रकार (भविष्य):",
        videoTutorial: "वीडियो ट्यूटोरियल",
        videoComingSoon: "वीडियो ट्यूटोरियल जल्द ही आ रहा है।",
        unsupportedVideo: "आपका ब्राउज़र वीडियो टैग का समर्थन नहीं करता है।",
        flow: {
          upload: {
            title: "अपलोड करें",
            description: "Word, PowerPoint, Excel, PDF फ़ाइलें।"
          },
          selectLanguage: {
            title: "भाषा चुनें",
            description: "अपनी लक्षित भाषा चुनें।"
          },
          receiveTranslation: {
            title: "अनुवाद प्राप्त करें",
            description: "अपनी अनुवादित सामग्री प्राप्त करें।"
          },
          provideFeedback: {
            title: "प्रतिक्रिया दें",
            description: "भविष्य के अनुवादों को बेहतर बनाने में सहायता करें।"
          }
        }
      }
    },
  
    // Chat-related
    chat: {
      newChat: "नई चैट",
      placeholder: "एक संदेश टाइप करें...",
      placeholderMobile: "एक संदेश टाइप करें...",
      send: "भेजें",
      typing: "Flowserve AI टाइप कर रहा है...",
      loadMore: "और संदेश लोड करें",
      emptyConversation: "एक नई बातचीत शुरू करें",
      uploadFile: "एक फ़ाइल अपलोड करें",
      today: "आज",
      yesterday: "कल",
      deleteMessage: "इस संदेश को हटाएं",
      editMessage: "इस संदेश को संपादित करें",
      copyToClipboard: "क्लिपबोर्ड पर कॉपी करें",
      copied: "क्लिपबोर्ड पर कॉपी किया गया",
      loading: "लोड हो रहा है...",
      errorLoading: "बातचीत लोड करने में त्रुटि",
      messageSent: "संदेश भेजा गया",
      documentUploadSuccess: "दस्तावेज़ सफलतापूर्वक अपलोड किया गया",
      documentUploadError: "दस्तावेज़ अपलोड करने में त्रुटि",
      documentProcessing: "दस्तावेज़ संसाधित हो रहा है...",
      documentReady: "दस्तावेज़ तैयार है",
      welcome: "FlowserveAI चैट में आपका स्वागत है",
      welcomeSubtitle: "Flowserve नेटवर्क पर अपने दस्तावेज़ों, ज्ञानकोष और AI के साथ चैट करें",
      newChatCreated: "नई चैट बनाई गई",
      conversationDeleted: "बातचीत हटाई गई",
      conversationRenamed: "बातचीत का नाम बदला गया",
      renameCancelledEmpty: {
        title: "नाम बदलना रद्द किया गया",
        description: "नया शीर्षक खाली नहीं हो सकता"
      },
      renameCancelledUnchanged: {
        title: "कोई परिवर्तन नहीं",
        description: "शीर्षक अपरिवर्तित रहता है"
      },
      renameCancelled: "नाम बदलना रद्द किया गया",
      messageEdited: "संदेश संपादित किया गया",
      notFound: "चैट {id} नहीं मिला",
      noActiveSession: "कोई सक्रिय चैट सत्र नहीं",
      selectOrStartNew: "कृपया साइडबार से एक चैट चुनें या एक नई बातचीत शुरू करें",
      aiDisclaimer: "AI प्रतिक्रियाएँ हमेशा सटीक नहीं हो सकती हैं। महत्वपूर्ण जानकारी को हमेशा सत्यापित करें।",
      enterNewTitle: "नया शीर्षक दर्ज करें",
      containsDocuments: "इस बातचीत में दस्तावेज़ हैं"
    },
  
    // Documents page
    documentsPage: {
      title: "मेरे दस्तावेज़",
      description: "अपने सभी अपलोड किए गए दस्तावेज़ों को ब्राउज़ करें और प्रबंधित करें।",
      noDocuments: {
        title: "कोई दस्तावेज़ नहीं मिला",
        description: "आपने अभी तक कोई दस्तावेज़ अपलोड नहीं किया है। उन्हें यहाँ देखने के लिए किसी भी चैट में दस्तावेज़ अपलोड करें।",
        action: "चैट पर जाएँ"
      },
      document: {
        uploaded: "अपलोड किया गया",
        size: "आकार",
        viewSummary: "सारांश देखें",
        chatAction: "दस्तावेज़ के बारे में चैट करें"
      },
      loading: "लोड हो रहा है..."
    },
  
    // Documents page (used in documents/page.tsx)
    documents: {
      title: "मेरे दस्तावेज़",
      description: "अपने सभी अपलोड किए गए दस्तावेज़ों को ब्राउज़ करें और प्रबंधित करें।",
      noDocumentsFound: "कोई दस्तावेज़ नहीं मिला",
      noDocumentsDesc: "आपने अभी तक कोई दस्तावेज़ अपलोड नहीं किया है। उन्हें यहाँ देखने के लिए किसी भी चैट में दस्तावेज़ अपलोड करें।",
      goToChat: "चैट पर जाएँ",
      uploaded: "अपलोड किया गया",
      size: "आकार",
      viewSummarySnippet: "सारांश स्निपेट देखें",
      viewFullSummary: "पूर्ण सारांश देखें",
      fullSummary: "पूर्ण सारांश",
      chatAboutDocument: "दस्तावेज़ के बारे में चैट करें",
      rawMarkdownPreview: "दस्तावेज़ सारांश का कच्चा मार्कडाउन पूर्वावलोकन"
    },
  
    // Translation page
    translation: {
      new: "नया अनुवाद कार्य",
      edit: "कार्य संपादित करें",
      noActiveJob: "कोई सक्रिय कार्य नहीं",
      createNew: "एक नया कार्य बनाएँ या इतिहास से एक चुनें",
      createNewButton: "नया कार्य बनाएँ",
      jobTitle: "कार्य शीर्षक",
      enterJobTitle: "कार्य शीर्षक दर्ज करें",
      jobType: "कार्य प्रकार",
      selectJobType: "कार्य प्रकार चुनें",
      textTranslation: "पाठ अनुवाद",
      documentTranslation: "दस्तावेज़ अनुवाद",
      sourceLanguage: "स्रोत भाषा",
      selectSourceLanguage: "स्रोत भाषा चुनें",
      autoDetect: "स्वतः पहचानें",
      targetLanguage: "लक्ष्य भाषा",
      selectTargetLanguage: "लक्ष्य भाषा चुनें",
      enterTextToTranslate: "अनुवाद करने के लिए पाठ दर्ज करें...",
      characters: "अक्षर",
      copyText: "पाठ कॉपी करें",
      speakText: "पाठ बोलें",
      translationWillAppear: "अनुवाद यहाँ दिखाई देगा...",
      copyTranslation: "अनुवाद कॉपी करें",
      speakTranslation: "अनुवाद बोलें",
      jobHistory: "कार्य इतिहास",
      newJob: "नया कार्य",
      deleteJob: "कार्य हटाएं",
      cancel: "रद्द करें",
      save: "सहेजें",
      saved: "सहेजा गया",
      translate: "अनुवाद करें",
      translating: "अनुवाद हो रहा है...",
      completed: "पूरा हुआ",
  
      // Add more translation keys
      allTypes: "सभी प्रकार",
      textJobs: "पाठ कार्य",
      documentJobs: "दस्तावेज़ कार्य",
      status: "स्थिति",
      filterByStatus: "स्थिति के अनुसार फ़िल्टर करें",
      noJobsMatch: "कोई कार्य मानदंडों से मेल नहीं खाता",
      adjustFilters: "अपने फ़िल्टर समायोजित करने का प्रयास करें",
      searchJobs: "कार्य खोजें",
      discardChanges: "बिना सहेजे गए परिवर्तनों को छोड़ दें?",
      unsavedChangesDesc: "आपके पास बिना सहेजे गए परिवर्तन हैं। क्या आप वाकई उन्हें छोड़ना और इस कार्य का संपादन रद्द करना चाहते हैं?",
      keepEditing: "संपादन जारी रखें",
      discardAndReset: "छोड़ें और रीसेट करें",
      deleteJobConfirm: "कार्य हटाएं?",
      deleteJobDesc: "क्या आप वाकई कार्य \"{jobName}\" को हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
      maxFiles: "अधिकतम {max} फ़ाइलें। कुल अधिकतम {size}MB।",
      browseFiles: "फ़ाइलें ब्राउज़ करें",
      selectedFiles: "चयनित फ़ाइलें ({count}/{max}):",
      togglePdfDocx: "PDF→DOCX टॉगल करें",
      pdfToDocxTooltip: "अनुवाद पर PDF को DOCX में बदलें",
      removeFile: "फ़ाइल हटाएं",
      translatedDocuments: "{language} के लिए अनुवादित दस्तावेज़:",
      download: "डाउनलोड करें",
      downloadSelected: "चयनित डाउनलोड करें",
      downloadAllZip: "सभी को ZIP के रूप में डाउनलोड करें",
      translationIssues: "अनुवाद संबंधी समस्याएँ",
      actionCancelled: "कार्रवाई रद्द की गई",
      actionCancelledDesc: "वर्तमान कार्रवाई रद्द कर दी गई थी।",
      
      // Adding toast messages
      nothingToSave: "सहेजने के लिए कुछ नहीं",
      nothingToSaveDesc: "सहेजने के लिए कार्य बनाएँ या चुनें।",
      jobTitleRequired: "कार्य शीर्षक आवश्यक है",
      jobTitleRequiredDesc: "कृपया कार्य के लिए शीर्षक दर्ज करें।",
      jobTitleRequiredDesc2: "अनुवाद करने से पहले कृपया कार्य के लिए शीर्षक दर्ज करें।",
      jobSaved: "कार्य सहेजा गया",
      jobSavedDesc: "कार्य \"{name}\" सहेजा गया।",
      
      // Translation job errors/notifications
      inputRequired: "इनपुट आवश्यक है",
      inputRequiredDesc: "कृपया अनुवाद करने के लिए पाठ दर्ज करें।",
      errorTitle: "त्रुटि",
      errorStartTranslationDesc: "अनुवाद शुरू नहीं किया जा सका। सक्रिय कार्य नहीं मिला।",
      translationComplete: "अनुवाद पूर्ण",
      translationCompleteDesc: "कार्य \"{title}\" समाप्त हुआ।",
      translationError: "अनुवाद त्रुटि",
      translationErrorDesc: "पाठ का अनुवाद नहीं किया जा सका।",
      
      // File processing messages
      fileProcessed: "फ़ाइल संसाधित",
      fileProcessedDesc: "{fileName} अनुवाद पूर्ण (सिमुलेटेड)।",
      fileFailed: "फ़ाइल विफल",
      fileFailedDesc: "{fileName} अनुवाद करने में विफल (सिमुलेटेड)।",
      
      // Document translation messages
      allFilesProcessed: "सभी फ़ाइलें संसाधित या प्रगति में",
      allFilesProcessedDesc: "इस कार्य में अनुवाद करने के लिए कोई नई फ़ाइल नहीं है।",
      noFilesUploaded: "कोई फ़ाइल अपलोड नहीं की गई",
      noFilesUploadedDesc: "कृपया अनुवाद के लिए दस्तावेज़ अपलोड करें।",
      
      // File issues
      fileLimitReached: "फ़ाइल सीमा पहुँच गई",
      fileLimitReachedDesc: "प्रति कार्य अधिकतम {max} फ़ाइलें।",
      invalidFileType: "अमान्य फ़ाइल प्रकार",
      invalidFileTypeDesc: "{fileName} समर्थित दस्तावेज़ प्रकार नहीं है।",
      sizeLimitExceeded: "आकार सीमा पार हो गई",
      sizeLimitExceededDesc: "कुल अपलोड आकार {max}MB से अधिक नहीं हो सकता।",
      
      // Document job notifications
      jobTypeSwitched: "कार्य प्रकार बदला गया",
      jobTypeSwitchedDesc: "दस्तावेज़ अनुवाद मोड पर स्विच किया गया।",
      documentJobComplete: "दस्तावेज़ अनुवाद कार्य पूर्ण",
      documentJobCompleteDesc: "कार्य \"{title}\" ने सभी फ़ाइलों का प्रसंस्करण पूरा कर लिया है।",
      documentJobIssues: "दस्तावेज़ अनुवाद कार्य में समस्याएँ",
      documentJobIssuesDesc: "कार्य \"{title}\" कुछ त्रुटियों के साथ पूरा हुआ।",
      jobUpdated: "कार्य अपडेट किया गया",
      jobUpdatedDesc: "कार्य \"{title}\" स्थिति अपडेट की गई।",
      
      // Download actions
      downloadSimulated: "डाउनलोड (सिमुलेटेड)",
      downloadSimulatedDesc: "{fileName} डाउनलोड होगा",
      noFilesSelected: "कोई फ़ाइल चयनित नहीं",
      noFilesSelectedDesc: "कृपया डाउनलोड करने के लिए फ़ाइलें चुनें।",
      downloadSelectedSimulated: "चयनित डाउनलोड (सिमुलेटेड)",
      downloadSelectedSimulatedDesc: "डाउनलोड सिमुलेट कर रहा है: {fileList}",
      downloadAllZipSimulated: "सभी को ZIP के रूप में डाउनलोड (सिमुलेटेड)",
      downloadAllZipSimulatedDesc: "सभी {count} फ़ाइलों के लिए ZIP डाउनलोड सिमुलेट कर रहा है।",
      noTranslatedFiles: "कोई अनुवादित फ़ाइल नहीं",
      noTranslatedFilesDesc: "डाउनलोड करने के लिए कोई अनुवादित फ़ाइल नहीं है।",
      
      // Deletion
      jobDeleted: "कार्य हटाया गया",
      
      // Archive actions
      jobArchived: "कार्य संग्रहीत किया गया",
      jobUnarchived: "कार्य असंग्रहीत किया गया",
      
      // Copied message
      copiedToClipboard: "क्लिपबोर्ड पर कॉपी किया गया"
    },
  
    // Common UI elements
    common: {
      close: "बंद करें",
      chat: "चैट",
      unknownError: "अज्ञात त्रुटि",
      selectedChat: "चयनित चैट",
      appName: "FlowserveAI",
      invalidDate: "अमान्य तिथि",
      logoAlt: "Flowserve AI"
    },
  
    // Action buttons
    actions: {
      rename: "नाम बदलें",
      delete: "हटाएं",
      cancel: "रद्द करें",
      close: "बंद करें",
      goToChats: "चैट पर जाएँ",
      copiedToClipboard: "क्लिपबोर्ड पर कॉपी किया गया"
    },
  
    // Sidebar elements
    sidebar: {
      conversations: "हाल की बातचीतें",
      tools: "उपकरण"
    },
  
    // Account section
    account: {
      myAccount: "मेरा खाता",
      profile: "प्रोफ़ाइल",
      logout: "लॉग आउट"
    },
  
    // Alerts
    alerts: {
      deleteConfirm: {
        title: "बातचीत हटाएं?",
        description: "क्या आप वाकई \"{title}\" को हटाना चाहते हैं? इसे पूर्ववत नहीं किया जा सकता।"
      }
    },
  
    // Document related
    document: {
      viewSummarySnippet: "सारांश स्निपेट देखें",
      viewFullSummary: "पूर्ण सारांश देखें",
      defaultName: "दस्तावेज़",
      fullSummaryTitle: "पूर्ण सारांश: {docName}"
    },
  
    // File uploads
    uploads: {
      fileTooLarge: {
        title: "फ़ाइल बहुत बड़ी है",
        description: "अधिकतम फ़ाइल आकार {maxSize}MB है"
      },
      invalidType: {
        title: "अमान्य फ़ाइल प्रकार",
        description: "अनुमत फ़ाइलें: {allowed}"
      },
      preparing: "{fileName} अपलोड के लिए तैयार हो रहा है...",
      processingAi: "{fileName} AI के साथ संसाधित हो रहा है...",
      processingComplete: "{fileName} का प्रसंस्करण पूरा हुआ",
      processingFailed: "{fileName} का प्रसंस्करण विफल हुआ",
      readingFailed: "{fileName} पढ़ने में विफल",
      uploadFailed: "{fileName} का अपलोड विफल हुआ",
      fileProcessed: "फ़ाइल संसाधित हुई",
      fileProcessedSummary: "{fileName} सफलतापूर्वक संसाधित हुआ",
      aiError: "AI प्रसंस्करण त्रुटि",
      couldNotProcess: "{fileName} संसाधित नहीं किया जा सका",
      status: {
        pendingUpload: "अपलोड लंबित...",
        uploading: "अपलोड हो रहा है... {progress}%",
        pendingProcessing: "AI प्रसंस्करण लंबित...",
        processing: "संसाधित हो रहा है... {progress}%",
        completed: "पूरा हुआ",
        failed: "विफल"
      }
    },
  
    // Feedback dialog
    feedback: {
      title: "प्रतिक्रिया भेजें",
      description: "FlowserveAI के साथ अपने अनुभव साझा करें। आपकी प्रतिक्रिया हमें बेहतर बनाने में मदद करती है।",
      placeholder: "हमें अपने अनुभव के बारे में बताएं...",
      send: "प्रतिक्रिया भेजें",
      cancel: "रद्द करें",
      sending: "प्रतिक्रिया भेजी जा रही है...",
      success: "प्रतिक्रिया सफलतापूर्वक भेजी गई!",
      error: "प्रतिक्रिया भेजने में विफल। कृपया पुनः प्रयास करें।",
      characterCount: "{count}/3000",
      minCharacters: "न्यूनतम 100 अक्षर आवश्यक हैं"
    }
  };
  
  export default translations;