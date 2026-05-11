"use client";

import { useState } from "react";
import { Product, MaintenanceStatus, ProductCategory } from "@/types/client";
import SectionHeader from "@/components/ui/SectionHeader";
import { addProduct, updateProduct, deleteProduct } from "@/lib/actions/clients";

const CATEGORIES: ProductCategory[] = ["Luna", "PSE", "Backup"];
const MAINT_STATUSES: MaintenanceStatus[] = ["진행중", "완료", "중단", "해당없음"];

const MAINT_STYLE: Record<MaintenanceStatus, string> = {
  진행중:  "border-blue-300 text-blue-600 bg-blue-50",
  완료:    "border-green-300 text-green-600 bg-green-50",
  중단:    "border-red-300 text-red-400 bg-red-50",
  해당없음: "border-gray-200 text-gray-400",
};

const CAT_STYLE: Record<ProductCategory, string> = {
  Luna:   "border-purple-300 text-purple-600 bg-purple-50",
  PSE:    "border-blue-300 text-blue-600 bg-blue-50",
  Backup: "border-amber-300 text-amber-600 bg-amber-50",
};

const BLANK: Omit<Product, "id"> = {
  sortOrder: 0, name: "", category: "Luna", model: "", purpose: "",
  serialNumber: "", firmware: "", clientOs: "", clientCount: "",
  maintenanceStart: "", maintenanceEnd: "", maintenanceStatus: "해당없음",
};

const TH = "text-left text-[10px] text-gray-400 font-medium px-2 py-2 whitespace-nowrap";
const TD = "px-2 py-2 text-[12px]";
const INPUT = "w-full text-[12px] px-1.5 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-gray-500 bg-white";

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

      <div className="overflow-x-auto">
        <table className="w-full text-[12px] min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200">
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
                <tr key={p.id} className="border-b border-gray-100 group">
                  <td className={`${TD} text-gray-300`}>{p.sortOrder || p.id}</td>

                  {isEditing ? (
                    <>
                      <td className={TD}><input value={ef.name} onChange={(e) => setEf("name", e.target.value)} className={INPUT} /></td>
                      <td className={TD}>
                        <select value={ef.category} onChange={(e) => setEf("category", e.target.value)} className={INPUT}>
                          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </td>
                      <td className={TD}><input value={ef.model} onChange={(e) => setEf("model", e.target.value)} className={INPUT} /></td>
                      <td className={TD}><input value={ef.purpose} onChange={(e) => setEf("purpose", e.target.value)} className={INPUT} /></td>
                      <td className={TD}><input value={ef.serialNumber} onChange={(e) => setEf("serialNumber", e.target.value)} className={INPUT} /></td>
                      <td className={TD}><input value={ef.firmware} onChange={(e) => setEf("firmware", e.target.value)} className={INPUT} /></td>
                      <td className={TD}><input value={ef.clientOs} onChange={(e) => setEf("clientOs", e.target.value)} className={INPUT} /></td>
                      <td className={TD}><input value={ef.clientCount} onChange={(e) => setEf("clientCount", e.target.value)} className={INPUT} /></td>
                      <td className={TD}>
                        <div className="flex gap-1">
                          <input value={ef.maintenanceStart} onChange={(e) => setEf("maintenanceStart", e.target.value)} placeholder="시작" className={INPUT} />
                          <input value={ef.maintenanceEnd} onChange={(e) => setEf("maintenanceEnd", e.target.value)} placeholder="종료" className={INPUT} />
                        </div>
                      </td>
                      <td className={TD}>
                        <select value={ef.maintenanceStatus} onChange={(e) => setEf("maintenanceStatus", e.target.value)} className={INPUT}>
                          {MAINT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className={TD}>
                        <div className="flex gap-1">
                          <button onClick={handleSaveEdit} disabled={saving} className="text-[11px] px-2 py-0.5 bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50">저장</button>
                          <button onClick={() => setEditId(null)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded hover:bg-gray-50">취소</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className={`${TD} text-gray-800`}>{p.name}</td>
                      <td className={TD}>
                        <span className={`text-[10px] border rounded-full px-2 py-0.5 ${CAT_STYLE[p.category]}`}>{p.category}</span>
                      </td>
                      <td className={`${TD} text-gray-600`}>{p.model}</td>
                      <td className={`${TD} text-gray-500`}>{p.purpose}</td>
                      <td className={`${TD} text-gray-500 font-mono`}>{p.serialNumber}</td>
                      <td className={`${TD} text-gray-500`}>{p.firmware}</td>
                      <td className={`${TD} text-gray-500`}>{p.clientOs}</td>
                      <td className={`${TD} text-gray-600`}>{p.clientCount}</td>
                      <td className={`${TD} text-gray-400`}>
                        {p.maintenanceStart && p.maintenanceEnd ? `${p.maintenanceStart} ~ ${p.maintenanceEnd}` : p.maintenanceStart || "—"}
                      </td>
                      <td className={TD}>
                        <span className={`text-[10px] border rounded-full px-2 py-0.5 ${MAINT_STYLE[p.maintenanceStatus]}`}>
                          {p.maintenanceStatus}
                        </span>
                      </td>
                      <td className={TD}>
                        {isConfirm ? (
                          <div className="flex gap-1 items-center">
                            <button onClick={() => handleDelete(p.id)} disabled={saving} className="text-[11px] px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50">확인</button>
                            <button onClick={() => setConfirmDeleteId(null)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded">취소</button>
                          </div>
                        ) : (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(p)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded hover:border-gray-400 hover:text-gray-600">편집</button>
                            <button onClick={() => setConfirmDeleteId(p.id)} className="text-[11px] px-2 py-0.5 border border-red-100 text-red-300 rounded hover:border-red-300 hover:text-red-500">삭제</button>
                          </div>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}

            {isAdding && (
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className={`${TD} text-gray-300`}>—</td>
                <td className={TD}><input autoFocus placeholder="제품명" value={nf.name} onChange={(e) => setNf("name", e.target.value)} className={INPUT} /></td>
                <td className={TD}>
                  <select value={nf.category} onChange={(e) => setNf("category", e.target.value)} className={INPUT}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </td>
                <td className={TD}><input placeholder="모델" value={nf.model} onChange={(e) => setNf("model", e.target.value)} className={INPUT} /></td>
                <td className={TD}><input placeholder="용도" value={nf.purpose} onChange={(e) => setNf("purpose", e.target.value)} className={INPUT} /></td>
                <td className={TD}><input placeholder="S/N" value={nf.serialNumber} onChange={(e) => setNf("serialNumber", e.target.value)} className={INPUT} /></td>
                <td className={TD}><input placeholder="Firmware" value={nf.firmware} onChange={(e) => setNf("firmware", e.target.value)} className={INPUT} /></td>
                <td className={TD}><input placeholder="Client OS" value={nf.clientOs} onChange={(e) => setNf("clientOs", e.target.value)} className={INPUT} /></td>
                <td className={TD}><input placeholder="수량" value={nf.clientCount} onChange={(e) => setNf("clientCount", e.target.value)} className={INPUT} /></td>
                <td className={TD}>
                  <div className="flex gap-1">
                    <input placeholder="시작" value={nf.maintenanceStart} onChange={(e) => setNf("maintenanceStart", e.target.value)} className={INPUT} />
                    <input placeholder="종료" value={nf.maintenanceEnd} onChange={(e) => setNf("maintenanceEnd", e.target.value)} className={INPUT} />
                  </div>
                </td>
                <td className={TD}>
                  <select value={nf.maintenanceStatus} onChange={(e) => setNf("maintenanceStatus", e.target.value)} className={INPUT}>
                    {MAINT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className={TD}>
                  <div className="flex gap-1">
                    <button onClick={handleAdd} disabled={saving || !nf.name.trim()} className="text-[11px] px-2 py-0.5 bg-gray-900 text-white rounded hover:bg-gray-700 disabled:opacity-50">추가</button>
                    <button onClick={() => { setIsAdding(false); setNewForm(BLANK); }} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded hover:bg-gray-50">취소</button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!isAdding && (
        <button onClick={() => setIsAdding(true)} className="mt-2 text-[12px] text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2.5 py-1 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          제품 추가
        </button>
      )}
    </div>
  );
}
