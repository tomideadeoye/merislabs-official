import { NextResponse } from 'next/server';
import { listOpportunitiesFromNotion } from '@/lib/notion_service';

export async function GET() {
  try {
    console.log('Attempting to fetch opportunities from Notion...');
    const opportunities = await listOpportunitiesFromNotion();
    console.log(`Successfully fetched ${opportunities.length} opportunities.`);
    return NextResponse.json({ success: true, opportunities });
  } catch (error: any) {
    console.error('Error fetching opportunities from Notion:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch opportunities from Notion' },
      { status: 500 }
    );
  }
}

// Add other HTTP methods like POST, PATCH, DELETE if needed for this route later
// export async function POST(request: Request) { /* ... */ }
