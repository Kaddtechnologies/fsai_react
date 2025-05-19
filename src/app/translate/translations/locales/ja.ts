const translations = {
  // Settings dialog
  settings: {
    title: "設定",
    secondaryTitle: "その他",
    description: "FlowserveAI体験をカスタマイズします。変更はすぐに適用されます。",
    language: "言語",
    theme: "テーマ",
    themeOptions: {
      light: "ライト",
      dark: "ダーク",
      system: "システム"
    },
    save: "変更を保存",
    saveStatus: {
      success: "設定が保存されました",
      description: "設定は正常に更新されました"
    },
    tools: "ツール",
    preferences: "環境設定",
    darkMode: "ダークモード",
    support: "ヘルプとサポート",
    policies: "ポリシー",
    selectLanguage: "言語を選択",
    search: "言語を検索...",
    noLanguageMatch: "検索に一致する言語がありません"
  },

  // Tools section
  tools: {
    documents: "ドキュメント",
    documentsDesc: "アップロードされたドキュメントを表示および管理します",
    chat: "チャット",
    chatDesc: "Flowserve AIアシスタントとチャットします",
    jobs: "翻訳",
    jobsDesc: "テキストとドキュメントを翻訳します",
    translate: "翻訳",
    translationModule: "翻訳モジュール",
    products: "製品"
  },

  // Support section
  support: {
    help: "ヘルプセンター",
    helpDesc: "Flowserve AIの使用に関するヘルプを取得します"
  },

  // Policies section
  policies: {
    privacy: "プライバシーポリシー",
    privacyDesc: "データの取り扱い方法",
    ai: "AIガイドライン",
    aiDesc: "AIを責任を持って使用する方法"
  },

  // Empty state
  emptyState: {
    welcome: "FlowserveAIへようこそ",
    subtitle: "Flowserveネットワーク上でドキュメント、ナレッジベース、AIと安全に接続してチャットします",
    startTyping: "以下に入力して会話を開始します",
    suggestions: {
      aiChat: {
        category: "製品",
        text: "Flowserve IDURCO Mark 3高シリコンポンプについて説明してください"
      },
      documents: {
        category: "製品",
        text: "Flowserve IDURCO Mark 3高ケイ素鉄ポンプの操作方法を教えてください。"
      },
      products: {
        category: "福利厚生",
        text: "401(k)投資を管理するにはどうすればよいですか？"
      }
    }
  },

  // Welcome dialog
  welcomeDialog: {
    title: "Flowserve AIへようこそ",
    subtitle: "インテリジェントな支援、ドキュメント分析、製品知識のための統合プラットフォームです。",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "あなたのデジタルアシスタント",
      description: "自然な会話で質問への回答を得たり、複雑なトピックを理解したり、Flowserveの製品に関連するさまざまなタスクの支援を受けたりできます。",
      capabilities: {
        root: "Flowserve AIで何ができますか？",
        answer: "質問に答える",
        explain: "説明を提供する",
        assist: "タスクを支援する"
      }
    },
    // Document section
    documents: {
      title: "ドキュメント分析",
      subtitle: "ドキュメントとチャット",
      maxFileSize: "最大ファイルサイズ5MB",
      onlyPDF: "PDFファイルのみ",
      vectorSearch: "ベクトルを利用したセマンティック検索",
      extractInfo: "ドキュメントから情報を抽出",
      description: "ドキュメント（PDF）をアップロードし、チャットで直接操作します。コンテンツに関する特定の質問をしたり、要約を取得したり、セマンティック検索テクノロジーを使用して情報を抽出したりできます。",
      flow: {
        upload: {
          title: "ドキュメントをアップロード",
          description: "PDFファイルを安全にアップロードします。"
        },
        conversation: {
          title: "会話を開始",
          description: "ドキュメントについて質問します。"
        },
        insights: {
          title: "インサイトを抽出",
          description: "要約と重要な情報を取得します。"
        }
      }
    },
    // Translation section
    translation: {
      title: "翻訳",
      subtitle: "多言語サポート",
      description: "さまざまな言語間でテキストやドキュメントを翻訳します。サイドバーの専用「翻訳」ツールを使用してください。",
      supportedLanguages: "テキストの対応言語：",
      supportedDocTypes: "翻訳モジュールでサポートされているドキュメントタイプ（将来）：",
      videoTutorial: "ビデオチュートリアル",
      videoComingSoon: "ビデオチュートリアルは近日公開予定です。",
      unsupportedVideo: "お使いのブラウザはビデオタグをサポートしていません。",
      flow: {
        upload: {
          title: "アップロード",
          description: "Word、PowerPoint、Excel、PDFファイル。"
        },
        selectLanguage: {
          title: "言語を選択",
          description: "ターゲット言語を選択してください。"
        },
        receiveTranslation: {
          title: "翻訳を受け取る",
          description: "翻訳されたコンテンツを取得します。"
        },
        provideFeedback: {
          title: "フィードバックを提供する",
          description: "今後の翻訳の改善にご協力ください。"
        }
      }
    }
  },

  // Chat-related
  chat: {
    newChat: "新しいチャット",
    placeholder: "メッセージを入力...",
    placeholderMobile: "メッセージを入力...",
    send: "送信",
    typing: "Flowserve AIが入力中です...",
    loadMore: "さらにメッセージを読み込む",
    emptyConversation: "新しい会話を開始",
    uploadFile: "ファイルをアップロード",
    today: "今日",
    yesterday: "昨日",
    deleteMessage: "このメッセージを削除",
    editMessage: "このメッセージを編集",
    copyToClipboard: "クリップボードにコピー",
    copied: "クリップボードにコピーしました",
    loading: "読み込み中...",
    errorLoading: "会話の読み込み中にエラーが発生しました",
    messageSent: "メッセージを送信しました",
    documentUploadSuccess: "ドキュメントが正常にアップロードされました",
    documentUploadError: "ドキュメントのアップロード中にエラーが発生しました",
    documentProcessing: "ドキュメント処理中...",
    documentReady: "ドキュメントの準備ができました",
    welcome: "FlowserveAIチャットへようこそ",
    welcomeSubtitle: "Flowserveネットワークでドキュメント、ナレッジベース、AIとチャットします",
    newChatCreated: "新しいチャットが作成されました",
    conversationDeleted: "会話が削除されました",
    conversationRenamed: "会話の名前が変更されました",
    renameCancelledEmpty: {
      title: "名前の変更をキャンセルしました",
      description: "新しいタイトルを空にすることはできません"
    },
    renameCancelledUnchanged: {
      title: "変更なし",
      description: "タイトルは変更されていません"
    },
    renameCancelled: "名前の変更をキャンセルしました",
    messageEdited: "メッセージが編集されました",
    notFound: "チャット{id}が見つかりません",
    noActiveSession: "アクティブなチャットセッションがありません",
    selectOrStartNew: "サイドバーからチャットを選択するか、新しい会話を開始してください",
    aiDisclaimer: "AIの応答は常に正確であるとは限りません。重要な情報は必ず確認してください。",
    enterNewTitle: "新しいタイトルを入力",
    containsDocuments: "この会話にはドキュメントが含まれています"
  },

  // Documents page
  documentsPage: {
    title: "マイドキュメント",
    description: "アップロードしたすべてのドキュメントを参照および管理します。",
    noDocuments: {
      title: "ドキュメントが見つかりません",
      description: "まだドキュメントをアップロードしていません。チャットでドキュメントをアップロードすると、ここに表示されます。",
      action: "チャットへ移動"
    },
    document: {
      uploaded: "アップロード済み",
      size: "サイズ",
      viewSummary: "概要を表示",
      chatAction: "ドキュメントについてチャット"
    },
    loading: "読み込み中..."
  },

  // Documents page (used in documents/page.tsx)
  documents: {
    title: "マイドキュメント",
    description: "アップロードしたすべてのドキュメントを参照および管理します。",
    noDocumentsFound: "ドキュメントが見つかりません",
    noDocumentsDesc: "まだドキュメントをアップロードしていません。チャットでドキュメントをアップロードすると、ここに表示されます。",
    goToChat: "チャットへ移動",
    uploaded: "アップロード済み",
    size: "サイズ",
    viewSummarySnippet: "概要スニペットを表示",
    viewFullSummary: "完全な概要を表示",
    fullSummary: "完全な概要",
    chatAboutDocument: "ドキュメントについてチャット",
    rawMarkdownPreview: "ドキュメント概要の生のマークダウンプレビュー"
  },

  // Translation page
  translation: {
    new: "新しい翻訳ジョブ",
    edit: "ジョブを編集",
    noActiveJob: "アクティブなジョブがありません",
    createNew: "新しいジョブを作成するか、履歴から選択します",
    createNewButton: "新しいジョブを作成",
    jobTitle: "ジョブタイトル",
    enterJobTitle: "ジョブタイトルを入力",
    jobType: "ジョブタイプ",
    selectJobType: "ジョブタイプを選択",
    textTranslation: "テキスト翻訳",
    documentTranslation: "ドキュメント翻訳",
    sourceLanguage: "ソース言語",
    selectSourceLanguage: "ソース言語を選択",
    autoDetect: "自動検出",
    targetLanguage: "ターゲット言語",
    selectTargetLanguage: "ターゲット言語を選択",
    enterTextToTranslate: "翻訳するテキストを入力...",
    characters: "文字",
    copyText: "テキストをコピー",
    speakText: "テキストを読み上げる",
    translationWillAppear: "翻訳はここに表示されます...",
    copyTranslation: "翻訳をコピー",
    speakTranslation: "翻訳を読み上げる",
    jobHistory: "ジョブ履歴",
    newJob: "新しいジョブ",
    deleteJob: "ジョブを削除",
    cancel: "キャンセル",
    save: "保存",
    saved: "保存済み",
    translate: "翻訳",
    translating: "翻訳中...",
    completed: "完了",

    // Add more translation keys
    allTypes: "すべてのタイプ",
    textJobs: "テキストジョブ",
    documentJobs: "ドキュメントジョブ",
    status: "ステータス",
    filterByStatus: "ステータスでフィルタリング",
    noJobsMatch: "基準に一致するジョブがありません",
    adjustFilters: "フィルタを調整してみてください",
    searchJobs: "ジョブを検索",
    discardChanges: "未保存の変更を破棄しますか？",
    unsavedChangesDesc: "未保存の変更があります。変更を破棄してこのジョブの編集をキャンセルしてもよろしいですか？",
    keepEditing: "編集を続ける",
    discardAndReset: "破棄してリセット",
    deleteJobConfirm: "ジョブを削除しますか？",
    deleteJobDesc: "ジョブ「{jobName}」を削除してもよろしいですか？この操作は元に戻せません。",
    maxFiles: "最大{max}ファイル。合計最大{size}MB。",
    browseFiles: "ファイルを参照",
    selectedFiles: "選択されたファイル ({count}/{max}):",
    togglePdfDocx: "PDF→DOCXを切り替え",
    pdfToDocxTooltip: "翻訳時にPDFをDOCXに変換",
    removeFile: "ファイルを削除",
    translatedDocuments: "{language}の翻訳済みドキュメント:",
    download: "ダウンロード",
    downloadSelected: "選択項目をダウンロード",
    downloadAllZip: "すべてをZIPでダウンロード",
    translationIssues: "翻訳の問題",
    actionCancelled: "アクションがキャンセルされました",
    actionCancelledDesc: "現在の操作はキャンセルされました。"
  },

  // Common UI elements
  common: {
    close: "閉じる",
    chat: "チャット",
    unknownError: "不明なエラー",
    selectedChat: "選択されたチャット",
    appName: "FlowserveAI",
    invalidDate: "無効な日付",
    logoAlt: "Flowserve AI"
  },

  // Action buttons
  actions: {
    rename: "名前を変更",
    delete: "削除",
    cancel: "キャンセル",
    close: "閉じる",
    goToChats: "チャットへ移動",
    copiedToClipboard: "クリップボードにコピーしました"
  },

  // Sidebar elements
  sidebar: {
    conversations: "最近の会話",
    tools: "ツール"
  },

  // Account section
  account: {
    myAccount: "マイアカウント",
    profile: "プロフィール",
    logout: "ログアウト"
  },

  // Alerts
  alerts: {
    deleteConfirm: {
      title: "会話を削除しますか？",
      description: "「{title}」を削除してもよろしいですか？この操作は元に戻せません。"
    }
  },

  // Document related
  document: {
    viewSummarySnippet: "概要スニペットを表示",
    viewFullSummary: "完全な概要を表示",
    defaultName: "ドキュメント",
    fullSummaryTitle: "完全な概要: {docName}"
  },

  // File uploads
  uploads: {
    fileTooLarge: {
      title: "ファイルが大きすぎます",
      description: "最大ファイルサイズは{maxSize}MBです"
    },
    invalidType: {
      title: "無効なファイルタイプ",
      description: "許可されるファイル: {allowed}"
    },
    preparing: "{fileName}をアップロード準備中...",
    processingAi: "{fileName}をAIで処理中...",
    processingComplete: "{fileName}の処理が完了しました",
    processingFailed: "{fileName}の処理に失敗しました",
    readingFailed: "{fileName}の読み取りに失敗しました",
    uploadFailed: "{fileName}のアップロードに失敗しました",
    fileProcessed: "ファイルが処理されました",
    fileProcessedSummary: "{fileName}が正常に処理されました",
    aiError: "AI処理エラー",
    couldNotProcess: "{fileName}を処理できませんでした",
    status: {
      pendingUpload: "アップロード保留中...",
      uploading: "アップロード中... {progress}%",
      pendingProcessing: "AI処理保留中...",
      processing: "処理中... {progress}%",
      completed: "完了",
      failed: "失敗"
    }
  },

  // Feedback dialog
  feedback: {
    title: "フィードバックを送信",
    description: "FlowserveAIでの体験を共有してください。皆様のフィードバックは改善に役立ちます。",
    placeholder: "体験についてお聞かせください...",
    send: "フィードバックを送信",
    cancel: "キャンセル",
    sending: "フィードバックを送信中...",
    success: "フィードバックが正常に送信されました！",
    error: "フィードバックの送信に失敗しました。もう一度お試しください。",
    characterCount: "{count}/3000",
    minCharacters: "最低100文字必要です"
  }
};

export default translations;