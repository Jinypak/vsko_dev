import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  AUTH_COOKIES,
  OTP_TTL_MS,
  generateOtp,
  isAllowedAdminEmail,
  normalizeEmail,
} from '@/lib/auth/admin-auth';
import { sendEmailOtp } from '@/lib/auth/delivery';

export async function POST(request: NextRequest) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = normalizeEmail(email ?? '');

  if (!normalizedEmail || !isAllowedAdminEmail(normalizedEmail)) {
    return NextResponse.json(
      { message: '허용된 vsko.co.kr 관리자 메일만 로그인할 수 있습니다.' },
      { status: 400 },
    );
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;

  const delivery = await sendEmailOtp(normalizedEmail, otp);

  const response = NextResponse.json({
    message: `메일 OTP를 발송했습니다. (${delivery.provider})`,
    devOtp: delivery.delivered ? undefined : otp,
  });

  response.cookies.set(AUTH_COOKIES.otp, otp, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });
  response.cookies.set(AUTH_COOKIES.principal, normalizedEmail, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });
  response.cookies.set(AUTH_COOKIES.channel, 'email', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });
  response.cookies.set(AUTH_COOKIES.otpExp, String(expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });

  return response;
}
