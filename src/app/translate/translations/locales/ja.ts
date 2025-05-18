const translations = {
    // Settings dialog
    settings: {
      title: "設定",
      description: "FlowserveAIエクスペリエンスをカスタマイズします。変更はすぐに適用されます。",
      language: "言語",
      save: "変更を保存"
    },
    
    // Empty state
    emptyState: {
      welcome: "FlowserveAIへようこそ",
      subtitle: "Flowserveネットワーク上のドキュメント、ナレッジベース、AIと安全に接続して会話する",
      startTyping: "下記に入力して会話を始めましょう",
      suggestions: {
        aiChat: {
          category: "AIチャット",
          text: "遠心ポンプはどのように機能しますか？"
        },
        documents: {
          category: "ドキュメント",
          text: "私のメンテナンス文書を要約する"
        },
        products: {
          category: "製品",
          text: "流量制御バルブを検索する"
        }
      }
    },
    
    // Welcome dialog
    welcomeDialog: {
      title: "Flowserve AIへようこそ",
      subtitle: "インテリジェントなアシスタンス、文書分析、製品知識のための統合プラットフォーム。",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "あなたのデジタルアシスタント",
        description: "自然な会話を通じて、回答を得たり、複雑なトピックを理解したり、Flowserveの製品に関連するさまざまなタスクでサポートを受けることができます。",
        capabilities: {
          root: "Flowserve AIはあなたに何ができますか？",
          answer: "質問に答える",
          explain: "説明を提供する",
          assist: "タスクをサポートする"
        }
      },
      // Document section
      documents: {
        title: "ドキュメント分析",
        subtitle: "あなたのドキュメントとチャット",
        maxFileSize: "最大ファイルサイズ5MB",
        onlyPDF: "PDFファイルのみ",
        vectorSearch: "ベクトル駆動のセマンティック検索",
        description: "ドキュメント（PDF）をアップロードし、チャットで直接対話しましょう。コンテンツに関する具体的な質問をし、要約を取得し、セマンティック検索技術で情報を抽出します。",
        flow: {
          upload: {
            title: "ドキュメントをアップロード",
            description: "PDFファイルを安全にアップロードします。"
          },
          conversation: {
            title: "会話を始める",
            description: "あなたのドキュメントについて質問します。"
          },
          insights: {
            title: "洞察を抽出する",
            description: "要約や重要な情報を取得します。"
          }
        }
      },
      // Translation section
      translation: {
        title: "翻訳",
        subtitle: "複数言語サポート",
        description: "テキストやドキュメントをさまざまな言語間で翻訳します。サイドバーの専用「翻訳」ツールを使用してください。",
        supportedLanguages: "テキスト用サポート言語：",
        supportedDocTypes: "翻訳モジュール対応ドキュメントタイプ（将来）：",
        videoTutorial: "ビデオチュートリアル（プレースホルダー）",
        videoComingSoon: "ビデオチュートリアル準備中。",
        flow: {
          upload: {
            title: "アップロード",
            description: "Word、PowerPoint、Excel、PDFファイル。"
          },
          selectLanguage: {
            title: "言語を選択",
            description: "目標言語を選んでください。"
          },
          receiveTranslation: {
            title: "翻訳を受け取る",
            description: "翻訳されたコンテンツを取得します。"
          },
          provideFeedback: {
            title: "フィードバックを提供",
            description: "将来の翻訳改善にご協力ください。"
          }
        }
      }
    },
    
    // Chat-related
    chat: {
      newChat: "新しいチャット",
      placeholder: "メッセージを入力...",
      send: "送信",
      typing: "Flowserve AIが入力中...",
      loadMore: "更にメッセージを読み込む",
      emptyConversation: "新しい会話を始める",
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
      documentReady: "ドキュメント準備完了"
    },
    
    // Quick Actions
    quickActions: {
      title: "クイックアクション",
      questions: {
        espp: {
          question: "従業員株式購入計画（ESPP）とは何ですか？",
          answer: `# 従業員株式購入計画（ESPP）

## 概要
ESPPは、適格な従業員が給与控除を通じてFlowserve株式を割引価格で購入できる制度です。

## 主な特徴
- 15%割引で株式を購入
- 自動給与控除
- 四半期ごとの購入期間
- 取引手数料なし
- 即時付与

## 適格要件
- 正規のフルタイム従業員
- 最低90日の勤務期間
- 休職中でないこと

## 参加方法
1. 登録期間中に登録
2. 拠出率を選択（適格報酬の1-10%）
3. 各給与から資金を控除
4. 四半期ごとに15%割引で株式を購入

## 税務上の考慮事項
- 税引後ドルで購入
- 利益は通常所得またはキャピタルゲインとして課税
- 具体的なアドバイスは税務アドバイザーに相談`
        },
        retirement: {
          question: "401(k)投資をどのように管理すればよいですか？",
          answer: `# 401(k)投資の管理

## 概要
Flowserve 401(k)プランは、退職後のための貯蓄を支援する様々な投資オプションを提供しています。

## 主な特徴
- 適格報酬の最大6%までの会社マッチング
- 会社マッチングの即時付与
- 幅広い投資オプション
- 専門的な投資管理
- オンラインアカウントアクセス

## 投資オプション
1. ターゲットデートファンド
2. インデックスファンド
3. アクティブ運用ファンド
4. 会社株式ファンド
5. 安定価値ファンド

## 管理方法
1. [退職ポータル]でアカウントにログイン
2. 現在の配分を確認
3. 拠出率を調整
4. 必要に応じてポートフォリオをリバランス
5. 定期的にパフォーマンスをモニタリング

## ベストプラクティス
- 会社マッチングを最大限に活用するために最低6%を拠出
- 異なる資産クラスに分散投資
- 年1回の見直しとリバランス
- シンプルさのためにターゲットデートファンドを検討
- 給与増加に伴い拠出額を増加`
        }
      }
    }
  };
  
  export default translations;