'use client';

import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const channels = [
  { title: '도입 문의', value: 'sales@vsko.co.kr' },
  { title: '기술 지원', value: 'support@vsko.co.kr' },
  { title: '대표 번호', value: '02-0000-0000' },
] as const;

type InquiryType = '도입 문의' | '기술 지원';

export default function ContactPage() {
  const [selectedType, setSelectedType] = useState<InquiryType | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!selectedType) return;

    setLoading(true);
    setStatus('');
    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inquiryType: selectedType, name, email, message }),
      });
      const result = (await response.json()) as { message: string };
      setStatus(result.message);
      if (response.ok) {
        setName('');
        setEmail('');
        setMessage('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">프로젝트 상담 문의</h1>
        <p className="mt-5 max-w-2xl text-slate-600">이메일 아이콘을 눌러 문의 유형을 선택하고 바로 문의 메일을 보낼 수 있습니다.</p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {channels.map((channel) => (
            <Card key={channel.title} className="bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-slate-700">{channel.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{channel.value}</p>
                {(channel.title === '도입 문의' || channel.title === '기술 지원') && (
                  <Button
                    onClick={() => setSelectedType(channel.title)}
                    variant="outline"
                    className="mt-4 w-full gap-2"
                  >
                    <Mail className="h-4 w-4" /> 이메일로 문의하기
                  </Button>
                )}
                {channel.title === '대표 번호' && (
                  <Button variant="outline" className="mt-4 w-full gap-2" disabled>
                    <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" /> 전화 상담</span>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedType && (
          <Card className="mt-8 border-primary/20">
            <CardHeader>
              <CardTitle>{selectedType} 메일 보내기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} />
              <Input placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
              <textarea
                className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="문의 내용을 입력해 주세요"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={submit} disabled={loading}>보내기</Button>
                <Button variant="ghost" onClick={() => setSelectedType(null)}>닫기</Button>
              </div>
              {status && <p className="text-sm text-muted-foreground">{status}</p>}
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
