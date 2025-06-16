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

export interface CareerMilestone {
  id?: string;
  notionPageId?: string;
  unique_id?: string;
  title?: string;
  component_name?: string;
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

export type NarrativeType =
  | 'personal'
  | 'professional'
  | 'growth'
  | 'reflection'
  | 'vision'
  | 'custom'
  | 'personal_bio'
  | 'linkedin_summary'
  | 'vision_statement'
  | 'elevator_pitch'
  | 'cover_letter'
  | 'personal_statement';

export interface NarrativeGenerationRequest {
  narrativeType: NarrativeType;
  context: string;
  length?: 'short' | 'medium' | 'long';
  tone?: 'formal' | 'informal' | 'professional' | 'creative';
  targetAudience?: string;
}

export interface NarrativeGenerationResponse {
  narrative: string;
  modelUsed?: string;
  tokensUsed?: number;
  generatedAt: string;
}
