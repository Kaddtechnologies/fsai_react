const translations = {
  // Settings dialog
  settings: {
    title: "设置",
    description: "自定义您的FlowserveAI体验。更改将立即应用。",
    language: "语言",
    save: "保存更改"
  },
  
  // Empty state
  emptyState: {
    welcome: "欢迎使用FlowserveAI",
    subtitle: "在Flowserve网络上安全地连接并与您的文档、知识库和AI聊天",
    startTyping: "在下方输入开始对话",
    suggestions: {
      aiChat: {
        category: "AI聊天",
        text: "离心泵是如何工作的？"
      },
      documents: {
        category: "文档",
        text: "总结我的维护文档"
      },
      products: {
        category: "产品",
        text: "搜索流量控制阀"
      }
    }
  },
  
  // Welcome dialog
  welcomeDialog: {
    title: "欢迎使用Flowserve AI",
    subtitle: "您的智能辅助、文档分析和产品知识统一平台。",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "您的数字助手",
      description: "通过自然对话获取答案，理解复杂主题，并获得与Flowserve产品相关的各种任务的帮助。",
      capabilities: {
        root: "Flowserve AI能为您做什么？",
        answer: "回答问题",
        explain: "提供解释",
        assist: "协助任务"
      }
    },
    // Document section
    documents: {
      title: "文档分析",
      subtitle: "与您的文档对话",
      maxFileSize: "最大文件大小5MB",
      onlyPDF: "仅限PDF文件",
      vectorSearch: "向量驱动的语义搜索",
      description: "上传您的文档（PDF）并在聊天中直接与它们互动。通过我们的语义搜索技术，提出有关其内容的具体问题，获取摘要并提取信息。",
      flow: {
        upload: {
          title: "上传文档",
          description: "安全上传您的PDF文件。"
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
      description: "在各种语言之间翻译文本和文档。使用侧边栏中专门的\"翻译\"工具。",
      supportedLanguages: "支持的文本语言：",
      supportedDocTypes: "翻译模块支持的文档类型（未来）：",
      videoTutorial: "视频教程（占位符）",
      videoComingSoon: "视频教程即将推出。",
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
          description: "获取您的翻译内容。"
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
    newChat: "新对话",
    placeholder: "输入消息...",
    send: "发送",
    typing: "Flowserve AI正在输入...",
    loadMore: "加载更多消息",
    emptyConversation: "开始新对话",
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
    documentUploadError: "上传文档时出错",
    documentProcessing: "文档处理中...",
    documentReady: "文档准备就绪"
  },
  
  // Quick Actions
  quickActions: {
    title: "快速操作",
    questions: {
      espp: {
        question: "什么是员工股票购买计划 (ESPP)?",
        answer: `# 员工股票购买计划 (ESPP)

## 概述
ESPP允许符合条件的员工通过工资扣除以折扣价购买Flowserve股票。

## 主要特点
- 以15%折扣购买股票
- 自动工资扣除
- 季度购买期
- 无经纪费用
- 即时归属

## 资格要求
- 正式全职员工
- 至少90天工作经历
- 不在休假期间

## 参与方式
1. 在开放注册期间注册
2. 选择供款百分比（合格薪酬的1-10%）
3. 从每份工资中扣除资金
4. 股票按季度以15%折扣购买

## 税务考虑
- 购买使用税后美元
- 收益按普通收入或资本利得征税
- 咨询税务顾问获取具体指导`
      },
      retirement: {
        question: "如何管理我的401(k)投资?",
        answer: `# 管理401(k)投资

## 概述
Flowserve 401(k)计划提供多种投资选择，帮助您为退休储蓄。

## 主要特点
- 公司匹配最高可达合格薪酬的6%
- 公司匹配即时归属
- 广泛的投资选择
- 专业投资管理
- 在线账户访问

## 投资选择
1. 目标日期基金
2. 指数基金
3. 主动管理基金
4. 公司股票基金
5. 稳定价值基金

## 管理方法
1. 登录[退休门户]账户
2. 查看当前配置
3. 调整供款百分比
4. 根据需要重新平衡投资组合
5. 定期监控表现

## 最佳实践
- 至少供款6%以获得全额公司匹配
- 在不同资产类别间分散投资
- 每年审查和重新平衡
- 考虑目标日期基金以简化操作
- 随薪资增长增加供款`
      }
    }
  }
};

export default translations;