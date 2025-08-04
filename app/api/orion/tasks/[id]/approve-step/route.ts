import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    req: Request
) {
    try {
        const { stepId, chosenAction, chosenJustification } = await req.json();

        if (!stepId || !chosenAction) {
            return NextResponse.json(
                { success: false, error: 'stepId and chosenAction are required.' },
                { status: 400 }
            );
        }

        const updated = await prisma.taskStep.update({
            where: { id: stepId },
            data: {
                chosenAction,
                chosenJustification: chosenJustification || null,
            },
        });

        return NextResponse.json({ success: true, step: updated });
    } catch (e: unknown) {
        return NextResponse.json(
            { success: false, error: 'Failed to approve step.' },
            { status: 500 }
        );
    }
}
