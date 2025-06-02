export type OpportunityType = 'job' | 'project_collaboration' | 'education' | 'other'; // extend as needed

export type OpportunityStatus = 'not_started' | 'researching' | 'evaluating' | 'application_ready' | 'applied' | 'interview_scheduled' | 'offer_received' | 'rejected' | 'closed' | string;

export type OpportunityPriority = 'low' | 'medium' | 'high' | string;

export interface EvaluationOutput {
  fitScorePercentage: number;
  recommendation: string;
  pros: string[];
  cons: string[];
  missingSkills: string[];
  scoreExplanation: string;
}

export interface OpportunityNotionOutputShared {
  id: string;
  notion_page_id?: string;
  title: string;
  company: string;
  content?: string | null;
  description?: string | null;
  descriptionSummary?: string | null;
  type?: OpportunityType | null | string;
  status?: OpportunityStatus | null;
  priority?: OpportunityPriority | null;
  url?: string | null;
  jobUrl?: string | null;
  sourceURL?: string | null;
  deadline?: string | null;
  location?: string | null;
  salary?: string | null;
  contact?: string | null;
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  dateIdentified?: string | null;
  nextActionDate?: string | null;
  evaluationOutput?: EvaluationOutput | null;
  tailoredCV?: string | null;
  webResearchContext?: string | null;
  tags?: string[];
  pros?: string | null;
  cons?: string | null;
  missingSkills?: string | null;
  contentType?: string | null;
  relatedEvaluationId?: string | null;
  lastStatusUpdate?: string | null;
  companyOrInstitution?: string | null;
  last_edited_time?: string | Date | null;
}

export interface OpportunityDetails {
  id?: string;
  notion_page_id?: string;
  title: string;
  company?: string;
  content: string;
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
  pros?: string[];
  cons?: string[];
  missingSkills?: string[];
  contentType?: string;
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
