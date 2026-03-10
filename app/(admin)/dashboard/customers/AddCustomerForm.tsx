'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AddCustomerForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const createCustomer = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setMessage('고객사 이름을 입력해 주세요.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });

      const result = (await response.json()) as { message?: string; id?: string };

      if (!response.ok) {
        setMessage(result.message ?? '고객사 추가에 실패했습니다.');
        return;
      }

      setName('');
      setMessage('고객사가 추가되었습니다.');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-800">고객사 직접 추가</p>
      <p className="text-xs text-slate-500">동일한 이름의 기존 고객사가 있어도 신규 항목으로 추가됩니다.</p>
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="예: 현대자동차"
          onKeyDown={async (event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              await createCustomer();
            }
          }}
        />
        <Button onClick={createCustomer} disabled={loading || !name.trim()}>
          추가
        </Button>
      </div>
      {message && <p className="text-xs text-slate-500">{message}</p>}
    </div>
  );
}
