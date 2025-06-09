export type OpportunityType = 'job' | 'education_program' | 'project_collaboration' | 'funding' | 'other';

export type OpportunityStatus = 'not_started' | 'researching' | 'evaluating' | 'application_ready' | 'applied' | 'interview_scheduled' | 'offer_received' | 'rejected' | 'closed' | string;

export type OpportunityPriority = 'low' | 'medium' | 'high' | string;

export interface EvaluationOutput {
  overallFitScore?: number;
  summary?: string;
  strengths?: string[];
  gaps?: string[];
  suggestedCvComponents?: string[];
  fitScorePercentage?: number;
  alignmentHighlights?: string[];
  gapAnalysis?: string[];
  riskRewardAnalysis?: RiskRewardAnalysis;
  recommendation?: string;
  reasoning?: string;
  suggestedNextSteps?: string[];
  supportingContext?: string[];
  pros?: string[];
  cons?: string[];
  missingSkills?: string[];
  scoreExplanation?: string;
  rawOutput?: string;
}

export interface RiskRewardAnalysis {
  potentialRewards?: string;
  potentialRisks?: string;
  timeInvestment?: string;
  financialConsiderations?: string;
  careerImpact?: string;
}

export interface OpportunityNotionOutputShared {
  id: string;
  notion_page_id?: string;
  title: string;
  companyOrInstitution: string;
  /** Alias for companyOrInstitution for backward compatibility */
  readonly company?: string;
  content?: string | null;
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
  pros?: string[] | null;
  cons?: string[] | null;
  missingSkills?: string[] | null;
  contentType?: string | null;
  relatedEvaluationId?: string | null;
  lastStatusUpdate?: string | null;
  last_edited_time?: string | Date | null;
}

export interface OpportunityDetails {
  id?: string;
  notion_page_id?: string;
  title: string;
  companyOrInstitution: string;
  /** Alias for companyOrInstitution for backward compatibility */
  readonly company?: string;
  content: string;
  type: OpportunityType;
  status?: OpportunityStatus;
  priority?: OpportunityPriority;
  url?: string;
  jobUrl?: string;
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
  title: string;
  companyOrInstitution: string;
  type: OpportunityType;
  /** Alias for companyOrInstitution for backward compatibility */
  readonly company: string;
}

export interface OpportunityCreatePayload {
  title: string;
  companyOrInstitution: string;
  /** Alias for companyOrInstitution for backward compatibility */
  company?: string;
  content: string;
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
  companyOrInstitution?: string;
  /** Alias for companyOrInstitution for backward compatibility */
  company?: string;
  content?: string;
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
  opportunity: {
    title: string;
    company: string;
    content: string;
    tags?: string[];
  };
  applicantProfile: {
    name: string;
    backgroundSummary: string;
    keySkills: string[];
    goals: string;
    location?: string;
    values?: string[];
  };
  evaluationSummary?: {
    fitScorePercentage?: number;
    alignmentHighlights?: string[];
    gapAnalysis?: string[];
    suggestedNextSteps?: string[];
  };
  memorySnippets?: Array<{
    date?: string;
    tags?: string[];
    content: string;
  }>;
  numberOfDrafts?: number;
}

export interface DraftApplicationResponseBody {
  success: boolean;
  drafts?: string[]; // Based on parsing logic, an array of strings
  error?: string;
  details?: string; // Based on usage for error details
  warning?: string; // Based on usage for parsing warnings
  modelUsed?: string; // Based on usage for model info
}
