import { NextRequest, NextResponse } from 'next/server';
import { createJournalEntryInDb } from '@/lib/journal_db_service';
import { JournalEntryInput } from '@/lib/types';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        logger.info('[POST /api/orion/journal/save] Received body:', body);

        // Basic validation
        if (!body || typeof body !== 'object' || !body.content) {
            return NextResponse.json({ success: false, error: 'Missing required journal entry content.' }, { status: 400 });
        }

        // Create entry in DB
        const entry = await createJournalEntryInDb(body as JournalEntryInput);

        logger.info('[POST /api/orion/journal/save] Journal entry saved.', { id: entry.id });
        return NextResponse.json({ success: true, entry });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('[POST /api/orion/journal/save] Failed to save journal entry.', { error: errorMessage });
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
