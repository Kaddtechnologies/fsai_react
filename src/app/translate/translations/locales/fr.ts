const translations = {
    // Settings dialog
    settings: {
      title: "Paramètres",
      description: "Personnalisez votre expérience FlowserveAI. Les modifications s'appliqueront immédiatement.",
      language: "Langue",
      save: "Enregistrer les modifications"
    },
    
    // Empty state
    emptyState: {
      welcome: "Bienvenue sur FlowserveAI",
      subtitle: "Connectez-vous et discutez en toute sécurité avec vos documents, votre base de connaissances et l'IA sur le réseau Flowserve",
      startTyping: "Commencez une conversation en écrivant ci-dessous",
      suggestions: {
        aiChat: {
          category: "Discussion IA",
          text: "Comment fonctionnent les pompes centrifuges ?"
        },
        documents: {
          category: "Documents",
          text: "Résumez mes documents de maintenance"
        },
        products: {
          category: "Produits",
          text: "Rechercher des vannes de régulation de débit"
        }
      }
    },
    
    // Welcome dialog
    welcomeDialog: {
      title: "Bienvenue sur Flowserve AI",
      subtitle: "Votre plateforme unifiée pour l'assistance intelligente, l'analyse de documents et la connaissance des produits.",
      // AI section
      ai: {
        title: "Flowserve AI",
        subtitle: "Votre Assistant Numérique",
        description: "Engagez des conversations naturelles pour obtenir des réponses, comprendre des sujets complexes et recevoir de l'aide pour diverses tâches liées aux offres de Flowserve.",
        capabilities: {
          root: "Que peut faire Flowserve AI pour vous ?",
          answer: "Répondre aux questions",
          explain: "Fournir des explications",
          assist: "Aider avec les tâches"
        }
      },
      // Document section
      documents: {
        title: "Analyse de Documents",
        subtitle: "Discutez avec vos Documents",
        maxFileSize: "Taille maximale de fichier 5Mo",
        onlyPDF: "Uniquement des fichiers PDF",
        vectorSearch: "Recherche sémantique basée sur des vecteurs",
        description: "Téléchargez vos documents (PDF) et interagissez avec eux directement dans la discussion. Posez des questions spécifiques sur leur contenu, obtenez des résumés et extrayez des informations grâce à notre technologie de recherche sémantique.",
        flow: {
          upload: {
            title: "Télécharger un Document",
            description: "Téléchargez vos fichiers PDF en toute sécurité."
          },
          conversation: {
            title: "Démarrer une Conversation",
            description: "Posez des questions sur votre document."
          },
          insights: {
            title: "Extraire des Informations",
            description: "Obtenez des résumés et des informations clés."
          }
        }
      },
      // Translation section
      translation: {
        title: "Traduction",
        subtitle: "Support Multilingue",
        description: "Traduisez du texte et des documents entre différentes langues. Utilisez l'outil dédié \"Traduire\" dans la barre latérale.",
        supportedLanguages: "Langues prises en charge pour le texte :",
        supportedDocTypes: "Types de documents pris en charge pour le module de traduction (à venir) :",
        videoTutorial: "Tutoriel Vidéo (Placeholder)",
        videoComingSoon: "Tutoriel vidéo à venir.",
        flow: {
          upload: {
            title: "Télécharger",
            description: "Fichiers Word, PowerPoint, Excel, PDF."
          },
          selectLanguage: {
            title: "Sélectionner la Langue",
            description: "Choisissez votre langue cible."
          },
          receiveTranslation: {
            title: "Recevoir la Traduction",
            description: "Obtenez votre contenu traduit."
          },
          provideFeedback: {
            title: "Fournir des Commentaires",
            description: "Aidez à améliorer les futures traductions."
          }
        }
      }
    },
    
    // Chat-related
    chat: {
      newChat: "Nouvelle Discussion",
      placeholder: "Écrivez un message...",
      send: "Envoyer",
      typing: "Flowserve AI est en train d'écrire...",
      loadMore: "Charger plus de messages",
      emptyConversation: "Démarrer une nouvelle conversation",
      uploadFile: "Télécharger un fichier",
      today: "Aujourd'hui",
      yesterday: "Hier",
      deleteMessage: "Supprimer ce message",
      editMessage: "Modifier ce message",
      copyToClipboard: "Copier dans le presse-papiers",
      copied: "Copié dans le presse-papiers",
      loading: "Chargement...",
      errorLoading: "Erreur lors du chargement de la conversation",
      messageSent: "Message envoyé",
      documentUploadSuccess: "Document téléchargé avec succès",
      documentUploadError: "Erreur lors du téléchargement du document",
      documentProcessing: "Traitement du document...",
      documentReady: "Document prêt"
    },
    
    // Quick Actions
    quickActions: {
      title: "Actions Rapides",
      questions: {
        espp: {
          question: "Qu'est-ce que le Plan d'Achat d'Actions Salariales (ESPP) ?",
          answer: `# Plan d'Achat d'Actions Salariales (ESPP)

## Aperçu
L'ESPP permet aux employés éligibles d'acheter des actions Flowserve à prix réduit par prélèvement sur salaire.

## Caractéristiques Principales
- Achat d'actions avec 15% de réduction
- Prélèvements automatiques sur salaire
- Périodes d'achat trimestrielles
- Pas de frais de courtage
- Acquisition immédiate

## Éligibilité
- Employés réguliers à temps plein
- Minimum 90 jours d'emploi
- Pas en congé

## Comment Participer
1. S'inscrire pendant la période d'inscription ouverte
2. Sélectionner le pourcentage de contribution (1-10% de la rémunération éligible)
3. Les fonds sont prélevés sur chaque salaire
4. Les actions sont achetées trimestriellement avec 15% de réduction

## Considérations Fiscales
- Les achats sont effectués avec des dollars après impôt
- Les gains sont imposés comme revenu ordinaire ou plus-values
- Consultez un conseiller fiscal pour des conseils spécifiques`
        },
        retirement: {
          question: "Comment gérer mes investissements 401(k) ?",
          answer: `# Gestion des Investissements 401(k)

## Aperçu
Le plan 401(k) de Flowserve propose une gamme d'options d'investissement pour vous aider à épargner pour la retraite.

## Caractéristiques Principales
- Contribution de l'entreprise jusqu'à 6% de la rémunération éligible
- Acquisition immédiate de la contribution de l'entreprise
- Large gamme d'options d'investissement
- Gestion professionnelle des investissements
- Accès au compte en ligne

## Options d'Investissement
1. Fonds à Date Cible
2. Fonds Indiciels
3. Fonds à Gestion Active
4. Fonds d'Actions de l'Entreprise
5. Fonds à Valeur Stable

## Comment Gérer
1. Connectez-vous à votre compte sur [portail de retraite]
2. Examinez les allocations actuelles
3. Ajustez le pourcentage de contribution
4. Rééquilibrez le portefeuille si nécessaire
5. Surveillez régulièrement la performance

## Meilleures Pratiques
- Contribuez au moins 6% pour obtenir la contribution complète de l'entreprise
- Diversifiez entre différentes classes d'actifs
- Examinez et rééquilibrez annuellement
- Envisagez les fonds à date cible pour la simplicité
- Augmentez les contributions avec les augmentations de salaire`
        }
      }
    }
  };
  
  export default translations;