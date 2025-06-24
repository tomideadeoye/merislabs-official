/**
 * @fileoverview API route for drafting personalized LinkedIn messages using an LLM.
 * @description This route takes a prompt and an outreach goal, and leverages a Large Language Model
 *   to generate a tailored LinkedIn message draft. It is designed to be consumed by frontend
 *   components like `CompanyStakeholderOutreach.tsx`.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Receive a request containing a prompt and an outreach goal for a LinkedIn message.
 *   - Utilize an LLM to generate a personalized and context-aware LinkedIn message draft.
 *   - Return the generated draft to the client.
 *   - For now, simulate an LLM response with a mock LinkedIn message.
 *
 * FILEPATH: `app/api/orion/communication/draft-linkedin-message/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/components/orion/opportunities/CompanyStakeholderOutreach.tsx`: This frontend component calls this API route.
 *   - `@/lib/orion_llm.ts`: (Future) Will integrate `generateLLMResponse` for actual LLM interaction.
 *   - `@/lib/logger.ts`: Integrates logging for tracing API requests and responses.
 *   - `next/server`: Used for handling Next.js API requests and responses.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the incoming request body will contain `prompt` and `outreachGoal` fields.
 *   - The current implementation provides mock data; real LLM integration will be a future step.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE:**
 *     - Potential consolidation with `app/api/orion/email/draft/route.ts` into a more generic `draft-communication/route.ts` if the LLM logic becomes highly similar.
 *   - **PERFORMANCE OPTIMIZATIONS:**
 *     - LLM calls can be time-consuming; consider implementing caching for frequently generated message types or debouncing frontend requests.
 *   - **ERROR HANDLING ROBUSTNESS:**
 *     - Implement more granular error handling for LLM failures or invalid prompt inputs.
 *
 * OPPORTUNITIES FOR IMPROVEMENT & COMPREHENSIVE NEXT STEPS:
 *   This API is key to generating highly personalized and effective LinkedIn outreach.
 *
 *   **1. Integrate with LLM (`@/lib/orion_llm.ts`):**
 *     - **Goal:** Replace the mock response with an actual LLM call to `generateLLMResponse`.
 *     - **How to Implement:** Call `generateLLMResponse` with a well-crafted `systemContext` and the `prompt` from the request body. Ensure the `REQUEST_TYPES` enum includes a type for LinkedIn message drafting.
 *     - **Relevant Files:** `app/lib/orion_llm.ts`, `app/lib/types/index.ts` (for `REQUEST_TYPES`).
 *
 *   **2. Dynamic Message Customization:**
 *     - **Goal:** Allow frontend to specify more parameters for message generation (e.g., tone, length, specific call-to-action, user profile context).
 *     - **How to Implement:** Expand the request body schema to include these parameters and incorporate them into the LLM prompt construction.
 *
 *   **3. CRM/Communication Log Integration:**
 *     - **Goal:** Automatically log generated and sent LinkedIn messages to the associated opportunity and stakeholder within the database.
 *     - **How to Implement:** After successful drafting (and potential sending), call a database service to create a `CommunicationLog` entry.
 *     - **Relevant Files:** `prisma/schema.prisma` (for a `CommunicationLog` model), new database service functions.
 *
 *   **4. LinkedIn API Integration (Future):**
 *     - **Goal:** Directly send LinkedIn messages through a LinkedIn API (if available and permissible).
 *     - **How to Implement:** Research LinkedIn's developer APIs for message sending. Implement a secure integration in the backend to send messages programmatically.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { generateLLMResponse } from '@/lib/orion_llm'; // Future integration
import { DRAFT_LINKEDIN_MESSAGE_REQUEST_TYPE } from '@/lib/orion_config';
import { getProfileText } from '@/lib/profile_service';
import { pythonApiService } from '@/lib/orion_tools';
import { ScoredMemoryPoint } from '@/lib/types';

export async function POST(request: NextRequest) {
  const logContext = { api: 'draft-linkedin-message', method: 'POST' };
  logger.info('[DRAFT_LINKEDIN_MESSAGE_API][START] Received request to draft LinkedIn message.', logContext);

  try {
    const { prompt, outreachGoal, userId, conversationHistory, memoryQuery } = await request.json(); // Destructure prompt and outreachGoal

    if (!prompt) {
      logger.warn('[DRAFT_LINKEDIN_MESSAGE_API] Missing prompt in request.', logContext);
      return NextResponse.json({ success: false, error: 'Prompt is required.' }, { status: 400 });
    }

    if (!userId) {
      logger.warn('[DRAFT_LINKEDIN_MESSAGE_API] Missing userId in request.', logContext);
      return NextResponse.json({ success: false, error: 'User ID is required.' }, { status: 400 });
    }

    let profileContext = '';
    try {
      const profileResponse = await getProfileText();
      if (profileResponse.success && profileResponse.profileText) {
        profileContext = `User Profile: ${profileResponse.profileText}`;
      }
    } catch (profileError) {
      logger.error('[DRAFT_LINKEDIN_MESSAGE_API] Failed to fetch user profile data.', {
        ...logContext,
        error: profileError,
      });
    }

    let memoryResults: ScoredMemoryPoint[] = [];
    if (memoryQuery) {
      try {
        memoryResults = await pythonApiService.searchMemories(memoryQuery, 5, {}, 'all');
        logger.info('[DRAFT_LINKEDIN_MESSAGE_API] Memory search completed.', {
          ...logContext,
          memoryQuery,
          memoryCount: memoryResults.length,
        });
      } catch (memError) {
        logger.error('[DRAFT_LINKEDIN_MESSAGE_API] Failed to search memories.', {
          ...logContext,
          error: memError,
        });
      }
    }

    const systemContext = `You are an expert LinkedIn message drafter. Your goal is to create a concise, professional, and personalized LinkedIn message based on the user's prompt and the outreach goal. Incorporate relevant details from the user's profile and retrieved memories to make the message highly effective. Aim for a friendly yet professional tone.`;

    const llmOptions = {
      systemContext,
      profileContext,
      memoryResults,
      conversationHistory,
      replyGoal: outreachGoal,
      tone: 'professional',
      numberOfDrafts: 1,
    };

    const llmResponse = await generateLLMResponse(DRAFT_LINKEDIN_MESSAGE_REQUEST_TYPE, prompt, userId, llmOptions);

    if (llmResponse.success) {
      const linkedinDraft = llmResponse.content;
      logger.info('[DRAFT_LINKEDIN_MESSAGE_API][SUCCESS] LinkedIn message drafted by LLM.', logContext);
      return NextResponse.json({ success: true, draft: linkedinDraft }, { status: 200 });
    } else {
      logger.error('[DRAFT_LINKEDIN_MESSAGE_API][LLM_ERROR] LLM failed to draft LinkedIn message.', {
        ...logContext,
        llmError: llmResponse.error,
      });
      return NextResponse.json(
        { success: false, error: 'Failed to draft LinkedIn message from LLM', details: llmResponse.error },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error('[DRAFT_LINKEDIN_MESSAGE_API][ERROR] Failed to process request.', {
      ...logContext,
      error: errorMessage,
    });
    return NextResponse.json(
      { success: false, error: 'Failed to draft LinkedIn message', details: errorMessage },
      { status: 500 }
    );
  }
}
