"use client";

import { useEffect, useCallback, useSyncExternalStore } from "react";
import {
  initializeClientSession,
  sessionStore,
} from "../app_state";
import type { OrionSessionState } from "@/types/orion";

// Define SessionStateKeys enum here to avoid circular dependencies
export enum SessionStateKeys {
  SESSION_STATE_INITIALIZED = "session_state_initialized",
  MEMORY_INITIALIZED = "memory_initialized",
  LLM_CONFIGURED = "llm_configured",
  TOMIDES_PROFILE_DATA = "tomides_profile_data",
  USER_NAME = "user_name",
  CREWAI_AVAILABLE = "crewai_available",
  PIPELINE_STATE = "pipeline_state",
  PIPELINE_STEP = "pipeline_step",
  MODEL_APPROACH_PIPELINE = "model_approach_pipeline",
  ENABLED_STEPS_PIPELINE = "enabled_steps_pipeline",

  // Networking
  STAKEHOLDERS_LIST_NET = "stakeholders_list_net",
  PROCESSED_STAKEHOLDERS_NET = "processed_stakeholders_net",
  NETWORKING_QUERY = "networking_query",
  NETWORKING_ROLES = "networking_roles",
  NETWORKING_MODEL_APPROACH = "networking_model_approach",
  NETWORKING_PRIMARY_MODEL = "networking_primary_model",

  // Ask Question
  ASK_Q_INPUT = "ask_q_input",
  ASK_Q_ANSWER = "ask_q_answer",
  ASK_Q_PROCESSING = "ask_q_processing",
  ASK_Q_MODEL_APPROACH = "ask_q_model_approach",
  ASK_Q_PRIMARY_MODEL = "ask_q_primary_model",

  // Draft Communication
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

  // Journal
  JOURNAL_TEXT = "journal_text",
  JOURNAL_PROCESSING = "journal_processing",
  JOURNAL_REFLECTION = "journal_reflection",
  JOURNAL_SHOW_SAVE_FORM = "journal_show_save_form",
  JOURNAL_MODEL_APPROACH = "journal_model_approach",
  JOURNAL_PRIMARY_MODEL = "journal_primary_model",

  // Habitica
  HABITICA_USER_ID = "habitica_user_id",
  HABITICA_API_TOKEN = "habitica_api_token",

  // Add to Memory
  ATM_PASTED_TEXT = "atm_pasted_text",
  ATM_SOURCE_ID = "atm_source_id",
  ATM_TAGS_INPUT = "atm_tags_input",
  ATM_SEARCH_QUERY = "atm_search_query",
  ATM_NUM_RESULTS = "atm_num_results",

  // Memory Manager
  MM_CRUD_MODEL = "mm_crud_model",
  MM_RAW_INPUT = "mm_raw_input",
  MM_OP_RADIO = "mm_op_radio",
  MM_BROWSE_MODEL = "mm_browse_model",

  // Routines
  ROUTINES_EXECUTION_STATUS = "routines_execution_status",
  ROUTINES_LAST_RUN = "routines_last_run",
  ROUTINES_SCRAPED_LINKS = "routines_scraped_links",
  ROUTINES_MORNING_COMPLETED = "routines_morning_completed",
  ROUTINES_EVENING_COMPLETED = "routines_evening_completed",

  // System Improvement
  SI_FEEDBACK_TYPE = "si_feedback_type",
  SI_FEATURE_INPUT = "si_feature_input",
  SI_DESCRIPTION_INPUT = "si_description_input",
  SI_IMPROVEMENT_SUGGESTIONS = "si_improvement_suggestions",

  // Agentic Workflow
  AGW_GOAL_INPUT = "agw_goal_input",
  AGW_APPROACH_RADIO = "agw_approach_radio",
  AGW_PRIMARY_MODEL = "agw_primary_model",
  AGW_OUTPUT_TEXT = "agw_output_text",

  // WhatsApp Helper
  WH_TEMPLATE_INPUT = "wh_template_input",
  WH_GENERATED_RESPONSE = "wh_generated_response",

  // Strategic Outreach Engine
  OUTREACH_OPPORTUNITY = "outreach_opportunity",
  OUTREACH_GOAL = "outreach_goal",
  OUTREACH_TYPE = "outreach_type",
  OUTREACH_TONE = "outreach_tone",
  OUTREACH_GENERATING = "outreach_generating",
  OUTREACH_DRAFT = "outreach_draft",

  // Narrative Clarity Studio
  NARRATIVE_TYPE = "narrative_type",
  NARRATIVE_TONE = "narrative_tone",
  NARRATIVE_LENGTH = "narrative_length",
  NARRATIVE_CONTEXT = "narrative_context",
  NARRATIVE_REQUIREMENTS = "narrative_requirements",
  NARRATIVE_GENERATING = "narrative_generating",
  NARRATIVE_CONTENT = "narrative_content",
  NARRATIVE_TITLE = "narrative_title",

  // Mood tracking
  CURRENT_MOOD = "current_mood",
  MOOD_NOTE = "mood_note",

  // Voice preference
  VOICE_PREFERENCE = "voice_preference"
}

const subscribeToLocalStorageKey = (key: SessionStateKeys, callback: () => void) => {
  const handleChange = (event: StorageEvent) => {
    if (event.key === key) {
      callback();
    }
  };
  window.addEventListener("storage", handleChange);
  return () => window.removeEventListener("storage", handleChange);
};

const getSnapshotForLocalStorageKey = <K extends SessionStateKeys>(
  key: K,
  explicitDefaultValue?: OrionSessionState[K]
): OrionSessionState[K] => {
  return sessionStore.getState(key, explicitDefaultValue);
};

export const useSessionState = <K extends SessionStateKeys>(
  key: K,
  explicitDefaultValue?: OrionSessionState[K]
): [OrionSessionState[K], (newValue: OrionSessionState[K]) => void] => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      initializeClientSession();
    }
  }, []);

  const value = useSyncExternalStore(
    (callback) => subscribeToLocalStorageKey(key, callback),
    () => getSnapshotForLocalStorageKey(key, explicitDefaultValue),
    () => getSnapshotForLocalStorageKey(key, explicitDefaultValue)
  );

  const updateValue = useCallback(
    (newValue: OrionSessionState[K]) => {
      sessionStore.setState(key, newValue);
    },
    [key]
  );

  return [value, updateValue];
};
