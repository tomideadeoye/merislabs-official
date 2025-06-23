/**
 * @fileoverview API route for generating personalized words of affirmation.
 * @description This route retrieves user history from the Qdrant vector database and uses an LLM to generate
 *   context-aware words of affirmation, designed to be deeply resonant and supportive.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Receive a request to generate affirmations.
 *   - Query the Qdrant database for relevant user memories/history.
 *   - Utilize an LLM to synthesize these memories into personalized affirmations.
 *   - Return the generated affirmations to the client.
 *
 * FILEPATH: `app/api/orion/narrative/affirmations/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/lib/orion_memory.ts`: Imports `searchMemory` to retrieve contextual user data from Qdrant.
 *   - `app/lib/orion_llm.ts`: Imports `generateLLMResponse` and `REQUEST_TYPES` for LLM interaction.
 *   - `@/lib/logger.ts`: Used for comprehensive logging of request, processing, and response.
 *   - `app/api/auth/[...nextauth]/route.ts`: Utilizes NextAuth.js for session management and user authentication.
 *   - `@/components/orion/narrative-clarity-studio/AffirmationsGenerator.tsx`: (To be created) This component will send requests to this API route.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the Qdrant database is accessible and contains relevant user history.
 *   - Assumes the LLM is capable of generating encouraging and contextually appropriate affirmations.
 *   - Authentication is required to ensure affirmations are personalized for the correct user.
 *   - The LLM prompt is designed to encourage positive and empowering language based on retrieved memories.
 *
 * NOTES:
 *   - OPPORTUNITIES FOR IMPROVEMENT: Consider adding parameters for specifying the *type* or *focus* of affirmations (e.g., career-focused, emotional resilience, personal growth).
 *   - PERFORMANCE OPTIMIZATIONS: Memory retrieval and LLM calls can be time-consuming; implement caching if affirmations are frequently requested for the same context.
 *   - ERROR HANDLING ROBUSTNESS: Implement robust error handling for LLM failures or database retrieval issues.
 *
 * OPPORTUNITIES TO CONSOLIDATE: None immediately apparent, this is a distinct LLM-driven feature.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';
import { searchMemory } from '@/lib/orion_memory';

const TEMP_USER_ID = 'temp_affirmation_user';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) {
    logger.warn('[affirmations][POST] Unauthorized access attempt.');
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user?.id || TEMP_USER_ID;

  try {
    const { contextPrompt } = await request.json(); // Optional: user can provide a prompt to guide affirmations

    logger.info('[affirmations][POST] Generating affirmations.', { userId, contextPrompt });

    // Step 1: Retrieve relevant memories from Qdrant
    const memoryResponse = await searchMemory(contextPrompt || 'my personal history and achievements', {
      limit: 5,
      filter: { must: [{ key: 'userId', match: { value: userId } }] }, // Filter by userId
    });

    const memoryResults = memoryResponse.results; // Access the results array

    const memoryContext =
      memoryResults && memoryResults.length > 0
        ? memoryResults.map((mem: { payload: { text: unknown } }) => `- ${String(mem.payload.text).trim()}`).join('\n')
        : 'No specific relevant memories found. Generating general affirmations.';

    // Step 2: Construct LLM Prompt for Affirmations
    const prompt = `
    You are an exceptionally insightful and empathetic AI, designed to provide powerful words of affirmation.
    Your task is to generate 5 concise, deeply resonant, and empowering affirmations for the user.
    These affirmations should be based on the provided user context and historical memories, focusing on their strengths, progress, and inherent worth.

    **User Context / Memories:**
    ${memoryContext}
    ${
      contextPrompt
        ? `
    **Additional User Prompt/Focus:**
    ${contextPrompt}`
        : ''
    }

    **Instructions:**
    1. Generate 5 distinct affirmations. Each affirmation should be a single, impactful sentence.
    2. Focus on themes of strength, resilience, growth, capability, self-worth, and future potential.
    3. Ensure the affirmations are positive, encouraging, and actionable where appropriate.
    4. Return ONLY a valid JSON array of strings, where each string is an affirmation.
    Example: ["You are capable of achieving your wildest dreams.", "Your resilience is your superpower.", ...]
    `;

    // Step 3: Call LLM to generate affirmations
    const llmResponse = await generateLLMResponse(
      REQUEST_TYPES.WORDS_OF_AFFIRMATION, // Assuming this is defined or will be added
      prompt,
      userId,
      { responseFormat: 'json_object' }
    );

    if (!llmResponse.success) {
      logger.error('[affirmations][POST] LLM failed to generate affirmations.', {
        userId,
        llmError: llmResponse.error,
        llmContent: llmResponse.content,
      });
      return NextResponse.json(
        { success: false, error: llmResponse.error || 'Failed to generate affirmations.' },
        { status: 500 }
      );
    }

    if (!llmResponse.content) {
      logger.error('[affirmations][POST] LLM returned empty content.', { userId });
      return NextResponse.json({ success: false, error: 'LLM generated an empty response.' }, { status: 500 });
    }

    let affirmations: string[];
    try {
      affirmations = JSON.parse(llmResponse.content);
      if (!Array.isArray(affirmations) || affirmations.some((item) => typeof item !== 'string')) {
        throw new Error('Invalid JSON format for affirmations.');
      }
    } catch (parseError: unknown) {
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error.';
      logger.error('[affirmations][POST] Failed to parse LLM response as JSON array of strings.', {
        userId,
        parseError: errorMessage,
        rawResponse: llmResponse.content,
      });
      return NextResponse.json({ success: false, error: 'Invalid response format from LLM.' }, { status: 500 });
    }

    logger.success('[affirmations][POST] Successfully generated affirmations.', { userId, count: affirmations.length });
    return NextResponse.json({ success: true, affirmations });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    logger.error('[affirmations][POST] Uncaught error during affirmation generation.', {
      userId, // Use userId from session if available, otherwise TEMP_USER_ID
      error: errorMessage,
      stack: error instanceof Error ? error.stack : 'N/A',
    });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
