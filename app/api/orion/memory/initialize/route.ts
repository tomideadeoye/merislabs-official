import { NextResponse } from 'next/server'
import { qdrantClient } from '@/lib/orion_memory'
import { MEMORY_COLLECTION_NAME, FEEDBACK_COLLECTION_NAME } from '@/lib/constants'
import { logger } from '@/lib/logger'
import { handleApiError } from '@/lib/api-client'

export async function POST() {
  try {
    // Create main memory collection if needed
    const memoryCollectionExists = await qdrantClient.collectionExists(MEMORY_COLLECTION_NAME)
    if (!memoryCollectionExists) {
      await qdrantClient.createCollection(MEMORY_COLLECTION_NAME, {
        vectors: { size: 384, distance: 'Cosine' }
      })
      logger.info(`Created Qdrant collection: ${MEMORY_COLLECTION_NAME}`)
    }

    // Create feedback collection if needed
    const feedbackCollectionExists = await qdrantClient.collectionExists(FEEDBACK_COLLECTION_NAME)
    if (!feedbackCollectionExists) {
      await qdrantClient.createCollection(FEEDBACK_COLLECTION_NAME, {
        vectors: { size: 384, distance: 'Cosine' }
      })
      logger.info(`Created Qdrant collection: ${FEEDBACK_COLLECTION_NAME}`)
    }

    return NextResponse.json({
      status: true,
      initializedCollections: [
        MEMORY_COLLECTION_NAME,
        FEEDBACK_COLLECTION_NAME
      ]
    })

  } catch (error) {
    return handleApiError(error)
  }
}
