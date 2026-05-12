"use client";

import { useState } from "react";
import { HistoryDetail, HistoryClassification } from "@/types/client";
import { upsertHistoryDetail } from "@/lib/actions/clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CLASSIFICATIONS: HistoryClassification[] = ["점검", "기술지원", "장애"];

const CELL_INPUT = "w-full text-xs px-2 py-1.5 border border-input rounded-md focus:outline-none focus-visible:border-ring bg-background";

const CLS_BADGE: Record<HistoryClassification, string> = {
  점검:    "border-blue-300 text-blue-600 bg-blue-50",
  기술지원: "border-green-300 text-green-600 bg-green-50",
  장애:    "border-red-300 text-red-500 bg-red-50",
};

interface Props {
  detail: HistoryDetail;
  historyItemId: string;
  onClose: () => void;
}

export default function HistoryDetailPanel({ detail, historyItemId, onClose }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [saved, setSaved] = useState({
    author: detail.author,
    date: detail.date,
    classification: detail.classification,
    content: detail.content,
  });
  const [draft, setDraft] = useState({ ...saved });

  const handleSave = async () => {
    setSaving(true);
    await upsertHistoryDetail(historyItemId, draft);
    setSaved({ ...draft });
    setSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft({ ...saved });
    setIsEditing(false);
  };

  return (
    <div className="bg-muted/30 border-b px-6 py-4">
      <div className="grid grid-cols-3 gap-6 mb-4">
        {/* 메타 정보 */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">작성자</p>
            {isEditing ? (
              <input value={draft.author} onChange={(e) => setDraft((p) => ({ ...p, author: e.target.value }))} className={CELL_INPUT} />
            ) : (
              <p className="text-xs text-foreground">{saved.author || "—"}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">일자</p>
            {isEditing ? (
              <input value={draft.date} onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))} placeholder="2026.01.01" className={CELL_INPUT} />
            ) : (
              <p className="text-xs text-foreground">{saved.date || "—"}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1">분류</p>
            {isEditing ? (
              <select value={draft.classification} onChange={(e) => setDraft((p) => ({ ...p, classification: e.target.value as HistoryClassification }))} className={CELL_INPUT}>
                {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            ) : (
              <Badge variant="outline" className={`text-[10px] ${CLS_BADGE[saved.classification]}`}>
                {saved.classification}
              </Badge>
            )}
          </div>
        </div>

        {/* 상세 내용 */}
        <div className="col-span-2">
          <p className="text-[10px] text-muted-foreground mb-1">상세 내용</p>
          {isEditing ? (
            <textarea
              value={draft.content}
              onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))}
              rows={6}
              placeholder="작업 상세 내용을 입력하세요."
              className={`${CELL_INPUT} resize-none`}
            />
          ) : (
            <p className="text-xs text-foreground whitespace-pre-wrap leading-relaxed">
              {saved.content || "—"}
            </p>
          )}
        </div>
      </div>

      {/* 액션 */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1.5">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "저장 중..." : "저장"}
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>취소</Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>편집</Button>
          )}
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>닫기</Button>
      </div>
    </div>
  );
}
