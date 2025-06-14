/**
 * GOAL: Brainstorm and develop ideas using LLM, persist logs and context in Neon/Postgres, and store context in memory for future reference.
 * Uses Neon/Postgres (pool from lib/database.ts) for cloud reliability.
 * Related: lib/orion_config.ts, lib/database.ts, prd.md
 */
import { NextRequest, NextResponse } from "next/server";
import { query, sql } from "@repo/shared/database";
import { ORION_MEMORY_COLLECTION_NAME } from "@repo/shared/orion_config";
import type { IdeaLog } from "@repo/shared/types/ideas";
import { v4 as uuidv4 } from "uuid";

/**
 * API route for generating brainstorming content for an idea
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { ideaId: string } }
) {
  try {
    const { ideaId } = params;
    const { prompt } = await req.json();

    if (!ideaId) {
      return NextResponse.json(
        {
          success: false,
          error: "Idea ID is required",
        },
        { status: 400 }
      );
    }

    // Check if idea exists
    const ideaQuery = "SELECT * FROM ideas WHERE id = $1";
    const ideaResult = await query(ideaQuery, [ideaId]);
    const ideaRow = ideaResult.rows[0];

    if (!ideaRow) {
      return NextResponse.json(
        {
          success: false,
          error: "Idea not found",
        },
        { status: 404 }
      );
    }

    // Parse idea data
    const idea = {
      id: ideaRow.id,
      title: ideaRow.title,
      briefDescription: ideaRow.briefdescription,
      status: ideaRow.status,
      tags: Array.isArray(ideaRow.tags)
        ? ideaRow.tags
        : JSON.parse(ideaRow.tags || "[]"),
      createdAt: ideaRow.createdat,
      updatedAt: ideaRow.updatedat,
    };

    // Fetch idea logs
    const logsQuery =
      "SELECT * FROM idea_logs WHERE ideaId = $1 ORDER BY timestamp ASC";
    const logsResult = await query(logsQuery, [ideaId]);
    const logs = logsResult.rows;

    // Construct context for LLM
    const ideaContext = `
      Title: ${idea.title}
      Description: ${idea.briefDescription || "No description provided."}
      Status: ${idea.status}
      Tags: ${idea.tags.join(", ") || "No tags."}

      Previous notes and brainstorming:
      ${logs
        .map(
          (log: any) =>
            `[${log.type} by ${log.author} at ${new Date(
              log.timestamp
            ).toLocaleString()}]:\n${log.content}`
        )
        .join("\n\n")}
    `;

    // Default prompt if not provided
    const defaultPrompt = `
      Help me brainstorm and develop this idea further. Consider:
      1. What are the key aspects or components of this idea?
      2. What potential challenges or obstacles might I face?
      3. What are some next steps I could take to develop this idea?
      4. Are there any related concepts or opportunities I should explore?
      5. What resources or skills might I need?
    `;

    // Call LLM API for brainstorming
    const llmResponse = await fetch("/api/orion/llm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestType: "IDEA_BRAINSTORM",
        primaryContext: `
          You are helping Tomide brainstorm and develop an idea. Here are the details of the idea:

          ${ideaContext}

          ${prompt || defaultPrompt}

          Provide thoughtful, creative, and practical insights to help develop this idea further.
          Be specific and detailed in your suggestions, drawing on the existing context.
        `,
        temperature: 0.7,
        maxTokens: 1000,
      }),
    });

    const llmData = await llmResponse.json();

    if (!llmData.success) {
      throw new Error(
        llmData.error || "Failed to generate brainstorming content"
      );
    }

    const brainstormContent = llmData.content;
    const now = new Date().toISOString();

    // Save brainstorm to idea logs
    const brainstormLog: IdeaLog = {
      id: uuidv4(),
      ideaId,
      timestamp: now,
      type: "llm_brainstorm",
      content: brainstormContent,
      author: "Orion",
    };

    const logInsertQuery = `
      INSERT INTO idea_logs (
        id, ideaId, timestamp, type, content, author
      ) VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await query(logInsertQuery, [
      brainstormLog.id,
      brainstormLog.ideaId,
      brainstormLog.timestamp,
      brainstormLog.type,
      brainstormLog.content,
      brainstormLog.author,
    ]);

    // Store in memory for future reference
    try {
      const memoryPoint = {
        id: uuidv4(),
        payload: {
          text: brainstormContent,
          source_id: `idea_brainstorm_${brainstormLog.id}`,
          type: "idea_brainstorm",
          related_idea_id: ideaId,
          related_idea_title: idea.title,
          timestamp: now,
          tags: ["idea", "brainstorm", ...idea.tags],
        },
      };

      await fetch("/api/orion/memory/upsert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: [memoryPoint],
          collectionName: ORION_MEMORY_COLLECTION_NAME,
        }),
      });
    } catch (memoryError) {
      console.error("Error storing brainstorm in memory:", memoryError);
      // Continue even if memory storage fails
    }

    return NextResponse.json({
      success: true,
      brainstorm: brainstormContent,
      log: brainstormLog,
    });
  } catch (error: any) {
    console.error(
      `Error in POST /api/orion/ideas/${params.ideaId}/brainstorm:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
