'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Customer } from '@/lib/admin-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type VerificationLog = {
  time: string;
  action: 'PATCH' | 'POST';
  result: string;
};

function nowTime() {
  return new Date().toLocaleTimeString('ko-KR', { hour12: false });
}

export default function CustomerDetailEditor({ customer }: { customer: Customer }) {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(customer);
  const [newHistoryTitle, setNewHistoryTitle] = useState('');
  const [newHistoryNote, setNewHistoryNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationLogs, setVerificationLogs] = useState<VerificationLog[]>([]);

  const serialText = useMemo(() => draft.serials.join(', '), [draft.serials]);

  const appendLog = (log: VerificationLog) => {
    setVerificationLogs((prev) => [log, ...prev].slice(0, 8));
  };

  const verifyAfterPatch = async (expected: Customer) => {
    const getResponse = await fetch(`/api/admin/customers/${expected.id}`, { cache: 'no-store' });
    const latest = (await getResponse.json().catch(() => null)) as Customer | null;

    if (!getResponse.ok || !latest) {
      appendLog({
        time: nowTime(),
        action: 'PATCH',
        result: `검증 실패: GET 재조회 오류 (status ${getResponse.status})`,
      });
      return;
    }

    const isSynced =
      latest.hsmCount === expected.hsmCount &&
      latest.model === expected.model &&
      latest.engineer === expected.engineer &&
      JSON.stringify(latest.serials) === JSON.stringify(expected.serials);

    appendLog({
      time: nowTime(),
      action: 'PATCH',
      result: isSynced
        ? '검증 성공: PATCH 후 GET 값이 반영되었습니다.'
        : `검증 경고: PATCH 후 GET 값 불일치 (model: ${latest.model}, hsmCount: ${latest.hsmCount})`,
    });
  };

  const verifyAfterAddHistory = async (expectedHistoryCount: number) => {
    const getResponse = await fetch(`/api/admin/customers/${draft.id}`, { cache: 'no-store' });
    const latest = (await getResponse.json().catch(() => null)) as Customer | null;

    if (!getResponse.ok || !latest) {
      appendLog({
        time: nowTime(),
        action: 'POST',
        result: `검증 실패: GET 재조회 오류 (status ${getResponse.status})`,
      });
      return;
    }

    appendLog({
      time: nowTime(),
      action: 'POST',
      result:
        latest.histories.length >= expectedHistoryCount
          ? '검증 성공: 기록 추가 후 GET 히스토리가 증가했습니다.'
          : '검증 경고: 기록 추가 후 GET 히스토리 증가가 확인되지 않습니다.',
    });
  };

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
        appendLog({ time: nowTime(), action: 'PATCH', result: `PATCH 실패 (status ${response.status})` });
        return;
      }

      const updatedCustomer = payload as Customer;
      setDraft(updatedCustomer);
      setStatus('변경사항이 저장되었습니다.');
      setEditMode(false);
      await verifyAfterPatch(updatedCustomer);
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
        body: JSON.stringify({ title: newHistoryTitle, note: newHistoryNote }),
      });

      const payload = (await response.json().catch(() => null)) as { message?: string } | Customer | null;
      if (!response.ok) {
        setStatus(payload && 'message' in payload && payload.message ? payload.message : '기록 추가에 실패했습니다.');
        appendLog({ time: nowTime(), action: 'POST', result: `POST 실패 (status ${response.status})` });
        return;
      }

      const updatedCustomer = payload as Customer;
      setDraft(updatedCustomer);
      setNewHistoryTitle('');
      setNewHistoryNote('');
      setStatus('새 기록이 추가되었습니다.');
      await verifyAfterAddHistory(updatedCustomer.histories.length);
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

      <Card>
        <CardHeader>
          <CardTitle>임시 반영 검증 로그</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          {verificationLogs.length === 0 && <p>아직 검증 로그가 없습니다.</p>}
          {verificationLogs.map((log, index) => (
            <p key={`${log.time}-${log.action}-${index}`}>
              [{log.time}] {log.action} - {log.result}
            </p>
          ))}
        </CardContent>
      </Card>

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
            <Button onClick={addHistory} disabled={loading}>
              새 기록 추가
            </Button>
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
