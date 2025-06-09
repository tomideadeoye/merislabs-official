import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { addMemory } from '@shared/lib/memory';
import { BLOCK_TYPES, BlockType, Block, CreateBlockPayload } from '@shared/types/blocks';
import { z } from 'zod';

/**
 * POST /api/orion/blocks/create
 * Creates a new Block (CV_SNIPPET, OPPORTUNITY_HIGHLIGHT, JOURNAL_INSIGHT, PROMPT_TEMPLATE, GENERAL_BLOCK)
 * - Generates embedding for content
 * - Upserts to memory system
 * - Returns created block details
 */

// Zod schema for strict runtime validation
const CreateBlockPayloadSchema = z.object({
  type: z.string().refine((val) => BLOCK_TYPES.includes(val as BlockType), {
    message: 'Invalid block type',
  }),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.array(z.string()).optional(),
}).strict(); // .strict() ensures no extraneous properties

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch (jsonErr: any) {
      console.error('[BLOCKS_CREATE_API] Invalid JSON:', jsonErr?.message);
      return NextResponse.json({ success: false, error: 'Invalid JSON payload' }, { status: 400 });
    }

    // Validate with Zod
    const parseResult = CreateBlockPayloadSchema.safeParse(body);
    if (!parseResult.success) {
      const errorMsg = parseResult.error.errors.map(e => e.message).join('; ');
      console.error('[BLOCKS_CREATE_API] Validation error:', errorMsg);
      return NextResponse.json({ success: false, error: `Validation error: ${errorMsg}` }, { status: 400 });
    }
    const { type, title, content, tags } = parseResult.data;

    // Logging request body for traceability
    console.log('[BLOCKS_CREATE_API] Incoming payload:', JSON.stringify(parseResult.data));

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
      type: type as BlockType,
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
