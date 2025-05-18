const translations = {
  // Settings dialog
  settings: {
    title: "Configuración",
    description: "Personaliza tu experiencia de FlowserveAI. Los cambios se aplicarán inmediatamente.",
    language: "Idioma",
    save: "Guardar cambios"
  },
  
  // Empty state
  emptyState: {
    welcome: "Bienvenido a FlowserveAI",
    subtitle: "Conéctate de forma segura y chatea con tus Documentos, Base de Conocimiento e IA en la Red de Flowserve",
    startTyping: "Comienza una conversación escribiendo abajo",
    suggestions: {
      aiChat: {
        category: "Chat IA",
        text: "¿Cómo funcionan las bombas centrífugas?"
      },
      documents: {
        category: "Documentos",
        text: "Resumir mis documentos de mantenimiento"
      },
      products: {
        category: "Productos",
        text: "Buscar válvulas de control de flujo"
      }
    }
  },
  
  // Welcome dialog
  welcomeDialog: {
    title: "Bienvenido a Flowserve AI",
    subtitle: "Tu plataforma unificada para asistencia inteligente, análisis de documentos y conocimiento de productos.",
    // AI section
    ai: {
      title: "Flowserve AI",
      subtitle: "Tu Asistente Digital",
      description: "Participa en conversaciones naturales para obtener respuestas, comprender temas complejos y recibir asistencia con varias tareas relacionadas con las ofertas de Flowserve.",
      capabilities: {
        root: "¿Qué puede hacer Flowserve AI por ti?",
        answer: "Responder preguntas",
        explain: "Proporcionar explicaciones",
        assist: "Ayudar con tareas"
      }
    },
    // Document section
    documents: {
      title: "Análisis de Documentos",
      subtitle: "Chatea con tus Documentos",
      maxFileSize: "Tamaño máximo de archivo 5MB",
      onlyPDF: "Solo archivos PDF",
      vectorSearch: "Búsqueda semántica basada en vectores",
      description: "Sube tus documentos (PDFs) e interactúa con ellos directamente en el chat. Haz preguntas específicas sobre su contenido, obtén resúmenes y extrae información con nuestra tecnología de búsqueda semántica.",
      flow: {
        upload: {
          title: "Subir Documento",
          description: "Sube tus archivos PDF de forma segura."
        },
        conversation: {
          title: "Iniciar Conversación",
          description: "Haz preguntas sobre tu documento."
        },
        insights: {
          title: "Extraer Información",
          description: "Obtén resúmenes e información clave."
        }
      }
    },
    // Translation section
    translation: {
      title: "Traducción",
      subtitle: "Soporte Multilingüe",
      description: "Traduce texto y documentos entre varios idiomas. Utiliza la herramienta dedicada \"Traducir\" en la barra lateral.",
      supportedLanguages: "Idiomas admitidos para texto:",
      supportedDocTypes: "Tipos de documentos compatibles para el módulo de traducción (Futuro):",
      videoTutorial: "Tutorial en Video (Provisional)",
      videoComingSoon: "Tutorial en video próximamente.",
      flow: {
        upload: {
          title: "Subir",
          description: "Archivos Word, PowerPoint, Excel, PDF."
        },
        selectLanguage: {
          title: "Seleccionar Idioma",
          description: "Elige tu idioma de destino."
        },
        receiveTranslation: {
          title: "Recibir Traducción",
          description: "Obtén tu contenido traducido."
        },
        provideFeedback: {
          title: "Proporcionar Comentarios",
          description: "Ayuda a mejorar futuras traducciones."
        }
      }
    }
  },
  
  // Chat-related
  chat: {
    newChat: "Nuevo Chat",
    placeholder: "Escribe un mensaje...",
    send: "Enviar",
    typing: "Flowserve AI está escribiendo...",
    loadMore: "Cargar más mensajes",
    emptyConversation: "Inicia una nueva conversación",
    uploadFile: "Subir un archivo",
    today: "Hoy",
    yesterday: "Ayer",
    deleteMessage: "Eliminar este mensaje",
    editMessage: "Editar este mensaje",
    copyToClipboard: "Copiar al portapapeles",
    copied: "Copiado al portapapeles",
    loading: "Cargando...",
    errorLoading: "Error al cargar la conversación",
    messageSent: "Mensaje enviado",
    documentUploadSuccess: "Documento subido con éxito",
    documentUploadError: "Error al subir el documento",
    documentProcessing: "Procesando documento...",
    documentReady: "Documento listo"
  },
  
  // Quick Actions
  quickActions: {
    title: "Acciones Rápidas",
    questions: {
      espp: {
        question: "¿Qué es el Plan de Compra de Acciones para Empleados (ESPP)?",
        answer: `# Plan de Compra de Acciones para Empleados (ESPP)

## Descripción General
El ESPP permite a los empleados elegibles comprar acciones de Flowserve con descuento a través de deducciones de nómina.

## Características Principales
- Compra de acciones con 15% de descuento
- Deducciones automáticas de nómina
- Períodos de compra trimestrales
- Sin comisiones de corretaje
- Adquisición inmediata

## Elegibilidad
- Empleados regulares de tiempo completo
- Mínimo 90 días de empleo
- No estar en licencia

## Cómo Participar
1. Inscribirse durante el período de inscripción abierta
2. Seleccionar porcentaje de contribución (1-10% de la compensación elegible)
3. Los fondos se deducen de cada cheque de pago
4. Las acciones se compran trimestralmente con 15% de descuento

## Consideraciones Fiscales
- Las compras se realizan con dólares después de impuestos
- Las ganancias se gravan como ingreso ordinario o ganancias de capital
- Consulte a un asesor fiscal para orientación específica`
      },
      retirement: {
        question: "¿Cómo gestiono mis inversiones en 401(k)?",
        answer: `# Gestión de Inversiones en 401(k)

## Descripción General
El plan 401(k) de Flowserve ofrece una variedad de opciones de inversión para ayudarte a ahorrar para la jubilación.

## Características Principales
- Contribución de la empresa hasta 6% de la compensación elegible
- Adquisición inmediata de la contribución de la empresa
- Amplia gama de opciones de inversión
- Gestión profesional de inversiones
- Acceso a cuenta en línea

## Opciones de Inversión
1. Fondos de Fecha Objetivo
2. Fondos Índice
3. Fondos de Gestión Activa
4. Fondo de Acciones de la Empresa
5. Fondo de Valor Estable

## Cómo Gestionar
1. Inicie sesión en su cuenta en [portal de jubilación]
2. Revise las asignaciones actuales
3. Ajuste el porcentaje de contribución
4. Reequilibre la cartera según sea necesario
5. Monitoree el rendimiento regularmente

## Mejores Prácticas
- Contribuya al menos 6% para obtener la contribución completa de la empresa
- Diversifique entre diferentes clases de activos
- Revise y reequilibre anualmente
- Considere fondos de fecha objetivo para simplicidad
- Aumente las contribuciones con aumentos salariales`
      }
    }
  }
};

export default translations;