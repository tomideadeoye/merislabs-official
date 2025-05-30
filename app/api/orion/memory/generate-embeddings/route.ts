import { NextRequest, NextResponse } from "next/server";
import { checkAuthorization } from "@/lib/orion_config";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    // Validate authorization
    const authError = await checkAuthorization("user", request);
    if (authError) return authError;

    // Parse request body
    const body = await request.json();
    const { texts } = body;

    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid 'texts' parameter. Expected a non-empty array of strings." },
        { status: 400 }
      );
    }

    // Call the Python backend to generate embeddings
    const embeddings = await generateEmbeddingsWithPython(texts);

    return NextResponse.json({
      success: true,
      embeddings,
      model: "all-MiniLM-L6-v2"
    });
  } catch (error) {
    console.error("Embedding generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate embeddings", details: String(error) },
      { status: 500 }
    );
  }
}

async function generateEmbeddingsWithPython(texts: string[]): Promise<number[][]> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'scripts', 'generate_embeddings.py')
    ]);
    
    let outputData = '';
    let errorData = '';
    
    // Send the texts to the Python script
    pythonProcess.stdin.write(JSON.stringify(texts));
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
        resolve(embeddings);
      } catch (error) {
        reject(new Error(`Failed to parse embeddings: ${error}`));
      }
    });
  });
}