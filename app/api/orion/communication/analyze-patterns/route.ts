/**
 * GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.
 *
 *
 * @fileoverview API route for analyzing recurring communication patterns across multiple WhatsApp chat transcripts.
 * @description This endpoint leverages Orion's LLM, memory system, and user profile to identify recurring communication
 *   patterns, suggest actionable strategies for improvement, and integrate these insights into the user's memory.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Receive multiple chat transcripts (or references to previously analyzed chats).
 *   - Orchestrate LLM calls to identify recurring patterns and suggest strategies.
 *   - Integrate relevant Qdrant memories and user profile data into the LLM's context.
 *   - Save identified patterns and strategies back into Qdrant memory.
 *   - Return structured insights for UI display.
 *
 * FILEPATH: `app/api/orion/communication/analyze-patterns/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `next/server`: For API route handling.
 *   - `@/auth`: For user authentication.
 *   - `@/lib/logger`: For comprehensive logging.
 *   - `@/lib/orion_llm`: `generateLLMResponse` for LLM interaction.
 *   - `@/lib/memory`: `searchMemory` for retrieving context, `addMemory` for saving insights.
 *   - `@/lib/profile_service`: `fetchUserProfile` for user profile context.
 *   - `@/lib/types/communication`: Defines `CommunicationPatternAnalysisResult` and related types.
 *   - `@/lib/orion_config`: Defines `REQUEST_TYPES.COMMUNICATION_PATTERN_ANALYSIS`.
 *   - `app/components/orion/whatsapp/CommunicationPatternsAnalyzer.tsx`: Frontend component consuming this API.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { searchMemory, addMemory } from '@/lib/memory';
import { fetchUserProfile } from '@/lib/profile_service';
import {
  CommunicationPatternAnalysisResult,
  RecurringPattern,
  SuggestedStrategy,
  IndividualChatAnalysisSummary,
} from '@/lib/types/communication';
import { ScoredMemoryPoint } from '@/lib/types/memory';

const TEMP_USER_ID = 'temp_pattern_analyzer_user';

export async function POST(request: NextRequest) {
  const session = await auth();
  // Using a temporary user ID as per the new directive for no authentication on this feature.
  // In a multi-user setup, `session.user?.id` would be used.
  const userId = TEMP_USER_ID; // session.user?.id || TEMP_USER_ID;
  const logContext = { userId, operation: 'analyze_communication_patterns' };

  logger.info('[COMM_PATTERNS_API][START] Request received.', logContext);

  try {
    const { chatTranscripts } = await request.json(); // Array of raw chat transcripts

    if (!Array.isArray(chatTranscripts) || chatTranscripts.length === 0) {
      logger.warn('[COMM_PATTERNS_API][VALIDATION_FAIL] No chat transcripts provided.', logContext);
      return NextResponse.json({ success: false, error: 'At least one chat transcript is required.' }, { status: 400 });
    }

    // 1. Aggregate chat data (simple concatenation for now, more sophisticated parsing/summarization needed)
    const aggregatedChatData = chatTranscripts.join('\n\n--- NEW CHAT ---\n\n');

    // 2. Fetch User Profile
    const userProfileResponse = await fetchUserProfile();
    const profileContext = userProfileResponse.success
      ? userProfileResponse.profileText
      : 'User profile not available.';

    // 3. Search for relevant memories
    let relevantMemories: ScoredMemoryPoint[] = [];
    try {
      const memorySearchQuery = `Communication patterns, relationship dynamics, conflict resolution, personal growth related to: ${aggregatedChatData.substring(0, 500)}...`;
      const memoryResultsResponse = await searchMemory(memorySearchQuery, {
        limit: 10,
        filter: {
          should: [
            { key: 'payload.type', match: { value: 'communication_reflection' } },
            { key: 'payload.type', match: { value: 'relationship_goal' } },
            { key: 'payload.type', match: { value: 'conflict_resolution' } },
            { key: 'payload.type', match: { value: 'journal' } },
          ],
        },
      });
      if (memoryResultsResponse.success && memoryResultsResponse.results) {
        relevantMemories = memoryResultsResponse.results;
        logger.info('[COMM_PATTERNS_API][MEMORY_SEARCH_SUCCESS]', {
          ...logContext,
          memoryCount: relevantMemories.length,
        });
      }
    } catch (memErr: unknown) {
      logger.error('[COMM_PATTERNS_API][MEMORY_SEARCH_ERROR]', { ...logContext, error: memErr });
    }
    const memoryContext = relevantMemories.map((m) => m.payload.text).join('\n\n');

    // For sentiment trend, let's assume the LLM can provide this for each chat.
    // In a real scenario, this would involve either a separate LLM call per chat or a more complex prompt.
    const individualChatSummariesPrompt = chatTranscripts
      .map((transcript, index) => `Chat ${index + 1}: ${transcript.substring(0, 200)}...`)
      .join('\n');

    const llmPromptForAnalysis = `
      You are a highly skilled communication and relationship dynamics analyst for Tomide Adeoye.
      Your task is to analyze multiple WhatsApp chat transcripts to identify recurring communication patterns,
      suggest actionable strategies for improvement, provide an overall summary of Tomide's communication style,
      and provide a sentiment analysis and concise summary for *each individual chat transcript* provided.
      Integrate insights from Tomide's user profile and relevant personal memories.

      User Profile: ${profileContext}
      Relevant Memories: ${memoryContext}

      **Instructions:**
      1. Identify 3-5 *recurring* communication patterns observed across the aggregated chats. For each, provide:
         - A concise name.
         - A detailed description with specific examples or characteristics.
         - An assessment of its frequency (High/Medium/Low).
         - Its general sentiment impact (positive/negative/neutral).
      2. For each identified pattern, propose 1-2 *actionable strategies* for Tomide to improve or leverage it.
         These strategies should be practical, step-by-step, and align with Tomide's stated goals and values (e.g., self-mastery, direct communication, setting boundaries).
      3. Provide an overall summary of Tomide's communication style based on the comprehensive analysis.
      4. For *each individual chat transcript* provided, give a \`chatIndex\` (starting from 0), \`overallSentiment\` ('positive', 'negative', 'neutral', or 'mixed'), \`sentimentScore\` (e.g., between -1 and 1), and a \`summary\` of that specific chat.
      5. Ensure the output is a JSON object with the following keys:
         - "recurringPatterns" (array of objects)
         - "suggestedStrategies" (array of objects)
         - "overallCommunicationSummary" (string)
         - "chatAnalysisSummaries" (array of IndividualChatAnalysisSummary objects)

      **Chat Transcripts for Analysis (Aggregated):**
      ---
      ${aggregatedChatData}
      ---

      **Individual Chat Snippets for Detailed Sentiment/Summary (for your internal reference and analysis):**
      ---
      ${individualChatSummariesPrompt}
      ---
    `;

    // 5. Call LLM
    const llmResponse = await generateLLMResponse(
      REQUEST_TYPES.COMMUNICATION_PATTERN_ANALYSIS,
      llmPromptForAnalysis,
      userId,
      {
        responseFormat: 'json_object',
      }
    );

    if (!llmResponse.success || !llmResponse.content) {
      const errorMessage =
        llmResponse.success === false && llmResponse.error
          ? llmResponse.error
          : 'LLM failed to analyze communication patterns.';
      logger.error('[COMM_PATTERNS_API][LLM_FAIL]', { ...logContext, error: errorMessage });
      throw new Error(errorMessage);
    }

    const analysisResult: CommunicationPatternAnalysisResult = JSON.parse(llmResponse.content);
    logger.success('[COMM_PATTERNS_API][SUCCESS]', {
      ...logContext,
      patternsCount: analysisResult.recurringPatterns.length,
    });

    return NextResponse.json({ success: true, analysis: analysisResult });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    logger.error('[COMM_PATTERNS_API][ERROR]', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
