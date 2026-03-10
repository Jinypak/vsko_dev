'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer, CustomerHistory } from '@/lib/admin-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type HistoryCategory = CustomerHistory['category'];

const historyCategoryOptions: Array<{ value: HistoryCategory; label: string }> = [
  { value: 'work', label: '작업' },
  { value: 'inspection', label: '점검' },
  { value: 'consulting', label: '상담' },
  { value: 'etc', label: '기타' },
];

const historyCategoryLabelMap: Record<HistoryCategory, string> = {
  work: '작업',
  inspection: '점검',
  consulting: '상담',
  etc: '기타',
};

export default function CustomerDetailEditor({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(customer);
  const [newHistoryTitle, setNewHistoryTitle] = useState('');
  const [newHistoryNote, setNewHistoryNote] = useState('');
  const [newHistoryCategory, setNewHistoryCategory] = useState<HistoryCategory>('work');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const saveChanges = async () => {
    setLoading(true);
    setStatus('');
    try {
      const response = await fetch(`/api/admin/customers/${draft.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hsmCount: draft.hsmCount,
          model: draft.model,
          engineer: draft.engineer,
          serials: draft.serials,
          contacts: draft.contacts,
        }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | Customer | null;
      if (!response.ok) {
        setStatus(payload && 'message' in payload && payload.message ? payload.message : '저장에 실패했습니다.');
        return;
      }

      const updatedCustomer = payload as Customer;
      setDraft(updatedCustomer);
      setStatus('변경사항이 저장되었습니다.');
      setEditMode(false);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const addHistory = async () => {
    if (!newHistoryTitle.trim()) return;

    setLoading(true);
    setStatus('');
    try {
      const response = await fetch(`/api/admin/customers/${draft.id}/histories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newHistoryTitle, note: newHistoryNote, category: newHistoryCategory }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | Customer | null;
      if (!response.ok) {
        setStatus(payload && 'message' in payload && payload.message ? payload.message : '기록 추가에 실패했습니다.');
        return;
      }

      const updatedCustomer = payload as Customer;
      setDraft(updatedCustomer);
      setNewHistoryTitle('');
      setNewHistoryNote('');
      setNewHistoryCategory('work');
      setStatus('새 기록이 추가되었습니다.');
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 space-y-6">
      <div className="flex items-center justify-end gap-2">
        <Button variant={editMode ? 'secondary' : 'outline'} onClick={() => setEditMode(!editMode)}>
          {editMode ? '편집 종료' : '편집 모드'}
        </Button>
        <Button onClick={saveChanges} disabled={!editMode || loading}>
          저장
        </Button>
      </div>

      {status && <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{status}</p>}

      <div className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>도입 장비 정보 (표 편집)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-slate-200">
              <table className="w-full table-fixed border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="w-[24%] border border-slate-200 px-2 py-1.5 text-left">모델</th>
                    <th className="w-[20%] border border-slate-200 px-2 py-1.5 text-left">엔지니어</th>
                    <th className="w-[44%] border border-slate-200 px-2 py-1.5 text-left">시리얼</th>
                    <th className="w-[12%] border border-slate-200 px-2 py-1.5 text-right">행</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.serials.map((serial, index) => (
                    <tr key={`${serial}-${index}`}>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={draft.model}
                          onChange={(e) => setDraft((p) => ({ ...p, model: e.target.value }))}
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={draft.engineer}
                          onChange={(e) => setDraft((p) => ({ ...p, engineer: e.target.value }))}
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={serial}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              serials: p.serials.map((v, i) => (i === index ? e.target.value : v)),
                            }))
                          }
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5 text-right">
                        <Button
                          variant="outline"
                          disabled={!editMode}
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              serials: p.serials.filter((_, i) => i !== index),
                              hsmCount: Math.max(0, p.serials.length - 1),
                            }))
                          }
                        >
                          삭제
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {draft.serials.length === 0 && (
                    <tr>
                      <td className="border border-slate-200 p-3 text-slate-500" colSpan={4}>
                        등록된 장비가 없습니다. 편집 모드에서 행을 추가하세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between">
              <p className="text-xs text-slate-500">현재 장비 수: {draft.hsmCount}대</p>
              <Button
                variant="outline"
                disabled={!editMode}
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    serials: [...p.serials, ''],
                    hsmCount: p.serials.length + 1,
                  }))
                }
              >
                장비 행 추가
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>고객사 담당자 (표 편집)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md border border-slate-200">
              <table className="w-full table-fixed border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="w-[16%] border border-slate-200 px-2 py-1.5 text-left">이름</th>
                    <th className="w-[16%] border border-slate-200 px-2 py-1.5 text-left">부서</th>
                    <th className="w-[22%] border border-slate-200 px-2 py-1.5 text-left">전화번호</th>
                    <th className="w-[34%] border border-slate-200 px-2 py-1.5 text-left">이메일</th>
                    <th className="w-[12%] border border-slate-200 px-2 py-1.5 text-right">행</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.contacts.map((contact, index) => (
                    <tr key={`${contact.email}-${index}`}>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={contact.name}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              contacts: p.contacts.map((c, i) => (i === index ? { ...c, name: e.target.value } : c)),
                            }))
                          }
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={contact.team}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              contacts: p.contacts.map((c, i) => (i === index ? { ...c, team: e.target.value } : c)),
                            }))
                          }
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={contact.phone}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              contacts: p.contacts.map((c, i) => (i === index ? { ...c, phone: e.target.value } : c)),
                            }))
                          }
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <Input
                          disabled={!editMode}
                          value={contact.email}
                          onChange={(e) =>
                            setDraft((p) => ({
                              ...p,
                              contacts: p.contacts.map((c, i) => (i === index ? { ...c, email: e.target.value } : c)),
                            }))
                          }
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5 text-right">
                        <Button
                          variant="outline"
                          disabled={!editMode}
                          onClick={() =>
                            setDraft((p) => ({
                              ...p,
                              contacts: p.contacts.filter((_, i) => i !== index),
                            }))
                          }
                        >
                          삭제
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {draft.contacts.length === 0 && (
                    <tr>
                      <td className="border border-slate-200 p-3 text-slate-500" colSpan={5}>
                        담당자가 없습니다. 편집 모드에서 행을 추가하세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                disabled={!editMode}
                onClick={() =>
                  setDraft((p) => ({
                    ...p,
                    contacts: [...p.contacts, { name: '', team: '', phone: '', email: '' }],
                  }))
                }
              >
                담당자 행 추가
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>작업/상담 히스토리</CardTitle>
          <div className="grid gap-2 md:grid-cols-[140px_1fr_2fr_auto]">
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={newHistoryCategory}
              onChange={(e) => setNewHistoryCategory(e.target.value as HistoryCategory)}
            >
              {historyCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Input
              placeholder="새 기록 제목"
              value={newHistoryTitle}
              onChange={(e) => setNewHistoryTitle(e.target.value)}
            />
            <Input
              placeholder="특이사항/메모"
              value={newHistoryNote}
              onChange={(e) => setNewHistoryNote(e.target.value)}
            />
            <Button onClick={addHistory} disabled={loading}>
              새 기록 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {draft.histories.map((history) => (
            <div key={`${history.dateTime}-${history.title}`} className="rounded-md border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-primary">{history.dateTime}</p>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {historyCategoryLabelMap[history.category ?? 'etc']}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-700">{history.title}</p>
              {history.note && <p className="mt-1.5 text-sm text-slate-600">{history.note}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
