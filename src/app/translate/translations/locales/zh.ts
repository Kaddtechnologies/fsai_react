const translations = {
  // Settings dialog
  settings: {
    title: "设置",
    secondaryTitle: "更多",
    description: "自定义您的FlowserveAI体验。更改将立即生效。",
    language: "语言",
    theme: "主题",
    themeOptions: {
      light: "浅色",
      dark: "深色",
      system: "系统"
    },
    save: "保存更改",
    saveStatus: {
      success: "设置已保存",
      description: "您的设置已成功更新"
    },
    tools: "工具",
    preferences: "偏好设置",
    darkMode: "深色模式",
    support: "帮助与支持",
    policies: "政策",
    selectLanguage: "选择语言",
    search: "搜索语言...",
    noLanguageMatch: "没有与您的搜索匹配的语言"
  },

  // Tools section
  tools: {
    documents: "文档",
    documentsDesc: "查看和管理您上传的文档",
    chat: "聊天",
    chatDesc: "与Flowserve AI助手聊天",
    jobs: "翻译",
    jobsDesc: "翻译文本和文档",
    translate: "翻译",
    translationModule: "翻译模块",
    products: "产品"
  },

  // Support section
  support: {
    help: "帮助中心",
    helpDesc: "获取有关使用Flowserve AI的帮助"
  },

  // Policies section
  policies: {
    privacy: "隐私政策",
    privacyDesc: "我们如何处理您的数据",
    ai: "AI指南",
    aiDesc: "我们如何负责任地使用AI"
  },

  // Empty state
  emptyState: {
    welcome: "欢迎来到FlowserveAI",
    subtitle: "在Flowserve网络上安全地连接您的文档、知识库和AI并与之聊天",
    startTyping: "在下方输入以开始对话",
    suggestions: {
      aiChat: {
        category: "产品",
        text: "解释一下Flowserve IDURCO Mark 3高硅泵"
      },
      documents: {
        category: "产品",
        text: "如何操作Flowserve IDURCO Mark 3高硅铁泵？"
      },
      products: {
        category: "福利",
        text: "我该如何管理我的401(k)投资？"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "欢迎使用 Flowserve AI",
    subtitle: "您的智能协助、文档分析和产品知识统一平台。",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "您的数字助理",
      description: "进行自然对话以获取答案、理解复杂主题并获得与Flowserve产品相关的各种任务的帮助。",
      capabilities: {
        root: "Flowserve AI能为您做什么？",
        answer: "回答问题",
        explain: "提供解释",
        assist: "协助完成任务"
      }
    },
    // Document section
    documents: {
      title: "文档分析",
      subtitle: "与您的文档聊天",
      maxFileSize: "最大文件大小5MB",
      onlyPDF: "仅限PDF文件",
      vectorSearch: "矢量驱动的语义搜索",
      extractInfo: "从文档中提取信息",
      description: "上传您的文档（PDF）并在聊天中直接与它们互动。针对其内容提出具体问题，获取摘要，并使用我们的语义搜索技术提取信息。",
      flow: {
        upload: {
          title: "上传文档",
          description: "安全地上传您的PDF文件。"
        },
        conversation: {
          title: "开始对话",
          description: "询问有关您文档的问题。"
        },
        insights: {
          title: "提取见解",
          description: "获取摘要和关键信息。"
        }
      }
    },
    // Translation section
    translation: {
      title: "翻译",
      subtitle: "多语言支持",
      description: "在各种语言之间翻译文本和文档。使用侧边栏中专用的“翻译”工具。",
      supportedLanguages: "文本支持的语言：",
      supportedDocTypes: "翻译模块支持的文档类型（未来）：",
      videoTutorial: "视频教程",
      videoComingSoon: "视频教程即将推出。",
      unsupportedVideo: "您的浏览器不支持视频标签。",
      flow: {
        upload: {
          title: "上传",
          description: "Word、PowerPoint、Excel、PDF文件。"
        },
        selectLanguage: {
          title: "选择语言",
          description: "选择您的目标语言。"
        },
        receiveTranslation: {
          title: "接收翻译",
          description: "获取您翻译的内容。"
        },
        provideFeedback: {
          title: "提供反馈",
          description: "帮助改进未来的翻译。"
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "新聊天",
    placeholder: "输入消息...",
    placeholderMobile: "输入消息...",
    send: "发送",
    typing: "Flowserve AI正在输入...",
    loadMore: "加载更多消息",
    emptyConversation: "开始新的对话",
    uploadFile: "上传文件",
    today: "今天",
    yesterday: "昨天",
    deleteMessage: "删除此消息",
    editMessage: "编辑此消息",
    copyToClipboard: "复制到剪贴板",
    copied: "已复制到剪贴板",
    loading: "加载中...",
    errorLoading: "加载对话时出错",
    messageSent: "消息已发送",
    documentUploadSuccess: "文档上传成功",
    documentUploadError: "文档上传错误",
    documentProcessing: "文档处理中...",
    documentReady: "文档准备就绪",
    welcome: "欢迎来到FlowserveAI聊天",
    welcomeSubtitle: "在Flowserve网络上与您的文档、知识库和AI聊天",
    newChatCreated: "新聊天已创建",
    conversationDeleted: "对话已删除",
    conversationRenamed: "对话已重命名",
    renameCancelledEmpty: {
      title: "重命名已取消",
      description: "新标题不能为空"
    },
    renameCancelledUnchanged: {
      title: "无更改",
      description: "标题保持不变"
    },
    renameCancelled: "重命名已取消",
    messageEdited: "消息已编辑",
    notFound: "未找到聊天 {id}",
    noActiveSession: "没有活动的聊天会话",
    selectOrStartNew: "请从侧边栏选择一个聊天或开始新的对话",
    aiDisclaimer: "AI的回复可能并非总是准确的。请务必核实重要信息。",
    enterNewTitle: "输入新标题",
    containsDocuments: "此对话包含文档"
  },

  // Documents page
  documentsPage: {
    title: "我的文档",
    description: "浏览和管理您所有已上传的文档。",
    noDocuments: {
      title: "未找到文档",
      description: "您尚未上传任何文档。在任何聊天中上传文档即可在此处查看它们。",
      action: "前往聊天"
    },
    document: {
      uploaded: "已上传",
      size: "大小",
      viewSummary: "查看摘要",
      chatAction: "就文档聊天"
    },
    loading: "加载中..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "我的文档",
    description: "浏览和管理您所有已上传的文档。",
    noDocumentsFound: "未找到文档",
    noDocumentsDesc: "您尚未上传任何文档。在任何聊天中上传文档即可在此处查看它们。",
    goToChat: "前往聊天",
    uploaded: "已上传",
    size: "大小",
    viewSummarySnippet: "查看摘要片段",
    viewFullSummary: "查看完整摘要",
    fullSummary: "完整摘要",
    chatAboutDocument: "就文档聊天",
    rawMarkdownPreview: "文档摘要的原始markdown预览"
  },

  // Translation page
  translation: {
    new: "新建翻译任务",
    edit: "编辑任务",
    noActiveJob: "无活动任务",
    createNew: "创建新任务或从历史记录中选择一个",
    createNewButton: "创建新任务",
    jobTitle: "任务标题",
    enterJobTitle: "输入任务标题",
    jobType: "任务类型",
    selectJobType: "选择任务类型",
    textTranslation: "文本翻译",
    documentTranslation: "文档翻译",
    sourceLanguage: "源语言",
    selectSourceLanguage: "选择源语言",
    autoDetect: "自动检测",
    targetLanguage: "目标语言",
    selectTargetLanguage: "选择目标语言",
    enterTextToTranslate: "输入要翻译的文本...",
    characters: "字符",
    copyText: "复制文本",
    speakText: "朗读文本",
    translationWillAppear: "翻译将显示在此处...",
    copyTranslation: "复制译文",
    speakTranslation: "朗读译文",
    jobHistory: "任务历史",
    newJob: "新建任务",
    deleteJob: "删除任务",
    cancel: "取消",
    save: "保存",
    saved: "已保存",
    translate: "翻译",
    translating: "翻译中...",
    completed: "已完成",

    // Add more translation keys
    allTypes: "所有类型",
    textJobs: "文本任务",
    documentJobs: "文档任务",
    status: "状态",
    filterByStatus: "按状态筛选",
    noJobsMatch: "没有符合条件的任务",
    adjustFilters: "尝试调整您的筛选条件",
    searchJobs: "搜索任务",
    discardChanges: "放弃未保存的更改？",
    unsavedChangesDesc: "您有未保存的更改。确定要放弃更改并取消编辑此任务吗？",
    keepEditing: "继续编辑",
    discardAndReset: "放弃并重置",
    deleteJobConfirm: "删除任务？",
    deleteJobDesc: "您确定要删除任务“{jobName}”吗？此操作无法撤销。",
    maxFiles: "最多 {max} 个文件。总大小不超过 {size}MB。",
    browseFiles: "浏览文件",
    selectedFiles: "选定文件 ({count}/{max}):",
    togglePdfDocx: "切换 PDF→DOCX",
    pdfToDocxTooltip: "翻译时将PDF转换为DOCX",
    removeFile: "移除文件",
    translatedDocuments: "{language}的已翻译文档:",
    download: "下载",
    downloadSelected: "下载选定项",
    downloadAllZip: "全部下载为ZIP",
    translationIssues: "翻译问题",
    actionCancelled: "操作已取消",
    actionCancelledDesc: "当前操作已取消。"
  },

  // Common UI elements
  common: {
    close: "关闭",
    chat: "聊天",
    unknownError: "未知错误",
    selectedChat: "选定的聊天",
    appName: "FlowserveAI",
    invalidDate: "无效日期",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "重命名",
    delete: "删除",
    cancel: "取消",
    close: "关闭",
    goToChats: "前往聊天",
    copiedToClipboard: "已复制到剪贴板"
  },

  // Sidebar elements
  sidebar: {
    conversations: "最近的对话",
    tools: "工具"
  },

  // Account section
  account: {
    myAccount: "我的账户",
    profile: "个人资料",
    logout: "注销"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "删除对话？",
      description: "您确定要删除“{title}”吗？此操作无法撤销。"
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "查看摘要片段",
    viewFullSummary: "查看完整摘要",
    defaultName: "文档",
    fullSummaryTitle: "完整摘要：{docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "文件过大",
      description: "最大文件大小为{maxSize}MB"
    },
    invalidType: {
      title: "无效的文件类型",
      description: "允许的文件：{allowed}"
    },
    preparing: "正在准备上传 {fileName}...",
    processingAi: "正在使用AI处理 {fileName}...",
    processingComplete: "{fileName} 处理完成",
    processingFailed: "{fileName} 处理失败",
    readingFailed: "{fileName} 读取失败",
    uploadFailed: "{fileName} 上传失败",
    fileProcessed: "文件已处理",
    fileProcessedSummary: "{fileName} 处理成功",
    aiError: "AI处理错误",
    couldNotProcess: "无法处理 {fileName}",
    status: {
      pendingUpload: "等待上传...",
      uploading: "上传中... {progress}%",
      pendingProcessing: "等待AI处理...",
      processing: "处理中... {progress}%",
      completed: "已完成",
      failed: "失败"
    }
  },

  // Feedback dialog
  feedback: {
    title: "发送反馈",
    description: "分享您使用FlowserveAI的体验。您的反馈有助于我们改进。",
    placeholder: "告诉我们您的体验...",
    send: "发送反馈",
    cancel: "取消",
    sending: "正在发送反馈...",
    success: "反馈发送成功！",
    error: "发送反馈失败。请重试。",
    characterCount: "{count}/3000",
    minCharacters: "至少需要100个字符"
  }
};

export default translations;