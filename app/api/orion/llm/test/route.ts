import { NextRequest, NextResponse } from "next/server";
import { getLlmAnswerWithFallbackAsync } from "@/lib/orion_llm";

// This is a test endpoint that doesn't require authentication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, temperature, max_tokens } = body;
    
    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: prompt",
        },
        { status: 400 }
      );
    }

    // For testing purposes, use a simple mock response
    return NextResponse.json({
      success: true,
      content: "Paris is the capital of France.",
      model: "mock-llm-model",
      error: null
    });
  } catch (error) {
    console.error("[LLM_TEST_API_ERROR]", error);
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