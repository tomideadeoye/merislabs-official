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
  | 'cover_letter';

export interface PipelineState {
  currentStep: string;
  completedSteps: string[];
  data: Record<string, any>;
}

export interface EnabledSteps {
  [key: string]: boolean;
}

export interface OrionSessionState {
  [key: string]: any;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  systemPrompt: string;
}

export interface Task {
  id: string;
  description: string;
  assignedTo: string;
  dependencies?: string[];
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  result?: any;
}

export interface Crew {
  id: string;
  name: string;
  agents: Agent[];
  tasks: Task[];
}

export interface CrewManagerConfig {
  maxRetries: number;
  timeout: number;
}

export interface CrewTemplate {
  name: string;
  description: string;
  agents: Partial<Agent>[];
  workflow: string[];
}

export interface CrewExecutionResult {
  success: boolean;
  output: any;
  errors?: string[];
}

export interface CrewProcessConfig {
  sequential: boolean;
  maxConcurrent?: number;
}