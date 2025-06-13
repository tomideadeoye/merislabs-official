export * from "./types";
// Core exports
export * from "./lib/constants";
export type { CognitiveDistortionId } from "./lib/cbt_constants";
export * from "./lib/orion_llm";
export * from "./lib/orion_memory";
export * from "./lib/orion_tools";
export * from "./lib/habitica_client";
export * from "./lib/activitywatch_storage";
export * from "./lib/local_file_service";
export * from "./lib/word-generator";
export * from "./lib/logger";
export * from "./lib/utils";
// DO NOT statically export email_service to avoid bundling nodemailer in Next.js client/edge/serverless builds.
// If you need to use the email service, import it directly in Node.js-only code:
//   import { sendEmailService } from '@repo/shared/lib/email_service';
export * from "./lib/narrative_service";
export * from "./lib/persona_service";
export * from "./lib/apiClient";
export * from "./lib/orion_config";
export * from "./lib/cv";
export * from "./lib/database";
export * from "./lib/pdf-generator";
export * from "./lib/notion_next_service";
export * from "./lib/notion_service";
export * from "./lib/orion_memory";
export * from "./opportunityCentralStore";
// HOOKS: Use the correct directory
export * from "../hooks/useCVTailoring";
// export * from "../hooks/useSessionState"; // Removed to resolve ambiguity
export * from "../hooks/useOpportunityDialogStore";
export * from "../hooks/useLocalStorage";
export * from "../hooks/useOpportunities";
export * from "../hooks/useUserProfile";
export * from "../hooks/useMemory";
export * from "../hooks/useOpportunityMemory";
// TYPES: Canonical exports from src/types
export * from "./types/strategic-outreach"; // Persona, PersonaMap, Outreach types
export * from "./types/nav"; // NavItem, NavSection
export * from "./types/ideas";
export * from './types/narrative-clarity';
export * from './types/habitica';
export * from './types/blocks';
// export * from "./types/llm"; // Removed duplicate export to resolve ambiguity

// Export types from types/orion
export type {
  OrionOpportunity,
  OrionOpportunityDetails,
  OpportunityNotionInput,
  OpportunityNotionOutputShared,
  EvaluationOutput,
  OpportunityType,
  OpportunityStatus,
  OpportunityPriority,
  DraftApplicationRequestBody,
  DraftApplicationResponseBody,
  SearchMemoryResponse,
  GenerateLLMResponse,
  JournalEntryNotionInput,
  MemoryPayload,
  MemoryPoint,
  ScoredMemoryPoint,
  QdrantFilter,
  QdrantFilterCondition,
  CognitiveDistortion,
  CognitiveDistortionAnalysisData,
  EmotionalLogEntry,
  LogEmotionRequestBody,
  PipelineState,
  EnabledSteps,
  OrionSessionState,
  Agent,
  Task,
  Crew,
  CrewManagerConfig,
  CrewTemplate,
  CrewExecutionResult,
  CrewProcessConfig,
  NotionPageProperties,
  RiskRewardAnalysis
} from "./types/orion";

export { ASK_QUESTION_REQUEST_TYPE } from './lib/orion_config';

export { apiClient, request } from './lib/apiClient';

// Re-export notion_service functions
export {
  createOpportunityInNotion,
  listOpportunitiesFromNotion,
  getOpportunityDetails,
  getOpportunityContent,
  updateOpportunityStatus,
  addStakeholderToOpportunity,
  saveOutreachToNotion,
  getCVComponentsFromNotion,
  fetchOpportunityByIdFromNotion,
  updateNotionOpportunity,
  getJournalEntriesFromNotion,
  createJournalEntryInNotion,
  fetchContactsFromNotion,
  saveJournalEntryToNotion,
  updateNotionDatabaseSchema
} from './lib/notion_service';

// Re-export notion_next_service functions
export {
  checkNotionApiHealth
} from './lib/notion_next_service';

// Explicitly export only required members from cv to avoid ambiguity
export type { CVComponent } from "./lib/cv";

export type { PersonaMap } from './types/strategic-outreach';
export type { NavItem } from './types/nav';

export * from "./lib/orion_llm";
export * from "./lib/orion_tools";
export * from "./lib/orion_server_config";
export * from "./lib/llm_providers";
export * from "./lib/constants";
export * from "./lib/local_file_service";
export * from "./lib/whatsapp_parser";
export * from "./lib/word-generator";
export * from "./lib/activitywatch_storage";
export * from "./lib/habitica_client";
export * from "./lib/database";
export * from "./lib/utils";
export * from "./lib/notion_next_service";

export * from "./types/orion";

export { generateLLMResponse } from "./lib/orion_llm";
export { searchMemory } from "./lib/orion_memory";

export type { OutreachRequest, OutreachResponse } from "../types/strategic-outreach";

// DO NOT statically export logger, profile_service, or local_file_service to avoid bundling Node.js dependencies in Next.js client/edge/serverless builds.
// If you need to use these, import them directly in Node.js-only code:
//   import { logger } from '@repo/shared/logger';
//   import { getUserProfile } from '@repo/shared/profile_service';
//   import { readFileContent } from '@repo/shared/local_file_service';

// Add missing exports for error fixes
export { getUserData } from './lib/habitica_client';

export { IdentifiedPattern } from './types/insights';
