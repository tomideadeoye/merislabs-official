// Define Orion-specific types

export interface EmotionalLog {
  id?: string;
  timestamp: string;
  mood: string;
  intensity: number;
  context: string;
  reflection?: string;
  tags?: string[];
}

export interface EmotionalTrend {
  mood: string;
  count: number;
  averageIntensity: number;
  timeOfDay: string[];
}

export interface MemoryEntry {
  text: string;
  source_id: string;
  timestamp: string;
  indexed_at: string;
  type: string;
  tags?: string[];
  mood?: string;
  original_entry_id?: string;
}

export type SessionStateKeys =
  | 'currentMood'
  | 'lastCheckin'
  | 'morningRoutineCompleted'
  | 'eveningRoutineCompleted'
  | 'userProfile'
  | 'habiticaCredentials'
  | 'notionCredentials';

export interface CognitiveDistortionAnalysis {
  thought: string;
  distortions: CognitiveDistortionId[];
  rational_response: string;
  balanced_thought: string;
  automaticThought?: string;
  challengeToThought?: string;
  alternativePerspective?: string;
  identifiedDistortions?: string[];
}

export type CognitiveDistortionId =
  | 'all_or_nothing'
  | 'catastrophizing'
  | 'emotional_reasoning'
  | 'fortune_telling'
  | 'labeling'
  | 'magnification'
  | 'mind_reading'
  | 'minimization'
  | 'mental_filter'
  | 'overgeneralization'
  | 'personalization'
  | 'should_statements'
  | 'jumping_to_conclusions'
  | 'disqualifying_the_positive';

export type CognitiveDistortionAnalysisData = CognitiveDistortionAnalysis;
