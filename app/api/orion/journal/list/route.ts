import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "pages/api/auth/[...nextauth]";
import { fetchJournalEntriesFromNotion } from '@/lib/notion_service'; // Import the fetch function
import type { JournalEntryNotionInput } from '@/types/orion'; // Import the type

interface FetchJournalEntriesApiResponse {
  success: boolean;
  journalEntries?: JournalEntryNotionInput[];
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<FetchJournalEntriesApiResponse>> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await fetchJournalEntriesFromNotion();

    if (result.success) {
      return NextResponse.json({ success: true, journalEntries: result.journalEntries });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[JOURNAL_LIST_API_ERROR]', error.message, error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch journal entries.', details: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
