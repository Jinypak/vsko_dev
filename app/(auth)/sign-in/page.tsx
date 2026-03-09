'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('jiny3360@vsko.co.kr');
  const [otp, setOtp] = useState('');
  const [otpRequested, setOtpRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
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

      setMessage('인증 성공! 관리자 페이지로 이동합니다.');
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
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">메일 OTP 로그인</h1>
        <p className="mt-3 text-sm text-slate-600">
          `@vsko.co.kr` 메일로 OTP를 받아 로그인합니다. (예: jiny3360@vsko.co.kr)
        </p>

        <div className="mt-6 space-y-4">
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
        </div>
      </section>
    </main>
  );
}
