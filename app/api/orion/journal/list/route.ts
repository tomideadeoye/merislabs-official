import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { fetchJournalEntriesFromNotion } from '@/lib/notion_service'; // Import the fetch function
import type { JournalEntryNotionInput } from '@/types/orion'; // Import the type

interface FetchJournalEntriesApiResponse {
  success: boolean;
  journalEntries?: JournalEntryNotionInput[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<FetchJournalEntriesApiResponse>> {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const journalEntries = await fetchJournalEntriesFromNotion();
    return NextResponse.json({ success: true, journalEntries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch journal entries' }, { status: 500 });
  }
}
