import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@/app/shared';
import { REQUEST_TYPES } from '@/app/shared/orion_llm';
import type { CombinedLLMResponse } from '@/app/shared/types/orion';

/**
 * API route for performing Job Description (JD) analysis using LLM.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { job_description, opportunity_title, company_name } = body; // Expect job_description, and optionally title/company

    if (!job_description) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description is required for analysis.',
        },
        { status: 400 }
      );
    }

    // Construct the prompt for the LLM
    const prompt = `Analyze the following job description and extract key information relevant for tailoring a CV and evaluating OrionOpportunity fit.\n\n${
      opportunity_title ? `Job Title: ${opportunity_title}\n` : ''
    }${
      company_name ? `Company: ${company_name}\n` : ''
    }\nJob Description:\n${job_description}\n\nProvide a structured analysis including:\n- Key responsibilities and duties.\n- Required skills and qualifications (technical and soft skills).\n- Desired skills or 'nice-to-haves'.\n- Experience requirements (years, specific types of experience).\n- Any specific keywords or themes to emphasize.\n- Company mission, values, or culture points relevant to a candidate.\n\nFormat the output as a clear, easy-to-read text summary.`;

    console.log('[JD_ANALYSIS_API] Sending JD analysis prompt to LLM...');

    try {
      const llmResponse: CombinedLLMResponse = await generateLLMResponse(REQUEST_TYPES.JD_ANALYSIS, prompt, {
        maxTokens: 1000, // Only pass defined options
      });

      if (!llmResponse.success) {
        // Handle LLM failure
        throw new Error(llmResponse.error || 'Failed to perform JD analysis using LLM');
      }

      const llmContent: string = llmResponse.content; // Extract content after checking success
      console.log('[JD_ANALYSIS_API] LLM content:', llmContent);
      return NextResponse.json({ success: true, analysis: llmContent });
    } catch (err: unknown) {
      console.error('[JD_ANALYSIS_API] LLM error:', err);
      return NextResponse.json(
        {
          success: false,
          error:
            err instanceof Error // Type narrowing
              ? err.message
              : 'Failed to perform JD analysis using LLM',
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('[JD_ANALYSIS_API_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error // Type narrowing
            ? error.message
            : 'An unexpected error occurred during JD analysis.',
      },
      { status: 500 }
    );
  }
}
