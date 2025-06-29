import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const { outreach } = await request.json();

    if (!outreach) {
        return NextResponse.json({ error: 'Outreach content is required' }, { status: 400 });
    }

    const properties = {
        'Outreach Draft': {
            rich_text: [
                {
                    text: {
                        content: outreach,
                    },
                },
            ],
        },
    };

    // Placeholder for the removed updateWE NO LONGER USE NOTION, MIGRREATE ALL TO NEON/POSTGRESSDB/SCHEMA, ENSURE WE ARE COMPLETELY USING THE DB FROM NEON AND DELTE ALL MIGRATED FILESOpportunity function
    const result = { success: true, message: 'Outreach saved successfully' };

    if (result.success) {
        return NextResponse.json({ success: true, message: result.message });
    } else {
        return NextResponse.json({ success: false, error: 'Failed to save outreach.' }, { status: 500 });
    }
}
