import { NextRequest, NextResponse } from 'next/server';
import { QdrantFilter } from '@/types/orion';
import { MEMORY_COLLECTION_NAME } from '@/lib/constants';

/**
 * API route for searching memories
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      query, 
      limit = 10, 
      filter, 
      withVectors = false,
      minScore = 0.7,
      collectionName = MEMORY_COLLECTION_NAME
    } = body;
    
    // Validate required fields
    if (!query) {
      return NextResponse.json({ 
        success: false, 
        error: 'Query is required' 
      }, { status: 400 });
    }
    
    // Generate embeddings for the query
    const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        texts: [query]
      })
    });
    
    const embeddingData = await embeddingResponse.json();
    
    if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length === 0) {
      throw new Error(embeddingData.error || 'Failed to generate embeddings');
    }
    
    const queryVector = embeddingData.embeddings[0];
    
    // Search for similar vectors in Qdrant
    const searchResponse = await fetch('/api/orion/memory/search-vectors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vector: queryVector,
        limit,
        filter,
        withVectors,
        collectionName
      })
    });
    
    const searchData = await searchResponse.json();
    
    if (!searchData.success) {
      throw new Error(searchData.error || 'Failed to search vectors');
    }
    
    // Filter results by score if minScore is provided
    const filteredResults = searchData.results.filter((result: any) => result.score >= minScore);
    
    return NextResponse.json({ 
      success: true, 
      results: filteredResults
    });
    
  } catch (error: any) {
    console.error('Error in memory/search route:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}