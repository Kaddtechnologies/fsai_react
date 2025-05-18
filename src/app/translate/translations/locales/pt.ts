const translations = {
    // Settings dialog
    settings: {
      title: "Configurações",
      description: "Personalize sua experiência FlowserveAI. As alterações serão aplicadas imediatamente.",
      language: "Idioma",
      save: "Salvar alterações"
    },
    
    // Empty state
    emptyState: {
      welcome: "Bem-vindo ao FlowserveAI",
      subtitle: "Conecte-se com segurança e converse com seus documentos, base de conhecimento e IA na rede Flowserve",
      startTyping: "Inicie uma conversa digitando abaixo",
      suggestions: {
        aiChat: {
          category: "Chat com IA",
          text: "Como funcionam as bombas centrífugas?"
        },
        documents: {
          category: "Documentos",
          text: "Resuma meus documentos de manutenção"
        },
        products: {
          category: "Produtos",
          text: "Buscar válvulas de controle de fluxo"
        }
      }
    },
    
    // Welcome dialog
    welcomeDialog: {
      title: "Bem-vindo ao Flowserve AI",
      subtitle: "Sua plataforma unificada para assistência inteligente, análise de documentos e conhecimento de produtos.",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "Seu Assistente Digital",
        description: "Participe de conversas naturais para obter respostas, entender tópicos complexos e receber assistência com várias tarefas relacionadas às ofertas da Flowserve.",
        capabilities: {
          root: "O que o Flowserve AI pode fazer por você?",
          answer: "Responder perguntas",
          explain: "Fornecer explicações",
          assist: "Auxiliar em tarefas"
        }
      },
      // Document section
      documents: {
        title: "Análise de Documentos",
        subtitle: "Converse com seus Documentos",
        maxFileSize: "Tamanho máximo de arquivo 5MB",
        onlyPDF: "Apenas arquivos PDF",
        vectorSearch: "Busca semântica baseada em vetores",
        description: "Carregue seus documentos (PDFs) e interaja com eles diretamente no chat. Faça perguntas específicas sobre o conteúdo, obtenha resumos e extraia informações com nossa tecnologia de busca semântica.",
        flow: {
          upload: {
            title: "Carregar Documento",
            description: "Carregue seus arquivos PDF com segurança."
          },
          conversation: {
            title: "Iniciar Conversa",
            description: "Faça perguntas sobre seu documento."
          },
          insights: {
            title: "Extrair Insights",
            description: "Obtenha resumos e informações-chave."
          }
        }
      },
      // Translation section
      translation: {
        title: "Tradução",
        subtitle: "Suporte Multilíngue",
        description: "Traduza texto e documentos entre vários idiomas. Use a ferramenta dedicada \"Traduzir\" na barra lateral.",
        supportedLanguages: "Idiomas Suportados para Texto:",
        supportedDocTypes: "Tipos de Documentos Suportados para o Módulo de Tradução (Futuro):",
        videoTutorial: "Tutorial em Vídeo (Placeholder)",
        videoComingSoon: "Tutorial em vídeo em breve.",
        flow: {
          upload: {
            title: "Carregar",
            description: "Arquivos Word, PowerPoint, Excel, PDF."
          },
          selectLanguage: {
            title: "Selecionar Idioma",
            description: "Escolha seu idioma de destino."
          },
          receiveTranslation: {
            title: "Receber Tradução",
            description: "Obtenha seu conteúdo traduzido."
          },
          provideFeedback: {
            title: "Fornecer Feedback",
            description: "Ajude a melhorar traduções futuras."
          }
        }
      }
    },
    
    // Chat-related
    chat: {
      newChat: "Nova Conversa",
      placeholder: "Digite uma mensagem...",
      send: "Enviar",
      typing: "Flowserve AI está digitando...",
      loadMore: "Carregar mais mensagens",
      emptyConversation: "Iniciar uma nova conversa",
      uploadFile: "Carregar um arquivo",
      today: "Hoje",
      yesterday: "Ontem",
      deleteMessage: "Excluir esta mensagem",
      editMessage: "Editar esta mensagem",
      copyToClipboard: "Copiar para a área de transferência",
      copied: "Copiado para a área de transferência",
      loading: "Carregando...",
      errorLoading: "Erro ao carregar a conversa",
      messageSent: "Mensagem enviada",
      documentUploadSuccess: "Documento carregado com sucesso",
      documentUploadError: "Erro ao carregar o documento",
      documentProcessing: "Processando documento...",
      documentReady: "Documento pronto"
    },
    
    // Quick Actions
    quickActions: {
      title: "Ações Rápidas",
      questions: {
        espp: {
          question: "O que é o Plano de Compra de Ações para Funcionários (ESPP)?",
          answer: `# Plano de Compra de Ações para Funcionários (ESPP)

## Visão Geral
O ESPP permite que funcionários elegíveis comprem ações da Flowserve com desconto através de deduções na folha de pagamento.

## Características Principais
- Compra de ações com 15% de desconto
- Deduções automáticas na folha de pagamento
- Períodos de compra trimestrais
- Sem taxas de corretagem
- Aquisição imediata

## Elegibilidade
- Funcionários regulares em tempo integral
- Mínimo de 90 dias de emprego
- Não estar em licença

## Como Participar
1. Inscreva-se durante o período de inscrição aberta
2. Selecione a porcentagem de contribuição (1-10% da remuneração elegível)
3. Os fundos são deduzidos de cada contracheque
4. As ações são compradas trimestralmente com 15% de desconto

## Considerações Fiscais
- As compras são feitas com dólares após impostos
- Os ganhos são tributados como renda ordinária ou ganhos de capital
- Consulte um consultor fiscal para orientação específica`
        },
        retirement: {
          question: "Como gerencio meus investimentos 401(k)?",
          answer: `# Gerenciamento de Investimentos 401(k)

## Visão Geral
O plano 401(k) da Flowserve oferece uma variedade de opções de investimento para ajudar você a economizar para a aposentadoria.

## Características Principais
- Contribuição da empresa até 6% da remuneração elegível
- Aquisição imediata da contribuição da empresa
- Amplo leque de opções de investimento
- Gestão profissional de investimentos
- Acesso à conta online

## Opções de Investimento
1. Fundos de Data Alvo
2. Fundos de Índice
3. Fundos de Gestão Ativa
4. Fundo de Ações da Empresa
5. Fundo de Valor Estável

## Como Gerenciar
1. Acesse sua conta no [portal de aposentadoria]
2. Revise as alocações atuais
3. Ajuste a porcentagem de contribuição
4. Rebalanceie o portfólio conforme necessário
5. Monitore o desempenho regularmente

## Melhores Práticas
- Contribua pelo menos 6% para obter a contribuição total da empresa
- Diversifique entre diferentes classes de ativos
- Revise e rebalanceie anualmente
- Considere fundos de data alvo para simplicidade
- Aumente as contribuições com aumentos salariais`
        }
      }
    }
  };
  
  export default translations;