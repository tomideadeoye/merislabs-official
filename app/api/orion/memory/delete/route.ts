import { NextRequest, NextResponse } from 'next/server';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';
import axios from 'axios';

/**
 * API route to delete memory points from Qdrant
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, collectionName = ORION_MEMORY_COLLECTION_NAME } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Missing required parameter: ids' }, { status: 400 });
    }

    // Get Qdrant host and port from environment variables or use defaults
    const qdrantHost = process.env.QDRANT_HOST || 'localhost';
    const qdrantPort = process.env.QDRANT_PORT || '6333';
    if (!process.env.QDRANT_HOST) {
      console.warn('[MEMORY_DELETE][ENV][FALLBACK] QDRANT_HOST not set, using default "localhost".');
    }
    if (!process.env.QDRANT_PORT) {
      console.warn('[MEMORY_DELETE][ENV][FALLBACK] QDRANT_PORT not set, using default "6333".');
    }
    console.log('[MEMORY_DELETE][ENV] QDRANT_HOST and QDRANT_PORT values at runtime:', { QDRANT_HOST: process.env.QDRANT_HOST, QDRANT_PORT: process.env.QDRANT_PORT });
    const qdrantUrl = `http://${qdrantHost}:${qdrantPort}`;
    console.info('[MEMORY_DELETE][QDRANT_URL] Full Qdrant URL constructed:', qdrantUrl);

    // Delete points from Qdrant
    try {
      const deleteResponse = await axios.post(`${qdrantUrl}/collections/${collectionName}/points/delete`, {
        points: ids,
      });
      console.info('[MEMORY_DELETE][QDRANT_API][RESULT] Delete response:', { status: deleteResponse.status, statusText: deleteResponse.statusText, data: deleteResponse.data });
      if (deleteResponse.status !== 200) {
        throw new Error(`Failed to delete points: ${deleteResponse.statusText}`);
      }
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${ids.length} memory points`,
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('[MEMORY_DELETE_ERROR]', errorMessage, error);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete memory points',
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('[MEMORY_DELETE_ERROR]', errorMessage, error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete memory points',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
