"use client";

import { ClientInfo } from "@/types/client";

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start gap-2 px-3 py-1.5 border-b border-gray-100 last:border-b-0">
      <span className="text-[11px] text-gray-400 w-20 shrink-0 pt-0.5">{label}</span>
      <span className="text-[12px] text-gray-800">{value}</span>
    </div>
  );
}

interface ClientInfoCardProps {
  client: ClientInfo;
}

export default function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-3 border border-gray-200 rounded-xl p-4 mb-6">
      {/* Left — logo + badges */}
      <div className="flex flex-col">
        <div className="border border-dashed border-gray-300 rounded-lg h-28 flex items-center justify-center text-gray-300 text-sm mb-3">
          [LOGO]
        </div>
        <p className="text-sm font-medium text-gray-800">{client.companyName}</p>
        <p className="text-[11px] text-gray-400 mb-2">{client.companyNameEn}</p>
        <div className="flex gap-1.5">
          {client.isVip && (
            <span className="text-[11px] border border-amber-300 text-amber-600 rounded-full px-2 py-0.5">
              VIP
            </span>
          )}
          <span className="text-[11px] border border-gray-300 text-gray-500 rounded-full px-2 py-0.5">
            {client.contractStatus}
          </span>
        </div>
      </div>

      {/* Right — info grid */}
      <div className="border-l border-gray-100">
        <div className="grid grid-cols-2">
          <InfoRow label="대표자" value={client.ceo} />
          <InfoRow label="담당자" value={client.manager} />
          <InfoRow label="사업자번호" value={client.businessNumber} />
          <InfoRow label="연락처" value={client.phone} />
          <InfoRow label="업종" value={client.industry} />
          <InfoRow label="이메일" value={client.email} />
          <InfoRow label="설립일" value={client.foundedAt} />
          <InfoRow label="주소" value={client.address} />
          <InfoRow label="규모" value={client.scale} />
          <InfoRow label="등록일" value={client.registeredAt} />
        </div>
        <div className="px-3 py-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 mb-1">메모</p>
          <p className="text-[12px] text-gray-700">{client.memo}</p>
        </div>
      </div>
    </div>
  );
}
