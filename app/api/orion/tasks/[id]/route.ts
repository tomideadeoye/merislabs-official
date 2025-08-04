import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { taskDbService } from '@/lib/task_db_service';

const prisma = new PrismaClient();

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const userId = 'unauthenticated_user'; // Hardcoded userId as authentication is removed

  try {
    const body = await req.json();
    const { title, description, priority, type, dueDate, status } = body;
    const { id } = params;

    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        type,
        dueDate,
        status,
      },
    });
    return NextResponse.json({ success: true, task });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const userId = 'unauthenticated_user'; // Hardcoded userId as authentication is removed

  try {
    const { id } = params;
    await prisma.task.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to delete task' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const task = await taskDbService.getTaskWithSteps(id);
    if (!task) {
      return NextResponse.json({ success: false, error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, task });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: 'Failed to fetch task' }, { status: 500 });
  }
}
