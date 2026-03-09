import { NextResponse } from 'next/server';
import { AUTH_COOKIES } from '@/lib/auth/admin-auth';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url));
  response.cookies.set(AUTH_COOKIES.session, '', { path: '/', maxAge: 0 });
  response.cookies.set(AUTH_COOKIES.principal, '', { path: '/', maxAge: 0 });
  response.cookies.set(AUTH_COOKIES.channel, '', { path: '/', maxAge: 0 });
  response.cookies.set(AUTH_COOKIES.otp, '', { path: '/', maxAge: 0 });
  response.cookies.set(AUTH_COOKIES.otpExp, '', { path: '/', maxAge: 0 });

  return response;
}
