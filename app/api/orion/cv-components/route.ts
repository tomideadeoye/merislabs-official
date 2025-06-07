import { NextResponse } from 'next/server';
import { fetchCVComponentsFromNotion } from '@/lib/notion_service';

// GET /api/orion/cv-components
export async function GET() {
  try {
    const result = await fetchCVComponentsFromNotion();
    if (result.success) {
      return NextResponse.json({ success: true, components: result.components });
    }
    return NextResponse.json({ success: false, error: result.error || 'Failed to fetch CV components' }, { status: 500 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
