"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useClients } from "@/lib/clients-context";
import ClientInfoCard from "@/components/ClientInfoCard";
import ProductTable from "@/components/ProductTable";
import HistoryTable from "@/components/HistoryTable";
import EditClientDrawer from "@/components/EditClientDrawer";

export default function ClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { clients, deleteClient } = useClients();
  const router = useRouter();

  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <p className="text-gray-400 text-sm mb-4">고객사를 찾을 수 없습니다.</p>
        <Link href="/clients" className="text-[12px] text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    deleteClient(client.id);
    router.push("/clients");
  };

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

      {/* Page title */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900 flex items-center gap-3">
          고객사 정보
          <span className="text-[13px] font-normal text-gray-400">
            — {client.companyName}
          </span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEdit(true)}
            className="text-sm border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            편집
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-sm border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            삭제
          </button>
        </div>
      </div>

      <ClientInfoCard client={client} />
      <ProductTable products={client.products} />
      <HistoryTable history={client.history} />

      {/* 편집 Drawer */}
      {showEdit && (
        <EditClientDrawer client={client} onClose={() => setShowEdit(false)} />
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl px-6 py-5 w-[360px]">
            <h3 className="text-sm font-medium text-gray-900 mb-1">고객사 삭제</h3>
            <p className="text-[12px] text-gray-500 mb-5">
              <span className="font-medium text-gray-700">{client.companyName}</span>을(를) 삭제하면 복구할 수 없습니다. 계속하시겠습니까?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-sm border border-gray-200 text-gray-500 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
