export interface ValueProposition {
  coreStrengths: string[];
  uniqueSkills: string[];
  passions: string[];
  vision: string;
  targetAudience: string;
  valueStatement: string;
}

export interface OrionOpportunity {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'completed';
  // Add other OrionOpportunity fields as needed
}

export interface OpportunityDetails extends OrionOpportunity {
  evaluationOutput?: EvaluationOutput;
  stakeholders?: Stakeholder[];
  // Add additional detailed fields
}

export interface EvaluationOutput {
  // Define evaluation output structure
}

export interface Stakeholder {
  name: string;
  role: string;
  company?: string;
  linkedin?: string;
}

export interface UserProfileData {
  // Define user profile structure
}

// Export types for React components
export type {
  PipelineState,
  EnabledSteps,
  OrionSessionState
} from './stateTypes';

// Export other shared types as needed
