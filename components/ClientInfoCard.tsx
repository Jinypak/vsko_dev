"use client";

import { ClientInfo } from "@/types/client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MAINTENANCE_BADGE: Record<string, string> = {
  진행중:   "border-blue-300 text-blue-600 bg-blue-50",
  완료:     "border-green-300 text-green-600 bg-green-50",
  중단:     "border-red-300 text-red-500 bg-red-50",
  해당없음: "border-gray-200 text-gray-400 bg-gray-50",
};

const CONTRACT_BADGE: Record<string, string> = {
  계약중:   "border-blue-300 text-blue-600 bg-blue-50",
  협의중:   "border-amber-300 text-amber-600 bg-amber-50",
  계약종료: "border-gray-300 text-gray-500 bg-gray-50",
};

interface ClientInfoCardProps {
  client: ClientInfo;
}

export default function ClientInfoCard({ client }: ClientInfoCardProps) {
  return (
    <Card className="mb-6 gap-0 py-0">
      <CardHeader className="px-6 py-4 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-foreground">{client.companyName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{client.companyNameEn}</p>
          </div>
          <div className="flex gap-1.5 flex-wrap justify-end">
            {client.isVip && (
              <Badge variant="outline" className="border-amber-300 text-amber-600 bg-amber-50">VIP</Badge>
            )}
            <Badge variant="outline" className={CONTRACT_BADGE[client.contractStatus] ?? "border-gray-300 text-gray-500"}>
              {client.contractStatus}
            </Badge>
            <Badge variant="outline" className={MAINTENANCE_BADGE[client.maintenanceStatus] ?? MAINTENANCE_BADGE["해당없음"]}>
              유지보수 {client.maintenanceStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="py-4 px-6">
        <div className="grid grid-cols-2 gap-6">
          {/* 좌측 — 기본 정보 */}
          <div className="space-y-2">
            <Row label="부서" value={client.department} />
            <Row label="담당 엔지니어" value={client.engineer} />
            <Row label="용도" value={client.purpose} />
            <Row label="등록일" value={client.registeredAt} />
            {client.notes && (
              <div className="pt-3">
                <Separator className="mb-3" />
                <p className="text-xs text-muted-foreground mb-1">특이사항</p>
                <p className="text-xs text-foreground whitespace-pre-wrap">{client.notes}</p>
              </div>
            )}
          </div>

          {/* 우측 — 담당자 목록 */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">담당자</p>
            {client.contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground/50">등록된 담당자가 없습니다.</p>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="h-8 text-[10px]">이름</TableHead>
                      <TableHead className="h-8 text-[10px]">연락처</TableHead>
                      <TableHead className="h-8 text-[10px]">이메일</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {client.contacts.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="py-1.5 text-xs text-foreground">
                          {c.name}
                          {c.isPrimary && <span className="ml-1 text-[10px] text-blue-400">주</span>}
                        </TableCell>
                        <TableCell className="py-1.5 text-xs text-muted-foreground">{c.phone}</TableCell>
                        <TableCell className="py-1.5 text-xs text-muted-foreground">{c.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-muted-foreground w-24 shrink-0">{label}</span>
      <span className="text-xs text-foreground">{value || "—"}</span>
    </div>
  );
}
