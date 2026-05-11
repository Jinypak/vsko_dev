"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientInfo } from "@/types/client";
import { addClient } from "@/lib/actions/clients";

type FormData = Omit<ClientInfo, "id" | "registeredAt" | "contacts" | "products" | "history">;

const INITIAL: FormData = {
  companyName: "", companyNameEn: "", isVip: false,
  contractStatus: "계약중", department: "", engineer: "",
  purpose: "", maintenanceStatus: "해당없음", notes: "",
};

interface AddClientDrawerProps { onClose: () => void }

export default function AddClientDrawer({ onClose }: AddClientDrawerProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const set = (k: keyof FormData, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    set(name as keyof FormData, type === "checkbox" ? (e.target as HTMLInputElement).checked : value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    const result = await addClient(form);
    if (result.error) {
      setErrorMsg(result.error);
      setSaving(false);
    } else {
      router.refresh();
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-xl flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-sm font-medium text-gray-900">고객사 등록</h2>
            <p className="text-[12px] text-gray-400 mt-0.5">새 고객사 정보를 입력하세요.</p>
          </div>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            <section>
              <p className={SECTION}>기본 정보</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="회사명 (국문)" required>
                    <input name="companyName" required value={form.companyName} onChange={handleChange} placeholder="(주) 회사명" className={INPUT} />
                  </Field>
                  <Field label="회사명 (영문)">
                    <input name="companyNameEn" value={form.companyNameEn} onChange={handleChange} placeholder="Company Name" className={INPUT} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="계약 상태">
                    <select name="contractStatus" value={form.contractStatus} onChange={handleChange} className={INPUT}>
                      <option value="계약중">계약중</option>
                      <option value="협의중">협의중</option>
                      <option value="계약종료">계약종료</option>
                    </select>
                  </Field>
                  <Field label=" ">
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input type="checkbox" name="isVip" checked={form.isVip} onChange={handleChange} className="rounded border-gray-300" />
                      <span className="text-[12px] text-gray-700">VIP 고객사</span>
                    </label>
                  </Field>
                </div>
              </div>
            </section>

            <section>
              <p className={SECTION}>고객사 정보</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="부서">
                    <input name="department" value={form.department} onChange={handleChange} placeholder="IT 인프라팀" className={INPUT} />
                  </Field>
                  <Field label="담당 엔지니어">
                    <input name="engineer" value={form.engineer} onChange={handleChange} placeholder="홍길동" className={INPUT} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="용도">
                    <input name="purpose" value={form.purpose} onChange={handleChange} placeholder="백업 및 재해복구" className={INPUT} />
                  </Field>
                  <Field label="유지보수 현황">
                    <select name="maintenanceStatus" value={form.maintenanceStatus} onChange={handleChange} className={INPUT}>
                      <option value="진행중">진행중</option>
                      <option value="완료">완료</option>
                      <option value="중단">중단</option>
                      <option value="해당없음">해당없음</option>
                    </select>
                  </Field>
                </div>
              </div>
            </section>

            <section>
              <p className={SECTION}>특이사항</p>
              <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} placeholder="특이사항을 입력하세요." className={`${INPUT} resize-none`} />
            </section>
          </div>

          <div className="shrink-0 border-t border-gray-100 px-6 py-4 bg-white">
            {errorMsg && (
              <p className="text-[11px] text-red-500 mb-3 px-1">{errorMsg}</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={onClose} className="text-sm border border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50">취소</button>
              <button type="submit" disabled={saving} className="text-sm bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50">
                {saving ? "저장 중..." : "등록하기"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

const INPUT = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300 bg-white";
const SECTION = "text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-3";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] text-gray-400 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
