/**
 * @fileoverview Central export and aggregation point for Orion's core types, utilities, and services.
 * @process NOTE: After each sweep or batch of changes, always run `tsc --noEmit` to ensure all TypeScript errors are resolved.
 * @description This file is the main entry point for all shared types, utility functions, and service exports in the Orion application. It is designed to maximize simplicity, flexibility, and maintainability by providing a single, unified import source for the rest of the codebase.
 *
 * CRITICAL PRINCIPLES FOR THIS FILE & THE ENTIRE APP:
 *   - **All types are inferred from Prisma, with zero manual mapping or type mismatches.**
 *     - Why: This ensures that the application's types always match the database schema, eliminating the risk of type drift, runtime errors, or manual maintenance overhead. It also means that any schema change is automatically reflected in the app's types, making the system robust and future-proof.
 *     - How: All type exports (especially those related to data models) are imported directly from Prisma-generated types or from modules that themselves only use Prisma-inferred types. No manual type definitions or mappings are allowed for database entities.
 *     - NOTE: If you ever see a manual type for a database entity, it is a bug or technical debt and should be refactored to use Prisma inference.
 *   - **It is a personal project. I do not have to minimize data sent from backend.**
 *     - Why: For this project, developer velocity and simplicity are prioritized over network efficiency. Sending more data than strictly necessary is acceptable, as it reduces the need for complex data shaping or filtering logic.
 *     - NOTE: If you see large objects or "overfetching" in API responses, this is intentional and not a concern for this codebase.
 *
 * The design philosophy here is to:
 *   - Prioritize **simplicity**: All exports are aggregated here to reduce import complexity and cognitive load for developers.
 *   - Ensure **flexibility**: By centralizing exports and using TypeScript's type inference (especially from the database schema), the codebase can adapt to future changes with minimal friction.
 *   - Leverage **type inference from the database**: Types are inferred directly from the database schema (e.g., via Prisma), which ensures that the application remains type-safe and automatically adapts to schema changes, reducing manual type maintenance.
 *   - **Minimize type casting**: Type casting is avoided wherever possible to prevent runtime errors and to fully utilize TypeScript's static analysis for safety and performance.
 *   - Support **future-proof performance**: This structure allows for easy refactoring, extension, and optimization as the system grows, while maintaining high performance and type safety.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Serve as the single source of truth for all shared types, utility functions, and service exports in the Orion app.
 *   - Aggregate and re-export all relevant modules to ensure consistent usage and prevent pathing issues.
 *   - Directly support Orion's vision of a robust, maintainable, and scalable system by enforcing best practices in type safety, minimal type casting, and adaptability to database-driven changes.
 *   - Enable rapid development and onboarding by making the codebase easy to navigate and reason about.
 *
 * FILEPATH: app/index.ts
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - Re-exports types from `app/lib/types/index.ts` and other type modules, making them available throughout the app.
 *   - Aggregates utility functions and services from various `app/lib/` modules (e.g., `llm_providers`, `memory`, `narrative_service`).
 *   - Consumed by nearly all feature modules, API routes, and UI components that require shared types or utilities.
 *   - Ensures that all parts of the Orion system use consistent, up-to-date types and helpers, reducing duplication and errors.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that all type definitions are kept up-to-date with the database schema (e.g., via Prisma codegen).
 *   - Assumes that developers will avoid type casting unless absolutely necessary, relying on type inference for safety.
 *   - Assumes that all exports here are intended for public consumption by the rest of the app.
 *   - NOTE: Any deviation from these principles (e.g., manual type casting, ad-hoc type definitions, or attempts to minimize backend data) should be justified in code comments.
 *
 * NOTES:
 *   - This file is a critical part of Orion's maintainability strategy. By centralizing exports and enforcing type inference, it reduces the risk of type drift and import errors.
 *   - COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE: If additional utility or type modules are created, they should be aggregated here to maintain the single-source-of-truth pattern.
 *   - PERFORMANCE OPTIMIZATIONS: Centralized exports allow for easier tree-shaking and dead code elimination in production builds.
 *   - ERROR HANDLING ROBUSTNESS: By minimizing type casting and relying on type inference, the risk of runtime type errors is greatly reduced.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Consider automating the aggregation of exports to further reduce manual maintenance.
 *   - Explore stricter linting rules to enforce minimal type casting and promote type inference.
 *   - Implement additional tooling to detect and warn about any manual type casts or type mismatches.
 *   - Continue to monitor and refactor for simplicity and flexibility as the codebase evolves.
 */

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

// =========================
// TYPE EXPORTS (Aggregated)
// =========================
// Explicitly re-export types that are aggregated in app/lib/types/index.ts
export type {
  ApiErrorResponse,
  EvaluationApiResponse,
  LLMTool,
  UserProfileData,
  UserProfileFetchResponse,
  // INFER ALL BELOW FROM @/generated/prisma
  OpportunityEvaluationInput,
  EvaluationGapDetail,
  EvaluationOutput,
  EvaluationResult,
  RiskRewardAnalysis,
  OpportunitySearchCriteria,
  Filters,
  SortOrder,
  SortableOpportunityKeys,
  Agent,
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
export type { SendEmailParams, EmailAttachment } from './lib/types/email';

// =========================
// VALUE/FUNCTION EXPORTS
// =========================
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

// =========================
// ERROR HANDLING EXPORTS
// =========================
export { handleApiError, HandledApplicationError } from './lib/utils/errorHandler';

export { type AxiosError } from 'axios';
export { type ZodError } from 'zod';
