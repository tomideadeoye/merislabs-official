import { NextRequest, NextResponse } from 'next/server';
import { listDirectoryContents, readFileContent, isPathWithinConfiguredDirectories } from '@shared/lib/local_file_service';
import { ORION_MEMORY_COLLECTION_NAME } from '@shared/lib/orion_config';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';

// Constants for indexing
const MAX_FILE_SIZE_MB = 5; // Limit file size for indexing
const MAX_CHUNK_SIZE_CHARS = 2000; // Characters per chunk for embedding

/**
 * Split text into chunks for embedding
 */
function chunkText(text: string, chunkSize: number = MAX_CHUNK_SIZE_CHARS): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Process and index a single file
 */
async function processAndIndexFile(filePath: string): Promise<{ 
  success: boolean; 
  message: string; 
  sourceId?: string; 
  chunksIndexed?: number;
}> {
  try {
    console.log(`[INDEX_PATH_API] Processing file: ${filePath}`);
    
    // Check if file is within allowed directories
    if (!isPathWithinConfiguredDirectories(filePath)) {
      return { 
        success: false, 
        message: `Access denied: Path '${filePath}' is not within configured accessible directories.` 
      };
    }
    
    // Check file size
    const fileStats = await fs.stat(filePath);
    if (fileStats.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return { 
        success: false, 
        message: `File ${filePath} exceeds ${MAX_FILE_SIZE_MB}MB limit.` 
      };
    }
    
    // Read file content
    const fileContent = await readFileContent(filePath);
    
    // Split into chunks
    const textChunks = chunkText(fileContent);
    if (textChunks.length === 0) {
      return { 
        success: true, 
        message: `File ${filePath} had no text content to index.` 
      };
    }
    
    // Generate embeddings
    const embeddingResponse = await fetch('/api/orion/memory/generate-embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ texts: textChunks })
    });
    
    const embeddingData = await embeddingResponse.json();
    
    if (!embeddingData.success || !embeddingData.embeddings || embeddingData.embeddings.length !== textChunks.length) {
      throw new Error(embeddingData.error || `Failed to generate embeddings for ${filePath}`);
    }
    
    // Create memory points
    const fileSourceIdPrefix = `localfile_${path.basename(filePath).replace(/[^a-zA-Z0-9]/g, '_')}`;
    const currentISOTime = new Date().toISOString();
    
    const memoryPoints = textChunks.map((chunk, index) => {
      const pointId = uuidv4();
      const source_id = `${fileSourceIdPrefix}_chunk${index}_${pointId.substring(0, 4)}`;
      
      return {
        id: pointId,
        vector: embeddingData.embeddings[index],
        payload: {
          text: chunk,
          source_id: source_id,
          original_file_path: filePath,
          file_name: path.basename(filePath),
          type: `local_doc_${path.extname(filePath).replace('.', '') || 'generic'}`,
          timestamp: new Date(fileStats.mtimeMs).toISOString(),
          indexed_at: currentISOTime,
          chunk_index: index,
          total_chunks: textChunks.length,
          tags: ["local_file", path.extname(filePath).replace('.', '')]
        }
      };
    });
    
    // Upsert to memory
    const upsertResponse = await fetch('/api/orion/memory/upsert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        points: memoryPoints, 
        collectionName: ORION_MEMORY_COLLECTION_NAME 
      })
    });
    
    const upsertData = await upsertResponse.json();
    
    if (!upsertData.success) {
      throw new Error(upsertData.error || `Failed to upsert chunks for ${filePath}`);
    }
    
    return { 
      success: true, 
      message: `Successfully indexed ${filePath} (${memoryPoints.length} chunks).`, 
      sourceId: fileSourceIdPrefix, 
      chunksIndexed: memoryPoints.length 
    };
  } catch (error: any) {
    console.error(`[INDEX_PATH_API] Error processing file ${filePath}:`, error);
    return { 
      success: false, 
      message: `Error indexing ${filePath}: ${error.message}` 
    };
  }
}

/**
 * API route to index a file or directory
 */
export async function POST(request: NextRequest) {
  try {
    const { pathToIndex } = await request.json();
    
    if (!pathToIndex || typeof pathToIndex !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'pathToIndex is required and must be a string' 
      }, { status: 400 });
    }
    
    // Check if path is within allowed directories
    if (!isPathWithinConfiguredDirectories(pathToIndex)) {
      return NextResponse.json({ 
        success: false, 
        error: `Access denied: Path '${pathToIndex}' is not within configured accessible directories.` 
      }, { status: 403 });
    }
    
    // Check if path exists and get stats
    const stats = await fs.stat(pathToIndex);
    
    let results: any[] = [];
    let totalFilesProcessed = 0;
    let totalChunksIndexed = 0;
    
    if (stats.isFile()) {
      // Process single file
      const result = await processAndIndexFile(pathToIndex);
      results.push({ file: pathToIndex, ...result });
      
      if (result.success && result.chunksIndexed) {
        totalChunksIndexed += result.chunksIndexed;
        totalFilesProcessed++;
      }
    } else if (stats.isDirectory()) {
      // Process directory (top-level files only)
      console.log(`[INDEX_PATH_API] Indexing directory (top-level files only): ${pathToIndex}`);
      
      const items = await listDirectoryContents(pathToIndex);
      
      for (const item of items) {
        if (item.type === 'file') {
          const result = await processAndIndexFile(item.path);
          results.push({ file: item.path, ...result });
          
          if (result.success && result.chunksIndexed) {
            totalChunksIndexed += result.chunksIndexed;
            totalFilesProcessed++;
          }
        }
      }
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Path is not a file or directory.' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Indexing process completed. Processed ${totalFilesProcessed} files, indexed ${totalChunksIndexed} chunks.`,
      details: results 
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/local-fs/index-path:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 });
  }
}