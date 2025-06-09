import { NextRequest, NextResponse } from 'next/server';
import { readFileContent, getFileMetadata } from '@shared/lib/local_file_service';

/**
 * API route to read file content
 */
export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();
    
    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ 
        success: false, 
        error: 'filePath is required and must be a string' 
      }, { status: 400 });
    }
    
    // Read file content
    const content = await readFileContent(filePath);
    
    // Get file metadata
    const metadata = await getFileMetadata(filePath);
    
    return NextResponse.json({ 
      success: true, 
      content,
      metadata
    });
  } catch (error: any) {
    console.error('Error in POST /api/orion/local-fs/read-file:', error);
    
    // Return appropriate status code based on error type
    let statusCode = 500;
    if (error.message.startsWith('Access denied')) {
      statusCode = 403;
    } else if (error.message.startsWith('Unsupported file type')) {
      statusCode = 400;
    }
    
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'An unexpected error occurred' 
    }, { status: statusCode });
  }
}