/**
 * GOAL: Fetch and update ideas and logs using Neon/Postgres.
 * Related: lib/database.ts, reference.md, types/ideas.d.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '@/lib/prisma';
import { $Enums } from '@/lib/types';
import { Prisma } from '@/generated/prisma';

// Type definitions
type IdeaLogType = 'status_change' | 'note' | 'llm_brainstorm' | 'initial_capture';

interface Idea {
  id: string;
  title: string;
  description: string;
  status: $Enums.IdeaStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  dueDate: string;
  priority: string;
}

interface IdeaLog {
  id: string;
  ideaId: string;
  timestamp: string;
  logType: IdeaLogType;
  details: string;
  action: string;
  type: string;
  content: string;
  author: string;
}

/**
 * API route for fetching a specific idea and its logs
 */
export async function GET(request: NextRequest, { params }: { params: { ideaId: string } }) {
  try {
    const { ideaId } = params;

    if (!ideaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea ID is required',
          message: 'Idea ID is required to fetch a specific idea and its logs.',
        },
        { status: 400 }
      );
    }

    // Fetch idea with logs using Prisma
    const idea = await prisma.idea.findUnique({
      where: { id: ideaId },
      include: {
        logs: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    if (!idea) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea not found',
          message: `Idea with ID ${ideaId} not found.`,
        },
        { status: 404 }
      );
    }

    // Transform to match expected interface
    const ideaRow: Idea = {
      id: idea.id,
      title: idea.title,
      description: idea.description || '',
      status: idea.status,
      tags: idea.tags,
      createdAt: idea.createdAt.toISOString(),
      updatedAt: idea.updatedAt.toISOString(),
      userId: idea.userId || '',
      dueDate: idea.dueDate?.toISOString() || '',
      priority: idea.priority || '',
    };

    const logs: IdeaLog[] = idea.logs.map((log) => ({
      id: log.id,
      ideaId: log.ideaId,
      timestamp: log.timestamp.toISOString(),
      logType: log.logType as IdeaLogType,
      details: log.details,
      action: log.action,
      type: log.type,
      content: log.content || '',
      author: log.author || '',
    }));

    return NextResponse.json({
      success: true,
      idea: ideaRow,
      logs,
    });
  } catch (error: unknown) {
    console.error(`Error in GET /api/orion/ideas/${params.ideaId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to fetch idea ${params.ideaId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}

/**
 * API route for updating an idea
 */
export async function PUT(request: NextRequest, { params }: { params: { ideaId: string } }) {
  try {
    const { ideaId } = params;
    const body = await request.json();
    const { title, description, status, tags = [], priority, dueDate, note } = body;

    if (!ideaId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea ID is required',
          message: 'Idea ID is required to update the idea.',
        },
        { status: 400 }
      );
    }

    // Check if idea exists
    const existingIdea = await prisma.idea.findUnique({
      where: { id: ideaId },
      select: { id: true },
    });

    if (!existingIdea) {
      return NextResponse.json(
        {
          success: false,
          error: 'Idea not found',
          message: `Idea with ID ${ideaId} not found for update.`,
        },
        { status: 404 }
      );
    }

    // Update idea using Prisma
    const updateData: Prisma.IdeaUpdateInput = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (tags !== undefined) updateData.tags = tags;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (priority !== undefined) updateData.priority = priority;

    await prisma.idea.update({
      where: { id: ideaId },
      data: updateData,
    });

    // If status was updated, create a status change log
    if (status) {
      await prisma.ideaLog.create({
        data: {
          id: uuidv4(),
          ideaId: ideaId,
          logType: 'status_change',
          details: `Status updated to: ${status}`,
          action: 'Status Change',
          type: 'status_change',
          content: `Status updated to: ${status}`,
          author: 'Tomide',
        },
      });
    }

    // If a new note was provided, add it to the logs
    if (note && typeof note === 'string' && note.trim()) {
      await prisma.ideaLog.create({
        data: {
          id: uuidv4(),
          ideaId: ideaId,
          logType: 'note',
          details: note.trim(),
          action: 'Add Note',
          type: 'note',
          content: note.trim(),
          author: 'Tomide',
        },
      });
    }

    // Fetch updated idea
    const updatedIdea = await prisma.idea.findUnique({
      where: { id: ideaId },
    });

    if (!updatedIdea) {
      throw new Error('Failed to fetch updated idea');
    }

    const ideaRow: Idea = {
      id: updatedIdea.id,
      title: updatedIdea.title,
      description: updatedIdea.description || '',
      status: updatedIdea.status,
      tags: updatedIdea.tags,
      createdAt: updatedIdea.createdAt.toISOString(),
      updatedAt: updatedIdea.updatedAt.toISOString(),
      userId: updatedIdea.userId || '',
      dueDate: updatedIdea.dueDate?.toISOString() || '',
      priority: updatedIdea.priority || '',
    };

    return NextResponse.json({
      success: true,
      idea: ideaRow,
    });
  } catch (error: unknown) {
    console.error(`Error in PUT /api/orion/ideas/${params.ideaId}:`, error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        message: `Failed to update idea ${params.ideaId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
