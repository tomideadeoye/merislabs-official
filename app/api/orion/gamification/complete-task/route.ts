import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const userId = 'unauthenticated_user'; // Hardcoded userId as authentication is removed

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'Task ID is required' }, { status: 400 });
    }

    let stats = await prisma.gamification.findUnique({
      where: { userId },
    });

    if (!stats) {
      stats = await prisma.gamification.create({
        data: {
          userId,
        },
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompletionDate = stats.lastCompletionDate ? new Date(stats.lastCompletionDate) : null;

    let newStreak = stats.currentStreak;
    if (lastCompletionDate) {
      const diffTime = today.getTime() - lastCompletionDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        newStreak++;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    const updatedStats = await prisma.gamification.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(stats.longestStreak, newStreak),
        lastCompletionDate: today,
      },
    });

    return NextResponse.json({ success: true, stats: updatedStats });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update gamification stats' }, { status: 500 });
  }
}
