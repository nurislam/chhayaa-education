import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // Assuming JWT or session token
  const authCred = req.cookies.get("AUTH_CRED");
  const token = authCred ? JSON.parse(authCred.value).token : null;

  // Define protected routes
  const protectedRoutes = ["/admin", "/accounts"];

  // Check if the user is trying to access a protected route
  if (protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Check for dynamic routes like /app/[identifier]
  const dynamicRoutes = req.nextUrl.pathname.startsWith('/app/') && req.nextUrl.pathname.split('/').length === 3;

  if (dynamicRoutes) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply middleware to all routes including dynamic routes like /app/[identifier]
export const config = {
  matcher: ["/admin/:path*", "/accounts/:path*", "/app/:identifier"],
};
