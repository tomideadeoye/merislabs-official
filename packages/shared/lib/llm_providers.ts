/**
 * LLM Provider configurations for Orion
 */

// Orion LLM Provider Configs
//
// Each provider/model must have the following environment variables set in .env.local:
//   - AZURE_OPENAI_API_KEY, AZURE_OPENAI_ENDPOINT (for azure/gpt-4.1)
//   - AZURE_DEEPSEEK_API_KEY, AZURE_DEEPSEEK_ENDPOINT (for azure/DeepSeek-R1, if separate resource)
//   - GROQ_API_KEY (for groq/*)
//   - OPEN_ROUTER_API_KEY (for openrouter/*)
//   - GEMINI_API_KEY (for gemini/*)
//   - MISTRAL_API_KEY (for mistral/*)
//   - ...etc.
//
// If two Azure deployments share the same resource, use the same endpoint/key for both.
//
// Future: Add cost/speed override logic here for dynamic model selection.
//
// All models must be implemented in callExternalLLM and have health check support.
//
// Maintainers: Update this file and .env.local together.

interface ModelConfig {
  modelId: string;
  apiKeyEnv: string;
  azureEndpointEnv?: string;
  deploymentId?: string;
  apiVersion?: string;
  modelInfo?: {
    inputCostPerToken?: number;
    outputCostPerToken?: number;
    contextWindow?: number;
    maxOutputTokens?: number;
  };
  comment?: string;
  apiBase?: string;
}

export const DEFAULT_GENERATION_PROVIDERS = ["azure", "groq", "gemini", "mistral", "openrouter", "cohere", "together_ai"];

export const SYNTHESIZER_PROVIDER = "gemini";
export const SYNTHESIZER_MODEL_ID = "gemini/gemini-1.5-pro-latest";

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
export const PROVIDER_MODEL_CONFIGS: Record<string, ModelConfig[]> = {
  // Azure Models
  "azure": [
    {
      modelId: "azure/gpt-4.1",
      apiKeyEnv: "AZURE_OPENAI_API_KEY",
      azureEndpointEnv: "AZURE_OPENAI_ENDPOINT",
      apiVersion: "2025-01-01-preview",
      deploymentId: "gpt-4.1",
      modelInfo: {
        inputCostPerToken: 0.0000015,
        outputCostPerToken: 0.000002,
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
    },
    // DeepSeek-R1 as Azure deployment
    {
      modelId: "azure/DeepSeek-R1",
      apiKeyEnv: "AZURE_DEEPSEEK_API_KEY",
      azureEndpointEnv: "AZURE_DEEPSEEK_ENDPOINT",
      apiVersion: "2024-05-01-preview",
      deploymentId: "DeepSeek-R1",
      modelInfo: {
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
      comment: "DeepSeek-R1 model deployed on Azure OpenAI",
    },
  ],

  // Groq Models
  "groq": [
    {
      modelId: "groq/llama3-70b-8192",
      apiKeyEnv: "GROQ_API_KEY",
      modelInfo: {
        inputCostPerToken: 0.0000,
        outputCostPerToken: 0.0000,
        contextWindow: 8192,
        maxOutputTokens: 4096,
      },
      comment: "Current Llama3 70b on Groq",
    },
    {
      modelId: "groq/gemma2-9b-it",
      apiKeyEnv: "GROQ_API_KEY",
      comment: "Current Gemma2 9b on Groq",
    },
    {
      modelId: "groq/llama-3.1-70b-versatile",
      apiKeyEnv: "GROQ_API_KEY",
      comment: "Recommended replacement for Llama 3.1 and Tool Use models",
    },
    {
      modelId: "groq/mistral-hermes-24b",
      apiKeyEnv: "GROQ_API_KEY",
      comment: "Recommended replacement for Mixtral 8x7B",
    },
    {
      modelId: "groq/deepseek-r1-distill-qwen-32b",
      apiKeyEnv: "GROQ_API_KEY",
      comment: "Recommended reasoning model, replaced specdec Llama",
    },
  ],

  // OpenRouter Models
  "openrouter": [
    {
      modelId: "openrouter/mistralai/mistral-7b-instruct",
      apiKeyEnv: "OPEN_ROUTER_API_KEY",
      apiBase: "https://openrouter.ai/api/v1",
      comment: "Example free/low-cost model on OpenRouter",
    },
    {
      modelId: "openrouter/google/gemini-2.0-flash-exp:free",
      apiKeyEnv: "OPEN_ROUTER_API_KEY",
      apiBase: "https://openrouter.ai/api/v1",
      modelInfo: {
        contextWindow: 128000,
        maxOutputTokens: 8192,
      },
      comment: "Gemini 2.0 Flash experimental free tier via OpenRouter",
    },
    {
      modelId: "openrouter/deepseek/deepseek-chat-v3-0324:free",
      apiKeyEnv: "OPEN_ROUTER_API_KEY",
      apiBase: "https://openrouter.ai/api/v1",
      modelInfo: {
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
      comment: "DeepSeek Chat v3 free tier via OpenRouter",
    },
    {
      modelId: "openrouter/deepseek/deepseek-coder-v2-0324:free",
      apiKeyEnv: "OPEN_ROUTER_API_KEY",
      apiBase: "https://openrouter.ai/api/v1",
      modelInfo: {
        contextWindow: 32768,
        maxOutputTokens: 4096,
      },
      comment: "DeepSeek Coder v2 free tier via OpenRouter",
    },
    {
      modelId: "openrouter/anthropic/claude-3-5-sonnet",
      apiKeyEnv: "OPEN_ROUTER_API_KEY",
      apiBase: "https://openrouter.ai/api/v1",
      comment: "Anthropic Claude 3.5 Sonnet via OpenRouter",
    },
  ],

  // Mistral Models
  "mistral": [
    {
      modelId: "mistral/mistral-large-latest",
      apiKeyEnv: "MISTRAL_API_KEY",
    },
    {
      modelId: "mistral/mistral-small-latest",
      apiKeyEnv: "MISTRAL_API_KEY",
      comment: "Use latest small",
    },
  ],

  // Gemini Models
  "gemini": [
    {
      modelId: "gemini/gemini-1.5-pro-latest",
      apiKeyEnv: "GEMINI_API_KEY",
      comment: "Gemini 1.5 Pro via Google AI Studio",
    },
    {
      modelId: "gemini/gemini-1.5-flash-latest",
      apiKeyEnv: "GEMINI_API_KEY",
      comment: "Gemini 1.5 Flash via Google AI Studio",
    },
  ],

  // Cohere Models
  "cohere": [
    {
      modelId: "cohere/command-r-plus",
      apiKeyEnv: "COHERE_API_KEY",
      comment: "Capable Cohere model",
    },
  ],

  // Together AI Models
  "together_ai": [
    {
      modelId: "together_ai/meta-llama/Llama-3.1-70B-Instruct-hf",
      apiKeyEnv: "TOGETHER_API_KEY",
    },
    {
      modelId: "together_ai/Qwen/Qwen2-72B-Instruct",
      apiKeyEnv: "TOGETHER_API_KEY",
    },
  ],
};

// Utility: Check for all required LLM API keys
export function checkAllLlmApiKeys() {
  const results: { modelId: string; provider: string; apiKeyEnv: string; present: boolean }[] = [];
  for (const [provider, models] of Object.entries(PROVIDER_MODEL_CONFIGS)) {
    for (const model of models) {
      if (model.apiKeyEnv) {
        results.push({
          modelId: model.modelId,
          provider,
          apiKeyEnv: model.apiKeyEnv,
          present: Boolean(process.env[model.apiKeyEnv]),
        });
      }
    }
  }
  return results;
}
