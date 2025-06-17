import { NextRequest, NextResponse } from 'next/server';
import { listDirectoryContents } from '@/lib/local_file_service';

/**
 * API route to list files in a directory
 */
export async function POST(request: NextRequest) {
  try {
    const { directoryPath } = await request.json();

    if (!directoryPath || typeof directoryPath !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'directoryPath is required and must be a string',
        },
        { status: 400 }
      );
    }

    const contents = await listDirectoryContents(directoryPath);

    return NextResponse.json({
      success: true,
      contents,
    });
  } catch (error: unknown) {
    console.error('Error in POST /api/orion/local-fs/list-files:', error);

    // Return appropriate status code based on error type
    const statusCode = error instanceof Error && error.message.startsWith('Access denied') ? 403 : 500;

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: statusCode }
    );
  }
}
