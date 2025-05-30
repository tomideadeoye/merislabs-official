/**
 * Test script for Orion Memory API routes
 * Run with: node scripts/test-memory-api.js
 */

const { default: fetch } = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

const BASE_URL = 'http://localhost:3000/api/orion/memory';
const AUTH_TOKEN = 'admin-token';

async function testMemoryAPI() {
  try {
    console.log('Testing Orion Memory API routes...');
    
    // Test 1: Initialize memory
    console.log('\n1. Testing memory initialization...');
    const initResponse = await fetch(`${BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({})
    });
    
    const initResult = await initResponse.json();
    console.log('Initialization result:', initResult);
    
    if (!initResult.success) {
      console.error('Memory initialization failed. Stopping tests.');
      return;
    }
    
    // Test 2: Generate embeddings
    console.log('\n2. Testing generate embeddings...');
    const embeddingResponse = await fetch(`${BASE_URL}/generate-embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        texts: ['Hello world', 'Testing embeddings']
      })
    });
    
    const embeddingResult = await embeddingResponse.json();
    console.log('Generate embeddings result:', {
      success: embeddingResult.success,
      model: embeddingResult.model,
      embeddingCount: embeddingResult.embeddings?.length || 0,
      firstEmbeddingLength: embeddingResult.embeddings?.[0]?.length || 0
    });
    
    if (!embeddingResult.success) {
      console.error('Embedding generation failed. Stopping tests.');
      return;
    }
    
    // Test 3: Upsert memory
    console.log('\n3. Testing upsert memory...');
    const samplePoints = [
      {
        id: uuidv4(),
        vector: embeddingResult.embeddings[0],
        payload: {
          text: 'Hello world',
          source_id: 'test-source',
          timestamp: new Date().toISOString(),
          tags: ['test', 'hello'],
          chunk_index: 0
        }
      },
      {
        id: uuidv4(),
        vector: embeddingResult.embeddings[1],
        payload: {
          text: 'Testing embeddings',
          source_id: 'test-source',
          timestamp: new Date().toISOString(),
          tags: ['test', 'embeddings'],
          chunk_index: 1
        }
      }
    ];
    
    const upsertResponse = await fetch(`${BASE_URL}/upsert`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        points: samplePoints
      })
    });
    
    const upsertResult = await upsertResponse.json();
    console.log('Upsert result:', upsertResult);
    
    if (!upsertResult.success) {
      console.error('Upsert failed. Stopping tests.');
      return;
    }
    
    // Wait a moment for indexing
    console.log('Waiting for indexing...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Test 4: Search memory
    console.log('\n4. Testing search memory...');
    const searchResponse = await fetch(`${BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      body: JSON.stringify({
        query: 'Hello world',
        limit: 3
      })
    });
    
    const searchResult = await searchResponse.json();
    console.log('Search result:', {
      success: searchResult.success,
      count: searchResult.count,
      results: searchResult.results?.map(r => ({
        id: r.id,
        score: r.score,
        text: r.payload?.text
      }))
    });
    
    console.log('\nAll tests completed!');
    
  } catch (error) {
    console.error('Error during tests:', error);
  }
}

testMemoryAPI();