import type {
  PipelineState,
  EnabledSteps,
  OrionSessionState,
} from "@/types/orion";
import { SessionStateKeys } from "@/hooks/useSessionState";

export { SessionStateKeys };

export const PageNames = {
  HOME: "🏠 Home",
  WHATSAPP: "📱 WhatsApp Helper",
  WHATSAPP_ANALYSIS: "💬 WhatsApp Analysis",
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
  NARRATIVE: "📝 Narrative Studio",
  INSIGHTS: "💡 Pattern Insights",
  OPPORTUNITY: "🧐 Opportunity Evaluator",
  EMOTIONAL: "🧘 Emotional Tracker",
  LOCAL_FILES: "📂 Local Files",
  IDEA_INCUBATOR: "💡 Idea Incubator",
  ADMIN_DASHBOARD: "👑 Admin Dashboard",
} as const;

export type PageNameValue = typeof PageNames[keyof typeof PageNames];

export const getDefaultSessionState = (): Partial<OrionSessionState> => ({
  [SessionStateKeys.SESSION_STATE_INITIALIZED]: false,
  [SessionStateKeys.MEMORY_INITIALIZED]: false,
  [SessionStateKeys.LLM_CONFIGURED]: true,
  [SessionStateKeys.TOMIDES_PROFILE_DATA]: null,
  [SessionStateKeys.USER_NAME]: "Architect",
  [SessionStateKeys.CREWAI_AVAILABLE]: false,
  [SessionStateKeys.PIPELINE_STATE]: {
    currentStep: '',
    completedSteps: [],
    data: {},
    current_opportunity: null,
    evaluation_result: null,
    stakeholders: null,
    application_answers: {},
    communications: {},
    customization_suggestions: null,
    web_context: null,
  } as PipelineState,
  [SessionStateKeys.PIPELINE_STEP]: "input",
  [SessionStateKeys.MODEL_APPROACH_PIPELINE]: "Single Model with Fallbacks",
  [SessionStateKeys.ENABLED_STEPS_PIPELINE]: {
    web_research: true,
    evaluation: true,
    networking: true,
  },
  [SessionStateKeys.ASK_Q_INPUT]: "",
  [SessionStateKeys.ASK_Q_ANSWER]: "",
  [SessionStateKeys.ASK_Q_PROCESSING]: false,
  [SessionStateKeys.DC_COMM_TYPE]: "Email",
  [SessionStateKeys.DC_TOPIC]: "",
  [SessionStateKeys.ATM_NUM_RESULTS]: 5,
});

export const getDefaultSessionValue = <K extends SessionStateKeys>(
  key: K
): OrionSessionState[K] | undefined => {
  const defaults = getDefaultSessionState();
  if (key in defaults) {
    return defaults[key as keyof Partial<OrionSessionState>] as OrionSessionState[K];
  }
  return undefined;
};

class SessionStateManager {
  private static instance: SessionStateManager;
  private stateCache: Partial<OrionSessionState> = {};
  private initialized: boolean = false;

  private constructor() {
    if (typeof window !== "undefined") {
      const storedInitFlag = window.localStorage.getItem(
        "session_state_initialized"
      );
      if (storedInitFlag === "true") {
        this.initialized = true;
        // Iterate through localStorage directly instead of using SessionStateKeys
        for (let i = 0; i < window.localStorage.length; i++) {
          const storageKey = window.localStorage.key(i);
          if (storageKey && storageKey !== "session_state_initialized") {
            try {
              const storedValue = window.localStorage.getItem(storageKey);
              if (storedValue !== null) {
                this.stateCache[storageKey as SessionStateKeys] = JSON.parse(storedValue);
              }
            } catch (error) {
              console.warn(`Failed to parse stored value for key ${storageKey}:`, error);
              // Remove corrupted data
              window.localStorage.removeItem(storageKey);
            }
          }
        }
      }
    }
  }

  public static getInstance(): SessionStateManager {
    if (!SessionStateManager.instance) {
      SessionStateManager.instance = new SessionStateManager();
    }
    return SessionStateManager.instance;
  }

  private initKeyLocalStorage<K extends SessionStateKeys>(
    key: K,
    defaultValue: OrionSessionState[K]
  ): void {
    if (typeof window !== "undefined") {
      const storedValue = window.localStorage.getItem(key);
      if (storedValue === null && defaultValue !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue));
        this.stateCache[key] = defaultValue;
      } else if (storedValue !== null && this.stateCache[key] === undefined) {
        try {
          this.stateCache[key] = JSON.parse(storedValue);
        } catch (error) {
          console.warn(`Failed to parse stored value for key ${key}:`, error);
          window.localStorage.removeItem(key);
        }
      } else if (
        this.stateCache[key] === undefined &&
        defaultValue !== undefined
      ) {
        this.stateCache[key] = defaultValue;
      }
    }
  }

  public initializeClientSession(): void {
    if (typeof window === "undefined" || this.initialized) {
      if (this.initialized) {
        const defaults = getDefaultSessionState();
        for (const keyAsString in defaults) {
          const key = keyAsString as SessionStateKeys;
          if (window.localStorage.getItem(key) === null) {
            const defaultValue = defaults[key];
            if (defaultValue !== undefined) {
              this.initKeyLocalStorage(
                key,
                defaultValue as OrionSessionState[typeof key]
              );
            }
          } else if (this.stateCache[key] === undefined) {
            const storedValue = window.localStorage.getItem(key);
            if (storedValue !== null) {
              try {
                this.stateCache[key] = JSON.parse(storedValue);
              } catch (error) {
                console.warn(`Failed to parse stored value for key ${key}:`, error);
                window.localStorage.removeItem(key);
              }
            }
          }
        }
      }
      return;
    }

    const defaults = getDefaultSessionState();
    for (const keyAsString in defaults) {
      const key = keyAsString as SessionStateKeys;
      const defaultValue = defaults[key];
      if (defaultValue !== undefined) {
        this.initKeyLocalStorage(key, defaultValue as OrionSessionState[typeof key]);
      }
    }
    window.localStorage.setItem(
      "session_state_initialized",
      JSON.stringify(true)
    );
    this.stateCache["session_state_initialized" as SessionStateKeys] = true;
    this.initialized = true;
  }

  public getState<K extends SessionStateKeys>(
    key: K,
    explicitDefault?: OrionSessionState[K]
  ): OrionSessionState[K] {
    if (typeof window === "undefined") {
      const serverDefault =
        explicitDefault !== undefined
          ? explicitDefault
          : getDefaultSessionValue(key);
      return serverDefault as OrionSessionState[K];
    }
    if (this.stateCache[key] !== undefined) {
      return this.stateCache[key] as OrionSessionState[K];
    }
    const storedValue = window.localStorage.getItem(key);
    if (storedValue !== null) {
      try {
        const parsed = JSON.parse(storedValue);
        this.stateCache[key] = parsed;
        return parsed;
      } catch (error) {
        console.warn(`Failed to parse stored value for key ${key}:`, error);
        window.localStorage.removeItem(key);
      }
    }
    const defaultValue =
      explicitDefault !== undefined
        ? explicitDefault
        : getDefaultSessionValue(key);
    if (defaultValue !== undefined) {
      this.stateCache[key] = defaultValue;
    }
    return defaultValue as OrionSessionState[K];
  }

  // Clear oldest entries to free up localStorage space
  private clearOldEntries(): void {
    // Simple implementation to remove non-critical data
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key &&
            key !== "session_state_initialized" &&
            key !== SessionStateKeys.MEMORY_INITIALIZED &&
            key !== SessionStateKeys.USER_NAME) {
          window.localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error("Error clearing old entries:", error);
    }
  }

  public setState<K extends SessionStateKeys>(
    key: K,
    value: OrionSessionState[K]
  ): void {
    if (typeof window === "undefined") return;
    this.stateCache[key] = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      if (error instanceof DOMException && error.code === 22) {
        // Handle quota exceeded
        console.warn('localStorage quota exceeded, clearing old entries');
        this.clearOldEntries();
      }
      console.error(
        `SessionManager: Error setting localStorage for ${key}:`,
        error
      );
    }
  }
}

export const sessionStore = SessionStateManager.getInstance();

export const initializeClientSession = (): void => {
  if (typeof window !== "undefined") {
    sessionStore.initializeClientSession();
  }
};
