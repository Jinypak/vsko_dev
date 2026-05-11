"use client";

import { useState } from "react";
import { ClientInfo } from "@/types/client";
import { useClients } from "@/lib/clients-context";

type ContractStatus = ClientInfo["contractStatus"];

interface FormData {
  companyName: string;
  companyNameEn: string;
  isVip: boolean;
  contractStatus: ContractStatus;
  ceo: string;
  businessNumber: string;
  industry: string;
  foundedAt: string;
  scale: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  memo: string;
}

const INITIAL: FormData = {
  companyName: "",
  companyNameEn: "",
  isVip: false,
  contractStatus: "계약중",
  ceo: "",
  businessNumber: "",
  industry: "",
  foundedAt: "",
  scale: "",
  manager: "",
  phone: "",
  email: "",
  address: "",
  memo: "",
};

interface AddClientDrawerProps {
  onClose: () => void;
}

export default function AddClientDrawer({ onClose }: AddClientDrawerProps) {
  const { addClient } = useClients();
  const [form, setForm] = useState<FormData>(INITIAL);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const d = new Date();
    const registeredAt = `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;

    addClient({
      id: `client-${Date.now()}`,
      ...form,
      registeredAt,
      products: [],
      history: [],
    });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-medium text-gray-900">고객사 등록</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">새 고객사 정보를 입력하세요.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors text-gray-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            {/* 기본 정보 */}
            <section>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">기본 정보</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="회사명 (국문)" required>
                    <input
                      name="companyName" required
                      value={form.companyName} onChange={handleChange}
                      placeholder="(주) 회사명"
                      className={INPUT}
                    />
                  </Field>
                  <Field label="회사명 (영문)">
                    <input
                      name="companyNameEn"
                      value={form.companyNameEn} onChange={handleChange}
                      placeholder="Company Name"
                      className={INPUT}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="계약 상태" required>
                    <select name="contractStatus" value={form.contractStatus} onChange={handleChange} className={INPUT}>
                      <option value="계약중">계약중</option>
                      <option value="협의중">협의중</option>
                      <option value="계약종료">계약종료</option>
                    </select>
                  </Field>
                  <Field label=" ">
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox" name="isVip"
                        checked={form.isVip} onChange={handleChange}
                        className="rounded border-gray-300 cursor-pointer"
                      />
                      <span className="text-[12px] text-gray-700">VIP 고객사</span>
                    </label>
                  </Field>
                </div>
              </div>
            </section>

            {/* 담당자 정보 */}
            <section>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">담당자 정보</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="대표자">
                    <input name="ceo" value={form.ceo} onChange={handleChange} placeholder="홍길동" className={INPUT} />
                  </Field>
                  <Field label="담당자" required>
                    <input
                      name="manager" required
                      value={form.manager} onChange={handleChange}
                      placeholder="김담당 매니저"
                      className={INPUT}
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="연락처">
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="010-0000-0000" className={INPUT} />
                  </Field>
                  <Field label="이메일">
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="email@company.kr" className={INPUT} />
                  </Field>
                </div>
              </div>
            </section>

            {/* 사업 정보 */}
            <section>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">사업 정보</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="사업자번호">
                    <input name="businessNumber" value={form.businessNumber} onChange={handleChange} placeholder="000-00-00000" className={INPUT} />
                  </Field>
                  <Field label="업종">
                    <input name="industry" value={form.industry} onChange={handleChange} placeholder="IT / 소프트웨어" className={INPUT} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="설립일">
                    <input name="foundedAt" value={form.foundedAt} onChange={handleChange} placeholder="2020. 01. 01" className={INPUT} />
                  </Field>
                  <Field label="규모">
                    <input name="scale" value={form.scale} onChange={handleChange} placeholder="중소기업 · 직원 00명" className={INPUT} />
                  </Field>
                </div>
                <Field label="주소">
                  <input name="address" value={form.address} onChange={handleChange} placeholder="서울시 강남구 테헤란로 123" className={INPUT} />
                </Field>
              </div>
            </section>

            {/* 메모 */}
            <section>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3">메모</p>
              <textarea
                name="memo" rows={3}
                value={form.memo} onChange={handleChange}
                placeholder="특이사항이나 메모를 입력하세요."
                className={`${INPUT} resize-none`}
              />
            </section>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-2 bg-white">
            <button
              type="button" onClick={onClose}
              className="text-sm border border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="text-sm bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const INPUT = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300 bg-white";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] text-gray-400 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
