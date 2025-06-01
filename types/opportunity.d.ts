export type OpportunityType = 'job' | 'education_program' | 'project_collaboration' | 'funding' | 'other';

export type OpportunityStatus = 
  | 'identified'
  | 'researching'
  | 'evaluating'
  | 'evaluated_positive'
  | 'evaluated_negative'
  | 'application_drafting'
  | 'application_ready'
  | 'applied'
  | 'outreach_planned'
  | 'outreach_sent'
  | 'follow_up_needed'
  | 'follow_up_sent'
  | 'interview_scheduled'
  | 'interview_completed'
  | 'offer_received'
  | 'negotiating'
  | 'accepted'
  | 'rejected_by_them'
  | 'declined_by_me'
  | 'on_hold'
  | 'archived';

export type OpportunityPriority = 'high' | 'medium' | 'low';

export interface Opportunity {
  id: string;
  title: string;
  companyOrInstitution?: string;
  type: OpportunityType;
  status: OpportunityStatus;
  descriptionSummary?: string;
  dateIdentified: string;
  nextActionDate?: string;
  priority?: OpportunityPriority;
  sourceURL?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  relatedApplicationIds?: string[];
  relatedStakeholderIds?: string[];
  relatedNoteIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface OpportunityCreatePayload {
  title: string;
  companyOrInstitution?: string;
  type: OpportunityType;
  status: OpportunityStatus;
  descriptionSummary?: string;
  sourceURL?: string;
  tags?: string[];
  priority?: OpportunityPriority;
  nextActionDate?: string;
}

export interface OpportunityUpdatePayload {
  title?: string;
  companyOrInstitution?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  descriptionSummary?: string;
  sourceURL?: string;
  tags?: string[];
  priority?: OpportunityPriority;
  nextActionDate?: string;
  relatedEvaluationId?: string;
  relatedApplicationIds?: string[];
  relatedStakeholderIds?: string[];
  relatedNoteIds?: string[];
}

export interface RiskRewardAnalysis {
  potentialRewards?: string;
  potentialRisks?: string;
  timeInvestment?: string;
  financialConsiderations?: string;
  careerImpact?: string;
}

export interface EvaluationOutput {
  fitScorePercentage: number;
  recommendation: string;
  reasoning: string;
  alignmentHighlights: string[];
  gapAnalysis: string[];
  riskRewardAnalysis?: RiskRewardAnalysis;
  suggestedNextSteps: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  company: string;
  email?: string;
  phone?: string;
  linkedInUrl?: string;
  notes?: string;
  tags?: string[];
  opportunityId: string;
  createdAt: string;
  updatedAt: string;
}