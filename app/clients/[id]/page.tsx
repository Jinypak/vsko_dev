import { getClient } from "@/lib/actions/clients";
import Link from "next/link";
import ClientInfoCard from "@/components/ClientInfoCard";
import ProductTable from "@/components/ProductTable";
import HistoryTable from "@/components/HistoryTable";
import ClientActions from "@/components/ClientActions";
import { ChevronLeft } from "lucide-react";

const CONTRACT_STYLE: Record<string, string> = {
  계약중:   "bg-blue-50 text-blue-700 border-blue-200",
  협의중:   "bg-amber-50 text-amber-700 border-amber-200",
  계약종료: "bg-gray-50 text-gray-500 border-gray-200",
};

const MAINT_STYLE: Record<string, string> = {
  진행중:   "bg-blue-50 text-blue-700 border-blue-200",
  완료:     "bg-green-50 text-green-700 border-green-200",
  중단:     "bg-red-50 text-red-600 border-red-200",
  해당없음: "bg-gray-50 text-gray-400 border-gray-200",
};

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    return (
      <div className="flex items-center justify-center" style={{ height: "calc(100vh - 56px)" }}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">고객사를 찾을 수 없습니다.</p>
          <Link
            href="/clients"
            className="text-xs text-muted-foreground border border-input rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
          >
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden" style={{ height: "calc(100vh - 56px)" }}>
      {/* 상단 헤더 */}
      <div className="border-b px-6 py-3 shrink-0 flex items-center justify-between bg-background">
        <div className="flex items-center gap-3 min-w-0">
          {/* 뒤로가기 */}
          <Link
            href="/clients"
            className="flex items-center gap-0.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="size-3.5" />
            고객사
          </Link>

          <span className="text-muted-foreground/30 shrink-0">/</span>

          {/* 회사명 + 영문명 */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[15px] font-semibold text-foreground truncate">
              {client.companyName}
            </span>
            {client.companyNameEn && (
              <span className="text-xs text-muted-foreground hidden sm:block truncate">
                {client.companyNameEn}
              </span>
            )}
          </div>

          {/* 상태 뱃지 */}
          <div className="flex items-center gap-1.5 shrink-0">
            {client.isVip && (
              <span className="text-[10px] border border-amber-300 text-amber-600 bg-amber-50 rounded px-1.5 py-0.5 leading-none">
                VIP
              </span>
            )}
            <span
              className={`text-[10px] border rounded px-1.5 py-0.5 leading-none ${CONTRACT_STYLE[client.contractStatus] ?? ""}`}
            >
              {client.contractStatus}
            </span>
            <span
              className={`text-[10px] border rounded px-1.5 py-0.5 leading-none ${MAINT_STYLE[client.maintenanceStatus] ?? ""}`}
            >
              유지보수 {client.maintenanceStatus}
            </span>
          </div>
        </div>

        {/* 편집 / 삭제 */}
        <ClientActions client={client} />
      </div>

      {/* 본문 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 메인 콘텐츠 — 제품 + 히스토리 */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <ProductTable products={client.products} clientId={client.id} />
          <HistoryTable history={client.history} clientId={client.id} />
        </div>

        {/* 우측 정보 패널 */}
        <aside className="w-72 border-l shrink-0 overflow-y-auto bg-background">
          <ClientInfoCard client={client} />
        </aside>
      </div>
    </div>
  );
}
