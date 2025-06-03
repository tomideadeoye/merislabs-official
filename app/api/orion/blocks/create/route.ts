import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import type { CreateBlockPayload, Block } from "@/types/blocks";
import { generateEmbedding } from "@/lib/embedding";
import { upsertMemoryToQdrant } from "@/lib/qdrant";
import { MEMORY_COLLECTION_NAME } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as CreateBlockPayload;
    const id = uuidv4();
    const timestamp = new Date().toISOString();
    const embedding = await generateEmbedding(`${body.title}\n${body.content}`);
    const memoryPayload = {
      id,
      text: body.content,
      type: "BLOCK",
      subtype: body.type,
      title: body.title,
      tags: body.tags || [],
      createdAt: timestamp,
      updatedAt: timestamp,
      source: "BlocksModule",
    };
    await upsertMemoryToQdrant(MEMORY_COLLECTION_NAME, [
      {
        id,
        vector: embedding,
        payload: memoryPayload,
      },
    ]);
    const block: Block = {
      id,
      type: body.type,
      title: body.title,
      content: body.content,
      tags: body.tags || [],
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: { source: "BlocksModule" },
    };
    return NextResponse.json({ success: true, block });
  } catch (error: any) {
    console.error("[BLOCK_CREATE_ERROR]", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
