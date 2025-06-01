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