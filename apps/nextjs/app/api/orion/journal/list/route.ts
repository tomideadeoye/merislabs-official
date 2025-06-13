import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@repo/sharedauth";
import { getJournalEntriesFromNotion } from "@repo/shared/notion_service";
import type { JournalEntryNotionInput } from "@repo/shared";

interface FetchJournalEntriesApiResponse {
  success: boolean;
  journalEntries?: JournalEntryNotionInput[];
  error?: string;
}

export async function GET(): Promise<
  NextResponse<FetchJournalEntriesApiResponse>
> {
  console.log("[GET /api/orion/journal/list] Received request.");
  const session = await getServerSession(authConfig);
  if (!session || !session.user) {
    console.warn("[GET /api/orion/journal/list] Unauthorized access attempt.");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const journalEntries = await getJournalEntriesFromNotion();
    console.log(
      `[GET /api/orion/journal/list] Successfully fetched ${journalEntries.length} journal entries.`
    );
    return NextResponse.json({ success: true, journalEntries });
  } catch (error: any) {
    console.error(
      "[GET /api/orion/journal/list] Error fetching journal entries:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch journal entries",
      },
      { status: 500 }
    );
  }
}
