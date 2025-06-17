import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/database';

export async function POST(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const opportunityId = params.opportunityId;
    const { cv } = await request.json();

    if (!cv) {
      return NextResponse.json({ success: false, error: 'CV content is required' }, { status: 400 });
    }

    // Store the CV in your database
    await query('UPDATE OrionOpportunity SET "tailoredCV" = $1, "updatedAt" = NOW() WHERE id = $2', [
      cv,
      opportunityId,
    ]);

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

export async function GET(request: NextRequest, { params }: { params: { opportunityId: string } }) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const opportunityId = params.opportunityId;

    // Fetch the CV from your database
    const result = await query('SELECT "tailoredCV" FROM OrionOpportunity WHERE id = $1', [opportunityId]);
    const tailoredCV = result.rows[0]?.tailoredCV;

    if (!tailoredCV) {
      return NextResponse.json({ success: false, error: 'No CV found for this OrionOpportunity' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      cv: tailoredCV,
    });
  } catch (error: unknown) {
    console.error('Error fetching CV:', error);
    return NextResponse.json(
      { success: false, error: (error instanceof Error ? error.message : String(error)) || 'Failed to fetch CV' },
      { status: 500 }
    );
  }
}
