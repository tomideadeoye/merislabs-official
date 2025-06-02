import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@/lib/orion_llm'; // Import LLM utility
import { fetchCVComponents } from '@/lib/cv'; // Import function to fetch all CV components
import { fetchCVComponentsFromNotion } from '@/lib/notion_service'; // Import from notion_service
import { CV_COMPONENT_SELECTION_REQUEST_TYPE } from '@/lib/orion_config'; // Import request type
import { CVComponentShared } from '@/types/orion'; // Import the shared CV component type

/**
 * API route for suggesting CV components based on JD analysis using LLM
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jd_analysis, job_title, company_name } = body;

    if (!jd_analysis) {
      return NextResponse.json({
        success: false,
        error: 'JD analysis is required'
      }, { status: 400 });
    }

    // Fetch all available CV components
    const componentsResult = await fetchCVComponentsFromNotion();
    if (!componentsResult.success) {
         return NextResponse.json({ success: false, error: componentsResult.error }, { status: 500 });
    }
    const allComponents = componentsResult.components;

    if (!allComponents || allComponents.length === 0) {
        return NextResponse.json({ success: false, error: 'No CV components available for suggestion.' }, { status: 404 });
    }

    // Format components for the LLM prompt
    const componentsList = allComponents.map((comp: CVComponentShared) =>
        `ID: ${comp.unique_id}\nName: ${comp.component_name}\nType: ${comp.component_type}\nContent Preview: ${comp.content_primary.substring(0, 200)}...`
    ).join('\n---\n');

    // Construct the prompt for the LLM
    const prompt = `You are an AI assistant specialized in CV tailoring. Based on the following job description analysis, job title, and company name, suggest the most relevant CV components from the provided list of available components. \n\n**Job Details:**\nJob Title: ${job_title || 'N/A'}\nCompany: ${company_name || 'N/A'}\nJob Description Analysis:\n${jd_analysis}\n\n**Available CV Components:**\n${componentsList}\n\n**Instructions:**\nList the unique IDs of the most relevant CV components from the "Available CV Components" list. Prioritize components that directly align with the skills, experience, and requirements mentioned in the Job Description Analysis. Respond ONLY with a comma-separated list of the suggested component unique IDs. Do NOT include any other text, explanation, or formatting.\n\nSuggested Component IDs:`;

    console.log('Sending suggestion prompt to LLM...');

    // Call the LLM
    const llmResponse = await generateLLMResponse(
        CV_COMPONENT_SELECTION_REQUEST_TYPE, // Use specific request type
        prompt, // Pass the constructed prompt
        {
            model: 'deepseek-r1', // Specify a suitable model for this task
            temperature: 0.3, // Lower temperature for more focused suggestions
            max_tokens: 100 // Limit response length as we only expect IDs
        }
    );

    if (llmResponse.success && llmResponse.content) {
      // Parse the LLM's response (comma-separated IDs)
      const suggestedIds = llmResponse.content.split(',').map(id => id.trim()).filter(Boolean);

      // Validate suggested IDs against available components
      const validSuggestedIds = suggestedIds.filter(id =>
          allComponents.some((comp: CVComponentShared) => comp.unique_id === id)
      );

      return NextResponse.json({ success: true, suggested_component_ids: validSuggestedIds });
    } else {
      console.error('LLM failed to provide suggestions:', llmResponse.error);
      return NextResponse.json({
        success: false,
        error: llmResponse.error || 'Failed to get suggestions from LLM'
      }, { status: llmResponse.error ? 500 : 500 }); // Use 500 for LLM errors
    }

  } catch (error: any) {
    console.error('Error in CV component suggestion API:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred in suggestion API'
    }, { status: 500 });
  }
}
