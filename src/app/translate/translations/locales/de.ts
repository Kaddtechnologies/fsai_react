const translations = {
    // Settings dialog
    settings: {
      title: "Einstellungen",
      description: "Passen Sie Ihr FlowserveAI-Erlebnis an. Änderungen werden sofort übernommen.",
      language: "Sprache",
      save: "Änderungen speichern"
    },
    
    // Empty state
    emptyState: {
      welcome: "Willkommen bei FlowserveAI",
      subtitle: "Verbinden Sie sich sicher und chatten Sie mit Ihren Dokumenten, Wissensdatenbank und KI im Flowserve-Netzwerk",
      startTyping: "Beginnen Sie eine Unterhaltung, indem Sie unten tippen",
      suggestions: {
        aiChat: {
          category: "KI-Chat",
          text: "Wie funktionieren Kreiselpumpen?"
        },
        documents: {
          category: "Dokumente",
          text: "Fassen Sie meine Wartungsdokumente zusammen"
        },
        products: {
          category: "Produkte",
          text: "Suche nach Durchflussregelventilen"
        }
      }
    },
    
    // Welcome dialog
    welcomeDialog: {
      title: "Willkommen bei Flowserve AI",
      subtitle: "Ihre einheitliche Plattform für intelligente Unterstützung, Dokumentenanalyse und Produktwissen.",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "Ihr digitaler Assistent",
        description: "Führen Sie natürliche Gespräche, um Antworten zu erhalten, komplexe Themen zu verstehen und Unterstützung bei verschiedenen Aufgaben im Zusammenhang mit Flowserve-Angeboten zu erhalten.",
        capabilities: {
          root: "Was kann Flowserve AI für Sie tun?",
          answer: "Fragen beantworten",
          explain: "Erklärungen liefern",
          assist: "Bei Aufgaben unterstützen"
        }
      },
      // Document section
      documents: {
        title: "Dokumentenanalyse",
        subtitle: "Chatten Sie mit Ihren Dokumenten",
        maxFileSize: "Maximale Dateigröße 5MB",
        onlyPDF: "Nur PDF-Dateien",
        vectorSearch: "Vektorbasierte semantische Suche",
        description: "Laden Sie Ihre Dokumente (PDFs) hoch und interagieren Sie direkt im Chat mit ihnen. Stellen Sie spezifische Fragen zu deren Inhalt, erhalten Sie Zusammenfassungen und extrahieren Sie Informationen mit unserer semantischen Suchtechnologie.",
        flow: {
          upload: {
            title: "Dokument hochladen",
            description: "Laden Sie Ihre PDF-Dateien sicher hoch."
          },
          conversation: {
            title: "Unterhaltung beginnen",
            description: "Stellen Sie Fragen zu Ihrem Dokument."
          },
          insights: {
            title: "Erkenntnisse gewinnen",
            description: "Erhalten Sie Zusammenfassungen und Schlüsselinformationen."
          }
        }
      },
      // Translation section
      translation: {
        title: "Übersetzung",
        subtitle: "Mehrsprachige Unterstützung",
        description: "Übersetzen Sie Text und Dokumente zwischen verschiedenen Sprachen. Verwenden Sie das spezielle Tool \"Übersetzen\" in der Seitenleiste.",
        supportedLanguages: "Unterstützte Sprachen für Text:",
        supportedDocTypes: "Unterstützte Dokumenttypen für das Übersetzungsmodul (zukünftig):",
        videoTutorial: "Video-Tutorial (Platzhalter)",
        videoComingSoon: "Video-Tutorial kommt bald.",
        flow: {
          upload: {
            title: "Hochladen",
            description: "Word-, PowerPoint-, Excel-, PDF-Dateien."
          },
          selectLanguage: {
            title: "Sprache auswählen",
            description: "Wählen Sie Ihre Zielsprache."
          },
          receiveTranslation: {
            title: "Übersetzung erhalten",
            description: "Erhalten Sie Ihren übersetzten Inhalt."
          },
          provideFeedback: {
            title: "Feedback geben",
            description: "Helfen Sie, zukünftige Übersetzungen zu verbessern."
          }
        }
      }
    },
    
    // Chat-related
    chat: {
      newChat: "Neuer Chat",
      placeholder: "Nachricht eingeben...",
      send: "Senden",
      typing: "Flowserve AI schreibt...",
      loadMore: "Mehr Nachrichten laden",
      emptyConversation: "Neue Unterhaltung beginnen",
      uploadFile: "Datei hochladen",
      today: "Heute",
      yesterday: "Gestern",
      deleteMessage: "Diese Nachricht löschen",
      editMessage: "Diese Nachricht bearbeiten",
      copyToClipboard: "In die Zwischenablage kopieren",
      copied: "In die Zwischenablage kopiert",
      loading: "Wird geladen...",
      errorLoading: "Fehler beim Laden der Unterhaltung",
      messageSent: "Nachricht gesendet",
      documentUploadSuccess: "Dokument erfolgreich hochgeladen",
      documentUploadError: "Fehler beim Hochladen des Dokuments",
      documentProcessing: "Dokument wird verarbeitet...",
      documentReady: "Dokument bereit"
    },
    
    // Quick Actions
    quickActions: {
      title: "Schnellaktionen",
      questions: {
        espp: {
          question: "Was ist der Mitarbeiteraktienkaufplan (ESPP)?",
          answer: `# Mitarbeiteraktienkaufplan (ESPP)

## Übersicht
Der ESPP ermöglicht berechtigten Mitarbeitern den Kauf von Flowserve-Aktien mit Rabatt durch Gehaltsabzüge.

## Hauptmerkmale
- Aktienkauf mit 15% Rabatt
- Automatische Gehaltsabzüge
- Vierteljährliche Kaufperioden
- Keine Maklergebühren
- Sofortige Übertragung

## Berechtigung
- Regelmäßige Vollzeitmitarbeiter
- Mindestens 90 Tage Beschäftigung
- Nicht im Urlaub

## Teilnahme
1. Anmeldung während der offenen Anmeldezeit
2. Auswahl des Beitragsprozentsatzes (1-10% des berechtigten Entgelts)
3. Mittel werden von jeder Gehaltszahlung abgezogen
4. Aktien werden vierteljährlich mit 15% Rabatt gekauft

## Steuerliche Überlegungen
- Käufe werden mit nachsteuerlichen Dollar getätigt
- Gewinne werden als gewöhnliches Einkommen oder Kapitalgewinne besteuert
- Konsultieren Sie einen Steuerberater für spezifische Beratung`
        },
        retirement: {
          question: "Wie verwalte ich meine 401(k)-Investitionen?",
          answer: `# Verwaltung Ihrer 401(k)-Investitionen

## Übersicht
Der Flowserve 401(k)-Plan bietet eine Reihe von Anlagemöglichkeiten, um Ihnen beim Sparen für den Ruhestand zu helfen.

## Hauptmerkmale
- Unternehmensbeitrag bis zu 6% des berechtigten Entgelts
- Sofortige Übertragung des Unternehmensbeitrags
- Breite Palette von Anlagemöglichkeiten
- Professionelles Anlagemanagement
- Online-Kontozugang

## Anlagemöglichkeiten
1. Zielterminfonds
2. Indexfonds
3. Aktiv verwaltete Fonds
4. Unternehmensaktienfonds
5. Stabilitätsfonds

## Verwaltung
1. Melden Sie sich bei Ihrem Konto auf [Ruhestandsportal] an
2. Überprüfen Sie die aktuellen Zuweisungen
3. Passen Sie den Beitragsprozentsatz an
4. Rebalancieren Sie das Portfolio nach Bedarf
5. Überwachen Sie die Performance regelmäßig

## Best Practices
- Beitragen Sie mindestens 6%, um den vollen Unternehmensbeitrag zu erhalten
- Diversifizieren Sie über verschiedene Anlageklassen
- Überprüfen und rebalancieren Sie jährlich
- Erwägen Sie Zielterminfonds für Einfachheit
- Erhöhen Sie Beiträge mit Gehaltserhöhungen`
        }
      }
    }
  };
  
  export default translations;