import { NextRequest, NextResponse } from 'next/server';
import { parseNotionPageProperties } from '@/lib/notion_service';

export async function GET(request: NextRequest) {
  // Test the imported function with a dummy input
  const dummy = { Title: { type: 'title', title: [{ plain_text: 'Test' }] } };
  const parsed = parseNotionPageProperties(dummy);
  return NextResponse.json({ success: true, parsed });
}
