import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@shared/lib/orion_llm';

export async function POST(request: NextRequest) {
  try {
    const { cvContent, opportunity, jdAnalysis } = await request.json();

    if (!cvContent || !opportunity) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: cvContent and opportunity.' },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert CV coach and AI assistant. Given the following CV content, job description analysis, and opportunity details, provide actionable, specific suggestions to improve the CV for this job. Focus on relevance, clarity, and impact. List at least 3 suggestions, each as a bullet point.

--- CV Content ---
${cvContent}

--- Job Description Analysis ---
${jdAnalysis || 'N/A'}

--- Opportunity Details ---
Title: ${opportunity.title || 'N/A'}
Company: ${opportunity.company || 'N/A'}
Description: ${opportunity.description || 'N/A'}

--- Instructions ---
- Be concise and direct.
- Focus on tailoring the CV to the job requirements.
- Use bullet points.
- Do not rewrite the CV, only provide suggestions.
`;

    const llmContent = await generateLLMResponse('CV_AI_SUGGEST', prompt, { temperature: 0.6, maxTokens: 300 });

    return NextResponse.json({ success: true, suggestions: llmContent });
  } catch (err: any) {
    console.error('[CV AI SUGGEST][ERROR]', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate AI suggestions.' },
      { status: 500 }
    );
  }
}
