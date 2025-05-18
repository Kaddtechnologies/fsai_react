const translations = {
    // Settings dialog
    settings: {
      title: "설정",
      description: "FlowserveAI 경험을 사용자 정의하세요. 변경 사항은 즉시 적용됩니다.",
      language: "언어",
      save: "변경 사항 저장"
    },
    
    // Empty state
    emptyState: {
      welcome: "FlowserveAI에 오신 것을 환영합니다",
      subtitle: "Flowserve 네트워크에서 문서, 지식 베이스 및 AI와 안전하게 연결하고 채팅하세요",
      startTyping: "아래에 입력하여 대화를 시작하세요",
      suggestions: {
        aiChat: {
          category: "AI 채팅",
          text: "원심 펌프는 어떻게 작동하나요?"
        },
        documents: {
          category: "문서",
          text: "내 유지보수 문서를 요약해주세요"
        },
        products: {
          category: "제품",
          text: "유량 제어 밸브 검색"
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
        subtitle: "당신의 디지털 어시스턴트",
        description: "자연스러운 대화를 통해 답변을 얻고, 복잡한 주제를 이해하고, Flowserve 제품과 관련된 다양한 작업에 대한 도움을 받으세요.",
        capabilities: {
          root: "Flowserve AI가 당신을 위해 무엇을 할 수 있을까요?",
          answer: "질문에 답변하기",
          explain: "설명 제공하기",
          assist: "작업 지원하기"
        }
      },
      // Document section
      documents: {
        title: "문서 분석",
        subtitle: "문서와 대화하세요",
        maxFileSize: "최대 파일 크기 5MB",
        onlyPDF: "PDF 파일만 가능",
        vectorSearch: "벡터 기반 의미 검색",
        description: "문서(PDF)를 업로드하고 채팅에서 직접 상호 작용하세요. 콘텐츠에 대한 특정 질문을 하고, 요약을 얻고, 의미 검색 기술로 정보를 추출하세요.",
        flow: {
          upload: {
            title: "문서 업로드",
            description: "PDF 파일을 안전하게 업로드하세요."
          },
          conversation: {
            title: "대화 시작",
            description: "문서에 대해 질문하세요."
          },
          insights: {
            title: "인사이트 추출",
            description: "요약 및 핵심 정보를 얻으세요."
          }
        }
      },
      // Translation section
      translation: {
        title: "번역",
        subtitle: "다국어 지원",
        description: "다양한 언어 간에 텍스트와 문서를 번역하세요. 사이드바의 전용 \"번역\" 도구를 사용하세요.",
        supportedLanguages: "텍스트 지원 언어:",
        supportedDocTypes: "번역 모듈 지원 문서 유형 (향후):",
        videoTutorial: "비디오 튜토리얼 (플레이스홀더)",
        videoComingSoon: "비디오 튜토리얼이 곧 제공됩니다.",
        flow: {
          upload: {
            title: "업로드",
            description: "Word, PowerPoint, Excel, PDF 파일."
          },
          selectLanguage: {
            title: "언어 선택",
            description: "대상 언어를 선택하세요."
          },
          receiveTranslation: {
            title: "번역 받기",
            description: "번역된 콘텐츠를 받으세요."
          },
          provideFeedback: {
            title: "피드백 제공",
            description: "향후 번역 개선에 도움을 주세요."
          }
        }
      }
    },
    
    // Chat-related
    chat: {
      newChat: "새 채팅",
      placeholder: "메시지를 입력하세요...",
      send: "보내기",
      typing: "Flowserve AI가 입력 중...",
      loadMore: "더 많은 메시지 로드",
      emptyConversation: "새 대화 시작",
      uploadFile: "파일 업로드",
      today: "오늘",
      yesterday: "어제",
      deleteMessage: "이 메시지 삭제",
      editMessage: "이 메시지 편집",
      copyToClipboard: "클립보드에 복사",
      copied: "클립보드에 복사됨",
      loading: "로딩 중...",
      errorLoading: "대화 로딩 중 오류 발생",
      messageSent: "메시지 전송됨",
      documentUploadSuccess: "문서가 성공적으로 업로드됨",
      documentUploadError: "문서 업로드 중 오류 발생",
      documentProcessing: "문서 처리 중...",
      documentReady: "문서 준비 완료"
    },
    
    // Quick Actions
    quickActions: {
      title: "빠른 작업",
      questions: {
        espp: {
          question: "직원 주식 구매 계획(ESPP)이란 무엇인가요?",
          answer: `# 직원 주식 구매 계획(ESPP)

## 개요
ESPP는 자격이 있는 직원이 급여 공제를 통해 Flowserve 주식을 할인된 가격으로 구매할 수 있게 해주는 제도입니다.

## 주요 특징
- 15% 할인된 가격으로 주식 구매
- 자동 급여 공제
- 분기별 구매 기간
- 중개 수수료 없음
- 즉시 소유권 부여

## 자격 요건
- 정규 전일제 직원
- 최소 90일 근무 기간
- 휴직 중이 아님

## 참여 방법
1. 등록 기간 동안 등록
2. 기부 비율 선택(적격 보상의 1-10%)
3. 각 급여에서 자금 공제
4. 분기별로 15% 할인된 가격으로 주식 구매

## 세금 고려사항
- 세후 달러로 구매
- 수익은 일반 소득 또는 자본 이득으로 과세
- 구체적인 조언은 세무 고문에게 문의`
        },
        retirement: {
          question: "401(k) 투자를 어떻게 관리하나요?",
          answer: `# 401(k) 투자 관리

## 개요
Flowserve 401(k) 플랜은 퇴직 후를 위한 저축을 돕기 위한 다양한 투자 옵션을 제공합니다.

## 주요 특징
- 적격 보상의 최대 6%까지 회사 매칭
- 회사 매칭 즉시 소유권 부여
- 다양한 투자 옵션
- 전문적인 투자 관리
- 온라인 계정 접근

## 투자 옵션
1. 목표 날짜 펀드
2. 지수 펀드
3. 적극 관리 펀드
4. 회사 주식 펀드
5. 안정 가치 펀드

## 관리 방법
1. [퇴직 포털]에서 계정 로그인
2. 현재 배분 검토
3. 기부 비율 조정
4. 필요에 따라 포트폴리오 재조정
5. 정기적으로 성과 모니터링

## 모범 사례
- 회사 매칭을 최대한 활용하기 위해 최소 6% 기부
- 다양한 자산 클래스에 분산 투자
- 연간 검토 및 재조정
- 단순함을 위해 목표 날짜 펀드 고려
- 급여 인상에 따라 기부금 증가`
        }
      }
    }
  };
  
  export default translations;