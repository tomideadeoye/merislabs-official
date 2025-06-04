import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/auth';
import { fetchJournalEntriesFromNotion } from '@/lib/notion_service'; // Import the fetch function
import type { JournalEntryNotionInput } from '@/types/orion'; // Import the type

interface FetchJournalEntriesApiResponse {
  success: boolean;
  journalEntries?: JournalEntryNotionInput[];
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<FetchJournalEntriesApiResponse>> {
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await fetchJournalEntriesFromNotion();
    if (result.success) {
      // Map each entry to JournalEntryNotionInput type
      const journalEntries: JournalEntryNotionInput[] = (result.journalEntries || []).map((entry: any) => ({
        title: entry.title || 'Untitled Entry',
        date: entry.date ? new Date(entry.date) : new Date(),
        content: entry.content || '',
        contentType: entry.contentType || 'journal_entry',
        notionPageId: entry.notionPageId || undefined,
        mood: entry.mood || undefined,
        tags: Array.isArray(entry.tags) ? entry.tags.map((t: any) => (typeof t === 'string' ? t : t.name)).filter(Boolean) : [],
      }));
      console.log('[JOURNAL_LIST] Returning journal entries:', journalEntries);
      return NextResponse.json({ success: true, journalEntries });
    } else {
      console.error('[JOURNAL_LIST] Failed to fetch journal entries:', result.error);
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('[JOURNAL_LIST] Uncaught error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch journal entries' }, { status: 500 });
  }
}
