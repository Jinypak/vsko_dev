import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIES } from '@/lib/auth/admin-auth';

async function hasValidSession(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIES.session)?.value;
  if (!token) return false;

  // TODO(auth): JWT 기반 세션 검증 임시 비활성화.
  // 원복 시 아래 코드로 되돌려 서명/만료 검증을 다시 활성화할 것.
  // const secret = getAuthJwtSecret();
  // if (!secret) return false;
  //
  // const payload = await verifyAdminSessionJwt(token, secret);
  // return Boolean(payload);

  return true;
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
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in'],
};
