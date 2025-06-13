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
