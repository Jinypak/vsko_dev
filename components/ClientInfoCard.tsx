"use client";

import { ClientInfo } from "@/types/client";
import { Separator } from "@/components/ui/separator";

interface ClientInfoCardProps {
  client: ClientInfo;
}

export default function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <div className="p-5 space-y-5">
      {/* 기본 정보 */}
      <section>
        <SectionTitle>기본 정보</SectionTitle>
        <div className="space-y-2.5">
          <InfoRow label="부서" value={client.department} />
          <InfoRow label="담당 엔지니어" value={client.engineer} />
          <InfoRow label="용도" value={client.purpose} />
          <InfoRow label="등록일" value={client.registeredAt} />
        </div>
      </section>

      <Separator />

      {/* 담당자 */}
      <section>
        <SectionTitle>담당자</SectionTitle>
        {client.contacts.length === 0 ? (
          <p className="text-[11px] text-muted-foreground/50">등록된 담당자 없음</p>
        ) : (
          <div className="space-y-2">
            {client.contacts.map((c) => (
              <div key={c.id} className="rounded-md border p-2.5 space-y-1 bg-muted/20">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-semibold text-muted-foreground shrink-0">
                    {c.name[0]}
                  </div>
                  <span className="text-xs font-medium text-foreground">{c.name}</span>
                  {c.isPrimary && (
                    <span className="text-[9px] bg-blue-50 text-blue-500 border border-blue-200 rounded px-1 leading-none py-0.5">
                      주담당
                    </span>
                  )}
                </div>
                {c.phone && (
                  <p className="text-[11px] text-muted-foreground pl-6.5">{c.phone}</p>
                )}
                {c.email && (
                  <p className="text-[11px] text-muted-foreground pl-6.5 truncate">{c.email}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {client.notes && (
        <>
          <Separator />
          <section>
            <SectionTitle>특이사항</SectionTitle>
            <p className="text-[11px] text-foreground whitespace-pre-wrap leading-relaxed">
              {client.notes}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
      {children}
    </p>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[10px] text-muted-foreground w-[72px] shrink-0 mt-0.5 leading-tight">
        {label}
      </span>
      <span className="text-[11px] text-foreground">{value || "—"}</span>
    </div>
  );
}
