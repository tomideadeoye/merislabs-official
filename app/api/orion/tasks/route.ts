
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
    const tasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = getAuth(req as any);
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, priority, type, dueDate } = body;

    const task = await prisma.task.create({
      data: {
        userId,
        title,
        description,
        priority,
        type,
        dueDate,
        status: 'TODO',
      },
    });
    return NextResponse.json({ success: true, task });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  }
}
