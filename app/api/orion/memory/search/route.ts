import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { 
  QDRANT_HOST, 
  QDRANT_PORT, 
  ORION_MEMORY_COLLECTION_NAME 
} from "@/lib/orion_config";
import { spawn } from "child_process";
import path from "path";
import { auth } from "@/auth";

export async function POST(request: NextRequest) {
  // Check authentication
  const session = await auth();
  if (!session) {
    return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { 
      queryText, 
      limit = 5, 
      filter,
      collectionName = ORION_MEMORY_COLLECTION_NAME
    } = body;

    if (!queryText) {
      return NextResponse.json(
        { success: false, error: "Invalid 'queryText' parameter. Expected a non-empty string." },
        { status: 400 }
      );
    }

    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(queryText);
    
    // Initialize the Qdrant client
    const client = new QdrantClient({
      url: `http://${QDRANT_HOST}:${QDRANT_PORT}`
    });
    
    // Search Qdrant with the query embedding
    const searchResults = await client.search(collectionName, {
      vector: queryEmbedding,
      limit: limit,
      filter: filter || undefined,
      with_payload: true,
      with_vector: false,
    });

    return NextResponse.json({ 
      success: true, 
      results: searchResults,
      count: searchResults.length
    });

  } catch (error: any) {
    console.error("Search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search memory.", details: error.message || String(error) },
      { status: 500 }
    );
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'scripts', 'generate_embeddings.py')
    ]);
    
    let outputData = '';
    let errorData = '';
    
    // Send the text to the Python script
    pythonProcess.stdin.write(JSON.stringify([text]));
    pythonProcess.stdin.end();
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${errorData}`));
        return;
      }
      
      try {
        const embeddings = JSON.parse(outputData);
        resolve(embeddings[0]); // Return the first (and only) embedding
      } catch (error) {
        reject(new Error(`Failed to parse embedding: ${error}`));
      }
    });
  });
}