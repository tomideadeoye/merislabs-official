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

export type OpportunityType = 
  | 'job'
  | 'education_program'
  | 'project_collaboration'
  | 'funding'
  | 'other';

export type OpportunityPriority = 'high' | 'medium' | 'low';

export interface Opportunity {
  id: string;
  title: string;
  companyOrInstitution: string;
  type: OpportunityType;
  status: OpportunityStatus;
  dateIdentified: string;
  nextActionDate?: string;
  priority?: OpportunityPriority;
  descriptionSummary?: string;
  sourceURL?: string;
  tags?: string[];
  notes?: string;
  lastStatusUpdate: string;
}

export interface OpportunityCreatePayload {
  title: string;
  companyOrInstitution: string;
  type: OpportunityType;
  status: OpportunityStatus;
  priority?: OpportunityPriority;
  descriptionSummary?: string;
  sourceURL?: string;
  tags?: string[];
  notes?: string;
}

export interface OpportunityUpdatePayload {
  title?: string;
  companyOrInstitution?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  nextActionDate?: string;
  priority?: OpportunityPriority;
  descriptionSummary?: string;
  sourceURL?: string;
  tags?: string[];
  notes?: string;
}

export interface OpportunityDetails {
  title: string;
  description: string;
  type: 'job' | 'education' | 'project' | 'other';
  url?: string;
}

export interface EvaluationOutput {
  fitScorePercentage: number;
  recommendation: string;
  reasoning: string;
  alignmentHighlights?: string[];
  gapAnalysis?: string[];
  riskRewardAnalysis?: {
    potentialRewards?: string;
    potentialRisks?: string;
    timeInvestment?: string;
    financialConsiderations?: string;
    careerImpact?: string;
  };
  suggestedNextSteps?: string[];
}

export interface ApplicantProfileInputData {
  name: string;
  backgroundSummary: string;
  keySkills: string[];
  goals: string;
  location?: string;
  values?: string[];
  experience?: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education?: {
    degree: string;
    institution: string;
    year: string;
  }[];
}

export interface DraftApplicationRequestBody {
  opportunity: {
    title: string;
    company: string;
    description: string;
    tags?: string[];
  };
  applicantProfile: ApplicantProfileInputData;
  evaluationSummary?: {
    fitScorePercentage?: number;
    alignmentHighlights?: string[];
    gapAnalysis?: string[];
    suggestedNextSteps?: string[];
  };
  memorySnippets?: {
    content: string;
    date?: string;
    tags?: string[];
  }[];
  numberOfDrafts?: number;
}

export interface DraftApplicationResponseBody {
  success: boolean;
  drafts?: string[];
  modelUsed?: string;
  warning?: string;
  error?: string;
  details?: string;
}