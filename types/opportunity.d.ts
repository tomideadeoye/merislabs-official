export type OpportunityType = 'job' | 'education_program' | 'project_collaboration' | 'funding' | 'other';
export type OpportunityStatus =
  | 'identified'
  | 'evaluating'
  | 'researching'
  | 'pursuing'
  | 'applied'
  | 'application_ready'
  | 'interviewing'
  | 'negotiating'
  | 'accepted'
  | 'rejected'
  | 'declined'
  | 'archived'
  | 'evaluated_positive'
  | 'application_drafting'
  | 'outreach_planned'
  | 'outreach_sent'
  | 'interview_scheduled'
  | 'offer_received';
export type OpportunityPriority = 'high' | 'medium' | 'low';

export interface OpportunityDetails {
  id?: string;
  title: string;
  company?: string;
  companyOrInstitution?: string;
  description: string;
  descriptionSummary?: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  sourceURL?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  dateIdentified?: string;
  nextActionDate?: string;
  evaluationOutput?: EvaluationOutput;
  tailoredCV?: string;
  webResearchContext?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  lastStatusUpdate?: string;
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
  pros?: string[];
  cons?: string[];
  missingSkills?: string[];
  scoreExplanation?: string;
}

export interface OpportunityCreatePayload {
  title: string;
  company?: string;
  companyOrInstitution?: string;
  description: string;
  descriptionSummary?: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  sourceURL?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  nextActionDate?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  lastStatusUpdate?: string;
}

export interface OpportunityUpdatePayload {
  title?: string;
  company?: string;
  companyOrInstitution?: string;
  description?: string;
  descriptionSummary?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  sourceURL?: string;
  deadline?: string;
  location?: string;
  salary?: string;
  contact?: string;
  notes?: string;
  tailoredCV?: string;
  webResearchContext?: string;
  nextActionDate?: string;
  tags?: string[];
  relatedEvaluationId?: string;
  lastStatusUpdate?: string;
  addApplicationMaterialId?: string;
  removeApplicationMaterialId?: string;
  addStakeholderContactId?: string;
  removeStakeholderContactId?: string;
  addRelatedHabiticaTaskId?: string;
  removeRelatedHabiticaTaskId?: string;
}

// Added types for Draft Application API based on usage in route.ts
export interface DraftApplicationRequestBody {
  opportunity: { // Using a nested structure based on usage
    title: string;
    company: string;
    description: string;
    tags?: string[];
  };
  applicantProfile: { // Using a nested structure based on usage
    name: string;
    backgroundSummary: string;
    keySkills: string[];
    goals: string;
    location?: string;
    values?: string[];
  };
  evaluationSummary?: { // Using a nested structure based on usage
    fitScorePercentage?: number;
    alignmentHighlights?: string[];
    gapAnalysis?: string[];
    suggestedNextSteps?: string[];
  };
  memorySnippets?: Array<{ // Based on usage, assuming an array of objects with these properties
    date?: string;
    tags?: string[];
    content: string; // Content seems to be a string
  }>;
  numberOfDrafts?: number; // Based on usage
}

export interface DraftApplicationResponseBody {
  success: boolean;
  drafts?: string[]; // Based on parsing logic, an array of strings
  error?: string;
  details?: string; // Based on usage for error details
  warning?: string; // Based on usage for parsing warnings
  modelUsed?: string; // Based on usage for model info
}
