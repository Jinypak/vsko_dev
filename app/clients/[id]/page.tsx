import { getClient } from "@/lib/actions/clients";
import Link from "next/link";
import ClientInfoCard from "@/components/ClientInfoCard";
import ProductTable from "@/components/ProductTable";
import HistoryTable from "@/components/HistoryTable";
import ClientActions from "@/components/ClientActions";

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400 text-sm mb-4">고객사를 찾을 수 없습니다.</p>
        <Link
          href="/clients"
          className="text-[12px] text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="text-[12px] text-gray-400 mb-2 flex items-center gap-1">
        <Link href="/" className="hover:text-gray-600 transition-colors">홈</Link>
        <span>/</span>
        <Link href="/clients" className="hover:text-gray-600 transition-colors">고객사</Link>
        <span>/</span>
        <span className="text-gray-600">{client.companyName}</span>
      </nav>

      {/* Page title + 편집/삭제 버튼 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900 flex items-center gap-3">
          고객사 정보
          <span className="text-[13px] font-normal text-gray-400">
            — {client.companyName}
          </span>
        </h1>
        <ClientActions client={client} />
      </div>

      <ClientInfoCard client={client} />
      <ProductTable products={client.products} clientId={client.id} />
      <HistoryTable history={client.history} clientId={client.id} />
    </div>
  );
}
