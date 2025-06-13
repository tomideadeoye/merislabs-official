/**
 * Types for the Narrative Clarity Studio feature
 */

/**
 * Represents a narrative document
 */
export interface NarrativeDocument {
  id: string;
  title: string;
  type: NarrativeType;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Types of narrative documents
 */
export type NarrativeType =
  | 'personal_bio'
  | 'linkedin_summary'
  | 'vision_statement'
  | 'elevator_pitch'
  | 'cover_letter'
  | 'personal_statement'
  | 'custom';

/**
 * Career arc milestone
 */
export interface CareerMilestone {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  organization?: string;
  startDate?: string;
  endDate?: string;
  skills?: string[];
  impact?: string;
  order?: number;
  achievements?: string[];
}

/**
 * Value proposition components
 */
export interface ValueProposition {
  id?: string;
  coreStrengths?: string[];
  uniqueSkills?: string[];
  passions?: string[];
  vision?: string;
  targetAudience?: string;
  valueStatement?: string;
  updatedAt?: string;
}

/**
 * Request to generate narrative content
 */
export interface NarrativeGenerationRequest {
  narrativeType: NarrativeType;
  valueProposition?: Partial<ValueProposition>;
  careerMilestones?: CareerMilestone[];
  tone?: 'professional' | 'conversational' | 'visionary' | 'academic';
  length?: 'brief' | 'standard' | 'detailed';
  additionalContext?: string;
  specificRequirements?: string;
}

/**
 * Response from narrative generation
 */
export interface NarrativeGenerationResponse {
  id: string;
  narrativeType: NarrativeType;
  content: string;
  suggestedTitle: string;
  relevantMemories?: any[];
  createdAt: string;
}
