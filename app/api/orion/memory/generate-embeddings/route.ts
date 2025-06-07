import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face inference client
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
const MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ success: false, error: 'Texts array is required and cannot be empty.' }, { status: 400 });
    }

    // Filter out any non-string or empty texts
    const validTexts = texts.filter(text => typeof text === 'string' && text.trim() !== '');

    if (validTexts.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid texts provided.' }, { status: 400 });
    }

    console.log(`[EMBEDDING_API] Generating embeddings for ${validTexts.length} texts...`);

    // Try HuggingFace first
    let results: { text: string, embedding: any, error: string | null }[] = [];
    let successful: typeof results = [];
    let failed: typeof results = [];
    let usedLocal = false;

    try {
      results = await Promise.all(
        validTexts.map(async (text) => {
          try {
            const embedding = await hf.featureExtraction({
              model: MODEL_NAME,
              inputs: text
            });
            return { text, embedding, error: null };
          } catch (error: any) {
            console.error(`[EMBEDDING_API] Error generating embedding for text: ${text.substring(0, 50)}...`, error);
            return { text, embedding: null, error: error.message || 'Unknown error' };
          }
        })
      );
      successful = results.filter(r => r.embedding !== null);
      failed = results.filter(r => r.embedding === null);
    } catch (err) {
      // If HuggingFace API totally fails, treat as all failed
      failed = validTexts.map(text => ({ text, embedding: null, error: 'HuggingFace API failure' }));
      successful = [];
    }

    // If all failed, try local embedding as fallback
    if (successful.length === 0) {
      try {
        console.log('[EMBEDDING_API] Falling back to local embedding script...');
        const { spawn } = require('child_process');
        const path = require('path');
        const scriptPath = path.join(process.cwd(), 'scripts', 'generate_embeddings.py');
        const py = spawn('python3', [scriptPath], { stdio: ['pipe', 'pipe', 'pipe'] });

        // Send texts as JSON array to stdin
        py.stdin.write(JSON.stringify(validTexts));
        py.stdin.end();

        let stdout = '';
        let stderr = '';
        py.stdout.on('data', (data: Buffer) => { stdout += data.toString(); });
        py.stderr.on('data', (data: Buffer) => { stderr += data.toString(); });

        await new Promise((resolve, reject) => {
          py.on('close', (code: number) => {
            if (code !== 0) reject(new Error(stderr || `Local embedding script exited with code ${code}`));
            else resolve(null);
          });
        });

        // Parse embeddings from stdout
        const embeddings = JSON.parse(stdout);
        if (!Array.isArray(embeddings) || embeddings.length !== validTexts.length) {
          throw new Error('Local embedding script returned invalid output');
        }
        results = validTexts.map((text, i) => ({
          text,
          embedding: embeddings[i],
          error: null
        }));
        successful = results;
        failed = [];
        usedLocal = true;
        console.log(`[EMBEDDING_API] Local embedding succeeded for ${embeddings.length} texts.`);
      } catch (localErr: any) {
        console.error('[EMBEDDING_API] Local embedding failed:', localErr);
        return NextResponse.json({
          success: false,
          error: 'Failed to generate embeddings with both HuggingFace and local script.',
          details: localErr.message || localErr.toString()
        }, { status: 500 });
      }
    }

    if (successful.length === 0) {
      // All failed
      return NextResponse.json({
        success: false,
        error: 'Failed to generate embeddings for all texts.',
        details: failed.map(f => ({ text: f.text, error: f.error }))
      }, { status: 500 });
    }

    console.log(`[EMBEDDING_API] Successfully generated ${successful.length} embeddings, ${failed.length} failed.${usedLocal ? ' (local fallback used)' : ''}`);

    return NextResponse.json({
      success: true,
      embeddings: successful.map(r => r.embedding),
      count: successful.length,
      results, // include all results for frontend diagnostics
      failed: failed.length,
      usedLocal,
    });

  } catch (error: any) {
    console.error('[EMBEDDING_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to generate embeddings.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
