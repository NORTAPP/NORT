// middleware.ts in your Main NORT Repo
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check for Privy token (logged-in state)
  const authToken = request.cookies.get('privy-token');

  // 2. ROOT LOGIC
  if (pathname === '/') {
    // If NOT logged in, rewrite them to the landing page
    if (!authToken) {
      return NextResponse.rewrite(new URL('https://nort-landing-nine.vercel.app', request.url));
    }
    // If logged in, do nothing (let them see the local dashboard root)
    return NextResponse.next();
  }

  return NextResponse.next();
}

// 3. The Matcher is critical. It must include '/' but exclude static files.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * This allows '/' to be caught and processed.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};