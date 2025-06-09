import { NextResponse } from 'next/server';
import { saveJournalEntryToNotion } from '@shared/lib/notion_service';
import type { JournalEntryNotionInput } from '@shared/types/orion';

export async function POST(request: Request) {
    try {
        const journalEntryData: JournalEntryNotionInput = await request.json();

        // Basic validation (can be expanded)
        if (!journalEntryData || !journalEntryData.content || !journalEntryData.date) {
            return NextResponse.json({ success: false, error: 'Missing required journal entry data (content, date)' }, { status: 400 });
        }

        const newJournalEntry = await saveJournalEntryToNotion(journalEntryData);

        if (newJournalEntry) {
            return NextResponse.json({ success: true, entry: newJournalEntry });
        } else {
            return NextResponse.json({ success: false, error: 'Failed to save journal entry to Notion' }, { status: 500 });
        }
    } catch (error: any) {
        console.error("Error in Save Journal Entry API route:", error);
        return NextResponse.json({ success: false, error: error.message || 'An unexpected error occurred' }, { status: 500 });
    }
}
