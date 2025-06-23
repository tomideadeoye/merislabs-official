import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import logger from '@/lib/logger';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';

// GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.


/**
 * @fileoverview API route for analyzing WhatsApp chat exports.
 * @description Receives a chat transcript, passes it to a specialized backend service (or LLM) for analysis,
 * and returns structured insights about communication patterns, topics, and sentiment.
 */

const TEMP_USER_ID = 'temp_whatsapp_user'; // Temporary user ID for LLM calls

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

  const userId = session.user?.id || TEMP_USER_ID;

  try {
    const { chatTranscript } = await request.json();
    if (!chatTranscript || typeof chatTranscript !== 'string') {
      return NextResponse.json({ success: false, error: 'Chat transcript is required.' }, { status: 400 });
    }

    const prompt = `
            You are a communications and relationship dynamics analyst. Analyze the following WhatsApp chat transcript.
            Provide a structured analysis in JSON format with the following keys:
            - "summary": A brief overview of the conversation.
            - "sentimentTrend": Describe the emotional arc of the conversation (e.g., 'neutral -> tense -> resolved').
            - "communicationPatterns": An array of strings identifying notable patterns (e.g., 'User A uses clarifying questions', 'User B tends to deflect with humor').
            - "keyThemes": An array of strings listing the main topics discussed.

            **Chat Transcript:**
            ---
            ${chatTranscript}
            ---
        `;

    const llmResponse = await generateLLMResponse(REQUEST_TYPES.WHATSAPP_CHAT_ANALYSIS, prompt, userId, {
      responseFormat: 'json_object',
    });

    if (!llmResponse.success) {
      // Safely access error property only if success is false
      const errorMessage = llmResponse.error || 'LLM failed to analyze chat.';
      throw new Error(errorMessage);
    }

    const analysis = JSON.parse(llmResponse.content);
    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    logger.error('[WHATSAPP_ANALYZE_API] Error', { error: errorMessage });
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
