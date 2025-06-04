import { NextRequest, NextResponse } from 'next/server';
import { callLLMWithFallback } from '@/lib/orion_llm';

async function getStepsFromLLM(prompt: string, model = 'azure/gpt-4.1') {
  const messages = [{ role: 'user', content: prompt }];
  const result = await callLLMWithFallback(messages, model, 0.7, 1000);
  if (result && result.content) {
    // Parse numbered/bullet list into array
    return result.content
      .split(/\n|\r/)
      .map((s: string) => s.replace(/^\d+\.|^- /, '').trim())
      .filter(Boolean);
  }
  throw new Error('LLM did not return steps');
}

export async function POST(req: NextRequest) {
  try {
    const { description, currentCycle, improvementPrompt } = await req.json();
    let steps: string[] = [];

    if (improvementPrompt && Array.isArray(currentCycle)) {
      const prompt = `Given this cycle: [${currentCycle.join(', ')}]. User prompt: ${improvementPrompt}. Return the improved cycle as an ordered list.`;
      steps = await getStepsFromLLM(prompt);
      if (!Array.isArray(steps) || steps.length < 2) {
        return NextResponse.json({ success: false, error: 'LLM could not extract improved steps.' }, { status: 400 });
      }
      return NextResponse.json({ success: true, steps });
    }

    if (description && typeof description === 'string') {
      const prompt = `Propose a process wheel flow for: ${description}. Return the flow as an ordered list of steps.`;
      steps = await getStepsFromLLM(prompt);
      if (!Array.isArray(steps) || steps.length < 2) {
        return NextResponse.json({ success: false, error: 'LLM could not extract steps from description.' }, { status: 400 });
      }
      return NextResponse.json({ success: true, steps });
    }

    return NextResponse.json({ success: false, error: 'No description provided' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Unknown error' }, { status: 500 });
  }
}
