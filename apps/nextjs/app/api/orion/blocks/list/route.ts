export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { searchMemory, MemorySearchFilter, ScoredMemoryPoint } from '@shared/lib/memory';
import { BLOCK_TYPES, Block, BlockType } from '@shared/types/blocks';

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
    if (!type) {
      return NextResponse.json({ success: false, error: 'type parameter is required' }, { status: 400 });
    }
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
      filter.must!.push({ key: 'payload.type', match: { value: type } });
    }
    if (tags.length > 0) {
      for (const tag of tags) {
        filter.must!.push({ key: 'payload.tags', match: { value: tag } });
      }
    }

    // Search memory
    const searchResult = await searchMemory('*', { filter, limit: 50 });
    // Debug: log raw search results
    console.log('[BLOCKS_LIST_API] Raw search results:', JSON.stringify(searchResult.results, null, 2));
    if (!searchResult.success) {
      return NextResponse.json({ success: false, error: searchResult.error || 'Failed to list blocks' }, { status: 500 });
    }

    // Type guard for BlockType (move outside block for ES5/strict mode compatibility)
    const isBlockType = (type: string): type is BlockType =>
      (BLOCK_TYPES as readonly string[]).includes(type);

    // Deduplicate by source_id: only return the first chunk for each block
    const seenSourceIds = new Set<string>();
    const blocks: Block[] = [];
    for (const point of (searchResult.results || [])) {
      if (!isBlockType(point.payload.type)) continue;
      const payload = point.payload;
      if (seenSourceIds.has(payload.source_id)) continue;
      seenSourceIds.add(payload.source_id);
      blocks.push({
        id: payload.source_id,
        type: payload.type as BlockType,
        title: payload.title,
        content: payload.text,
        tags: payload.tags,
        createdAt: payload.createdAt || payload.timestamp,
        updatedAt: payload.updatedAt || payload.timestamp,
        metadata: payload.metadata || {},
      });
    }

    // Debug: log final blocks array
    console.log('[BLOCKS_LIST_API] Final blocks array:', JSON.stringify(blocks, null, 2));
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
