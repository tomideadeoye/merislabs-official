import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@shared/auth';
import { updateNotionDatabaseSchema } from '@shared/lib/notion_service'; // Import the update function

interface UpdateSchemaRequestBody {
  databaseId: string;
  properties: Record<string, any>; // Need to match Notion API structure
}

interface UpdateSchemaApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  details?: any;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<UpdateSchemaApiResponse>> {
  // TEMPORARILY BYPASS AUTHENTICATION FOR LOCAL TESTING - REVERT FOR PRODUCTION!
  // const session = await auth();
  // if (!session || !session.user) {
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  // }

  try {
    const { databaseId, properties }: UpdateSchemaRequestBody = await request.json();

    if (!databaseId || !properties) {
        return NextResponse.json({ success: false, error: 'Missing databaseId or properties in request body.' }, { status: 400 });
    }

    const result = await updateNotionDatabaseSchema(databaseId, properties);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Database schema updated successfully.' });
    } else {
      return NextResponse.json({ success: false, error: result.error}, { status: 500 });
    }
  } catch (error: any) {
    console.error('[UPDATE_SCHEMA_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to update database schema.', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
