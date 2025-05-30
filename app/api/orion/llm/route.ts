import { NextRequest, NextResponse } from "next/server";
import {
  getLlmAnswerWithFallbackAsync,
  LLMParams,
} from "@/lib/orion_llm";
import { API_KEY_ERROR_MESSAGE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { requestType, primaryContext, ...rest } = body;
    if (!requestType || !primaryContext) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameters: requestType and primaryContext",
        },
        { status: 400 }
      );
    }

    const llmParams: LLMParams = { requestType, primaryContext, ...rest };

    const [responseObject, content] = await getLlmAnswerWithFallbackAsync(llmParams.prompt, {
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
