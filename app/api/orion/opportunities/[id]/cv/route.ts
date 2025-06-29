// import { auth } from '@/auth'; // Authentication removed as per user request
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Removed authentication as per user request
        // const session = await auth();
        // if (!session || !session.user) {
        //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        // }

        const id = params.id;
        const { cv } = await request.json();

        if (!cv) {
            return NextResponse.json({ success: false, error: 'CV content is required' }, { status: 400 });
        }

        // Store the CV using Prisma
        await prisma.opportunity.update({
            where: { id },
            data: {
                tailoredCv: cv,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            message: 'CV saved successfully',
        });
    } catch (error: unknown) {
        console.error('Error saving CV:', error);
        return NextResponse.json(
            { success: false, error: (error instanceof Error ? error.message : String(error)) || 'Failed to save CV' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        // Removed authentication as per user request
        // const session = await auth();
        // if (!session || !session.user) {
        //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        // }

        const id = params.id;

        // Fetch the CV using Prisma
        const opportunity = await prisma.opportunity.findUnique({
            where: { id },
            select: { tailoredCv: true },
        });

        if (!opportunity?.tailoredCv) {
            return NextResponse.json({ success: false, error: 'No CV found for this Opportunity' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            cv: opportunity.tailoredCv,
        });
    } catch (error: unknown) {
        console.error('Error fetching CV:', error);
        return NextResponse.json(
            { success: false, error: (error instanceof Error ? error.message : String(error)) || 'Failed to fetch CV' },
            { status: 500 }
        );
    }
}
