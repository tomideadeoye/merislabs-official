/**
 * GOAL OF FILE|FEATURES|FUNCTIONS:
 *   - Acts as a proxy endpoint (`/api/orion/memory/upsert-proxy`) for forwarding memory upsert requests to a Python backend service.
 *   - This allows the Next.js frontend to interact with a potentially separate Python-based memory management or embedding generation service.
 *   - Simplifies the client-side interaction by abstracting the direct Python API endpoint.
 *   - Ensures that the `Content-Type` header is correctly set for JSON communication.
 *
 * FILEPATH: `app/api/orion/memory/upsert-proxy/route.ts`
 *
 * CONNECTION/RELATION TO OTHER FILES|FEATURES|FUNCTIONS|FILEPATHS:
 *   - `app/(orion_admin)/admin/memory-manager/page.tsx`: The UI component where users might initiate memory upsert operations, which could indirectly call this proxy.
 *   - `app/components/ui/orion/DedicatedAddToMemoryFormComponent.tsx`: The form that collects memory data and sends it to an upsert endpoint, potentially this proxy.
 *   - Python Backend (`process.env.PYTHON_API_URL`): The actual service that handles the memory upsert logic (e.g., embedding generation, Qdrant upsert).
 *   - `app/api/orion/memory/upsert/route.ts`: This proxy might be used to forward requests to the Python backend that then calls the internal `upsert/route.ts` or directly handles Qdrant operations.
 *
 * ASSUMPTIONS & CLEAR COMMENTS:
 *   - Assumes `process.env.PYTHON_API_URL` is correctly configured to point to the Python backend's base URL.
 *   - Expects the Python backend to return a JSON response that can be directly forwarded back to the client.
 *   - The proxy logs incoming request bodies and outgoing responses for debugging purposes.
 *   - Handles potential JSON parsing errors from the Python backend.
 *
 * NOTES:
 *   - This proxy is essential for architectures where memory management or complex AI operations are delegated to a separate backend service (e.g., Python for machine learning tasks).
 *   - The current logging uses `console.log` and `console.error`; integrating `@/lib/logger.ts` would provide more consistent and structured logging.
 *   - The `NextRequest` and `NextResponse` objects are used, indicating compatibility with the Next.js App Router.
 *
 * OPPORTUNITIES FOR IMPROVEMENT:
 *   - **Centralized Logging**: Replace `console.log` and `console.error` with the `logger` utility from `@/lib/logger.ts` for standardized logging.
 *   - **Centralized Error Handling**: Implement `handleApiError` from `@/lib/utils/errorHandler.ts` for consistent error responses and improved traceability.
 *   - **Asynchronous Processing/Queueing**: If the Python backend operations are long-running, consider implementing a messaging queue (e.g., RabbitMQ, Kafka) between this proxy and the Python service to avoid timeouts.
 *   - **Authentication/Authorization**: Implement or strengthen authentication/authorization checks if this proxy is exposed to external clients and requires secure access to the Python backend.
 *   - **Retry Mechanism**: Implement a retry mechanism for transient network or backend errors to improve robustness.
 *
 * OPPORTUNITIES TO CONSOLIDATE:
 *   - If multiple proxy endpoints are needed for the Python backend, a generic proxy utility could be created to reduce code duplication.
 *   - The logging and error handling patterns can be consolidated to align with the rest of the application's API routes.
 */
import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { handleApiError, HandledError } from '@/lib/utils/errorHandler';

/**
 * Proxy endpoint for upserting memory
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    logger.debug('[UPsert-Proxy] Incoming request body:', { body });

    // Forward the request to the Python API
    const pythonApiUrl = process.env.PYTHON_API_URL || 'http://localhost:5002';
    const pythonUrl = `${pythonApiUrl}/api/memory/upsert`;
    logger.debug('[UPsert-Proxy] Forwarding to Python backend:', { pythonUrl });

    const response = await fetch(pythonUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseErr: unknown) {
      logger.error('[UPsert-Proxy] Failed to parse Python backend response:', { text, error: parseErr });
      throw parseErr;
    }
    logger.debug('[UPsert-Proxy] Python backend response:', { data });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const logContext = { route: '/api/orion/memory/upsert-proxy', timestamp: new Date().toISOString() };
    const handledError = handleApiError(error, logContext);
    return NextResponse.json(
      {
        success: false,
        error: handledError.message,
        details: handledError.data,
      },
      { status: handledError.status || 500 }
    );
  }
}
