import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import logger from '@/lib/logger';
import { UserProfileData, EvaluationOutput } from '@/lib/types';

/**
 * Goal: This Zustand store manages the persistent session state for the Orion application.
 * It stores various pieces of data that need to persist across user sessions or refresh.
 *
 * Relation to other files, functions and features:
 * - This store is used by various components throughout the `app/(orion_admin)` and `app/opportunity` paths
 *   to manage UI state, form data, and cached information (e.g., user profile, opportunity details).
 * - `SessionStateKeys` enum defines the keys for easy access to specific state slices.
 * - It integrates with `@/lib/logger` for comprehensive logging of state changes and operations.
 * - It uses `UserProfileData`, and `EvaluationOutput` types from `@/lib/types` for type safety.
 */

export enum SessionStateKeys {
  LAST_ACTIVITY_TIMESTAMP = 'lastActivityTimestamp',
  CURRENT_ACTIVE_FEATURE = 'currentActiveFeature',
  USER_PREFERENCES = 'userPreferences',
  // Networking Hub
  PERSONA_FORM_STATE = 'personaFormState',
  PERSONAS_LIST = 'personasList',
  OUTREACH_GENERATION_STATE = 'outreachGenerationState',
  // Opportunity Pipeline
  OPPORTUNITY_CREATE_PROCESSING = 'opportunityCreateProcessing',
  OPPORTUNITY_LAST_SAVED_AT = 'opportunityLastSavedAt',
  OPPORTUNITY_IS_SAVING = 'opportunityIsSaving',
  OPPORTUNITY_CURRENT_ANALYSIS_SUMMARY = 'opportunityCurrentAnalysisSummary',
  OPPORTUNITY_DETAILS_FETCHED = 'opportunityDetailsFetched',
  OPPORTUNITY_EVALUATION_PROCESSING = 'opportunityEvaluationProcessing',
  OPPORTUNITY_EVALUATION_RESULT = 'opportunityEvaluationResult',
  OPPORTUNITY_EVALUATION_FEEDBACK = 'opportunityEvaluationFeedback',
  OPPORTUNITY_EVALUATION_SUGGESTIONS = 'opportunityEvaluationSuggestions',
  OPPORTUNITY_SHOW_EVALUATION_RESULT = 'opportunityShowEvaluationResult',
  OPPORTUNITY_SHOW_SUMMARY_FEEDBACK = 'opportunityShowSummaryFeedback',
  OPPORTUNITY_EVAL_SECTION_VISIBLE = 'opportunityEvalSectionVisible',
  OPPORTUNITY_RISK_REWARD_ANALYSIS = 'opportunityRiskRewardAnalysis',
  OPPORTUNITY_TAB_CURRENT_TAB = 'opportunityTabCurrentTab',
  OPPORTUNITY_NOTES = 'opportunityNotes',
  OPPORTUNITY_REASONS_TO_PURSUES = 'opportunityReasonsToPursues',
  OPPORTUNITY_REASONS_TO_SKIP = 'opportunityReasonsToSkip',
  OPPORTUNITY_SELECTED_OPPORTUNITY_ID = 'opportunitySelectedOpportunityId',
  // General
  LLM_CONFIGURED = 'llmConfigured',
  NOTION_DB_CONFIGURED = 'notionDbConfigured',
  NOTION_API_KEY = 'notionApiKey',
  OPENAI_API_KEY = 'openaiApiKey',
  QDRANT_API_KEY = 'qdrantApiKey',
  HABITICA_USER_ID = 'habiticaUserId',
  HABITICA_API_TOKEN = 'habiticaApiToken',
  TOMIDES_PROFILE_DATA = 'tomidesProfileData',
  JOURNAL_TEXT = 'journalText',
  JOURNAL_REFLECTION = 'journalReflection',
  JOURNAL_PROCESSING = 'journalProcessing',
  JOURNAL_SHOW_SAVE_FORM = 'journalShowSaveForm',
  JOURNAL_MODEL_APPROACH = 'journalModelApproach',
  JOURNAL_PRIMARY_MODEL = 'journalPrimaryModel',
  MEMORY_INITIALIZED = 'memoryInitialized',
  MM_BROAD_SEARCH_QUERY = 'mmBroadSearchQuery',
  MM_DETAILED_SEARCH_QUERY = 'mmDetailedSearchQuery',
  MM_EMAIL_DRAFT = 'mmEmailDraft',
  MM_GENERATING_EMAIL = 'mmGeneratingEmail',
  MM_GENERATING_LINKEDIN_MESSAGE = 'mmGeneratingLinkedinMessage',
  MM_LINKEDIN_MESSAGE_DRAFT = 'mmLinkedinMessageDraft',
  MM_OPPORTUNITY_SEARCH_RESULTS = 'mmOpportunitySearchResults',
  MM_OPPORTUNITY_SELECTED_STAKEHOLDERS = 'mmOpportunitySelectedStakeholders',
  MM_OPPORTUNITY_SEARCH_TERM = 'mmOpportunitySearchTerm',
  MM_PROCESSING_OPPORTUNITY_SEARCH = 'mmProcessingOpportunitySearch',
  MM_QDRANT_RESULTS = 'mmQdrantResults',
  MM_SEARCH_MODE = 'mmSearchMode',
  MM_SEMANTIC_SEARCH_ENABLED = 'mmSemanticSearchEnabled',
  MM_SELECTED_OPPORTUNITY_STAKEHOLDERS = 'mmSelectedOpportunityStakeholders',
  MM_SELECTED_OPPORTUNITY_URL = 'mmSelectedOpportunityUrl',
  MM_SEMANTIC_SEARCH_TERM = 'mmSemanticSearchTerm',
  MM_SOURCE_FILTER = 'mmSourceFilter',
  MM_TAG_FILTER = 'mmTagFilter',
  NOTIFICATION_SETTINGS_EMAIL_ENABLED = 'notificationSettingsEmailEnabled',
  NOTIFICATION_SETTINGS_PUSH_ENABLED = 'notificationSettingsPushEnabled',
  USER_NAME = 'userName',
  VOICE_PREFERENCE = 'voicePreference',
  WH_GENERATED_RESPONSE = 'whGeneratedResponse',
  WH_TEMPLATE_INPUT = 'whTemplateInput',
  WHATSAPP_DRAFTER_CONTEXT = 'whatsappDrafterContext',
  WHATSAPP_DRAFTER_DRAFT = 'whatsappDrafterDraft',
  WHATSAPP_DRAFTER_GENERATING = 'whatsappDrafterGenerating',
  WHATSAPP_DRAFTER_MODEL_APPROACH = 'whatsappDrafterModelApproach',
  WHATSAPP_DRAFTER_PRIMARY_MODEL = 'whatsappDrafterPrimaryModel',
  WHATSAPP_DRAFTER_RECIPIENT = 'whatsappDrafterRecipient',
  WHATSAPP_DRAFTER_SAVE_TAGS_INPUT = 'whatsappDrafterSaveTagsInput',
  WHATSAPP_DRAFTER_SENTIMENT = 'whatsappDrafterSentiment',
  WHATSAPP_DRAFTER_TONE = 'whatsappDrafterTone',
  WHATSAPP_DRAFTER_TOPIC = 'whatsappDrafterTopic',
  WHATSAPP_DRAFTER_USER_CONTEXT = 'whatsappDrafterUserContext',
  WHATSAPP_DRAFTER_WORD_COUNT = 'whatsappDrafterWordCount',
  SHOW_WHATSAPP_DRAFTER = 'showWhatsappDrafter',
  SHOW_JOURNAL_ENTRY_FORM = 'showJournalEntryForm',
  SHOW_SAVE_OPTIONS = 'showSaveOptions',
  SHOW_CBT_FORM = 'showCbtForm',
  // Add any new session state keys here for consistency
}

export interface SessionState {
  state: {
    [SessionStateKeys.LAST_ACTIVITY_TIMESTAMP]: string;
    [SessionStateKeys.CURRENT_ACTIVE_FEATURE]: string;
    [SessionStateKeys.USER_PREFERENCES]: Record<string, unknown>;
    [SessionStateKeys.PERSONA_FORM_STATE]?: unknown;
    [SessionStateKeys.PERSONAS_LIST]?: unknown[];
    [SessionStateKeys.OUTREACH_GENERATION_STATE]?: unknown;
    [SessionStateKeys.OPPORTUNITY_CREATE_PROCESSING]?: boolean;
    [SessionStateKeys.OPPORTUNITY_LAST_SAVED_AT]?: string;
    [SessionStateKeys.OPPORTUNITY_IS_SAVING]?: boolean;
    [SessionStateKeys.OPPORTUNITY_CURRENT_ANALYSIS_SUMMARY]?: string;
    [SessionStateKeys.OPPORTUNITY_DETAILS_FETCHED]?: boolean;
    [SessionStateKeys.OPPORTUNITY_EVALUATION_PROCESSING]?: boolean;
    [SessionStateKeys.OPPORTUNITY_EVALUATION_RESULT]?: EvaluationOutput | null;
    [SessionStateKeys.OPPORTUNITY_EVALUATION_FEEDBACK]?: string;
    [SessionStateKeys.OPPORTUNITY_EVALUATION_SUGGESTIONS]?: string;
    [SessionStateKeys.OPPORTUNITY_SHOW_EVALUATION_RESULT]?: boolean;
    [SessionStateKeys.OPPORTUNITY_SHOW_SUMMARY_FEEDBACK]?: boolean;
    [SessionStateKeys.OPPORTUNITY_EVAL_SECTION_VISIBLE]?: boolean;
    [SessionStateKeys.OPPORTUNITY_RISK_REWARD_ANALYSIS]?: unknown;
    [SessionStateKeys.OPPORTUNITY_TAB_CURRENT_TAB]?: string;
    [SessionStateKeys.OPPORTUNITY_NOTES]?: string;
    [SessionStateKeys.OPPORTUNITY_REASONS_TO_PURSUES]?: string;
    [SessionStateKeys.OPPORTUNITY_REASONS_TO_SKIP]?: string;
    [SessionStateKeys.OPPORTUNITY_SELECTED_OPPORTUNITY_ID]?: string;
    [SessionStateKeys.LLM_CONFIGURED]?: boolean;
    [SessionStateKeys.NOTION_DB_CONFIGURED]?: boolean;
    [SessionStateKeys.NOTION_API_KEY]?: string;
    [SessionStateKeys.OPENAI_API_KEY]?: string;
    [SessionStateKeys.QDRANT_API_KEY]?: string;
    [SessionStateKeys.HABITICA_USER_ID]?: string;
    [SessionStateKeys.HABITICA_API_TOKEN]?: string;
    [SessionStateKeys.TOMIDES_PROFILE_DATA]?: UserProfileData | null;
    [SessionStateKeys.JOURNAL_TEXT]?: string;
    [SessionStateKeys.JOURNAL_REFLECTION]?: string;
    [SessionStateKeys.JOURNAL_PROCESSING]?: boolean;
    [SessionStateKeys.JOURNAL_SHOW_SAVE_FORM]?: boolean;
    [SessionStateKeys.JOURNAL_MODEL_APPROACH]?: string;
    [SessionStateKeys.JOURNAL_PRIMARY_MODEL]?: string;
    [SessionStateKeys.MEMORY_INITIALIZED]?: boolean;
    [SessionStateKeys.MM_BROAD_SEARCH_QUERY]?: string;
    [SessionStateKeys.MM_DETAILED_SEARCH_QUERY]?: string;
    [SessionStateKeys.MM_EMAIL_DRAFT]?: string;
    [SessionStateKeys.MM_GENERATING_EMAIL]?: boolean;
    [SessionStateKeys.MM_GENERATING_LINKEDIN_MESSAGE]?: boolean;
    [SessionStateKeys.MM_LINKEDIN_MESSAGE_DRAFT]?: string;
    [SessionStateKeys.MM_OPPORTUNITY_SEARCH_RESULTS]?: unknown[];
    [SessionStateKeys.MM_OPPORTUNITY_SELECTED_STAKEHOLDERS]?: unknown[];
    [SessionStateKeys.MM_OPPORTUNITY_SEARCH_TERM]?: string;
    [SessionStateKeys.MM_PROCESSING_OPPORTUNITY_SEARCH]?: boolean;
    [SessionStateKeys.MM_QDRANT_RESULTS]?: unknown[];
    [SessionStateKeys.MM_SEARCH_MODE]?: string;
    [SessionStateKeys.MM_SEMANTIC_SEARCH_ENABLED]?: boolean;
    [SessionStateKeys.MM_SELECTED_OPPORTUNITY_STAKEHOLDERS]?: unknown[];
    [SessionStateKeys.MM_SELECTED_OPPORTUNITY_URL]?: string;
    [SessionStateKeys.MM_SEMANTIC_SEARCH_TERM]?: string;
    [SessionStateKeys.MM_SOURCE_FILTER]?: string;
    [SessionStateKeys.MM_TAG_FILTER]?: string;
    [SessionStateKeys.NOTIFICATION_SETTINGS_EMAIL_ENABLED]?: boolean;
    [SessionStateKeys.NOTIFICATION_SETTINGS_PUSH_ENABLED]?: boolean;
    [SessionStateKeys.USER_NAME]?: string;
    [SessionStateKeys.VOICE_PREFERENCE]?: string;
    [SessionStateKeys.WH_GENERATED_RESPONSE]?: string;
    [SessionStateKeys.WH_TEMPLATE_INPUT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_CONTEXT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_DRAFT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_GENERATING]?: boolean;
    [SessionStateKeys.WHATSAPP_DRAFTER_MODEL_APPROACH]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_PRIMARY_MODEL]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_RECIPIENT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_SAVE_TAGS_INPUT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_SENTIMENT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_TONE]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_TOPIC]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_USER_CONTEXT]?: string;
    [SessionStateKeys.WHATSAPP_DRAFTER_WORD_COUNT]?: number;
    [SessionStateKeys.SHOW_WHATSAPP_DRAFTER]?: boolean;
    [SessionStateKeys.SHOW_JOURNAL_ENTRY_FORM]?: boolean;
    [SessionStateKeys.SHOW_SAVE_OPTIONS]?: boolean;
    [SessionStateKeys.SHOW_CBT_FORM]?: boolean;
  };
  setState: (key: SessionStateKeys, value: unknown) => void;
  resetState: () => void;
}

export const initialState = {
  lastActivityTimestamp: new Date().toISOString(),
  currentActiveFeature: 'None',
  userPreferences: {},
  llmConfigured: false,
  notionDbConfigured: false,
  memoryInitialized: false,
  opportunityIsSaving: false,
  opportunityCreateProcessing: false,
  opportunityDetailsFetched: false,
  opportunityEvaluationProcessing: false,
  opportunityShowEvaluationResult: false,
  opportunityShowSummaryFeedback: false,
  opportunityEvalSectionVisible: true,
  // Initialize other states with default values
};

export const useSessionState = create<SessionState>()(
  persist(
    (set) => ({
      state: initialState,
      setState: (key, value) => {
        logger.debug(`Attempting to set state key: ${key} with value:`, { value });
        set((s) => {
          const newState = {
            ...s.state,
            [key]: value,
          };
          logger.debug(`New state for ${key}:`, { stateValue: newState[key] });
          return { state: newState };
        });
      },
      resetState: () => {
        logger.info('Resetting session state.');
        set({ state: initialState });
      },
    }),
    {
      name: 'orion-session-state', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
      onRehydrateStorage: () => {
        logger.info('Rehydrating session state from storage.');
        // optional
        return (state) => {
          if (state) {
            logger.success('Session state rehydrated successfully.', { state: state.state });
          }
        };
      },
      partialize: (state) => {
        // Only persist the 'state' object
        return { state: state.state };
      },
      skipHydration: true, // Hydration will be manually controlled or handled by a higher-order component
    }
  )
);
