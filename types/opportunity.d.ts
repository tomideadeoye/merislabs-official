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
  alignmentHighlights: string[];
  gapAnalysis: string[];
  riskRewardAnalysis: any;
  suggestedNextSteps: string[];
  rawOutput?: string;
}

// Draft Application Types
export interface OpportunityInputData {
  title: string;
  company: string;
  description: string;
  tags?: string[];
}

export interface ApplicantProfileInputData {
  name: string;
  backgroundSummary: string;
  keySkills: string[];
  goals: string;
  location?: string;
  values?: string[];
}

export interface EvaluationSummaryInputData {
  fitScorePercentage?: number;
  alignmentHighlights?: string[];
  gapAnalysis?: string[];
  riskRewardAnalysis?: string;
  suggestedNextSteps?: string[];
}

export interface MemorySnippetInputData {
  content: string;
  tags?: string[];
  date?: string;
}

export interface DraftApplicationRequestBody {
  opportunity: OpportunityInputData;
  applicantProfile: ApplicantProfileInputData;
  evaluationSummary?: EvaluationSummaryInputData;
  memorySnippets?: MemorySnippetInputData[];
  numberOfDrafts?: number;
}

export interface DraftApplicationResponseBody {
  success: boolean;
  drafts?: string[];
  error?: string;
  details?: string;
  modelUsed?: string;
}