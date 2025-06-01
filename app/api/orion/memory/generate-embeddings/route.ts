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
    
    // Generate embeddings for all texts
    const embeddings = await Promise.all(
      validTexts.map(async (text) => {
        try {
          const embedding = await hf.featureExtraction({
            model: MODEL_NAME,
            inputs: text
          });
          return embedding;
        } catch (error) {
          console.error(`[EMBEDDING_API] Error generating embedding for text: ${text.substring(0, 50)}...`, error);
          throw error;
        }
      })
    );

    console.log(`[EMBEDDING_API] Successfully generated ${embeddings.length} embeddings.`);

    return NextResponse.json({ 
      success: true, 
      embeddings,
      count: embeddings.length
    });

  } catch (error: any) {
    console.error('[EMBEDDING_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to generate embeddings.', details: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}