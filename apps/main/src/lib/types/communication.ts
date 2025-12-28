/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Defines TypeScript interfaces for communication pattern analysis results.
 * @description These types are used to structure the input and output for the Communication Patterns Analyzer feature,
 *   ensuring type safety and consistency across the frontend and backend.
 *
 * FILEPATH: `app/lib/types/communication.ts`
 */

export interface RecurringPattern {
  name: string;
  description: string;
  frequency: 'High' | 'Medium' | 'Low';
  associatedParticipants?: string[];
  sentimentImpact: 'positive' | 'negative' | 'neutral';
  relatedMemories?: string[]; // IDs of memories used for analysis
}

export interface SuggestedStrategy {
  name: string;
  description: string;
  targetsPattern: string; // Name of the pattern this strategy addresses
  alignmentWithProfile: string; // How it aligns with Tomide's values/goals
  potentialOutcome: string;
  relatedMemoriesToReview?: string[]; // IDs of memories relevant to the strategy
}

export interface IndividualChatAnalysisSummary {
  chatIndex: number; // Index of the chat in the input array
  overallSentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  sentimentScore: number; // e.g., -1 to 1
  summary: string;
  // Add other relevant summary data per chat if the LLM provides it
}

export interface CommunicationPatternAnalysisResult {
  recurringPatterns: RecurringPattern[];
  suggestedStrategies: SuggestedStrategy[];
  overallCommunicationSummary: string;
  chatAnalysisSummaries?: IndividualChatAnalysisSummary[]; // New: Sentiment/summary per input chat
}
