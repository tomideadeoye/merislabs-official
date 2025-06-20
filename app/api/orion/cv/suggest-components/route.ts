/**
 * @fileoverview API route to suggest relevant CV components based on a given opportunity's job description.
 * @description This endpoint receives an `opportunityId`, fetches the opportunity content and all available CV components,
 * then uses an LLM (Orion's `generateLLMResponse`) to intelligently suggest the most relevant components.
 * It is crucial for automating the initial selection process in the CV Tailoring Studio.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To provide AI-powered suggestions for CV components that best match a job description.
 *   - To integrate with Orion's LLM service (`generateLLMResponse`) for natural language processing and content matching.
 *   - To ensure only authenticated users can access this suggestion service.
 *   - To return a structured list of unique IDs for the suggested CV components.
 *
 * FILEPATH: `app/api/orion/cv/suggest-components/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `auth.ts`: Handles user authentication and session validation.
 *   - `@/lib/opportunity_db_service`: Used to fetch the job description content from the database via `getOpportunityByIdFromDb`.
 *   - `@/lib/cv_components_db_service`: Used to retrieve all available CV components from the database via `fetchAllCvComponents`.
 *   - `@/lib/orion_llm`: Provides the `generateLLMResponse` function, which interfaces with the LLM to process the prompt and generate suggestions.
 *   - `@/lib/logger`: Used for comprehensive logging of API request, response, and error details.
 *   - `app/components/orion/CVTailoringStudio.tsx`: This client-side component calls this API route to get component suggestions.
 *   - `@/lib/types`: Defines `OrionOpportunity` and `CVComponent` interfaces used for data typing.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes a valid `opportunityId` is provided in the request body.
 *   - Assumes the LLM service (`generateLLMResponse`) is operational and correctly configured to handle `REQUEST_TYPES.CV_COMPONENT_TAILORING`.
 *   - Assumes CV component content (c.content) is JSON-parseable if it's stored as a string, as required by the prompt structure.
 *   - The LLM is expected to return a JSON array of strings (unique IDs).
 *   - Comprehensive logging is integrated to trace the flow and diagnose any issues during API calls or LLM interactions.
 *
 * NOTES:
 *   - This API acts as an intelligent intermediary, transforming a user request into an LLM query and returning actionable suggestions.
 *   - Security is handled by `next-auth` to ensure only authorized users can make requests.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Schema Validation**: Implement Zod or similar schema validation for the incoming request body (`opportunityId`).
 *   - **Error Handling Granularity**: Provide more specific error messages to the client based on different failure points (e.g., LLM specific errors).
 *   - **Caching**: Implement server-side caching for LLM responses to frequently requested opportunities or components to reduce latency and LLM costs.
 *   - **Batch Processing**: If suggesting components for multiple opportunities at once is a use case, consider a batch processing approach.
 *   - **LLM Prompt Optimization**: Continuously refine the LLM prompt for better suggestion accuracy and relevance.
 */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getOpportunityByIdFromDb } from '@/lib/opportunity_db_service';
import { fetchAllCvComponents } from '@/lib/cv_components_db_service';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const { opportunityId } = await request.json();
  if (!opportunityId)
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });

  try {
    const opportunity = await getOpportunityByIdFromDb(opportunityId);
    if (!opportunity?.content)
      return NextResponse.json(
        { success: false, error: 'Opportunity not found or has no description.' },
        { status: 404 }
      );

    const allCvComponents = await fetchAllCvComponents();
    if (allCvComponents.length === 0)
      return NextResponse.json({ success: false, error: 'No CV components in database.' }, { status: 404 });

    const componentsListForPrompt = allCvComponents
      .map((c) => `- ID: ${c.uniqueId}\n  Name: ${c.name}\n  Content: ${JSON.stringify(c.content)}\n`)
      .join('\n');
    const prompt = `You are an expert career coach. Analyze the Job Description below and suggest the most relevant CV components from the user's library. Return ONLY a JSON array of strings containing the unique IDs of the TOP 5-7 most relevant components.\n\n**Job Description:**\n${opportunity.content}\n\n**Available CV Components:**\n${componentsListForPrompt}`;

    const llmResponse = await generateLLMResponse(REQUEST_TYPES.CV_COMPONENT_TAILORING, prompt);
    if (!llmResponse.success) {
      throw new Error(llmResponse.error || 'LLM failed to generate suggestions.');
    }
    if (!llmResponse.content) {
      throw new Error('LLM response was successful but returned no content.');
    }

    const suggestedIds = JSON.parse(llmResponse.content);
    logger.success('[CV_SUGGEST_API] Successfully suggested CV components.', { opportunityId, suggestedIds });
    return NextResponse.json({ success: true, suggestedComponentIds: suggestedIds });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error.';
    logger.error('[CV_SUGGEST_API] Error', { error: msg, opportunityId });
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
