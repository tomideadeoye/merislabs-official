/**
 * LLM integration module for Orion system in Next.js
 * Handles LLM interactions and message construction
 */

import {
  PROVIDER_MODEL_CONFIGS,
  DEFAULT_GENERATION_PROVIDERS,
} from "./llm_providers";
// import { LLMRequestOptions } from "@repo/shared/types/llm";

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
  shouldRetry: (error: any) => boolean
): Promise<T> {
  let lastError: any;
  let delay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (shouldRetry(error)) {
        const jitter = delay * 0.1 * Math.random(); // Add jitter to avoid thundering herd
        console.warn(
          `[LLM_RETRY] Attempt ${i + 1
          }/${retries} failed with retryable error. Retrying in ${Math.round(
            delay + jitter
          )}ms...`,
          lastError.message
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
const shouldRetryLLM = (error: any): boolean => {
  if (error instanceof Error) {
    // Retry on rate limits or temporary server errors
    if (
      error.message.includes("429") ||
      error.message.includes("500") ||
      error.message.includes("503")
    ) {
      return true;
    }
  }
  return false;
};

// Model fallback configuration
// NOTE: All models in fallback must be implemented and have API keys set in .env.local
const MODEL_FALLBACK_CONFIG: Record<string, string[]> = {
  "azure/gpt-4.1": [
    "azure/DeepSeek-R1",
    "groq/llama3-70b-8192",
    "openrouter/deepseek/deepseek-chat-v3-0324:free",
    "openrouter/google/gemini-2.0-flash-exp:free",
    "openrouter/anthropic/claude-3-5-sonnet",
    "mistral/mistral-large-latest",
    "gemini/gemini-1.5-pro-latest",
  ],
  "azure/DeepSeek-R1": [
    "azure/gpt-4.1",
    "groq/llama3-70b-8192",
    "openrouter/deepseek/deepseek-chat-v3-0324:free",
    "openrouter/google/gemini-2.0-flash-exp:free",
    "openrouter/anthropic/claude-3-5-sonnet",
    "mistral/mistral-large-latest",
    "gemini/gemini-1.5-pro-latest",
  ],
  default: [
    "azure/gpt-4.1",
    "azure/DeepSeek-R1",
    "openrouter/deepseek/deepseek-chat-v3-0324:free",
    "groq/llama3-70b-8192",
    "openrouter/google/gemini-2.0-flash-exp:free",
    "mistral/mistral-large-latest",
    "openrouter/anthropic/claude-3-5-sonnet",
    "gemini/gemini-1.5-pro-latest",
    "groq/gemma2-9b-it",
  ],
};

// Request types
export const REQUEST_TYPES = {
  ASK_QUESTION: "ASK_QUESTION",
  DRAFT_COMMUNICATION: "DRAFT_COMMUNICATION",
  JOURNAL_ENTRY: "JOURNAL_ENTRY",
  OPPORTUNITY_EVALUATION: "OPPORTUNITY_EVALUATION",
  ORION_IMPROVEMENT: "ORION_IMPROVEMENT",
  JD_ANALYSIS: "JD_ANALYSIS",
  CV_COMPONENT_TAILORING: "CV_COMPONENT_TAILORING",
  PROFILE_SUMMARY_TAILORING: "PROFILE_SUMMARY_TAILORING",
  CODE_GENERATION: "CODE_GENERATION",
  CODE_EXPLANATION: "CODE_EXPLANATION",
};

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
    [REQUEST_TYPES.OPPORTUNITY_EVALUATION]: "azure/DeepSeek-R1",
    [REQUEST_TYPES.DRAFT_COMMUNICATION]: "azure/gpt-4.1",
    // Use DeepSeek for general questions and analysis
    [REQUEST_TYPES.ASK_QUESTION]:
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
    [REQUEST_TYPES.JOURNAL_ENTRY]:
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
    // Use specific models for special tasks
    [REQUEST_TYPES.ORION_IMPROVEMENT]: "azure/gpt-4.1",
    // Use OpenRouter for free tier access
    [REQUEST_TYPES.JD_ANALYSIS]: "openrouter/google/gemini-2.0-flash-exp:free",
    [REQUEST_TYPES.CV_COMPONENT_TAILORING]:
      "openrouter/google/gemini-2.0-flash-exp:free",
    [REQUEST_TYPES.PROFILE_SUMMARY_TAILORING]:
      "openrouter/google/gemini-2.0-flash-exp:free",
    // Use DeepSeek Coder for code-related tasks
    [REQUEST_TYPES.CODE_GENERATION]:
      "openrouter/deepseek/deepseek-coder-v2-0324:free",
    [REQUEST_TYPES.CODE_EXPLANATION]:
      "openrouter/deepseek/deepseek-coder-v2-0324:free",
  };

  // Get model for request type or use DeepSeek Chat as default
  return (
    requestTypeModelMap[requestType] ||
    "openrouter/deepseek/deepseek-chat-v3-0324:free"
  );
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
  memoryResults?: any[];
  prompt?: string;
}): Array<{ role: string; content: string }> {
  const messages = [];

  // Add system message based on request type or use provided system context
  if (systemContext) {
    messages.push({ role: "system", content: systemContext });
  } else {
    const systemMessages: Record<string, string> = {
      [REQUEST_TYPES.OPPORTUNITY_EVALUATION]:
        "You are a career strategist and OrionOpportunity evaluator. Analyze opportunities " +
        "based on the profile and context provided. Focus on alignment with skills, " +
        "career goals, and growth potential.",
      [REQUEST_TYPES.ASK_QUESTION]:
        "You are a helpful AI assistant. Provide clear, accurate answers based on " +
        "the context provided. Be concise but thorough.",
      [REQUEST_TYPES.DRAFT_COMMUNICATION]:
        "You are a professional communication expert. Draft clear, well-structured messages " +
        "that maintain appropriate tone and achieve communication objectives effectively.",
      [REQUEST_TYPES.JOURNAL_ENTRY]:
        "You are a thoughtful writing assistant helping to process and structure journal " +
        "entries. Help develop insights while maintaining the authentic voice of the writer.",
      [REQUEST_TYPES.ORION_IMPROVEMENT]:
        "You are a systems improvement specialist. Analyze Orion's functionality and " +
        "suggest concrete, implementable improvements while maintaining system stability.",
      [REQUEST_TYPES.JD_ANALYSIS]:
        "You are a career advisor specializing in job description analysis. Analyze the job description " +
        "to identify key requirements, responsibilities, and alignment with the user's profile.",
      [REQUEST_TYPES.CV_COMPONENT_TAILORING]:
        "You are a CV optimization expert. Tailor CV components to highlight relevant skills and " +
        "experiences that match the job requirements while maintaining authenticity.",
      [REQUEST_TYPES.PROFILE_SUMMARY_TAILORING]:
        "You are a professional profile writer. Create compelling profile summaries that highlight " +
        "key strengths and career narrative aligned with the target OrionOpportunity.",
      [REQUEST_TYPES.CODE_GENERATION]:
        "You are an expert software developer. Generate clean, efficient, and well-documented code " +
        "based on the requirements provided. Include comments and explanations where appropriate.",
      [REQUEST_TYPES.CODE_EXPLANATION]:
        "You are a coding instructor. Explain code in a clear, educational manner, breaking down " +
        "complex concepts and highlighting important patterns and techniques.",
    };

    // Get appropriate system message or use default
    const systemMessage =
      systemMessages[requestType] ||
      "You are a helpful AI assistant. Provide clear and accurate responses while maintaining context.";

    messages.push({ role: "system", content: systemMessage });
  }

  // Add profile context if provided
  if (profileContext) {
    messages.push({
      role: "user",
      content: `Here is relevant profile information:\n${profileContext}`,
    });
  }

  // Add memory results if provided
  if (memoryResults && memoryResults.length > 0) {
    const memoryContext = memoryResults
      .map((item, index) => `Memory ${index + 1}: ${item.text}`)
      .join("\n\n");

    messages.push({
      role: "user",
      content: `Here are relevant memories that may help with your response:\n${memoryContext}`,
    });
  }

  // Add primary context or prompt
  if (primaryContext) {
    messages.push({ role: "user", content: primaryContext });
  } else if (prompt) {
    messages.push({ role: "user", content: prompt });
  }

  return messages;
}

/**
 * Get LLM answer with fallback
 */
export async function getLlmAnswerWithFallback(
  prompt: string,
  options: any = {}
): Promise<[any, string | null]> {
  const { model, temperature = 0.7, max_tokens } = options;

  const initialModel =
    model || "openrouter/deepseek/deepseek-chat-v3-0324:free";
  const modelsToTry = [initialModel, ...getFallbackModels(initialModel)];

  for (const currentModel of modelsToTry) {
    try {
      console.log(`Attempting model ${currentModel}`);

      // Use absolute URL for server-side fetch
      const llmApiUrl =
        typeof window === "undefined"
          ? process.env.NEXTAUTH_URL
            ? process.env.NEXTAUTH_URL.replace(/\/$/, "") + "/api/orion/llm"
            : "http://localhost:3000/api/orion/llm"
          : "/api/orion/llm";
      const response = await fetch(llmApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          model: currentModel,
          temperature,
          maxTokens: max_tokens,
        }),
      });

      const data = await response.json();

      if (data.success) {
        return [data, data.content];
      }
    } catch (error) {
      console.error(`Error with model ${currentModel}:`, error);
      continue;
    }
  }

  console.error("All models and retries exhausted");
  return [null, null];
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
    memoryResults?: any[];
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> {
  const {
    profileContext,
    systemContext,
    memoryResults,
    model,
    temperature,
    maxTokens,
  } = options;

  // Construct the messages payload
  const messages = constructLlmMessages({
    requestType,
    primaryContext,
    systemContext,
    profileContext,
    memoryResults,
  });

  // Determine which model to use
  const primaryModel = model || getDefaultModelForRequestType(requestType);

  try {
    const result = await callLLMWithFallback(
      messages,
      primaryModel,
      temperature,
      maxTokens
    );
    if (!result || !result.choices || result.choices.length === 0) {
      throw new Error("LLM response was empty or invalid.");
    }
    // Handle both Azure and other provider response structures
    const content =
      result.choices[0]?.message?.content || result.choices[0]?.text || null;
    if (content === null) {
      throw new Error("Could not extract content from LLM response.");
    }
    return content;
  } catch (error: any) {
    console.error("Error in generateLLMResponse:", error);
    // The final error from callLLMWithFallback will be thrown here
    throw new Error(
      `Failed to generate LLM response after trying all fallbacks: ${error.message}`
    );
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
  memoryResults?: any[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  tool_choice?: any;
}): Promise<any> {
  const modelId = model || getDefaultModelForRequestType(requestType);
  try {
    // Use absolute URL for server-side fetch
    const llmApiUrl =
      typeof window === "undefined"
        ? process.env.NEXTAUTH_URL
          ? process.env.NEXTAUTH_URL.replace(/\/$/, "") + "/api/orion/llm"
          : "http://localhost:3000/api/orion/llm"
        : "/api/orion/llm";
    const response = await fetch(llmApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType,
        primaryContext,
        profileContext,
        systemContext,
        memoryResults,
        model: modelId,
        temperature,
        maxTokens,
        tools,
        tool_choice,
        // Pass through any other agentic params as needed
      }),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(
        data.error || "Failed to generate LLM response with tools"
      );
    }
    // Return the full LLM response (not just .content)
    return data;
  } catch (error: any) {
    console.error("Error in generateLLMResponseWithTools:", error);
    throw error;
  }
}

// Helper function to make API requests using fetch instead of axios
async function makeApiRequest(
  url: string,
  data: any,
  headers: Record<string, string>
) {
  console.log(`[LLM_API_REQUEST][INFO] Making API request to ${url}`);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      // Specifically handle 404 Not Found without throwing an error for fallback
      if (response.status === 404) {
        const errorText = await response.text();
        console.warn(
          `[LLM_API_REQUEST][WARN] Model not found (404): ${url}. Details: ${errorText}`
        );
        // Return a specific object to indicate a 404 error
        return { error: "MODEL_NOT_FOUND", status: 404 };
      }
      const errorText = await response.text();
      // This custom error will be caught by the retry logic for other server errors
      throw new Error(
        `API request failed with status ${response.status}: ${errorText}`
      );
    }
    return await response.json();
  } catch (error: any) {
    console.error(
      `[LLM_API_REQUEST][ERROR] Error in makeApiRequest for URL ${url}:`,
      error.message
    );
    // Re-throw the error to be handled by the caller (including retry logic)
    throw error;
  }
}

// Helper function to get API key and endpoint for a model
function getModelConfig(modelId: string): {
  apiKey: string | null;
  endpoint?: string;
  deploymentId?: string;
  apiVersion?: string;
  apiBase?: string;
} {
  // Extract provider and model name
  const parts = modelId.split("/");
  const provider = parts[0];
  let modelConfig = null;

  if (modelId.startsWith("azure")) {
    // For Azure models, find by modelId directly
    modelConfig = PROVIDER_MODEL_CONFIGS.azure.find(
      (m) => m.modelId === modelId
    );
  } else if (parts.length > 1) {
    // For other providers with format "provider/model"
    const providerConfigs =
      PROVIDER_MODEL_CONFIGS[provider as keyof typeof PROVIDER_MODEL_CONFIGS];
    if (providerConfigs) {
      modelConfig = providerConfigs.find((m: any) => m.modelId === modelId);
    }
  } else {
    // For simple model names, search across all providers
    for (const [providerName, models] of Object.entries(
      PROVIDER_MODEL_CONFIGS
    )) {
      const found = models.find((m: any) => m.modelId === modelId);
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
  if (provider === "azure" && modelConfig.azureEndpointEnv) {
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
  messages: any[],
  temperature: number,
  maxTokens?: number,
  tools?: any[],
  tool_choice?: any
) {
  console.log(`[callExternalLLM][INFO] Calling model: ${model}`);
  const modelConfig = getModelConfig(model);

  if (!modelConfig.apiKey) {
    console.error(
      `[callExternalLLM][ERROR] API key for model ${model} not found.`
    );
    throw new Error(`API key for model ${model} not found.`);
  }

  const [provider, modelName] = model.split("/");
  let url = "";
  let headers: Record<string, string> = { "Content-Type": "application/json" };
  let body: any = {};

  switch (provider) {
    case "azure":
      if (
        !modelConfig.endpoint ||
        !modelConfig.deploymentId ||
        !modelConfig.apiVersion
      ) {
        throw new Error(`Azure config missing for model ${model}`);
      }
      url = `${modelConfig.endpoint}/openai/deployments/${modelConfig.deploymentId}/chat/completions?api-version=${modelConfig.apiVersion}`;
      headers["api-key"] = modelConfig.apiKey;
      body = {
        messages,
        temperature,
        max_tokens: maxTokens,
        tools,
        tool_choice,
      };
      break;

    case "groq":
      url = "https://api.groq.com/openai/v1/chat/completions";
      headers["Authorization"] = `Bearer ${modelConfig.apiKey}`;
      body = {
        model: modelName,
        messages,
        temperature,
        max_tokens: maxTokens,
        tools,
        tool_choice,
      };
      break;

    case "openrouter":
      url = "https://openrouter.ai/api/v1/chat/completions";
      headers["Authorization"] = `Bearer ${modelConfig.apiKey}`;
      headers["HTTP-Referer"] =
        process.env.NEXTAUTH_URL || "http://localhost:3000";
      headers["X-Title"] = "Orion by Meris";
      body = {
        model: `${provider}/${modelName}`,
        messages,
        temperature,
        max_tokens: maxTokens,
        tools,
        tool_choice,
      };
      break;

    // Add cases for other providers like 'gemini', 'mistral'
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  try {
    // Wrap the API call with the retry logic
    const result = await retry(
      () => makeApiRequest(url, body, headers),
      3,
      2000,
      shouldRetryLLM
    );

    // Check if the model was not found and return null to trigger fallback
    if (result && result.error === "MODEL_NOT_FOUND") {
      return null;
    }

    return result;
  } catch (error: any) {
    console.error(
      `[callExternalLLM][ERROR] Failed to call ${model} API after all retries:`,
      error.message
    );
    // Re-throw the final error to be handled by the fallback mechanism
    throw new Error(`Failed to call ${model} API: ${error.message}`);
  }
}

export async function callLLMWithFallback(
  messages: any[],
  primaryModel: string,
  temperature = 0.7,
  maxTokens = 1000,
  tools?: any[],
  tool_choice?: any
) {
  const modelsToTry = [primaryModel, ...getFallbackModels(primaryModel)];
  let lastError: any;

  for (const model of modelsToTry) {
    try {
      console.log(`[LLM Fallback] Trying model: ${model}`);
      const result = await callExternalLLM(
        model,
        messages,
        temperature,
        maxTokens,
        tools,
        tool_choice
      );

      // If result is null (due to 404), or if there's no valid content, continue to the next model.
      if (result && result.choices && result.choices.length > 0) {
        console.log(`[LLM Fallback] Success with model: ${model}`);
        return result;
      } else if (result === null) {
        // This was a 404, so we log it and move to the next model.
        console.log(
          `[LLM Fallback] Model ${model} not found, trying next model.`
        );
        lastError = new Error(`Model ${model} not found (404).`);
        continue;
      }
    } catch (err: any) {
      console.error(
        `[LLM Fallback] Model ${model} failed with an unexpected error:`,
        err.message
      );
      lastError = err;
      // Continue to the next model if this one fails
      continue;
    }
  }
  // If all models fail, throw the last recorded error
  throw new Error(
    `All LLM providers/models failed. Last error: ${lastError?.message || "Unknown error"
    }`
  );
}

/**
 * Select the primary model for a given request type, using strict order of preference from config.
 * Future: Add cost/speed-based override logic here if needed.
 */
export async function selectPrimaryModelForRequestType(
  requestType: string,
  healthyModels: string[]
): Promise<string> {
  // Define strict order of preference for each request type
  const requestTypeModelOrder: Record<string, string[]> = {
    OPPORTUNITY_EVALUATION: [
      "azure/gpt-4.1",
      "azure/DeepSeek-R1",
      "groq/llama3-70b-8192",
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
    ],
    DRAFT_COMMUNICATION: [
      "azure/gpt-4.1",
      "groq/llama3-70b-8192",
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
    ],
    ASK_QUESTION: [
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
      "azure/gpt-4.1",
      "groq/llama3-70b-8192",
    ],
    JOURNAL_ENTRY: [
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
      "azure/gpt-4.1",
    ],
    ORION_IMPROVEMENT: ["azure/gpt-4.1", "groq/llama3-70b-8192"],
    JD_ANALYSIS: [
      "openrouter/google/gemini-2.0-flash-exp:free",
      "azure/gpt-4.1",
    ],
    CV_COMPONENT_TAILORING: [
      "openrouter/google/gemini-2.0-flash-exp:free",
      "azure/gpt-4.1",
    ],
    PROFILE_SUMMARY_TAILORING: [
      "openrouter/google/gemini-2.0-flash-exp:free",
      "azure/gpt-4.1",
    ],
    CODE_GENERATION: [
      "openrouter/deepseek/deepseek-coder-v2-0324:free",
      "azure/gpt-4.1",
    ],
    CODE_EXPLANATION: [
      "openrouter/deepseek/deepseek-coder-v2-0324:free",
      "azure/gpt-4.1",
    ],
    default: [
      "azure/gpt-4.1",
      "azure/DeepSeek-R1",
      "openrouter/deepseek/deepseek-chat-v3-0324:free",
      "groq/llama3-70b-8192",
    ],
  };
  const order =
    requestTypeModelOrder[requestType] || requestTypeModelOrder.default;
  // Pick the first healthy model in the order
  for (const model of order) {
    if (healthyModels.includes(model)) {
      console.log(
        `[LLM Model Selection] Selected primary model for ${requestType}: ${model}`
      );
      return model;
    }
  }
  // Fallback: just pick the first healthy model
  if (healthyModels.length > 0) {
    console.log(
      `[LLM Model Selection] No preferred model healthy, using: ${healthyModels[0]}`
    );
    return healthyModels[0];
  }
  throw new Error("No healthy LLM models available");
}
