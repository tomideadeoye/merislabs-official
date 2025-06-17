import { NextRequest, NextResponse } from 'next/server';
import { readFileContent, getFileMetadata } from '@/lib/local_file_service';

// GOAL:
// RELATION TO OTHER FILES, file_path, FUNCTIONS, COMPONENTS AND FEATURES:
// next steps if any:

/**
 * API route to read file content
 */
export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'filePath is required and must be a string',
        },
        { status: 400 }
      );
    }

    // Read file content
    const content = await readFileContent(filePath);

    // Get file metadata
    const metadata = await getFileMetadata(filePath);

    return NextResponse.json({
      success: true,
      content,
      metadata,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/local-fs/read-file:', error);

    // Return appropriate status code based on error type
    let statusCode = 500;
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    if (errorMessage.startsWith('Access denied')) {
      statusCode = 403;
    } else if (errorMessage.startsWith('Unsupported file type')) {
      statusCode = 400;
    }

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: statusCode }
    );
  }
}
