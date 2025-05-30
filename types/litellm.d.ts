declare module 'litellm' {
  export const completion: any;
  export const embedding: any;
  export let model_list: any[];

  export interface ModelListEntry {
    model_name: string;
    litellm_params: Record<string, any>;
    model_info?: ModelInfo;
  }

  export interface ModelInfo {
    input_cost_per_token?: number;
    output_cost_per_token?: number;
    context_window?: number;
    max_output_tokens?: number;
  }
}
