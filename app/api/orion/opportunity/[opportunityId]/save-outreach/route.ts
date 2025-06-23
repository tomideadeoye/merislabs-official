import { NextRequest, NextResponse } from 'next/server';
import { updateNotionOpportunity } from '@/lib/notion_service';

export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  const { opportunityId } = params;
  const { outreach } = await request.json();

  if (!outreach) {
    return NextResponse.json({ error: 'Outreach content is required' }, { status: 400 });
  }

  const properties = {
    'Outreach Draft': {
      rich_text: [
        {
          text: {
            content: outreach,
          },
        },
      ],
    },
  };

  const result = await updateNotionOpportunity(opportunityId, properties);

  if (result.success) {
    return NextResponse.json({ success: true, message: 'Outreach saved successfully' });
  } else {
    return NextResponse.json({ success: false, error: result.error || 'Failed to save outreach' }, { status: 500 });
  }
}
