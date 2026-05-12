"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientInfo } from "@/types/client";
import { deleteClient } from "@/lib/actions/clients";
import EditClientDrawer from "@/components/EditClientDrawer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

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
        <Button variant="outline" size="sm" onClick={() => setShowEdit(true)}>
          편집
        </Button>
        <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive" onClick={() => setShowDeleteConfirm(true)}>
          삭제
        </Button>
      </div>

      <EditClientDrawer client={client} open={showEdit} onClose={() => setShowEdit(false)} />

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="w-[360px]">
          <DialogHeader>
            <DialogTitle>고객사 삭제</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{client.companyName}</span>
              을(를) 삭제하면 복구할 수 없습니다. 계속하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
