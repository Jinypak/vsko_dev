"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientInfo } from "@/types/client";
import { deleteClient } from "@/lib/actions/clients";
import EditClientDrawer from "@/components/EditClientDrawer";

interface ClientActionsProps {
  client: ClientInfo;
}

export default function ClientActions({ client }: ClientActionsProps) {
  const router = useRouter();
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await deleteClient(client.id);
    router.push("/clients");
  };

  return (
    <>
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

      {showEdit && (
        <EditClientDrawer client={client} onClose={() => setShowEdit(false)} />
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl px-6 py-5 w-[360px]">
            <h3 className="text-sm font-medium text-gray-900 mb-1">고객사 삭제</h3>
            <p className="text-[12px] text-gray-500 mb-5">
              <span className="font-medium text-gray-700">{client.companyName}</span>
              을(를) 삭제하면 복구할 수 없습니다. 계속하시겠습니까?
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
                disabled={deleting}
                className="text-sm bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
