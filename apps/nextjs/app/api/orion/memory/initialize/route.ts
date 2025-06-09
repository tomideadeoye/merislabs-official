/**
 * @fileoverview This file defines the API route for initializing the Orion Memory system.
 * @description This route is called by the main admin layout on startup to ensure that the
 * backend memory services (like Qdrant) are ready and accessible. It acts as a health
 * check and a crucial first step in the application's boot-up sequence, enabling
 * all subsequent memory-related features.
 */

import { NextResponse } from 'next/server';
import { QdrantClient } from '@qdrant/js-client-rest';
import { QDRANT_HOST, QDRANT_API_KEY } from '@shared/lib/orion_server_config';

export async function POST() {
  const operation = "initializeMemory";
  const timestamp = new Date().toISOString();
  const logContext = {
    operation,
    timestamp,
    route: '/api/orion/memory/initialize'
  };

  console.info(`[MEMORY_INIT][START] Received request to initialize memory system.`, logContext);

  try {
    console.log("[MEMORY_INIT][INFO] Attempting to create Qdrant client instance.", logContext);

    if (!QDRANT_HOST) {
      console.error("[MEMORY_INIT][ERROR] QDRANT_HOST is not defined in environment variables.", logContext);
      return NextResponse.json({
        success: false,
        error: "Qdrant host is not configured on the server.",
      }, { status: 500 });
    }

    console.log(`[MEMORY_INIT][INFO] Attempting to connect to Qdrant at host: ${QDRANT_HOST}`, logContext);

    const qdrantClient = new QdrantClient({
      url: QDRANT_HOST,
      apiKey: QDRANT_API_KEY,
      checkCompatibility: false,
    });

    console.log("[MEMORY_INIT][INFO] Qdrant client created. Checking connectivity with Qdrant cluster.", logContext);

    // The js-client-rest does not have a simple health check or root API endpoint exposed directly.
    // We'll check for collections as a proxy for connectivity.
    await qdrantClient.getCollections();

    console.info(`[MEMORY_INIT][SUCCESS] Successfully connected to Qdrant and verified collections. Memory system is ready.`, logContext);

    return NextResponse.json({ success: true, message: "Memory system initialized successfully." });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error(`[MEMORY_INIT][FATAL] A critical error occurred during memory system initialization.`, { ...logContext, error: errorMessage });

    return NextResponse.json({
      success: false,
      error: "Failed to initialize memory system due to a fatal error.",
      details: errorMessage
    }, { status: 500 });
  }
}
