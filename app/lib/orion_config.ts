/**
 * @fileoverview Centralized configuration module for the entire Orion AI Life-Architecture System.
 * @description This file consolidates all environment-dependent settings, API URLs, LLM-specific configurations, and other global constants. Its purpose is to provide a single source of truth for critical system parameters, ensuring consistency, maintainability, and secure management of sensitive information.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To define and export core API URLs for backend services (Python API, Qdrant).
 *   - To specify LLM request types (e.g., `ASK_QUESTION`, `OPPORTUNITY_EVALUATION`) for clear categorization of LLM interactions.
 *   - To define names for Qdrant memory collections (`ORION_MEMORY_COLLECTION_NAME`, `FEEDBACK_COLLECTION_NAME`).
 *   - To list and provide access to Orion's accessible local directories for file system interactions.
 *   - To store and manage email configuration (sender, app password).
 *   - To define default LLM providers for various request types, enabling model routing.
 *   - To centralize constants like vector size for embeddings and LLM timeouts.
 *   - To include a placeholder for authorization checks.
 *
 * FILEPATH: `app/lib/orion_config.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `.env`, `.env.local`: Sources environment variables (`NEXT_PUBLIC_PYTHON_API_URL`, `NEXT_PUBLIC_QDRANT_URL`, `NEXT_PUBLIC_APP_URL`, `EMAIL_SENDER`, `EMAIL_APP_PASSWORD`, `NOTION_API_KEY`, `NOTION_DATABASE_ID`, etc.).
 *   - `app/lib/orion_llm.ts`: Consumes `REQUEST_TYPES` and `DEFAULT_GENERATION_PROVIDERS` for LLM routing and message construction. Some model configurations were explicitly moved *from* `orion_llm.ts` into this file for consolidation.
 *   - `app/lib/orion_memory.ts`: Consumes `QDRANT_URL`, `QDRANT_HOST`, `QDRANT_PORT`, `ORION_MEMORY_COLLECTION_NAME`, `VECTOR_SIZE` for Qdrant client initialization and collection management.
 *   - `app/api/.../route.ts` files: Various API routes (e.g., `app/api/orion/research/company/route.ts`, `app/api/orion/memory/search/route.ts`) use these constants for backend API calls and Qdrant interactions.
 *   - `app/lib/profile_service.ts`: May consume Notion-related environment variables.
 *   - `app/components/orion/DedicatedAddToMemoryFormComponent.tsx`: Uses `MEMORY_TYPES`.
 *   - `app/lib/utils/apiFetcher.ts`: Uses `APP_BASE_URL` for constructing internal API request URLs.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes environment variables are correctly set up and accessible at runtime.
 *   - Assumes Qdrant and the Python backend are running at their configured URLs/ports.
 *   - LLM request types are strictly defined to enable type-safe routing and prompt construction.
 *   - The `checkAuthorization` function is currently a placeholder and requires a robust implementation for production use.
 *
 * NOTES:
 *   - This file uses `console.info` for initial debug logging of Notion env variables, aiding in rapid troubleshooting during startup.
 *   - It explicitly defines the `VECTOR_SIZE` (384) which is critical for consistency with the embedding model used by Qdrant.
 *   - Consolidation of LLM default providers here centralizes model routing logic.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Runtime Validation**: Implement more robust runtime validation for environment variables (e.g., using Zod) to ensure critical configurations are present and correctly typed at application startup.
 *   - **Dynamic Configuration Reload**: For long-running processes, consider a mechanism to dynamically reload configurations without requiring a full application restart (less critical for Next.js API routes).
 *   - **Cost-Aware LLM Routing**: Enhance `DEFAULT_GENERATION_PROVIDERS` to include cost metrics, allowing `orion_llm.ts` to make cost-optimized model choices.
 *   - **Centralized Secrets Management**: For highly sensitive production deployments, explore external secrets management solutions (e.g., AWS Secrets Manager, Vault) instead of direct `.env` file usage.
 *   - **Security Enhancements**: Strengthen the `checkAuthorization` function with actual authentication and authorization logic suitable for the application's security model.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - This file is already a primary consolidation point for configuration. Continue to move all global, environment-dependent, or static configuration values here from other parts of the codebase.
 */

// DEBUG: Log Notion env variables at startup for troubleshooting
console.info('[ORION_CONFIG][DEBUG] NOTION_API_KEY:', process.env.NEXT_PUBLIC_NOTION_API_KEY ? '[SET]' : '[NOT SET]');
console.info(
  '[ORION_CONFIG][DEBUG] NOTION_DATABASE_ID:',
  process.env.NEXT_PUBLIC_NOTION_DATABASE_ID ? process.env.NEXT_PUBLIC_NOTION_DATABASE_ID : '[NOT SET]'
);

// API URLs
export const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000';
export const QDRANT_URL = process.env.NEXT_PUBLIC_QDRANT_URL || 'http://localhost:6333';
export const QDRANT_HOST = process.env.NEXT_PUBLIC_QDRANT_HOST || '127.0.0.1';
export const QDRANT_PORT = Number(process.env.NEXT_PUBLIC_QDRANT_PORT || 6333);
export const VECTOR_SIZE = 384; // Default vector size for embeddings

// Determine the base URL for internal API calls
export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

// Email configuration
export const ORION_EMAIL_SENDER = process.env.EMAIL_SENDER;
export const ORION_EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

// LLM Request Types
export const ASK_QUESTION_REQUEST_TYPE = 'ask_question';
export const JOURNAL_REFLECTION_REQUEST_TYPE = 'journal_reflection';
export const JD_ANALYSIS_REQUEST_TYPE = 'jd_analysis';
export const PATTERN_ANALYSIS_REQUEST_TYPE = 'pattern_analysis';
export const OPPORTUNITY_EVALUATION_REQUEST_TYPE = 'opportunity_evaluation';
export const OUTREACH_GENERATION_REQUEST_TYPE = 'outreach_generation';
export const NARRATIVE_GENERATION_REQUEST_TYPE = 'narrative_generation';
export const CV_COMPONENT_SELECTION_REQUEST_TYPE = 'cv_component_selection';
export const CV_COMPONENT_REPHRASING_REQUEST_TYPE = 'cv_component_rephrasing';
export const CV_SUMMARY_TAILORING_REQUEST_TYPE = 'cv_summary_tailoring';
export const DRAFT_APPLICATION_REQUEST_TYPE = 'draft_application';
export const DRAFT_COMMUNICATION_REQUEST_TYPE = 'draft_communication';
export const WHATSAPP_REPLY_HELPER_REQUEST_TYPE = 'whatsapp_reply_helper';
export const DRAFT_LINKEDIN_MESSAGE_REQUEST_TYPE = 'draft_linkedin_message';
export const DAILY_REFLECTION_REQUEST_TYPE = 'daily_reflection';
export const THOUGHT_FOR_THE_DAY_REQUEST_TYPE = 'thought_for_the_day';

export const ORION_MEMORY_COLLECTION_NAME = 'orion_memory';
export const FEEDBACK_COLLECTION_NAME = 'feedback_memory';

export const MEMORY_TYPES = {
  JOURNAL: 'journal',
  REFLECTION: 'reflection',
  TASK: 'task',
  CONVERSATION: 'conversation',
  DOCUMENT: 'document',
  FEEDBACK: 'feedback',
};

// Local file system access
export const ORION_ACCESSIBLE_LOCAL_DIRECTORIES = [
  '/Users/mac/Documents/GitHub',
  '/Users/mac/Documents/Projects',
  '/Users/mac/Downloads',
];

export function getConfiguredDirectories(): string[] {
  return ORION_ACCESSIBLE_LOCAL_DIRECTORIES;
}

// Authorization helper function
export async function checkAuthorization() {
  // This is a placeholder implementation
  // In a real app, you would check user authentication and authorization
  return null; // Return null means authorized
}

// Default LLM Providers
export const DEFAULT_GENERATION_PROVIDERS = {
  [ASK_QUESTION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [JOURNAL_REFLECTION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [JD_ANALYSIS_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [OPPORTUNITY_EVALUATION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [OUTREACH_GENERATION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [NARRATIVE_GENERATION_REQUEST_TYPE]: 'narrative_generation',
  [CV_COMPONENT_SELECTION_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [CV_COMPONENT_REPHRASING_REQUEST_TYPE]: 'groq/llama3-70b-8192',
  [CV_SUMMARY_TAILORING_REQUEST_TYPE]: 'groq/llama3-70b-8192',
};

import { LLMModelConfig } from './types'; // Import the newly defined type

// List of all available LLM models with their capabilities
export const AVAILABLE_LLM_MODELS: LLMModelConfig[] = [
  // OpenAI Models
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openai', supportsTools: true, supportsJson: true },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai', supportsTools: true, supportsJson: true },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', supportsTools: false, supportsJson: true }, // Tool calling is limited for 3.5
  // Google Models (via LiteLLM, assuming Gemini API key configured)
  { id: 'gemini/gemini-pro', name: 'Gemini Pro', provider: 'google', supportsTools: false, supportsJson: true }, // Gemini Pro has limited tool support via Litellm currently
  // Groq Models
  {
    id: 'groq/llama3-70b-8192',
    name: 'Llama 3 70B (Groq)',
    provider: 'groq',
    supportsTools: false,
    supportsJson: true,
  },
  {
    id: 'groq/mixtral-8x7b-32768',
    name: 'Mixtral 8x7B (Groq)',
    provider: 'groq',
    supportsTools: false,
    supportsJson: true,
  },
  // Mistral Models (via LiteLLM, assuming Mistral API key configured)
  { id: 'mistral/mistral-large', name: 'Mistral Large', provider: 'mistral', supportsTools: false, supportsJson: true }, // Adjust if Mistral API supports tools
  {
    id: 'mistral/mixtral-8x7b-instruct-v0.1',
    name: 'Mixtral 8x7B (Mistral)',
    provider: 'mistral',
    supportsTools: false,
    supportsJson: true,
  },
  // Cohere Models
  { id: 'cohere/command-r', name: 'Command R (Cohere)', provider: 'cohere', supportsTools: false, supportsJson: true },
  {
    id: 'cohere/command-r-plus',
    name: 'Command R+ (Cohere)',
    provider: 'cohere',
    supportsTools: false,
    supportsJson: true,
  },
  // Together AI Models
  {
    id: 'together-ai/mistralai/Mixtral-8x7B-Instruct-v0.1',
    name: 'Mixtral 8x7B (Together)',
    provider: 'together-ai',
    supportsTools: false,
    supportsJson: true,
  },
  {
    id: 'together-ai/lmsys/vicuna-13b-v1.5',
    name: 'Vicuna 13B (Together)',
    provider: 'together-ai',
    supportsTools: false,
    supportsJson: false,
  },
  // OpenRouter Models (example - will route to underlying providers)
  {
    id: 'openrouter/mistralai/mixtral-8x7b-instruct',
    name: 'Mixtral 8x7B (OpenRouter)',
    provider: 'openrouter',
    supportsTools: false,
    supportsJson: true,
  },
  {
    id: 'openrouter/openai/gpt-4-turbo',
    name: 'GPT-4 Turbo (OpenRouter)',
    provider: 'openrouter',
    supportsTools: true,
    supportsJson: true,
  },
  // Azure OpenAI (placeholder, deployment IDs vary)
  { id: 'azure/gpt-4', name: 'GPT-4 (Azure)', provider: 'azure', supportsTools: true, supportsJson: true },
  {
    id: 'azure/gpt-4.1-turbo',
    name: 'GPT-4.1 Turbo (Azure)',
    provider: 'azure',
    supportsTools: true,
    supportsJson: true,
  }, // Added as an Azure model
  // LM Studio (local models)
  {
    id: 'lm-studio/local-model',
    name: 'Local LM Studio Model',
    provider: 'lm-studio',
    supportsTools: false,
    supportsJson: false,
  }, // Capabilities depend on the local model loaded
  // DeepSeek (if supported by LiteLLM)
  {
    id: 'deepseek/deepseek-coder',
    name: 'DeepSeek Coder',
    provider: 'deepseek',
    supportsTools: false,
    supportsJson: true,
  }, // Placeholder, verify LiteLLM support and capabilities
];
