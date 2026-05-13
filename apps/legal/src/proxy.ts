import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Store report passwords - in production, these should come from environment variables or a database
const REPORT_PASSWORDS: Record<string, string> = {
  'union-bank-report-1': process.env.UNION_BANK_PASSWORD || 'UB130226',
  'project-fortify-2026': process.env.PROJECT_FORTIFY_PASSWORD || 'PF2026JEE',
  // Add future reports here
};

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect /reports/* routes
  if (!path.startsWith('/reports/')) {
    return NextResponse.next();
  }

  // Skip auth page itself
  if (path === '/reports/auth') {
    return NextResponse.next();
  }

  // Skip API routes
  if (path.startsWith('/reports/api')) {
    return NextResponse.next();
  }

  // Extract report ID from path (/reports/jee/union-bank-report-1)
  const pathParts = path.split('/').filter(Boolean);
  const reportId = pathParts[pathParts.length - 1];

  // Check if password is required for this report
  const requiredPassword = REPORT_PASSWORDS[reportId];
  if (!requiredPassword) {
    return NextResponse.next(); // No password set, allow access
  }

  // Check for auth cookie
  const authCookie = request.cookies.get(`report_auth_${reportId}`);

  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }

  // Redirect to password gate
  const loginUrl = new URL('/reports/auth', request.url);
  loginUrl.searchParams.set('redirect', path);
  loginUrl.searchParams.set('report', reportId);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/reports/:path*'],
};
