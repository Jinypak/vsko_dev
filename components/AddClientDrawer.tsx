"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientInfo } from "@/types/client";
import { addClient } from "@/lib/actions/clients";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = Omit<ClientInfo, "id" | "registeredAt" | "contacts" | "products" | "history">;

const INITIAL: FormData = {
  companyName: "", companyNameEn: "", isVip: false,
  contractStatus: "계약중", department: "", engineer: "",
  purpose: "", maintenanceStatus: "해당없음", notes: "",
};

interface AddClientDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function AddClientDrawer({ open, onClose }: AddClientDrawerProps) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(INITIAL);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
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
      setForm(INITIAL);
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-[480px] sm:max-w-[480px] flex flex-col p-0 gap-0">
        <SheetHeader className="px-6 py-4 border-b shrink-0">
          <SheetTitle>고객사 등록</SheetTitle>
          <SheetDescription>새 고객사 정보를 입력하세요.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

            <section>
              <p className={SECTION}>기본 정보</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="회사명 (국문)" required>
                    <Input name="companyName" required value={form.companyName} onChange={handleChange} placeholder="(주) 회사명" />
                  </Field>
                  <Field label="회사명 (영문)">
                    <Input name="companyNameEn" value={form.companyNameEn} onChange={handleChange} placeholder="Company Name" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="계약 상태">
                    <select name="contractStatus" value={form.contractStatus} onChange={handleChange} className={SELECT}>
                      <option value="계약중">계약중</option>
                      <option value="협의중">협의중</option>
                      <option value="계약종료">계약종료</option>
                    </select>
                  </Field>
                  <Field label=" ">
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input type="checkbox" name="isVip" checked={form.isVip} onChange={handleChange} className="rounded border-input" />
                      <span className="text-sm">VIP 고객사</span>
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
                    <Input name="department" value={form.department} onChange={handleChange} placeholder="IT 인프라팀" />
                  </Field>
                  <Field label="담당 엔지니어">
                    <Input name="engineer" value={form.engineer} onChange={handleChange} placeholder="홍길동" />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="용도">
                    <Input name="purpose" value={form.purpose} onChange={handleChange} placeholder="백업 및 재해복구" />
                  </Field>
                  <Field label="유지보수 현황">
                    <select name="maintenanceStatus" value={form.maintenanceStatus} onChange={handleChange} className={SELECT}>
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
              <textarea
                name="notes"
                rows={3}
                value={form.notes}
                onChange={handleChange}
                placeholder="특이사항을 입력하세요."
                className={TEXTAREA}
              />
            </section>
          </div>

          <SheetFooter className="border-t px-6 py-4 bg-background shrink-0 flex-col items-stretch gap-2">
            {errorMsg && (
              <p className="text-xs text-destructive">{errorMsg}</p>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>취소</Button>
              <Button type="submit" disabled={saving}>
                {saving ? "저장 중..." : "등록하기"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

const SELECT = "w-full h-9 px-3 text-sm border border-input rounded-md bg-transparent focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring transition-[color,box-shadow]";
const TEXTAREA = "w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring transition-[color,box-shadow] placeholder:text-muted-foreground resize-none";
const SECTION = "text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-3";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground mb-1.5 block">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </Label>
      {children}
    </div>
  );
}
