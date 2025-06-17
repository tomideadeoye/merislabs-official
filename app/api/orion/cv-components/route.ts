import { NextResponse } from 'next/server';
import { getCVComponentsFromNotion } from '@/lib/notion_service';

// GET /api/orion/cv-components
export async function GET() {
  try {
    const components = await getCVComponentsFromNotion();
    return NextResponse.json({ success: true, components: components });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
