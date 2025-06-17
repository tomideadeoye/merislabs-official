// LLM integration types
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, next steps if any

export interface LLMModelConfig {
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

export interface Persona {
  id: string;
  name: string;
  company?: string;
  role?: string;
  industry?: string;
  values?: string[];
  challenges?: string[];
  interests?: string[];
  valueProposition?: string;
  notes?: string;
  tags?: string[];
}

export interface LLMConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface LLMRequest {
  prompt: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: 'text' | 'json_object';
}

export interface LLMToolCall {
  id: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface LLMToolOutput {
  tool_call_id: string;
  output: string;
}

export interface Message {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  tool_calls?: LLMToolCall[];
  tool_call_id?: string;
}

export interface LLMResponse {
  content: string;
  tool_calls?: LLMToolCall[];
}

export interface CreateChatCompletionRequest {
  messages: Message[];
  model: string;
  temperature?: number;
  max_tokens?: number;
  tools?: {
    type: string;
    function: {
      name: string;
      description?: string;
      parameters: object;
    };
  }[];
  tool_choice?:
    | 'none'
    | 'auto'
    | {
        type: 'function';
        function: {
          name: string;
        };
      };
}

export interface CreateChatCompletionResponse {
  id: string;
  choices: {
    finish_reason: string;
    index: number;
    message: Message;
  }[];
  created: number;
  model: string;
  service_tier: string | null;
  system_fingerprint: string;
  object: string;
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface LLMRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  responseFormat?: 'text' | 'json_object';
}
