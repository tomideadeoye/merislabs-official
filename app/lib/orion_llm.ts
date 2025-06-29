/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview Core module for interacting with various Large Language Models (LLMs) within the Orion system.
 * @description This file centralizes the logic for constructing LLM messages, calling external LLM APIs (like Azure, Groq, Gemini, OpenRouter, Mistral, Cohere, Together AI), handling model fallbacks, implementing retry mechanisms, and managing tool/function calls for agentic workflows. It ensures consistent LLM interaction patterns across the application, particularly supporting AI-driven features like CV component suggestion, rephrasing, and comprehensive communication drafting.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide a unified interface for generating responses from multiple LLM providers.
 *   - To manage and configure different LLM models and their respective API keys/endpoints.
 *   - To implement robust retry logic with exponential backoff for transient API failures.
 *   - To support model fallback mechanisms, allowing Orion to gracefully switch to alternative models if a primary one fails or is unavailable.
 *   - To dynamically construct LLM messages based on request type, integrating various contexts (system, user profile, retrieved memories, primary prompt, and specific drafting parameters).
 *   - To enable tool/function calling capabilities for advanced agentic workflows.
 *   - To categorize and manage a comprehensive set of LLM request types (e.g., `OPPORTUNITY_EVALUATION`, `DRAFT_COMMUNICATION`, `WHATSAPP_REPLY_HELPER_REQUEST_TYPE`, `CV_COMPONENT_TAILORING`, `CV_REPHRASING`).
 *   - To provide helper functions for selecting appropriate models and handling API requests.
 *   - **FR-2.2:** To use an LLM to analyze job descriptions against CV components for intelligent suggestion.
 *   - **FR-4.3:** To send prompts to the LLM for rephrasing CV component content to align with job descriptions.
 *   - **Communication Drafting:** To support detailed drafting of communications (e.g., WhatsApp replies) by incorporating specific goals, tones, and the number of drafts required.
 *   - LLM should support tool/function calling in the future for more complex agentic behaviors.
 *
 * FILEPATH: `app/lib/orion_llm.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/types`: Imports core types such as `OutreachRequest`, `OutreachResponse`, `UserProfileData`, `CombinedLLMResponse`, `ScoredMemoryPoint`, `Message`, `CreateChatCompletionResponse`, `LLMSequentialThinkingResponse`, and `LLMOptions`, ensuring type safety throughout LLM interactions, especially for `memoryResults` and new drafting parameters.
 *   - `@/lib/types/llm`: Imports `LLMModelConfig` for defining model-specific configurations.
 *   - `app/lib/orion_config.ts`: Defines `REQUEST_TYPES` (including `WHATSAPP_REPLY_HELPER_REQUEST_TYPE`) and `DEFAULT_GENERATION_PROVIDERS`, which are crucial for LLM routing and categorization.
 *   - `app/api/orion/opportunity/[id]/evaluation/route.ts`: Calls `generateLLMResponse` to perform opportunity evaluations.
 *   - `app/api/orion/communication/draft-whatsapp-reply/route.ts`: Calls `generateLLMResponse` with specific `replyGoal`, `tone`, and `numberOfDrafts` parameters, and processes the returned `memoryResults`.
 *   - `app/api/orion/sequential-thinking.ts`: Calls `callSequentialThinking` for multi-step reasoning processes.
 *   - `app/components/orion/networking-hub/PersonaOutreachForm.tsx`: Calls `generateOutreachMessage` for drafting outreach communications.
 *   - `app/lib/profile_service.ts`: Provides user profile data (`UserProfileData`) which is often included in LLM context for personalization.
 *   - `app/lib/orion_memory.ts`: Provides `ScoredMemoryPoint` data (retrieved memories) which are integrated into LLM prompts to enhance contextual relevance.
 *   - `app/api/orion/cv/suggest-components/route.ts`: Calls `generateLLMResponse` to power AI-driven CV component suggestions (related to FR-2.2).
 *   - `app/api/orion/cv/rephrase-component/route.ts`: Calls `generateLLMResponse` for AI-powered rephrasing of CV component content (related to FR-4.3).
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that required API keys for configured LLM providers are set as environment variables (e.g., `GROQ_API_KEY`, `GEMINI_API_KEY`).
 *   - Assumes external LLM APIs are accessible and generally conform to the OpenAI Chat Completion API specification.
 *   - The `retry` mechanism handles transient network issues or rate limits, but persistent configuration errors (e.g., wrong API key) will eventually fail.
 *   - Model fallback logic ensures that if a preferred model fails, Orion attempts to use a less preferred but functional alternative.
 *   - The `REQUEST_TYPES` constant, though defined here for immediate use, should ideally be consolidated with `orion_config.ts` for a single source of truth across the application. (NOTE: This consolidation is a planned improvement).
 *   - For CV tailoring, the LLM is expected to intelligently process job descriptions and component content to provide relevant suggestions or rephrased text.
 *   - The `generateLLMResponse` function correctly interprets and uses the `replyGoal`, `tone`, `numberOfDrafts`, and `overallSentiment` from the `LLMOptions`.
 *   - The `WHATSAPP_REPLY_HELPER_REQUEST_TYPE` is now a recognized type for specific WhatsApp reply generation logic.
 *
 * NOTES:
 *   - This module is crucial for Orion's core intelligence, enabling all AI-driven features from opportunity evaluation to communication drafting, and now significantly enhances the CV Tailoring Studio.
 *   - Extensive `console.log`/`console.warn`/`console.error` statements are used for debugging LLM interactions, including API call details, retry attempts, and errors.
 *   - The separation of concerns within this file (model configs, retry logic, message construction, API calls) promotes modularity and testability.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Unified Request Typing**: Refactor `REQUEST_TYPES` to be exclusively defined in `orion_config.ts` and imported here, ensuring a single source of truth and avoiding potential inconsistencies.
 *   - **Cost-Based Model Selection**: Implement more sophisticated model selection logic in `selectPrimaryModelForRequestType` that considers dynamic factors like cost-per-token and real-time latency, not just predefined preferences.
 *   - **Streaming Responses**: Enhance `callExternalLLM` and related functions to support streaming LLM responses for faster perceived performance in the UI, especially for long generations.
 *   - **Enhanced Error Handling**: Integrate `handleApiError` from `app/lib/utils/errorHandler.ts` for a more consistent API error handling approach, including returning structured `ApiErrorResponse` objects.
 *   - **Dynamic Tool Definitions**: Allow `tools` to be dynamically loaded or generated based on the agent's current task rather than being hardcoded.
 *   - **Observability**: Integrate with a more robust logging framework (beyond `console.log`) that can send LLM interaction data (prompts, responses, tokens used, latency, model chosen) to a centralized observability platform.
 *   - **Token Management**: Implement explicit token counting and truncation logic to ensure prompts fit within model context windows and to manage costs effectively, especially for `maxTokens`.
 *   - **Unit and Integration Tests**: Develop comprehensive test suites for each function within this module, covering successful calls, API failures, fallback scenarios, message construction, and tool calling.
 *   - **Specialized CV LLM Prompts**: Refine and manage specific prompt templates for CV component suggestion and rephrasing within a dedicated prompt management system or utility to ensure optimal AI output.
 *   - **Parameter-driven Prompt Engineering**: Centralize the management of prompt templates and enable their dynamic selection and population based on the `LLMOptions` provided (e.g., `replyGoal`, `tone`).
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - The `PROVIDER_MODEL_CONFIGS` and related model selection logic could potentially be abstracted into a dedicated `llm_models_service.ts` if model management becomes highly complex.
 *   - The `checkAllLlmApiKeys` function, while useful, could be part of a broader system health check utility rather than solely within `orion_llm.ts`.
 */
/**
 * GOAL:
 * LLM integration module for Orion system in Next.js
 * Handles LLM interactions and message construction
 */
// GOAL OF FILE|FEATURES|FUNCTIONS:
// FILEPATH:
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunties to consolidate

import {
  OutreachRequest,
  OutreachResponse,
  UserProfileData,
  CombinedLLMResponse,
  ScoredMemoryPoint,
  Message,
  CreateChatCompletionResponse,
  LLMSequentialThinkingResponse,
  LLMOptions,
  CvAutoGenerateOutput,
  LLMModelConfig,
  PreferredModels,
} from '@/lib/types';
import { CVComponent } from '@/lib/types/cv'; // Explicitly import CVComponent from its defining file
import { LLMModelConfig as LLMModelConfigType } from '@/lib/types/llm'; // Ensure LLMModelConfig is imported from the consolidated types file
import logger from '@/lib/logger'; // Re-add logger import
import { apiClient } from '@/lib/apiClient'; // Import apiClient

// Consolidating LLM provider configurations and constants directly into orion_llm.ts

export const DEFAULT_GENERATION_PROVIDERS = [
  'azure',
  'groq',
  'gemini',
  'mistral',
  'openrouter',
  'cohere',
  'together_ai',
];

export const SYNTHESIZER_PROVIDER = 'gemini';
export const SYNTHESIZER_MODEL_ID = 'gemini/gemini-1.5-pro-latest';

export const DEFAULT_LLM_TIMEOUT = 60; // seconds
export const DEFAULT_SYNTHESIZER_TIMEOUT = 60; // seconds
export const BROWSER_CONTEXT_MAX_CHARS = 4000;
export const MIN_DRAFT_LENGTH = 20;

// Supported model IDs (for quick reference):
// azure/gpt-4.1
// deepseek-r1
// groq/llama3-70b-8192
// groq/gemma2-9b-it
// groq/llama-3.1-70b-versatile
// groq/mistral-hermes-24b
// groq/deepseek-r1-distill-qwen-32b
// openrouter/mistralai/mistral-7b-instruct
// openrouter/google/gemini-2.0-flash-exp:free
// openrouter/deepseek/deepseek-chat-v3-0324:free
// openrouter/deepseek/deepseek-coder-v2-0324:free
// openrouter/anthropic/claude-3-5-sonnet
// mistral/mistral-large-latest
// mistral/mistral-small-latest
// gemini/gemini-1.5-pro-latest
// gemini/gemini-1.5-flash-latest
// cohere/command-r-plus
// together_ai/meta-llama/Llama-3.1-70B-Instruct-hf
// together_ai/Qwen/Qwen2-72B-Instruct

// Model provider configurations
export const PROVIDER_MODEL_CONFIGS: Record<string, LLMModelConfigType[]> = {
  // Azure Models
  azure: [
    {
      modelId: 'azure/gpt-4.1',
      apiKeyEnv: 'AZURE_OPENAI_API_KEY',
      azureEndpointEnv: 'AZURE_OPENAI_ENDPOINT',
      apiVersion: '2025-01-01-preview',
      deploymentId: 'gpt-4.1',
      modelInfo: {
        inputCostPerToken: 0.0000015,
        outputCostPerToken: 0.000002,
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
    },
    // DeepSeek-R1 as Azure deployment
    {
      modelId: 'azure/DeepSeek-R1',
      apiKeyEnv: 'AZURE_DEEPSEEK_API_KEY',
      azureEndpointEnv: 'AZURE_DEEPSEEK_ENDPOINT',
      apiVersion: '2024-05-01-preview',
      deploymentId: 'DeepSeek-R1',
      modelInfo: {
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
      comment: 'DeepSeek-R1 model deployed on Azure OpenAI',
    },
  ],

  // Groq Models
  groq: [
    {
      modelId: 'groq/llama3-70b-8192',
      apiKeyEnv: 'GROQ_API_API_KEY',
      modelInfo: {
        inputCostPerToken: 0.0,
        outputCostPerToken: 0.0,
        contextWindow: 8192,
        maxOutputTokens: 4096,
      },
      comment: 'Current Llama3 70b on Groq',
    },
    {
      modelId: 'groq/gemma2-9b-it',
      apiKeyEnv: 'GROQ_API_KEY',
      comment: 'Current Gemma2 9b on Groq',
    },
    {
      modelId: 'groq/llama-3.1-70b-versatile',
      apiKeyEnv: 'GROQ_API_KEY',
      comment: 'Recommended replacement for Llama 3.1 and Tool Use models',
    },
    {
      modelId: 'groq/mistral-hermes-24b',
      apiKeyEnv: 'GROQ_API_KEY',
      comment: 'Recommended replacement for Mixtral 8x7B',
    },
    {
      modelId: 'groq/deepseek-r1-distill-qwen-32b',
      apiKeyEnv: 'GROQ_API_KEY',
      comment: 'Recommended reasoning model, replaced specdec Llama',
    },
  ],

  // OpenRouter Models
  openrouter: [
    {
      modelId: 'openrouter/mistralai/mistral-7b-instruct',
      apiKeyEnv: 'OPEN_ROUTER_API_KEY',
      apiBase: 'https://openrouter.ai/api/v1',
      comment: 'Example free/low-cost model on OpenRouter',
    },
    {
      modelId: 'openrouter/google/gemini-2.0-flash-exp:free',
      apiKeyEnv: 'OPEN_ROUTER_API_KEY',
      apiBase: 'https://openrouter.ai/api/v1',
      modelInfo: {
        contextWindow: 128000,
        maxOutputTokens: 8192,
      },
      comment: 'Gemini 2.0 Flash experimental free tier via OpenRouter',
    },
    {
      modelId: 'openrouter/deepseek/deepseek-chat-v3-0324:free',
      apiKeyEnv: 'OPEN_ROUTER_API_KEY',
      apiBase: 'https://openrouter.ai/api/v1',
      modelInfo: {
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
      comment: 'DeepSeek Chat v3 free tier via OpenRouter',
    },
    {
      modelId: 'openrouter/deepseek/deepseek-coder-v2-0324:free',
      apiKeyEnv: 'OPEN_ROUTER_API_KEY',
      apiBase: 'https://openrouter.ai/api/v1',
      modelInfo: {
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
      comment: 'DeepSeek Coder v2 free tier via OpenRouter',
    },
    {
      modelId: 'openrouter/anthropic/claude-3-5-sonnet',
      apiKeyEnv: 'OPEN_ROUTER_API_KEY',
      apiBase: 'https://openrouter.ai/api/v1',
      comment: 'Anthropic Claude 3.5 Sonnet via OpenRouter',
    },
  ],

  // Mistral Models
  mistral: [
    {
      modelId: 'mistral/mistral-large-latest',
      apiKeyEnv: 'MISTRAL_API_KEY',
    },
    {
      modelId: 'mistral/mistral-small-latest',
      apiKeyEnv: 'MISTRAL_API_KEY',
      comment: 'Use latest small',
    },
  ],

  // Gemini Models
  gemini: [
    {
      modelId: 'gemini/gemini-1.5-pro-latest',
      apiKeyEnv: 'GEMINI_API_KEY',
      comment: 'Gemini 1.5 Pro via Google AI Studio',
    },
    {
      modelId: 'gemini/gemini-1.5-flash-latest',
      apiKeyEnv: 'GEMINI_API_KEY',
      comment: 'Gemini 1.5 Flash via Google AI Studio',
    },
  ],

  // Cohere Models
  cohere: [
    {
      modelId: 'cohere/command-r-plus',
      apiKeyEnv: 'COHERE_API_KEY',
      comment: 'Capable Cohere model',
    },
  ],

  // Together AI Models
  together_ai: [
    {
      modelId: 'together_ai/meta-llama/Llama-3.1-70B-Instruct-hf',
      apiKeyEnv: 'TOGETHER_API_KEY',
    },
    {
      modelId: 'together_ai/Qwen/Qwen2-72B-Instruct',
      apiKeyEnv: 'TOGETHER_API_KEY',
    },
  ],
};

// Utility: Check for all required LLM API keys
// This function remains in orion_llm.ts as it directly uses PROVIDER_MODEL_CONFIGS
export function checkAllLlmApiKeys() {
  const results: {
    modelId: string;
    provider: string;
    apiKeyEnv: string;
    present: boolean;
  }[] = [];
  for (const [provider, models] of Object.entries(PROVIDER_MODEL_CONFIGS)) {
    for (const model of models as LLMModelConfigType[]) {
      const apiKey = process.env[model.apiKeyEnv];
      results.push({
        modelId: model.modelId,
        provider: provider,
        apiKeyEnv: model.apiKeyEnv,
        present: !!apiKey,
      });
    }
  }
  return results;
}

// =========== Retry Logic for API Calls ===========
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Retries a function that returns a promise, with exponential backoff.
 * @param fn The async function to retry.
 * @param retries The maximum number of retries.
 * @param initialDelay The initial delay in milliseconds.
 * @param shouldRetry A function to determine if a retry should be attempted based on the error.
 * @returns The result of the function if it succeeds.
 * @throws The last error if all retries fail.
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  initialDelay: number,
  shouldRetry: (error: unknown) => boolean
): Promise<T> {
  let lastError: unknown;
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;
      if (shouldRetry(error)) {
        const jitter = delay * 0.1 * Math.random(); // Add jitter to avoid thundering herd
        console.warn(
          `[LLM_RETRY] Attempt ${i + 1}/${retries} failed with retryable error. Retrying in ${Math.round(
            delay + jitter
          )}ms...`,
          error instanceof Error ? error.message : String(error)
        );
        await sleep(delay + jitter);
        delay *= 2; // Exponential backoff
      } else {
        // If the error is not retryable, re-throw it immediately.
        throw error;
      }
    }
  }
  console.error(`[LLM_RETRY] All ${retries} retries failed.`);
  throw lastError;
}

/**
 * Determines if an LLM API call should be retried based on the error.
 * @param error The error object.
 * @returns True if the error is a 429 (rate limit), false otherwise.
 */
const shouldRetryLLM = (error: unknown): boolean => {
  if (error instanceof Error) {
    // Retry on rate limits or temporary server errors
    if (error.message.includes('429') || error.message.includes('500') || error.message.includes('503')) {
      return true;
    }
  }
  return false;
};

// Model fallback configuration
// NOTE: All models in fallback must be implemented and have API keys set in .env.local
const MODEL_FALLBACK_CONFIG: Record<string, string[]> = {
  'azure/gpt-4.1': [
    'azure/DeepSeek-R1',
    'groq/llama3-70b-8192',
    'openrouter/deepseek/deepseek-chat-v3-0324:free',
    'openrouter/google/gemini-2.0-flash-exp:free',
    'openrouter/anthropic/claude-3-5-sonnet',
    'mistral/mistral-large-latest',
    'gemini/gemini-1.5-pro-latest',
  ],
  'azure/DeepSeek-R1': [
    'azure/gpt-4.1',
    'groq/llama3-70b-8192',
    'openrouter/deepseek/deepseek-chat-v3-0324:free',
    'openrouter/google/gemini-2.0-flash-exp:free',
    'openrouter/anthropic/claude-3-5-sonnet',
    'mistral/mistral-large-latest',
    'gemini/gemini-1.5-pro-latest',
  ],
  default: [
    'azure/gpt-4.1',
    'azure/DeepSeek-R1',
    'openrouter/deepseek/deepseek-chat-v3-0324:free',
    'groq/llama3-70b-8192',
    'openrouter/google/gemini-2.0-flash-exp:free',
    'mistral/mistral-large-latest',
    'openrouter/anthropic/claude-3-5-sonnet',
    'gemini/gemini-1.5-pro-latest',
    'groq/gemma2-9b-it',
  ],
};

// Explicitly define REQUEST_TYPES here to ensure all properties are recognized
export const REQUEST_TYPES = {
  OPPORTUNITY_EVALUATION: 'opportunity_evaluation',
  DRAFT_COMMUNICATION: 'draft_communication',
  JOURNAL_ENTRY: 'journal_entry',
  ASK_QUESTION: 'ask_question',
  MEMORY_INDEXING: 'memory_indexing',
  CV_COMPONENT_TAILORING: 'cv_component_tailoring',
  CV_REPHRASING: 'cv_rephrasing',
  WHATSAPP_REPLY: 'whatsapp_reply',
  WHATSAPP_CHAT_ANALYSIS: 'whatsapp_chat_analysis',
  ORION_IMPROVEMENT: 'orion_improvement',
  JD_ANALYSIS: 'jd_analysis',
  PROFILE_SUMMARY_TAILORING: 'profile_summary_tailoring',
  CODE_GENERATION: 'code_generation',
  CODE_EXPLANATION: 'code_explanation',
  IDEA_BRAINSTORM: 'idea_brainstorm',
  EMAIL_DRAFTING: 'email_drafting',
  WORDS_OF_AFFIRMATION: 'words_of_affirmation',
  WHATSAPP_REPLY_HELPER_REQUEST_TYPE: 'whatsapp_reply_helper_request_type',
  CV_AUTO_GENERATE: 'cv_auto_generate',
  SEQUENTIAL_THINKING: 'sequential_thinking',
  CV_COMPONENT_SUGGESTION: 'cv_component_suggestion',
  AI_SUGGEST_CV_COMPONENTS: 'ai_suggest_cv_components',
  REFLECT_ON_ENTRY: 'reflect_on_entry',
  GENERAL_SYSTEM_MESSAGE: 'general_system_message',
  GENERATE_AFFIRMATION: 'generate_affirmation',
  DRAFT_EMAIL: 'draft_email',
  DRAFT_LINKEDIN_MESSAGE: 'draft_linkedin_message',
  LLM_SETTINGS_UPDATE: 'llm_settings_update',
  AGENTIC_WORKFLOW: 'agentic_workflow',
  COMMUNICATION_PATTERN_ANALYSIS: 'COMMUNICATION_PATTERN_ANALYSIS',
} as const; // Use 'as const' for literal type inference

/**
 * Get fallback models for a given model ID
 */
export function getFallbackModels(modelId: string): string[] {
  return MODEL_FALLBACK_CONFIG[modelId] || MODEL_FALLBACK_CONFIG.default;
}

/**
 * Get default model for a request type
 */
export function getDefaultModelForRequestType(requestType: string): string {
  // Define model preferences for each request type
  const requestTypeModelMap: Record<string, string> = {
    // Use Azure OpenAI for high-stakes professional tasks
    [REQUEST_TYPES.OPPORTUNITY_EVALUATION]: 'azure/DeepSeek-R1',
    [REQUEST_TYPES.DRAFT_COMMUNICATION]: 'azure/gpt-4.1',
    // Use DeepSeek for general questions and analysis
    [REQUEST_TYPES.ASK_QUESTION]: 'openrouter/deepseek/deepseek-chat-v3-0324:free',
    [REQUEST_TYPES.JOURNAL_ENTRY]: 'openrouter/deepseek/deepseek-chat-v3-0324:free',
    // Use specific models for special tasks
    [REQUEST_TYPES.ORION_IMPROVEMENT]: 'azure/gpt-4.1',
    // Use OpenRouter for free tier access
    [REQUEST_TYPES.JD_ANALYSIS]: 'openrouter/google/gemini-2.0-flash-exp:free',
    [REQUEST_TYPES.CV_COMPONENT_TAILORING]: 'openrouter/google/gemini-2.0-flash-exp:free',
    [REQUEST_TYPES.PROFILE_SUMMARY_TAILORING]: 'openrouter/google/gemini-2.0-flash-exp:free',
    // Use DeepSeek Coder for code-related tasks
    [REQUEST_TYPES.CODE_GENERATION]: 'openrouter/deepseek/deepseek-coder-v2-0324:free',
    [REQUEST_TYPES.CODE_EXPLANATION]: 'openrouter/deepseek/deepseek-coder-v2-0324:free',
  };

  // Get model for request type or use DeepSeek Chat as default
  return requestTypeModelMap[requestType] || 'openrouter/deepseek/deepseek-chat-v3-0324:free';
}

/**
 * Construct LLM messages based on request type and context
 */
export function constructLlmMessages({
  requestType,
  primaryContext,
  systemContext,
  profileContext,
  memoryResults,
  prompt,
  allCvComponents,
  jobDescription,
}: {
  requestType: string;
  primaryContext?: string;
  systemContext?: string;
  profileContext?: string;
  memoryResults?: ScoredMemoryPoint[];
  prompt?: string;
  allCvComponents?: CVComponent[];
  jobDescription?: string;
}): Message[] {
  const messages: Message[] = [];

  // Add system message based on request type or use provided system context
  if (systemContext) {
    messages.push({ role: 'system', content: systemContext });
  } else {
    const systemMessages: Record<string, string> = {
      [REQUEST_TYPES.OPPORTUNITY_EVALUATION]:
        'You are a career strategist and REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA evaluator. Analyze opportunities ' +
        'based on the profile and context provided. Focus on alignment with skills, ' +
        'career goals, and growth potential.',
      [REQUEST_TYPES.ASK_QUESTION]:
        'You are a helpful AI assistant. Provide clear, accurate answers based on ' +
        'the context provided. Be concise but thorough.',
      [REQUEST_TYPES.DRAFT_COMMUNICATION]:
        'You are a professional communication expert. Draft clear, well-structured messages ' +
        'that maintain appropriate tone and achieve communication objectives effectively.',
      [REQUEST_TYPES.JOURNAL_ENTRY]:
        'You are a thoughtful writing assistant helping to process and structure journal ' +
        'entries. Help develop insights while maintaining the authentic voice of the writer.',
      [REQUEST_TYPES.ORION_IMPROVEMENT]:
        "You are a systems improvement specialist. Analyze Orion's functionality and " +
        'suggest concrete, implementable improvements while maintaining system stability.',
      [REQUEST_TYPES.JD_ANALYSIS]:
        'You are a career advisor specializing in job description analysis. Analyze the job description ' +
        "to identify key requirements, responsibilities, and alignment with the user's profile.",
      [REQUEST_TYPES.CV_COMPONENT_TAILORING]:
        'You are a CV optimization expert. Tailor CV components to highlight relevant skills and ' +
        'experiences that match the job requirements while maintaining authenticity.',
      [REQUEST_TYPES.PROFILE_SUMMARY_TAILORING]:
        'You are a professional profile writer. Create compelling profile summaries that highlight ' +
        'key strengths and career narrative aligned with the target REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA.',
      [REQUEST_TYPES.CODE_GENERATION]:
        'You are an expert software developer. Generate clean, efficient, and well-documented code ' +
        'based on the requirements provided. Include comments and explanations where appropriate.',
      [REQUEST_TYPES.CODE_EXPLANATION]:
        'You are a coding instructor. Explain code in a clear, educational manner, breaking down ' +
        'complex concepts and highlighting important patterns and techniques.',
      [REQUEST_TYPES.CV_AUTO_GENERATE]: `You are an expert CV tailoring AI assistant. Your goal is to select the most relevant CV components and tailor their content to a given job description, ensuring the output is highly optimized for the role.

        You MUST respond with a JSON object adhering to the 'CvAutoGenerateOutput' interface.

        The JSON object should have a 'selectedComponents' array, where each object has 'id', 'name', 'type', and 'content'.

        For each selected component, prioritize rephrasing its 'content' to align perfectly with the job description. If no rephrasing is necessary or possible, use the original content.

        Consider all aspects: Professional Experience, Education, Skills, Certifications, and any other relevant sections.

        Think step-by-step:
        1. Analyze the job description thoroughly to identify key requirements, keywords, and desired skills/experiences.
        2. Review each provided CV component.
        3. Select the components that are most relevant and impactful for this specific job.
        4. For each selected component, rephrase its 'content' to maximize its alignment with the job description. If the content is already perfect or cannot be rephrased for better alignment, keep it as is.
        5. Assemble the selected and rephrased components into the 'selectedComponents' array in the JSON output.
        6. Provide a concise 'summary' of your selection process or the overall tailored CV.`,
    };

    // Get appropriate system message or use default
    const systemMessage =
      systemMessages[requestType] ||
      'You are a helpful AI assistant. Provide clear and accurate responses while maintaining context.';

    messages.push({ role: 'system', content: systemMessage });
  }

  // Add profile context if provided
  if (profileContext) {
    messages.push({
      role: 'user',
      content: `Here is relevant profile information:\\n${profileContext}`,
    });
  }

  // Add memory results if provided
  if (memoryResults && memoryResults.length > 0) {
    const memoryContext = memoryResults
      .map((item, index) => `Memory ${index + 1}: ${item.payload?.text}`)
      .join('\\n\\n');

    messages.push({
      role: 'user',
      content: `Here are relevant memories that may help with your response:\\n${memoryContext}`,
    });
  }

  // Add primary context or prompt
  let userContent = primaryContext || prompt || '';

  // Add allCvComponents and jobDescription for CV_AUTO_GENERATE
  if (requestType === REQUEST_TYPES.CV_AUTO_GENERATE) {
    if (!jobDescription) {
      throw new Error('Job description is required for CV auto-generation.');
    }

    let componentsContext = '';
    if (allCvComponents && allCvComponents.length > 0) {
      componentsContext =
        '\\n\\nHere are all available CV components to choose from, along with their names, types, and content:\\n';
      componentsContext += allCvComponents
        .map((comp) => {
          return `---
Component Name: ${comp.name}
Component Type: ${comp.type}
Component Content:
\`\`\`
${comp.content}
\`\`\`
---`;
        })
        .join('\\n\\n');
    }

    userContent = `Job Description:
\`\`\`
${jobDescription}
\`\`\`
${componentsContext}

Please analyze the job description and the provided CV components. Select the most relevant components and, for each selected component, rephrase its content to align perfectly with the job description.
Your response MUST be a JSON object adhering to the 'CvAutoGenerateOutput' interface:
\`\`\`json
{
  "selectedComponents": [
    {
      "id": "string",
      "name": "string",
      "type": "string",
      "content": "string"
    }
  ],
  "rephrasedContent"?: "string",
  "summary"?: "string"
}
\`\`\`
Ensure all selected components are included in the 'selectedComponents' array. Provide a 'summary' of your selection and tailoring process.`;

    messages.push({ role: 'user', content: userContent });
  } else if (userContent) {
    messages.push({ role: 'user', content: userContent });
  }

  return messages;
}

/**
 * Get LLM answer with fallback
 */
export async function getLlmAnswerWithFallback(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<[CombinedLLMResponse | null, string | null]> {
  const defaultModel = options.model || getDefaultModelForRequestType('ASK_QUESTION');
  const modelsToTry = [defaultModel, ...getFallbackModels(defaultModel)];

  for (const model of modelsToTry) {
    try {
      const response = await retry(
        () =>
          callExternalLLM(
            model,
            [{ role: 'user', content: prompt }],
            options.temperature || 0.7,
            options.maxTokens || 1000
          ),
        3, // Retries
        1000, // Initial delay
        shouldRetryLLM
      );
      if (response && response.choices && response.choices.length > 0) {
        const content = response.choices[0].message?.content;
        if (content) {
          return [
            {
              success: true,
              content,
              model,
              temperature: options.temperature || 0.7,
              maxTokens: options.maxTokens || 1000,
            },
            null,
          ];
        }
      }
    } catch (error: unknown) {
      console.warn(`[getLlmAnswerWithFallback] Failed with model ${model}:`, error);
      // Continue to next model if this one fails
    }
  }

  return [null, 'All LLM models failed to generate a response. Please check API keys and model configurations.'];
}

/**
 * Generate LLM response
 */
export async function generateLLMResponse(
  requestType: string,
  primaryContext: string, // This will be the job description for CV_AUTO_GENERATE
  userId: string | null, // Make userId nullable
  options: LLMOptions = {} // Use LLMOptions to access allCvComponents and jobDescription
): Promise<CombinedLLMResponse> {
  logger.info('[orion_llm][generateLLMResponse][START]', { requestType, userId, options });

  const messages = constructLlmMessages({
    requestType,
    primaryContext,
    systemContext: options.systemContext,
    profileContext: options.profileContext,
    memoryResults: options.memoryResults,
    // Pass allCvComponents and jobDescription to constructLlmMessages
    ...(requestType === REQUEST_TYPES.CV_AUTO_GENERATE && {
      allCvComponents: options.allCvComponents,
      jobDescription: options.jobDescription,
    }),
  });

  try {
    const llmResponse = await callLLMWithFallback(
      messages,
      requestType,
      options.temperature,
      options.maxTokens,
      undefined,
      options.responseFormat === 'json_object'
        ? { type: 'function', function: { name: 'auto_generate_cv' } }
        : undefined, // Force JSON response if requested
      userId
    );

    if (llmResponse && llmResponse.choices && llmResponse.choices.length > 0) {
      const content = llmResponse.choices[0].message?.content;
      if (content) {
        let structuredResponse;
        if (requestType === REQUEST_TYPES.CV_AUTO_GENERATE && options.responseFormat === 'json_object') {
          try {
            structuredResponse = JSON.parse(content) as CvAutoGenerateOutput;
            logger.info('[orion_llm][generateLLMResponse][STRUCTURED_RESPONSE_PARSED]', { structuredResponse });
          } catch (jsonParseError) {
            logger.error('[orion_llm][generateLLMResponse][JSON_PARSE_ERROR]', {
              error: (jsonParseError as Error).message,
              content,
            });
            return { success: false, error: 'Failed to parse structured LLM response for CV auto-generation.' };
          }
        }
        return {
          success: true,
          content,
          model: llmResponse.model,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000,
          memoryResults: options.memoryResults,
          structuredResponse,
        };
      }
    }
    return { success: false, error: 'LLM response was empty or malformed.' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Generate LLM response with tools
 */
export async function generateLLMResponseWithTools({
  requestType,
  primaryContext,
  userId,
  profileContext,
  systemContext,
  memoryResults,
  model,
  temperature,
  maxTokens,
  tools,
  tool_choice,
  taskId,
}: {
  requestType: string;
  primaryContext: string;
  userId: string | null;
  profileContext?: string;
  systemContext?: string;
  memoryResults?: ScoredMemoryPoint[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: object[];
  tool_choice?: object | 'none' | 'auto';
  taskId?: string;
}): Promise<CombinedLLMResponse> {
  logger.info('[orion_llm][generateLLMResponseWithTools][START]', { requestType, userId });

  const messages = constructLlmMessages({
    requestType,
    primaryContext,
    systemContext,
    profileContext,
    memoryResults,
  });

  try {
    const llmResponse = await callLLMWithFallback(
      messages,
      requestType,
      temperature,
      maxTokens,
      tools,
      tool_choice,
      userId
    );

    if (llmResponse && llmResponse.choices && llmResponse.choices.length > 0) {
      const message = llmResponse.choices[0].message;
      const content = message?.content || '';
      const tool_calls = message?.tool_calls;

      if (content || tool_calls) {
        return {
          success: true,
          content: content,
          model: llmResponse.model,
          temperature: temperature || 0.7,
          maxTokens: maxTokens || 1000,
          tool_calls: tool_calls,
          memoryResults: memoryResults as ScoredMemoryPoint[], // Cast to correct type
        };
      }
    }
    return { success: false, error: 'LLM response was empty or malformed.' };
  } catch (error: unknown) {
    logger.error('[orion_llm][generateLLMResponseWithTools][ERROR]', { error: (error as Error).message });
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

// Helper function to make API requests using fetch instead of axios
async function makeApiRequest(url: string, data: object, headers: Record<string, string>) {
  console.log(`[LLM_API_REQUEST][INFO] Making API request to ${url}`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Specifically handle 404 Not Found without throwing an error for fallback
      if (response.status === 404) {
        const errorText = await response.text();
        console.warn(`[LLM_API_REQUEST][WARN] Model not found (404): ${url}. Details: ${errorText}`);
        // Return a specific object to indicate a 404 error
        return { error: 'MODEL_NOT_FOUND', status: 404 };
      }
      const errorText = await response.text();
      // This custom error will be caught by the retry logic for other server errors
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    return await response.json();
  } catch (error: unknown) {
    console.error(
      `[LLM_API_REQUEST][ERROR] Error in makeApiRequest for URL ${url}:`,
      error instanceof Error ? error.message : String(error)
    );
    // Re-throw the error to be handled by the caller (including retry logic)
    throw error;
  }
}

// Helper function to get API key and endpoint for a model
export function getModelConfig(modelId: string): LLMModelConfigType | null {
  // Extract provider and model name
  const parts = modelId.split('/');
  const provider = parts[0];
  let modelConfig: LLMModelConfigType | null = null;

  if (modelId.startsWith('azure')) {
    // For Azure models, find by modelId directly
    modelConfig = PROVIDER_MODEL_CONFIGS.azure.find((m) => m.modelId === modelId) || null;
  } else if (parts.length > 1) {
    // For other providers with format "provider/model"
    const providerConfigs = PROVIDER_MODEL_CONFIGS[provider as keyof typeof PROVIDER_MODEL_CONFIGS];
    if (providerConfigs) {
      modelConfig =
        (providerConfigs as LLMModelConfigType[]).find((m: LLMModelConfigType) => m.modelId === modelId) || null;
    }
  } else {
    // For simple model names, search across all providers
    for (const [, models] of Object.entries(PROVIDER_MODEL_CONFIGS)) {
      const found = (models as LLMModelConfigType[]).find((m: LLMModelConfigType) => m.modelId === modelId);
      if (found) {
        modelConfig = found;
        break;
      }
    }
  }

  if (!modelConfig) {
    console.error(`Model config not found for ${modelId}`);
    return null; // Return null if model config is not found
  }

  return modelConfig;
}

// Helper function to call external LLM API
export async function callExternalLLM(
  model: string,
  messages: Message[],
  temperature: number,
  maxTokens?: number,
  tools?: object[],
  tool_choice?: object | 'none' | 'auto',
  userId?: string | null // Make userId nullable
): Promise<CreateChatCompletionResponse | null> {
  const modelConfig = getModelConfig(model);

  if (!modelConfig) {
    logger.error('[callExternalLLM][ERROR] Model config not found.', { model });
    throw new Error(`Model configuration not found for model: ${model}`);
  }

  if (!modelConfig.apiKeyEnv || !process.env[modelConfig.apiKeyEnv]) {
    logger.error('[callExternalLLM][ERROR] API key not found for model.', { model });
    throw new Error('API key not found for model.');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  let requestUrl: string | undefined = undefined;
  const payload: Record<string, unknown> = {
    model: modelConfig.modelId.includes('openrouter/')
      ? modelConfig.modelId.replace('openrouter/', '')
      : modelConfig.modelId.includes('azure/')
        ? modelConfig.deploymentId // For Azure, use deploymentId as model
        : modelConfig.modelId,
    messages,
    temperature,
    max_tokens: maxTokens,
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
    if (tool_choice) {
      payload.tool_choice = tool_choice;
    }
  } else if (tool_choice && tool_choice !== 'none' && tool_choice !== 'auto') {
    logger.warn('[callExternalLLM][WARNING] tool_choice specified without tools. Omitting tool_choice.', {
      model,
      tool_choice,
    });
  } else if (tool_choice) {
    payload.tool_choice = tool_choice;
  }

  // Handle Azure specific configurations
  if (model.startsWith('azure/')) {
    if (!modelConfig.azureEndpointEnv || !modelConfig.apiVersion) {
      logger.error('[callExternalLLM][ERROR] Azure endpoint or API version missing for model.', { model });
      throw new Error('Azure endpoint or API version missing for model.');
    }
    const azureEndpoint = process.env[modelConfig.azureEndpointEnv];
    if (!azureEndpoint) {
      logger.error('[callExternalLLM][ERROR] Azure API endpoint environment variable not set.', {
        envVar: modelConfig.azureEndpointEnv,
      });
      throw new Error('Azure API endpoint environment variable not set.');
    }
    requestUrl = `${azureEndpoint}/openai/deployments/${modelConfig.deploymentId}/chat/completions?api-version=${modelConfig.apiVersion}`;
    headers['api-key'] = process.env[modelConfig.apiKeyEnv] as string;
    payload.model = undefined; // Azure uses deployment ID in URL, not in payload.model
  } else if (model.startsWith('groq/')) {
    // ... existing code ...
  }

  try {
    logger.info('[callExternalLLM][REQUEST]', {
      model,
      requestUrl,
      payload,
      headers,
    });
    const response = await retry(() => makeApiRequest(requestUrl as string, payload, headers), 3, 1000, shouldRetryLLM);
    logger.info('[callExternalLLM][RESPONSE]', { response });
    return response as CreateChatCompletionResponse;
  } catch (error: unknown) {
    logger.error('[callExternalLLM][ERROR]', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      model,
      requestUrl: typeof requestUrl !== 'undefined' ? requestUrl : null,
      payload,
      headers,
    });
    return null;
  }
}

/**
 * Helper function to call external LLM API with fallback models.
 * This function orchestrates the retry and fallback logic for LLM calls.
 */
export async function callLLMWithFallback(
  messages: Message[],
  requestType: string,
  temperature: number = 0.7,
  maxTokens?: number,
  tools?: object[],
  tool_choice?: object | 'none' | 'auto',
  userId?: string | null // Make userId nullable
): Promise<CreateChatCompletionResponse | null> {
  logger.info('[callLLMWithFallback][START]', {
    requestType,
    temperature,
    maxTokens,
    hasTools: !!tools,
    userId,
  });

  try {
    // Get healthy models and select the primary one for the request type
    const healthyModels = checkAllLlmApiKeys()
      .filter((key) => key.present)
      .map((key) => key.modelId);
    const primaryModel = await selectPrimaryModelForRequestType(requestType, healthyModels);

    if (!primaryModel) {
      logger.error(`[callLLMWithFallback] No healthy primary model found for request type: ${requestType}`, { userId });
      return null; // No model available to make the call
    }

    const response = await retry(
      () => callExternalLLM(primaryModel, messages, temperature, maxTokens, tools, tool_choice, userId), // Pass userId here
      3,
      1000,
      shouldRetryLLM
    );
    return response;
  } catch (error: unknown) {
    logger.error('[callLLMWithFallback] Error during LLM call with fallback.', {
      requestType,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      userId, // Pass userId here
    });
    return null;
  }
}

export async function selectPrimaryModelForRequestType(requestType: string, healthyModels: string[]): Promise<string> {
  logger.info('[LLM Model Selection][selectPrimaryModelForRequestType][START]', { requestType, healthyModels });

  let preferredModels: PreferredModels = {};
  try {
    const response = await apiClient.get<{ success: boolean; settings?: PreferredModels; error?: string }>(
      '/api/orion/llm-settings'
    );
    if (response.data.success && response.data.settings) {
      preferredModels = response.data.settings;
      logger.debug('[LLM Model Selection][selectPrimaryModelForRequestType][FETCHED_PREFERENCES]', { preferredModels });
    } else {
      logger.info('[LLM Model Selection][selectPrimaryModelForRequestType][NO_SAVED_PREFERENCES]', {
        message: response.data.error || 'No saved LLM settings found.',
      });
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    logger.error('[LLM Model Selection][selectPrimaryModelForRequestType][FETCH_ERROR]', {
      message: errorMessage,
      originalError: err,
    });
    // Continue with default models if fetching preferences fails
  }

  // 1. Try specific override for the request type
  if (preferredModels.requestTypeOverrides) {
    // Explicitly cast requestType to a string index type
    const specificOverrideModel =
      preferredModels.requestTypeOverrides[requestType as keyof typeof preferredModels.requestTypeOverrides];
    if (typeof specificOverrideModel === 'string' && healthyModels.includes(specificOverrideModel)) {
      logger.info('[LLM Model Selection] Selected specific override model.', { requestType, specificOverrideModel });
      return specificOverrideModel;
    }
  }

  // 2. Try global default model
  const globalDefaultModel = preferredModels.globalDefault;
  if (globalDefaultModel && healthyModels.includes(globalDefaultModel)) {
    logger.info('[LLM Model Selection] Selected global default model.', { requestType, globalDefaultModel });
    return globalDefaultModel;
  }

  // 3. Fallback to hardcoded defaults for request type if no preferred or global default is found, or if they are unhealthy.
  // NOTE: This is the final fallback and should ideally be rarely hit if API settings are configured.
  if (requestType === 'cv_component_tailoring') {
    // Assuming 'azure/gpt-4.1' refers to 'azure/gpt-4.1-turbo' from AVAILABLE_LLM_MODELS.
    const fallbackModel = 'azure/gpt-4.1-turbo';
    if (healthyModels.includes(fallbackModel)) {
      logger.info('[LLM Model Selection] Selected hardcoded default model for cv_component_tailoring.', {
        requestType,
        hardcodedDefault: fallbackModel,
      });
      return fallbackModel;
    }
  }

  // Default fallback if no specific or global override is found and `cv_component_tailoring` fallback is not used or is unhealthy
  const generalFallbackModel = 'groq/llama3-70b-8192'; // A robust general fallback
  if (healthyModels.includes(generalFallbackModel)) {
    logger.info('[LLM Model Selection] Selected general hardcoded default model.', {
      requestType,
      hardcodedDefault: generalFallbackModel,
    });
    return generalFallbackModel;
  }

  // If all else fails, return the first healthy model available
  if (healthyModels.length > 0) {
    const finalFallback = healthyModels[0];
    logger.warn('[LLM Model Selection] Falling back to first available healthy model.', {
      requestType,
      finalFallback,
    });
    return finalFallback;
  }

  // As a last resort, if no healthy models are available (should not happen in production)
  logger.error('[LLM Model Selection] No healthy LLM models available as a fallback. Critical error.', { requestType });
  throw new Error('No healthy LLM models available.');
}

/**
 * Generates a personalized outreach message using an LLM.
 * @param params The outreach request parameters.
 * @returns A promise that resolves to an OutreachResponse containing the generated draft.
 */
export async function generateOutreachMessage(params: {
  outreachRequest: OutreachRequest;
  userProfileData: UserProfileData;
}): Promise<OutreachResponse> {
  const { outreachRequest, userProfileData } = params;
  const { persona, outreachGoal, messageType, tone, length, specificContext, callToAction } = outreachRequest;

  const primaryContext = `
  Generate a ${messageType} for an outreach with the following details:

  Persona to target: ${persona.name} - ${persona.description}
  Outreach Goal: ${outreachGoal}
  Tone: ${tone}
  Length: ${length}
  ${specificContext ? `Specific Context: ${specificContext}` : ''}
  ${callToAction ? `Call to Action: ${callToAction}` : ''}

  User Profile:
  Name: ${userProfileData.name ?? 'N/A'}
  Email: ${userProfileData.email ?? 'N/A'}
  Bio: ${userProfileData.bio ?? 'N/A'}
  Skills: ${(userProfileData.skills || []).join(', ') || 'N/A'}
  Experience: ${(userProfileData.experience || []).join(', ') || 'N/A'}
  Education: ${(userProfileData.education || []).join(', ') || 'N/A'}
  Interests: ${(userProfileData.interests || []).join(', ') || 'N/A'}
  Values: ${(userProfileData.values || []).join(', ') || 'N/A'}
  Social Links: ${(userProfileData.socialLinks || []).map((link: { platform: string; url: string }) => `${link.platform}: ${link.url}`).join(', ') || 'N/A'}
  ${userProfileData.summary ? `Summary: ${userProfileData.summary}` : ''}
  ${userProfileData.backgroundSummary ? `Background Summary: ${userProfileData.backgroundSummary}` : ''}
  ${userProfileData.keySkills ? `Key Skills: ${userProfileData.keySkills.join(', ')}` : ''}
  ${userProfileData.location ? `Location: ${userProfileData.location}` : ''}
  `;

  const messages = constructLlmMessages({
    requestType: REQUEST_TYPES.DRAFT_COMMUNICATION,
    primaryContext: primaryContext,
    profileContext: userProfileData.profileText ?? undefined, // Convert null to undefined
  });

  try {
    const llmResponse = await callLLMWithFallback(
      messages,
      getDefaultModelForRequestType(REQUEST_TYPES.DRAFT_COMMUNICATION)
    );

    if (
      llmResponse &&
      llmResponse.choices &&
      llmResponse.choices.length > 0 &&
      llmResponse.choices[0].message.content &&
      llmResponse.choices[0].message.content.trim()
    ) {
      return {
        success: true,
        draft: llmResponse.choices[0].message.content,
        message: 'Outreach message generated successfully.',
      };
    } else {
      // Handle cases where llmResponse is null or content is missing/invalid
      throw new Error(
        llmResponse === null
          ? 'LLM did not return a valid response.'
          : 'Failed to generate outreach message: Invalid response structure or empty content.'
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[generateOutreachMessage] Error generating outreach message:', errorMessage);
    return { success: false, draft: '', message: `Failed to generate outreach message: ${errorMessage}` };
  }
}

export async function callSequentialThinking({
  thought,
  nextThoughtNeeded,
  thoughtNumber,
  totalThoughts,
}: {
  thought: string;
  nextThoughtNeeded: boolean;
  thoughtNumber: number;
  totalThoughts: number;
}): Promise<LLMSequentialThinkingResponse> {
  /**
   * @fileoverview Function for executing sequential thinking with an LLM.
   * @description This function orchestrates a multi-step reasoning process by interacting with a backend API
   *   that leverages an LLM to generate a sequence of thoughts or steps based on an initial prompt.
   *   It is a core component for agentic workflows where complex problems are broken down iteratively.
   *
   * GOAL OF FILE|FEATURES|FUNCTIONS:
   *   - Send an initial thought or a subsequent thought to a sequential thinking API.
   *   - Receive a structured response from the LLM containing the next thought in a sequence.
   *   - Handle loading states and errors during the sequential thinking process.
   *
   * FILEPATH: `app/lib/orion_llm.ts` (specifically this function).
   *
   * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
   *   - `app/(orion_admin)/admin/narrative-clarity-studio/page.tsx`: Consumes this function for the Sequential Thinking tab UI.
   *   - `app/api/orion/sequential-thinking/route.ts`: (Assumed) The backend API endpoint that this function calls.
   *   - `@/lib/types`: Imports `LLMSequentialThinkingResponse` for typing the function's return value.
   *
   * ASSUMPTIONS & CLEAR COMMENTS:
   *   - Assumes a backend API exists at `/api/orion/sequential-thinking` that can process sequential thought requests.
   *   - The LLM is capable of generating coherent and logical sequential thoughts.
   *
   * NOTES:
   *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE:** This function is a client-side wrapper; the core logic resides in the backend API.
   *   - **PERFORMANCE OPTIMIZATIONS:** API calls are asynchronous. Consider adding caching for common or previously generated sequences to reduce LLM calls.
   *   - **ERROR HANDLING ROBUSTNESS:** Basic error handling is in place. More granular error messages from the API could be propagated.
   *
   * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
   *   The "Sequential Thinking" tab in the Narrative Clarity Studio is envisioned as an incredibly powerful, interactive tool
   *   to guide you through breaking down complex problems, projects, or goals into actionable, AI-supported steps.
   *
   *   **1. Enhanced UI Interaction:**
   *     - **Goal:** Develop a more dynamic and intuitive user interface for managing sequential steps.
   *     - **How to Implement:** Allow users to easily edit, reorder, delete, and add new steps within a sequence directly from the UI. Implement visual progress indicators or "completion" states for each thought.
   *   **2. AI Feedback Loop & Real-time Suggestions:**
   *     - **Goal:** Enable the LLM to provide real-time, interactive feedback and suggestions during the sequential thinking process.
   *     - **How to Implement:** Implement a mechanism where the LLM can analyze the current step or the entire sequence and offer:
   *       - Alternative approaches or branching paths.
   *       - Clarifying questions to refine the user's thinking.
   *       - Suggestions for more detail, conciseness, or actionable language for individual steps.
   *   **3. Persistence & Collaboration:**
   *     - **Goal:** Allow users to save, load, and potentially share entire sequential thinking sessions.
   *     - **How to Implement:** Persist sequential thinking data (including all thoughts, user edits, and AI suggestions) in the WE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILES database or Qdrant. Develop features to load saved sessions and potentially export/import them for collaboration.
   *   **4. Integration with other Modules:**
   *     - **Goal:** Connect generated sequential steps directly to task management or project planning tools.
   *     - **How to Implement:** Once a sequence is satisfactory, offer an option to convert it into a set of tasks in Habitica (e.g., `app/api/orion/habitica/tasks/route.ts`) or a project plan in the Business Management module.
   */
  try {
    const response = await fetch('/api/orion/sequential-thinking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thought, nextThoughtNeeded, thoughtNumber, totalThoughts }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.error || 'Unknown error from sequential thinking API';
      throw new Error(`Failed to call sequential thinking tool: ${errorMessage}`);
    }

    const data = await response.json();
    return data as LLMSequentialThinkingResponse; // Cast to the correct type
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to call sequential thinking tool: ${errorMessage}`);
  }
}
// Model provider configurations
// This was moved from llm_providers.ts as part of consolidation
// export { PROVIDER_MODEL_CONFIGS }; // Removed duplicate export

// Default generation providers (moved from llm_providers.ts)
// export { DEFAULT_GENERATION_PROVIDERS }; // Removed duplicate export

// Synthesizer settings (moved from llm_providers.ts)
// export { SYNTHESIZER_PROVIDER, SYNTHESIZER_MODEL_ID }; // Removed duplicate export

// LLM Call Defaults (moved from llm_providers.ts)
// export { DEFAULT_LLM_TIMEOUT, DEFAULT_SYNTHESIZER_TIMEOUT, BROWSER_CONTEXT_MAX_CHARS, MIN_DRAFT_LENGTH }; // Removed duplicate export
