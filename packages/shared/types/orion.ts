// CANONICAL: This file is the single source of truth for all OrionOpportunity-related types in the monorepo. Do not duplicate these types elsewhere. Update all imports to use the barrel export from packages/shared/src/index.ts.

export interface OrionOpportunity {
  id: string;
  notionPageId?: string;
  title: string;
  company: string;
  content: string;
  descriptionSummary?: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  sourceURL?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  nextActionDate?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  lastStatusUpdate?: string;
  dateIdentified?: string;
  // Add any additional fields as needed for full compatibility
}

// Canonical shared types for Orion

export interface CognitiveDistortion {
  id: string;
  name: string;
  selected: boolean;
}

export interface CognitiveDistortionAnalysisData {
  automaticThought: string;
  identifiedDistortions: string[];
  challengeToThought?: string;
  alternativePerspective?: string;
}

export interface EmotionalLogEntry {
  id: string;
  timestamp: string;
  primaryEmotion: string;
  secondaryEmotions?: string[];
  intensity?: number;
  triggers?: string[];
  physicalSensations?: string[];
  accompanyingThoughts?: string;
  copingMechanismsUsed?: string[];
  contextualNote?: string;
  relatedJournalSourceId?: string;
  cognitiveDistortionAnalysis?: CognitiveDistortionAnalysisData;
}

export interface LogEmotionRequestBody {
  primaryEmotion: string;
  secondaryEmotions?: string[];
  intensity?: number;
  triggers?: string[];
  physicalSensations?: string[];
  accompanyingThoughts?: string;
  copingMechanismsUsed?: string[];
  contextualNote?: string;
  entryTimestamp?: string;
  relatedJournalSourceId?: string;
  cognitiveDistortionAnalysis?: CognitiveDistortionAnalysisData;
}

export interface ScoredMemoryPoint {
  score: number;
  payload: {
    text: string;
    source_id: string;
    timestamp: string;
    indexed_at: string;
    type: string;
    tags?: string[];
    mood?: string;
    original_entry_id?: string;
  };
  vector?: number[];
  id?: string;
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

export type SessionStateKeys =
  | 'current_step'
  | 'enabled_steps'
  | 'pipeline_state'
  | 'personal_bio'
  | 'job_description'
  | 'cv_components'
  | 'selected_components'
  | 'tailored_components'
  | 'cover_letter'
  | 'JOURNAL_TEXT'
  | 'JOURNAL_PROCESSING'
  | 'JOURNAL_REFLECTION'
  | 'JOURNAL_SHOW_SAVE_FORM'
  | 'personal_bio'
  | 'linkedin_summary'
  | 'vision_statement'
  | 'elevator_pitch'
  | 'cover_letter'
  | 'personal_statement'
  | 'custom';

export type NarrativeType =
  | 'personal_bio'
  | 'linkedin_summary'
  | 'vision_statement'
  | 'elevator_pitch'
  | 'cover_letter'
  | 'personal_statement'
  | 'custom';

export type NarrativeTone = 'professional' | 'conversational' | 'visionary' | 'academic';
export type NarrativeLength = 'brief' | 'standard' | 'detailed';

export interface PipelineState {
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
  current_opportunity: any | null;
  evaluation_result: any | null;
  stakeholders: any[] | null;
  application_answers: Record<string, any>;
  communications: Record<string, any>;
  customization_suggestions: any | null;
  web_context: any | null;
}

export interface EnabledSteps {
  [key: string]: boolean;
}

export interface OrionSessionState {
  [key: string]: any;
  narrative_type: NarrativeType;
  narrative_tone: NarrativeTone;
  narrative_length: NarrativeLength;
  narrative_context: string;
  narrative_requirements: string;
  narrative_generating: boolean;
  narrative_content?: string;
  narrative_title?: string;
  session_state_initialized: boolean;
  memory_initialized: boolean;
  llm_configured: boolean;
  tomides_profile_data: any;
  user_name: string;
  crewai_available: boolean;
  pipeline_state: PipelineState;
  pipeline_step: string;
  model_approach_pipeline: string;
  enabled_steps_pipeline: EnabledSteps;
  stakeholders_list_net: any;
  processed_stakeholders_net: any;
  networking_query: string;
  networking_roles: string;
  networking_model_approach: string;
  networking_primary_model: string;
  ask_q_input: string;
  ask_q_answer: string;
  ask_q_processing: boolean;
  ask_q_model_approach: string;
  ask_q_primary_model: string;
  dc_comm_type: string;
  dc_context_or_template: string;
  dc_topic: string;
  dc_recipients: string;
  dc_context: string;
  dc_user_context: string;
  dc_num_options: number;
  dc_draft: string;
  dc_draft_or_options: string;
  dc_generating: boolean;
  dc_model_approach: string;
  dc_primary_model: string;
  dc_save_tags_input: string;
  journal_text: string;
  journal_processing: boolean;
  journal_reflection: string | null | undefined;
  journal_show_save_form: boolean;
  journal_model_approach: string;
  journal_primary_model: string;
  habitica_user_id: string;
  habitica_api_token: string;
  atm_pasted_text: string;
  atm_source_id: string;
  atm_tags_input: string;
  atm_search_query: string;
  atm_num_results: number;
  mm_crud_model: string;
  mm_raw_input: string;
  mm_op_radio: string;
  mm_browse_model: string;
  routines_execution_status: string;
  routines_last_run: string;
  routines_scraped_links: string[];
  routines_morning_completed: boolean;
  routines_evening_completed: boolean;
  si_feedback_type: string;
  si_feature_input: string;
  si_description_input: string;
  si_improvement_suggestions: string;
  agw_goal_input: string;
  agw_approach_radio: string;
  agw_primary_model: string;
  agw_output_text: string;
  wh_template_input: string;
  wh_generated_response: string;
  outreach_opportunity: any;
  outreach_goal: string;
  outreach_type: string;
  outreach_tone: string;
  outreach_generating: boolean;
  outreach_draft: string;
  current_mood: string;
  mood_note: string;
  voice_preference: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities?: string[];
  systemPrompt?: string;
  model?: string;
  backstory?: string;
}

export interface Task {
  id: string;
  description: string;
  expectedOutput?: string;
  agentId?: string;
  dependencies?: string[];
  status?: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
  agentRole?: string;
}

export interface Crew {
  id: string;
  name: string;
  agents: Agent[];
  tasks: Task[];
  process?: CrewProcessConfig;
  inputs?: Record<string, any>;
  verbose?: boolean;
}

export interface CrewManagerConfig {
  defaultTimeout?: number;
  defaultRetryCount?: number;
  enableLogging?: boolean;
  maxConcurrentCrews?: number;
  defaultModel?: string;
  defaultTemperature?: number;
}

export interface CrewTemplate {
  name: string;
  description: string;
  agents: Partial<Agent>[];
  tasks: Partial<Task>[];
  process?: CrewProcessConfig;
}

export interface CrewExecutionResult {
  success: boolean;
  result?: any;
  executionTime?: number;
  tasksCompleted?: number;
  errors?: string[];
  agentOutputs?: Record<string, string>;
}

export interface CrewProcessConfig {
  type: 'sequential' | 'parallel';
  maxConcurrent?: number;
}

export interface DraftApplicationRequestBody {
  opportunityId: string;
  applicantProfile: any;
  evaluationSummary?: string;
  memorySnippets?: any[];
  numberOfDrafts?: number;
}

export interface DraftApplicationResponseBody {
  success: boolean;
  drafts?: string[];
  error?: string;
  details?: string;
}

export interface SearchMemoryResponse {
  success: boolean;
  results?: ScoredMemoryPoint[];
  error?: string;
}

export interface GenerateLLMResponse {
  success: boolean;
  content?: string;
  error?: string;
}

export interface JournalEntryNotionInput {
  title: string;
  date: Date;
  content: string;
  contentType: string;
  notionPageId?: string;
  mood?: string;
  tags?: string[];
}

export type OpportunityType = 'job' | 'education_program' | 'project_collaboration' | 'funding' | 'other';
export type OpportunityStatus = 'Not Started' | 'In progress' | 'Applied' | 'Interview' | 'Complete' | 'Offer' | 'Rejected';
export type OpportunityPriority = 'low' | 'medium' | 'high';

export interface MemoryPayload {
  text: string;
  source_id: string;
  timestamp: string;
  indexed_at: string;
  type: string;
  title?: string;
  tags?: string[];
  mood?: string;
  original_entry_id?: string;
}

export interface MemoryPoint {
  id: string;
  vector: number[];
  payload?: MemoryPayload;
}

export interface CVComponent {
  notionPageId: string;
  unique_id: string;
  component_name: string;
  component_type: string;
  content_primary: string;
  keywords?: string[];
  associated_company_institution?: string;
  start_date?: string;
  end_date?: string;
  contentType?: string;
}

export interface OpportunityNotionInput {
  title: string;
  companyOrInstitution: string;
  status?: string;
  url?: string;
  content?: string;
  type?: string;
  priority?: string;
  dateIdentified?: string;
  tags?: string[];
  nextActionDate?: string;
}

export interface OpportunityCreatePayload {
  title: string;
  company: string;
  content: string;
  descriptionSummary?: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  sourceURL?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  nextActionDate?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  lastStatusUpdate?: string;
}

export interface OpportunityNotionOutputShared {
  notion_page_id: string;
  id: string;
  title: string;
  company: string;
  status: string | null;
  url: string | null;
  last_edited_time?: Date | string | null;
  content?: string | null;
  type?: string | null;
  priority?: string | null;
  dateIdentified?: string | null;
  tags?: string[];
  nextActionDate?: string | null;
}

export interface NotionPageProperties {
  [key: string]: any;
}

export interface RiskRewardAnalysis {
  risks: string[];
  rewards: string[];
  riskLevel: "Low" | "Moderate" | "High" | string;
  rewardLevel: "Low" | "Moderate" | "High" | string;
  notes?: string;
}

export interface EvaluationOutput {
  fitScorePercentage: number;
  alignmentHighlights?: string[];
  gapAnalysis?: string[];
  riskRewardAnalysis?: RiskRewardAnalysis;
  recommendation: "Pursue" | "Delay & Prepare" | "Reject" | "Consider Further" | string;
  reasoning: string;
  suggestedNextSteps?: string[];
  supportingContext?: string[];
  pros?: string[];
  cons?: string[];
  missingSkills?: string[];
  scoreExplanation?: string;
  rawOutput?: string;
}

export type OrionOpportunityDetails = OrionOpportunity;
