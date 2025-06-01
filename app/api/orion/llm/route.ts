import { NextRequest, NextResponse } from "next/server";
import { PROVIDER_MODEL_CONFIGS } from "@/lib/llm_providers";
import { constructLlmMessages, getDefaultModelForRequestType } from "@/lib/orion_llm";
import type { ScoredMemoryPoint, QdrantFilter, QdrantFilterCondition } from "@/types/orion";
import { ASK_QUESTION_REQUEST_TYPE, ORION_MEMORY_COLLECTION_NAME } from "@/lib/orion_config";

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
function getModelConfig(modelId: string): { apiKey: string | null, endpoint?: string, deploymentId?: string, apiVersion?: string } {
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
    apiVersion: modelConfig.apiVersion || undefined
  };
}

// Helper function to call external LLM API
async function callExternalLLM(model: string, messages: any[], temperature: number, maxTokens?: number) {
  const { apiKey, endpoint, deploymentId, apiVersion } = getModelConfig(model);

  if (!apiKey) {
    throw new Error(`API key not found for model ${model}`);
  }

  // Extract provider from model ID
  const [provider] = model.split('/');

  try {
    // Implement provider-specific API calls
    switch (provider) {
      case 'azure': {
        // Azure OpenAI API call
        const url = `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;
        console.log(`Calling Azure API at ${url}`);

        const response = await makeApiRequest(url, {
          messages,
          temperature,
          max_tokens: maxTokens || 1000,
          stream: false
        }, {
          'api-key': apiKey
        });

        return {
          success: true,
          content: response.choices[0].message.content,
          model: model
        };
      }

      case 'groq': {
        // Groq API call
        const url = 'https://api.groq.com/openai/v1/chat/completions';
        const modelName = model.replace('groq/', '');
        console.log(`Calling Groq API with model ${modelName}`);

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

      // Add other provider implementations as needed

      default:
        throw new Error(`Provider ${provider} not implemented for model ${model}`);
    }
  } catch (error: any) {
    console.error(`Error calling ${model} API:`, error);
    throw new Error(`Failed to call ${model} API: ${error.message}`);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      requestType = ASK_QUESTION_REQUEST_TYPE,
      model,
      temperature = 0.7,
      maxTokens,
      memoryFilter,
      memoryResults,
      profileContext,
      primaryContext,
      systemContext,
    } = body;

    // Determine which model to use
    const modelToUse = model || getDefaultModelForRequestType(requestType);
    
    // Construct messages for the LLM
    const messages = constructLlmMessages({
      requestType,
      primaryContext,
      systemContext,
      profileContext,
      memoryResults,
      prompt,
    });

    // Call the LLM
    const result = await callExternalLLM(
      modelToUse,
      messages,
      temperature,
      maxTokens || undefined
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("LLM API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}