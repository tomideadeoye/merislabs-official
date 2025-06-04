import { NextRequest, NextResponse } from "next/server";
import { PROVIDER_MODEL_CONFIGS } from "@/lib/llm_providers";
import { constructLlmMessages, getDefaultModelForRequestType, callExternalLLM } from "@/lib/orion_llm";
import type { ScoredMemoryPoint, QdrantFilter, QdrantFilterCondition } from "@/types/orion";
import { ASK_QUESTION_REQUEST_TYPE, ORION_MEMORY_COLLECTION_NAME } from "@/lib/orion_config";

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
      tools,
      tool_choice,
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

    // Call the LLM with tools/tool_choice if provided
    const result = await callExternalLLM(
      modelToUse,
      messages,
      temperature,
      maxTokens || undefined,
      tools,
      tool_choice
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
