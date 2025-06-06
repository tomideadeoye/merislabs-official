import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@/lib/orion_llm'; // Import LLM utility
import { fetchCVComponents } from '@/lib/cv'; // Import function to fetch all CV components
import { fetchCVComponentsFromNotion } from '@/lib/notion_service'; // Import from notion_service
import { CV_SUMMARY_TAILORING_REQUEST_TYPE } from '@/lib/orion_config'; // Import request type
import { CVComponentShared } from '@/types/orion'; // Import the shared CV component type

/**
 * API route for tailoring a CV summary based on JD analysis using LLM
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { component_id, jd_analysis, web_research_context } = body;

    if (!component_id || !jd_analysis) {
      return NextResponse.json({
        success: false,
        error: 'Component ID and JD analysis are required'
      }, { status: 400 });
    }

    // Fetch the specific component (assuming it's the profile summary)
    const componentsResult = await fetchCVComponentsFromNotion();
    if (!componentsResult.success || !componentsResult.components) {
      return NextResponse.json({ success: false, error: componentsResult.error || 'Failed to fetch CV components' }, { status: 500 });
    }
    const summaryComponent = componentsResult.components.find((comp: CVComponentShared) => comp.unique_id === component_id && comp.component_type === 'Profile Summary');

    if (!summaryComponent) {
        return NextResponse.json({ success: false, error: 'Profile Summary component not found with provided ID.' }, { status: 404 });
    }

    const originalSummaryContent = summaryComponent.content_primary;

    // Construct the prompt for the LLM
    const prompt = `You are an expert CV writer. Tailor the following profile summary to be highly relevant to the provided job description analysis and company. Focus on aligning my skills and experience with the job requirements and the company's context. \n\n**Original Profile Summary:**\n${originalSummaryContent}\n\n**Job Description Analysis:**\n${jd_analysis}\n\n${web_research_context ? `**Relevant Web Research Context (Company Info, etc.):**\n${web_research_context}\n\n` : ''}**Instructions:**\nWrite a compelling and concise profile summary (4-5 sentences) based on the original summary, the job description analysis, and web research context. Highlight the most relevant experiences and skills. Maintain a professional tone. Provide ONLY the tailored summary, without any introductory or concluding remarks.`;

    console.log(`Sending summary tailoring prompt for component ${component_id} to LLM...`);

    // Call the LLM
    try {
      const llmContent = await generateLLMResponse(
        CV_SUMMARY_TAILORING_REQUEST_TYPE, // Use specific request type
        prompt, // Pass the constructed prompt
        {
          temperature: 0.7, // Moderate temperature for creative tailoring
          maxTokens: 200 // Limit response length for a concise summary
        }
      );
      return NextResponse.json({ success: true, tailored_content: llmContent });
    } catch (err: any) {
      console.error('LLM failed to tailor summary:', err);
      return NextResponse.json({
        success: false,
        error: err.message || 'Failed to tailor summary using LLM'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error in CV summary tailoring API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred in summary tailoring API'
    }, { status: 500 });
  }
}
