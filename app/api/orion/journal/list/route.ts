import { NextRequest, NextResponse } from 'next/server';
import { getJournalEntriesFromDb } from '@/lib/journal_db_service';
import logger from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        logger.info('[GET /api/orion/journal/list] Fetching journal entries from DB');
        const url = new URL(req.url);
        const limit = parseInt(url.searchParams.get('limit') || '20', 10);
        const offset = parseInt(url.searchParams.get('offset') || '0', 10);

        const journalEntries = await getJournalEntriesFromDb(limit, offset);

        logger.info('[GET /api/orion/journal/list] Fetched entries', { count: journalEntries.length });
        return NextResponse.json({ success: true, journalEntries });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('[GET /api/orion/journal/list] Failed to fetch journal entries', { error: errorMessage });
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
