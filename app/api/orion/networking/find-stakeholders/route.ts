import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5002';

interface FindStakeholdersRequestBody {
  companyName: string;
  opportunityId: string;
  role?: string;
  count?: number;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body: FindStakeholdersRequestBody = await request.json();
    const { companyName, opportunityId, role, count } = body;

    if (!companyName) {
      return NextResponse.json({
        success: false,
        error: 'Company name is required.'
      }, { status: 400 });
    }

    const pythonApiResponse = await fetch(`${PYTHON_API_URL}/find_stakeholders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, role, count }),
    });

    if (!pythonApiResponse.ok) {
        const errorBody = await pythonApiResponse.text();
        console.error('Python API error:', errorBody);
        return NextResponse.json({
            success: false,
            error: 'Failed to find stakeholders from Python backend.',
            details: errorBody
        }, { status: pythonApiResponse.status });
    }

    const data = await pythonApiResponse.json();

    return NextResponse.json({
      success: true,
      stakeholders: data.stakeholders,
    });

  } catch (error: any) {
    console.error('[FIND_STAKEHOLDERS_API_ERROR]', error);

    return NextResponse.json({
      success: false,
      error: 'Failed to find stakeholders.',
      details: error.message
    }, { status: 500 });
  }
}
