import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIES } from '@/lib/auth/admin-auth';

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIES.session)?.value;
  const currentPath = request.nextUrl.pathname;

  if (currentPath.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (currentPath === '/sign-in' && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in'],
};
