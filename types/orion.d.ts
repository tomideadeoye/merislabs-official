import { SessionStateKeys } from "@/hooks/useSessionState";

export interface OrionSessionState {
  [SessionStateKeys.SESSION_STATE_INITIALIZED]: boolean;
  [SessionStateKeys.MEMORY_INITIALIZED]: boolean;
  [SessionStateKeys.LLM_CONFIGURED]: boolean;
  [SessionStateKeys.TOMIDES_PROFILE_DATA]: any;
  [SessionStateKeys.USER_NAME]: string;
  [SessionStateKeys.CREWAI_AVAILABLE]: boolean;
  [SessionStateKeys.PIPELINE_STATE]: PipelineState;
  [SessionStateKeys.PIPELINE_STEP]: string;
  [SessionStateKeys.MODEL_APPROACH_PIPELINE]: string;
  [SessionStateKeys.ENABLED_STEPS_PIPELINE]: EnabledSteps;
  [SessionStateKeys.ASK_Q_INPUT]: string;
  [SessionStateKeys.ASK_Q_ANSWER]: string;
  [SessionStateKeys.ASK_Q_PROCESSING]: boolean;
  [SessionStateKeys.ASK_Q_MODEL_APPROACH]: string;
  [SessionStateKeys.ASK_Q_PRIMARY_MODEL]: string;
  [SessionStateKeys.DC_COMM_TYPE]: string;
  [SessionStateKeys.DC_CONTEXT_OR_TEMPLATE]: string;
  [SessionStateKeys.DC_TOPIC]: string;
  [SessionStateKeys.DC_RECIPIENTS]: string;
  [SessionStateKeys.DC_CONTEXT]: string;
  [SessionStateKeys.DC_USER_CONTEXT]: string;
  [SessionStateKeys.DC_NUM_OPTIONS]: number;
  [SessionStateKeys.DC_DRAFT]: string;
  [SessionStateKeys.DC_DRAFT_OR_OPTIONS]: string;
  [SessionStateKeys.DC_GENERATING]: boolean;
  [SessionStateKeys.DC_MODEL_APPROACH]: string;
  [SessionStateKeys.DC_PRIMARY_MODEL]: string;
  [SessionStateKeys.DC_SAVE_TAGS_INPUT]: string;
  [SessionStateKeys.JOURNAL_TEXT]: string;
  [SessionStateKeys.JOURNAL_PROCESSING]: boolean;
  [SessionStateKeys.JOURNAL_REFLECTION]: string;
  [SessionStateKeys.JOURNAL_SHOW_SAVE_FORM]: boolean;
  [SessionStateKeys.JOURNAL_MODEL_APPROACH]: string;
  [SessionStateKeys.JOURNAL_PRIMARY_MODEL]: string;
  [SessionStateKeys.HABITICA_USER_ID]: string;
  [SessionStateKeys.HABITICA_API_TOKEN]: string;
  [SessionStateKeys.ATM_PASTED_TEXT]: string;
  [SessionStateKeys.ATM_SOURCE_ID]: string;
  [SessionStateKeys.ATM_TAGS_INPUT]: string;
  [SessionStateKeys.ATM_SEARCH_QUERY]: string;
  [SessionStateKeys.ATM_NUM_RESULTS]: number;
  [SessionStateKeys.MM_CRUD_MODEL]: string;
  [SessionStateKeys.MM_RAW_INPUT]: string;
  [SessionStateKeys.MM_OP_RADIO]: string;
  [SessionStateKeys.MM_BROWSE_MODEL]: string;
  [SessionStateKeys.ROUTINES_EXECUTION_STATUS]: string;
  [SessionStateKeys.ROUTINES_LAST_RUN]: string;
  [SessionStateKeys.ROUTINES_SCRAPED_LINKS]: string[];
  [SessionStateKeys.ROUTINES_MORNING_COMPLETED]: boolean;
  [SessionStateKeys.ROUTINES_EVENING_COMPLETED]: boolean;
  [SessionStateKeys.SI_FEEDBACK_TYPE]: string;
  [SessionStateKeys.SI_FEATURE_INPUT]: string;
  [SessionStateKeys.SI_DESCRIPTION_INPUT]: string;
  [SessionStateKeys.SI_IMPROVEMENT_SUGGESTIONS]: string;
  [SessionStateKeys.AGW_GOAL_INPUT]: string;
  [SessionStateKeys.AGW_APPROACH_RADIO]: string;
  [SessionStateKeys.AGW_PRIMARY_MODEL]: string;
  [SessionStateKeys.AGW_OUTPUT_TEXT]: string;
  [SessionStateKeys.WH_TEMPLATE_INPUT]: string;
  [SessionStateKeys.WH_GENERATED_RESPONSE]: string;
  [SessionStateKeys.OUTREACH_OPPORTUNITY]: string;
  [SessionStateKeys.OUTREACH_GOAL]: string;
  [SessionStateKeys.OUTREACH_TYPE]: string;
  [SessionStateKeys.OUTREACH_TONE]: string;
  [SessionStateKeys.OUTREACH_GENERATING]: boolean;
  [SessionStateKeys.OUTREACH_DRAFT]: string;
  [SessionStateKeys.NARRATIVE_TYPE]: string;
  [SessionStateKeys.NARRATIVE_TONE]: string;
  [SessionStateKeys.NARRATIVE_LENGTH]: string;
  [SessionStateKeys.NARRATIVE_CONTEXT]: string;
  [SessionStateKeys.NARRATIVE_REQUIREMENTS]: string;
  [SessionStateKeys.NARRATIVE_GENERATING]: boolean;
  [SessionStateKeys.NARRATIVE_CONTENT]: string;
  [SessionStateKeys.NARRATIVE_TITLE]: string;
  [SessionStateKeys.CURRENT_MOOD]: string;
  [SessionStateKeys.MOOD_NOTE]: string;
  [SessionStateKeys.VOICE_PREFERENCE]: string;
  [SessionStateKeys.NETWORKING_QUERY]: string;
  [SessionStateKeys.NETWORKING_ROLES]: string;
  [SessionStateKeys.NETWORKING_MODEL_APPROACH]: string;
  [SessionStateKeys.NETWORKING_PRIMARY_MODEL]: string;
  [SessionStateKeys.STAKEHOLDERS_LIST_NET]: any[];
  [SessionStateKeys.PROCESSED_STAKEHOLDERS_NET]: any[];
  [key: string]: any;
}

export interface PipelineState {
  current_opportunity: string | null;
  evaluation_result: any | null;
  stakeholders: any | null;
  application_answers: Record<string, string>;
  communications: Record<string, string>;
  customization_suggestions: any | null;
  web_context: any | null;
}

export interface EnabledSteps {
  web_research: boolean;
  evaluation: boolean;
  networking: boolean;
}

export interface MemoryPayload {
  text: string;
  source_id: string;
  type?: string;
  timestamp?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  related_idea_id?: string;
  idea_component_type?: 'note' | 'llm_brainstorm' | 'research_snippet';
  original_entry_id?: string;
  mood?: string;
}

export interface ScoredMemoryPoint {
  id: string;
  payload: MemoryPayload;
  score: number;
}

export interface QdrantFilterCondition {
  key: string;
  match: {
    value: string | number | boolean;
  };
}

export interface QdrantFilter {
  must?: QdrantFilterCondition[];
  should?: QdrantFilterCondition[];
  must_not?: QdrantFilterCondition[];
}

export interface LLMParams {
  requestType: string;
  primaryContext: string;
  profileContext?: string;
  prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  [key: string]: any;
}

export interface LLMResponseObject {
  success: boolean;
  model?: string;
  error?: string;
}

export interface Agent {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  tools?: any[];
}

export interface Task {
  description: string;
  expected_output: string;
  agent: string;
}

export interface Crew {
  agents: Agent[];
  tasks: Task[];
  verbose?: boolean;
}

export interface CrewManagerConfig {
  defaultAgents?: Agent[];
  defaultTasks?: Task[];
}

export interface CrewTemplate {
  name: string;
  description: string;
  agents: Agent[];
  tasks: Task[];
}

export interface CrewExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface CrewProcessConfig {
  goal: string;
  approach: string;
  model?: string;
}

export interface EvaluationOutput {
  fitScorePercentage: number;
  recommendation: string;
  reasoning: string;
  alignmentHighlights: string[];
  gapAnalysis: string[];
  riskRewardAnalysis: string[];
  suggestedNextSteps: string[];
  rawOutput?: string;
}