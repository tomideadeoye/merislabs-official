/**
 * Types for the Opportunity Evaluator feature
 */

export interface OpportunityDetails {
  title: string;
  description: string;
  type: 'job' | 'education' | 'project' | 'other';
  url?: string;
}

export interface EvaluationOutput {
  fitScorePercentage: number;
  alignmentHighlights: string[];
  gapAnalysis: string[];
  riskRewardAnalysis: {
    highRiskHighReward?: string;
    lowRiskHighReward?: string;
    highRiskLowReward?: string;
    lowRiskLowReward?: string;
  };
  recommendation: 'Pursue' | 'Delay & Prepare' | 'Reject' | 'Consider Further';
  suggestedNextSteps: string[];
  reasoning: string;
  relevantPastExperiences?: { 
    source_id: string;
    text_snippet: string;
    relevance_note: string;
  }[];
}