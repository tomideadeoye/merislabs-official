import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { JD_ANALYSIS_REQUEST_TYPE } from '@/lib/orion_config';

/**
 * API route for performing Job Description (JD) analysis using LLM.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { job_description, opportunity_title, company_name } = body; // Expect job_description, and optionally title/company

    if (!job_description) {
      return NextResponse.json({
        success: false,
        error: 'Job description is required for analysis.'
      }, { status: 400 });
    }

    // Construct the prompt for the LLM
    const prompt = `Analyze the following job description and extract key information relevant for tailoring a CV and evaluating opportunity fit.\n\n${opportunity_title ? `Job Title: ${opportunity_title}\n` : ''}${company_name ? `Company: ${company_name}\n` : ''}\nJob Description:\n${job_description}\n\nProvide a structured analysis including:\n- Key responsibilities and duties.\n- Required skills and qualifications (technical and soft skills).\n- Desired skills or 'nice-to-haves'.\n- Experience requirements (years, specific types of experience).\n- Any specific keywords or themes to emphasize.\n- Company mission, values, or culture points relevant to a candidate.\n\nFormat the output as a clear, easy-to-read text summary.`;

    console.log('[JD_ANALYSIS_API] Sending JD analysis prompt to LLM...');

    // Call the LLM
    const llmResponse = await generateLLMResponse(
        REQUEST_TYPES.JD_ANALYSIS, // Use the JD analysis request type
        prompt, // Pass the constructed prompt
        {
            temperature: 0.5, // Moderate temperature for factual extraction
            max_tokens: 1000 // Allow enough tokens for a detailed analysis
        }
    );

    if (llmResponse.success && llmResponse.content) {
      return NextResponse.json({ success: true, analysis: llmResponse.content });
    } else {
      console.error('[JD_ANALYSIS_API] LLM failed to generate analysis:', llmResponse.error);
      return NextResponse.json({
        success: false,
        error: llmResponse.error || 'Failed to perform JD analysis using LLM'
      }, { status: llmResponse.error ? 500 : 500 });
    }

  } catch (error: any) {
    console.error('[JD_ANALYSIS_API_ERROR]', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred during JD analysis.'
    }, { status: 500 });
  }
}
