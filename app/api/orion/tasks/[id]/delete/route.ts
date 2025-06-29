import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Task ID is required.' },
                { status: 400 }
            );
        }

        await prisma.task.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete task.' },
            { status: 500 }
        );
    }
}
