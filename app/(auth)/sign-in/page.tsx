'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
      <Card className="w-full max-w-xl border-slate-200/80 bg-white/95">
        <CardHeader>
          <Badge className="w-fit" variant="secondary">Admin Login</Badge>
          <CardTitle className="text-3xl">관리자 OTP 로그인</CardTitle>
          <p className="text-sm text-muted-foreground">메일 OTP 또는 카카오톡 OTP 인증으로 로그인할 수 있습니다.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <Button variant={method === 'email' ? 'secondary' : 'ghost'} onClick={() => { setMethod('email'); setOtpRequested(false); setMessage(''); }}>
              메일 OTP
            </Button>
            <Button variant={method === 'kakao' ? 'secondary' : 'ghost'} onClick={() => { setMethod('kakao'); setOtpRequested(false); setMessage(''); }}>
              카카오톡 OTP
            </Button>
          </div>

          {method === 'email' ? (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">관리자 메일</label>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@vsko.co.kr" />
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">관리자 휴대폰 번호</label>
              <Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="예: 01012345678" />
            </div>
          )}

          <Button onClick={requestOtp} disabled={loading} className="w-full">OTP 요청</Button>

          {otpRequested && (
            <div className="space-y-3 rounded-lg border border-slate-200 p-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">OTP 코드 (6자리)</label>
                <Input value={otp} onChange={(event) => setOtp(event.target.value)} placeholder="예: 123456" />
              </div>
              <Button variant="secondary" onClick={verifyOtp} disabled={loading} className="w-full">로그인</Button>
            </div>
          )}

          {message && <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>
    </main>
  );
}
