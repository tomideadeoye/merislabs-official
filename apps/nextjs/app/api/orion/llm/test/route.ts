import { NextRequest, NextResponse } from "next/server";
import { PROVIDER_MODEL_CONFIGS } from "@shared/lib/llm_providers";

// Helper function to get API key and endpoint for a model
function getModelConfig(modelId: string): { apiKey: string | null, endpoint?: string, deploymentId?: string, apiVersion?: string, apiBase?: string } {
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
    apiVersion: modelConfig.apiVersion || undefined,
    apiBase: modelConfig.apiBase || undefined
  };
}

// Helper function to make API requests using fetch
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

// Helper function to call external LLM API
async function callExternalLLM(model: string, messages: any[], temperature: number, maxTokens?: number) {
  const { apiKey, endpoint, deploymentId, apiVersion, apiBase } = getModelConfig(model);

  if (!apiKey) {
    throw new Error(`API key not found for model ${model}`);
  }

  // Extract provider from model ID
  const [provider, ...modelParts] = model.split('/');

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

      case 'openrouter': {
        // OpenRouter API call
        const url = apiBase || 'https://openrouter.ai/api/v1/chat/completions';
        const modelName = modelParts.join('/');
        console.log(`Calling OpenRouter API with model ${modelName}`);

        const response = await makeApiRequest(url, {
          model: modelName,
          messages,
          temperature,
          max_tokens: maxTokens || 1000
        }, {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://orion.merislabs.com',
          'X-Title': 'Orion AI System'
        });

        return {
          success: true,
          content: response.choices[0].message.content,
          model: model
        };
      }

      case 'gemini': {
        // Google Gemini API call
        const modelName = model.replace('gemini/', '');
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`;
        console.log(`Calling Gemini API with model ${modelName}`);
        
        // Convert messages to Gemini format
        const geminiMessages = messages.map(msg => ({
          role: msg.role === 'system' ? 'user' : msg.role,
          parts: [{ text: msg.content }]
        }));
        
        const response = await makeApiRequest(url, {
          contents: geminiMessages,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens || 1000
          }
        }, {
          'x-goog-api-key': apiKey
        });
        
        return {
          success: true,
          content: response.candidates[0].content.parts[0].text,
          model: model
        };
      }

      case 'mistral': {
        // Mistral API call
        const url = 'https://api.mistral.ai/v1/chat/completions';
        const modelName = model.replace('mistral/', '');
        console.log(`Calling Mistral API with model ${modelName}`);

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

      case 'cohere': {
        // Cohere API call
        const url = 'https://api.cohere.ai/v1/chat';
        const modelName = model.replace('cohere/', '');
        console.log(`Calling Cohere API with model ${modelName}`);
        
        // Convert messages to Cohere format
        const cohereMessages = messages.map(msg => ({
          role: msg.role,
          message: msg.content
        }));
        
        const response = await makeApiRequest(url, {
          model: modelName,
          chat_history: cohereMessages,
          temperature,
          max_tokens: maxTokens || 1000
        }, {
          'Authorization': `Bearer ${apiKey}`
        });
        
        return {
          success: true,
          content: response.text,
          model: model
        };
      }

      case 'together_ai': {
        // Together AI API call
        const url = 'https://api.together.xyz/v1/completions';
        const modelName = modelParts.join('/');
        console.log(`Calling Together AI API with model ${modelName}`);
        
        const response = await makeApiRequest(url, {
          model: modelName,
          prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
          temperature,
          max_tokens: maxTokens || 1000
        }, {
          'Authorization': `Bearer ${apiKey}`
        });
        
        return {
          success: true,
          content: response.choices[0].text,
          model: model
        };
      }

      default:
        throw new Error(`Provider ${provider} not implemented for model ${model}`);
    }
  } catch (error: any) {
    console.error(`Error calling ${model} API:`, error);
    throw new Error(`Failed to call ${model} API: ${error.message}`);
  }
}

// This endpoint doesn't require authentication for testing purposes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = 'gpt-4.1-mini', temperature = 0.7, max_tokens = 1000 } = body;
    
    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: prompt",
        },
        { status: 400 }
      );
    }

    // Call the LLM with a simple message format
    const result = await callExternalLLM(
      model,
      [{ role: "user", content: prompt }],
      temperature,
      max_tokens
    );

    return NextResponse.json({
      success: true,
      content: result.content,
      model: result.model
    });
  } catch (error: any) {
    console.error("[LLM_TEST_API_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process LLM request",
      },
      { status: 500 }
    );
  }
}