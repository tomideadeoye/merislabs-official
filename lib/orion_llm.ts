/**
 * LLM integration module for Orion system in Next.js
 * Handles LLM interactions and message construction
 */

import { PROVIDER_MODEL_CONFIGS, DEFAULT_GENERATION_PROVIDERS } from './llm_providers';
import { LLMRequestOptions } from '@/types/llm';

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
  "default": [
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
    [REQUEST_TYPES.OPPORTUNITY_EVALUATION]: "azure/gpt-4.1",
    [REQUEST_TYPES.DRAFT_COMMUNICATION]: "azure/gpt-4.1",
    // Use DeepSeek for general questions and analysis
    [REQUEST_TYPES.ASK_QUESTION]: "openrouter/deepseek/deepseek-chat-v3-0324:free",
    [REQUEST_TYPES.JOURNAL_ENTRY]: "openrouter/deepseek/deepseek-chat-v3-0324:free",
    // Use specific models for special tasks
    [REQUEST_TYPES.ORION_IMPROVEMENT]: "azure/gpt-4.1",
    // Use OpenRouter for free tier access
    [REQUEST_TYPES.JD_ANALYSIS]: "openrouter/google/gemini-2.0-flash-exp:free",
    [REQUEST_TYPES.CV_COMPONENT_TAILORING]: "openrouter/google/gemini-2.0-flash-exp:free",
    [REQUEST_TYPES.PROFILE_SUMMARY_TAILORING]: "openrouter/google/gemini-2.0-flash-exp:free",
    // Use DeepSeek Coder for code-related tasks
    [REQUEST_TYPES.CODE_GENERATION]: "openrouter/deepseek/deepseek-coder-v2-0324:free",
    [REQUEST_TYPES.CODE_EXPLANATION]: "openrouter/deepseek/deepseek-coder-v2-0324:free",
  };

  // Get model for request type or use DeepSeek Chat as default
  return requestTypeModelMap[requestType] || "openrouter/deepseek/deepseek-chat-v3-0324:free";
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
        "You are a career strategist and opportunity evaluator. Analyze opportunities " +
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
        "key strengths and career narrative aligned with the target opportunity.",
      [REQUEST_TYPES.CODE_GENERATION]:
        "You are an expert software developer. Generate clean, efficient, and well-documented code " +
        "based on the requirements provided. Include comments and explanations where appropriate.",
      [REQUEST_TYPES.CODE_EXPLANATION]:
        "You are a coding instructor. Explain code in a clear, educational manner, breaking down " +
        "complex concepts and highlighting important patterns and techniques.",
    };

    // Get appropriate system message or use default
    const systemMessage = systemMessages[requestType] ||
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
    const memoryContext = memoryResults.map((item, index) =>
      `Memory ${index + 1}: ${item.text}`
    ).join('\n\n');

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
  options: LLMRequestOptions = {}
): Promise<[any, string | null]> {
  const { model, temperature = 0.7, max_tokens } = options;

  const initialModel = model || "openrouter/deepseek/deepseek-chat-v3-0324:free";
  const modelsToTry = [initialModel, ...getFallbackModels(initialModel)];

  for (const currentModel of modelsToTry) {
    try {
      console.log(`Attempting model ${currentModel}`);

      const response = await fetch('/api/orion/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          model: currentModel,
          temperature,
          maxTokens: max_tokens
        })
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
  const { profileContext, systemContext, memoryResults, model, temperature, maxTokens } = options;

  // Determine which model to use
  const modelId = model || getDefaultModelForRequestType(requestType);

  try {
    const response = await fetch('/api/orion/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestType,
        primaryContext,
        profileContext,
        systemContext,
        memoryResults,
        model: modelId,
        temperature,
        maxTokens
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate LLM response');
    }

    return data.content;
  } catch (error: any) {
    console.error('Error in generateLLMResponse:', error);
    throw error;
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
    const response = await fetch('/api/orion/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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
      })
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to generate LLM response with tools');
    }
    // Return the full LLM response (not just .content)
    return data;
  } catch (error: any) {
    console.error('Error in generateLLMResponseWithTools:', error);
    throw error;
  }
}

// Helper function to make API requests using fetch instead of axios
async function makeApiRequest(url: string, data: any, headers: Record<string, string>) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// Helper function to get API key and endpoint for a model
function getModelConfig(modelId: string): { apiKey: string | null, endpoint?: string, deploymentId?: string, apiVersion?: string, apiBase?: string } {
  // Extract provider and model name
  const parts = modelId.split('/');
  const provider = parts[0];
  let modelConfig = null;

  if (modelId.startsWith('azure')) {
    // For Azure models, find by modelId directly
    modelConfig = PROVIDER_MODEL_CONFIGS.azure.find(m => m.modelId === modelId);
  } else if (parts.length > 1) {
    // For other providers with format "provider/model"
    const providerConfigs = PROVIDER_MODEL_CONFIGS[provider as keyof typeof PROVIDER_MODEL_CONFIGS];
    if (providerConfigs) {
      modelConfig = providerConfigs.find((m: any) => m.modelId === modelId);
    }
  } else {
    // For simple model names, search across all providers
    for (const [providerName, models] of Object.entries(PROVIDER_MODEL_CONFIGS)) {
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
  if (provider === 'azure' && modelConfig.azureEndpointEnv) {
    endpoint = process.env[modelConfig.azureEndpointEnv] || undefined;
  }

  return {
    apiKey,
    endpoint,
    deploymentId: modelConfig.deploymentId || undefined,
    apiVersion: modelConfig.apiVersion || undefined,
    apiBase: modelConfig.apiBase || undefined
  };
}

// Helper function to call external LLM API
export async function callExternalLLM(model: string, messages: any[], temperature: number, maxTokens?: number, tools?: any[], tool_choice?: any) {
  const { apiKey, endpoint, deploymentId, apiVersion, apiBase } = getModelConfig(model);

  console.log(`[LLM] Model: ${model}`);
  console.log(`[LLM] Endpoint: ${endpoint}`);
  console.log(`[LLM] DeploymentId: ${deploymentId}`);
  console.log(`[LLM] API Version: ${apiVersion}`);
  console.log(`[LLM] Messages:`, JSON.stringify(messages));
  if (!apiKey) {
    console.error(`[LLM] API key not found for model ${model}`);
    throw new Error(`API key not found for model ${model}`);
  }

  // Extract provider from model ID
  const [provider, ...modelParts] = model.split('/');

  try {
    switch (provider) {
      case 'azure': {
        // Ensure endpoint is just the base URL, not the full path
        let baseEndpoint = endpoint || '';
        // Remove any trailing slashes
        baseEndpoint = baseEndpoint.replace(/\/+$/, '');
        // If the endpoint already contains '/openai/deployments/', strip it
        const azurePath = `/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;
        if (baseEndpoint.includes('/openai/deployments/')) {
          // Remove everything after the base domain
          baseEndpoint = baseEndpoint.split('/openai/deployments/')[0];
        }
        const url = `${baseEndpoint}${azurePath}`;
        const payload: any = {
          messages,
          temperature,
          max_tokens: maxTokens || 1000,
          stream: false
        };
        if (tools) payload.tools = tools;
        if (tool_choice) payload.tool_choice = tool_choice;
        console.log(`[LLM] Request URL: ${url}`);
        console.log(`[LLM] Request Payload:`, JSON.stringify(payload));
        const response = await makeApiRequest(url, payload, {
          'api-key': apiKey
        });
        console.log(`[LLM] Response:`, JSON.stringify(response));
        return {
          success: true,
          rawLLMResponse: response,
          content: response.choices[0].message.content,
          model: model
        };
      }
      case 'groq': {
        // Groq API call
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const modelName = model.replace('groq/', '');
        console.log(`Calling Groq API with model ${modelName}`);
        const payload: any = {
          model: modelName,
          messages,
          temperature,
          max_tokens: maxTokens || 1000
        };
        if (tools) payload.tools = tools;
        if (tool_choice) payload.tool_choice = tool_choice;
        const response = await makeApiRequest(url, payload, {
          'Authorization': `Bearer ${apiKey}`
        });
        return {
          success: true,
          rawLLMResponse: response,
          content: response.choices[0].message.content,
          model: model
        };
      }
      case 'openrouter': {
        // OpenRouter API call
        const url = apiBase || 'https://openrouter.ai/api/v1/chat/completions';
        const modelName = modelParts.join('/');
        console.log(`Calling OpenRouter API with model ${modelName}`);
        const payload: any = {
          model: modelName,
          messages,
          temperature,
          max_tokens: maxTokens || 1000
        };
        if (tools) payload.tools = tools;
        if (tool_choice) payload.tool_choice = tool_choice;
        const response = await makeApiRequest(url, payload, {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://orion.merislabs.com',
          'X-Title': 'Orion AI System'
        });
        return {
          success: true,
          rawLLMResponse: response,
          content: response.choices[0].message.content,
          model: model
        };
      }
      case 'gemini': {
        // Google Gemini API call
        const modelName = model.replace('gemini/', '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        console.log(`Calling Gemini API with model ${modelName}`);

        // Convert messages to Gemini format
        const geminiMessages = messages.map(msg => ({
          role: msg.role === 'system' ? 'user' : msg.role,
          parts: [{ text: msg.content }]
        }));

        const response = await makeApiRequest(url, {
          contents: geminiMessages,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens || 1000
          }
        }, {
          'x-goog-api-key': apiKey
        });

        return {
          success: true,
          rawLLMResponse: response,
          content: response.candidates[0].content.parts[0].text,
          model: model
        };
      }
      case 'mistral': {
        // Mistral API call
        const url = 'https://api.mistral.ai/v1/chat/completions';
        const modelName = model.replace('mistral/', '');
        console.log(`Calling Mistral API with model ${modelName}`);

        const response = await makeApiRequest(url, {
          model: modelName,
          messages,
          temperature,
          max_tokens: maxTokens || 1000
        }, {
          'Authorization': `Bearer ${apiKey}`
        });

        return {
          success: true,
          content: response.choices[0].message.content,
          model: model
        };
      }
      case 'cohere': {
        // Cohere API call
        const url = 'https://api.cohere.ai/v1/chat';
        const modelName = model.replace('cohere/', '');
        console.log(`Calling Cohere API with model ${modelName}`);

        // Convert messages to Cohere format
        const cohereMessages = messages.map(msg => ({
          role: msg.role,
          message: msg.content
        }));

        const response = await makeApiRequest(url, {
          model: modelName,
          chat_history: cohereMessages,
          temperature,
          max_tokens: maxTokens || 1000
        }, {
          'Authorization': `Bearer ${apiKey}`
        });

        return {
          success: true,
          content: response.text,
          model: model
        };
      }
      case 'together_ai': {
        // Together AI API call
        const url = 'https://api.together.xyz/v1/completions';
        const modelName = modelParts.join('/');
        console.log(`Calling Together AI API with model ${modelName}`);

        const response = await makeApiRequest(url, {
          model: modelName,
          prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
          temperature,
          max_tokens: maxTokens || 1000
        }, {
          'Authorization': `Bearer ${apiKey}`
        });

        return {
          success: true,
          content: response.choices[0].text,
          model: model
        };
      }
      default:
        console.error(`[LLM] Provider ${provider} not implemented for model ${model}`);
        throw new Error(`Provider ${provider} not implemented for model ${model}`);
    }
  } catch (error: any) {
    console.error(`[LLM] Error calling ${model} API:`, error);
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
  for (const model of modelsToTry) {
    try {
      console.log(`[LLM Fallback] Trying model: ${model}`);
      const result = await callExternalLLM(model, messages, temperature, maxTokens, tools, tool_choice);
      if (result && result.content) {
        console.log(`[LLM Fallback] Success with model: ${model}`);
        return result;
      }
    } catch (err: any) {
      console.error(`[LLM Fallback] Model ${model} failed:`, err.message);
      continue;
    }
  }
  throw new Error('All LLM providers/models failed.');
}

/**
 * Select the primary model for a given request type, using strict order of preference from config.
 * Future: Add cost/speed-based override logic here if needed.
 */
export async function selectPrimaryModelForRequestType(requestType: string, healthyModels: string[]): Promise<string> {
  // Define strict order of preference for each request type
  const requestTypeModelOrder: Record<string, string[]> = {
    OPPORTUNITY_EVALUATION: ["azure/gpt-4.1", "azure/DeepSeek-R1", "groq/llama3-70b-8192", "openrouter/deepseek/deepseek-chat-v3-0324:free"],
    DRAFT_COMMUNICATION: ["azure/gpt-4.1", "groq/llama3-70b-8192", "openrouter/deepseek/deepseek-chat-v3-0324:free"],
    ASK_QUESTION: ["openrouter/deepseek/deepseek-chat-v3-0324:free", "azure/gpt-4.1", "groq/llama3-70b-8192"],
    JOURNAL_ENTRY: ["openrouter/deepseek/deepseek-chat-v3-0324:free", "azure/gpt-4.1"],
    ORION_IMPROVEMENT: ["azure/gpt-4.1", "groq/llama3-70b-8192"],
    JD_ANALYSIS: ["openrouter/google/gemini-2.0-flash-exp:free", "azure/gpt-4.1"],
    CV_COMPONENT_TAILORING: ["openrouter/google/gemini-2.0-flash-exp:free", "azure/gpt-4.1"],
    PROFILE_SUMMARY_TAILORING: ["openrouter/google/gemini-2.0-flash-exp:free", "azure/gpt-4.1"],
    CODE_GENERATION: ["openrouter/deepseek/deepseek-coder-v2-0324:free", "azure/gpt-4.1"],
    CODE_EXPLANATION: ["openrouter/deepseek/deepseek-coder-v2-0324:free", "azure/gpt-4.1"],
    default: ["azure/gpt-4.1", "azure/DeepSeek-R1", "openrouter/deepseek/deepseek-chat-v3-0324:free", "groq/llama3-70b-8192"]
  };
  const order = requestTypeModelOrder[requestType] || requestTypeModelOrder.default;
  // Pick the first healthy model in the order
  for (const model of order) {
    if (healthyModels.includes(model)) {
      console.log(`[LLM Model Selection] Selected primary model for ${requestType}: ${model}`);
      return model;
    }
  }
  // Fallback: just pick the first healthy model
  if (healthyModels.length > 0) {
    console.log(`[LLM Model Selection] No preferred model healthy, using: ${healthyModels[0]}`);
    return healthyModels[0];
  }
  throw new Error('No healthy LLM models available');
}
