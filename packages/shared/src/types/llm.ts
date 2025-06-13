// LLM integration types

export interface LLMResponse {
  text: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  model?: string;
}

export interface LLMRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  system_message?: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}