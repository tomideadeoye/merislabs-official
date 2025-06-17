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
} from '@/lib/types';
import { LLMModelConfig } from '@/lib/types/llm'; // Ensure LLMModelConfig is imported from the consolidated types file

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
export const PROVIDER_MODEL_CONFIGS: Record<string, LLMModelConfig[]> = {
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
      apiKeyEnv: 'GROQ_API_KEY',
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
    for (const model of models as LLMModelConfig[]) {
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
  ASK_QUESTION: 'ASK_QUESTION',
  DRAFT_COMMUNICATION: 'DRAFT_COMMUNICATION',
  JOURNAL_ENTRY: 'JOURNAL_ENTRY',
  OPPORTUNITY_EVALUATION: 'OPPORTUNITY_EVALUATION',
  ORION_IMPROVEMENT: 'ORION_IMPROVEMENT',
  JD_ANALYSIS: 'JD_ANALYSIS',
  CV_COMPONENT_TAILORING: 'CV_COMPONENT_TAILORING',
  PROFILE_SUMMARY_TAILORING: 'PROFILE_SUMMARY_TAILORING',
  CODE_GENERATION: 'CODE_GENERATION',
  CODE_EXPLANATION: 'CODE_EXPLANATION',
  IDEA_BRAINSTORM: 'IDEA_BRAINSTORM',
  WHATSAPP_CHAT_ANALYSIS: 'WHATSAPP_CHAT_ANALYSIS',
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
}: {
  requestType: string;
  primaryContext?: string;
  systemContext?: string;
  profileContext?: string;
  memoryResults?: ScoredMemoryPoint[];
  prompt?: string;
}): Message[] {
  const messages: Message[] = [];

  // Add system message based on request type or use provided system context
  if (systemContext) {
    messages.push({ role: 'system', content: systemContext });
  } else {
    const systemMessages: Record<string, string> = {
      [REQUEST_TYPES.OPPORTUNITY_EVALUATION]:
        'You are a career strategist and OrionOpportunity evaluator. Analyze opportunities ' +
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
        'key strengths and career narrative aligned with the target OrionOpportunity.',
      [REQUEST_TYPES.CODE_GENERATION]:
        'You are an expert software developer. Generate clean, efficient, and well-documented code ' +
        'based on the requirements provided. Include comments and explanations where appropriate.',
      [REQUEST_TYPES.CODE_EXPLANATION]:
        'You are a coding instructor. Explain code in a clear, educational manner, breaking down ' +
        'complex concepts and highlighting important patterns and techniques.',
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
      content: `Here is relevant profile information:\n${profileContext}`,
    });
  }

  // Add memory results if provided
  if (memoryResults && memoryResults.length > 0) {
    const memoryContext = memoryResults.map((item, index) => `Memory ${index + 1}: ${item.payload.text}`).join('\n\n');

    messages.push({
      role: 'user',
      content: `Here are relevant memories that may help with your response:\n${memoryContext}`,
    });
  }

  // Add primary context or prompt
  if (primaryContext) {
    messages.push({ role: 'user', content: primaryContext });
  } else if (prompt) {
    messages.push({ role: 'user', content: prompt });
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
  primaryContext: string,
  options: {
    profileContext?: string;
    systemContext?: string;
    memoryResults?: ScoredMemoryPoint[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<CombinedLLMResponse> {
  const messages = constructLlmMessages({
    requestType,
    primaryContext,
    systemContext: options.systemContext,
    profileContext: options.profileContext,
    memoryResults: options.memoryResults,
  });

  const modelToUse = options.model || getDefaultModelForRequestType(requestType);

  try {
    const response = await callExternalLLM(modelToUse, messages, options.temperature || 0.7, options.maxTokens || 1000);

    if (response && response.choices && response.choices.length > 0) {
      const content = response.choices[0].message?.content;
      if (content) {
        return {
          success: true,
          content,
          model: modelToUse,
          temperature: options.temperature || 0.7,
          maxTokens: options.maxTokens || 1000,
        };
      }
    }
    return { success: false, error: 'LLM response was empty or malformed.' };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/**
 * Generate LLM response with tool/function calling support (for agentic workflows)
 * Sends tools and tool_choice to the backend LLM API and returns the full response (including tool_calls)
 */
export async function generateLLMResponseWithTools({
  requestType,
  primaryContext,
  profileContext,
  systemContext,
  memoryResults,
  model,
  temperature,
  maxTokens,
  tools,
  tool_choice,
}: {
  requestType: string;
  primaryContext: string;
  profileContext?: string;
  systemContext?: string;
  memoryResults?: unknown[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: object[];
  tool_choice?: object | 'none' | 'auto';
}): Promise<CombinedLLMResponse> {
  const messages = constructLlmMessages({
    requestType,
    primaryContext,
    systemContext,
    profileContext,
    memoryResults: memoryResults as ScoredMemoryPoint[], // Cast to ScoredMemoryPoint[]
  });

  const modelToUse = model || getDefaultModelForRequestType(requestType);

  try {
    const response = await callExternalLLM(
      modelToUse,
      messages,
      temperature || 0.7,
      maxTokens || 1000,
      tools,
      tool_choice
    );

    if (response && response.choices && response.choices.length > 0) {
      const message = response.choices[0].message;
      if (message.tool_calls && message.tool_calls.length > 0) {
        return {
          success: true,
          content: message.content || '',
          tool_calls: message.tool_calls,
          model: modelToUse,
          temperature: temperature || 0.7,
          maxTokens: maxTokens || 1000,
        };
      } else if (message.content) {
        return {
          success: true,
          content: message.content,
          model: modelToUse,
          temperature: temperature || 0.7,
          maxTokens: maxTokens || 1000,
        };
      }
    }
    return { success: false, error: 'LLM response was empty or malformed.' };
  } catch (error: unknown) {
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
export function getModelConfig(modelId: string): {
  apiKey: string | null;
  endpoint?: string;
  deploymentId?: string;
  apiVersion?: string;
  apiBase?: string;
} {
  // Extract provider and model name
  const parts = modelId.split('/');
  const provider = parts[0];
  let modelConfig = null;

  if (modelId.startsWith('azure')) {
    // For Azure models, find by modelId directly
    modelConfig = PROVIDER_MODEL_CONFIGS.azure.find((m) => m.modelId === modelId);
  } else if (parts.length > 1) {
    // For other providers with format "provider/model"
    const providerConfigs = PROVIDER_MODEL_CONFIGS[provider as keyof typeof PROVIDER_MODEL_CONFIGS];
    if (providerConfigs) {
      modelConfig = providerConfigs.find((m: LLMModelConfig) => m.modelId === modelId);
    }
  } else {
    // For simple model names, search across all providers
    for (const [, /* intentionally unused */ models] of Object.entries(PROVIDER_MODEL_CONFIGS)) {
      const found = (models as LLMModelConfig[]).find((m: LLMModelConfig) => m.modelId === modelId);
      if (found) {
        modelConfig = found;
        break;
      }
    }
  }

  if (!modelConfig) {
    console.error(`Model config not found for ${modelId}`);
    return { apiKey: null };
  }

  // Get API key from environment variable
  const apiKey = process.env[modelConfig.apiKeyEnv] || null;

  // For Azure, get endpoint from environment variable
  let endpoint;
  if (provider === 'azure' && modelConfig.azureEndpointEnv) {
    endpoint = process.env[modelConfig.azureEndpointEnv] || undefined;
  }

  return {
    apiKey,
    endpoint,
    deploymentId: modelConfig.deploymentId || undefined,
    apiVersion: modelConfig.apiVersion || undefined,
    apiBase: modelConfig.apiBase || undefined,
  };
}

// Helper function to call external LLM API
export async function callExternalLLM(
  model: string,
  messages: Message[],
  temperature: number,
  maxTokens?: number,
  tools?: object[],
  tool_choice?: object | 'none' | 'auto'
): Promise<CreateChatCompletionResponse | null> {
  console.log(`[callExternalLLM][INFO] Calling model: ${model}`);
  const modelConfig = getModelConfig(model);

  if (!modelConfig.apiKey) {
    console.error(`[callExternalLLM][ERROR] API key for model ${model} not found.`);
    throw new Error(`API key for model ${model} not found.`);
  }

  const [provider, modelName] = model.split('/');
  let url = '';
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const body: {
    messages: Message[];
    temperature: number;
    max_tokens?: number;
    tools?: object[];
    tool_choice?: object | 'none' | 'auto';
    model?: string;
  } = { messages, temperature, max_tokens: maxTokens, tools, tool_choice };

  switch (provider) {
    case 'azure':
      if (!modelConfig.endpoint || !modelConfig.deploymentId || !modelConfig.apiVersion) {
        throw new Error(`Azure config missing for model ${model}`);
      }
      url = `${modelConfig.endpoint}/openai/deployments/${modelConfig.deploymentId}/chat/completions?api-version=${modelConfig.apiVersion}`;
      headers['api-key'] = modelConfig.apiKey;
      // body structure already aligned with openai
      break;

    case 'groq':
      url = 'https://api.groq.com/openai/v1/chat/completions';
      headers['Authorization'] = `Bearer ${modelConfig.apiKey}`;
      body.model = modelName;
      break;

    case 'openrouter':
      url = 'https://openrouter.ai/api/v1/chat/completions';
      headers['Authorization'] = `Bearer ${modelConfig.apiKey}`;
      headers['HTTP-Referer'] = process.env.NEXTAUTH_URL || 'http://localhost:3000';
      headers['X-Title'] = 'Orion by Meris';
      body.model = `${provider}/${modelName}`;
      break;

    // Add cases for other providers like 'gemini', 'mistral'
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  try {
    // Wrap the API call with the retry logic
    const result = await retry(() => makeApiRequest(url, body, headers), 3, 2000, shouldRetryLLM);

    // Check if the model was not found and return null to trigger fallback
    if (result && (result as { error?: string }).error === 'MODEL_NOT_FOUND') {
      return null;
    }

    return result as CreateChatCompletionResponse; // Cast to expected response type
  } catch (error: unknown) {
    console.error(
      `[callExternalLLM][ERROR] Failed to call ${model} API after all retries:`,
      error instanceof Error ? error.message : String(error)
    );
    // Re-throw the final error to be handled by the fallback mechanism
    throw new Error(`Failed to call ${model} API: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function callLLMWithFallback(
  messages: Message[],
  primaryModel: string,
  temperature = 0.7,
  maxTokens = 1000,
  tools?: object[],
  tool_choice?: object | 'none' | 'auto'
): Promise<CreateChatCompletionResponse | null> {
  const modelsToTry = [primaryModel, ...getFallbackModels(primaryModel)];
  let lastError: unknown;

  for (const model of modelsToTry) {
    try {
      console.log(`[LLM Fallback] Trying model: ${model}`);
      const result = await callExternalLLM(model, messages, temperature, maxTokens, tools, tool_choice);

      // If result is null (due to 404), or if there's no valid content, continue to the next model.
      if (
        result &&
        result.choices &&
        result.choices.length > 0 &&
        result.choices[0].message.content &&
        result.choices[0].message.content.trim()
      ) {
        console.log(`[LLM Fallback] Success with model: ${model}`);
        return result; // Return the full CreateChatCompletionResponse
      } else if (result === null) {
        // This was a 404, so we log it and move to the next model.
        console.log(`[LLM Fallback] Model ${model} not found, trying next model.`);
        lastError = new Error(`Model ${model} not found (404).`);
        continue;
      } else {
        // Log if result is not null but also not valid (e.g., missing choices or content)
        console.warn(`[LLM Fallback] Model ${model} returned an invalid response structure.`);
        lastError = new Error(`Invalid response structure from model ${model}.`);
        continue;
      }
    } catch (err: unknown) {
      console.error(
        `[LLM Fallback] Model ${model} failed with an unexpected error:`,
        err instanceof Error ? err.message : String(err)
      );
      lastError = err;
      // Continue to the next model if this one fails
      continue;
    }
  }
  // If all models fail, throw the last recorded error
  throw new Error(
    `All LLM providers/models failed. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`
  );
}

/**
 * Select the primary model for a given request type, using strict order of preference from config.
 * Future: Add cost/speed-based override logic here if needed.
 */
export async function selectPrimaryModelForRequestType(requestType: string, healthyModels: string[]): Promise<string> {
  const defaultModel = getDefaultModelForRequestType(requestType);
  if (healthyModels.includes(defaultModel)) {
    console.log(`[LLM Model Selection] Selected primary model for ${requestType}: ${defaultModel}`);
    return defaultModel;
  }

  // If the default model for the request type is not healthy, try to find a healthy fallback
  const fallbackModels = getFallbackModels(defaultModel);
  for (const fallbackModel of fallbackModels) {
    if (healthyModels.includes(fallbackModel)) {
      console.log(`[LLM Model Selection] Selected fallback model for ${requestType}: ${fallbackModel}`);
      return fallbackModel;
    }
  }

  // If no specific or fallback model is healthy, return the first healthy model available
  if (healthyModels.length > 0) {
    console.log(`[LLM Model Selection] No preferred model healthy, using: ${healthyModels[0]}`);
    return healthyModels[0];
  }

  throw new Error('No healthy LLM models available');
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
  Name: ${userProfileData.name}
  Email: ${userProfileData.email}
  Bio: ${userProfileData.bio}
  Skills: ${userProfileData.skills.join(', ')}
  Experience: ${userProfileData.experience.join(', ')}
  Education: ${userProfileData.education.join(', ')}
  Interests: ${userProfileData.interests.join(', ')}
  Values: ${userProfileData.values.join(', ')}
  Social Links: ${userProfileData.socialLinks.map((link) => `${link.platform}: ${link.url}`).join(', ')}
  ${userProfileData.summary ? `Summary: ${userProfileData.summary}` : ''}
  ${userProfileData.backgroundSummary ? `Background Summary: ${userProfileData.backgroundSummary}` : ''}
  ${userProfileData.keySkills ? `Key Skills: ${userProfileData.keySkills.join(', ')}` : ''}
  ${userProfileData.location ? `Location: ${userProfileData.location}` : ''}
  `;

  const messages = constructLlmMessages({
    requestType: REQUEST_TYPES.DRAFT_COMMUNICATION,
    primaryContext: primaryContext,
    profileContext: userProfileData.profileText, // Assuming profileText is available
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
