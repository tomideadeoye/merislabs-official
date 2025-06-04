import { NextRequest, NextResponse } from 'next/server';
import { generateLLMResponse, REQUEST_TYPES, constructLlmMessages } from '@/lib/orion_llm';
import { fetchOpportunityByIdFromNotion } from '@/lib/notion_service';
import { fetchUserProfile } from '@/lib/profile_service';
import { auth } from '@/auth';
import type { MemoryPayload } from '@/types/orion';

// Define the response type for the Application Q&A API
interface ApplicationQnaApiResponse {
  success: boolean;
  answer?: string;
  error?: string;
  memoryResults?: MemoryPayload[]; // Add memoryResults to the response type
}

/**
 * API route for answering user questions about a specific job opportunity using all available context.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { opportunityId: string } }
): Promise<NextResponse<ApplicationQnaApiResponse>> { // Use the defined response type
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const opportunityId = params.opportunityId; // Opportunity ID from the URL
  const { question, webContext } = await request.json(); // User's question and potentially web context from frontend

  if (!opportunityId) {
    return NextResponse.json({ success: false, error: 'Opportunity ID is required.' }, { status: 400 });
  }
  if (!question) {
    return NextResponse.json({ success: false, error: 'Question is required.' }, { status: 400 });
  }

  try {
    // Fetch opportunity details
    const opportunityResult = await fetchOpportunityByIdFromNotion(opportunityId);

    if (!opportunityResult.success) {
      return NextResponse.json({ success: false, error: opportunityResult.error }, { status: 500 });
    }
    const opportunity = opportunityResult.opportunity;

    // Fetch user profile data
    const profileData = await fetchUserProfile();
    const profileContext = profileData ?
      `User Profile Details:\nSkills: ${profileData.skills || 'N/A'}\nExperience: ${profileData.experience || 'N/A'}\nBackground: ${profileData.background || 'N/A'}\nPersonality: ${profileData.personality || 'N/A'}` :
      "User profile data not available.";

    // Fetch relevant memories based on the question and opportunity
    let memoryResults: MemoryPayload[] = [];
    try {
      const memoryResponse = await fetch(`${request.nextUrl.origin}/api/orion/memory/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Context for question about ${opportunity.title} at ${opportunity.company}: ${question}`, // Tailor memory query to question and opportunity
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
         console.error('[APP_QNA_API] Failed to call internal memory search proxy:', memoryResponse.status, memoryResponse.statusText);
      }
    } catch (memoryError: any) {
       console.error('[APP_QNA_API] Error calling internal memory search proxy:', memoryError);
    }

    // Use jobUrl if available, otherwise fallback to url
    const jobUrl = (opportunity as any).jobUrl || opportunity.url;

    // Construct the prompt for the LLM using all available context
    const primaryContext = `
Opportunity Details:\nJob Title: ${opportunity.title}\nCompany: ${opportunity.company}\n${jobUrl ? `Job URL: ${jobUrl}\n` : ''}\nJob Content:\n${opportunity.content || 'No content provided.'}\n
${webContext ? `Additional Web Context:\n${webContext}\n\n` : ''}User's Question: ${question}

Instructions:\nAnswer the user's question about this job opportunity thoroughly and accurately, using all the provided context (opportunity details, job description, your profile, relevant memories, and any web context). If the context does not contain the answer, state that you cannot answer based on the available information. Be helpful and relevant to the job application process.`;

    const messages = constructLlmMessages({
      requestType: REQUEST_TYPES.ASK_QUESTION, // Using ASK_QUESTION type
      primaryContext: primaryContext,
      profileContext: profileContext,
      memoryResults: memoryResults,
      // webContext is already included in primaryContext for now, could be separate if needed
    });

    console.log('[APP_QNA_API] Sending application question prompt to LLM...');

    const llmResponseContent = await generateLLMResponse(
      REQUEST_TYPES.ASK_QUESTION,
      '', // Use empty string for primaryContext since it's included in messages
      {
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000, // Adjust token limit for answers
      } as any // Cast for now
    );

    if (llmResponseContent) {
      return NextResponse.json({ success: true, answer: llmResponseContent, memoryResults }); // Include memoryResults
    } else {
      console.error('[APP_QNA_API] LLM failed to generate answer');
      return NextResponse.json({
        success: false,
        error: 'Failed to generate answer using LLM',
        memoryResults: memoryResults // Include memoryResults even on failure
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[APP_QNA_API_ERROR]', error);
    return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred while answering the question.', memoryResults: [] }, { status: 500 });
  }
}
