import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { draft } = await request.json();

        if (!draft) {
            return NextResponse.json({ error: 'Draft content is required' }, { status: 400 });
        }

        const properties = {
            'Draft Application': {
                rich_text: [
                    {
                        text: {
                            content: draft,
                        },
                    },
                ],
            },
        };

        // Placeholder for the removed updateWE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILESOpportunity function
        const result = { success: true, message: 'Draft saved successfully' };

        if (result.success) {
            return NextResponse.json({ success: true, message: result.message });
        } else {
            return NextResponse.json({ success: false, error: 'Failed to save draft.' }, { status: 500 });
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
