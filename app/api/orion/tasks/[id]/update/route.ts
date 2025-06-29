import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const updateData = await req.json();

        const updatedTask = await prisma.task.update({
            where: { id },
            data: { ...updateData },
        });

        return NextResponse.json({ success: true, task: updatedTask });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update task.' },
            { status: 500 }
        );
    }
}
