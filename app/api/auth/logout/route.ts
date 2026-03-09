import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const response = NextResponse.redirect(new URL('/sign-in', request.url));
  response.cookies.set('vsko_admin_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('vsko_admin_email', '', { path: '/', maxAge: 0 });
  response.cookies.set('vsko_admin_otp', '', { path: '/', maxAge: 0 });
  response.cookies.set('vsko_admin_otp_exp', '', { path: '/', maxAge: 0 });

  return response;
}
