"use client";

import { Fragment, useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { HistoryItem, HistoryClassification } from "@/types/client";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import HistoryDetailPanel from "@/components/HistoryDetailPanel";
import { addHistoryItem, updateHistoryItem, deleteHistoryItem } from "@/lib/actions/clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUSES: HistoryItem["status"][] = ["진행중", "완료", "대기", "수정요청", "계획중"];
const CLASSIFICATIONS: HistoryClassification[] = ["점검", "기술지원", "장애"];

const CLS_BADGE: Record<HistoryClassification, string> = {
  점검:    "border-blue-300 text-blue-600 bg-blue-50",
  기술지원: "border-green-300 text-green-600 bg-green-50",
  장애:    "border-red-300 text-red-500 bg-red-50",
};

type HistoryForm = { date: string; name: string; engineer: string; classification: HistoryClassification; status: HistoryItem["status"] };
const BLANK_FORM: HistoryForm = { date: "", name: "", engineer: "", classification: "점검", status: "진행중" };

const CELL_INPUT = "w-full text-xs px-1.5 py-0.5 border border-input rounded focus:outline-none focus-visible:border-ring bg-background";

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

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2 w-24">일자</th>
              <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2">작업명</th>
              <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2 w-20">담당</th>
              <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2 w-20">분류</th>
              <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2 w-24">상태</th>
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
                  <tr className="border-b last:border-b-0 hover:bg-muted/30 transition-colors group">
                    {isEditing ? (
                      <>
                        <td className="px-3 py-2">
                          <input value={editForm.date} onChange={(e) => setEditForm((p) => ({ ...p, date: e.target.value }))} placeholder="2026.01.01" className={CELL_INPUT} />
                        </td>
                        <td className="px-3 py-2">
                          <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={CELL_INPUT} />
                        </td>
                        <td className="px-3 py-2">
                          <input value={editForm.engineer} onChange={(e) => setEditForm((p) => ({ ...p, engineer: e.target.value }))} className={CELL_INPUT} />
                        </td>
                        <td className="px-3 py-2">
                          <select value={editForm.classification} onChange={(e) => setEditForm((p) => ({ ...p, classification: e.target.value as HistoryClassification }))} className={CELL_INPUT}>
                            {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as HistoryItem["status"] }))} className={CELL_INPUT}>
                            {STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button size="sm" className="h-6 text-[11px] px-2" onClick={handleSaveEdit} disabled={saving}>저장</Button>
                            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => setEditId(null)}>취소</Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2.5 text-muted-foreground">{item.date}</td>
                        <td className="px-3 py-2.5 text-foreground font-medium">{item.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{item.engineer}</td>
                        <td className="px-3 py-2.5">
                          <Badge variant="outline" className={`text-[10px] ${CLS_BADGE[item.classification]}`}>
                            {item.classification}
                          </Badge>
                        </td>
                        <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
                        <td className="px-3 py-2.5">
                          {isConfirmDelete ? (
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-[11px] text-muted-foreground">삭제할까요?</span>
                              <Button size="sm" variant="destructive" className="h-6 text-[11px] px-2" onClick={() => handleDelete(item.id)} disabled={saving}>확인</Button>
                              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => setConfirmDeleteId(null)}>취소</Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant={isOpen ? "default" : "outline"}
                                className="h-6 text-[11px] px-2 gap-1"
                                onClick={() => setOpenId((prev) => prev === item.id ? null : item.id)}
                              >
                                {isOpen ? "닫기" : "상세"}
                                <ChevronDown className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                              </Button>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => startEdit(item)}>편집</Button>
                                <Button size="sm" variant="outline" className="h-6 text-[11px] px-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive" onClick={() => setConfirmDeleteId(item.id)}>삭제</Button>
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
              <tr className="border-b last:border-b-0 bg-muted/30">
                <td className="px-3 py-2">
                  <input autoFocus placeholder={defaultDate} value={newForm.date} onChange={(e) => setNewForm((p) => ({ ...p, date: e.target.value }))} className={CELL_INPUT} />
                </td>
                <td className="px-3 py-2">
                  <input placeholder="작업명" value={newForm.name} onChange={(e) => setNewForm((p) => ({ ...p, name: e.target.value }))} className={CELL_INPUT} />
                </td>
                <td className="px-3 py-2">
                  <input placeholder="담당자" value={newForm.engineer} onChange={(e) => setNewForm((p) => ({ ...p, engineer: e.target.value }))} className={CELL_INPUT} />
                </td>
                <td className="px-3 py-2">
                  <select value={newForm.classification} onChange={(e) => setNewForm((p) => ({ ...p, classification: e.target.value as HistoryClassification }))} className={CELL_INPUT}>
                    {CLASSIFICATIONS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <select value={newForm.status} onChange={(e) => setNewForm((p) => ({ ...p, status: e.target.value as HistoryItem["status"] }))} className={CELL_INPUT}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-2 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button size="sm" className="h-6 text-[11px] px-2" onClick={handleAdd} disabled={saving || !newForm.name.trim()}>추가</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => { setIsAdding(false); setNewForm(BLANK_FORM); }}>취소</Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isAdding && (
        <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground hover:text-foreground" onClick={() => setIsAdding(true)}>
          <Plus className="size-3.5" />
          히스토리 추가
        </Button>
      )}
    </div>
  );
}
