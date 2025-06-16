// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate
// TODOS:
// SUGGESTIONS:

export enum PageNames {
  ADMIN_DASHBOARD = 'Admin Dashboard',
  NETWORKING = 'Strategic Outreach Engine',
  MEMORY_MANAGER = 'Memory Manager',
  WHATSAPP = 'WhatsApp Chat Analysis',
  DRAFT_COMM = 'Draft Communication',
  AGENTIC = 'Agentic Workflow',
  INSIGHTS = 'Insights & Patterns',
  JOURNAL = 'Journal & Reflection',
  HABITICA = 'Habitica Integration',
  LOCAL_FILES = 'Local File Indexer',
  NOTION_INTEGRATION = 'Notion Integration',
  OPPORTUNITY_PIPELINE = 'Opportunity Pipeline',
  ROUTINES = 'Routines & Habits',
  SYSTEM_SETTINGS = 'System Settings',
  IDEA_INCUBATOR = 'Idea Incubator',
  NARRATIVE_CLARITY = 'Narrative Clarity Studio',
  EMAIL = 'Email Management',
  CV_TAILORING = 'CV Tailoring',
  AUTH = 'Authentication',
  ERROR = 'Error',
  LOADING = 'Loading',
}

export enum SessionStateKeys {
  MEMORY_INITIALIZED = 'memoryInitialized',
  ROUTINES_MORNING_COMPLETED = 'routinesMorningCompleted',
  ROUTINES_EVENING_COMPLETED = 'routinesEveningCompleted',
  AUTH_STATUS = 'authStatus',
  USER_PROFILE_LOADED = 'userProfileLoaded',
  ATM_PASTED_TEXT = 'atmPastedText',
  WHATSAPP_CHAT_FILE = 'whatsAppChatFile',
  WHATSAPP_CHAT_ANALYSIS = 'whatsAppChatAnalysis',
  DRAFT_COMMUNICATION_TYPE = 'draftCommunicationType',
  HABITICA_USER_ID = 'habiticaUserId',
  HABITICA_API_TOKEN = 'habiticaApiToken',
  ROUTINES_LAST_RUN = 'routinesLastRun',
  ROUTINES_EXECUTION_STATUS = 'routinesExecutionStatus',
  ASK_Q_INPUT = 'askQInput',
  ASK_Q_ANSWER = 'askQAnswer',
  ASK_Q_PROCESSING = 'askQProcessing',
}
