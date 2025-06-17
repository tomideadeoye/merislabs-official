import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@/lib/orion_llm';
import type { CombinedLLMResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { cvContent, jdAnalysis } = await request.json();

    if (!cvContent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: cvContent.',
        },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert CV coach and AI assistant. Given the following CV content, job description analysis, and OrionOpportunity details, provide actionable, specific suggestions to improve the CV for this job. Focus on relevance, clarity, and impact. List at least 3 suggestions, each as a bullet point.

--- CV Content ---
${cvContent}

--- Job Description Analysis ---
${jdAnalysis || 'N/A'}

--- Instructions ---
- Be concise and direct.
- Focus on tailoring the CV to the job requirements.
- Use bullet points.
- Do not rewrite the CV, only provide suggestions.
`;

    const llmResponse: CombinedLLMResponse = await generateLLMResponse('CV_AI_SUGGEST', prompt, {
      temperature: 0.6,
      maxTokens: 300,
    });

    if (!llmResponse.success) {
      return NextResponse.json(
        { success: false, error: llmResponse.error || 'LLM failed to generate suggestions' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, suggestions: llmResponse.content });
  } catch (err: unknown) {
    console.error('[CV AI SUGGEST][ERROR]', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to generate AI suggestions.',
      },
      { status: 500 }
    );
  }
}
