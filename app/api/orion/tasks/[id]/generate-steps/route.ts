import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const { prompt, numOptions, relatedLinks, relatedPhoneNumbers } = await req.json();

        // Example: Add a new step to the task with generated options (stub logic)
        const newStep = await prisma.taskStep.create({
            data: {
                taskId: id,
                prompt,
                generatedOptions: [],
                relatedLinks: relatedLinks || [],
                relatedPhoneNumbers: relatedPhoneNumbers || [],
                stepNumber: 1, // Should be incremented based on existing steps
            },
        });

        return NextResponse.json({ success: true, step: newStep });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to generate steps.' },
            { status: 500 }
        );
    }
}
