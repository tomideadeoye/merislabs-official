/**
 * Types for LLM providers and models
 */

export type LLMProvider = 
  | 'azure' 
  | 'groq' 
  | 'gemini' 
  | 'mistral' 
  | 'openrouter'
  | 'cohere'
  | 'together_ai';

export interface ModelInfo {
  inputCostPerToken?: number;
  outputCostPerToken?: number;
  contextWindow?: number;
  maxOutputTokens?: number;
}

export interface AzureModelConfig {
  modelId: string;
  apiKeyEnv: string;
  azureEndpointEnv: string;
  apiVersion: string;
  deploymentId: string;
  modelInfo?: ModelInfo;
}

export interface StandardModelConfig {
  modelId: string;
  apiKeyEnv: string;
  apiBase?: string;
  modelInfo?: ModelInfo;
  comment?: string;
}

export type ModelConfig = AzureModelConfig | StandardModelConfig;

export interface ProviderModelConfigs {
  [provider: string]: ModelConfig[];
}

export interface LLMRequestOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  timeout?: number;
}