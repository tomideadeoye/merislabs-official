import { NextResponse } from 'next/server';
import { getCVComponentsFromNotion } from '@shared/lib/notion_service';

// GET /api/orion/cv-components
export async function GET() {
  try {
    const components = await getCVComponentsFromNotion();
    return NextResponse.json({ success: true, components: components });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
