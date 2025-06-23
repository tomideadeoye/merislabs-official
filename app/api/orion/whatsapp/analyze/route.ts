import { NextRequest, NextResponse } from 'next/server';
// Removed: import { auth } from '@/auth'; // Authentication removed as per user request
import { analyzeWhatsAppChat } from '@/lib/whatsapp_analyzer';
import logger from '@/lib/logger';
import { generateLLMResponse, REQUEST_TYPES } from '@/lib/orion_llm';

// GOAL: I understand you're looking for seamless integration of the memory chunk visualizer within the agentic workflow and comprehensive caching to local storage for enhanced speed and responsiveness. I'll investigate both aspects to provide you with a detailed answer and propose any necessary implementations.

/**
 * @fileoverview API route for analyzing WhatsApp chat exports.
 * @description Receives a chat transcript, passes it to a specialized backend service (or LLM) for analysis,
 * and returns structured insights about communication patterns, topics, and sentiment.
 */

// const TEMP_USER_ID = 'temp_whatsapp_user'; // Temporary user ID for LLM calls (removed as authentication is no longer required)

export async function POST(request: NextRequest) {
  const logContext = { route: '/api/orion/whatsapp/analyze', timestamp: new Date().toISOString() };
  logger.info('[WHATSAPP_ANALYZE_API][POST][START]', logContext);

  // Removed authentication check as per user request
  // const session = await auth();
  // if (!session) {
  //   logger.warn('[WHATSAPP_ANALYZE_API][POST][AUTH_FAIL] Unauthorized access attempt.', logContext);
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  // Removed: Using a placeholder userId since authentication is removed
  // const userId = 'unauthenticated_whatsapp_user';

  try {
    const { chatContent } = await request.json();

    if (!chatContent) {
      logger.warn('[WHATSAPP_ANALYZE_API][VALIDATION_FAIL] Chat content is missing.', logContext);
      return NextResponse.json({ success: false, error: 'Chat content is required.' }, { status: 400 });
    }

    logger.info('[WHATSAPP_ANALYZE_API][ANALYSIS_START] Initiating chat analysis.', {
      ...logContext,
      content_length: chatContent.length,
    });
    const analysisResult = await analyzeWhatsAppChat(chatContent, null); // Pass null for userId as it's no longer authenticated

    logger.success('[WHATSAPP_ANALYZE_API][POST][SUCCESS] Chat analysis completed.', logContext);
    return NextResponse.json({ success: true, analysis: analysisResult });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('[WHATSAPP_ANALYZE_API][POST][ERROR] Failed to analyze WhatsApp chat.', {
      ...logContext,
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: `Failed to analyze chat: ${errorMessage}` }, { status: 500 });
  }
}
