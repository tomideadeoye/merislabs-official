import { SessionStateKeys } from './types/orion';

export const initializeSessionState = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize required session state keys with default values
  initKey(SessionStateKeys.USER_NAME, 'Architect');
  initKey(SessionStateKeys.CURRENT_MOOD, undefined);
  initKey(SessionStateKeys.MEMORY_INITIALIZED, false);
};

const initKey = <T>(key: string, defaultValue: T): void => {
  if (!window.localStorage.getItem(key)) {
    window.localStorage.setItem(key, JSON.stringify(defaultValue));
  }
};

// Page names constants
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

// Import centralized session state keys
import { SessionStateKeys } from './types/orion';

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

// Interfaces for complex state objects
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
    [SessionStateKeys.TOMIDES_PROFILE_DATA]: string | null;
    [SessionStateKeys.USER_NAME]: string;
    [SessionStateKeys.CURRENT_MOOD]?: string;
    [SessionStateKeys.MOOD_NOTE]?: string;

    [SessionStateKeys.PIPELINE_STATE]: PipelineState;
    [SessionStateKeys.PIPELINE_STEP]: string;
    [SessionStateKeys.MODEL_APPROACH_PIPELINE]: string;
    [SessionStateKeys.ENABLED_STEPS_PIPELINE]: EnabledSteps;

    [SessionStateKeys.ASK_Q_INPUT]: string;
    [SessionStateKeys.ASK_Q_ANSWER]: string;
    [SessionStateKeys.ASK_Q_PROCESSING]: boolean;

    [SessionStateKeys.DC_COMM_TYPE]: string;
    [SessionStateKeys.DC_TOPIC]: string;

    // Add other keys as needed with appropriate types
}

export const getDefaultSessionState = (): Partial<OrionSessionState> => ({
    [SessionStateKeys.SESSION_STATE_INITIALIZED]: false,
    [SessionStateKeys.MEMORY_INITIALIZED]: false,
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
    [SessionStateKeys.MODEL_APPROACH_PIPELINE]: "Single Model with Fallbacks",
    [SessionStateKeys.ENABLED_STEPS_PIPELINE]: { web_research: true, evaluation: true, networking: true },
    [SessionStateKeys.ASK_Q_INPUT]: "",
    [SessionStateKeys.ASK_Q_ANSWER]: "",
    [SessionStateKeys.ASK_Q_PROCESSING]: false,
    [SessionStateKeys.DC_COMM_TYPE]: "Email",
    [SessionStateKeys.DC_TOPIC]: "",
    // ... other defaults
});

export class SessionStateManager {
    private static instance: SessionStateManager;
    private state: Record<string, any> = {};
    private initialized = false;

    private constructor() {}

    public static getInstance(): SessionStateManager {
        if (!SessionStateManager.instance) {
            SessionStateManager.instance = new SessionStateManager();
        }
        return SessionStateManager.instance;
    }

    public initializeSessionState(): void {
        if (this.initialized && this.state[SessionStateKeys.SESSION_STATE_INITIALIZED]) {
            return;
        }
        if (typeof window === "undefined") {
            return;
        }

        const storedFlag = localStorage.getItem(SessionStateKeys.SESSION_STATE_INITIALIZED);
        if (storedFlag === "true" && Object.keys(this.state).length > 1) {
            this.initialized = true;
            const defaults = getDefaultSessionState();
            for (const [key, defaultValue] of Object.entries(defaults)) {
                if (!(key in this.state)) {
                    const storedValue = localStorage.getItem(key);
                    if (storedValue !== null) {
                        try {
                            this.state[key] = JSON.parse(storedValue);
                        } catch {
                            this.state[key] = defaultValue;
                        }
                    } else {
                        this.state[key] = defaultValue;
                    }
                }
            }
            this.state[SessionStateKeys.SESSION_STATE_INITIALIZED] = true;
            localStorage.setItem(SessionStateKeys.SESSION_STATE_INITIALIZED, "true");
            return;
        }

        const defaults = getDefaultSessionState();
        for (const [key, defaultValue] of Object.entries(defaults)) {
            const storedValue = localStorage.getItem(key);
            if (storedValue !== null) {
                try {
                    this.state[key] = JSON.parse(storedValue);
                } catch {
                    this.state[key] = defaultValue;
                }
            } else if (!(key in this.state)) {
                this.state[key] = defaultValue;
            } else if (
                typeof defaultValue === "object" &&
                defaultValue !== null &&
                !Array.isArray(defaultValue) &&
                typeof this.state[key] === "object" &&
                this.state[key] !== null &&
                !Array.isArray(this.state[key])
            ) {
                const currentDict = this.state[key];
                let updated = false;
                for (const [subKey, subDefault] of Object.entries(defaultValue as Record<string, any>)) {
                    if (!(subKey in currentDict)) {
                        currentDict[subKey] = subDefault;
                        updated = true;
                    }
                }
                if (updated) {
                    this.state[key] = currentDict;
                    localStorage.setItem(key, JSON.stringify(currentDict));
                }
            }
        }

        this.state[SessionStateKeys.SESSION_STATE_INITIALIZED] = true;
        localStorage.setItem(SessionStateKeys.SESSION_STATE_INITIALIZED, "true");
        this.initialized = true;
    }

    public getState<T = any>(key: SessionStateKeys, defaultValue?: T): T {
        if (typeof window === "undefined") {
            return defaultValue as T;
        }
        if (!this.initialized && key !== SessionStateKeys.SESSION_STATE_INITIALIZED) {
            this.initializeSessionState();
        }
        const value = this.state[key] ?? localStorage.getItem(key) ?? defaultValue;
        if (this.state[key] === undefined && localStorage.getItem(key) !== null) {
            try {
                this.state[key] = JSON.parse(localStorage.getItem(key) as string);
                return this.state[key];
            } catch {
                return value;
            }
        }
        return value;
    }

    public setState<T>(key: SessionStateKeys, value: T): void {
        if (typeof window === "undefined") {
            return;
        }
        this.state[key] = value;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Failed to save state for key '${key}' to localStorage:`, error);
        }
    }

    public getAllState(): Record<string, any> {
        if (typeof window === "undefined") {
            return {};
        }
        Object.values(SessionStateKeys).forEach((key) => {
            if (this.state[key] === undefined) {
                const storedValue = localStorage.getItem(key);
                if (storedValue !== null) {
                    try {
                        this.state[key] = JSON.parse(storedValue);
                    } catch {}
                }
            }
        });
        return { ...this.state };
    }

    public clearState(): void {
        if (typeof window === "undefined") {
            return;
        }
        const keysToClear = Object.values(SessionStateKeys);
        for (const key of keysToClear) {
            delete this.state[key];
            localStorage.removeItem(key);
        }
        this.initialized = false;
    }
}

export const getSessionState = (): SessionStateManager => SessionStateManager.getInstance();

export const initializeSession = (): void => {
    if (typeof window !== "undefined") {
        getSessionState().initializeSessionState();
    }
};

// The implementation is well-structured and follows best practices for client-only localStorage usage.
// Key points:
// - Proper guard for window existence to avoid SSR issues.
// - Lazy initialization with a singleton SessionStateManager.
// - Default values are clearly defined and merged with stored values.
// - JSON parsing errors are caught gracefully.
// - State is cached in memory to minimize localStorage access.
// - Clear separation of concerns with enums, interfaces, and utility functions.

// Suggestions for improvement (optional):
// 1. Consider adding explicit typing for the internal `state` object to improve type safety.
// 2. In `getState`, the fallback logic could be simplified by always parsing localStorage first if state is undefined.
// 3. Add comments on complex logic blocks for maintainability.
// 4. Possibly debounce or batch localStorage writes if performance becomes an issue.

// Overall, this is a solid, maintainable session state management module ready to support your Orion Admin dashboard and features.
