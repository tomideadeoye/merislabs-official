import type { PipelineState, EnabledSteps } from '@/types/orion';

export enum SessionStateKeys {
  SESSION_STATE_INITIALIZED = "session_state_initialized",
  CREWAI_AVAILABLE = "crewai_available",
  VOICE_PREFERENCE = "voice_preference",
  MEMORY_INITIALIZED = "memory_initialized",
  LLM_CONFIGURED = "llm_configured",
  CURRENT_MOOD = "current_mood",
  USER_NAME = "user_name",
  TOMIDES_PROFILE_DATA = "tomides_profile_data",
  MOOD_NOTE = "mood_note",

  PIPELINE_STATE = "pipeline_state",
  PIPELINE_STEP = "pipeline_step",
  MODEL_APPROACH_PIPELINE = "model_approach_pipeline",
  ENABLED_STEPS_PIPELINE = "enabled_steps_pipeline",

  STAKEHOLDERS_LIST_NET = "stakeholders_list_net",
  PROCESSED_STAKEHOLDERS_NET = "processed_stakeholders_net",
  NETWORKING_QUERY = "networking_query",
  NETWORKING_ROLES = "networking_roles",
  NETWORKING_MODEL_APPROACH = "networking_model_approach",
  NETWORKING_PRIMARY_MODEL = "networking_primary_model",

  ASK_Q_INPUT = "ask_q_input",
  ASK_Q_ANSWER = "ask_q_answer",
  ASK_Q_PROCESSING = "ask_q_processing",
  ASK_Q_MODEL_APPROACH = "ask_q_model_approach",
  ASK_Q_PRIMARY_MODEL = "ask_q_primary_model",

  DC_COMM_TYPE = "dc_comm_type",
  DC_CONTEXT_OR_TEMPLATE = "dc_context_or_template",
  DC_TOPIC = "dc_topic",
  DC_RECIPIENTS = "dc_recipients",
  DC_CONTEXT = "dc_context",
  DC_USER_CONTEXT = "dc_user_context",
  DC_NUM_OPTIONS = "dc_num_options",
  DC_DRAFT = "dc_draft",
  DC_DRAFT_OR_OPTIONS = "dc_draft_or_options",
  DC_GENERATING = "dc_generating",
  DC_MODEL_APPROACH = "dc_model_approach",
  DC_PRIMARY_MODEL = "dc_primary_model",
  DC_SAVE_TAGS_INPUT = "dc_save_tags_input",

  JOURNAL_TEXT = "journal_text",
  JOURNAL_PROCESSING = "journal_processing",
  JOURNAL_REFLECTION = "journal_reflection",
  JOURNAL_SHOW_SAVE_FORM = "journal_show_save_form",
  JOURNAL_MODEL_APPROACH = "journal_model_approach",
  JOURNAL_PRIMARY_MODEL = "journal_primary_model",

  HABITICA_USER_ID = "habitica_user_id",
  HABITICA_API_TOKEN = "habitica_api_token",

  ATM_PASTED_TEXT = "atm_pasted_text",
  ATM_SOURCE_ID = "atm_source_id",
  ATM_TAGS_INPUT = "atm_tags_input",
  ATM_SEARCH_QUERY = "atm_search_query",
  ATM_NUM_RESULTS = "atm_num_results",

  MM_CRUD_MODEL = "mm_crud_model",
  MM_RAW_INPUT = "mm_raw_input",
  MM_OP_RADIO = "mm_op_radio",
  MM_BROWSE_MODEL = "mm_browse_model",

  ROUTINES_EXECUTION_STATUS = "routines_execution_status",
  ROUTINES_LAST_RUN = "routines_last_run",
  ROUTINES_SCRAPED_LINKS = "routines_scraped_links",

  SI_FEEDBACK_TYPE = "si_feedback_type",
  SI_FEATURE_INPUT = "si_feature_input",
  SI_DESCRIPTION_INPUT = "si_description_input",
  SI_IMPROVEMENT_SUGGESTIONS = "si_improvement_suggestions",

  AGW_GOAL_INPUT = "agw_goal_input",
  AGW_APPROACH_RADIO = "agw_approach_radio",
  AGW_PRIMARY_MODEL = "agw_primary_model",
  AGW_OUTPUT_TEXT = "agw_output_text",

  WH_TEMPLATE_INPUT = "wh_template_input",
  WH_GENERATED_RESPONSE = "wh_generated_response",
}

export const PageNames = {
  HOME: "🏠 Home",
  WHATSAPP: "📱 WhatsApp Helper",
  NETWORKING: "🤝 Networking Outreach",
  DRAFT_COMM: "✍️ Draft Communication",
  ASK: "❓ Ask Question",
  JOURNAL: "📓 Journal Entry",
  PIPELINE: "💼 Opportunity Pipeline",
  HABITICA: "🚀 Habitica Guide",
  MEMORY: "📚 Add to Memory",
  MEMORY_MANAGER: "🗄️ Memory Manager",
  SYSTEM: "⚙️ System Settings",
  AGENTIC: "🤖 Agentic Workflow",
  ROUTINES: "🔄 Routines",
  ADMIN_DASHBOARD: "👑 Admin Dashboard"
} as const;

export type PageNameValue = typeof PageNames[keyof typeof PageNames];

export interface PipelineState {
  current_opportunity: any | null;
  evaluation_result: any | null;
  stakeholders: any | null;
  application_answers: Record<string, any>;
  communications: Record<string, any>;
  customization_suggestions: any | null;
  web_context: any | null;
}

export interface EnabledSteps {
  web_research: boolean;
  evaluation: boolean;
  networking: boolean;
}

export interface OrionSessionState {
  [SessionStateKeys.SESSION_STATE_INITIALIZED]: boolean;
  [SessionStateKeys.CREWAI_AVAILABLE]: boolean;
  [SessionStateKeys.VOICE_PREFERENCE]?: string;
  [SessionStateKeys.MEMORY_INITIALIZED]: boolean;
  [SessionStateKeys.LLM_CONFIGURED]?: boolean;
  [SessionStateKeys.TOMIDES_PROFILE_DATA]: string | null;
  [SessionStateKeys.USER_NAME]: string;
  [SessionStateKeys.CURRENT_MOOD]?: string;
  [SessionStateKeys.MOOD_NOTE]?: string;

  [SessionStateKeys.PIPELINE_STATE]?: PipelineState;
  [SessionStateKeys.PIPELINE_STEP]?: string;
  [SessionStateKeys.MODEL_APPROACH_PIPELINE]?: string;
  [SessionStateKeys.ENABLED_STEPS_PIPELINE]?: EnabledSteps;

  [SessionStateKeys.STAKEHOLDERS_LIST_NET]?: any[];
  [SessionStateKeys.PROCESSED_STAKEHOLDERS_NET]?: Record<string, any>;
  [SessionStateKeys.NETWORKING_QUERY]?: string;
  [SessionStateKeys.NETWORKING_ROLES]?: string[];
  [SessionStateKeys.NETWORKING_MODEL_APPROACH]?: string;
  [SessionStateKeys.NETWORKING_PRIMARY_MODEL]?: string;

  [SessionStateKeys.ASK_Q_INPUT]?: string;
  [SessionStateKeys.ASK_Q_ANSWER]?: string;
  [SessionStateKeys.ASK_Q_PROCESSING]?: boolean;
  [SessionStateKeys.ASK_Q_MODEL_APPROACH]?: string;
  [SessionStateKeys.ASK_Q_PRIMARY_MODEL]?: string;

  [SessionStateKeys.DC_COMM_TYPE]?: string;
  [SessionStateKeys.DC_CONTEXT_OR_TEMPLATE]?: string;
  [SessionStateKeys.DC_TOPIC]?: string;
  [SessionStateKeys.DC_RECIPIENTS]?: string;
  [SessionStateKeys.DC_CONTEXT]?: string;
  [SessionStateKeys.DC_USER_CONTEXT]?: string;
  [SessionStateKeys.DC_NUM_OPTIONS]?: number;
  [SessionStateKeys.DC_DRAFT]?: string;
  [SessionStateKeys.DC_DRAFT_OR_OPTIONS]?: string;
  [SessionStateKeys.DC_GENERATING]?: boolean;
  [SessionStateKeys.DC_MODEL_APPROACH]?: string;
  [SessionStateKeys.DC_PRIMARY_MODEL]?: string;
  [SessionStateKeys.DC_SAVE_TAGS_INPUT]?: string;

  [SessionStateKeys.JOURNAL_TEXT]?: string;
  [SessionStateKeys.JOURNAL_PROCESSING]?: boolean;
  [SessionStateKeys.JOURNAL_REFLECTION]?: any | null;
  [SessionStateKeys.JOURNAL_SHOW_SAVE_FORM]?: boolean;
  [SessionStateKeys.JOURNAL_MODEL_APPROACH]?: string;
  [SessionStateKeys.JOURNAL_PRIMARY_MODEL]?: string;

  [SessionStateKeys.HABITICA_USER_ID]?: string;
  [SessionStateKeys.HABITICA_API_TOKEN]?: string;

  [SessionStateKeys.ATM_PASTED_TEXT]?: string;
  [SessionStateKeys.ATM_SOURCE_ID]?: string;
  [SessionStateKeys.ATM_TAGS_INPUT]?: string;
  [SessionStateKeys.ATM_SEARCH_QUERY]?: string;
  [SessionStateKeys.ATM_NUM_RESULTS]?: number;

  [SessionStateKeys.MM_CRUD_MODEL]?: string;
  [SessionStateKeys.MM_RAW_INPUT]?: string;
  [SessionStateKeys.MM_OP_RADIO]?: string;
  [SessionStateKeys.MM_BROWSE_MODEL]?: string;

  [SessionStateKeys.ROUTINES_EXECUTION_STATUS]?: string;
  [SessionStateKeys.ROUTINES_LAST_RUN]?: string | null;
  [SessionStateKeys.ROUTINES_SCRAPED_LINKS]?: string[];

  [SessionStateKeys.SI_FEEDBACK_TYPE]?: string;
  [SessionStateKeys.SI_FEATURE_INPUT]?: string;
  [SessionStateKeys.SI_DESCRIPTION_INPUT]?: string;
  [SessionStateKeys.SI_IMPROVEMENT_SUGGESTIONS]?: any | null;

  [SessionStateKeys.AGW_GOAL_INPUT]?: string;
  [SessionStateKeys.AGW_APPROACH_RADIO]?: string;
  [SessionStateKeys.AGW_PRIMARY_MODEL]?: string;
  [SessionStateKeys.AGW_OUTPUT_TEXT]?: string;

  [SessionStateKeys.WH_TEMPLATE_INPUT]?: string;
  [SessionStateKeys.WH_GENERATED_RESPONSE]?: string;
}

const initKeyGlobal = <K extends SessionStateKeys>(key: K, defaultValue: OrionSessionState[K]): void => {
  if (typeof window !== 'undefined' && window.localStorage.getItem(key) === null) {
    window.localStorage.setItem(key, JSON.stringify(defaultValue));
  }
};

export const initializeGlobalSessionState = (): void => {
  if (typeof window === 'undefined') return;

  Object.values(SessionStateKeys).forEach(key => {
    const K = key as SessionStateKeys;
    const defaultValue = getDefaultSessionValue(K);
    if (defaultValue !== undefined) {
      initKeyGlobal(K, defaultValue);
    } else if (window.localStorage.getItem(K) === null && (K === SessionStateKeys.CURRENT_MOOD || K === SessionStateKeys.MOOD_NOTE)) {
      initKeyGlobal(K, undefined as OrionSessionState[K]);
    }
  });
  initKeyGlobal(SessionStateKeys.SESSION_STATE_INITIALIZED, true);
};

export const initializeClientSession = (): void => {
  if (typeof window !== 'undefined') {
    initializeGlobalSessionState();
  }
};

export const getDefaultSessionState = (): Partial<OrionSessionState> => ({
  [SessionStateKeys.SESSION_STATE_INITIALIZED]: false,
  [SessionStateKeys.MEMORY_INITIALIZED]: false,
  [SessionStateKeys.LLM_CONFIGURED]: true,
  [SessionStateKeys.TOMIDES_PROFILE_DATA]: null,
  [SessionStateKeys.USER_NAME]: "Architect",
  [SessionStateKeys.CREWAI_AVAILABLE]: false,
  [SessionStateKeys.PIPELINE_STATE]: {
    current_opportunity: null,
    evaluation_result: null,
    stakeholders: null,
    application_answers: {},
    communications: {},
    customization_suggestions: null,
    web_context: null,
  },
  [SessionStateKeys.PIPELINE_STEP]: "input",
  [SessionStateKeys.ASK_Q_INPUT]: "",
  [SessionStateKeys.ASK_Q_ANSWER]: "",
  [SessionStateKeys.ASK_Q_PROCESSING]: false,
  [SessionStateKeys.DC_COMM_TYPE]: "Email",
  [SessionStateKeys.DC_TOPIC]: "",
  [SessionStateKeys.ATM_NUM_RESULTS]: 5,
});

export const getDefaultSessionValue = <K extends SessionStateKeys>(key: K): OrionSessionState[K] | undefined => {
  const defaults = getDefaultSessionState();
  return defaults[key];
};

export class SessionStateManager {
  private static instance: SessionStateManager;
  private initialized: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      const storedInitFlag = window.localStorage.getItem(SessionStateKeys.SESSION_STATE_INITIALIZED);
      if (storedInitFlag === 'true') {
        this.initialized = true;
      }
    }
  }

  public static getInstance(): SessionStateManager {
    if (!SessionStateManager.instance) {
      SessionStateManager.instance = new SessionStateManager();
    }
    return SessionStateManager.instance;
  }

  private initKey<T>(key: SessionStateKeys, defaultValue: T): void {
    if (typeof window !== 'undefined') {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
    }
  }

  public initializeClientSession(): void {
    if (typeof window === 'undefined' || this.initialized) {
      return;
    }
    const defaults = getDefaultSessionState();
    for (const keyAsString in defaults) {
      const key = keyAsString as SessionStateKeys;
      const defaultValue = defaults[key];
      this.initKey(key, defaultValue);
    }
    this.initKey(SessionStateKeys.SESSION_STATE_INITIALIZED, true);
    this.initialized = true;
  }

  public getState<K extends SessionStateKeys>(key: K, explicitDefaultValue?: OrionSessionState[K]): OrionSessionState[K] {
    if (typeof window === 'undefined') {
      const serverDefault = explicitDefaultValue !== undefined ? explicitDefaultValue : getDefaultSessionValue(key);
      return serverDefault as OrionSessionState[K];
    }
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      const defaultValue = explicitDefaultValue !== undefined ? explicitDefaultValue : getDefaultSessionValue(key);
      if (defaultValue !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
      return defaultValue as OrionSessionState[K];
    }
    try {
      return JSON.parse(storedValue) as OrionSessionState[K];
    } catch {
      const defaultValue = explicitDefaultValue !== undefined ? explicitDefaultValue : getDefaultSessionValue(key);
      if (defaultValue !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
      }
      return defaultValue as OrionSessionState[K];
    }
  }

  public setState<K extends SessionStateKeys>(key: K, value: OrionSessionState[K]): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to save state for key '${key}' to localStorage:`, error);
    }
  }
}

export const sessionStore = SessionStateManager.getInstance();
