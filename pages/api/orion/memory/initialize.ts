import { NextApiRequest, NextApiResponse } from 'next';
import { QdrantClient } from '@qdrant/js-client-rest';
import { ORION_MEMORY_COLLECTION_NAME } from '@/lib/orion_config';

// Initialize Qdrant client
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333'
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { collectionName = ORION_MEMORY_COLLECTION_NAME } = req.body;

    console.log(`[INITIALIZE_API] Initializing collection: ${collectionName}`);

    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (collection) => collection.name === collectionName
    );

    if (collectionExists) {
      console.log(`[INITIALIZE_API] Collection ${collectionName} already exists.`);
      return res.status(200).json({
        success: true,
        message: 'Collection already exists.',
        collectionName
      });
    }

    await qdrantClient.createCollection(collectionName, {
      vectors: {
        size: 384, // all-MiniLM-L6-v2 embedding size
        distance: 'Cosine'
      }
    });

    console.log(`[INITIALIZE_API] Collection ${collectionName} created successfully.`);

    return res.status(200).json({
      success: true,
      message: 'Collection initialized successfully.',
      collectionName
    });

  } catch (error: any) {
    console.error('[INITIALIZE_API_ERROR]', error.message, error.stack);
    return res.status(500).json(
      { success: false, error: 'Failed to initialize collection.', details: error.message || "Unknown error" }
    );
  }
}
