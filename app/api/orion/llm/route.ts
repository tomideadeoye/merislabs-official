import { NextRequest, NextResponse } from "next/server";
import {
  getLlmAnswerWithFallbackAsync,
  LLMParams,
} from "@/lib/orion_llm";
import { API_KEY_ERROR_MESSAGE } from "@/lib/constants";
import { auth } from "@/auth";
import { ASK_QUESTION_REQUEST_TYPE, ORION_MEMORY_COLLECTION_NAME } from "@/lib/orion_config";
import type { ScoredMemoryPoint, QdrantFilter, QdrantFilterCondition } from "@/types/orion";

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
      ...rest 
    } = body;
    
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
        
        // Log filter for debugging
        if (qdrantFilter) {
          console.log(`[ASK_ORION_API] Using memory filter:`, JSON.stringify(qdrantFilter));
        }
        
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
            `Memory ${index + 1} (Source: ${item.payload.source_id}, Type: ${item.payload.type || "unknown"}, Score: ${item.score.toFixed(4)}):\n${item.payload.text}`
          ).join("\n\n---\n\n");
          
          const filterDescription = qdrantFilter 
            ? " (filtered by your specified memory types/tags)" 
            : "";
            
          retrievedContext = `\n\nBased on your stored memories${filterDescription}, here is some potentially relevant context:\n--- START OF RETRIEVED MEMORIES ---\n${snippets}\n--- END OF RETRIEVED MEMORIES ---\n`;
          console.log(`[ASK_ORION_API] Retrieved ${memorySearchData.results.length} relevant memories.`);
        } else {
          const noResultsReason = qdrantFilter 
            ? " with the specified filters" 
            : "";
            
          console.log(`[ASK_ORION_API] No specific relevant memories found${noResultsReason}.`);
        }
      } catch (memError: any) {
        console.error(`[ASK_ORION_API] Error during memory search: ${memError.message}`);
        // Continue without memory context if search fails
      }

      // Construct the enhanced prompt with retrieved memories
      enhancedPrompt = `
You are Orion, Tomide's AI Life-Architecture System. Your persona is supportive, empathetic, insightful, structured, reliable, and positive, addressing him as "my love" or "Tomide".

${profileContext ? `Tomide's Profile Context:\n${profileContext}\n\n` : ''}
${retrievedContext}
Considering all the above context (especially the retrieved memories if any), please provide a comprehensive and insightful answer to Tomide's following question:

Question: "${userQuestion}"

Provide your answer directly. If using retrieved memories, synthesize them into your answer naturally rather than just listing them. If no specific memories were highly relevant, answer based on the question and profile context.
      `;
    }

    const llmParams: LLMParams = { 
      requestType, 
      primaryContext: enhancedPrompt, 
      profileContext,
      ...rest 
    };

    // Create a prompt from primaryContext if prompt is not provided
    const prompt = llmParams.prompt || enhancedPrompt;
    const [responseObject, content] = await getLlmAnswerWithFallbackAsync(prompt, {
      model: llmParams.model,
      temperature: llmParams.temperature,
      timeout: llmParams.max_tokens ? Math.ceil(llmParams.max_tokens / 50) : undefined
    });

    if (!responseObject.success && responseObject.error === API_KEY_ERROR_MESSAGE) {
      console.error(`[LLM_API_ERROR] API Key related error for model: ${responseObject.model}`);
      return NextResponse.json(
        {
          success: false,
          error: API_KEY_ERROR_MESSAGE,
          details: `API key issue with model ${responseObject.model}. Please check server logs and configuration.`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: responseObject.success,
      content,
      model: responseObject.model,
      error: responseObject.error,
      memoryFiltersApplied: !!(memorySourceTypes || memorySourceTags)
    });
  } catch (error) {
    console.error("[LLM_API_ROUTE_ERROR]", error);
    let errorMessage = "Failed to get LLM answer due to an internal server error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process LLM request.",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}