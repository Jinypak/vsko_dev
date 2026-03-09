'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, MessageCircle, KeyRound } from 'lucide-react';
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
      <div className="grid w-full gap-6 md:grid-cols-[1.1fr_1fr]">
        <Card className="border-primary/15 bg-gradient-to-br from-white to-sky-50/40">
          <CardHeader>
            <Badge className="w-fit" variant="secondary">
              VSKO ADMIN
            </Badge>
            <CardTitle className="flex items-center gap-2 text-3xl text-slate-800">
              <ShieldCheck className="h-7 w-7 text-primary" />
              보안 관리자 로그인
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              OTP 인증을 통해 관리자 콘솔에 접근합니다. 메일 또는 카카오톡 인증 방식을 선택해 주세요.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
              <Button
                variant={method === 'email' ? 'secondary' : 'ghost'}
                onClick={() => {
                  setMethod('email');
                  setOtpRequested(false);
                  setMessage('');
                }}
                className="gap-2"
              >
                <Mail className="h-4 w-4" /> 메일 OTP
              </Button>
              <Button
                variant={method === 'kakao' ? 'secondary' : 'ghost'}
                onClick={() => {
                  setMethod('kakao');
                  setOtpRequested(false);
                  setMessage('');
                }}
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4" /> 카카오 OTP
              </Button>
            </div>

            {method === 'email' ? (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">관리자 메일</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@vsko.co.kr"
                />
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-sm font-medium">관리자 휴대폰 번호</label>
                <Input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="예: 01012345678"
                />
              </div>
            )}

            <Button onClick={requestOtp} disabled={loading} className="w-full">
              OTP 요청
            </Button>

            {otpRequested && (
              <div className="space-y-3 rounded-lg border border-primary/15 bg-white/90 p-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">OTP 코드 (6자리)</label>
                  <Input
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="예: 123456"
                  />
                </div>
                <Button variant="secondary" onClick={verifyOtp} disabled={loading} className="w-full gap-2">
                  <KeyRound className="h-4 w-4" /> 로그인
                </Button>
              </div>
            )}

            {message && <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">{message}</p>}
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 bg-white/90">
          <CardHeader>
            <CardTitle className="text-xl text-slate-800">접속 가이드</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-medium text-slate-700">1. 인증 채널 선택</p>
              <p className="mt-1">메일 OTP 또는 카카오톡 OTP를 선택한 뒤 수신 정보를 입력합니다.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-medium text-slate-700">2. OTP 발급</p>
              <p className="mt-1">요청 후 5분 이내 도착한 인증번호를 입력해 주세요.</p>
            </div>
            <div className="rounded-md bg-slate-50 p-3">
              <p className="font-medium text-slate-700">3. 관리자 콘솔 접속</p>
              <p className="mt-1">인증 성공 시 고객사 관리 및 운영 히스토리 화면으로 이동합니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
