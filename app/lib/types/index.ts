/**
 * GOAL: This is the single source of truth for all shared type definitions.
 * It exports everything from the other type files in this directory.
 *GOAL:
 * RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
 * Canonical Orion types are in './orion'.
 * Generic/legacy opportunity types are in './opportunity' and use the 'Generic' prefix.
 */

// Explicitly export types to avoid duplicate identifier errors
export * from './blocks';
export * from './habitica';
export * from './ideas';
export * from './insights';
export * from './llm';
export * from './narrative-clarity';
export * from './nav';
export * from './strategic-outreach';
export * from './memory';
export * from './email';
import type { HabiticaTask } from './habitica';

// NOTE: If any types were intended to be defined in ./orion.ts but that file does not exist,
// they should be moved here or to another appropriate file and exported directly.
// Goal:
// This file defines the core TypeScript interfaces and types used across the entire Orion simple nextjs project.
// It ensures type safety, consistency, and clear data structures for all features, from API responses to UI components.
//
// Relation to other files, functions and features:
// This file is imported by almost every other file in the `shared` package (via `index.ts`) and by many files in `apps/nextjs` and `packages/ui`.
// Changes here will affect type checking across the entire project.

export interface OrionOpportunity {
  id: string;
  title: string;
  company: string; // company or institution
  type?: OpportunityType | null;
  status?: OpportunityStatus | null;
  content?: string | null; // Job description or related content - Made optional and allows null
  url?: string | null; // Allow null
  tags?: string[] | null;
  dateIdentified?: string | null; // ISO date string - Allow null
  notes?: string | null; // Allow null to align with OpportunityNotionOutputShared
  contactPerson?: string;
  contactEmail?: string;
  stage?: string;
  attachments?: string[];
  companyOrInstitution?: string;
  relatedEvaluationId?: string | null; // Allow null
  sourceUrl?: string;
  nextActionDate?: string | null; // Allow null for nextActionDate
  priority?: OpportunityPriority | null;
  tailoredCv?: string;
  deadline?: string | null; // Explicitly allow null for deadline
  location?: string | null; // Explicitly allow null for location
  salary?: string | null; // Explicitly allow null for salary
  contact?: string | null; // Explicitly allow null for contact
  position?: string | null; // Explicitly allow null for position
  lastStatusUpdate?: string | null; // Allow null
  notionPageId?: string;
  createdAt?: string | null; // Allow null to align with OpportunityNotionOutputShared
  updatedAt?: string | null; // Allow null to align with OpportunityNotionOutputShared
  evaluationOutput?: EvaluationOutput | null; // Allow null here
  webResearchContext?: string | null; // Allow null to align with OpportunityNotionOutputShared
  pros?: string[] | null;
  cons?: string[] | null;
  missingSkills?: string[] | null;
  contentType?: string | null; // Allow null here to align with OpportunityNotionOutputShared
  lastEditedTime?: string | Date | null; // Explicitly allow null
  cvComponentSuggestions?: { component: string; reasoning: string }[];
  alignmentScore?: number | null | undefined; // Ensure optional and nullable
  actionableAdvice?: string[];
  [key: string]: unknown; // Changed from any to unknown for broader type safety
}

export enum OpportunityType {
  JOB = 'job',
  PROJECT = 'project',
  COLLABORATION = 'collaboration',
  GIG = 'gig',
  OTHER = 'other',
  EDUCATION_PROGRAM = 'educationProgram',
  PROJECT_COLLABORATION = 'projectCollaboration',
  FUNDING = 'funding',
  NEGOTIATING = 'negotiating',
  DECLINED = 'declined',
  APPLICATION_READY = 'applicationReady',
  OUTREACH_PLANNED = 'outreachPlanned',
  OUTREACH_SENT = 'outreachSent',
  OFFER_RECEIVED = 'offerReceived',
}

export enum OpportunityStatus {
  IDENTIFIED = 'identified',
  RESEARCHING = 'researching',
  APPLYING = 'applying',
  INTERVIEWING = 'interviewing',
  OFFERED = 'offered',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  ARCHIVED = 'archived',
  EVALUATING = 'evaluating',
  EVALUATED_POSITIVE = 'evaluatedPositive',
  APPLICATION_DRAFTING = 'applicationDrafting',
  INTERVIEW_SCHEDULED = 'interviewScheduled',
  APPLIED = 'applied',
  PURSUING = 'pursuing',
  NEGOTIATING = 'negotiating',
  DECLINED = 'declined',
  APPLICATION_READY = 'applicationReady',
  OUTREACH_PLANNED = 'outreachPlanned',
  OUTREACH_SENT = 'outreachSent',
  OFFER_RECEIVED = 'offerReceived',
  APPLYING_NEXT_STEP = 'applyingNextStep',
  INTERVIEWING_ROUND_1 = 'interviewingRound1',
  INTERVIEWING_ROUND_2 = 'interviewingRound2',
  FINAL_INTERVIEW = 'finalInterview',
  OFFER_RECEIVED_PENDING_REVIEW = 'offerReceivedPendingReview',
  OFFER_ACCEPTED = 'offerAccepted',
  OFFER_REJECTED = 'offerRejected',
  ACTIVE_OUTREACH = 'activeOutreach',
  FOLLOW_UP = 'followUp',
  ON_HOLD = 'onHold',
  CONVERTED = 'converted',
}

export enum OpportunityPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export type OpportunityFilterStatus = OpportunityStatus | 'all';
export type OpportunityFilterType = OpportunityType | 'all';
export type OpportunityFilterPriority = OpportunityPriority | 'all';

export interface OrionOpportunityDetails extends OrionOpportunity {
  evaluation?: EvaluationOutput;
  // Add any other detailed fields here
}

export interface OpportunityEvaluationInput {
  title: string;
  description: string; // Corresponds to 'content' in the UI component
  type: OpportunityType;
  url?: string;
}

export interface EvaluationOutput {
  overallFitScore: number;
  summary: string;
  strengths: { title: string; reasoning: string }[];
  gaps: { skill: string; reasoning: string }[];
  suggestedCvComponents: { component: string; reasoning: string }[];
  suggestedNextSteps: string[];
  alignmentHighlights: { title: string; reasoning: string }[];
  gapAnalysis: { skill: string; reasoning: string }[];
  fitScorePercentage: number;
  recommendation?: 'Proceed' | 'Caution' | 'Not Evaluated';
  reasoning?: string;
  riskRewardAnalysis?: {
    potentialRewards: string;
    potentialRisks: string;
    timeInvestment: string;
    financialConsiderations: string;
    careerImpact: string;
  };
  supportingContext?: string[];
  // Additional properties found in errors:
  overallAnalysis?: string;
  potentialRecommendations?: string[];
  fitScoreExplanation?: string;
  cvComponentSuggestions?: { component: string; reasoning: string }[];
  alignmentScore?: number | null | undefined; // Ensure optional and nullable
  pros?: string[] | null;
  cons?: string[] | null;
  actionableAdvice?: string[];
}

export interface UserProfileData {
  name: string;
  email: string;
  bio: string;
  skills: string[];
  experience: string[];
  education: string[];
  interests: string[];
  values: string[];
  goals: string[];
  socialLinks: { platform: string; url: string }[];
  contactInfo: { phone?: string; address?: string };
  summary?: string; // Added based on WhatsAppReplyDrafter error
  profileText?: string;
  source?: string; // Used in evaluation/route.ts
  backgroundSummary?: string;
  keySkills?: string[];
  location?: string; // Used in draft-application/route.ts
}

/**
 * Request body for drafting an application.
 */
export interface DraftApplicationRequestBody {
  opportunityId: string;
  cvComponents: string[];
  jobDescription: string;
  orionOpportunity: OrionOpportunity;
  applicantProfile: UserProfileData;
  evaluationSummary: EvaluationOutput;
  memorySnippets: ScoredMemoryPoint[];
  numberOfDrafts?: number;
  // Additional properties found in errors:
  backgroundSummary?: string;
  keySkills?: string[];
  location?: string;
  opportunityDetails?: string;
}

/**
 * Response body for drafting an application.
 */
export interface DraftApplicationResponseBody {
  draftContent?: string;
  message: string;
  success: boolean;
  // Additional properties found in errors:
  drafts?: string[]; // Used in draft-application/route.ts
  error?: string; // Used in draft-application/route.ts
  details?: string; // Used in draft-application/route.ts
}

export interface SearchMemoryResponse {
  success: boolean;
  query?: string;
  results?: ScoredMemoryPoint[];
  error?: string;
}

export interface GenerateLLMResponse {
  generatedText: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface NarrativeDocument {
  id: string;
  title: string;
  content: string;
  type: NarrativeType;
  createdAt: string;
  updatedAt: string;
  // Add any other relevant narrative document properties as needed
}

export interface ValueProposition {
  id: string;
  title: string;
  content: string;
  // Add these based on usage in narrative/generate/route.ts
  coreStrengths?: string[];
  uniqueSkills?: string[];
  passions?: string[];
  vision?: string;
  targetAudience?: string;
  valueStatement?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerMilestone {
  id: string;
  order: number;
  title: string;
  achievements: string[];
  organization?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  skills?: string[];
  impact?: string;
  unique_id?: string;
  notionPageId?: string;
}

export interface JournalEntryNotionInput {
  title: string;
  content: string;
  date: string | Date;
  tags?: string[];
  contentType?: string;
  notionPageId?: string;
  mood?: string;
  reflectionId?: string;
  original_entry_id?: string;
  // Add other relevant journal properties as needed
}

export interface EmotionalLogEntry {
  id: string;
  timestamp: string;
  emotion: string;
  primaryEmotion: string;
  intensity: number;
  context: string;
  accompanyingThoughts?: string;
  contextualNote?: string;
  cognitiveDistortionAnalysis?: CognitiveDistortionAnalysisData;
  secondaryEmotions?: string[];
  triggers?: string[];
  physicalSensations?: string[];
  copingMechanismsUsed?: string[];
  relatedJournalSourceId?: string;
}

export interface MemoryPayload {
  text: string;
  source_id: string; // Corrected from sourceId to source_id for consistency with backend
  timestamp: string;
  indexedAt: string; // Timestamp of when the memory was indexed
  type: string;
  tags?: string[];
  mood?: string;
  original_entry_id?: string; // Corrected to snake_case for consistency with backend
  originalTaskText?: string;
  title?: string; // Add title to payload as needed
  [key: string]: unknown; // Allows for additional fields
}

export interface MemoryPoint {
  id: string;
  vector: number[];
  payload: MemoryPayload;
}

export interface ScoredMemoryPoint {
  id?: string;
  score: number;
  payload: MemoryPayload; // Use the harmonized MemoryPayload
  vector?: number[];
}

export interface QdrantFilterCondition {
  key: string;
  match: {
    value: string | number | boolean;
  };
}

export interface QdrantFilter {
  must?: QdrantFilterCondition[];
  should?: QdrantFilterCondition[];
  mustNot?: QdrantFilterCondition[];
}

export interface OpportunityUpdatePayload {
  title?: string;
  company?: string;
  companyOrInstitution?: string;
  type?: OpportunityType;
  status?: OpportunityStatus;
  content?: string;
  url?: string;
  sourceURL?: string;
  tags?: string[];
  dateIdentified?: string;
  notes?: string;
  contactPerson?: string;
  contactEmail?: string;
  stage?: string;
  attachments?: string[];
  evaluation?: EvaluationOutput;
  lastStatusUpdate?: string;
  priority?: OpportunityPriority;
  nextActionDate?: string;
  relatedEvaluationId?: string;
  addApplicationMaterialId?: string;
  removeApplicationMaterialId?: string;
  addStakeholderContactId?: string;
  removeStakeholderContactId?: string;
  addRelatedHabiticaTaskId?: string;
  removeRelatedHabiticaTaskId?: string;
}

export interface OpportunityCreatePayload {
  title: string;
  companyOrInstitution: string;
  type: OpportunityType;
  status: OpportunityStatus;
  content: string;
  url: string;
  tags: string[];
  dateIdentified: string;
  sourceUrl?: string;
  nextActionDate?: string;
  priority?: OpportunityPriority;
  tailoredCv?: string;
  deadline?: string | null;
  location?: string;
  salary?: string;
  contact?: string;
  position?: string;
  cvComponentSuggestions?: { component: string; reasoning: string }[];
  alignmentScore?: number | null | undefined;
  pros?: string[] | null;
  cons?: string[] | null;
  actionableAdvice?: string[];
}

export interface OpportunityNotionOutputShared extends OrionOpportunity {
  type?: OpportunityType | null;
  status?: OpportunityStatus | null;
  priority?: OpportunityPriority | null;
  content?: string | null; // Explicitly allow null for content
  tags?: string[] | null; // Explicitly allow null for tags
  pros?: string[] | null; // Explicitly allow null for pros
  cons?: string[] | null; // Explicitly allow null for cons
  missingSkills?: string[] | null; // Explicitly allow null for missingSkills
  notes?: string | null; // Explicitly allow null for notes
  relatedEvaluationId?: string | null; // Explicitly allow null
  lastStatusUpdate?: string | null; // Explicitly allow null
  deadline?: string | null; // Explicitly allow null for deadline
  location?: string | null; // Explicitly allow null for location
  contact?: string | null; // Explicitly allow null for contact
  position?: string | null; // Explicitly allow null for position
  lastEditedTime?: string | Date | null; // Explicitly allow null
  createdAt?: string | null; // Explicitly allow null
  updatedAt?: string | null; // Explicitly allow null
  evaluationOutput?: EvaluationOutput | null; // Allow null here
  webResearchContext?: string | null; // This was already correctly set in RawNotionOpportunityData, ensuring consistency
  contentType?: string | null; // Allow null here
  [key: string]: unknown; // Add index signature
}

export interface CVComponent {
  id: string;
  name: string;
  content: string;
  type: string;
  keywords?: string[];
  uniqueId?: string;
  notionPageId?: string;
  componentName?: string; // Used in load-cv-data/route.ts
  componentType?: string; // Used in load-cv-data/route.ts and NotionCVComponentsList.tsx
  contentPrimary?: string; // Used in load-cv-data/route.ts
  startDate?: string | null; // Used in load-cv-data/route.ts
  endDate?: string | null; // Used in load-cv-data/route.ts
  associatedCompanyInstitution?: string; // Used in load-cv-data/route.ts
}

export interface OpportunityNotionInput {
  title: string;
  companyOrInstitution: string;
  type: { name: string };
  status: { name: string };
  url: string;
  tags: { name: string }[];
  dateIdentified: { start: string };
  notes?: { type: 'text'; text: { content: string } }[];
  contactPerson?: { content: string }[];
  contactEmail?: { content: string }[];
  stage?: { name: string };
}

export interface NotionPageProperties {
  [key: string]: unknown; // Changed from any to unknown for broader type safety
}

export interface RiskRewardAnalysis {
  potentialRewards: string;
  potentialRisks: string;
  timeInvestment: string;
  financialConsiderations: string;
  careerImpact: string;
}

export interface EmotionalLog {
  id: string;
  timestamp: string;
  emotion: string;
  intensity: number;
  context: string;
  notes?: string;
}

export interface EmotionalTrend {
  emotion: string;
  trendData: { date: string; averageIntensity: number }[];
  analysis: string;
}

export interface MemoryEntry {
  id: string;
  timestamp: string;
  content: string;
  type: string;
  tags?: string[];
}

export interface CognitiveDistortionAnalysis {
  distortionId: string;
  distortionName: string;
  example: string;
  reframe: string;
}

// CognitiveDistortionId type definition (from src/types/orion.ts and src/lib/cbtConstants.ts)
export type CognitiveDistortionId =
  | 'allOrNothingThinking'
  | 'overgeneralization'
  | 'mentalFilter'
  | 'discountingThePositive'
  | 'jumpingToConclusions'
  | 'magnificationAndMinimization'
  | 'emotionalReasoning'
  | 'shouldStatements'
  | 'labelingAndMislabeling'
  | 'personalization';

export interface CognitiveDistortion {
  id: CognitiveDistortionId;
  name: string;
  description: string;
  example: string;
  reframe: string;
}

export interface CognitiveDistortionAnalysisData {
  situation: string;
  automaticThought: string;
  emotion: string;
  distortionIdentified: CognitiveDistortionId[];
  identifiedDistortions?: CognitiveDistortionId[];
  rationalResponse: string;
  outcome: string;
  alternativePerspective?: string;
  challengeToThought?: string;
}

export interface LogEmotionRequestBody {
  primaryEmotion: string;
  contextualNote: string;
  triggers?: string[];
  entryTimestamp: string;
  notes?: string;
  secondaryEmotions?: string[];
  intensity?: number;
  physicalSensations?: string[];
  accompanyingThoughts?: string;
  copingMechanismsUsed?: string[];
  relatedJournalSourceId?: string;
  cognitiveDistortionAnalysis?: CognitiveDistortionAnalysisData;
}

export interface EvaluationResult {
  status: 'success' | 'failure';
  message: string;
  details?: string;
  evaluationId?: string;
}

export interface Agent {
  id: string;
  role: string;
  goal: string;
  backstory: string;
  tools?: string[];
  verbose?: boolean;
  allowDelegation?: boolean;
}

export interface Task {
  id: string;
  description: string;
  agentId?: string;
  expected_output: string;
  tools?: string[];
  async?: boolean;
}

export interface Crew {
  id: string;
  name: string;
  description: string;
  agents: Agent[];
  tasks: Task[];
  verbose?: boolean;
  process?: 'sequential' | 'hierarchical';
}

export interface CrewManagerConfig {
  maxRetries?: number;
  retryDelayMs?: number;
  timeoutMs?: number;
}

export interface CrewTemplate {
  name: string;
  description: string;
  agentIds: string[];
  taskIds: string[];
  process?: 'sequential' | 'hierarchical';
}

export interface CrewExecutionResult {
  crewId: string;
  status: 'success' | 'failure' | 'in_progress';
  output?: string;
  error?: string;
  startTime: string;
  endTime?: string;
}

export interface CrewProcessConfig {
  process: 'sequential' | 'hierarchical';
  stepCallbacks?: { [stepName: string]: string };
}

export type NarrativeType =
  | 'journalReflection'
  | 'opportunitySummary'
  | 'emotionalAnalysis'
  | 'custom'
  | 'personalBio'
  | 'valueProposition'
  | 'careerMilestones'
  | 'reflection';

export type NarrativeTone = 'formal' | 'informal' | 'empathetic' | 'analytical' | 'persuasive' | 'professional';

export type NarrativeLength = 'short' | 'medium' | 'long' | 'standard';

export interface NarrativeGenerationRequest {
  narrativeType: NarrativeType;
  opportunityId?: string;
  journalEntryId?: string;
  emotionalLogId?: string;
  memoryQuery?: string;
  tone?: NarrativeTone;
  length?: NarrativeLength;
  valueProposition?: ValueProposition;
  careerMilestones?: CareerMilestone[];
  additionalContext?: string;
  specificRequirements?: string;
}

export interface NarrativeGenerationResponse {
  id?: string;
  generatedNarrative: string;
  metadata?: Record<string, unknown>; // Changed from any to unknown for broader type safety
  // Additional properties found in errors:
  success?: boolean;
  message?: string;
  drafts?: string[];
  error?: string;
}

export type PipelineState =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'failed'
  | 'evaluating'
  | 'drafting'
  | 'outreaching'
  | 'interviewing'
  | 'offering';

export type KanbanStatus = OpportunityStatus;

export interface DetailedPipelineState {
  currentStep: string;
  completedSteps: string[];
  data: Record<string, unknown>;
  currentOpportunity: OrionOpportunity | null;
  evaluationResult: EvaluationOutput | null;
  stakeholders: Stakeholder[] | null;
  applicationAnswers: Record<string, unknown>;
  communications: Record<string, unknown>;
  customizationSuggestions: unknown | null;
  webContext: unknown | null;
  status: PipelineState;
}

export type EnabledSteps = Record<string, boolean>;

export interface OrionSessionState {
  lastActivityTimestamp: string;
  currentActiveFeature: string;
  userPreferences: Record<string, unknown>;
  agwApproachRadio?: string;
  agwGoalInput?: string;
  agwOutputText?: string;
  agwPrimaryModel?: string;
  askQAnswer?: string;
  askQInput?: string;
  askQModelApproach?: string;
  askQPrimaryModel?: string;
  askQProcessing?: boolean;
  atmNumResults?: number;
  atmPastedText?: string;
  atmSearchQuery?: string;
  atmSourceId?: string;
  atmTagsInput?: string;
  crewaiAvailable?: boolean;
  currentMood?: string;
  dcCommType?: string;
  dcContext?: string;
  dcContextOrTemplate?: string;
  dcDraft?: string;
  dcDraftOrOptions?: string;
  dcGenerating?: boolean;
  dcModelApproach?: string;
  dcNumOptions?: number;
  dcPrimaryModel?: string;
  dcRecipients?: string;
  dcSaveTagsInput?: string;
  dcTopic?: string;
  dcUserContext?: string;
  enabledStepsPipeline?: Record<string, boolean>;
  habiticaApiToken?: string;
  habiticaUserId?: string;
  journalModelApproach?: string;
  journalPrimaryModel?: string;
  journalProcessing?: boolean;
  journalReflection?: string;
  journalShowSaveForm?: boolean;
  journalText?: string;
  llmConfigured?: boolean;
  memoryInitialized?: boolean;
  mmBroadSearchQuery?: string;
  mmDetailedSearchQuery?: string;
  mmEmailDraft?: string;
  mmGeneratingEmail?: boolean;
  mmGeneratingLinkedinMessage?: boolean;
  mmLinkedinMessageDraft?: string;
  mmOpportunitySearchResults?: unknown[];
  mmOpportunitySelectedStakeholders?: unknown[];
  mmOpportunitySearchTerm?: string;
  mmProcessingOpportunitySearch?: boolean;
  mmQdrantResults?: unknown[];
  mmSearchMode?: string;
  mmSemanticSearchEnabled?: boolean;
  mmSelectedOpportunityStakeholders?: unknown[];
  mmSelectedOpportunityUrl?: string;
  mmSemanticSearchTerm?: string;
  mmSourceFilter?: string;
  mmTagFilter?: string;
  notificationSettingsEmailEnabled?: boolean;
  notificationSettingsPushEnabled?: boolean;
  notionDbConfigured?: boolean;
  notionApiKey?: string;
  openaiApiKey?: string;
  opportunityCreateProcessing?: boolean;
  opportunityCurrentAnalysisSummary?: string;
  opportunityDetailsFetched?: boolean;
  opportunityEvaluationFeedback?: string;
  opportunityEvaluationProcessing?: boolean;
  opportunityEvaluationResult?: unknown;
  opportunityEvaluationSuggestions?: string;
  opportunityEvalSectionVisible?: boolean;
  opportunityIsSaving?: boolean;
  opportunityLastSavedAt?: string;
  opportunityNotes?: string;
  opportunityReasonsToPursues?: string;
  opportunityReasonsToSkip?: string;
  opportunityRiskRewardAnalysis?: unknown;
  opportunitySelectedOpportunityId?: string;
  opportunityShowEvaluationResult?: boolean;
  opportunityShowSummaryFeedback?: boolean;
  opportunityTabCurrentTab?: string;
  qdrantApiKey?: string;
  qwAnswer?: string;
  qwContext?: string;
  qwEmailDraft?: string;
  qwGeneratingEmail?: boolean;
  qwGeneratingLinkedinMessage?: boolean;
  qwLinkedinMessageDraft?: string;
  qwModelApproach?: string;
  qwPrimaryModel?: string;
  qwProcessing?: boolean;
  qwQuestionInput?: string;
  qwSaveTagsInput?: string;
  showCbtForm?: boolean;
  showJournalEntryForm?: boolean;
  showSaveOptions?: boolean;
  showWhatsappDrafter?: boolean;
  whatsappDrafterContext?: string;
  whatsappDrafterDraft?: string;
  whatsappDrafterGenerating?: boolean;
  whatsappDrafterModelApproach?: string;
  whatsappDrafterPrimaryModel?: string;
  whatsappDrafterRecipient?: string;
  whatsappDrafterSaveTagsInput?: string;
  whatsappDrafterSentiment?: string;
  whatsappDrafterTone?: string;
  whatsappDrafterTopic?: string;
  whatsappDrafterUserContext?: string;
  whatsappDrafterWordCount?: number;
  workflowCurrentStep?: number;
  workflowExecutionLog?: unknown[];
  workflowIsRunning?: boolean;
  workflowLastError?: string;
  workflowProgress?: number;
  workflowStatus?: string;
  mmBrowseModel?: string;
  mmCrudModel?: string;
  mmOpRadio?: string;
  mmRawInput?: string;
  moodNote?: string;
  narrativeContent?: string;
  narrativeContext?: string;
  narrativeGenerating?: boolean;
  narrativeLength?: NarrativeLength;
  narrativeRequirements?: string;
  narrativeTitle?: string;
  narrativeTone?: NarrativeTone;
  narrativeType?: NarrativeType;
  networkingModelApproach?: string;
  networkingPrimaryModel?: string;
  networkingQuery?: string;
  networkingRoles?: string[];
  outreachDraft?: string;
  outreachGenerating?: boolean;
  outreachGoal?: string;
  outreachOpportunity?: string;
  outreachTone?: string;
  outreachType?: string;
  pipelineState?: DetailedPipelineState;
  pipelineStep?: string;
  processedStakeholdersNet?: unknown[];
  routinesMorningCompleted?: boolean;
  routinesExecutionStatus?: string;
  routinesLastRun?: string;
  routinesScrapedLinks?: string[];
  sessionStateInitialized: boolean;
  siDescriptionInput?: string;
  siFeatureInput?: string;
  siFeedbackType?: string;
  siImprovementSuggestions?: string;
  stakeholdersListNet?: unknown[];
  tomidesProfileData?: UserProfileData | null;
  userName?: string;
  voicePreference?: string;
  whGeneratedResponse?: string;
  whTemplateInput?: string;
  modelApproachPipeline?: string;
  routinesEveningCompleted?: boolean;
}

export type SessionStateKeys = keyof OrionSessionState;

export interface IdentifiedPattern {
  id: string;
  type: string;
  description: string;
  confidence: number;
  supportingMemories: ScoredMemoryPoint[];
  // Additional properties found in errors:
  theme?: string;
  sentiment?: string;
  supportingMemoryIds?: string[];
  actionableInsight?: string;
  [key: string]: unknown; // Add index signature
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  traits: string[];
  goals: string[];
  email?: string;
  role?: string;
  company?: string;
  industry?: string;
  interests?: string[];
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  values?: string[];
  challenges?: string[];
  valueProposition?: string;
  [key: string]: unknown; // Add index signature
}

export interface Stakeholder {
  id: string;
  name: string;
  title: string;
  company: string;
  email?: string;
  linkedinUrl?: string;
  role?: string;
}

export interface OutreachRequest {
  opportunityId?: string; // Made optional as not always tied to an opportunity
  stakeholder?: string; // Made optional
  outreachType?: 'email' | 'linkedin'; // Made optional
  personalizationContext?: string; // Made optional
  persona: Persona;
  outreachGoal: string;
  messageType: 'email' | 'linkedin' | 'whatsapp';
  tone: 'professional' | 'friendly' | 'formal' | 'casual' | 'persuasive' | 'curious';
  length: 'short' | 'standard' | 'detailed';
  specificContext?: string;
  callToAction?: string;
  userProfile: UserProfileData;
}

export interface OutreachResponse {
  draft: string;
  success: boolean;
  message: string;
  error?: string;
}

export interface ActivityWatchStorage {
  id: string;
  timestamp: string;
  event: string;
  data: Record<string, unknown>;
}

export interface AnalyticsSnapshot {
  date: string;
  totalTimeSpent: number;
  topApplications: { name: string; time: number }[];
  topCategories: { name: string; time: number }[];
  summary: {
    productivityScore: number;
    byCategory: Record<string, number>;
    anomalies: unknown[];
  };
}

export interface MemorySearchOptions {
  query: string;
  filter?: QdrantFilter;
  limit?: number;
  withVectors?: boolean;
}

export interface AddTaskFromReflectionProps {
  suggestedTask?: string;
  onTaskAdded: () => void;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export interface HabiticaUserStats {
  hp: number;
  maxHealth: number;
  exp: number;
  toNextLevel: number;
  lvl: number;
  gp: number;
  per: number; // Perception
  int: number; // Intelligence
  str: number; // Strength
  con: number; // Constitution
  points: number;
  // Add other relevant user stats
}

export interface LLMResponseSuccess {
  success: true;
  content: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMResponseFailure {
  success: false;
  error?: string;
}

export type CombinedLLMResponse = LLMResponseSuccess | LLMResponseFailure;

export interface SendEmailResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: string;
  messageId?: string;
}

export interface UserProfileFetchResponse {
  success: boolean;
  profileText?: string | null;
  profile?: UserProfileData | null;
  error?: string;
  source?: 'notion' | 'local';
}

export interface EmailResponse {
  success: boolean;
  message: string;
  details?: unknown; // Changed from any to unknown
}

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  metadata?: Record<string, unknown>;
}

export type BlockType = 'text' | 'image' | 'video' | 'audio' | 'code' | 'other';

export const BLOCK_TYPES: BlockType[] = ['text', 'image', 'video', 'audio', 'code', 'other'];

export interface CreateBlockPayload {
  type: BlockType;
  title: string;
  content: string;
  tags?: string[];
}

export interface HabiticaTodo {
  _id: string;
  text: string;
  notes?: string;
  priority: number;
  completed: boolean;
  dateCompleted?: string;
  // Add other properties as needed
}

export interface HabiticaDaily {
  _id: string;
  text: string;
  notes?: string;
  priority: number;
  completed: boolean;
  streak: number;
  // Add other properties as needed
}

export interface HabiticaHabit {
  _id: string;
  text: string;
  notes?: string;
  up: boolean;
  down: boolean;
  counterUp: number;
  counterDown: number;
  // Add other properties as needed
}

export interface HabiticaReward {
  _id: string;
  text: string;
  value: number;
  // Add other properties as needed
}

export interface HabiticaTaskCount {
  todos: number;
  dailys: number;
  habits: number;
  rewards: number;
}

export interface HabiticaStats {
  hp: number;
  maxHealth: number;
  exp: number;
  toNextLevel: number;
  lvl: number;
  gp: number;
  per: number; // Perception
  int: number; // Intelligence
  str: number; // Strength
  con: number; // Constitution
  points: number;
  tasks?: HabiticaTask[];
  taskCounts?: HabiticaTaskCount;
  todos?: HabiticaTodo[];
  dailys?: HabiticaDaily[];
  habits?: HabiticaHabit[];
  rewards?: HabiticaReward[];
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'new' | 'researching' | 'developing' | 'launched' | 'abandoned';
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  brainstormingNotes?: string;
}

export interface Insight {
  id: string;
  type: string;
  content: string;
  source?: string;
  timestamp: string;
  tags?: string[];
}

export interface LLMConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMRequest {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: 'text' | 'json_object';
}

export interface LLMToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface LLMToolOutput {
  tool_call_id: string;
  output: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: LLMToolCall[];
  tool_call_id?: string;
}

export interface LLMResponse {
  content: string;
  tool_calls?: LLMToolCall[];
}

export interface CreateChatCompletionRequest {
  messages: Message[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  tools?: {
    type: string;
    function: {
      name: string;
      description?: string;
      parameters: object;
    };
  }[];
  tool_choice?:
    | 'none'
    | 'auto'
    | {
        type: 'function';
        function: {
          name: string;
        };
      };
}

export interface CreateChatCompletionResponse {
  id: string;
  choices: {
    finish_reason: string;
    index: number;
    message: Message;
  }[];
  created: number;
  model: string;
  service_tier: string | null;
  system_fingerprint: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface LLMRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: 'text' | 'json_object';
}

export interface NarrativeClarityOutput {
  parsedValues: ValueProposition[];
  parsedMilestones: CareerMilestone[];
  overallSummary: string;
  suggestions: string[];
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: JSX.Element;
  label?: string;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface OpportunitySearchCriteria {
  query?: string;
  status?: OpportunityFilterStatus;
  type?: OpportunityFilterType;
  priority?: OpportunityFilterPriority;
  tags?: string[];
  minDateIdentified?: string;
  maxDateIdentified?: string;
  sortBy?: SortableOpportunityKeys;
  sortOrder?: SortOrder;
}

export type Filters = {
  status?: OpportunityFilterStatus;
  type?: OpportunityFilterType;
  priority?: OpportunityFilterPriority;
  tag?: string;
} & Omit<Partial<OrionOpportunityDetails>, 'status' | 'type' | 'priority'>;

export type SortOrder = 'asc' | 'desc';

export type SortableOpportunityKeys = keyof OrionOpportunity | 'dateIdentified' | 'priority' | 'status';

export interface Prompt {
  id: string;
  name: string;
  content: string;
  category: string;
  tags: string[];
}

export interface CustomPrompt {
  id: string;
  name: string;
  prompt: string;
  variables: string[];
}

export interface StrategicOutreachPlan {
  id: string;
  opportunityId: string;
  planDetails: string; // Markdown or rich text
  targetStakeholders: Stakeholder[];
  outreachMessages: {
    stakeholderId: string;
    type: 'email' | 'linkedin';
    draft: string;
    sent: boolean;
    sentDate?: string;
  }[];
  status: 'draft' | 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface StrategicOutreachExecutionResult {
  planId: string;
  success: boolean;
  message: string;
  errors?: string[];
  sentEmailsCount: number;
  sentLinkedInMessagesCount: number;
}
