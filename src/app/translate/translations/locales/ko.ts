const translations = {
  // Settings dialog
  settings: {
    title: "설정",
    secondaryTitle: "더 보기",
    description: "FlowserveAI 환경을 사용자 정의하십시오. 변경 사항은 즉시 적용됩니다.",
    language: "언어",
    theme: "테마",
    themeOptions: {
      light: "라이트",
      dark: "다크",
      system: "시스템"
    },
    save: "변경 사항 저장",
    saveStatus: {
      success: "설정이 저장되었습니다",
      description: "설정이 성공적으로 업데이트되었습니다"
    },
    tools: "도구",
    preferences: "기본 설정",
    darkMode: "다크 모드",
    support: "도움말 및 지원",
    policies: "정책",
    selectLanguage: "언어 선택",
    search: "언어 검색...",
    noLanguageMatch: "검색과 일치하는 언어가 없습니다"
  },

  // Tools section
  tools: {
    documents: "문서",
    documentsDesc: "업로드된 문서 보기 및 관리",
    chat: "채팅",
    chatDesc: "Flowserve AI 어시스턴트와 채팅",
    jobs: "번역",
    jobsDesc: "텍스트 및 문서 번역",
    translate: "번역",
    translationModule: "번역 모듈",
    products: "제품"
  },

  // Support section
  support: {
    help: "도움말 센터",
    helpDesc: "Flowserve AI 사용에 대한 도움 받기"
  },

  // Policies section
  policies: {
    privacy: "개인 정보 보호 정책",
    privacyDesc: "데이터 처리 방법",
    ai: "AI 가이드라인",
    aiDesc: "AI를 책임감 있게 사용하는 방법"
  },

  // Empty state
  emptyState: {
    welcome: "FlowserveAI에 오신 것을 환영합니다",
    subtitle: "Flowserve 네트워크에서 문서, 지식 기반 및 AI와 안전하게 연결하고 채팅하십시오.",
    startTyping: "아래에 입력하여 대화를 시작하십시오.",
    suggestions: {
      aiChat: {
        category: "제품",
        text: "Flowserve IDURCO Mark 3 고규소 펌프에 대해 설명해주세요."
      },
      documents: {
        category: "제품",
        text: "Flowserve IDURCO Mark 3 고규소 철 펌프는 어떻게 작동합니까?"
      },
      products: {
        category: "혜택",
        text: "401(k) 투자는 어떻게 관리하나요?"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Flowserve AI에 오신 것을 환영합니다",
    subtitle: "지능형 지원, 문서 분석 및 제품 지식을 위한 통합 플랫폼입니다.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "디지털 어시스턴트",
      description: "자연스러운 대화에 참여하여 답변을 얻고, 복잡한 주제를 이해하고, Flowserve 제품과 관련된 다양한 작업에 대한 지원을 받으십시오.",
      capabilities: {
        root: "Flowserve AI는 무엇을 할 수 있습니까?",
        answer: "질문에 답변",
        explain: "설명 제공",
        assist: "작업 지원"
      }
    },
    // Document section
    documents: {
      title: "문서 분석",
      subtitle: "문서와 채팅",
      maxFileSize: "최대 파일 크기 5MB",
      onlyPDF: "PDF 파일만",
      vectorSearch: "벡터 기반 시맨틱 검색",
      extractInfo: "문서에서 정보 추출",
      description: "문서(PDF)를 업로드하고 채팅에서 직접 상호 작용하십시오. 콘텐츠에 대한 특정 질문을 하고, 요약을 받고, 시맨틱 검색 기술을 사용하여 정보를 추출하십시오.",
      flow: {
        upload: {
          title: "문서 업로드",
          description: "PDF 파일을 안전하게 업로드하십시오."
        },
        conversation: {
          title: "대화 시작",
          description: "문서에 대해 질문하십시오."
        },
        insights: {
          title: "통찰력 추출",
          description: "요약 및 주요 정보를 얻으십시오."
        }
      }
    },
    // Translation section
    translation: {
      title: "번역",
      subtitle: "다국어 지원",
      description: "다양한 언어 간에 텍스트와 문서를 번역합니다. 사이드바의 전용 \"번역\" 도구를 사용하십시오.",
      supportedLanguages: "텍스트 지원 언어:",
      supportedDocTypes: "번역 모듈 지원 문서 유형 (향후):",
      videoTutorial: "비디오 자습서",
      videoComingSoon: "비디오 자습서가 곧 제공될 예정입니다.",
      unsupportedVideo: "브라우저가 비디오 태그를 지원하지 않습니다.",
      flow: {
        upload: {
          title: "업로드",
          description: "Word, PowerPoint, Excel, PDF 파일."
        },
        selectLanguage: {
          title: "언어 선택",
          description: "대상 언어를 선택하십시오."
        },
        receiveTranslation: {
          title: "번역 받기",
          description: "번역된 콘텐츠를 받으십시오."
        },
        provideFeedback: {
          title: "피드백 제공",
          description: "향후 번역 개선에 도움을 주십시오."
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "새 채팅",
    placeholder: "메시지 입력...",
    placeholderMobile: "메시지 입력...",
    send: "보내기",
    typing: "Flowserve AI가 입력 중입니다...",
    loadMore: "메시지 더 불러오기",
    emptyConversation: "새 대화 시작",
    uploadFile: "파일 업로드",
    today: "오늘",
    yesterday: "어제",
    deleteMessage: "이 메시지 삭제",
    editMessage: "이 메시지 편집",
    copyToClipboard: "클립보드에 복사",
    copied: "클립보드에 복사됨",
    loading: "로드 중...",
    errorLoading: "대화 로드 중 오류 발생",
    messageSent: "메시지 전송됨",
    documentUploadSuccess: "문서가 성공적으로 업로드되었습니다",
    documentUploadError: "문서 업로드 중 오류 발생",
    documentProcessing: "문서 처리 중...",
    documentReady: "문서 준비 완료",
    welcome: "FlowserveAI 채팅에 오신 것을 환영합니다",
    welcomeSubtitle: "Flowserve 네트워크에서 문서, 지식 기반 및 AI와 채팅하십시오",
    newChatCreated: "새 채팅이 생성되었습니다",
    conversationDeleted: "대화가 삭제되었습니다",
    conversationRenamed: "대화 이름이 변경되었습니다",
    renameCancelledEmpty: {
      title: "이름 변경 취소됨",
      description: "새 제목은 비워 둘 수 없습니다"
    },
    renameCancelledUnchanged: {
      title: "변경 사항 없음",
      description: "제목이 변경되지 않았습니다"
    },
    renameCancelled: "이름 변경 취소됨",
    messageEdited: "메시지가 수정되었습니다",
    notFound: "채팅 {id}을(를) 찾을 수 없습니다",
    noActiveSession: "활성 채팅 세션이 없습니다",
    selectOrStartNew: "사이드바에서 채팅을 선택하거나 새 대화를 시작하십시오",
    aiDisclaimer: "AI 응답은 항상 정확하지 않을 수 있습니다. 중요한 정보는 항상 확인하십시오.",
    enterNewTitle: "새 제목 입력",
    containsDocuments: "이 대화에는 문서가 포함되어 있습니다"
  },

  // Documents page
  documentsPage: {
    title: "내 문서",
    description: "업로드한 모든 문서를 찾아보고 관리합니다.",
    noDocuments: {
      title: "문서를 찾을 수 없음",
      description: "아직 문서를 업로드하지 않았습니다. 채팅에서 문서를 업로드하면 여기에 표시됩니다.",
      action: "채팅으로 이동"
    },
    document: {
      uploaded: "업로드됨",
      size: "크기",
      viewSummary: "요약 보기",
      chatAction: "문서에 대해 채팅"
    },
    loading: "로드 중..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "내 문서",
    description: "업로드한 모든 문서를 찾아보고 관리합니다.",
    noDocumentsFound: "문서를 찾을 수 없음",
    noDocumentsDesc: "아직 문서를 업로드하지 않았습니다. 채팅에서 문서를 업로드하면 여기에 표시됩니다.",
    goToChat: "채팅으로 이동",
    uploaded: "업로드됨",
    size: "크기",
    viewSummarySnippet: "요약 스니펫 보기",
    viewFullSummary: "전체 요약 보기",
    fullSummary: "전체 요약",
    chatAboutDocument: "문서에 대해 채팅",
    rawMarkdownPreview: "문서 요약의 원시 마크다운 미리보기"
  },

  // Translation page
  translation: {
    new: "새 번역 작업",
    edit: "작업 편집",
    noActiveJob: "활성 작업 없음",
    createNew: "새 작업을 만들거나 기록에서 하나를 선택하십시오.",
    createNewButton: "새 작업 만들기",
    jobTitle: "작업 제목",
    enterJobTitle: "작업 제목 입력",
    jobType: "작업 유형",
    selectJobType: "작업 유형 선택",
    textTranslation: "텍스트 번역",
    documentTranslation: "문서 번역",
    sourceLanguage: "소스 언어",
    selectSourceLanguage: "소스 언어 선택",
    autoDetect: "자동 감지",
    targetLanguage: "대상 언어",
    selectTargetLanguage: "대상 언어 선택",
    enterTextToTranslate: "번역할 텍스트 입력...",
    characters: "자",
    copyText: "텍스트 복사",
    speakText: "텍스트 말하기",
    translationWillAppear: "번역이 여기에 표시됩니다...",
    copyTranslation: "번역 복사",
    speakTranslation: "번역 말하기",
    jobHistory: "작업 기록",
    newJob: "새 작업",
    deleteJob: "작업 삭제",
    cancel: "취소",
    save: "저장",
    saved: "저장됨",
    translate: "번역",
    translating: "번역 중...",
    completed: "완료됨",
    
    // Toast messages
    jobSaved: "작업 저장됨",
    jobSavedDesc: "'{name}'이(가) 성공적으로 저장되었습니다",
    jobDeleted: "작업 삭제됨",
    jobArchived: "작업이 보관되었습니다",
    jobUnarchived: "작업이 보관 해제되었습니다",
    copiedToClipboard: "클립보드에 복사됨",
    jobTypeSwitched: "작업 유형이 전환되었습니다",
    jobTypeSwitchedDesc: "이전 데이터가 삭제되었습니다",
    nothingToSave: "저장할 내용 없음",
    nothingToSaveDesc: "저장할 활성 작업이 없습니다",
    
    // Error messages
    jobTitleRequired: "작업 제목 필요",
    jobTitleRequiredDesc: "이 작업의 제목을 입력하세요",
    jobTitleRequiredDesc2: "번역하기 전에 제목을 입력하세요",
    inputRequired: "텍스트 필요",
    inputRequiredDesc: "번역할 텍스트를 입력하세요",
    errorTitle: "오류",
    errorStartTranslationDesc: "번역을 시작할 수 없습니다",
    translationError: "번역 오류",
    translationErrorDesc: "번역을 완료할 수 없습니다",
    
    // Status notifications
    translationComplete: "번역 완료",
    translationCompleteDesc: "'{title}'이(가) 성공적으로 번역되었습니다",
    documentJobComplete: "문서 번역 완료",
    documentJobCompleteDesc: "'{title}'이(가) 성공적으로 처리되었습니다",
    documentJobIssues: "문서 작업 문제",
    documentJobIssuesDesc: "'{title}' 처리 중 문제가 발생했습니다",
    jobUpdated: "작업 업데이트됨",
    jobUpdatedDesc: "'{title}'이(가) 업데이트되었습니다",
    
    // File processing messages
    fileLimitReached: "파일 제한 도달",
    fileLimitReachedDesc: "작업당 최대 {max}개 파일",
    invalidFileType: "잘못된 파일 유형",
    invalidFileTypeDesc: "'{fileName}'은(는) 지원되지 않습니다",
    sizeLimitExceeded: "크기 제한 초과",
    sizeLimitExceededDesc: "총 크기가 {max}MB를 초과합니다",
    fileProcessed: "파일 처리됨",
    fileProcessedDesc: "'{fileName}'이(가) 성공적으로 처리되었습니다",
    fileFailed: "파일 처리 실패",
    fileFailedDesc: "'{fileName}'을(를) 처리할 수 없습니다",
    allFilesProcessed: "모든 파일 처리됨",
    allFilesProcessedDesc: "모든 파일이 이미 처리되었습니다",
    noFilesUploaded: "업로드된 파일 없음",
    noFilesUploadedDesc: "최소 하나의 파일을 업로드하세요",
    noFilesSelected: "선택된 파일 없음",
    noFilesSelectedDesc: "최소 하나의 파일을 선택하세요",
    downloadSelectedSimulated: "시뮬레이션된 다운로드",
    downloadSelectedSimulatedDesc: "다음에 대한 시뮬레이션된 다운로드: {fileList}",
    downloadAllZipSimulated: "ZIP 시뮬레이션된 다운로드",
    downloadAllZipSimulatedDesc: "{count}개 파일의 ZIP으로 시뮬레이션된 다운로드",
    noTranslatedFiles: "번역된 파일 없음",
    noTranslatedFilesDesc: "이 언어에 대한 번역된 파일이 없습니다",
    downloadSimulated: "시뮬레이션된 다운로드",
    downloadSimulatedDesc: "'{fileName}'의 시뮬레이션된 다운로드"
  },

  // Common UI elements
  common: {
    close: "닫기",
    chat: "채팅",
    unknownError: "알 수 없는 오류",
    selectedChat: "선택된 채팅",
    appName: "FlowserveAI",
    invalidDate: "잘못된 날짜",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "이름 바꾸기",
    delete: "삭제",
    cancel: "취소",
    close: "닫기",
    goToChats: "채팅으로 이동",
    copiedToClipboard: "클립보드에 복사됨"
  },

  // Sidebar elements
  sidebar: {
    conversations: "최근 대화",
    tools: "도구"
  },

  // Account section
  account: {
    myAccount: "내 계정",
    profile: "프로필",
    logout: "로그아웃"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "대화를 삭제하시겠습니까?",
      description: "\"{title}\"을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "요약 스니펫 보기",
    viewFullSummary: "전체 요약 보기",
    defaultName: "문서",
    fullSummaryTitle: "전체 요약: {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "파일이 너무 큽니다",
      description: "최대 파일 크기는 {maxSize}MB입니다."
    },
    invalidType: {
      title: "잘못된 파일 형식",
      description: "허용되는 파일: {allowed}"
    },
    preparing: "{fileName} 업로드 준비 중...",
    processingAi: "{fileName} AI 처리 중...",
    processingComplete: "{fileName} 처리가 완료되었습니다.",
    processingFailed: "{fileName} 처리에 실패했습니다.",
    readingFailed: "{fileName} 읽기에 실패했습니다.",
    uploadFailed: "{fileName} 업로드에 실패했습니다.",
    fileProcessed: "파일 처리됨",
    fileProcessedSummary: "{fileName}이(가) 성공적으로 처리되었습니다.",
    aiError: "AI 처리 오류",
    couldNotProcess: "{fileName}을(를) 처리할 수 없습니다.",
    status: {
      pendingUpload: "업로드 대기 중...",
      uploading: "업로드 중... {progress}%",
      pendingProcessing: "AI 처리 대기 중...",
      processing: "처리 중... {progress}%",
      completed: "완료됨",
      failed: "실패함"
    }
  },

  // Feedback dialog
  feedback: {
    title: "피드백 보내기",
    description: "FlowserveAI 사용 경험을 공유해 주십시오. 귀하의 피드백은 개선에 도움이 됩니다.",
    placeholder: "경험에 대해 알려주십시오...",
    send: "피드백 보내기",
    cancel: "취소",
    sending: "피드백 보내는 중...",
    success: "피드백이 성공적으로 전송되었습니다!",
    error: "피드백을 보내지 못했습니다. 다시 시도하십시오.",
    characterCount: "{count}/3000",
    minCharacters: "최소 100자 필요"
  }
};

export default translations;