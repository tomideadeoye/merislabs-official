/**
 * FILEPATH: `app/lib/types/index.ts`
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Serves as the **single source of truth** for all lib TypeScript type definitions and interfaces across the entire Orion project.
 *   - Centralizes the definition of data structures for API responses, UI component props, database models (via Prisma), and internal logic.
 *   - Ensures strict type safety, consistency, and clarity in data flow throughout the application.
 *   - Re-exports types from specialized type files within this directory (`./blocks`, `./habitica`, etc.) for easier consumption by other modules.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - **Canonical Orion Types**: Core application-specific types (e.g., `OrionOpportunity`, `CVComponent`, `EmotionalLogEntry`) are defined directly in this file or explicitly re-exported from sub-files.
 *   - **API Routes (`/api/orion/...`)**: All API request and response bodies rely heavily on the interfaces defined here.
 *   - **UI Components (`app/components/orion/...`)**: Components consume props typed by interfaces from this file.
 *   - **Prisma Integration (`@/generated/prisma`, `prisma/schema.prisma`)**: Prisma-generated types are often integrated or mirrored here for broader application use.
 *   - **lib Libraries (`app/lib/...`)**: Utility functions and services leverage these types for internal data handling.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that any new data structures or modifications to existing ones will be defined or updated in this central file.
 *   - Types are designed to be compatible with both frontend (React) and backend (Next.js API routes, Prisma) contexts.
 *   - `Prisma.JsonValue` is used for fields that can store arbitrary JSON structures, ensuring flexibility while maintaining type safety.
 *   - Explicit `null` and `undefined` allowances are made where database fields or API responses can legitimately be optional or absent.
 *
 * NOTES:
 *   - This file is crucial for maintaining the robustness and scalability of the Orion project by enforcing clear data contracts.
 *   - Regular review and updates are essential to reflect evolving data models and feature requirements.
 *   - The export strategy (`export * from ...`) simplifies imports for consumers but requires careful management to avoid naming conflicts.
 */

import { Prisma } from '@/generated/prisma';
import { MemoryMetadataPayload, ScoredMemoryPoint } from './memory';
import { CvAutoGenerateOutput } from './llm'; // Import the new type
import { TaskStatus, TaskPriority, TaskType } from '@prisma/client';

// Explicitly export types for isolatedModules compliance
export type * from './blocks';
// export type * from './habitica'; // Confirmed commented out or removed
export type * from './ideas';
export type * from './insights';
export type * from './llm';
export type * from './narrative-clarity';
export type * from './nav';
export type * from './strategic-outreach';
export type * from './memory';
export type * from './email';
export type * from './gamification';
export { TaskStatus, TaskPriority, TaskType } from '@prisma/client'; // Export Prisma enums directly

/**
 * @description Custom error class for handling application-specific errors with additional context
 * @why Provides structured error handling across the Orion system with status codes and error codes
 * @note Extends standard Error to enable proper instanceof checks and preserve stack traces
 *
 * @param message - Human-readable error description
 * @param statusCode - HTTP status code (400-599)
 * @param errorCode - Machine-readable error code (e.g. "VALIDATION_ERROR")
 * @param details - Additional error context for debugging
 * @param originalError - Original error that caused this exception
 */
export class HandledApplicationError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorCode: string,
    public readonly details?: unknown,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'HandledApplicationError';

    // Maintain proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HandledApplicationError);
    }
  }

  /**
   * @description Serialize error for API responses
   * @why Ensure consistent error format across all Orion APIs
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
      ...(this.originalError && { originalError: this.originalError.toString() }),
    };
  }
}

export interface LLMAPIKeyStatus {
  modelId: string;
  present: boolean;
  reason?: string;
}

// Define the structure for storing user-preferred models
export interface PreferredModels {
  globalDefault?: string;
  requestTypeOverrides?: Record<string, string | undefined>; // Allows specific overrides per request type
}

// Define the payload for updating LLM settings via API
export interface LlmSettingsPayload {
  globalDefaultModel?: string;
  requestTypeOverrides?: Record<string, string>; // Ensure this aligns with JSON storage
}

// NOTE: If any types were intended to be defined in ./orion.ts but that file does not exist,
// they should be moved here or to another appropriate file and exported directly.
// Goal:
// This file defines the core TypeScript interfaces and types used across the entire Orion simple nextjs project.
// It ensures type safety, consistency, and clear data structures for all features, from API responses to UI components.
//
// Relation to other files, functions and features:
// This file is imported by almost every other file in the `lib` package (via `index.ts`) and by many files in `apps/nextjs` and `packages/ui`.
// Changes here will affect type checking across the entire project.

export interface OrionOpportunity {
  id: string;
  title: string;
  company: string | null; // company or institution - Made nullable
  type: OpportunityType | null | undefined; // Made nullable and optional for Prisma compatibility
  status: OpportunityStatus | null | undefined; // Made nullable and optional for Prisma compatibility
  content: string | null; // Job description or related content - Made optional and allows null
  url: string | null; // Allow null
  tags: string[] | null; // Allow null
  dateIdentified: string | null; // ISO date string - Allow null
  notes: string | null; // Allow null to align with OpportunityNotionOutputlib
  contactPerson: string | null;
  contactEmail: string | null;
  stage: string | null;
  attachments: string[] | null;
  companyOrInstitution: string | null; // Assuming this maps to 'company' in Prisma, made nullable
  relatedEvaluationId: string | null; // Allow null
  sourceUrl: string | null;
  nextActionDate: string | null; // Allow null for nextActionDate
  priority: OpportunityPriority | null; // Allow null as per Prisma schema
  tailoredCv: string | null;
  deadline: string | null; // Explicitly allow null for deadline
  location: string | null; // Made nullable
  salary: string | null;
  contact: string | null;
  position: string | null; // Made nullable
  lastStatusUpdate: string | null; // Allow null
  notionPageId: string | null;
  createdAt: string; // Made required as per Prisma schema
  updatedAt: string; // Made required as per Prisma schema
  evaluationOutput: EvaluationOutput | null; // Allow null here
  webResearchContext: string | null; // Allow null to align with OpportunityNotionOutputlib
  pros: string[] | null;
  cons: string[] | null;
  missingSkills: string[] | null;
  contentType: string | null; // Allow null here to align with OpportunityNotionOutputlib
  lastEditedTime: string | Date | null; // Explicitly allow null
  cvComponentSuggestions: { component: string; reasoning: string }[] | null;
  alignmentScore: number | null | undefined; // Ensure optional and nullable
  actionableAdvice: string[] | null;
  applicationMaterialIds: string[] | null; // Changed to allow null for consistency with database
  [key: string]: unknown; // Changed from any to unknown for broader type safety
}

export enum OpportunityType {
  JOB = 'job', // Prisma schema uses lowercase for this specific enum
  PROJECT = 'project',
  COLLABORATION = 'collaboration',
  GIG = 'gig',
  OTHER = 'other',
  EDUCATION_PROGRAM = 'educationProgram',
  PROJECT_COLLABORATION = 'projectCollaboration',
  FUNDING = 'funding',
  NEGOTIATING = 'negotiating', // Note: Prisma schema has this as 'negotiating' (lowercase)
  DECLINED = 'declined', // Note: Prisma schema has this as 'declined' (lowercase)
  APPLICATION_READY = 'applicationReady', // Note: Prisma schema has this as 'applicationReady' (camelCase)
  OUTREACH_PLANNED = 'outreachPlanned', // Note: Prisma schema has this as 'outreachPlanned' (camelCase)
  OUTREACH_SENT = 'outreachSent', // Note: Prisma schema has this as 'outreachSent' (camelCase)
  OFFER_RECEIVED = 'offerReceived', // Note: Prisma schema has this as 'offerReceived' (camelCase)
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
  EVALUATED_POSITIVE = 'evaluatedPositive', // Matches Prisma @map value
  EVALUATED_NEGATIVE = 'evaluatedNegative', // Matches Prisma @map value
  APPLICATION_DRAFTING = 'applicationDrafting', // Matches Prisma @map value
  INTERVIEW_SCHEDULED = 'interviewScheduled', // Matches Prisma @map value
  INTERVIEW_COMPLETED = 'interviewCompleted', // Matches Prisma @map value
  APPLIED = 'applied',
  PURSUING = 'pursuing',
  NEGOTIATING = 'negotiating', // Matches Prisma value
  DECLINED = 'declined', // Matches Prisma value
  APPLICATION_READY = 'applicationReady', // Matches Prisma @map value
  OUTREACH_PLANNED = 'outreachPlanned', // Matches Prisma @map value
  OUTREACH_SENT = 'outreachSent', // Matches Prisma @map value
  FOLLOW_UP_NEEDED = 'followUpNeeded', // Matches Prisma @map value
  FOLLOW_UP_SENT = 'followUpSent', // Matches Prisma @map value
  OFFER_RECEIVED = 'offerReceived', // Matches Prisma @map value
  APPLYING_NEXT_STEP = 'applyingNextStep', // Matches Prisma @map value
  INTERVIEWING_ROUND_1 = 'interviewingRound1', // Matches Prisma @map value
  INTERVIEWING_ROUND_2 = 'interviewingRound2', // Matches Prisma @map value
  FINAL_INTERVIEW = 'finalInterview', // Matches Prisma @map value
  OFFER_RECEIVED_PENDING_REVIEW = 'offerReceivedPendingReview', // Matches Prisma @map value
  OFFER_ACCEPTED = 'offerAccepted', // Matches Prisma @map value
  OFFER_REJECTED = 'offerRejected', // Matches Prisma @map value
  ACTIVE_OUTREACH = 'activeOutreach', // Matches Prisma @map value
  FOLLOW_UP = 'followUp', // Matches Prisma value
  ON_HOLD = 'onHold', // Matches Prisma @map value
  CONVERTED = 'converted', // Matches Prisma value
  REJECTED_BY_THEM = 'rejectedByThem', // Matches Prisma @map value
  DECLINED_BY_ME = 'declinedByMe', // Matches Prisma @map value
}

export enum OpportunityPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
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

export interface EvaluationGapDetail {
  gap: string;
  solution: string;
}

export interface EvaluationOutput {
  overallFitScore: number;
  summary: string;
  strengths: { title: string; reasoning: string }[];
  gaps: (string | EvaluationGapDetail)[];
  suggestedCvComponents: { component: string; reasoning: string }[];
  suggestedNextSteps: string[];
  alignmentHighlights: { title: string; reasoning: string }[];
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
  id: string;
  userId: string;
  name: string | null;
  email: string | null;
  mobile: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  substack: string | null;
  slideshare: string | null;
  medium: string | null;
  discord: string | null;
  merisLabsLinkedin: string | null;
  bioPitchLink: string | null;
  youtube: string | null;
  language: string | null;
  location: string | null;
  backgroundSummary: string | null;
  keySkills: string[] | null;
  goals: string[] | null;
  values: string[] | null;
  profileText: string | null;
  bio: string | null;
  skills: string[] | null;
  experience: string[] | null;
  education: string[] | null;
  interests: string[] | null;
  socialLinks: { platform: string; url: string }[] | null;
  personalWebsite?: string | null; // Added missing property
  summary: string | null;
  createdAt: string;
  updatedAt: string;
  source?: 'neon' | 'cache' | 'none' | 'error' | 'external_service' | 'local' | 'notion'; // Updated source types to include local and notion
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
  success: boolean;
  drafts?: string[];
  modelUsed?: string;
  error?: string;
  details?: string;
  warning?: string;
  message?: string; // Added message property
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
  quantifiableResults?: string;
  lessonsLearned?: string;
  challengesFaced?: string;
  keyTakeaways?: string;
  associatedSkills?: string[];
  recognitionAwards?: string[];
  status?: 'planned' | 'in-progress' | 'completed' | 'on-hold';
}

export interface JournalEntryNotionInput {
  id?: string; // Add id as optional
  title: string;
  content: string;
  date: string | Date;
  tags?: string[];
  contentType?: string;
  notionPageId?: string;
  mood?: string;
  reflectionId?: string | null;
  original_entry_id?: string | null;
  createdAt?: string; // Add createdAt as optional
  updatedAt?: string; // Add updatedAt as optional
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
  contextualNote?: string | null;
  cognitiveDistortionAnalysis?: CognitiveDistortionAnalysisData;
  secondaryEmotions?: string[];
  triggers?: string[];
  physicalSensations?: string[];
  copingMechanismsUsed?: string[];
  relatedJournalSourceId?: string | null; // Allow null for consistency
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
  opportunityId?: string; // Added for PastOpportunitiesSection.tsx
  company?: string; // Added for PastOpportunitiesSection.tsx
  status?: string; // Added for PastOpportunitiesSection.tsx
  outcome?: string; // Added for PastOpportunitiesSection.tsx

  [key: string]: unknown; // Allows for additional fields
}

export interface MemoryPoint {
  id: string;
  vector: number[];
  payload: MemoryPayload;
}

export interface QdrantFilterCondition {
  key: string;
  match?: {
    value: string | number | boolean;
  };
  range?: {
    gte?: string | number;
    gt?: string | number;
    lte?: string | number;
    lt?: string | number;
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
  deadline?: string | null;
  location?: string | null;
  salary?: string | null;
  position?: string | null;
  tailoredCv?: string | null;
}

export interface OpportunityCreatePayload {
  title: string;
  companyOrInstitution?: string | null; // Make optional and nullable
  type?: OpportunityType | null | undefined; // Make optional, nullable, and undefined for Prisma compatibility
  status?: OpportunityStatus | null | undefined; // Make optional, nullable, and undefined for Prisma compatibility
  content?: string | null; // Maps to description in DB, optional and nullable
  url?: string | null;
  tags?: string[] | null; // Maps to requirements in DB, optional and nullable
  dateIdentified?: string | null;
  sourceUrl?: string | null;
  nextActionDate?: string | null;
  priority?: OpportunityPriority | null; // Make optional and nullable
  tailoredCv?: string | null;
  deadline?: string | null;
  location?: string | null; // Make optional and nullable
  salary?: string | null;
  contact?: string | null;
  position?: string | null; // Make optional and nullable
  cvComponentSuggestions?: { component: string; reasoning: string }[] | null;
  notes?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  stage?: string | null;
  attachments?: string[] | null;
  relatedEvaluationId?: string | null;
  lastStatusUpdate?: string | null;
  notionPageId?: string | null;
  applicationMaterialIds?: string[]; // Made optional, but must be string[] if present
}

export interface OpportunityNotionOutputlib {
  type?: OpportunityType | null;
  status?: OpportunityStatus | null;
  priority?: OpportunityPriority | null;
  content?: string | null; // Explicitly allow null for content
  tags?: string[] | null; // Explicitly allow null for tags
  pros?: string[] | null;
  cons?: string[] | null;
  missingSkills?: string[] | null;
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
  // Add all other properties from OrionOpportunity that are relevant to Notion output here, and mark them as optional/nullable if Notion provides them that way.
  id?: string;
  title?: string;
  company?: string;
  companyOrInstitution?: string;
  cvComponentSuggestions?: { component: string; reasoning: string }[] | null;
  alignmentScore?: number | null | undefined;
  actionableAdvice?: string[] | null;
  url?: string | null;
  dateIdentified?: string | null;
  contactPerson?: string | null;
  contactEmail?: string | null;
  stage?: string | null;
  attachments?: string[] | null;
  sourceUrl?: string | null;
  nextActionDate?: string | null;
  tailoredCv?: string | null;
  salary?: string | null;
  notionPageId?: string | null;
  [key: string]: unknown; // Add index signature
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
  accompanyingThoughts?: string[];
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
  userId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  type: TaskType;
  dueDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  steps: TaskStep[];
  relatedLinks?: string[];
  relatedPhoneNumbers?: string[];
  // No longer needed for Habitica integration
  // habiticaId?: string;
  // habiticaType?: 'todo' | 'daily' | 'habit' | 'reward';
  // habiticaCompleted?: boolean;
  // habiticaPriority?: number;
  // habiticaStreak?: number;
  // habiticaCounterUp?: number;
  // habiticaCounterDown?: number;
  // habiticaValue?: number;
  // origin?: 'orion' | 'habitica';
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
  dcRecipients?: string;
  dcSaveTagsInput?: string;
  dcTopic?: string;
  dcUserContext?: string;
  enabledStepsPipeline?: Record<string, boolean>;
  // habiticaApiToken?: string; // Removed
  // habiticaUserId?: string; // Removed
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
  company?: string;
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
  tool_calls?: LLMToolCall[];
  memoryResults?: ScoredMemoryPoint[];
  structuredResponse?: CvAutoGenerateOutput; // Added for structured LLM outputs like CV auto-generation
}

export interface LLMResponseFailure {
  success: false;
  error?: string;
  content?: string; // Add this line to include raw content on failure
  details?: string; // Added details property
}

export type CombinedLLMResponse = LLMResponseSuccess | LLMResponseFailure;

export interface SendEmailResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: string;
  messageId?: string;
}

/**
 * Defines the parameters required to create a new Habitica task.
 */
export interface HabiticaTaskCreationParams {
  text: string;
  type: 'todo' | 'daily' | 'habit' | 'reward'; // Explicitly define allowed task types
  notes?: string;
  date?: string; // ISO date string for due date for todos/dailies
  priority?: number; // Habitica priority scale, typically 0, 0.5, 1, 1.5, 2
  tags?: string[];
}

export interface HabiticaTaskUpdateParams {
  text?: string;
  notes?: string;
  priority?: number;
  tags?: string[];
  completed?: boolean;
  up?: boolean; // Add for Habitica habits
  down?: boolean; // Add for Habitica habits
}

export interface UserProfileFetchResponse {
  success: boolean;
  profileText?: string | null;
  profile?: UserProfileData | null;
  error?: string;
  source?: 'neon' | 'cache' | 'none' | 'error' | 'external_service' | 'local' | 'notion'; // Updated source types
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

export interface Idea {
  id: string;
  title: string;
  description?: string;
  status: 'new' | 'researching' | 'developing' | 'launched' | 'abandoned' | 'raw_spark';
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  brainstormingNotes?: string;
  dueDate?: string | null;
  priority?: string | null;
  userId?: string | null;
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
  id?: string; // Made optional to align with potential undefined values from LLM responses
  function: {
    name: string;
    arguments: string;
  };
  type: 'function'; // Explicitly add the type property as it's expected by the system
}

export interface LLMToolOutput {
  tool_call_id: string;
  output: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string | null; // Allow content to be null for tool_calls messages
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
  uniqueId: string;
  userId: string;
  name: string;
  content: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomPrompt {
  id: string;
  uniqueId: string;
  userId: string;
  name: string;
  content: string;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  prompt?: string;
  variables?: string[];
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

export interface LocalFileIndexRequest {
  action: 'index' | 'delete' | 'list';
  filePath: string;
}

export interface FilePath {
  name: string;
  path: string;
  type: 'file' | 'directory';
}

export interface LocalFileIndexResponse {
  success: boolean;
  message?: string;
  error?: string;
  files?: FilePath[];
  directories?: FilePath[];
  indexedPaths?: string[];
}

export interface LLMSequentialThinkingResponse {
  thought: string;
  nextThoughtNeeded?: boolean;
  thoughtNumber?: number;
  totalThoughts?: number;
  [key: string]: unknown; // Allow for additional properties from the API
}

export interface Contact {
  id: string;
  name: string;
  email: string | null;
  linkedinUrl: string | null;
  role: string | null;
  company: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown; // Allow for additional Notion properties
}

export interface CVComponentCreatePayload {
  name: string;
  type: string;
  content: Prisma.JsonValue; // Should be Prisma.JsonValue for structured data
  tags?: string[];
  userId: string;
  uniqueId?: string | null;
}

export interface RawCvComponentJsonData {
  'Component Name': string;
  'Component Type': string;
  'Content (Primary)': string;
  Keywords?: string[];
  'Target Role Tags'?: string[];
  'Associated Company/Institution'?: string;
  'Start Date'?: string;
  'End Date'?: string;
  'Quantifiable Result/Metric'?: string;
  UniqueID: string;
}

export interface ApiErrorResponse {
  name?: string;
  message: string;
  stack?: string;
  status?: number;
  data?: unknown; // Additional error data, if any
  rawContent?: string; // For API response errors that return raw content
}

export interface EvaluationApiResponse {
  success: boolean;
  evaluation?: EvaluationOutput;
  error?: string | ApiErrorResponse; // Allow error to be a string or a structured object
  rawContent?: string; // For parsing errors
  memoryResults?: ScoredMemoryPoint[]; // Changed to ScoredMemoryPoint[]
}

export interface LLMModelConfig {
  id: string; // Unique ID for the model (e.g., 'openai/gpt-4o', 'groq/llama3-70b-8192')
  name: string; // User-friendly display name (e.g., 'GPT-4o', 'Llama 3 70B')
  provider: string; // The LLM provider (e.g., 'openai', 'groq', 'google', 'mistral', 'cohere', 'together', 'lmstudio')
  supportsTools: boolean; // Whether the model supports tool calling
  supportsJson: boolean; // Whether the model supports JSON mode
}

export interface LLMTool {
  function: {
    name: string;
    description: string;
    parameters: object; // Assuming 'parameters' is an object for JSON schema
  };
  type: 'function'; // This will always be 'function' for LLM tools
}

export interface ProductivityStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  dailyGoalMet: boolean;
}

export interface AchievementBadge {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string | null;
  icon?: string;
  progress?: number;
  target?: number;
}

export interface TaskStep {
  id: string;
  stepNumber: number;
  prompt: string;
  generatedOptions: Prisma.JsonValue[];
  chosenAction?: string;
  chosenJustification?: string;
  toolCalls?: Prisma.JsonArray;
  memoryReferences?: Prisma.JsonArray;
  relatedLinks?: Prisma.JsonArray;
  relatedPhoneNumbers?: Prisma.JsonArray;
  finalLog?: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
}

export interface MemoryChunk {
  id: string;
  payload: {
    title: string;
    text: string;
    [key: string]: unknown; // Allow for other metadata in payload
  };
  [key: string]: unknown; // Allow for other top-level properties
}

export interface GamificationDashboardData {
  productivityStreak: ProductivityStreak;
  achievementBadges: AchievementBadge[];
  totalMemoryChunks: number;
  totalIdeas: number;
  totalOpportunitiesEvaluated: number;
}
