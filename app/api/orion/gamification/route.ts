
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import type { NextApiRequest } from 'next';

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest) {
  const { userId } = getAuth(req as any);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch gamification stats' }, { status: 500 });
  }
}
