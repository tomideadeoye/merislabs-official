import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth/next'; // Authentication removed as per user request

// import type { AuthOptions } from 'next-auth'; // Authentication removed as per user request
// import { authConfig } from '@/lib/auth'; // Authentication removed as per user request
import { getJournalEntriesFromNotion } from '@/lib/notion_service';
import { JournalEntryNotionInput } from '@/lib/types';

interface FetchJournalEntriesApiResponse {
  success: boolean;
  journalEntries?: (
    | JournalEntryNotionInput
    | {
        id: string;
        title: string;
        date: string;
        content: string;
        reflectionId: string | null;
        original_entry_id: string | null;
        tags: string[] | undefined;
        mood: string | undefined;
        createdAt: string | undefined;
        updatedAt: string | undefined;
      }
  )[];
  error?: string;
}

export async function GET(): Promise<NextResponse<FetchJournalEntriesApiResponse>> {
  console.log('[GET /api/orion/journal/list] Received request.');
  // const session = await getServerSession(authConfig as unknown as AuthOptions); // Authentication removed as per user request
  // if (!session || !session.user) { // Authentication removed as per user request
  //   console.warn('[GET /api/orion/journal/list] Unauthorized access attempt.'); // Authentication removed as per user request
  //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }); // Authentication removed as per user request
  // }

  try {
    const journalEntries = await getJournalEntriesFromNotion();
    console.log(`[GET /api/orion/journal/list] Successfully fetched ${journalEntries.length} journal entries.`);
    return NextResponse.json({ success: true, journalEntries });
  } catch (error: unknown) {
    console.error('[GET /api/orion/journal/list] Error fetching journal entries:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch journal entries',
      },
      { status: 500 }
    );
  }
}
