import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse } from '@/lib/orion_llm'; // Corrected import
import { getCVComponentsFromNotion } from '@/lib/notion_service'; // Corrected import
import { CV_COMPONENT_SELECTION_REQUEST_TYPE } from '@/lib/orion_config';
import type { CVComponent, CombinedLLMResponse } from '@/lib/types'; // Corrected import

/**
 * API route to suggest CV components based on JD analysis and web research context.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jd_analysis, web_research_context } = body;

    if (!jd_analysis) {
      return NextResponse.json(
        {
          success: false,
          error: 'Job description analysis is required',
        },
        { status: 400 }
      );
    }

    const allComponents: CVComponent[] = await getCVComponentsFromNotion();

    // Construct the prompt for the LLM
    const prompt = `You are an expert CV writer. Based on the provided job description analysis and any relevant web research context, suggest which of the following existing CV components are most relevant to tailoring a CV for this role. For each suggested component, provide a brief reasoning (1-2 sentences).

Existing CV Components:\n${allComponents
      .map((component) => `- ID: ${component.notionPageId}, Name: ${component.name}, Type: ${component.type}`)
      .join('\n')}

Job Description Analysis:\n${jd_analysis}

${web_research_context ? `Relevant Web Research Context:\n${web_research_context}\n\n` : ''}

Instructions:
List the IDs of the most relevant components as a comma-separated string, followed by a JSON array of objects, where each object has 'component_id' and 'reasoning' fields.

Example Output:
"component-id-1,component-id-2"
[{"component_id": "component-id-1", "reasoning": "This component is highly relevant because..."}]`;

    console.log('[SUGGEST_CV_COMPONENTS_API] Sending suggestion prompt to LLM...');

    const llmResponse: CombinedLLMResponse = await generateLLMResponse(CV_COMPONENT_SELECTION_REQUEST_TYPE, prompt, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    if (!llmResponse.success) {
      return NextResponse.json(
        { success: false, error: llmResponse.error || 'LLM failed to suggest components' },
        { status: 500 }
      );
    }

    const rawContent = llmResponse.content;
    const parts = rawContent.split('\n');
    const suggested_component_ids_raw: string = parts[0] || '';
    const suggested_components_json = parts.slice(1).join('\n');

    const suggested_component_ids: string[] = suggested_component_ids_raw
      .split(',')
      .map((id: string) => id.trim())
      .filter((id: string) => id.length > 0);

    let componentSuggestions: { component_id: string; reasoning: string }[] = [];
    try {
      if (suggested_components_json) {
        componentSuggestions = JSON.parse(suggested_components_json);
      }
    } catch (parseError: unknown) {
      console.error(
        '[SUGGEST_CV_COMPONENTS_API] Failed to parse JSON suggestions:',
        parseError instanceof Error ? parseError.message : String(parseError)
      );
      // Continue without parsed suggestions if parsing fails
    }

    console.log('[SUGGEST_CV_COMPONENTS_API] Suggested component IDs:', suggested_component_ids);
    console.log('[SUGGEST_CV_COMPONENTS_API] Component suggestions:', componentSuggestions);

    return NextResponse.json({ success: true, suggested_component_ids, componentSuggestions });
  } catch (error: unknown) {
    console.error(
      '[SUGGEST_CV_COMPONENTS_API] Error in suggest CV components API:',
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
