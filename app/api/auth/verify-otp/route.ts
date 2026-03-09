import { NextResponse } from 'next/server';

const SESSION_TTL_SECONDS = 60 * 60 * 8;

export async function POST(request: Request) {
  const { otp } = (await request.json()) as { otp?: string };
  const inputOtp = (otp ?? '').trim();

  const savedOtp = request.headers
    .get('cookie')
    ?.split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith('vsko_admin_otp='))
    ?.split('=')[1];
  const savedEmail = request.headers
    .get('cookie')
    ?.split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith('vsko_admin_email='))
    ?.split('=')[1];
  const expiresRaw = request.headers
    .get('cookie')
    ?.split(';')
    .map((v) => v.trim())
    .find((v) => v.startsWith('vsko_admin_otp_exp='))
    ?.split('=')[1];

  const expiresAt = Number(expiresRaw ?? 0);

  if (!savedOtp || !savedEmail || !expiresAt || Date.now() > expiresAt) {
    return NextResponse.json(
      { message: 'OTP가 만료되었습니다. 다시 요청해 주세요.' },
      { status: 400 },
    );
  }

  if (inputOtp !== decodeURIComponent(savedOtp)) {
    return NextResponse.json({ message: 'OTP가 올바르지 않습니다.' }, { status: 400 });
  }

  const response = NextResponse.json({ message: '로그인 성공' });

  response.cookies.set('vsko_admin_session', decodeURIComponent(savedEmail), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS,
  });

  response.cookies.set('vsko_admin_otp', '', { maxAge: 0, path: '/' });
  response.cookies.set('vsko_admin_otp_exp', '', { maxAge: 0, path: '/' });

  return response;
}
