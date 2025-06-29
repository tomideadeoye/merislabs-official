/**
 * @fileoverview API route to suggest relevant CV components based on a given opportunity's job description.
 * @description This endpoint receives an `id`, fetches the opportunity content and all available CV components,
 * then uses an LLM (Orion's `generateLLMResponse`) to intelligently suggest the most relevant components.
 * It is crucial for automating the initial selection process in the CV Tailoring Studio, aligning with FR-2 of the PRD.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide AI-powered suggestions for CV components that best match a job description (FR-2).
 *   - To automatically trigger this suggestion process upon the loading of the CV Tailoring Studio UI (FR-2.1).
 *   - To integrate with Orion's LLM service (`generateLLMResponse`) for natural language processing and content matching (FR-2.2).
 *   - To return a structured JSON array of the top 5-7 most relevant `uniqueId`s (FR-2.3).
 *
 * FILEPATH: `app/api/orion/cv/suggest-components/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `@/lib/opportunity_db_service`: Used to fetch the job description content from the database via `getOpportunityByIdFromDb` (part of FR-2.2).
 *   - `@/lib/cv_components_db_service`: Used to retrieve all available CV components from the database via `fetchAllCvComponents` (part of FR-2.2).
 *   - `@/lib/orion_llm`: Provides the `generateLLMResponse` function, which interfaces with the LLM to process the prompt and generate suggestions (FR-2.2).
 *   - `@/lib/logger`: Used for comprehensive logging of API request, response, and error details.
 *   - `app/components/orion/CVTailoringStudio.tsx`: This client-side component calls this API route upon loading to get component suggestions (FR-2.1).
 *   - `@/lib/types`: Defines `REFACTOR TO INFERENCE TYPE SAFE OPPORTUNITY FROM PRISMA` and `CVComponent` interfaces used for data typing.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid `id` is provided in the request body.
 *   - Assumes the LLM service (`generateLLMResponse`) is operational and correctly configured to handle `REQUEST_TYPES.CV_COMPONENT_TAILORING`.
 *   - Assumes CV component content (c.content) is JSON-parseable if it's stored as a string, as required by the prompt structure.
 *   - The LLM is expected to return a JSON array of strings (unique IDs) (FR-2.3).
 *   - Comprehensive logging is integrated to trace the flow and diagnose any issues during API calls or LLM interactions.
 *
 * NON-FUNCTIONAL REQUIREMENTS:
 *   - Performance: The LLM response time should be optimized to ensure responsive UI loading, with clear loading indicators in the frontend.
 *   - Reliability: Robust error handling to gracefully manage LLM failures or missing data.
 *
 * NOTES:
 *   - This API acts as an intelligent intermediary, transforming a user request into an LLM query and returning actionable suggestions.
 *   - The prompt for the LLM is carefully constructed to guide the AI in selecting the most relevant components based on the job description.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Schema Validation**: Implement Zod or similar schema validation for the incoming request body (`id`).
 *   - **Error Handling Granularity**: Provide more specific error messages to the client based on different failure points (e.g., LLM specific errors).
 *   - **Caching**: Implement server-side caching for LLM responses to frequently requested opportunities or components to reduce latency and LLM costs.
 *   - **LLM Prompt Optimization**: Continuously refine the LLM prompt for better suggestion accuracy and relevance.
 *   - **Dynamic Component Filtering**: Allow for additional filtering parameters (e.g., by component type or tags) to refine suggestions.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchAllCvComponents } from '@/lib/cv_components_db_service';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger';
import { CVComponent } from '@/lib/types/cv';
import { HandledApplicationError } from '@/lib/utils/errorHandler';

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  if (!id)
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });

  try {
    const opportunityResult = await getOpportunityByIdFromDb(id);

    // Handle HandledApplicationError or null opportunity explicitly
    if (opportunityResult === null || opportunityResult instanceof HandledApplicationError) {
      logger.warn('[CV_SUGGEST_API] Opportunity not found or is an error.', {
        id,
        error: opportunityResult instanceof HandledApplicationError ? opportunityResult.message : 'Not found',
      });
      return NextResponse.json(
        { success: false, error: 'Opportunity not found or has no description.' },
        { status: 404 }
      );
    }

    const opportunity = opportunityResult;

    if (!opportunity.content) {
      logger.warn('[CV_SUGGEST_API] Opportunity has no content.', { id });
      return NextResponse.json({ success: false, error: 'Opportunity has no description.' }, { status: 404 });
    }

    const allCvComponents = await fetchAllCvComponents();

    if (allCvComponents instanceof HandledApplicationError) {
      logger.error('[CV_SUGGEST_API][FETCH_COMPONENTS_ERROR]', { id, error: allCvComponents.message });
      return NextResponse.json(
        { success: false, error: allCvComponents.message },
        { status: allCvComponents.statusCode || 500 }
      );
    }

    if (allCvComponents.length === 0) {
      logger.warn('[CV_SUGGEST_API] No CV components in database.', { id });
      return NextResponse.json({ success: false, error: 'No CV components in database.' }, { status: 404 });
    }

    const componentsListForPrompt = allCvComponents
      .map((c: CVComponent) => `- ID: ${c.uniqueId}\n  Name: ${c.name}\n  Content: ${JSON.stringify(c.content)}\n`)
      .join('\n');
    const prompt = `You are an expert career coach. Analyze the Job Description below and suggest the most relevant CV components from the user's library. Return ONLY a JSON array of strings containing the unique IDs of the TOP 5-7 most relevant components.\n\n**Job Description:**\n${opportunity.content}\n\n**Available CV Components:**\n${componentsListForPrompt}`;

    const llmResponse = await generateLLMResponse(REQUEST_TYPES.CV_COMPONENT_TAILORING, prompt, 'unauthenticated_user');
    if (!llmResponse.success) {
      throw new Error(llmResponse.error || 'LLM failed to generate suggestions.');
    }
    if (!llmResponse.content) {
      throw new Error('LLM response was successful but returned no content.');
    }

    const suggestedIds = JSON.parse(llmResponse.content);
    logger.success('[CV_SUGGEST_API] Successfully suggested CV components.', { id, suggestedIds });
    return NextResponse.json({ success: true, suggestedComponentIds: suggestedIds });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error.';
    logger.error('[CV_SUGGEST_API] Error', { error: msg, id });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
