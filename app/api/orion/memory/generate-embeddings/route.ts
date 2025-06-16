import { NextRequest, NextResponse } from 'next/server';
import { PYTHON_API_URL } from '@/lib/orion_config';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { texts } = body;

  if (!PYTHON_API_URL) {
    logger.error('[GENERATE_EMBEDDINGS_API] Embedding service is not configured.');
    return NextResponse.json({ success: false, error: 'Embedding service is not configured.' }, { status: 500 });
  }
  if (!texts || !Array.isArray(texts) || texts.length === 0) {
    logger.warn('[GENERATE_EMBEDDINGS_API] Texts array is required and cannot be empty.');
    return NextResponse.json(
      { success: false, error: 'Texts array is required and cannot be empty.' },
      { status: 400 }
    );
  }

  const pythonEndpoint = `${PYTHON_API_URL}/api/v1/embeddings/generate`;
  const pythonResponse = await fetch(pythonEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  });

  if (!pythonResponse.ok) {
    const errorBody = await pythonResponse.json().catch(() => ({ detail: pythonResponse.statusText }));
    logger.error('[GENERATE_EMBEDDINGS_API] Failed to generate embeddings from Python service.', {
      status: pythonResponse.status,
      statusText: pythonResponse.statusText,
      errorDetails: errorBody,
    });
    return NextResponse.json(
      {
        success: false,
        error: errorBody.detail || 'Failed to generate embeddings.',
      },
      { status: 500 }
    );
  }

  const pythonData = await pythonResponse.json();
  logger.info('[GENERATE_EMBEDDINGS_API] Embeddings generated successfully.', {
    count: pythonData.embeddings.length,
  });
  return NextResponse.json({
    success: true,
    embeddings: pythonData.embeddings,
  });
}
