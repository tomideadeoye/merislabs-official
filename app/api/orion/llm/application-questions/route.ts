/**
 * GOAL: API route for answering user questions about a specific job OrionOpportunity using all available context.
 * - Connects to Notion (fetchOpportunityByIdFromNotion), user profile (fetchUserProfile), and memory search.
 * - Normalizes OrionOpportunity data to always include both company and companyOrInstitution.
 * - Provides context-rich, traceable logging for every operation, parameter, and result.
 * - Used by admin and user-facing UIs for Q&A about opportunities.
 * - Related files: lib/notion_service.ts, lib/profile_service.ts, lib/orion_llm.ts, types/OrionOpportunity.d.ts
 */
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { fetchUserProfile } from '@/lib/profile_service';
import { UserProfileFetchResponse, CombinedLLMResponse, ScoredMemoryPoint } from '@/lib/types';
import { NextRequest, NextResponse } from 'next/server';

// Define the response type for the Application Q&A API
interface ApplicationQnaApiResponse {
  success: boolean;
  answer?: CombinedLLMResponse;
  error?: string;
  memoryResults?: ScoredMemoryPoint[];
  message?: string; // Add message for consistent error responses
}

/**
 * API route for answering user questions about a specific job OrionOpportunity using all available context.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
): Promise<NextResponse<ApplicationQnaApiResponse>> {
  // Use the defined response type
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized', message: 'Authentication required to access this resource.' },
      { status: 401 }
    );
  }

  const opportunityId = params.opportunityId; // OrionOpportunity ID from the URL
  const { question, webContext } = (await request.json()) as { question: string; webContext?: string }; // User's question and potentially web context from frontend

  if (!opportunityId) {
    return NextResponse.json(
      {
        success: false,
        error: 'Opportunity ID is required.',
        message: 'The opportunity ID must be provided in the request.',
      },
      { status: 400 }
    );
  }
  if (!question) {
    return NextResponse.json(
      { success: false, error: 'Question is required.', message: 'A question is required to generate an answer.' },
      { status: 400 }
    );
  }

  try {
    // Fetch OrionOpportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: opportunityResult.error || 'Unknown error',
          message: opportunityResult.error || 'Failed to fetch opportunity details.',
        },
        { status: 500 }
      );
    }
    const OrionOpportunity = opportunityResult.OrionOpportunity;
    if (!OrionOpportunity) {
      console.error('[APP_QNA_API] OrionOpportunity not found for ID:', opportunityId, { user: session.user?.email });
      return NextResponse.json(
        { success: false, error: 'Opportunity not found.', message: `No opportunity found with ID: ${opportunityId}.` },
        { status: 404 }
      );
    }
    // Normalize company/companyOrInstitution for downstream use
    const company = (OrionOpportunity.company ?? OrionOpportunity.companyOrInstitution ?? '') || '';
    const companyOrInstitution = (OrionOpportunity.companyOrInstitution ?? OrionOpportunity.company ?? '') || '';
    console.info('[APP_QNA_API] Normalized company fields:', {
      company,
      companyOrInstitution,
      opportunityId,
      user: session.user?.email,
    });

    // Fetch user profile data
    // Directly use UserProfileFetchResponse which is correctly typed now
    const profileData: UserProfileFetchResponse | null = await fetchUserProfile();
    const profileContext = profileData?.profileText
      ? `User Profile Details:\n${profileData?.profileText || 'No profile data available.'}`
      : 'User profile data not available.';

    // Fetch relevant memories based on the question and OrionOpportunity
    let memoryResults: ScoredMemoryPoint[] = [];
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Context for question about ${OrionOpportunity.title} at ${companyOrInstitution}: ${question}`, // Tailor memory query to question and OrionOpportunity
          limit: 5, // Adjust limit as needed
          // Optionally add filters here
        }),
      });

      if (memoryResponse.ok) {
        const memoryData = await memoryResponse.json();
        if (memoryData.success && memoryData.results) {
          memoryResults = memoryData.results;
          console.log('[APP_QNA_API] Successfully fetched memory results.', memoryResults.length);
        } else {
          console.warn('[APP_QNA_API] Memory search proxy returned success: false or no results.', memoryData);
        }
      } else {
        console.error(
          '[APP_QNA_API] Failed to call internal memory search proxy:',
          memoryResponse.status,
          memoryResponse.statusText
        );
      }
    } catch (memoryError: unknown) {
      console.error('[APP_QNA_API] Error calling internal memory search proxy:', memoryError);
    }

    // Use sourceUrl if available, otherwise fallback to url
    const sourceUrl = OrionOpportunity.sourceUrl || OrionOpportunity.url;

    // Construct the prompt for the LLM using all available context
    const primaryContext = `
OrionOpportunity Details:
Job Title: ${OrionOpportunity.title}
Company: ${companyOrInstitution}
${sourceUrl ? `Source URL: ${sourceUrl}\n` : ''}
Job Content: ${OrionOpportunity.content || 'No content provided.'}

${webContext ? `Additional Web Context:\n${webContext}\n\n` : ''}User's Question: ${question}

Instructions:
Answer the user's question about this job OrionOpportunity thoroughly and accurately, using all the provided context (OrionOpportunity details, job description, your profile, relevant memories, and any web context). If the context does not contain the answer, state that you cannot answer based on the available information. Be helpful and relevant to the job application process.`;

    console.log('[APP_QNA_API] Sending application question prompt to LLM...');

    const llmResponseContent = await generateLLMResponse(REQUEST_TYPES.ASK_QUESTION, primaryContext, {
      profileContext: profileContext,
      memoryResults: memoryResults,
      temperature: 0.7,
      maxTokens: 1000, // Adjust token limit for answers
    });

    if (llmResponseContent.success) {
      return NextResponse.json({
        success: true,
        answer: llmResponseContent,
        memoryResults,
        message: 'Successfully generated answer.',
      }); // Include memoryResults
    } else {
      console.error('[APP_QNA_API] LLM failed to generate answer', llmResponseContent.error);
      return NextResponse.json(
        {
          success: false,
          error: llmResponseContent.error || 'Failed to generate answer using LLM',
          memoryResults: memoryResults, // Include memoryResults even on failure
          message: `Failed to generate answer: ${llmResponseContent.error || 'Unknown LLM error'}`,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('[APP_QNA_API_ERROR]', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred while answering the question.',
        memoryResults: [],
        message: `An unexpected error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
