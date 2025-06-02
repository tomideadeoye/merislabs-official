import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { auth } from "./auth";
// If you need authentication in middleware, use cookies or headers directly.

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === "/signin" || path === "/signup" || path === "/reset-password" || path === "/login";

  // Define API paths that need authentication
  const isProtectedApiPath = path.startsWith("/api/orion/") && !path.startsWith("/api/orion/llm/test");

  // Define admin paths that need authentication
  const isAdminPath = path.startsWith("/admin");

  // NOTE: Session is not available in middleware. Use cookies or headers if you need to check auth.
  // Example: const token = request.cookies.get('next-auth.session-token')?.value;

  // Redirect logic for public pages
  if (isPublicPath) {
    // Allow access to public paths for all users
    return NextResponse.next();
  }

  // Authentication check for protected API routes
  if (isProtectedApiPath) {
    // Implement API auth check using cookies or headers if needed
    return NextResponse.next();
  }

  // Authentication check for admin pages
  if (isAdminPath) {
    // Implement admin auth check using cookies or headers if needed
    return NextResponse.next();
  }

  // For all other routes, proceed normally
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/orion/:path*",
    "/signin",
    "/signup",
    "/login",
    "/reset-password"
  ],
};
