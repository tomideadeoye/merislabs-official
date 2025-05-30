import { SessionStateKeys } from '@/app_state';

// Core type definitions for Orion Admin
export type PageNamesType =
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

// --- LLM & API Related Types ---
export interface LLMParams {
  requestType: string;
  primaryContext: string;
  profileContext?: string;
  question?: string;
  modelOverride?: string;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
}

export interface LLMResponseObject {
  success: boolean;
  content: string | null;
  model?: string;
  error?: string;
  details?: string;
}

// --- Memory Related Types ---
export interface MemoryPayload {
  text: string;
  source_id: string;
  timestamp: string;
  tags: string[];
  chunk_index: number;
  indexed_at: string;
  type?: string;
  mood?: string;
  [key: string]: any;
}

export interface MemoryPoint {
  id: string;
  vector: number[];
  payload: MemoryPayload;
}

export interface ScoredMemoryPoint {
  id: string;
  score: number;
  payload: MemoryPayload;
  vector?: number[];
}

export interface QdrantFilterCondition {
  key: string;
  match?: { value: string | number | boolean };
  range?: {
    gt?: number;
    gte?: number;
    lt?: number;
    lte?: number;
  };
  has_id?: Array<string | number>;
}

export interface QdrantFilter {
  must?: QdrantFilterCondition[];
  should?: QdrantFilterCondition[];
  must_not?: QdrantFilterCondition[];
}

// --- Session State Related Interfaces ---
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

// --- CrewAI Related Types ---
export interface Agent {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  verbose?: boolean;
  allowDelegation?: boolean;
  capabilities?: string[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  memory?: any;
  tools?: any[];
}

export interface Task {
  id: string;
  description: string;
  expectedOutput: string;
  agentId: string;
  dependencies?: string[];
  priority?: number;
  timeout?: number;
  retryCount?: number;
  asyncExecution?: boolean;
  outputFile?: string;
}

export interface CrewProcessConfig {
  type: 'sequential' | 'hierarchical' | 'parallel';
  memory?: boolean;
  cache?: boolean;
  maxRpm?: number;
  shareCrew?: boolean;
}

export interface Crew {
  id: string;
  name: string;
  agents: Agent[];
  tasks: Task[];
  verbose?: boolean;
  maxExecutionTime?: number;
  process?: CrewProcessConfig;
  manager?: Agent;
  inputs?: Record<string, any>;
}

export interface CrewTemplate {
  name: string;
  description: string;
  agents: Omit<Agent, 'id'>[];
  tasks: Omit<Task, 'id' | 'agentId'>[];
  process?: CrewProcessConfig;
}

export interface CrewExecutionResult {
  success: boolean;
  result: string;
  executionTime: number;
  tasksCompleted: number;
  errors: string[];
  agentOutputs: Record<string, string>;
}

export interface CrewManagerConfig {
  defaultTimeout?: number;
  defaultRetryCount?: number;
  enableLogging?: boolean;
  maxConcurrentCrews?: number;
  defaultModel?: string;
  defaultTemperature?: number;
}

export interface CrewManagerState {
  activeCrews: Crew[];
  availableTemplates: CrewTemplate[];
  executionHistory: CrewExecutionResult[];
}

export interface CrewProcessConfig {
  type: 'sequential' | 'hierarchical' | 'parallel';
  verbose?: boolean;
}

// Add other complex type definitions needed across your Orion system.

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