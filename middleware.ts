import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIES } from '@/lib/auth/admin-auth';
import { getAuthJwtSecret, verifyAdminSessionJwt } from '@/lib/auth/jwt';

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIES.session)?.value;
  if (!token) return false;

  const secret = getAuthJwtSecret();
  if (!secret) return false;

  const payload = await verifyAdminSessionJwt(token, secret);
  return Boolean(payload);
}

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const isAuthed = await hasValidSession(request);

  if (currentPath.startsWith('/dashboard') && !isAuthed) {
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.set(AUTH_COOKIES.session, '', { path: '/', maxAge: 0 });
    return response;
  }

  if (currentPath === '/sign-in' && isAuthed) {

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
