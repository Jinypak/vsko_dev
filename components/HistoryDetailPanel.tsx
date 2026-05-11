"use client";

import { useState } from "react";
import { HistoryDetail, HistoryClassification } from "@/types/client";
import { upsertHistoryDetail } from "@/lib/actions/clients";

const CLASSIFICATIONS: HistoryClassification[] = ["점검", "기술지원", "장애"];
const INPUT = "w-full text-[12px] px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 bg-white";
const CLS_STYLE: Record<HistoryClassification, string> = {
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
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="grid grid-cols-3 gap-6 mb-4">

        {/* 메타 정보 */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 mb-1">작성자</p>
            {isEditing ? (
              <input value={draft.author} onChange={(e) => setDraft((p) => ({ ...p, author: e.target.value }))} className={INPUT} />
            ) : (
              <p className="text-[12px] text-gray-800">{saved.author || "—"}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-gray-400 mb-1">일자</p>
            {isEditing ? (
              <input value={draft.date} onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))} placeholder="2026.01.01" className={INPUT} />
            ) : (
              <p className="text-[12px] text-gray-800">{saved.date || "—"}</p>
            )}
          </div>
          <div>
            <p className="text-[10px] text-gray-400 mb-1">분류</p>
            {isEditing ? (
              <select value={draft.classification} onChange={(e) => setDraft((p) => ({ ...p, classification: e.target.value as HistoryClassification }))} className={INPUT}>
                {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
              </select>
            ) : (
              <span className={`text-[11px] border rounded-full px-2 py-0.5 ${CLS_STYLE[saved.classification]}`}>
                {saved.classification}
              </span>
            )}
          </div>
        </div>

        {/* 상세 내용 */}
        <div className="col-span-2">
          <p className="text-[10px] text-gray-400 mb-1">상세 내용</p>
          {isEditing ? (
            <textarea
              value={draft.content}
              onChange={(e) => setDraft((p) => ({ ...p, content: e.target.value }))}
              rows={6}
              placeholder="작업 상세 내용을 입력하세요."
              className={`${INPUT} resize-none`}
            />
          ) : (
            <p className="text-[12px] text-gray-700 whitespace-pre-wrap leading-relaxed">
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
              <button onClick={handleSave} disabled={saving} className="text-[11px] px-2.5 py-1 bg-gray-900 text-white border border-gray-800 rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                {saving ? "저장 중..." : "저장"}
              </button>
              <button onClick={handleCancel} className="text-[11px] px-2.5 py-1 border border-gray-200 text-gray-500 rounded-md hover:bg-white transition-colors">
                취소
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="text-[11px] px-2.5 py-1 border border-gray-200 text-gray-500 rounded-md hover:bg-white hover:border-gray-300 transition-colors">
              편집
            </button>
          )}
        </div>
        <button onClick={onClose} className="text-[11px] px-2.5 py-1 border border-gray-200 text-gray-400 rounded-md hover:bg-white transition-colors">
          닫기
        </button>
      </div>
    </div>
  );
}
