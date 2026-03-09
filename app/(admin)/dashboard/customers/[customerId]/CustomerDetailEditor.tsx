'use client';

import { useMemo, useState } from 'react';
import type { Customer } from '@/lib/admin-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CustomerDetailEditor({ customer }: { customer: Customer }) {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(customer);
  const [newHistoryTitle, setNewHistoryTitle] = useState('');
  const [newHistoryNote, setNewHistoryNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const serialText = useMemo(() => draft.serials.join(', '), [draft.serials]);

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

      if (!response.ok) {
        setStatus('저장에 실패했습니다.');
        return;
      }

      setStatus('변경사항이 저장되었습니다.');
      setEditMode(false);
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
        body: JSON.stringify({ title: newHistoryTitle, note: newHistoryNote }),
      });

      const updated = (await response.json()) as Customer;
      if (!response.ok) {
        setStatus('기록 추가에 실패했습니다.');
        return;
      }

      setDraft(updated);
      setNewHistoryTitle('');
      setNewHistoryNote('');
      setStatus('새 기록이 추가되었습니다.');
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

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>도입 장비 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-600">
            <label className="block space-y-1">
              <span>HSM 개수</span>
              <Input
                disabled={!editMode}
                type="number"
                value={draft.hsmCount}
                onChange={(e) => setDraft((p) => ({ ...p, hsmCount: Number(e.target.value) || 0 }))}
              />
            </label>
            <label className="block space-y-1">
              <span>모델</span>
              <Input
                disabled={!editMode}
                value={draft.model}
                onChange={(e) => setDraft((p) => ({ ...p, model: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span>담당 엔지니어</span>
              <Input
                disabled={!editMode}
                value={draft.engineer}
                onChange={(e) => setDraft((p) => ({ ...p, engineer: e.target.value }))}
              />
            </label>
            <label className="block space-y-1">
              <span>SERIAL (콤마로 구분)</span>
              <Input
                disabled={!editMode}
                value={serialText}
                onChange={(e) =>
                  setDraft((p) => ({
                    ...p,
                    serials: e.target.value
                      .split(',')
                      .map((v) => v.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>고객사 담당자</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {draft.contacts.map((contact, index) => (
              <div key={contact.email + index} className="rounded-md border border-slate-100 p-3 text-sm text-slate-600">
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
                <Input
                  className="mt-2"
                  disabled={!editMode}
                  value={contact.team}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      contacts: p.contacts.map((c, i) => (i === index ? { ...c, team: e.target.value } : c)),
                    }))
                  }
                />
                <Input
                  className="mt-2"
                  disabled={!editMode}
                  value={contact.phone}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      contacts: p.contacts.map((c, i) => (i === index ? { ...c, phone: e.target.value } : c)),
                    }))
                  }
                />
                <Input
                  className="mt-2"
                  disabled={!editMode}
                  value={contact.email}
                  onChange={(e) =>
                    setDraft((p) => ({
                      ...p,
                      contacts: p.contacts.map((c, i) => (i === index ? { ...c, email: e.target.value } : c)),
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>작업/상담 히스토리</CardTitle>
          <div className="grid gap-2 md:grid-cols-[1fr_2fr_auto]">
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
            <Button onClick={addHistory} disabled={loading}>새 기록 추가</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {draft.histories.map((history) => (
            <div key={`${history.dateTime}-${history.title}`} className="rounded-md border border-slate-100 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold text-primary">{history.dateTime}</p>
              <p className="mt-1 text-sm font-medium text-slate-700">{history.title}</p>
              {history.note && <p className="mt-1.5 text-sm text-slate-600">{history.note}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
