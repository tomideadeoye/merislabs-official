import { NextRequest, NextResponse } from "next/server";
import { searchMemoryByFilter } from "@/lib/qdrant";
import { MEMORY_COLLECTION_NAME } from "@/lib/constants";
import type { Block, BlockType } from "@/types/blocks";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const blockType = searchParams.get("type");
  if (!blockType) {
    return NextResponse.json({ success: false, error: "Missing 'type' query param" }, { status: 400 });
  }
  try {
    const filter = {
      must: [
        { key: "type", match: { value: "BLOCK" } },
        { key: "subtype", match: { value: blockType } },
      ],
    };
    const results = await searchMemoryByFilter(MEMORY_COLLECTION_NAME, filter, 100);
    const blocks: Block[] = results.map((item: any) => ({
      id: item.payload.id,
      type: item.payload.subtype as BlockType,
      title: item.payload.title,
      content: item.payload.text,
      tags: item.payload.tags || [],
      createdAt: item.payload.createdAt,
      updatedAt: item.payload.updatedAt,
      metadata: { source: item.payload.source },
    }));
    return NextResponse.json({ success: true, blocks });
  } catch (error: any) {
    console.error("[BLOCK_LIST_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
