import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const REPORT_PASSWORDS: Record<string, string> = {
  'union-bank-report-1': process.env.UNION_BANK_PASSWORD || 'UB130226',
};

export async function POST(request: Request) {
  try {
    const { reportId, password } = await request.json();

    if (!reportId || !password) {
      return NextResponse.json({ error: 'Missing reportId or password' }, { status: 400 });
    }

    const correctPassword = REPORT_PASSWORDS[reportId];

    if (!correctPassword) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    if (password === correctPassword) {
      // Set cookie for 24 hours
      (await cookies()).set(`report_auth_${reportId}`, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
