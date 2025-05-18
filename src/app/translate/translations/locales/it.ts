const translations = {
    // Settings dialog
    settings: {
      title: "Impostazioni",
      description: "Personalizza la tua esperienza FlowserveAI. Le modifiche verranno applicate immediatamente.",
      language: "Lingua",
      save: "Salva modifiche"
    },
    
    // Empty state
    emptyState: {
      welcome: "Benvenuto su FlowserveAI",
      subtitle: "Connettiti in modo sicuro e chatta con i tuoi documenti, il tuo knowledge base e l'AI sulla rete Flowserve",
      startTyping: "Inizia una conversazione digitando qui sotto",
      suggestions: {
        aiChat: {
          category: "Chat AI",
          text: "Come funzionano le pompe centrifughe?"
        },
        documents: {
          category: "Documenti",
          text: "Riassumi i miei documenti di manutenzione"
        },
        products: {
          category: "Prodotti",
          text: "Cerca valvole di controllo del flusso"
        }
      }
    },
    
    // Welcome dialog
    welcomeDialog: {
      title: "Benvenuto su Flowserve AI",
      subtitle: "La tua piattaforma unificata per assistenza intelligente, analisi dei documenti e conoscenza dei prodotti.",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "Il tuo Assistente Digitale",
        description: "Impegnati in conversazioni naturali per ottenere risposte, comprendere argomenti complessi e ricevere assistenza per varie attività relative alle offerte di Flowserve.",
        capabilities: {
          root: "Cosa può fare Flowserve AI per te?",
          answer: "Rispondere alle domande",
          explain: "Fornire spiegazioni",
          assist: "Assistere con le attività"
        }
      },
      // Document section
      documents: {
        title: "Analisi dei Documenti",
        subtitle: "Chatta con i Tuoi Documenti",
        maxFileSize: "Dimensione massima file 5MB",
        onlyPDF: "Solo file PDF",
        vectorSearch: "Ricerca semantica basata su vettori",
        description: "Carica i tuoi documenti (PDF) e interagisci direttamente con essi nella chat. Fai domande specifiche sul loro contenuto, ottieni riassunti ed estrai informazioni con la nostra tecnologia di ricerca semantica.",
        flow: {
          upload: {
            title: "Carica Documento",
            description: "Carica in modo sicuro i tuoi file PDF."
          },
          conversation: {
            title: "Inizia Conversazione",
            description: "Fai domande sul tuo documento."
          },
          insights: {
            title: "Estrai Informazioni",
            description: "Ottieni riassunti e informazioni chiave."
          }
        }
      },
      // Translation section
      translation: {
        title: "Traduzione",
        subtitle: "Supporto Multilingua",
        description: "Traduci testi e documenti tra varie lingue. Utilizza lo strumento dedicato \"Traduci\" nella barra laterale.",
        supportedLanguages: "Lingue supportate per il testo:",
        supportedDocTypes: "Tipi di documenti supportati per il modulo di traduzione (futuro):",
        videoTutorial: "Tutorial Video (Segnaposto)",
        videoComingSoon: "Tutorial video in arrivo.",
        flow: {
          upload: {
            title: "Carica",
            description: "File Word, PowerPoint, Excel, PDF."
          },
          selectLanguage: {
            title: "Seleziona Lingua",
            description: "Scegli la tua lingua di destinazione."
          },
          receiveTranslation: {
            title: "Ricevi Traduzione",
            description: "Ottieni il tuo contenuto tradotto."
          },
          provideFeedback: {
            title: "Fornisci Feedback",
            description: "Aiuta a migliorare le traduzioni future."
          }
        }
      }
    },
    
    // Chat-related
    chat: {
      newChat: "Nuova Chat",
      placeholder: "Scrivi un messaggio...",
      send: "Invia",
      typing: "Flowserve AI sta scrivendo...",
      loadMore: "Carica altri messaggi",
      emptyConversation: "Inizia una nuova conversazione",
      uploadFile: "Carica un file",
      today: "Oggi",
      yesterday: "Ieri",
      deleteMessage: "Elimina questo messaggio",
      editMessage: "Modifica questo messaggio",
      copyToClipboard: "Copia negli appunti",
      copied: "Copiato negli appunti",
      loading: "Caricamento...",
      errorLoading: "Errore durante il caricamento della conversazione",
      messageSent: "Messaggio inviato",
      documentUploadSuccess: "Documento caricato con successo",
      documentUploadError: "Errore durante il caricamento del documento",
      documentProcessing: "Elaborazione del documento...",
      documentReady: "Documento pronto"
    },
    
    // Quick Actions
    quickActions: {
      title: "Azioni Rapide",
      questions: {
        espp: {
          question: "Che cos'è il Piano di Acquisto Azionario per i Dipendenti (ESPP)?",
          answer: `# Piano di Acquisto Azionario per i Dipendenti (ESPP)

## Panoramica
L'ESPP consente ai dipendenti idonei di acquistare azioni Flowserve con uno sconto attraverso detrazioni dalla busta paga.

## Caratteristiche Principali
- Acquisto di azioni con sconto del 15%
- Detrazioni automatiche dalla busta paga
- Periodi di acquisto trimestrali
- Nessuna commissione di intermediazione
- Acquisizione immediata

## Idoneità
- Dipendenti regolari a tempo pieno
- Minimo 90 giorni di impiego
- Non in congedo

## Come Partecipare
1. Iscrizione durante il periodo di iscrizione aperta
2. Selezione della percentuale di contribuzione (1-10% della retribuzione idonea)
3. I fondi vengono detratti da ogni busta paga
4. Le azioni vengono acquistate trimestralmente con sconto del 15%

## Considerazioni Fiscali
- Gli acquisti vengono effettuati con dollari al netto delle imposte
- I guadagni sono tassati come reddito ordinario o plusvalenze
- Consultare un consulente fiscale per indicazioni specifiche`
        },
        retirement: {
          question: "Come gestisco i miei investimenti 401(k)?",
          answer: `# Gestione degli Investimenti 401(k)

## Panoramica
Il piano 401(k) di Flowserve offre una gamma di opzioni di investimento per aiutarti a risparmiare per la pensione.

## Caratteristiche Principali
- Contributo aziendale fino al 6% della retribuzione idonea
- Acquisizione immediata del contributo aziendale
- Ampia gamma di opzioni di investimento
- Gestione professionale degli investimenti
- Accesso al conto online

## Opzioni di Investimento
1. Fondi con Data Obiettivo
2. Fondi Indicizzati
3. Fondi a Gestione Attiva
4. Fondo Azionario Aziendale
5. Fondo a Valore Stabile

## Come Gestire
1. Accedi al tuo conto su [portale pensionistico]
2. Rivedi le allocazioni attuali
3. Modifica la percentuale di contribuzione
4. Ribilancia il portafoglio se necessario
5. Monitora regolarmente le performance

## Best Practices
- Contribuisci almeno al 6% per ottenere il contributo aziendale completo
- Diversifica tra diverse classi di attività
- Rivedi e ribilancia annualmente
- Considera i fondi con data obiettivo per semplicità
- Aumenta i contributi con gli aumenti di stipendio`
        }
      }
    }
  };
  
  export default translations;