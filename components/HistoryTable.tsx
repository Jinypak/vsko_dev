"use client";

import { Fragment, useState } from "react";
import { HistoryItem, HistoryClassification } from "@/types/client";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import HistoryDetailPanel from "@/components/HistoryDetailPanel";
import { addHistoryItem, updateHistoryItem, deleteHistoryItem } from "@/lib/actions/clients";

const STATUSES: HistoryItem["status"][] = ["진행중", "완료", "대기", "수정요청", "계획중"];
const CLASSIFICATIONS: HistoryClassification[] = ["점검", "기술지원", "장애"];

const CLS_STYLE: Record<HistoryClassification, string> = {
  점검:    "border-blue-300 text-blue-600 bg-blue-50",
  기술지원: "border-green-300 text-green-600 bg-green-50",
  장애:    "border-red-300 text-red-500 bg-red-50",
};

type HistoryForm = { date: string; name: string; engineer: string; classification: HistoryClassification; status: HistoryItem["status"] };
const BLANK_FORM: HistoryForm = { date: "", name: "", engineer: "", classification: "점검", status: "진행중" };

const INPUT = "w-full text-[12px] px-1.5 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-gray-500 bg-white";
const SELECT = `${INPUT} cursor-pointer`;

interface HistoryTableProps {
  history: HistoryItem[];
  clientId: string;
}

export default function HistoryTable({ history, clientId }: HistoryTableProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<HistoryForm>(BLANK_FORM);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<HistoryForm>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const startEdit = (item: HistoryItem) => {
    setOpenId(null);
    setEditId(item.id);
    setEditForm({ date: item.date, name: item.name, engineer: item.engineer, classification: item.classification, status: item.status });
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    setSaving(true);
    await updateHistoryItem(editId, editForm);
    setEditId(null);
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    setSaving(true);
    await deleteHistoryItem(id);
    setConfirmDeleteId(null);
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newForm.name.trim()) return;
    setSaving(true);
    await addHistoryItem(clientId, newForm);
    setIsAdding(false);
    setNewForm(BLANK_FORM);
    setSaving(false);
  };

  const today = new Date();
  const defaultDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div>
      <SectionHeader num="02" title="작업 히스토리" sub="· 클릭하여 상세보기" />

      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">일자</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2">작업명</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">담당</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">분류</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">상태</th>
            <th className="w-44" />
          </tr>
        </thead>
        <tbody>
          {history.map((item) => {
            const isOpen = openId === item.id;
            const isEditing = editId === item.id;
            const isConfirmDelete = confirmDeleteId === item.id;

            return (
              <Fragment key={item.id}>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                  {isEditing ? (
                    <>
                      <td className="px-2.5 py-2">
                        <input value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} placeholder="2026.01.01" className={INPUT} />
                      </td>
                      <td className="px-2.5 py-2">
                        <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={INPUT} />
                      </td>
                      <td className="px-2.5 py-2">
                        <input value={editForm.engineer} onChange={(e) => setEditForm((p) => ({ ...p, engineer: e.target.value }))} className={INPUT} />
                      </td>
                      <td className="px-2.5 py-2">
                        <select value={editForm.classification} onChange={(e) => setEditForm((p) => ({ ...p, classification: e.target.value as HistoryClassification }))} className={SELECT}>
                          {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className="px-2.5 py-2">
                        <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as HistoryItem["status"] }))} className={SELECT}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-2.5 py-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={handleSaveEdit} disabled={saving} className="text-[11px] px-2 py-0.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                            저장
                          </button>
                          <button onClick={() => setEditId(null)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50 transition-colors">
                            취소
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2.5 py-2.5 text-gray-400 text-[12px]">{item.date}</td>
                      <td className="px-2.5 py-2.5 text-gray-800">{item.name}</td>
                      <td className="px-2.5 py-2.5 text-gray-500 text-[12px]">{item.engineer}</td>
                      <td className="px-2.5 py-2.5">
                        <span className={`text-[10px] border rounded-full px-2 py-0.5 ${CLS_STYLE[item.classification]}`}>
                          {item.classification}
                        </span>
                      </td>
                      <td className="px-2.5 py-2.5"><StatusBadge status={item.status} /></td>
                      <td className="px-2.5 py-2.5">
                        {isConfirmDelete ? (
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-[11px] text-gray-400">삭제할까요?</span>
                            <button onClick={() => handleDelete(item.id)} disabled={saving} className="text-[11px] px-2 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors">
                              확인
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded-md transition-colors">
                              취소
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setOpenId((prev) => prev === item.id ? null : item.id)}
                              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 border rounded-md transition-colors ${
                                isOpen
                                  ? "border-gray-800 bg-gray-900 text-white"
                                  : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                              }`}
                            >
                              {isOpen ? "닫기" : "상세"}
                              <svg className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(item)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded-md hover:border-gray-400 hover:text-gray-600 transition-colors">
                                편집
                              </button>
                              <button onClick={() => setConfirmDeleteId(item.id)} className="text-[11px] px-2 py-0.5 border border-red-100 text-red-300 rounded-md hover:border-red-300 hover:text-red-500 transition-colors">
                                삭제
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>

                {isOpen && !isEditing && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <HistoryDetailPanel
                        detail={item.detail ?? { author: "", date: "", classification: "점검", content: "" }}
                        historyItemId={item.id}
                        onClose={() => setOpenId(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}

          {isAdding && (
            <tr className="border-b border-gray-100 bg-gray-50">
              <td className="px-2.5 py-2">
                <input autoFocus placeholder={defaultDate} value={newForm.date} onChange={(e) => setNewForm((p) => ({ ...p, date: e.target.value }))} className={INPUT} />
              </td>
              <td className="px-2.5 py-2">
                <input placeholder="작업명" value={newForm.name} onChange={(e) => setNewForm((p) => ({ ...p, name: e.target.value }))} className={INPUT} />
              </td>
              <td className="px-2.5 py-2">
                <input placeholder="담당자" value={newForm.engineer} onChange={(e) => setNewForm((p) => ({ ...p, engineer: e.target.value }))} className={INPUT} />
              </td>
              <td className="px-2.5 py-2">
                <select value={newForm.classification} onChange={(e) => setNewForm((p) => ({ ...p, classification: e.target.value as HistoryClassification }))} className={SELECT}>
                  {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </td>
              <td className="px-2.5 py-2">
                <select value={newForm.status} onChange={(e) => setNewForm((p) => ({ ...p, status: e.target.value as HistoryItem["status"] }))} className={SELECT}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
              <td className="px-2.5 py-2 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button onClick={handleAdd} disabled={saving || !newForm.name.trim()} className="text-[11px] px-2 py-0.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 transition-colors">
                    추가
                  </button>
                  <button onClick={() => { setIsAdding(false); setNewForm(BLANK_FORM); }} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50 transition-colors">
                    취소
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-2 text-[12px] text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2.5 py-1 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          히스토리 추가
        </button>
      )}
    </div>
  );
}
