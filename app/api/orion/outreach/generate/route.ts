// GOAL OF FILE|FEATURES|FUNCTIONS:
//   - API route for generating personalized outreach messages using an LLM.
//   - Takes persona data, user profile, and outreach context as input.
// FILEPATH:
//   app/api/orion/outreach/generate/route.ts
// CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
//   - Interacts with: app/lib/orion_llm.ts (for LLM interactions)
//                     app/lib/types (for Persona, OutreachRequest, OutreachResponse, UserProfileData types)
//   - Used by: app/components/orion/networking-hub/OutreachForm.tsx (to trigger outreach generation)
// ASSUMPTIONS & CLEAR COMMENTS // NOTE: Assumed [X] – confirm with team
//   - Assumes orion_llm.ts provides a function like `generateOutreachMessage`.
//   - Assumes the request body conforms to the `OutreachRequest` type.
// NOTES: components to merge with, similar or redundant component, opportunities for improvement, opportunities to consolidate
//   - This route centralizes LLM calls for outreach, making it reusable.
// TODOS:
//   - Implement streaming responses for real-time draft updates.
//   - Add more sophisticated prompt engineering based on `specificContext` and `callToAction`.
// SUGGESTIONS:
//   - Cache common LLM responses for similar requests to reduce API calls.

import { NextResponse } from 'next/server';
import { generateOutreachMessage } from '@/lib/orion_llm'; // Assuming a function for this
import type { OutreachRequest, OutreachResponse, UserProfileData } from '@/lib/types'; // Added UserProfileData import
import logger from '@/lib/logger';

export async function POST(request: Request) {
  logger.info('[API] POST /api/orion/outreach/generate - Request received.');
  try {
    const outreachRequest: OutreachRequest = await request.json();
    logger.debug('[API] POST /api/orion/outreach/generate - Received request body', { outreachRequest });

    if (!outreachRequest.persona || !outreachRequest.outreachGoal || !outreachRequest.userProfile) {
      logger.warn('[API] POST /api/orion/outreach/generate - Validation failed: Missing required fields.', {
        outreachRequest,
      });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: persona, outreachGoal, and userProfile.' },
        { status: 400 }
      );
    }

    // The prompt construction is now handled inside generateOutreachMessage in orion_llm.ts
    // Ensure userProfile is correctly typed before passing
    const userProfileData: UserProfileData = outreachRequest.userProfile as UserProfileData;

    const llmResponse = await generateOutreachMessage({
      outreachRequest: outreachRequest,
      userProfileData: userProfileData,
    });

    if (llmResponse.success) {
      const responseBody: OutreachResponse = {
        draft: llmResponse.draft,
        success: true,
        message: 'Outreach message generated successfully.',
      };
      logger.success('[API] POST /api/orion/outreach/generate - Outreach generated successfully.', {
        messageType: outreachRequest.messageType,
      });
      return NextResponse.json(responseBody);
    } else {
      throw new Error(llmResponse.error || 'LLM failed to generate outreach message.');
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    logger.error('[API] POST /api/orion/outreach/generate - Failed to generate outreach message.', {
      error: errorMessage,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
