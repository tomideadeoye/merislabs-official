// LLM integration types
// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// Note if any: components to merge with, similar or redundant component, next steps if any

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
