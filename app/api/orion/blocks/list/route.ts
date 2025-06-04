import { NextRequest, NextResponse } from 'next/server';
import { searchMemory, MemorySearchFilter, ScoredMemoryPoint } from '@/lib/memory';
import { BLOCK_TYPES, Block, BlockType } from '@/types/blocks';

/**
 * GET /api/orion/blocks/list
 * Lists blocks, optionally filtered by type and tags.
 * Query params:
 *   - type: BlockType (optional)
 *   - tags: comma-separated string (optional)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as BlockType | null;
    const tagsParam = searchParams.get('tags');
    let tags: string[] = [];
    if (tagsParam) {
      try {
        tags = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
      } catch (err) {
        return NextResponse.json({ success: false, error: 'Malformed tags parameter' }, { status: 400 });
      }
    }

    // Validate type param if present
    if (type && !BLOCK_TYPES.includes(type)) {
      return NextResponse.json({ success: false, error: `Invalid block type: ${type}` }, { status: 400 });
    }

    // Build filter
    const filter: MemorySearchFilter = { must: [] };
    if (type && BLOCK_TYPES.includes(type)) {
      filter.must!.push({ key: 'type', match: { value: type } });
    }
    if (tags.length > 0) {
      for (const tag of tags) {
        filter.must!.push({ key: 'tags', match: { value: tag } });
      }
    }

    // Search memory
    const searchResult = await searchMemory('*', { filter, limit: 50 });
    if (!searchResult.success) {
      return NextResponse.json({ success: false, error: searchResult.error || 'Failed to list blocks' }, { status: 500 });
    }

    // Type guard for BlockType (move outside block for ES5/strict mode compatibility)
    const isBlockType = (type: string): type is BlockType =>
      (BLOCK_TYPES as readonly string[]).includes(type);

    // Map results to Block[]
    const blocks: Block[] = (searchResult.results || [])
      .filter((point: ScoredMemoryPoint) => isBlockType(point.payload.type))
      .map((point: ScoredMemoryPoint) => {
        const payload = point.payload;
        return {
          id: payload.source_id,
          type: payload.type as BlockType,
          title: payload.title,
          content: payload.text,
          tags: payload.tags,
          createdAt: payload.createdAt || payload.timestamp,
          updatedAt: payload.updatedAt || payload.timestamp,
          metadata: payload.metadata || {},
        };
      });

    return NextResponse.json({ success: true, blocks }, { status: 200 });
  } catch (error: any) {
    console.error('[BLOCKS_LIST_API_ERROR]', error?.message, error?.stack);
    // Return 400 for validation/client errors
    if (
      error?.status === 400 ||
      error?.name === 'ValidationError' ||
      error?.message?.toLowerCase().includes('invalid') ||
      error?.message?.toLowerCase().includes('malformed')
    ) {
      return NextResponse.json(
        { success: false, error: error.message || 'Validation error' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list blocks' },
      { status: 500 }
    );
  }
}
