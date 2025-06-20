import { NextRequest, NextResponse } from 'next/server';

import logger from '@/lib/logger';

/**
 * API route for analyzing WhatsApp chat exports
 * @fileoverview This API route acts as a proxy, receiving WhatsApp chat transcripts from the frontend
 *   and forwarding them to the external Python backend service (running at `localhost:8000`)
 *   for parsing and analysis. It then returns the structured chat data received from the Python service
 *   back to the frontend.
 * @description It serves as the secure and efficient bridge between the Next.js client and the
 *   independent Python chat analysis service, facilitating robust chat processing while adhering to
 *   a modular microservices architecture.
 *
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - To receive WhatsApp chat transcript uploads from the frontend.
 *   - To securely proxy these transcripts to the external Python chat analysis service.
 *   - To receive the parsed, structured chat data from the Python service and return it to the client.
 *   - To handle network errors and service unavailability gracefully, providing clear feedback.
 *   - To ensure comprehensive logging of request flow and any issues for traceability.
 *
 * FILEPATH: `app/api/orion/whatsapp/analyze/route.ts`.
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/draft-communication/DraftCommunicationClientWrapper.tsx`: Sends the chat transcript to this API endpoint.
 *   - `http://localhost:8000/analyze-chat` (External Python API Endpoint): This is the target endpoint for the POST request, where the core WhatsApp chat parsing logic resides.
 *   - `packages/shared/lib/logger.ts`: Used for comprehensive logging.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes the external Python backend service is running and accessible at `http://localhost:8000`.
 *   - Assumes the `/analyze-chat` endpoint on the Python service expects a JSON body with a `chatTranscript` field
 *     and returns a JSON object containing the `analysisResult`.
 *   - This route no longer handles local file operations or spawns child processes; it purely acts as a proxy.
 *   - Security: Sensitive chat data is directly streamed to the Python service; ensure the Python service's security measures are robust.
 *
 * NOTES:
 *   - This route is crucial for the "Chat Export Processing & Analysis" feature within Orion's distributed architecture.
 *   - Performance: Direct HTTP communication is generally efficient, but network latency to the Python service should be considered.
 *   - Scalability: Decoupling the Python service allows for independent scaling and deployment.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - Implement robust retry mechanisms for Python service requests to handle transient network issues.
 *   - Add more detailed error mapping for different response codes from the Python backend.
 *   - Introduce a configurable environment variable for the Python backend URL (`process.env.PYTHON_ANALYZE_API_URL`).
 *   - Implement a timeout for the external API call to prevent indefinite waiting.
 */
export async function POST(request: NextRequest) {
  logger.info(
    'Operation: POST /api/orion/whatsapp/analyze | Status: Initiated | Message: Received request to analyze WhatsApp chat.'
  );

  try {
    const { chatTranscript } = await request.json();

    if (!chatTranscript || typeof chatTranscript !== 'string') {
      logger.warn(
        'Operation: POST /api/orion/whatsapp/analyze | Status: Validation Failed | Message: Chat transcript is missing or invalid.'
      );
      return NextResponse.json({ error: 'Chat transcript is required.' }, { status: 400 });
    }

    logger.info(
      'Operation: POST /api/orion/whatsapp/analyze | Status: Proxying Request | Target: http://localhost:8000/analyze-chat | Message: Forwarding chat transcript to external Python service.'
    );

    const pythonBackendResponse = await fetch('http://localhost:8000/analyze-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatTranscript }),
    });

    if (!pythonBackendResponse.ok) {
      const errorData = await pythonBackendResponse.json();
      logger.error(
        `Operation: POST /api/orion/whatsapp/analyze | Status: Python Service Error | Code: ${pythonBackendResponse.status} | Error: ${errorData.detail || errorData.error || 'Unknown error from Python service'} | Message: External Python service returned an error.`
      );
      return NextResponse.json(
        {
          error: errorData.detail || errorData.error || 'Failed to analyze chat via external service.',
        },
        { status: pythonBackendResponse.status }
      );
    }

    const analysisResult = await pythonBackendResponse.json();
    logger.info(
      'Operation: POST /api/orion/whatsapp/analyze | Status: Success | Message: Chat analysis complete via external service.'
    );

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error: unknown) {
    logger.error(
      `Operation: POST /api/orion/whatsapp/analyze | Status: Failed | Error: ${(error as Error).message} | Message: An error occurred during chat analysis API proxying.`
    );
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during chat analysis.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
