"use client";

import { useState } from "react";
import { Product } from "@/types/client";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatPrice } from "@/lib/utils";
import { addProduct, updateProduct, deleteProduct } from "@/lib/actions/clients";

const STATUSES: Product["status"][] = ["진행중", "완료", "대기", "수정요청", "계획중"];
const CATEGORIES: Product["category"][] = ["서비스", "구독", "인쇄", "출력", "기타"];
const BLANK_FORM = { name: "", category: "서비스" as const, unitPrice: 0, quantity: 1, status: "진행중" as const };

const INPUT = "w-full text-[12px] px-1.5 py-0.5 border border-gray-300 rounded focus:outline-none focus:border-gray-500 bg-white";
const SELECT = `${INPUT} cursor-pointer`;

interface ProductTableProps {
  products: Product[];
  clientId: string;
}

export default function ProductTable({ products, clientId }: ProductTableProps) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Product, "id">>(BLANK_FORM);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<Omit<Product, "id">>(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const startEdit = (p: Product) => {
    setEditId(p.id);
    setEditForm({ name: p.name, category: p.category, unitPrice: p.unitPrice, quantity: p.quantity, status: p.status });
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
    setNewForm(BLANK_FORM);
    setSaving(false);
  };

  return (
    <div className="mb-8">
      <SectionHeader num="01" title="제품 상세" sub="· 계약 중인 제품" />

      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-8">#</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2">제품명</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">구분</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-32">단가</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-16">수량</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">상태</th>
            <th className="w-28" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isEditing = editId === product.id;
            const isConfirmDelete = confirmDeleteId === product.id;

            return (
              <tr key={product.id} className="border-b border-gray-100 group">
                <td className="px-2.5 py-2 text-gray-300 text-[11px]">{product.id}</td>

                {isEditing ? (
                  <>
                    <td className="px-2.5 py-2">
                      <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className={INPUT} />
                    </td>
                    <td className="px-2.5 py-2">
                      <select value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value as Product["category"] }))} className={SELECT}>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </td>
                    <td className="px-2.5 py-2">
                      <input type="number" value={editForm.unitPrice} onChange={(e) => setEditForm((p) => ({ ...p, unitPrice: Number(e.target.value) }))} className={INPUT} />
                    </td>
                    <td className="px-2.5 py-2">
                      <input type="number" value={editForm.quantity} onChange={(e) => setEditForm((p) => ({ ...p, quantity: Number(e.target.value) }))} className={INPUT} />
                    </td>
                    <td className="px-2.5 py-2">
                      <select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value as Product["status"] }))} className={SELECT}>
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
                    <td className="px-2.5 py-2.5 text-gray-800">{product.name}</td>
                    <td className="px-2.5 py-2.5 text-gray-500">{product.category}</td>
                    <td className="px-2.5 py-2.5 text-gray-800">{formatPrice(product.unitPrice)}</td>
                    <td className="px-2.5 py-2.5 text-gray-600">{product.quantity.toLocaleString()}</td>
                    <td className="px-2.5 py-2.5"><StatusBadge status={product.status} /></td>
                    <td className="px-2.5 py-2.5 text-right">
                      {isConfirmDelete ? (
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-[11px] text-gray-400">삭제할까요?</span>
                          <button onClick={() => handleDelete(product.id)} disabled={saving} className="text-[11px] px-2 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors">
                            확인
                          </button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50 transition-colors">
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEdit(product)} className="text-[11px] px-2 py-0.5 border border-gray-200 text-gray-400 rounded-md hover:border-gray-400 hover:text-gray-600 transition-colors">
                            편집
                          </button>
                          <button onClick={() => setConfirmDeleteId(product.id)} className="text-[11px] px-2 py-0.5 border border-red-100 text-red-300 rounded-md hover:border-red-300 hover:text-red-500 transition-colors">
                            삭제
                          </button>
                        </div>
                      )}
                    </td>
                  </>
                )}
              </tr>
            );
          })}

          {/* 새 제품 추가 행 */}
          {isAdding && (
            <tr className="border-b border-gray-100 bg-gray-50">
              <td className="px-2.5 py-2 text-gray-300 text-[11px]">—</td>
              <td className="px-2.5 py-2">
                <input autoFocus placeholder="제품명" value={newForm.name} onChange={(e) => setNewForm((p) => ({ ...p, name: e.target.value }))} className={INPUT} />
              </td>
              <td className="px-2.5 py-2">
                <select value={newForm.category} onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value as Product["category"] }))} className={SELECT}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </td>
              <td className="px-2.5 py-2">
                <input type="number" placeholder="0" value={newForm.unitPrice || ""} onChange={(e) => setNewForm((p) => ({ ...p, unitPrice: Number(e.target.value) }))} className={INPUT} />
              </td>
              <td className="px-2.5 py-2">
                <input type="number" placeholder="1" value={newForm.quantity || ""} onChange={(e) => setNewForm((p) => ({ ...p, quantity: Number(e.target.value) }))} className={INPUT} />
              </td>
              <td className="px-2.5 py-2">
                <select value={newForm.status} onChange={(e) => setNewForm((p) => ({ ...p, status: e.target.value as Product["status"] }))} className={SELECT}>
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
          제품 추가
        </button>
      )}
    </div>
  );
}
