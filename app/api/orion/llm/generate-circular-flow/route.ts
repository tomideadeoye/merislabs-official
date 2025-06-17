import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';

async function getStepsFromLLM(prompt: string, model = 'azure/gpt-4.1') {
  const result = await generateLLMResponse(REQUEST_TYPES.IDEA_BRAINSTORM, prompt, {
    model,
    temperature: 0.7,
    maxTokens: 1000,
    systemContext:
      'You are an AI assistant specialized in generating structured, circular workflow steps based on user prompts. Ensure the steps are logical, actionable, and form a continuous loop. Provide concise and clear steps suitable for a process diagram.',
  });

  if (result.success) {
    if (result.content) {
      const lines = result.content.split(/\n/g);
      const steps = lines
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && /^[\\d\\W]*[a-zA-Z]/.test(line))
        .map((line) => line.replace(/^[\\d\\W]+\\s*/, ''));

      return steps;
    }
  } else {
    console.error(`[GENERATE_CIRCULAR_FLOW_LLM_ERROR] LLM call failed: ${result.error}`);
    throw new Error(result.error || 'LLM generation failed.');
  }
  return [];
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, model } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required.' }, { status: 400 });
    }

    const steps = await getStepsFromLLM(prompt, model);

    return NextResponse.json({ success: true, steps });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('[API_ERROR] Failed to generate circular flow steps:', errorMessage);
    return NextResponse.json(
      { success: false, error: 'Failed to generate circular flow steps', details: errorMessage },
      { status: 500 }
    );
  }
}
