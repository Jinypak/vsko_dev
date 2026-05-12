"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { ClientInfo } from "@/types/client";
import AddClientDrawer from "@/components/AddClientDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CONTRACT_FILTERS = ["전체", "계약중", "협의중", "계약종료"] as const;
type ContractFilter = (typeof CONTRACT_FILTERS)[number];

const CONTRACT_BADGE: Record<string, { variant: "default" | "secondary" | "outline"; className: string }> = {
  계약중:   { variant: "outline", className: "border-blue-300 text-blue-600 bg-blue-50" },
  협의중:   { variant: "outline", className: "border-amber-300 text-amber-600 bg-amber-50" },
  계약종료: { variant: "outline", className: "border-gray-300 text-gray-500 bg-gray-50" },
};

interface ClientListViewProps {
  clients: ClientInfo[];
}

export default function ClientListView({ clients }: ClientListViewProps) {
  const [query, setQuery] = useState("");
  const [contractFilter, setContractFilter] = useState<ContractFilter>("전체");
  const [vipOnly, setVipOnly] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      const matchQuery =
        !q ||
        c.companyName.toLowerCase().includes(q) ||
        c.companyNameEn.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.engineer.toLowerCase().includes(q) ||
        c.notes.toLowerCase().includes(q);
      const matchContract =
        contractFilter === "전체" || c.contractStatus === contractFilter;
      const matchVip = !vipOnly || c.isVip;
      return matchQuery && matchContract && matchVip;
    });
  }, [clients, query, contractFilter, vipOnly]);

  const contractCounts = useMemo(() => {
    const counts: Record<string, number> = { 전체: clients.length };
    clients.forEach((c) => {
      counts[c.contractStatus] = (counts[c.contractStatus] ?? 0) + 1;
    });
    return counts;
  }, [clients]);

  return (
    <>
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">고객사</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              총 {clients.length}개 · 검색 결과 {filtered.length}개
            </p>
          </div>
          <Button onClick={() => setShowDrawer(true)}>
            <Plus className="size-4" />
            고객사 추가
          </Button>
        </div>

        {/* 검색 */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="회사명, 부서, 담당 엔지니어로 검색..."
            className="pl-9 pr-9"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* 필터 */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5">
            {CONTRACT_FILTERS.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={contractFilter === f ? "default" : "outline"}
                className="rounded-full h-7 text-xs px-3"
                onClick={() => setContractFilter(f)}
              >
                {f}
                <span className="ml-1 opacity-60">{contractCounts[f] ?? 0}</span>
              </Button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <input
              type="checkbox"
              checked={vipOnly}
              onChange={(e) => setVipOnly(e.target.checked)}
              className="rounded border-input"
            />
            VIP만 보기
          </label>
        </div>

        {/* 테이블 */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Search className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>고객사</TableHead>
                  <TableHead className="w-28">부서</TableHead>
                  <TableHead className="w-24">엔지니어</TableHead>
                  <TableHead className="w-24">상태</TableHead>
                  <TableHead className="w-24">등록일</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground shrink-0">
                          {client.companyName.replace(/[^가-힣a-zA-Z]/g, "")[0] ?? "?"}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-sm text-foreground">{client.companyName}</span>
                            {client.isVip && (
                              <Badge variant="outline" className="border-amber-300 text-amber-600 bg-amber-50 text-[10px] h-4 px-1.5">
                                VIP
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{client.companyNameEn}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.department}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{client.engineer}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={CONTRACT_BADGE[client.contractStatus]?.className ?? "border-gray-300 text-gray-500"}
                      >
                        {client.contractStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{client.registeredAt}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/clients/${client.id}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AddClientDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
}
