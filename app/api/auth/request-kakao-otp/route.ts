import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  AUTH_COOKIES,
  OTP_TTL_MS,
  generateOtp,
  isAllowedAdminPhone,
  normalizePhone,
} from '@/lib/auth/admin-auth';
import { sendKakaoOtp } from '@/lib/auth/delivery';

export async function POST(request: NextRequest) {
  const { phone } = (await request.json()) as { phone?: string };
  const normalizedPhone = normalizePhone(phone ?? '');

  if (!normalizedPhone || !isAllowedAdminPhone(normalizedPhone)) {
    return NextResponse.json(
      {
        message:
          '허용된 관리자 휴대폰 번호만 카카오톡 OTP 인증이 가능합니다. (ADMIN_ALLOWED_PHONES 설정 필요)',
      },
      { status: 400 },
    );
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + OTP_TTL_MS;
  const delivery = await sendKakaoOtp(normalizedPhone, otp);

  const response = NextResponse.json({
    message: `카카오톡 OTP를 발송했습니다. (${delivery.provider})`,
    devOtp: delivery.delivered ? undefined : otp,
  });

  response.cookies.set(AUTH_COOKIES.otp, otp, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });
  response.cookies.set(AUTH_COOKIES.principal, normalizedPhone, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });
  response.cookies.set(AUTH_COOKIES.channel, 'kakao', {
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
