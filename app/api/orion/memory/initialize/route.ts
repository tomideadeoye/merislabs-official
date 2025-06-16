/**
 * @fileoverview This file defines the API route for initializing the Orion Memory system.
 * @description This route is called by the main admin layout on startup to ensure that the
 * backend memory services (like Qdrant) are ready and accessible. It acts as a health
 * check and a crucial first step in the application's boot-up sequence, enabling
 * all subsequent memory-related features.
 */

import { NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { QDRANT_HOST } from '@/lib/orion_config';
import logger from '@/lib/logger';

export async function POST() {
  const operation = 'initializeMemory';
  const timestamp = new Date().toISOString();
  const logContext = {
    operation,
    timestamp,
    route: '/api/orion/memory/initialize',
  };

  logger.info(`[MEMORY_INIT][START] Received request to initialize memory system.`, logContext);

  try {
    logger.debug('[MEMORY_INIT][INFO] Attempting to create Qdrant client instance.', logContext);

    if (!QDRANT_HOST) {
      logger.error('[MEMORY_INIT][ERROR] QDRANT_HOST is not defined in environment variables.', logContext);
      return NextResponse.json(
        {
          success: false,
          error: 'Qdrant host is not configured on the server.',
        },
        { status: 500 }
      );
    }

    logger.info(`[MEMORY_INIT][INFO] Attempting to connect to Qdrant at host: ${QDRANT_HOST}`, logContext);

    const qdrantClient = new QdrantClient({
      url: QDRANT_HOST,
      apiKey: process.env.QDRANT_API_KEY,
      checkCompatibility: false,
    });

    logger.debug('[MEMORY_INIT][INFO] Qdrant client created. Checking connectivity with Qdrant cluster.', logContext);

    // The js-client-rest does not have a simple health check or root API endpoint exposed directly.
    // We'll check for collections as a proxy for connectivity.
    await qdrantClient.getCollections();

    logger.success(
      `[MEMORY_INIT][SUCCESS] Successfully connected to Qdrant and verified collections. Memory system is ready.`,
      logContext
    );

    return NextResponse.json({
      success: true,
      message: 'Memory system initialized successfully.',
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error(
      `[MEMORY_INIT][FATAL] A critical error occurred during memory system initialization. ${errorMessage}`,
      {
        ...logContext,
        error: errorMessage,
        originalError: error,
      }
    );

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize memory system due to a fatal error.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
