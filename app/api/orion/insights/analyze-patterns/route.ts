import { NextRequest, NextResponse } from 'next/server';
import {
  ORION_MEMORY_COLLECTION_NAME,
  PATTERN_ANALYSIS_REQUEST_TYPE
} from '@/lib/orion_config';
import { PatternAnalysisRequest } from '@/types/insights';
import { QdrantFilter } from '@/types/orion';
import { ScoredMemoryPoint } from '@/types/orion';

/**
 * API route for analyzing patterns in memory
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as PatternAnalysisRequest;
    const {
      limit = 30,
      dateFrom,
      dateTo,
      tags = [],
      types = ["journal_entry", "journal_reflection"],
      customQuery = ""
    } = body;

    // Construct filter for memory search
    const filterConditions: any[] = [];

    if (types && types.length > 0) {
      types.forEach(type => filterConditions.push({
        key: "payload.type",
        match: { value: type }
      }));
    }

    if (tags && tags.length > 0) {
      tags.forEach(tag => filterConditions.push({
        key: "payload.tags",
        match: { value: tag.toLowerCase() }
      }));
    }

    if (dateFrom) {
      filterConditions.push({
        key: "payload.timestamp",
        range: { gte: dateFrom }
      });
    }

    if (dateTo) {
      filterConditions.push({
        key: "payload.timestamp",
        range: { lte: dateTo }
      });
    }

    const filter: QdrantFilter | undefined = filterConditions.length > 0
      ? { must: filterConditions }
      : undefined;

    // Fetch memories from the memory search API
    const searchResponse = await fetch('/api/orion/memory/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: customQuery || "memories for pattern analysis",
        limit,
        filter,
        collectionName: ORION_MEMORY_COLLECTION_NAME
      })
    });

    const searchData = await searchResponse.json();

    if (!searchData.success || !searchData.results) {
      throw new Error(searchData.error || 'Failed to fetch memories for pattern analysis');
    }

    const memories = searchData.results;

    if (memories.length < 3) {
      return NextResponse.json({
        success: true,
        patterns: [],
        message: "Not enough data for meaningful pattern analysis with the current filters."
      });
    }

    // Prepare context for LLM
    const memoryContext = memories.map((mem: ScoredMemoryPoint) =>
      `Date: ${new Date(mem.payload.timestamp).toLocaleDateString()}
Type: ${mem.payload.type}
Tags: ${mem.payload.tags?.join(', ') || 'N/A'}
Mood: ${mem.payload.mood || 'N/A'}
Content:
${mem.payload.text}
(Memory Source ID: ${mem.payload.source_id})`
    ).join("\n\n---\n\n");

    // Construct prompt for pattern analysis
    const prompt = `
# Pattern Analysis Task

You are Orion, an AI Life-Architecture System. Your task is to analyze the following memory entries to identify recurring themes, emotional patterns, significant insights, or emerging thought patterns.

## Memory Entries:
${memoryContext}

## Analysis Instructions:
Based on these entries, identify 2-4 distinct major patterns or themes. For each:

1. **Theme/Pattern Name:** A concise title (e.g., "Focus on Career Transition," "Processing Relationship Grief," "Increased Self-Compassion").
2. **Description:** A brief explanation of the theme/pattern, what it entails, and how it's manifesting in the entries.
3. **Supporting Memory IDs:** List a few "Memory Source ID"s from the provided entries that strongly support this theme.
4. **Overall Sentiment (Optional):** Briefly describe the general emotional tone associated with this theme (e.g., optimistic, anxious, resolved, conflicted).
5. **Actionable Insight/Question (Optional):** Suggest one brief insight to consider or one question for further reflection related to this theme.

## Output Format:
Present your findings as a JSON array of objects, where each object represents a pattern. Example:
[
  {
    "theme": "Example Theme Name",
    "description": "Detailed explanation of the theme.",
    "supportingMemoryIds": ["journal_abc", "note_xyz"],
    "sentiment": "Mostly positive with notes of caution",
    "actionableInsight": "Consider how this pattern aligns with your stated goal of X."
  }
]

Focus on providing clear, concise, and actionable analysis. Do not add any conversational intro or outro, only the JSON output.
`;

    // Call LLM for analysis
    const llmResponse = await fetch('/api/orion/llm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestType: PATTERN_ANALYSIS_REQUEST_TYPE,
        primaryContext: prompt,
        temperature: 0.5,
        maxTokens: 1500
      })
    });

    const llmData = await llmResponse.json();

    if (!llmData.success || !llmData.content) {
      throw new Error(llmData.error || 'Failed to generate pattern analysis');
    }

    try {
      const patterns = JSON.parse(llmData.content);
      return NextResponse.json({ success: true, patterns });
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON:', llmData.content);
      throw new Error('Invalid format in pattern analysis response');
    }

  } catch (error: any) {
    console.error('Error in POST /api/orion/insights/analyze-patterns:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'An unexpected error occurred'
    }, { status: 500 });
  }
}
