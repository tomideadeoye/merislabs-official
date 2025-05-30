declare module 'litellm' {
  interface ModelConfig {
    model_name: string;
    litellm_params: {
      model: string;
      api_key?: string;
      api_base?: string;
      api_version?: string;
    };
    model_info?: {
      input_cost_per_token?: number;
      output_cost_per_token?: number;
      context_window?: number;
      max_output_tokens?: number;
    };
  }

  export function initialize(config: { models: ModelConfig[] }): Promise<void>;

  export interface ChatCompletion {
    choices: Array<{
      message: {
        content: string;
      };
    }>;
  }

  export function completion(params: {
    messages: Array<{ role: string; content: string }>;
    model: string;
    temperature?: number;
  }): Promise<ChatCompletion>;

  // Add other LiteLLM exports as needed
}
