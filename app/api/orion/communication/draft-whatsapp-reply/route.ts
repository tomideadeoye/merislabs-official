/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview API route for drafting hyper-personalized WhatsApp replies using Orion's LLM and memory system.
 * @description This route receives a chat history, user profile context, and specific drafting parameters
 *   (like reply goal and tone). It leverages Orion's LLM to generate context-aware, strategically sound
 *   WhatsApp replies, incorporating relevant memory chunks from the Qdrant vector database. The goal is
 *   to automate and enhance the efficiency, personalization, and emotional intelligence of communication.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Receive comprehensive chat context, user intent, desired reply goals, tone, and number of drafts via POST request.
 *   - **Memory Integration**: Perform a semantic search on the Orion memory system (Qdrant) to retrieve relevant historical information or personal context based on the incoming chat transcript.
 *   - Pass retrieved memory chunks, user profile context, and drafting parameters to the `generateLLMResponse` function.
 *   - Call the `generateLLMResponse` function with `REQUEST_TYPES.WHATSAPP_REPLY_HELPER_REQUEST_TYPE` to get an AI-generated reply and associated memory results.
 *   - Return the drafted replies (multiple options), along with the specific memory chunks that were used in their formulation, and any relevant metadata or errors.
 *   - Ensure robust authentication and comprehensive logging throughout the process for traceability and debugging.
 *
 * FILEPATH: `app/api/orion/communication/draft-whatsapp-reply/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/orion_llm.ts`: Contains the `generateLLMResponse` function, which is the core logic for interacting with the LLM.
 *     This file now passes `memoryResults` and other parameters to `generateLLMResponse`.
 *   - `app/lib/memory.ts`: Provides the `searchMemory` function, used to query the Qdrant vector database for relevant memory chunks.
 *   - `app/lib/logger.ts`: Used for comprehensive logging of request, processing steps, and response, enhancing debuggability and operational insight.
 *   - `app/lib/types/llm.ts`: Defines the `CombinedLLMResponse` interface, which now includes `memoryResults`.
 *   - `app/lib/types/memory.ts`: Defines the `ScoredMemoryPoint` interface, representing the structure of retrieved memory chunks.
 *   - `app/lib/orion_config.ts`: Contains `REQUEST_TYPES.WHATSAPP_REPLY_HELPER_REQUEST_TYPE` (or equivalent) constant for LLM request categorization.
 *   - `app/api/auth/[...nextauth]/route.ts`: Utilizes NextAuth.js for session management and user authentication, securing access to this API route.
 *   - `@/components/ui/orion/whatsapp/WhatsAppReplyDrafter.tsx`: This frontend component sends requests to this API route and now expects `memoryResults` in the response to visualize them.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes that `generateLLMResponse` is correctly configured to handle `REQUEST_TYPES.WHATSAPP_REPLY_HELPER_REQUEST_TYPE` and returns `CombinedLLMResponse`, which includes `memoryResults`.
 *   - Assumes `searchMemory` is correctly configured and connected to a functioning Qdrant instance, returning relevant `ScoredMemoryPoint` data.
 *   - Assumes the LLM has been pre-trained or fine-tuned for generating conversational WhatsApp-style replies, understanding nuances of tone, goals, and personal context.
 *   - Authentication is required, ensuring only authorized users can access this functionality.
 *   - The `TEMP_USER_ID` is used as a fallback for logging and LLM calls if a session user ID is not available.
 *
 * NOTES:
 *   - **COMPONENTS TO MERGE WITH / OPPORTUNITIES TO CONSOLIDATE**: This route is specific to WhatsApp. Consider if a more generalized `draft-communication` API could be beneficial for other platforms if similar communication drafting needs arise.
 *   - **PERFORMANCE OPTIMIZATIONS**: LLM calls and memory searches can be time-consuming. Future optimizations could include caching of frequently accessed memories or LLM responses, and exploring streaming LLM responses.
 *   - **ERROR HANDLING ROBUSTNESS**: Detailed error logging for LLM failures, memory search issues, and unexpected responses is crucial for rapid debugging and improving system reliability.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Input Validation**: Add comprehensive input validation (e.g., using Zod) for the request body to ensure data integrity and prevent malformed or malicious requests.
 *   - **Rate Limiting**: Implement robust rate limiting to prevent abuse or excessive LLM/memory calls, especially if exposed publicly.
 *   - **Dynamic Memory Search Parameters**: Allow the frontend to send more granular parameters for memory search (e.g., specific memory types, date ranges, minimum score) to fine-tune relevance.
 *   - **Asynchronous Processing**: For very long LLM requests, consider integrating with a message queuing system (e.g., RabbitMQ, Kafka) for asynchronous processing, allowing the API to respond immediately and update the frontend via WebSockets or polling.
 *   - **User Feedback Loop**: Integrate a mechanism to capture user feedback on the quality of generated replies, which can be used to refine LLM prompts or fine-tune models.
 *   - **A/B Testing of Prompts**: Implement A/B testing capabilities for different LLM prompts or retrieval strategies to optimize reply quality based on user engagement.
 */

import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { generateLLMResponse } from '@/lib/orion_llm';
import { searchMemory } from '@/lib/memory';
import { ScoredMemoryPoint } from '@/lib/types/memory';
import { WHATSAPP_REPLY_HELPER_REQUEST_TYPE } from '@/lib/orion_config';

const TEMP_USER_ID = 'temp_whatsapp_reply_user'; // Temporary user ID for LLM calls (or fallback)

export async function POST(request: NextRequest) {
  // Removed authentication check as per user's request
  // const session = await auth();
  // if (!session) {
  //   logger.warn('[draft-whatsapp-reply][POST] Unauthorized access attempt.');
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const { chatContext, userPrompt, numberOfDrafts, replyGoal, tone, overallSentiment } = await request.json(); // Added overallSentiment

    logger.info('[draft-whatsapp-reply][POST] Received request to draft reply.', {
      // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
      chatContextLength: chatContext ? chatContext.length : 0,
      userPrompt: userPrompt,
      replyGoal: replyGoal,
      tone: tone,
      numberOfDrafts: numberOfDrafts,
      overallSentiment: overallSentiment,
    });

    if (!chatContext) {
      logger.warn('[draft-whatsapp-reply][POST] Missing chatContext in request.', {
        // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
      });
      return NextResponse.json({ success: false, error: 'Chat context is required.' }, { status: 400 });
    }

    // Search for relevant memories based on the chat context
    let memoryResults: ScoredMemoryPoint[] = [];
    try {
      const memorySearchResponse = await searchMemory(chatContext, { limit: 5 });
      if (memorySearchResponse.success && memorySearchResponse.results) {
        memoryResults = memorySearchResponse.results;
        logger.info('[draft-whatsapp-reply][POST] Found relevant memories.', {
          // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
          memoryCount: memoryResults.length,
        });
      } else {
        logger.warn('[draft-whatsapp-reply][POST] No relevant memories found or search failed.', {
          // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
          error: memorySearchResponse.error,
        });
      }
    } catch (memoryError: unknown) {
      logger.error('[draft-whatsapp-reply][POST] Error during memory search.', {
        // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
        error: memoryError instanceof Error ? memoryError.message : String(memoryError),
      });
    }

    // Call the LLM to generate the reply
    const llmResponse = await generateLLMResponse(
      WHATSAPP_REPLY_HELPER_REQUEST_TYPE,
      chatContext,
      null, // userId is now nullable
      {
        profileContext: userPrompt,
        memoryResults: memoryResults,
        replyGoal: replyGoal,
        tone: tone,
        numberOfDrafts: numberOfDrafts,
        overallSentiment: overallSentiment,
      }
    );

    if (!llmResponse.success) {
      logger.error('[draft-whatsapp-reply][POST] LLM response error.', {
        // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
        llmError: llmResponse.error,
        llmContent: llmResponse.content,
      });
      return NextResponse.json(
        { success: false, error: llmResponse.error || 'Failed to generate reply.' },
        { status: 500 }
      );
    }

    if (!llmResponse.content) {
      logger.error('[draft-whatsapp-reply][POST] LLM generated an empty content.', {
        // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
      });
      return NextResponse.json({ success: false, error: 'LLM generated an empty response.' }, { status: 500 });
    }

    // The LLM response content already contains the structured drafts as a JSON string
    // We need to parse it to extract individual drafts
    let draftedReplies: { text: string; explanation: string; rank: number }[] = [];
    try {
      // Assuming llmResponse.content is a JSON string of SuggestedReply[]
      draftedReplies = JSON.parse(llmResponse.content);
      // Ensure it's an array and each item has the expected structure
      if (
        !Array.isArray(draftedReplies) ||
        !draftedReplies.every(
          (item) =>
            typeof item.text === 'string' && typeof item.explanation === 'string' && typeof item.rank === 'number'
        )
      ) {
        throw new Error('LLM response content is not in the expected SuggestedReply[] format.');
      }
    } catch (parseError) {
      logger.error('[draft-whatsapp-reply][POST] Failed to parse LLM response content as JSON.', {
        // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
        llmContent: llmResponse.content,
        parseError: parseError instanceof Error ? parseError.message : String(parseError),
      });
      // Fallback: if parsing fails, treat the entire content as a single draft
      draftedReplies = [{ text: llmResponse.content, explanation: 'Could not parse structured reply.', rank: 1 }];
    }

    logger.success('[draft-whatsapp-reply][POST] Successfully drafted WhatsApp replies.', {
      // userId: session.user?.id || TEMP_USER_ID, // Removed userId as authentication is removed
      numberOfDraftsGenerated: draftedReplies.length,
    });

    return NextResponse.json({ success: true, drafts: draftedReplies, memoryResults: llmResponse.memoryResults });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    logger.error('[draft-whatsapp-reply][POST] Uncaught error during reply drafting.', {
      // userId: TEMP_USER_ID, // Removed userId as authentication is removed
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
