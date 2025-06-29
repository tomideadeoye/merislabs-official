
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextApiRequest) {
  const userId = 'unauthenticated_user'; // Hardcoded userId as authentication is removed

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
