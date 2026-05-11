"use client";

import { ClientInfo } from "@/types/client";

const MAINTENANCE_STYLE: Record<string, string> = {
  진행중: "border-blue-300 text-blue-600",
  완료:   "border-green-300 text-green-600",
  중단:   "border-red-300 text-red-400",
  해당없음: "border-gray-200 text-gray-400",
};

interface ClientInfoCardProps {
  client: ClientInfo;
}

export default function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-6">
      {/* 상단 — 회사명 + 배지 */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-medium text-gray-900">{client.companyName}</h2>
          <p className="text-[12px] text-gray-400">{client.companyNameEn}</p>
        </div>
        <div className="flex gap-1.5">
          {client.isVip && (
            <span className="text-[11px] border border-amber-300 text-amber-600 rounded-full px-2 py-0.5">VIP</span>
          )}
          <span className="text-[11px] border border-gray-300 text-gray-500 rounded-full px-2 py-0.5">
            {client.contractStatus}
          </span>
          <span className={`text-[11px] border rounded-full px-2 py-0.5 ${MAINTENANCE_STYLE[client.maintenanceStatus] ?? MAINTENANCE_STYLE["해당없음"]}`}>
            유지보수 {client.maintenanceStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 좌측 — 고객사 기본 정보 */}
        <div className="space-y-2">
          <Row label="부서" value={client.department} />
          <Row label="담당 엔지니어" value={client.engineer} />
          <Row label="용도" value={client.purpose} />
          <Row label="등록일" value={client.registeredAt} />
          {client.notes && (
            <div className="pt-2 border-t border-gray-100">
              <p className="text-[11px] text-gray-400 mb-1">특이사항</p>
              <p className="text-[12px] text-gray-700 whitespace-pre-wrap">{client.notes}</p>
            </div>
          )}
        </div>

        {/* 우측 — 담당자 목록 */}
        <div>
          <p className="text-[11px] text-gray-400 mb-2">담당자</p>
          {client.contacts.length === 0 ? (
            <p className="text-[12px] text-gray-300">등록된 담당자가 없습니다.</p>
          ) : (
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left text-[10px] text-gray-400 font-medium px-3 py-1.5">이름</th>
                    <th className="text-left text-[10px] text-gray-400 font-medium px-3 py-1.5">연락처</th>
                    <th className="text-left text-[10px] text-gray-400 font-medium px-3 py-1.5">이메일</th>
                  </tr>
                </thead>
                <tbody>
                  {client.contacts.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="px-3 py-1.5 text-gray-800">
                        {c.name}
                        {c.isPrimary && <span className="ml-1 text-[10px] text-blue-400">주</span>}
                      </td>
                      <td className="px-3 py-1.5 text-gray-500">{c.phone}</td>
                      <td className="px-3 py-1.5 text-gray-500">{c.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[11px] text-gray-400 w-24 shrink-0">{label}</span>
      <span className="text-[12px] text-gray-800">{value || "—"}</span>
    </div>
  );
}
