const translations = {
    // Settings dialog
    settings: {
      title: "அமைப்புகள்",
      secondaryTitle: "மேலும்",
      description: "உங்கள் FlowserveAI அனுபவத்தைத் தனிப்பயனாக்குங்கள். மாற்றங்கள் உடனடியாகப் பயன்படுத்தப்படும்.",
      language: "மொழி",
      theme: "தீம்",
      themeOptions: {
        light: "ஒளி",
        dark: "இருள்",
        system: "கணினி"
      },
      save: "மாற்றங்களைச் சேமி",
      saveStatus: {
        success: "அமைப்புகள் சேமிக்கப்பட்டன",
        description: "உங்கள் அமைப்புகள் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டன"
      },
      tools: "கருவிகள்",
      preferences: "விருப்பத்தேர்வுகள்",
      darkMode: "இருண்ட பயன்முறை",
      support: "உதவி & ஆதரவு",
      policies: "கொள்கைகள்",
      selectLanguage: "மொழியைத் தேர்ந்தெடுக்கவும்",
      search: "மொழிகளைத் தேடு...",
      noLanguageMatch: "உங்கள் தேடலுடன் எந்த மொழியும் பொருந்தவில்லை"
    },
  
    // Tools section
    tools: {
      documents: "ஆவணங்கள்",
      documentsDesc: "உங்கள் பதிவேற்றிய ஆவணங்களைக் கண்டு நிர்வகிக்கவும்",
      chat: "அரட்டை",
      chatDesc: "Flowserve AI உதவியாளருடன் அரட்டையடிக்கவும்",
      jobs: "மொழிபெயர்ப்பு",
      jobsDesc: "உரை மற்றும் ஆவணங்களை மொழிபெயர்க்கவும்",
      translate: "மொழிபெயர்",
      translationModule: "மொழிபெயர்ப்புத் தொகுதி",
      products: "தயாரிப்புகள்"
    },
  
    // Support section
    support: {
      help: "உதவி மையம்",
      helpDesc: "Flowserve AI பயன்படுத்துவதில் உதவி பெறவும்"
    },
  
    // Policies section
    policies: {
      privacy: "தனியுரிமைக் கொள்கை",
      privacyDesc: "உங்கள் தரவை நாங்கள் எவ்வாறு கையாளுகிறோம்",
      ai: "AI வழிகாட்டுதல்கள்",
      aiDesc: "நாங்கள் AI-ஐ பொறுப்புடன் எவ்வாறு பயன்படுத்துகிறோம்"
    },
  
    // Empty state
    emptyState: {
      welcome: "FlowserveAI-க்கு வரவேற்கிறோம்",
      subtitle: "Flowserve நெட்வொர்க்கில் உங்கள் ஆவணங்கள், அறிவுத் தளம் மற்றும் AI உடன் பாதுகாப்பாக இணைத்து அரட்டையடிக்கவும்",
      startTyping: "கீழே தட்டச்சு செய்வதன் மூலம் உரையாடலைத் தொடங்கவும்",
      suggestions: {
        aiChat: {
          category: "தயாரிப்புகள்",
          text: "Flowserve IDURCO Mark 3 உயர் சிலிக்கான் பம்பை விளக்கவும்"
        },
        documents: {
          category: "தயாரிப்புகள்",
          text: "Flowserve IDURCO Mark 3 உயர் சிலிக்கான் இரும்பு பம்பை நான் எவ்வாறு இயக்குவது?"
        },
        products: {
          category: "நன்மைகள்",
          text: "எனது 401(k) முதலீடுகளை நான் எவ்வாறு நிர்வகிப்பது?"
        }
      }
    },
  
    // Welcome dialog
    welcomeDialog: {
      title: "Flowserve AI-க்கு வரவேற்கிறோம்",
      subtitle: "அறிவார்ந்த உதவி, ஆவணப் பகுப்பாய்வு மற்றும் தயாரிப்பு அறிவுக்கான உங்கள் ஒருங்கிணைந்த தளம்.",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "உங்கள் டிஜிட்டல் உதவியாளர்",
        description: "பதில்களைப் பெற, சிக்கலான தலைப்புகளைப் புரிந்துகொள்ள மற்றும் Flowserve-இன் சலுகைகள் தொடர்பான பல்வேறு பணிகளுக்கு உதவி பெற இயற்கையான உரையாடல்களில் ஈடுபடுங்கள்.",
        capabilities: {
          root: "Flowserve AI உங்களுக்காக என்ன செய்ய முடியும்?",
          answer: "கேள்விகளுக்கு பதிலளிக்கவும்",
          explain: "விளக்கங்களை வழங்கவும்",
          assist: "பணிகளுக்கு உதவவும்"
        }
      },
      // Document section
      documents: {
        title: "ஆவணப் பகுப்பாய்வு",
        subtitle: "உங்கள் ஆவணங்களுடன் அரட்டையடிக்கவும்",
        maxFileSize: "அதிகபட்ச கோப்பு அளவு 5MB",
        onlyPDF: "PDF கோப்புகள் மட்டுமே",
        vectorSearch: "திசையன் மூலம் இயங்கும் சொற்பொருள் தேடல்",
        extractInfo: "ஆவணங்களிலிருந்து தகவலைப் பிரித்தெடுக்கவும்",
        description: "உங்கள் ஆவணங்களை (PDFகள்) பதிவேற்றி, அரட்டையில் நேரடியாக அவற்றுடன் தொடர்பு கொள்ளுங்கள். அவற்றின் உள்ளடக்கம் குறித்த குறிப்பிட்ட கேள்விகளைக் கேளுங்கள், சுருக்கங்களைப் பெறுங்கள் மற்றும் எங்கள் சொற்பொருள் தேடல் தொழில்நுட்பத்தைப் பயன்படுத்தி தகவலைப் பிரித்தெடுக்கவும்.",
        flow: {
          upload: {
            title: "ஆவணத்தைப் பதிவேற்றவும்",
            description: "உங்கள் PDF கோப்புகளைப் பாதுகாப்பாகப் பதிவேற்றவும்."
          },
          conversation: {
            title: "உரையாடலைத் தொடங்கு",
            description: "உங்கள் ஆவணம் குறித்து கேள்விகளைக் கேளுங்கள்."
          },
          insights: {
            title: "நுண்ணறிவுகளைப் பிரித்தெடுக்கவும்",
            description: "சுருக்கங்கள் மற்றும் முக்கிய தகவல்களைப் பெறுங்கள்."
          }
        }
      },
      // Translation section
      translation: {
        title: "மொழிபெயர்ப்பு",
        subtitle: "பன்மொழி ஆதரவு",
        description: "பல்வேறு மொழிகளுக்கு இடையில் உரை மற்றும் ஆவணங்களை மொழிபெயர்க்கவும். பக்கப்பட்டியில் உள்ள பிரத்யேக \"மொழிபெயர்\" கருவியைப் பயன்படுத்தவும்.",
        supportedLanguages: "உரைக்கான ஆதரவு மொழிகள்:",
        supportedDocTypes: "மொழிபெயர்ப்புத் தொகுதிக்கான ஆதரவு ஆவண வகைகள் (எதிர்காலம்):",
        videoTutorial: "காணொளி பயிற்சி",
        videoComingSoon: "காணொளி பயிற்சி விரைவில்.",
        unsupportedVideo: "உங்கள் உலாவி காணொளி குறிச்சொல்லை ஆதரிக்கவில்லை.",
        flow: {
          upload: {
            title: "பதிவேற்று",
            description: "Word, PowerPoint, Excel, PDF கோப்புகள்."
          },
          selectLanguage: {
            title: "மொழியைத் தேர்ந்தெடுக்கவும்",
            description: "உங்கள் இலக்கு மொழியைத் தேர்வு செய்யவும்."
          },
          receiveTranslation: {
            title: "மொழிபெயர்ப்பைப் பெறுங்கள்",
            description: "உங்கள் மொழிபெயர்க்கப்பட்ட உள்ளடக்கத்தைப் பெறுங்கள்."
          },
          provideFeedback: {
            title: "கருத்து தெரிவிக்கவும்",
            description: "எதிர்கால மொழிபெயர்ப்புகளை மேம்படுத்த உதவுங்கள்."
          }
        }
      }
    },
  
    // Chat-related
    chat: {
      newChat: "புதிய அரட்டை",
      placeholder: "ஒரு செய்தியைத் தட்டச்சு செய்க...",
      placeholderMobile: "ஒரு செய்தியைத் தட்டச்சு செய்க...",
      send: "அனுப்பு",
      typing: "Flowserve AI தட்டச்சு செய்கிறது...",
      loadMore: "மேலும் செய்திகளை ஏற்றவும்",
      emptyConversation: "புதிய உரையாடலைத் தொடங்கு",
      uploadFile: "ஒரு கோப்பைப் பதிவேற்றவும்",
      today: "இன்று",
      yesterday: "நேற்று",
      deleteMessage: "இந்தச் செய்தியை நீக்கு",
      editMessage: "இந்தச் செய்தியைத் திருத்து",
      copyToClipboard: "கிளிப்போர்டுக்கு நகலெடு",
      copied: "கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது",
      loading: "ஏற்றுகிறது...",
      errorLoading: "உரையாடலை ஏற்றுவதில் பிழை",
      messageSent: "செய்தி அனுப்பப்பட்டது",
      documentUploadSuccess: "ஆவணம் வெற்றிகரமாகப் பதிவேற்றப்பட்டது",
      documentUploadError: "ஆவணத்தைப் பதிவேற்றுவதில் பிழை",
      documentProcessing: "ஆவணத்தைச் செயலாக்குகிறது...",
      documentReady: "ஆவணம் தயாராக உள்ளது",
      welcome: "FlowserveAI அரட்டைக்கு வரவேற்கிறோம்",
      welcomeSubtitle: "Flowserve நெட்வொர்க்கில் உங்கள் ஆவணங்கள், அறிவுத் தளம் மற்றும் AI உடன் அரட்டையடிக்கவும்",
      newChatCreated: "புதிய அரட்டை உருவாக்கப்பட்டது",
      conversationDeleted: "உரையாடல் நீக்கப்பட்டது",
      conversationRenamed: "உரையாடல் மறுபெயரிடப்பட்டது",
      renameCancelledEmpty: {
        title: "மறுபெயரிடுதல் ரத்துசெய்யப்பட்டது",
        description: "புதிய தலைப்பு காலியாக இருக்கக்கூடாது"
      },
      renameCancelledUnchanged: {
        title: "மாற்றங்கள் இல்லை",
        description: "தலைப்பு மாறாமல் உள்ளது"
      },
      renameCancelled: "மறுபெயரிடுதல் ரத்துசெய்யப்பட்டது",
      messageEdited: "செய்தி திருத்தப்பட்டது",
      notFound: "அரட்டை {id} கிடைக்கவில்லை",
      noActiveSession: "செயலில் அரட்டை அமர்வு இல்லை",
      selectOrStartNew: "பக்கப்பட்டியிலிருந்து ஒரு அரட்டையைத் தேர்ந்தெடுக்கவும் அல்லது புதிய உரையாடலைத் தொடங்கவும்",
      aiDisclaimer: "AI பதில்கள் எப்போதும் துல்லியமாக இருக்காது. முக்கியமான தகவலை எப்போதும் சரிபார்க்கவும்.",
      enterNewTitle: "புதிய தலைப்பை உள்ளிடவும்",
      containsDocuments: "இந்த உரையாடலில் ஆவணங்கள் உள்ளன"
    },
  
    // Documents page
    documentsPage: {
      title: "எனது ஆவணங்கள்",
      description: "உங்கள் பதிவேற்றிய அனைத்து ஆவணங்களையும் உலாவவும் நிர்வகிக்கவும்.",
      noDocuments: {
        title: "ஆவணங்கள் எதுவும் கிடைக்கவில்லை",
        description: "நீங்கள் இன்னும் எந்த ஆவணத்தையும் பதிவேற்றவில்லை. அவற்றை இங்கே காண எந்த அரட்டையிலும் ஆவணங்களைப் பதிவேற்றவும்.",
        action: "அரட்டைக்குச் செல்"
      },
      document: {
        uploaded: "பதிவேற்றப்பட்டது",
        size: "அளவு",
        viewSummary: "சுருக்கத்தைக் காண்க",
        chatAction: "ஆவணம் பற்றி அரட்டையடிக்கவும்"
      },
      loading: "ஏற்றுகிறது..."
    },
  
    // Documents page (used in documents/page.tsx)
    documents: {
      title: "எனது ஆவணங்கள்",
      description: "உங்கள் பதிவேற்றிய அனைத்து ஆவணங்களையும் உலாவவும் நிர்வகிக்கவும்.",
      noDocumentsFound: "ஆவணங்கள் எதுவும் கிடைக்கவில்லை",
      noDocumentsDesc: "நீங்கள் இன்னும் எந்த ஆவணத்தையும் பதிவேற்றவில்லை. அவற்றை இங்கே காண எந்த அரட்டையிலும் ஆவணங்களைப் பதிவேற்றவும்.",
      goToChat: "அரட்டைக்குச் செல்",
      uploaded: "பதிவேற்றப்பட்டது",
      size: "அளவு",
      viewSummarySnippet: "சுருக்கத் துணுக்குகளைக் காண்க",
      viewFullSummary: "முழு சுருக்கத்தைக் காண்க",
      fullSummary: "முழு சுருக்கம்",
      chatAboutDocument: "ஆவணம் பற்றி அரட்டையடிக்கவும்",
      rawMarkdownPreview: "ஆவணச் சுருக்கத்தின் மூல மார்க் டவுன் முன்னோட்டம்"
    },
  
    // Translation page
    translation: {
      new: "புதிய மொழிபெயர்ப்புப் பணி",
      edit: "பணியைத் திருத்து",
      noActiveJob: "செயலில் பணி இல்லை",
      createNew: "புதிய பணியை உருவாக்கவும் அல்லது வரலாற்றிலிருந்து ஒன்றைத் தேர்ந்தெடுக்கவும்",
      createNewButton: "புதிய பணியை உருவாக்கு",
      jobTitle: "பணித் தலைப்பு",
      enterJobTitle: "பணித் தலைப்பை உள்ளிடவும்",
      jobType: "பணி வகை",
      selectJobType: "பணி வகையைத் தேர்ந்தெடுக்கவும்",
      textTranslation: "உரை மொழிபெயர்ப்பு",
      documentTranslation: "ஆவண மொழிபெயர்ப்பு",
      sourceLanguage: "மூல மொழி",
      selectSourceLanguage: "மூல மொழியைத் தேர்ந்தெடுக்கவும்",
      autoDetect: "தானாகக் கண்டறி",
      targetLanguage: "இலக்கு மொழி",
      selectTargetLanguage: "இலக்கு மொழியைத் தேர்ந்தெடுக்கவும்",
      enterTextToTranslate: "மொழிபெயர்க்க உரையை உள்ளிடவும்...",
      characters: "எழுத்துகள்",
      copyText: "உரையை நகலெடு",
      speakText: "உரையைப் பேசு",
      translationWillAppear: "மொழிபெயர்ப்பு இங்கே தோன்றும்...",
      copyTranslation: "மொழிபெயர்ப்பை நகலெடு",
      speakTranslation: "மொழிபெயர்ப்பைப் பேசு",
      jobHistory: "பணி வரலாறு",
      newJob: "புதிய பணி",
      deleteJob: "பணியை நீக்கு",
      cancel: "ரத்துசெய்",
      save: "சேமி",
      saved: "சேமிக்கப்பட்டது",
      translate: "மொழிபெயர்",
      translating: "மொழிபெயர்க்கிறது...",
      completed: "முடிந்தது",
  
      // Add more translation keys
      allTypes: "அனைத்து வகைகளும்",
      textJobs: "உரைப் பணிகள்",
      documentJobs: "ஆவணப் பணிகள்",
      status: "நிலை",
      filterByStatus: "நிலை மூலம் வடிகட்டு",
      noJobsMatch: "பணிகள் எதுவும் நிபந்தனைகளுடன் பொருந்தவில்லை",
      adjustFilters: "உங்கள் வடிகட்டிகளை சரிசெய்ய முயற்சிக்கவும்",
      searchJobs: "பணிகளைத் தேடு",
      discardChanges: "சேமிக்கப்படாத மாற்றங்களை நிராகரிக்கவா?",
      unsavedChangesDesc: "உங்களிடம் சேமிக்கப்படாத மாற்றங்கள் உள்ளன. அவற்றை நிராகரித்து இந்தப் பணியைத் திருத்துவதை ரத்துசெய்ய விரும்புகிறீர்களா?",
      keepEditing: "திருத்துவதைத் தொடரவும்",
      discardAndReset: "நிராகரித்து மீட்டமை",
      deleteJobConfirm: "பணியை நீக்கவா?",
      deleteJobDesc: "\"{jobName}\" என்ற பணியை நீக்க விரும்புகிறீர்களா? இந்தச் செயலைச் செயல்தவிர்க்க முடியாது.",
      maxFiles: "அதிகபட்சம் {max} கோப்புகள். மொத்தம் அதிகபட்சம் {size}MB.",
      browseFiles: "கோப்புகளை உலாவுக",
      selectedFiles: "தேர்ந்தெடுக்கப்பட்ட கோப்புகள் ({count}/{max}):",
      togglePdfDocx: "PDF→DOCX ஐ மாற்று",
      pdfToDocxTooltip: "மொழிபெயர்ப்பில் PDF ஐ DOCX ஆக மாற்றவும்",
      removeFile: "கோப்பை அகற்று",
      translatedDocuments: "{language} க்கான மொழிபெயர்க்கப்பட்ட ஆவணங்கள்:",
      download: "பதிவிறக்கு",
      downloadSelected: "தேர்ந்தெடுக்கப்பட்டதைப் பதிவிறக்கு",
      downloadAllZip: "அனைத்தையும் ZIP ஆகப் பதிவிறக்கு",
      translationIssues: "மொழிபெயர்ப்புச் சிக்கல்கள்",
      actionCancelled: "செயல் ரத்துசெய்யப்பட்டது",
      actionCancelledDesc: "தற்போதைய செயல்பாடு ரத்துசெய்யப்பட்டது."
    },
  
    // Common UI elements
    common: {
      close: "மூடு",
      chat: "அரட்டை",
      unknownError: "அறியப்படாத பிழை",
      selectedChat: "தேர்ந்தெடுக்கப்பட்ட அரட்டை",
      appName: "FlowserveAI",
      invalidDate: "தவறான தேதி",
      logoAlt: "Flowserve AI"
    },
  
    // Action buttons
    actions: {
      rename: "மறுபெயரிடு",
      delete: "நீக்கு",
      cancel: "ரத்துசெய்",
      close: "மூடு",
      goToChats: "அரட்டைகளுக்குச் செல்",
      copiedToClipboard: "கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது"
    },
  
    // Sidebar elements
    sidebar: {
      conversations: "சமீபத்திய உரையாடல்கள்",
      tools: "கருவிகள்"
    },
  
    // Account section
    account: {
      myAccount: "என் கணக்கு",
      profile: "சுயவிவரம்",
      logout: "வெளியேறு"
    },
  
    // Alerts
    alerts: {
      deleteConfirm: {
        title: "உரையாடலை நீக்கவா?",
        description: "\"{title}\" என்பதை நீக்க விரும்புகிறீர்களா? இதைச் செயல்தவிர்க்க முடியாது."
      }
    },
  
    // Document related
    document: {
      viewSummarySnippet: "சுருக்கத் துணுக்குகளைக் காண்க",
      viewFullSummary: "முழு சுருக்கத்தைக் காண்க",
      defaultName: "ஆவணம்",
      fullSummaryTitle: "முழு சுருக்கம்: {docName}"
    },
  
    // File uploads
    uploads: {
      fileTooLarge: {
        title: "கோப்பு மிகப் பெரியது",
        description: "அதிகபட்ச கோப்பு அளவு {maxSize}MB ஆகும்"
      },
      invalidType: {
        title: "தவறான கோப்பு வகை",
        description: "அனுமதிக்கப்பட்ட கோப்புகள்: {allowed}"
      },
      preparing: "{fileName} பதிவேற்றத்திற்குத் தயாராகிறது...",
      processingAi: "{fileName} AI உடன் செயலாக்கப்படுகிறது...",
      processingComplete: "{fileName} செயலாக்கம் முடிந்தது",
      processingFailed: "{fileName} செயலாக்கம் தோல்வியடைந்தது",
      readingFailed: "{fileName} படித்தல் தோல்வியடைந்தது",
      uploadFailed: "{fileName} பதிவேற்றம் தோல்வியடைந்தது",
      fileProcessed: "கோப்பு செயலாக்கப்பட்டது",
      fileProcessedSummary: "{fileName} வெற்றிகரமாகச் செயலாக்கப்பட்டது",
      aiError: "AI செயலாக்கப் பிழை",
      couldNotProcess: "{fileName} செயலாக்க முடியவில்லை",
      status: {
        pendingUpload: "பதிவேற்றம் நிலுவையில் உள்ளது...",
        uploading: "பதிவேற்றுகிறது... {progress}%",
        pendingProcessing: "AI செயலாக்கம் நிலுவையில் உள்ளது...",
        processing: "செயலாக்குகிறது... {progress}%",
        completed: "முடிந்தது",
        failed: "தோல்வியடைந்தது"
      }
    },
  
    // Feedback dialog
    feedback: {
      title: "கருத்து அனுப்பு",
      description: "FlowserveAI உடனான உங்கள் அனுபவத்தைப் பகிரவும். உங்கள் கருத்து எங்களுக்கு மேம்படுத்த உதவுகிறது.",
      placeholder: "உங்கள் அனுபவத்தைப் பற்றி எங்களிடம் கூறுங்கள்...",
      send: "கருத்து அனுப்பு",
      cancel: "ரத்துசெய்",
      sending: "கருத்து அனுப்பப்படுகிறது...",
      success: "கருத்து வெற்றிகரமாக அனுப்பப்பட்டது!",
      error: "கருத்து அனுப்பத் தவறிவிட்டது. மீண்டும் முயற்சிக்கவும்.",
      characterCount: "{count}/3000",
      minCharacters: "குறைந்தபட்சம் 100 எழுத்துகள் தேவை"
    }
  };
  
  export default translations;