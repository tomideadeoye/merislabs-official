import { NextRequest, NextResponse } from 'next/server';
import { updateNotionOpportunity } from '@/lib/notion_service';
import { auth } from '@/auth';

export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { opportunityId } = params;
    const { draft } = await request.json();

    if (!draft) {
      return NextResponse.json({ error: 'Draft content is required' }, { status: 400 });
    }

    const properties = {
      'Draft Application': {
        rich_text: [
          {
            text: {
              content: draft,
            },
          },
        ],
      },
    };

    const result = await updateNotionOpportunity(opportunityId, properties);

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Draft saved successfully' });
    } else {
      return NextResponse.json({ success: false, error: result.error || 'Failed to save draft' }, { status: 500 });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
