/**
 * @fileoverview Authentication Removal Note
 * @description This file is part of the ongoing effort to gradually remove all authentication from the Orion application.
 *   As a central application entry point or configuration file, its purpose will shift to accommodate
 *   an unauthenticated, local-first model.
 *   For detailed strategy, refer to `docs/authentication_removal_strategy.md`.
 *
 *   Original File Purpose:
 *   [Original file purpose comments from app/index.ts will follow below this section.]
 */
/**
 * CURRENT MODIFICATION RATIONALE:
 *   - This modification is a comprehensive refactoring aimed at resolving multiple TypeScript errors
 *     within this central `index.ts` file, specifically "Duplicate identifier" and "Re-exporting a type
 *     when 'isolatedModules' is enabled requires using 'export type'."
 *   - The core issue is an incorrect pattern of re-exporting types, leading to conflicts when `isolatedModules` is active.
 *   - The goal is to unify all type re-exports under a single, correct `export type { ... } } from './path'` structure,
 *     ensuring that all types are properly exposed without duplication or module resolution issues.
 *   - This refactoring is crucial for maintaining type safety and a clean build in the monorepo setup,
 *     and for providing a stable, unambiguous import source for types across the application.
 *   - It also aims to verify and correct all import paths for the types to ensure they are pointing to existing files.
 *
 * NOTE: This section documents the *specific changes currently being applied*, not the overall file purpose.
 * It will be updated or removed upon completion of the current task.
 */

/**
 * This file serves as a central export point for lib utilities and types within the Next.js application.
 * It is designed to ensure consistent imports and prevent pathing issues.
 *
 * For internal imports within this lib directory, prefer relative paths.
 * E.g., `import { someFunction } from './lib/someFile';`
 *
 * This file explicitly re-exports what is intended for consumption by other parts of the Next.js app.
 *
 * RELATION TO OTHER FILES, FUNCTIONS AND FEATURES:
 */

import { type ReadonlyURLSearchParams } from 'next/navigation';

// All specific internal type imports are removed to prevent duplication and centralize re-exports.
// These types will be re-exported from the main './lib/types' or their specific modules below.

// Explicitly re-export types that are aggregated in app/lib/types/index.ts
export type {
  ApiErrorResponse,
  EvaluationApiResponse,
  LLMTool,
  JournalEntryNotionInput,
  UserProfileData,
  UserProfileFetchResponse,
  OrionOpportunity,
  OpportunityType,
  OpportunityStatus,
  OpportunityPriority,
  OpportunityFilterStatus,
  OpportunityFilterType,
  OpportunityFilterPriority,
  OrionOpportunityDetails,
  OpportunityEvaluationInput,
  EvaluationGapDetail,
  EvaluationOutput,
  EvaluationResult,
  OpportunityUpdatePayload,
  OpportunityCreatePayload,
  OpportunityNotionOutputlib,
  OpportunityNotionInput,
  NotionPageProperties,
  RiskRewardAnalysis,
  OpportunitySearchCriteria,
  Filters,
  SortOrder,
  SortableOpportunityKeys,
  Agent,
  Task,
  Crew,
  CrewManagerConfig,
  CrewTemplate,
  CrewExecutionResult,
  CrewProcessConfig,
  NarrativeType,
  NarrativeTone,
  NarrativeLength,
  NarrativeGenerationRequest,
  NarrativeGenerationResponse,
  NarrativeClarityOutput,
  PipelineState,
  KanbanStatus,
  DetailedPipelineState,
  EnabledSteps,
  OrionSessionState,
  SessionStateKeys,
  IdentifiedPattern,
  Insight,
  Persona,
  Stakeholder,
  OutreachRequest,
  OutreachResponse,
  StrategicOutreachPlan,
  StrategicOutreachExecutionResult,
  Contact,
  ActivityWatchStorage,
  AnalyticsSnapshot,
  AddTaskFromReflectionProps,
  InputProps,
  LLMResponseSuccess,
  LLMResponseFailure,
  CombinedLLMResponse,
  Message,
  LLMResponse,
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  LLMRequestOptions,
  SendEmailResponse,
  EmailResponse,
  Idea,
  NavItem,
  NavGroup,
  Prompt,
  CustomPrompt,
  LocalFileIndexRequest,
  FilePath,
  LocalFileIndexResponse,
  LLMSequentialThinkingResponse,
  RawCvComponentJsonData,
  CVComponentCreatePayload,
} from './lib/types';

// Specific re-exports for types defined in their own files or external modules
export type { CVComponent } from './lib/types/cv';
export type { JournalEntry } from '@/generated/prisma';
export type { ReadonlyURLSearchParams };
export type { SendEmailParams, EmailAttachment } from '@/types/email';

// Specific re-exports for values or functions (these imports were already in place)
export {
  PROVIDER_MODEL_CONFIGS,
  DEFAULT_GENERATION_PROVIDERS,
  SYNTHESIZER_PROVIDER,
  SYNTHESIZER_MODEL_ID,
  DEFAULT_LLM_TIMEOUT,
  DEFAULT_SYNTHESIZER_TIMEOUT,
  BROWSER_CONTEXT_MAX_CHARS,
  MIN_DRAFT_LENGTH,
  checkAllLlmApiKeys,
} from './lib/llm_providers';

export { useSessionState, initialState } from './lib/hooks/useSessionState';

export {
  type ActivityEvent,
  type CategorizedEvent,
  type ProductivitySummary,
  ActivityWatchProcessor,
} from './lib/activitywatch_processor';

export { ActivityWatchService } from './lib/activitywatch_service';

export { generateLLMResponse, REQUEST_TYPES } from './lib/orion_llm';

export {
  getOpportunityByIdFromDb,
  listOpportunitiesFromDb,
  createOpportunityInDb,
  updateOpportunityStatusInDb,
} from './lib/opportunity_db_service';

export { fetchUserProfile } from './lib/profile_service';

export {
  addMemory,
  searchMemory,
  findMemoriesByField,
  findMemoriesByType,
  findMemoriesByTag,
  initializeOrionMemory,
  findRelevantMemories,
} from './lib/memory';

export {
  createNarrativeDocument,
  getNarrativeDocuments,
  getNarrativeDocumentById,
  updateNarrativeDocument,
  deleteNarrativeDocument,
  getNarrativeDocumentsByType,
  saveCareerMilestone,
  getCareerMilestones,
  updateCareerMilestone,
  deleteCareerMilestone,
  saveValueProposition,
  getValueProposition,
} from './lib/narrative_service';

export {
  saveOrUpdateCvComponent,
  fetchAllCvComponents,
  deleteCvComponent,
  findCvComponentByUniqueId,
} from './lib/cv_components_db_service';

export { handleApiError, HandledApplicationError } from './lib/utils/errorHandler';

export { type AxiosError } from 'axios';
export { type ZodError } from 'zod';
