import { NextRequest, NextResponse } from 'next/server';
import { constructLlmMessages, getDefaultModelForRequestType, callExternalLLM } from '@/lib/orion_llm';
import { ASK_QUESTION_REQUEST_TYPE } from '@/lib/orion_config';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      prompt,
      requestType = ASK_QUESTION_REQUEST_TYPE,
      model,
      temperature = 0.7,
      maxTokens,
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
    const result = await callExternalLLM(modelToUse, messages, temperature, maxTokens || undefined, tools, tool_choice);

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An error occurred',
        message: `LLM API call failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
