import { NextRequest, NextResponse } from 'next/server';
import { EmotionalLogEntry, CognitiveDistortionAnalysisData } from '@/lib/types';
import { PrismaClient } from '@/generated/prisma';

export const dynamic = 'force-dynamic';

// interface EmotionalLogQueryParams {
//   startDate?: string;
//   endDate?: string;
//   emotion?: string;
//   limit: number;
//   offset: number;
// }

const prisma = new PrismaClient();

// Define a type for the selected fields from EmotionalLogs to fix 'any' implicit type
interface EmotionalLogPrismaSelect {
  id: string;
  timestamp: string;
  primaryEmotion: string;
  secondaryEmotions: string | null;
  intensity: number;
  triggers: string | null;
  physicalSensations: string | null;
  accompanyingThoughts: string;
  copingMechanismsUsed: string | null;
  contextualNote: string | null;
  relatedJournalSourceId: string | null;
  cognitiveDistortionAnalysis: string | null;
  emotion: string;
  context: string;
}

/**
 * API route for retrieving emotion logs
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const emotion = url.searchParams.get('emotion');
    const hasDistortionAnalysis = url.searchParams.get('hasDistortionAnalysis');

    type WhereClause = {
      timestamp?: { gte?: string; lte?: string };
      primaryEmotion?: string;
      cognitiveDistortionAnalysis?: { not: null } | null;
    };
    const whereClause: WhereClause = {};

    if (startDate) {
      whereClause.timestamp = { gte: startDate };
    }

    if (endDate) {
      whereClause.timestamp = { ...whereClause.timestamp, lte: endDate };
    }

    if (emotion) {
      whereClause.primaryEmotion = emotion;
    }

    if (hasDistortionAnalysis === 'true') {
      whereClause.cognitiveDistortionAnalysis = { not: null };
    }
    if (hasDistortionAnalysis === 'false') {
      whereClause.cognitiveDistortionAnalysis = null; // Matches null explicitly
    }

    const logs = await prisma.emotionalLogs.findMany({
      where: whereClause,
      select: {
        id: true,
        timestamp: true,
        primaryEmotion: true,
        secondaryEmotions: true,
        intensity: true,
        triggers: true,
        physicalSensations: true,
        accompanyingThoughts: true,
        copingMechanismsUsed: true,
        contextualNote: true,
        relatedJournalSourceId: true,
        cognitiveDistortionAnalysis: true,
        emotion: true,
        context: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const mappedLogs: EmotionalLogEntry[] = logs.map((log: EmotionalLogPrismaSelect) => ({
      id: log.id,
      timestamp: log.timestamp,
      emotion: log.emotion,
      primaryEmotion: log.primaryEmotion,
      intensity: Number(log.intensity), // Ensure intensity is a number
      context: log.contextualNote || log.context, // Use contextualNote primarily, fallback to context
      accompanyingThoughts: log.accompanyingThoughts,
      contextualNote: log.contextualNote,
      // Parse JSON string fields back to arrays/objects
      cognitiveDistortionAnalysis: log.cognitiveDistortionAnalysis
        ? (JSON.parse(log.cognitiveDistortionAnalysis) as CognitiveDistortionAnalysisData)
        : undefined,
      secondaryEmotions: log.secondaryEmotions ? (JSON.parse(log.secondaryEmotions) as string[]) : [],
      triggers: log.triggers ? (JSON.parse(log.triggers) as string[]) : undefined, // Match type
      copingMechanismsUsed: log.copingMechanismsUsed ? (JSON.parse(log.copingMechanismsUsed) as string[]) : [],
      relatedJournalSourceId: log.relatedJournalSourceId || null,
    }));

    // Get total count for pagination
    const total = await prisma.emotionalLogs.count({
      where: whereClause,
    });

    return NextResponse.json({
      success: true,
      logs: mappedLogs,
      total,
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/orion/emotions/history:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
