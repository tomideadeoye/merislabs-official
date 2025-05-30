import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const isPublicPath = path === "/signin" || path === "/signup" || path === "/reset-password";
  
  // Define API paths that need authentication
  const isProtectedApiPath = path.startsWith("/api/orion/");
  
  // Define admin paths that need authentication
  const isAdminPath = path.startsWith("/admin");
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });
  
  // Redirect logic for public pages
  if (isPublicPath) {
    if (token) {
      // If user is already logged in, redirect to admin dashboard
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Allow access to public paths for non-authenticated users
    return NextResponse.next();
  }
  
  // Authentication check for protected API routes
  if (isProtectedApiPath) {
    if (!token) {
      // Return 401 Unauthorized for API routes
      return new NextResponse(
        JSON.stringify({ success: false, error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    // Allow authenticated API requests
    return NextResponse.next();
  }
  
  // Authentication check for admin pages
  if (isAdminPath) {
    if (!token) {
      // Redirect to login page with return URL
      const url = new URL("/signin", request.url);
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }
    // Allow authenticated admin access
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
    "/reset-password"
  ],
};