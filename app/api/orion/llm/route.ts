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
      temperature,
      maxTokens,
      memoryResults,
      profileContext,
      primaryContext,
      systemContext,
      tools,
      tool_choice,
    } = body;

    // Defensive: Always set model, temperature, maxTokens to safe defaults
    const safeRequestType = requestType || ASK_QUESTION_REQUEST_TYPE;
    const modelToUse = typeof model === 'string' && model.length > 0
      ? model
      : getDefaultModelForRequestType(safeRequestType);
    const safeTemperature = typeof temperature === 'number' && !isNaN(temperature) ? temperature : 0.7;
    const safeMaxTokens = typeof maxTokens === 'number' && !isNaN(maxTokens) ? maxTokens : 1000;

    // Construct messages for the LLM
    const messages = constructLlmMessages({
      requestType: safeRequestType,
      primaryContext,
      systemContext,
      profileContext,
      memoryResults,
      prompt,
    });

    // Call the LLM with tools/tool_choice if provided
    let result = null;
    try {
      result = await callExternalLLM(
        modelToUse,
        messages,
        safeTemperature,
        safeMaxTokens,
        tools,
        tool_choice
      );
    } catch (err) {
      console.error('[LLM API][callExternalLLM][EXCEPTION]', err);
      return NextResponse.json({ success: false, error: 'LLM call failed: ' + (err instanceof Error ? err.message : String(err)) }, { status: 500 });
    }

    // Validate result
    if (!result || typeof result !== 'object' || !('success' in result)) {
      return NextResponse.json({ success: false, error: 'LLM returned invalid response' }, { status: 500 });
    }

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
