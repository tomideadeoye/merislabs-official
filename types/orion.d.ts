// Core type definitions for Orion Admin
export const enum SessionStateKeys {
  SESSION_STATE_INITIALIZED = "session_state_initialized",
  CREWAI_AVAILABLE = "crewai_available",
  VOICE_PREFERENCE = "voice_preference",
  MEMORY_INITIALIZED = "memory_initialized",
  LLM_CONFIGURED = "llm_configured",
  CURRENT_MOOD = "current_mood",
  USER_NAME = "user_name"
}

export type PageNames =
  | "Draft Communication"
  | "Journal"
  | "Networking"
  | "Opportunity Pipeline"
  | "Habitica Integration"
  | "Memory Manager"
  | "Agentic Workflow"
  | "Routines"
  | "WhatsApp Helper"
  | "System Settings";
