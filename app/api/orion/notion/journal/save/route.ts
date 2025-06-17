import { NextResponse } from 'next/server';
import { saveJournalEntryToNotion } from '@/lib/notion_service';
import type { JournalEntryNotionInput } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const journalEntryData: JournalEntryNotionInput = await request.json();

    // Basic validation (can be expanded)
    if (!journalEntryData || !journalEntryData.content || !journalEntryData.date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required journal entry data (content, date)',
        },
        { status: 400 }
      );
    }

    const newJournalEntry = await saveJournalEntryToNotion(journalEntryData);

    if (newJournalEntry) {
      return NextResponse.json({ success: true, entry: newJournalEntry });
    } else {
      return NextResponse.json({ success: false, error: 'Failed to save journal entry to Notion' }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Error in Save Journal Entry API route:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
