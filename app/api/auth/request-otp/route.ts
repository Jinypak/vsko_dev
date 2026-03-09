import { NextResponse } from 'next/server';

const OTP_TTL_MS = 5 * 60 * 1000;

function isAllowedAdminEmail(email: string) {
  return email.toLowerCase().endsWith('@vsko.co.kr');
}

export async function POST(request: Request) {
  const { email } = (await request.json()) as { email?: string };
  const normalizedEmail = (email ?? '').trim().toLowerCase();

  if (!normalizedEmail || !isAllowedAdminEmail(normalizedEmail)) {
    return NextResponse.json(
      { message: 'vsko.co.kr 메일 계정만 로그인할 수 있습니다.' },
      { status: 400 },
    );
  }

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const expiresAt = Date.now() + OTP_TTL_MS;

  const response = NextResponse.json({
    message: 'OTP를 메일로 발송했습니다. (현재는 메일 연동 전 단계로 콘솔 확인)',
    devOtp: otp,
  });

  response.cookies.set('vsko_admin_otp', otp, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });

  response.cookies.set('vsko_admin_email', normalizedEmail, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });

  response.cookies.set('vsko_admin_otp_exp', String(expiresAt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OTP_TTL_MS / 1000,
  });

  // TODO: 실제 SMTP/메일 서비스 연동 시 OTP 메일 발송 처리
  console.log(`[OTP] ${normalizedEmail} => ${otp}`);

  return response;
}
