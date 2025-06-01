import { NextRequest, NextResponse } from "next/server";
import { PROVIDER_MODEL_CONFIGS } from "@/lib/llm_providers";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = 'gpt-4.1-mini', temperature = 0.7, max_tokens = 1000 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Format messages for the LLM
    const messages = [
      { role: "user", content: prompt }
    ];

    // Extract provider from model ID
    const [provider] = model.split('/');
    const { apiKey, endpoint, deploymentId, apiVersion } = getModelConfig(model);

    if (!apiKey) {
      return NextResponse.json({ error: `API key not found for model ${model}` }, { status: 500 });
    }

    try {
      let result;
      
      // Call the appropriate API based on provider
      switch (provider) {
        case 'azure': {
          const url = `${endpoint}/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}`;
          const response = await makeApiRequest(url, {
            messages,
            temperature,
            max_tokens,
            stream: false
          }, {
            'api-key': apiKey
          });
          
          result = {
            content: response.choices[0].message.content,
            model
          };
          break;
        }
        
        case 'groq': {
          const url = 'https://api.groq.com/openai/v1/chat/completions';
          const modelName = model.replace('groq/', '');
          
          const response = await makeApiRequest(url, {
            model: modelName,
            messages,
            temperature,
            max_tokens
          }, {
            'Authorization': `Bearer ${apiKey}`
          });
          
          result = {
            content: response.choices[0].message.content,
            model
          };
          break;
        }
        
        // Add other provider implementations as needed
        
        default:
          return NextResponse.json({ error: `Provider ${provider} not implemented` }, { status: 501 });
      }
      
      return NextResponse.json(result);
    } catch (error: any) {
      console.error(`Error calling ${model} API:`, error);
      return NextResponse.json({ error: `API call failed: ${error.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error("LLM test error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}