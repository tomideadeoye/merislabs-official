import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addMemory } from '@/lib/memory';
import { BLOCK_TYPES, BlockType, Block, CreateBlockPayload } from '@/types/blocks';

/**
 * POST /api/orion/blocks/create
 * Creates a new Block (CV_SNIPPET, OPPORTUNITY_HIGHLIGHT, JOURNAL_INSIGHT, PROMPT_TEMPLATE, GENERAL_BLOCK)
 * - Generates embedding for content
 * - Upserts to memory system
 * - Returns created block details
 */
export async function POST(req: NextRequest) {
  try {
    let body: CreateBlockPayload;
    try {
      body = await req.json();
    } catch (jsonErr: any) {
      console.error('[BLOCKS_CREATE_API] Invalid JSON:', jsonErr?.message);
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }
    const { type, title, content, tags } = body;

    // Logging request body for traceability
    console.log('[BLOCKS_CREATE_API] Incoming payload:', JSON.stringify(body));

    // Validate type
    if (!type || !BLOCK_TYPES.includes(type)) {
      console.error('[BLOCKS_CREATE_API] Invalid block type:', type);
      return NextResponse.json({ success: false, error: `Invalid block type: ${type}` }, { status: 400 });
    }
    if (!title || !content) {
      console.error('[BLOCKS_CREATE_API] Missing required fields:', { title, content });
      return NextResponse.json({ success: false, error: 'Missing required fields: title or content' }, { status: 400 });
    }

    // Generate unique source_id for the block
    const sourceId = `block_${type}_${uuidv4()}`;
    const timestamp = new Date().toISOString();

    // Add memory (embedding + upsert)
    const addResult = await addMemory(
      content,
      sourceId,
      type,
      tags || [],
      {
        title,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
    );

    if (!addResult.success) {
      console.error('[BLOCKS_CREATE_API] addMemory failed:', addResult.error);
      return NextResponse.json({ success: false, error: addResult.error || 'Failed to create block' }, { status: 500 });
    }

    // Return the created block details
    const block: Block = {
      id: sourceId,
      type,
      title,
      content,
      tags,
      createdAt: timestamp,
      updatedAt: timestamp,
      metadata: {},
    };

    console.log('[BLOCKS_CREATE_API] Block created successfully:', block);

    return NextResponse.json({ success: true, block }, { status: 201 });
  } catch (error: any) {
    // Log full error details for debugging
    console.error('[BLOCKS_CREATE_API_ERROR]', {
      message: error?.message,
      stack: error?.stack,
      error
    });
    // If error is a validation or client error, return 400
    if (
      error?.status === 400 ||
      error?.name === 'ValidationError' ||
      error?.message?.toLowerCase().includes('missing') ||
      error?.message?.toLowerCase().includes('invalid')
    ) {
      return NextResponse.json(
        { success: false, error: error.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create block' },
      { status: 500 }
    );
  }
}
