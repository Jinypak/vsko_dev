"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Product, MaintenanceStatus, ProductCategory } from "@/types/client";
import SectionHeader from "@/components/ui/SectionHeader";
import { addProduct, updateProduct, deleteProduct } from "@/lib/actions/clients";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORIES: ProductCategory[] = ["Luna", "PSE", "Backup"];
const MAINT_STATUSES: MaintenanceStatus[] = ["진행중", "완료", "중단", "해당없음"];

const MAINT_BADGE: Record<MaintenanceStatus, string> = {
  진행중:   "border-blue-300 text-blue-600 bg-blue-50",
  완료:     "border-green-300 text-green-600 bg-green-50",
  중단:     "border-red-300 text-red-400 bg-red-50",
  해당없음: "border-gray-200 text-gray-400 bg-gray-50",
};

const CAT_BADGE: Record<ProductCategory, string> = {
  Luna:   "border-purple-300 text-purple-600 bg-purple-50",
  PSE:    "border-blue-300 text-blue-600 bg-blue-50",
  Backup: "border-amber-300 text-amber-600 bg-amber-50",
};

const BLANK: Omit<Product, "id"> = {
  sortOrder: 0, name: "", category: "Luna", model: "", purpose: "",
  serialNumber: "", firmware: "", clientOs: "", clientCount: "",
  maintenanceStart: "", maintenanceEnd: "", maintenanceStatus: "해당없음",
};

const TH = "text-left text-[10px] text-muted-foreground font-medium px-2 py-2 whitespace-nowrap";
const TD = "px-2 py-2 text-xs";
const CELL_INPUT = "w-full text-xs px-1.5 py-0.5 border border-input rounded focus:outline-none focus-visible:border-ring bg-background";

interface ProductTableProps { products: Product[]; clientId: string }

export default function ProductTable({ products, clientId }: ProductTableProps) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Product, "id">>(BLANK);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<Product, "id">>(BLANK);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setEditForm({ sortOrder: p.sortOrder, name: p.name, category: p.category, model: p.model, purpose: p.purpose, serialNumber: p.serialNumber, firmware: p.firmware, clientOs: p.clientOs, clientCount: p.clientCount, maintenanceStart: p.maintenanceStart, maintenanceEnd: p.maintenanceEnd, maintenanceStatus: p.maintenanceStatus });
  };

  const handleSaveEdit = async () => {
    if (editId === null) return;
    setSaving(true);
    await updateProduct(editId, editForm);
    setEditId(null);
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    setSaving(true);
    await deleteProduct(id);
    setConfirmDeleteId(null);
    setSaving(false);
  };

  const handleAdd = async () => {
    if (!newForm.name.trim()) return;
    setSaving(true);
    await addProduct(clientId, newForm);
    setIsAdding(false);
    setNewForm(BLANK);
    setSaving(false);
  };

  const ef = editForm;
  const setEf = (k: keyof typeof BLANK, v: unknown) => setEditForm((p) => ({ ...p, [k]: v }));
  const nf = newForm;
  const setNf = (k: keyof typeof BLANK, v: unknown) => setNewForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="mb-8">
      <SectionHeader num="01" title="제품 상세" sub="· 납품 제품 목록" />

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-xs min-w-[900px]">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className={`${TH} w-10`}>#</th>
              <th className={TH}>제품명</th>
              <th className={`${TH} w-20`}>구분</th>
              <th className={TH}>모델</th>
              <th className={TH}>용도</th>
              <th className={TH}>S/N</th>
              <th className={TH}>Firmware</th>
              <th className={TH}>Client OS</th>
              <th className={`${TH} w-20`}>Client 수</th>
              <th className={TH}>유지보수 기간</th>
              <th className={`${TH} w-20`}>유지보수</th>
              <th className="w-24" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const isEditing = editId === p.id;
              const isConfirm = confirmDeleteId === p.id;
              return (
                <tr key={p.id} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors group">
                  <td className={`${TD} text-muted-foreground`}>{p.sortOrder || p.id}</td>

                  {isEditing ? (
                    <>
                      <td className={TD}><input value={ef.name} onChange={(e) => setEf("name", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}>
                        <select value={ef.category} onChange={(e) => setEf("category", e.target.value)} className={CELL_INPUT}>
                          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className={TD}><input value={ef.model} onChange={(e) => setEf("model", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}><input value={ef.purpose} onChange={(e) => setEf("purpose", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}><input value={ef.serialNumber} onChange={(e) => setEf("serialNumber", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}><input value={ef.firmware} onChange={(e) => setEf("firmware", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}><input value={ef.clientOs} onChange={(e) => setEf("clientOs", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}><input value={ef.clientCount} onChange={(e) => setEf("clientCount", e.target.value)} className={CELL_INPUT} /></td>
                      <td className={TD}>
                        <div className="flex gap-1">
                          <input value={ef.maintenanceStart} onChange={(e) => setEf("maintenanceStart", e.target.value)} placeholder="시작" className={CELL_INPUT} />
                          <input value={ef.maintenanceEnd} onChange={(e) => setEf("maintenanceEnd", e.target.value)} placeholder="종료" className={CELL_INPUT} />
                        </div>
                      </td>
                      <td className={TD}>
                        <select value={ef.maintenanceStatus} onChange={(e) => setEf("maintenanceStatus", e.target.value)} className={CELL_INPUT}>
                          {MAINT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className={TD}>
                        <div className="flex gap-1">
                          <Button size="sm" className="h-6 text-[11px] px-2" onClick={handleSaveEdit} disabled={saving}>저장</Button>
                          <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => setEditId(null)}>취소</Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={`${TD} text-foreground`}>{p.name}</td>
                      <td className={TD}>
                        <Badge variant="outline" className={`text-[10px] ${CAT_BADGE[p.category]}`}>{p.category}</Badge>
                      </td>
                      <td className={`${TD} text-muted-foreground`}>{p.model}</td>
                      <td className={`${TD} text-muted-foreground`}>{p.purpose}</td>
                      <td className={`${TD} text-muted-foreground font-mono`}>{p.serialNumber}</td>
                      <td className={`${TD} text-muted-foreground`}>{p.firmware}</td>
                      <td className={`${TD} text-muted-foreground`}>{p.clientOs}</td>
                      <td className={`${TD} text-foreground`}>{p.clientCount}</td>
                      <td className={`${TD} text-muted-foreground`}>
                        {p.maintenanceStart && p.maintenanceEnd ? `${p.maintenanceStart} ~ ${p.maintenanceEnd}` : p.maintenanceStart || "—"}
                      </td>
                      <td className={TD}>
                        <Badge variant="outline" className={`text-[10px] ${MAINT_BADGE[p.maintenanceStatus]}`}>
                          {p.maintenanceStatus}
                        </Badge>
                      </td>
                      <td className={TD}>
                        {isConfirm ? (
                          <div className="flex gap-1 items-center">
                            <Button size="sm" variant="destructive" className="h-6 text-[11px] px-2" onClick={() => handleDelete(p.id)} disabled={saving}>확인</Button>
                            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => setConfirmDeleteId(null)}>취소</Button>
                          </div>
                        ) : (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => startEdit(p)}>편집</Button>
                            <Button size="sm" variant="outline" className="h-6 text-[11px] px-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive" onClick={() => setConfirmDeleteId(p.id)}>삭제</Button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}

            {isAdding && (
              <tr className="border-b last:border-b-0 bg-muted/30">
                <td className={`${TD} text-muted-foreground`}>—</td>
                <td className={TD}><input autoFocus placeholder="제품명" value={nf.name} onChange={(e) => setNf("name", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}>
                  <select value={nf.category} onChange={(e) => setNf("category", e.target.value)} className={CELL_INPUT}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td className={TD}><input placeholder="모델" value={nf.model} onChange={(e) => setNf("model", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}><input placeholder="용도" value={nf.purpose} onChange={(e) => setNf("purpose", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}><input placeholder="S/N" value={nf.serialNumber} onChange={(e) => setNf("serialNumber", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}><input placeholder="Firmware" value={nf.firmware} onChange={(e) => setNf("firmware", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}><input placeholder="Client OS" value={nf.clientOs} onChange={(e) => setNf("clientOs", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}><input placeholder="수량" value={nf.clientCount} onChange={(e) => setNf("clientCount", e.target.value)} className={CELL_INPUT} /></td>
                <td className={TD}>
                  <div className="flex gap-1">
                    <input placeholder="시작" value={nf.maintenanceStart} onChange={(e) => setNf("maintenanceStart", e.target.value)} className={CELL_INPUT} />
                    <input placeholder="종료" value={nf.maintenanceEnd} onChange={(e) => setNf("maintenanceEnd", e.target.value)} className={CELL_INPUT} />
                  </div>
                </td>
                <td className={TD}>
                  <select value={nf.maintenanceStatus} onChange={(e) => setNf("maintenanceStatus", e.target.value)} className={CELL_INPUT}>
                    {MAINT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className={TD}>
                  <div className="flex gap-1">
                    <Button size="sm" className="h-6 text-[11px] px-2" onClick={handleAdd} disabled={saving || !nf.name.trim()}>추가</Button>
                    <Button size="sm" variant="outline" className="h-6 text-[11px] px-2" onClick={() => { setIsAdding(false); setNewForm(BLANK); }}>취소</Button>
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
          제품 추가
        </Button>
      )}
    </div>
  );
}
