import { NextRequest, NextResponse } from 'next/server';
import { updateNotionDatabaseSchema } from '@/app/shared/notion_service'; // Import the update function

interface UpdateSchemaRequestBody {
  databaseId: string;
  properties: Record<string, unknown>;
}

interface UpdateSchemaApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: unknown;
}

export async function POST(request: NextRequest): Promise<NextResponse<UpdateSchemaApiResponse>> {
  // TEMPORARILY BYPASS AUTHENTICATION FOR LOCAL TESTING - REVERT FOR PRODUCTION!
  // const session = await auth();
  // if (!session || !session.user) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const { databaseId, properties }: UpdateSchemaRequestBody = await request.json();

    if (!databaseId || !properties) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing databaseId or properties in request body.',
        },
        { status: 400 }
      );
    }

    const result = await updateNotionDatabaseSchema(databaseId, properties);

    if (result && result.success) {
      return NextResponse.json({
        success: true,
        message: 'Database schema updated successfully.',
      });
    } else {
      return NextResponse.json(
        { success: false, error: result?.error || 'Unknown error from Notion service.' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error(
      '[UPDATE_SCHEMA_API_ERROR]',
      error instanceof Error ? error.message : 'Unknown error',
      error instanceof Error ? error.stack : 'N/A'
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update database schema.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
