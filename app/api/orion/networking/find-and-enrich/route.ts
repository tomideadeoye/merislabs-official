import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth';
import { Stakeholder } from '@/lib/types';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5002';

interface FindAndEnrichStakeholdersRequest {
  companyName: string;
  role?: string;
  count?: number;
  enrichFields?: string[];
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authConfig);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { companyName, role, count, enrichFields } = await request.json();

    if (!companyName) {
      return NextResponse.json({ success: false, error: 'Company name is required' }, { status: 400 });
    }

    // First find stakeholders
    const findResponse = await fetch(`${PYTHON_API_URL}/find_stakeholders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, role, count }),
    });

    if (!findResponse.ok) {
      const error = await findResponse.text();
      console.error('[FIND_STAKEHOLDERS_ERROR]', error);
      return NextResponse.json({ success: false, error: 'Stakeholder search failed' }, { status: findResponse.status });
    }

    const { stakeholders } = await findResponse.json();

    // Enrich stakeholder data
    const enrichedStakeholders = await Promise.all(
      stakeholders.map(async (stakeholder: Stakeholder) => {
        const enrichResponse = await fetch(`${PYTHON_API_URL}/enrich_profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            profileId: stakeholder.id,
            fields: enrichFields || ['current_role', 'experience', 'education'],
          }),
        });

        return enrichResponse.ok ? { ...stakeholder, ...(await enrichResponse.json()) } : stakeholder;
      })
    );

    return NextResponse.json({
      success: true,
      stakeholders: enrichedStakeholders,
    });
  } catch (error) {
    console.error('[NETWORKING_HUB_ERROR]', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
