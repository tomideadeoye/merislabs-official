import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { auth } from "./auth";
// If you need authentication in middleware, use cookies or headers directly.

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/admin/:path*', '/api/orion/:path*', '/signin', '/signup', '/login', '/reset-password'],
};
