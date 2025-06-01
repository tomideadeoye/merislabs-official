import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { API_KEY_ERROR_MESSAGE } from "@/lib/constants";
import { ASK_QUESTION_REQUEST_TYPE, ORION_MEMORY_COLLECTION_NAME } from "@/lib/orion_config";
import { PROVIDER_MODEL_CONFIGS, DEFAULT_GENERATION_PROVIDERS } from "@/lib/llm_providers";
import { constructLlmMessages, getDefaultModelForRequestType } from "@/lib/orion_llm";
import type { ScoredMemoryPoint, QdrantFilter, QdrantFilterCondition } from "@/types/orion";

// Helper function to get API key for a model
function getApiKeyForModel(modelId: string): string | null {
  // Find the provider for this model
  const provider = Object.entries(PROVIDER_MODEL_CONFIGS).find(([_, models]) => 
    models.some(model => model.modelId === modelId)
  )?.[0];
  
  if (!provider) return null;
  
  // Find the model config
  const modelConfig = PROVIDER_MODEL_CONFIGS[provider].find(m => m.modelId === modelId);
  if (!modelConfig) return null;
  
  // Get the API key from environment variables
  return process.env[modelConfig.apiKeyEnv] || null;
}

// Helper function to call external LLM API
async function callExternalLLM(model: string, messages: any[], temperature: number, maxTokens?: number) {
  const apiKey = getApiKeyForModel(model);
  if (!apiKey) {
    throw new Error(`API key not found for model ${model}`);
  }
  
  // Extract provider from model ID
  const [provider] = model.split('/');
  
  // Implement provider-specific API calls
  switch (provider) {
    case 'azure':
      // Azure implementation would go here
      break;
    case 'groq':
      // Groq implementation would go here
      break;
    case 'gemini':
      // Gemini implementation would go here
      break;
    // Add other providers as needed
    default:
      // Mock implementation for testing
      return {
        success: true,
        content: `This is a mock response from ${model}. In production, this would call the actual LLM API.`,
        model
      };
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const { 
      requestType, 
      primaryContext, 
      profileContext, 
      memorySourceTypes, 
      memorySourceTags,
      prompt,
      model,
      temperature = 0.7,
      max_tokens,
      ...rest 
    } = body;
    
    // If this is a direct prompt request, bypass the complex processing
    if (prompt) {
      // Call LLM with the provided prompt
      try {
        const modelToUse = model || getDefaultModelForRequestType(requestType || 'ASK_QUESTION');
        const result = await callExternalLLM(
          modelToUse, 
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
        console.error("[LLM_API_ERROR]", error);
        return NextResponse.json({
          success: false,
          error: API_KEY_ERROR_MESSAGE,
          details: error.message
        }, { status: 500 });
      }
    }
    
    // For regular requests, require requestType and primaryContext
    if (!requestType || !primaryContext) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: requestType and primaryContext",
        },
        { status: 400 }
      );
    }

    let enhancedPrompt = primaryContext;

    // RAG implementation for Ask Question
    if (requestType === ASK_QUESTION_REQUEST_TYPE) {
      const userQuestion = primaryContext;
      let retrievedContext = "";
      const MAX_CONTEXT_SNIPPETS = 5;

      try {
        console.log(`[ASK_ORION_API] Searching memory for question: "${userQuestion.substring(0, 50)}..."`);
        
        // Construct filter based on memory source types and tags
        const filterConditions: QdrantFilterCondition[] = [];
        
        if (memorySourceTypes && memorySourceTypes.length > 0) {
          memorySourceTypes.forEach((type: string) => {
            filterConditions.push({ 
              key: "payload.type", 
              match: { value: type } 
            });
          });
        }
        
        if (memorySourceTags && memorySourceTags.length > 0) {
          memorySourceTags.forEach((tag: string) => {
            filterConditions.push({ 
              key: "payload.tags", 
              match: { value: tag.toLowerCase() } 
            });
          });
        }
        
        const qdrantFilter: QdrantFilter | null = filterConditions.length > 0 
          ? { should: filterConditions } 
          : null;
        
        // Search memory for relevant context
        const memorySearchResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            queryText: userQuestion,
            collectionName: ORION_MEMORY_COLLECTION_NAME,
            limit: MAX_CONTEXT_SNIPPETS,
            filter: qdrantFilter
          })
        });
        
        const memorySearchData = await memorySearchResponse.json();

        if (memorySearchData.success && memorySearchData.results && memorySearchData.results.length > 0) {
          const snippets = memorySearchData.results.map((item: ScoredMemoryPoint, index: number) => 
            `Memory ${index + 1} (Source: ${item.payload.source_id}, Type: ${item.payload.type || "unknown"}, Score: ${item.score.toFixed(4)}):\\n${item.payload.text}`
          ).join("\\n\\n---\\n\\n");
          
          const filterDescription = qdrantFilter 
            ? " (filtered by your specified memory types/tags)" 
            : "";
            
          retrievedContext = `\\n\\nBased on your stored memories${filterDescription}, here is some potentially relevant context:\\n--- START OF RETRIEVED MEMORIES ---\\n${snippets}\\n--- END OF RETRIEVED MEMORIES ---\\n`;
          console.log(`[ASK_ORION_API] Retrieved ${memorySearchData.results.length} relevant memories.`);
        }
      } catch (memError: any) {
        console.error(`[ASK_ORION_API] Error during memory search: ${memError.message}`);
        // Continue without memory context if search fails
      }

      // Construct the enhanced prompt with retrieved memories
      enhancedPrompt = `
You are Orion, Tomide's AI Life-Architecture System. Your persona is supportive, empathetic, insightful, structured, reliable, and positive, addressing him as "my love" or "Tomide".

${profileContext ? `Tomide's Profile Context:\\n${profileContext}\\n\\n` : ''}
${retrievedContext}
Considering all the above context (especially the retrieved memories if any), please provide a comprehensive and insightful answer to Tomide's following question:

Question: "${userQuestion}"

Provide your answer directly. If using retrieved memories, synthesize them into your answer naturally rather than just listing them. If no specific memories were highly relevant, answer based on the question and profile context.
      `;
    }

    // Construct messages for the LLM
    const messages = constructLlmMessages(
      requestType,
      enhancedPrompt,
      profileContext,
      rest.question
    );

    // Determine which model to use
    const modelToUse = model || getDefaultModelForRequestType(requestType);

    try {
      // Call the LLM
      const result = await callExternalLLM(
        modelToUse,
        messages,
        temperature,
        max_tokens
      );

      return NextResponse.json({
        success: true,
        content: result.content,
        model: result.model,
        memoryFiltersApplied: !!(memorySourceTypes || memorySourceTags)
      });
    } catch (error: any) {
      console.error("[LLM_API_ERROR]", error);
      return NextResponse.json({
        success: false,
        error: API_KEY_ERROR_MESSAGE,
        details: error.message
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("[LLM_API_ROUTE_ERROR]", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process LLM request.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}