import { CognitiveDistortionId } from "@/lib/cbt_constants";

export interface CognitiveDistortion {
  id: CognitiveDistortionId;
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

  // Added pipeline-specific properties
  current_opportunity: any | null; // Assuming it can be any opportunity object or null
  evaluation_result: any | null; // Assuming it can be an evaluation result object or null
  stakeholders: any[] | null; // Assuming it's an array of stakeholders or null
  application_answers: Record<string, any>; // Assuming it's a record of string keys and any values
  communications: Record<string, any>; // Assuming it's a record of string keys and any values
  customization_suggestions: any | null; // Assuming it can be any suggestions object/string or null
  web_context: any | null; // Assuming it can be any web context object/string or null
}

export interface EnabledSteps {
  [key: string]: boolean;
}

export interface OrionSessionState {
  [key: string]: any;

  // Narrative Generation Form Keys
  narrative_type: NarrativeType;
  narrative_tone: NarrativeTone;
  narrative_length: NarrativeLength;
  narrative_context: string;
  narrative_requirements: string;
  narrative_generating: boolean;
  narrative_content?: string;
  narrative_title?: string;

  // Add other SessionStateKeys with their types here as needed
  session_state_initialized: boolean;
  memory_initialized: boolean;
  llm_configured: boolean;
  tomides_profile_data: any;
  user_name: string;
  crewai_available: boolean;
  pipeline_state: PipelineState;
  pipeline_step: string; // Replace with a more specific type if known
  model_approach_pipeline: string; // Replace with a more specific type if known
  enabled_steps_pipeline: EnabledSteps;

  // Networking Keys
  stakeholders_list_net: any;
  processed_stakeholders_net: any;
  networking_query: string;
  networking_roles: string; // Replace with array if applicable
  networking_model_approach: string;
  networking_primary_model: string;

  // Ask Question Keys
  ask_q_input: string;
  ask_q_answer: string;
  ask_q_processing: boolean;
  ask_q_model_approach: string;
  ask_q_primary_model: string;

  // Draft Communication Keys
  dc_comm_type: string; // Replace with specific type if known
  dc_context_or_template: string;
  dc_topic: string;
  dc_recipients: string; // Replace with array if applicable
  dc_context: string;
  dc_user_context: string;
  dc_num_options: number;
  dc_draft: string;
  dc_draft_or_options: string;
  dc_generating: boolean;
  dc_model_approach: string;
  dc_primary_model: string;
  dc_save_tags_input: string;

  // Journal Keys
  journal_text: string;
  journal_processing: boolean;
  journal_reflection: string | null | undefined; // Allow null as well
  journal_show_save_form: boolean;
  journal_model_approach: string;
  journal_primary_model: string;

  // Habitica Keys
  habitica_user_id: string;
  habitica_api_token: string;

  // Add to Memory Keys
  atm_pasted_text: string;
  atm_source_id: string;
  atm_tags_input: string; // Replace with array if applicable
  atm_search_query: string;
  atm_num_results: number;

  // Memory Manager Keys
  mm_crud_model: string;
  mm_raw_input: string;
  mm_op_radio: string;
  mm_browse_model: string;

  // Routines Keys
  routines_execution_status: string;
  routines_last_run: string;
  routines_scraped_links: string[];
  routines_morning_completed: boolean;
  routines_evening_completed: boolean;

  // System Improvement Keys
  si_feedback_type: string;
  si_feature_input: string;
  si_description_input: string;
  si_improvement_suggestions: string;

  // Agentic Workflow Keys
  agw_goal_input: string;
  agw_approach_radio: string;
  agw_primary_model: string;
  agw_output_text: string;

  // WhatsApp Helper Keys
  wh_template_input: string;
  wh_generated_response: string;

  // Strategic Outreach Engine Keys
  outreach_opportunity: any;
  outreach_goal: string;
  outreach_type: string;
  outreach_tone: string;
  outreach_generating: boolean;
  outreach_draft: string;

  // Mood tracking Keys
  current_mood: string;
  mood_note: string;

  // Voice preference Keys
  voice_preference: string;

}

export interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities?: string[];
  systemPrompt?: string;
  model?: string;
  goal?: string;
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

// Represents the payload structure for a Qdrant point
export interface MemoryPayload {
  text: string;
  source_id: string; // Unique ID for the source document (e.g., journal entry ID, file path)
  timestamp: string; // ISO string of when the event occurred
  indexed_at: string; // ISO string of when it was indexed into Qdrant
  type: string; // Type of memory (e.g., "journal_entry", "file_snippet", "web_page")
  title?: string; // Optional title/summary
  tags?: string[]; // Optional tags
  mood?: string; // Optional mood associated with the entry
  original_entry_id?: string; // Optional ID linking back to the original source (e.g., Notion page ID, DB record ID)
}

// Represents a Qdrant point structure including vector and payload
export interface MemoryPoint {
    id: string; // Unique ID for the point in Qdrant
    vector: number[]; // The embedding vector
    payload?: MemoryPayload; // Optional payload data
}

export interface CVComponentShared {
  notionPageId: string;
  unique_id: string;
  component_name: string;
  component_type: string;
  content_primary: string;
  contentType?: string;
  keywords?: string[];
  associated_company_institution?: string;
  start_date?: string;
  end_date?: string;

}

export interface OpportunityNotionInput {
    title: string;
    company: string;
    status?: string;
    url?: string;
    description?: string;
    type?: string;
    priority?: string;
    dateIdentified?: string;
    tags?: string[];
    nextActionDate?: string;
}

export interface OpportunityCreatePayload {
  title: string;
  company?: string;
  companyOrInstitution?: string;
  description: string;
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
  notes?: string; // Keep notes here for frontend form state if needed, but remove from NotionPayload
  nextActionDate?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  lastStatusUpdate?: string;
}

export interface OpportunityNotionOutputShared {
    notion_page_id: string;
    id: string; // Adding id here as it seems to be used on the frontend
    title: string;
    company: string;
    status: string | null;
    url: string | null;
    last_edited_time?: Date | string | null;
    description?: string | null;
    type?: string | null;
    priority?: string | null;
    dateIdentified?: string | null; // ISO 8601 date string
    tags?: string[];
    nextActionDate?: string | null; // ISO 8601 date string
    // Add other properties as needed based on your Notion DB
}

// Helper type for mapping data to Notion API property format
export interface NotionPageProperties {
    [key: string]: any; // Allow any key with any value for flexibility, but be mindful of Notion API expected types
    // Example structure for known properties:
    // 'Opportunity Title'?: { title: [{ text: { content: string } }] };
    // 'Company or Institution'?: { rich_text: [{ text: { content: string } }] };
    // 'Status'?: { select: { name: string } };
    // etc.
}

/**
 * Detailed evaluation output for an opportunity, as generated by the LLM.
 */
export interface EvaluationOutput {
    fitScorePercentage: number; // 0-100
    alignmentHighlights?: string[]; // Key points of alignment
    gapAnalysis?: string[]; // Areas of discrepancy or missing skills
    riskRewardAnalysis?: RiskRewardAnalysis; // Risk/Reward breakdown
    recommendation: "Pursue" | "Delay & Prepare" | "Reject" | "Consider Further" | string;
    reasoning: string; // LLM's explanation for its recommendation and fit score
    suggestedNextSteps?: string[]; // Actionable steps
    supportingContext?: string[]; // Memory snippets or web research summaries
    pros?: string[]; // Key advantages
    cons?: string[]; // Key disadvantages
    missingSkills?: string[]; // Skills to develop
    scoreExplanation?: string; // Optional explanation for the score
    rawOutput?: string; // If LLM output was not valid JSON, store raw text
}

/**
 * Risk/Reward analysis for an opportunity evaluation.
 */
export interface RiskRewardAnalysis {
    risks: string[];
    rewards: string[];
    riskLevel: "Low" | "Moderate" | "High" | string;
    rewardLevel: "Low" | "Moderate" | "High" | string;
    notes?: string;
}

export interface CVComponent {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  targetRoleTags: string[];
  type: "CV";
}
