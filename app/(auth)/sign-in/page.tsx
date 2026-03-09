'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type AuthMethod = 'email' | 'kakao';

export default function SignInPage() {
  const [method, setMethod] = useState<AuthMethod>('email');
  const [email, setEmail] = useState('jiny3360@vsko.co.kr');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestOtp = async () => {
    setLoading(true);
    setMessage('');

    const url = method === 'email' ? '/api/auth/request-otp' : '/api/auth/request-kakao-otp';
    const payload = method === 'email' ? { email } : { phone };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message: string; devOtp?: string };

      if (!response.ok) {
        setMessage(result.message);
        return;
      }

      setOtpRequested(true);
      setMessage(`${result.message}${result.devOtp ? ` / 테스트 OTP: ${result.devOtp}` : ''}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const result = (await response.json()) as { message: string };

      if (!response.ok) {
        setMessage(result.message);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-6xl items-center px-6 py-12">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Admin Login</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">관리자 OTP 로그인</h1>
        <p className="mt-3 text-sm text-slate-600">메일 OTP 또는 카카오톡 OTP 인증으로 로그인할 수 있습니다.</p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMethod('email');
              setOtpRequested(false);
              setMessage('');
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${method === 'email' ? 'bg-white text-slate-900' : 'text-slate-500'}`}
          >
            메일 OTP
          </button>
          <button
            type="button"
            onClick={() => {
              setMethod('kakao');
              setOtpRequested(false);
              setMessage('');
            }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${method === 'kakao' ? 'bg-white text-slate-900' : 'text-slate-500'}`}
          >
            카카오톡 OTP
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {method === 'email' ? (
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
                관리자 메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="name@vsko.co.kr"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
                관리자 휴대폰 번호
              </label>
              <input
                id="phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="예: 01012345678"
              />
            </div>
          )}

          <button
            type="button"
            onClick={requestOtp}
            disabled={loading}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            OTP 요청
          </button>

          {otpRequested && (
            <>
              <div>
                <label htmlFor="otp" className="mb-1 block text-sm font-medium text-slate-700">
                  OTP 코드 (6자리)
                </label>
                <input
                  id="otp"
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="예: 123456"
                />
              </div>

              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                로그인
              </button>
            </>
          )}

          {message && <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{message}</p>}

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            운영 설정: <code>RESEND_API_KEY</code>, <code>RESEND_FROM_EMAIL</code>,
            <code>ADMIN_ALLOWED_EMAILS</code>, <code>ADMIN_ALLOWED_PHONES</code>,
            <code>KAKAO_MESSAGE_WEBHOOK_URL</code>
          </div>
        </div>
      </section>
    </main>
  );
}
