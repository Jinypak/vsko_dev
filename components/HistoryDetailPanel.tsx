"use client";

import { useState } from "react";
import { HistoryDetail, CheckItem } from "@/types/client";
import { FILE_ICON } from "@/lib/utils";

interface HistoryDetailPanelProps {
  detail: HistoryDetail;
  onClose: () => void;
}

export default function HistoryDetailPanel({
  detail,
  onClose,
}: HistoryDetailPanelProps) {
  const [checks, setChecks] = useState<CheckItem[]>(detail.checkItems);
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState({
    summary: detail.summary,
    requestedAt: detail.requestedAt,
    dueDate: detail.dueDate,
    members: detail.members,
    budget: detail.budget,
    checks: detail.checkItems.map((c) => ({ ...c })),
  });

  const [saved, setSaved] = useState({
    summary: detail.summary,
    requestedAt: detail.requestedAt,
    dueDate: detail.dueDate,
    members: detail.members,
    budget: detail.budget,
  });

  const handleEdit = () => {
    setDraft({
      summary: saved.summary,
      requestedAt: saved.requestedAt,
      dueDate: saved.dueDate,
      members: saved.members,
      budget: saved.budget,
      checks: checks.map((c) => ({ ...c })),
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    setSaved({
      summary: draft.summary,
      requestedAt: draft.requestedAt,
      dueDate: draft.dueDate,
      members: draft.members,
      budget: draft.budget,
    });
    setChecks(draft.checks);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const toggleCheck = (id: string) => {
    if (isEditing) {
      setDraft((prev) => ({
        ...prev,
        checks: prev.checks.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
      }));
    } else {
      setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
    }
  };

  const infoFields: { k: string; field: keyof typeof draft }[] = [
    { k: "요청일", field: "requestedAt" },
    { k: "예상 완료", field: "dueDate" },
    { k: "투입 인원", field: "members" },
    { k: "예산", field: "budget" },
  ];

  const displayChecks = isEditing ? draft.checks : checks;

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-4">
      {/* summary */}
      {isEditing ? (
        <textarea
          value={draft.summary}
          onChange={(e) => setDraft((prev) => ({ ...prev, summary: e.target.value }))}
          rows={2}
          className="w-full text-[12px] text-gray-700 border border-gray-300 rounded-md px-2 py-1.5 mb-4 resize-none focus:outline-none focus:border-gray-400 bg-white"
        />
      ) : (
        <p className="text-[12px] text-gray-500 mb-4">{saved.summary}</p>
      )}

      <div className="grid grid-cols-3 gap-6 mb-4">
        {/* 상세 정보 */}
        <div>
          <p className="text-[10px] font-medium text-gray-400 mb-2">상세 정보</p>
          <div className="flex flex-col gap-1.5">
            {infoFields.map(({ k, field }) => (
              <div key={k}>
                <span className="text-[11px] text-gray-400 block">{k}</span>
                {isEditing ? (
                  <input
                    value={draft[field] as string}
                    onChange={(e) =>
                      setDraft((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="w-full text-[12px] text-gray-700 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-gray-400 bg-white"
                  />
                ) : (
                  <span className="text-[12px] text-gray-700">{saved[field]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 체크 항목 */}
        <div>
          <p className="text-[10px] font-medium text-gray-400 mb-2">체크 항목</p>
          <div className="flex flex-col gap-2">
            {displayChecks.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheck(item.id)}
                  className="rounded border-gray-300 text-blue-500 cursor-pointer flex-shrink-0"
                />
                {isEditing ? (
                  <input
                    value={item.label}
                    onChange={(e) =>
                      setDraft((prev) => ({
                        ...prev,
                        checks: prev.checks.map((c) =>
                          c.id === item.id ? { ...c, label: e.target.value } : c
                        ),
                      }))
                    }
                    className="flex-1 text-[12px] text-gray-700 border border-gray-300 rounded px-1.5 py-0.5 focus:outline-none focus:border-gray-400 bg-white"
                  />
                ) : (
                  <span
                    className={`text-[12px] ${
                      item.done ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 첨부 파일 */}
        <div>
          <p className="text-[10px] font-medium text-gray-400 mb-2">첨부 파일</p>
          <div className="flex flex-col gap-1.5">
            {detail.files.map((file) => (
              <button
                key={file.id}
                className="flex items-center gap-1.5 text-[11px] text-gray-500 border border-gray-200 rounded-md px-2 py-1 hover:bg-white hover:border-gray-300 transition-colors text-left"
              >
                <span>{FILE_ICON[file.type] ?? "📁"}</span>
                <span>{file.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-1.5">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="text-[11px] px-2.5 py-1 border border-gray-800 rounded-md bg-gray-900 text-white transition-colors"
              >
                저장
              </button>
              <button
                onClick={handleCancel}
                className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-white hover:border-gray-300 transition-colors"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-500 hover:bg-white hover:border-gray-300 transition-colors"
              >
                편집
              </button>
              {["댓글 달기", "복제"].map((label) => (
                <button
                  key={label}
                  className="text-[11px] px-2.5 py-1 border border-gray-100 rounded-md text-gray-300 cursor-not-allowed"
                  disabled
                >
                  {label}
                </button>
              ))}
            </>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-[11px] px-2.5 py-1 border border-gray-200 rounded-md text-gray-400 hover:bg-white transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
