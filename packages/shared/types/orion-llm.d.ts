/**
 * Type definitions for Orion LLM API
 */

export type RequestType =
  | 'ASK_QUESTION'
  | 'PATTERN_ANALYSIS'
  | 'OPPORTUNITY_EVALUATION'
  | string;

export interface LLMRequestBody {
  requestType: RequestType;
  primaryContext: string;
  profileContext?: string;
  memorySourceTypes?: string[];
  memorySourceTags?: string[];
  prompt?: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  [key: string]: any;
}

export interface LLMMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface LLMResponse {
  success: boolean;
  content?: string;
  model?: string;
  error?: string;
  details?: string;
  usage?: LLMUsage;
  memoryFiltersApplied?: boolean;
}
