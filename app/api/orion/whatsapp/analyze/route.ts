import { NextRequest, NextResponse } from 'next/server';
import { analyzeWhatsAppChat } from '@/app/shared'; // This will be imported on the server

/**
 * API route for analyzing WhatsApp chat exports
 */
export async function POST(request: NextRequest) {
  try {
    const { chatTranscript, userProfileContext } = await request.json();

    if (!chatTranscript || typeof chatTranscript !== 'string') {
      return NextResponse.json({ error: 'Chat transcript is required.' }, { status: 400 });
    }

    // Call the server-side function to analyze the chat
    const analysisResult = await analyzeWhatsAppChat(chatTranscript, userProfileContext);

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error: unknown) {
    console.error('[API/WHATSAPP/ANALYZE] Error analyzing chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
