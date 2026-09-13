import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error(
    "JWT_SECRET is not defined. Add it to your .env file and restart the server.",
  );
}

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Routes that don't require auth
const PUBLIC_ROUTES = ["/login", "/register"];

// Auth API routes (always allowed)
const AUTH_API_PREFIX = "/api/auth";

// Static/assets that should never be checked
const STATIC_PREFIXES = ["/_next", "/favicon.ico", "/.swc"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files
  if (STATIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Skip auth API routes
  if (pathname.startsWith(AUTH_API_PREFIX)) {
    return NextResponse.next();
  }

  // Read token
  const token = request.cookies.get("token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isPublicRoute = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));

  // Logged-in user visiting /login or /register → redirect to /workout
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/workout", request.url));
  }

  // Not logged-in user visiting a protected route → redirect to /login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image
     * - favicon.ico
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
