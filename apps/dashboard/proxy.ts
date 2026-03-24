import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';



export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get('nort_auth');
  // Always rewrite / to /landing-view
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/landing-view', request.url));
  }
  // Protect /app: only allow if authenticated
  if (pathname.startsWith('/app')) {
    if (!cookie || cookie.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*'],
};
