export type OpportunityType = 'job' | 'education_program' | 'project_collaboration' | 'funding' | 'other';
export type OpportunityStatus = 'identified' | 'evaluating' | 'pursuing' | 'applied' | 'interviewing' | 'negotiating' | 'accepted' | 'rejected' | 'declined' | 'archived';
export type OpportunityPriority = 'high' | 'medium' | 'low';

export interface OpportunityDetails {
  id?: string;
  title: string;
  company?: string;
  description: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  evaluationOutput?: EvaluationOutput;
  tailoredCV?: string;
  webResearchContext?: string;
  tags?: string[];
}

export interface Opportunity extends OpportunityDetails {
  id: string;
}

export interface EvaluationOutput {
  fitScorePercentage: number;
  recommendation: string;
  reasoning: string;
  alignmentHighlights?: string[];
  gapAnalysis?: string[];
  riskRewardAnalysis?: any;
  suggestedNextSteps?: string[];
  rawOutput?: string;
}

export interface OpportunityCreatePayload {
  title: string;
  company?: string;
  description: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
}

export interface OpportunityUpdatePayload {
  title?: string;
  company?: string;
  description?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  tailoredCV?: string;
  webResearchContext?: string;
  tags?: string[];
}

export interface DraftApplicationRequestBody {
  opportunityId: string;
  applicationType: 'cover_letter' | 'email' | 'message';
  customInstructions?: string;
}

export interface DraftApplicationResponseBody {
  success: boolean;
  draftContent?: string;
  error?: string;
}