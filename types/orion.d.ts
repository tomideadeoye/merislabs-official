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