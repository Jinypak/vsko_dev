import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIES, SESSION_TTL_SECONDS } from '@/lib/auth/admin-auth';

export async function POST(request: NextRequest) {
  const { otp } = (await request.json()) as { otp?: string };
  const inputOtp = (otp ?? '').trim();

  const savedOtp = request.cookies.get(AUTH_COOKIES.otp)?.value;
  const principal = request.cookies.get(AUTH_COOKIES.principal)?.value;
  const channel = request.cookies.get(AUTH_COOKIES.channel)?.value as 'email' | 'kakao' | undefined;
  const expiresAt = Number(request.cookies.get(AUTH_COOKIES.otpExp)?.value ?? 0);

  if (!savedOtp || !principal || !channel || !expiresAt || Date.now() > expiresAt) {
    return NextResponse.json(
      { message: 'OTP가 만료되었습니다. 다시 요청해 주세요.' },
      { status: 400 },
    );
  }

  if (inputOtp !== savedOtp) {
    return NextResponse.json({ message: 'OTP가 올바르지 않습니다.' }, { status: 400 });
  }

  // TODO(auth): 임시 우선순위 작업을 위해 JWT 생성 흐름을 잠시 비활성화.
  // 원복 시 아래 블록을 되살려 `jwt`를 생성하고 세션 쿠키에 저장할 것.
  // const secret = getAuthJwtSecret();
  // if (!secret) {
  //   return NextResponse.json(
  //     {
  //       message:
  //         'JWT 시크릿이 없습니다. AUTH_JWT_SECRET 또는 NODE_ENV별 AUTH_JWT_SECRET_PRODUCTION/DEVELOPMENT/TEST를 설정해 주세요.',
  //     },
  //     { status: 500 },
  //   );
  // }
  //
  // const jwt = await createAdminSessionJwt({
  //   principal,
  //   channel,
  //   ttlSeconds: SESSION_TTL_SECONDS,
  //   secret,
  // });

  const response = NextResponse.json({ message: '로그인 성공' });

  response.cookies.set(AUTH_COOKIES.session, principal, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  response.cookies.set(AUTH_COOKIES.otp, '', { maxAge: 0, path: '/' });
  response.cookies.set(AUTH_COOKIES.otpExp, '', { maxAge: 0, path: '/' });
  response.cookies.set(AUTH_COOKIES.principal, '', { maxAge: 0, path: '/' });
  response.cookies.set(AUTH_COOKIES.channel, '', { maxAge: 0, path: '/' });

  return response;
}
