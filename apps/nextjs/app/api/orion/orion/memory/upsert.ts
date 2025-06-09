import { NextApiRequest, NextApiResponse } from 'next';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ORION_MEMORY_COLLECTION_NAME } from '@shared/lib/orion_config';

// Initialize Qdrant client
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { points, collectionName = ORION_MEMORY_COLLECTION_NAME } = req.body;

    if (!points || !Array.isArray(points) || points.length === 0) {
      return res.status(400).json({ success: false, error: 'Points array is required and cannot be empty.' });
    }

    // Validate each point has the required fields
    for (const point of points) {
      if (!point.id || !point.vector || !Array.isArray(point.vector)) {
        return res.status(400).json({
          success: false,
          error: 'Each point must have an id and a vector array.'
        });
      }
    }

    console.log(`[UPSERT_API] Upserting ${points.length} points to collection: ${collectionName}`);

    // Ensure the collection exists
    try {
      const collections = await qdrantClient.getCollections();
      const collectionExists = collections.collections.some(c => c.name === collectionName);

      if (!collectionExists) {
        console.log(`[UPSERT_API] Collection ${collectionName} does not exist. Creating...`);

        // Get vector dimension from the first point
        const vectorSize = points[0].vector.length;

        await qdrantClient.createCollection(collectionName, {
          vectors: {
            size: vectorSize,
            distance: 'Cosine'
          }
        });

        console.log(`[UPSERT_API] Collection ${collectionName} created successfully.`);
      }
    } catch (error) {
      console.error(`[UPSERT_API] Error checking/creating collection:`, error);
      // Continue anyway, as the collection might exist despite the error
    }

    // Upsert the points
    const upsertResult = await qdrantClient.upsert(collectionName, {
      points: points.map(point => ({
        id: point.id,
        vector: point.vector,
        payload: point.payload || {}
      }))
    });

    console.log(`[UPSERT_API] Upsert successful. Operation ID: ${upsertResult.operation_id}`);

    return res.status(200).json({
      success: true,
      message: 'Points upserted successfully!',
      operation_id: upsertResult.operation_id,
      status: upsertResult.status
    });

  } catch (error: any) {
    console.error('[UPSERT_API_ERROR]', error.message, error.stack);
    return res.status(500).json(
      { success: false, error: 'Failed to upsert points.', details: error.message || "Unknown error" }
    );
  }
}
