/**
 * This file serves as a central export point for shared utilities and types within the Next.js application.
 * It is designed to ensure consistent imports and prevent pathing issues.
 *
 * For internal imports within this shared directory, prefer relative paths.
 * E.g., `import { someFunction } from './lib/someFile';`
 *
 * This file explicitly re-exports what is intended for consumption by other parts of the Next.js app.
 *
 * RELATION TO OTHER FILES, FUNCTIONS AND FEATURES:
 */

// Explicitly re-export types from the central type definition files
export {
  type OrionOpportunity,
  OpportunityType,
  OpportunityStatus,
  OpportunityPriority,
  type OrionOpportunityDetails,
  type OpportunityEvaluationInput,
  type EvaluationOutput,
  type UserProfileData,
  type DraftApplicationRequestBody,
  type DraftApplicationResponseBody,
  type SearchMemoryResponse,
  type GenerateLLMResponse,
  type NarrativeDocument,
  type ValueProposition,
  type CareerMilestone,
  type JournalEntryNotionInput,
  type EmotionalLogEntry,
  type MemoryPayload,
  type MemoryPoint,
  type ScoredMemoryPoint,
  type QdrantFilterCondition,
  type QdrantFilter,
  type OpportunityUpdatePayload,
  type OpportunityCreatePayload,
  type OpportunityNotionOutputShared,
  type CVComponent,
  type OpportunityNotionInput,
  type NotionPageProperties,
  type RiskRewardAnalysis,
  type EmotionalLog,
  type EmotionalTrend,
  type MemoryEntry,
  type CognitiveDistortionAnalysis,
  type CognitiveDistortionId,
  type CognitiveDistortion,
  type CognitiveDistortionAnalysisData,
  type LogEmotionRequestBody,
  type EvaluationResult,
  type Agent,
  type Task,
  type Crew,
  type CrewManagerConfig,
  type CrewTemplate,
  type CrewExecutionResult,
  type CrewProcessConfig,
  type NarrativeType,
  type NarrativeTone,
  type NarrativeLength,
  type NarrativeGenerationRequest,
  type NarrativeGenerationResponse,
  type PipelineState,
  type KanbanStatus,
  type DetailedPipelineState,
  type EnabledSteps,
  type OrionSessionState,
  type IdentifiedPattern,
  type Persona,
  type Stakeholder,
  type OutreachRequest,
  type OutreachResponse,
  type ActivityWatchStorage,
  type AnalyticsSnapshot,
  type MemorySearchOptions,
  type AddTaskFromReflectionProps,
  type InputProps,
  type LLMResponseSuccess,
  type LLMResponseFailure,
  type CombinedLLMResponse,
} from '../src/types/orion';

// Email-related types, now from their dedicated file
export type { SendEmailParams, EmailAttachment } from '../src/types/email';

export { type HabiticaTask, type HabiticaUserStats } from './types/habitica';

// Export constants, functions, and classes from lib/ and hooks/ explicitly.
// This prevents unintended re-exports and module resolution ambiguities
// that can arise from 'export * from' statements on directories.

// LLM Providers related exports
export {
  type LLMModelConfig,
  PROVIDER_MODEL_CONFIGS,
  DEFAULT_GENERATION_PROVIDERS,
  SYNTHESIZER_PROVIDER,
  SYNTHESIZER_MODEL_ID,
  DEFAULT_LLM_TIMEOUT,
  DEFAULT_SYNTHESIZER_TIMEOUT,
  BROWSER_CONTEXT_MAX_CHARS,
  MIN_DRAFT_LENGTH,
  checkAllLlmApiKeys,
} from '../src/lib/llm_providers';

// Orion LLM related exports (including generateLLMResponse, getFallbackModels, REQUEST_TYPES)
export {
  generateLLMResponse,
  getFallbackModels,
  REQUEST_TYPES,
  constructLlmMessages,
  callExternalLLM,
} from '../src/lib/orion_llm';

// Profile Service
export { fetchUserProfile } from '../src/lib/profile_service';

// WhatsApp Parser
export { parseWhatsAppChat } from '../src/lib/whatsapp_parser';

// Orion Memory
export { processTextForIndexing, searchMemory } from '../src/lib/orion_memory';

// Orion Tools
export { AVAILABLE_ORION_TOOLS as ORION_TOOLS, callSequentialThinking } from '../src/lib/orion_tools';

// CBT Constants
export { COGNITIVE_DISTORTIONS_LIST, DISTORTION_DESCRIPTIONS } from '../src/lib/cbtConstants';

// Notion Service (Removed direct exports to prevent client-side bundling)

// CV related exports
export {
  fetchCVComponents,
  suggestCVComponents,
  rephraseComponent,
  tailorSummary as generateTailoredSummary,
  assembleCV,
  generateWordDoc,
  generateWordFilename,
} from '../src/lib/cv';

// Utility functions
export { cn, getOrionSourceUrl } from '../src/lib/utils';
export { logger as Logger } from './lib/logger';

// Clients
export {
  default as habiticaClient,
  getUserData,
  getTasks,
  createTask,
  scoreTask,
  updateTask,
  deleteTask,
} from '../src/lib/habitica_client';
export { apiClient } from '../src/lib/apiClient';

// Hooks
export { useSessionState } from '../app/hooks/useSessionState';
export { useUserProfile } from './hooks/useUserProfile';
export { useOpportunities } from './hooks/useOpportunities';
export { useCVTailoring } from './hooks/useCVTailoring';
export { useOpportunityMemory } from './hooks/useOpportunityMemory';
export { useMemory } from './hooks/useMemory';
export { useOpportunityDialogStore } from './hooks/useOpportunityDialogStore';
export { useLocalStorage } from './hooks/useLocalStorage';
export { ORION_MEMORY_COLLECTION_NAME } from '../src/lib/orion_config';
export {
  useOpportunityCentralStore,
  type OpportunityCentralStoreType,
  type SortableOpportunityKeys,
} from './lib/opportunityCentralStore';

// App State & Constants
export { PageNames, SessionStateKeys } from '../src/lib/app_constants';

// Emotions
// Removed emotionalLogStore export as it appears to be an application-specific store not intended for the shared package.
// export { emotionalLogStore } from '../emotions';
