"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, X } from "lucide-react";
import { ClientInfo, ProductCategory } from "@/types/client";
import AddClientDrawer from "@/components/AddClientDrawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTRACT_STATUSES = ["전체", "계약중", "협의중", "계약종료"] as const;
type ContractStatus = (typeof CONTRACT_STATUSES)[number];

const PRODUCT_CATS = ["전체", "Luna", "PSE", "Backup"] as const;
type ProductCat = (typeof PRODUCT_CATS)[number];

const MAINT_STATUSES = ["전체", "진행중", "완료", "중단", "해당없음"] as const;
type MaintStatus = (typeof MAINT_STATUSES)[number];

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

const CAT_STYLE: Record<ProductCategory, string> = {
  Luna:   "bg-purple-50 text-purple-700 border-purple-200",
  PSE:    "bg-blue-50 text-blue-700 border-blue-200",
  Backup: "bg-amber-50 text-amber-700 border-amber-200",
};

interface ClientListViewProps {
  clients: ClientInfo[];
}

export default function ClientListView({ clients }: ClientListViewProps) {
  const [query, setQuery] = useState("");
  const [contractFilter, setContractFilter] = useState<ContractStatus>("전체");
  const [productFilter, setProductFilter] = useState<ProductCat>("전체");
  const [maintFilter, setMaintFilter] = useState<MaintStatus>("전체");
  const [vipOnly, setVipOnly] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      if (q && !c.companyName.toLowerCase().includes(q) && !c.companyNameEn.toLowerCase().includes(q) && !c.department.toLowerCase().includes(q) && !c.engineer.toLowerCase().includes(q) && !c.notes.toLowerCase().includes(q)) return false;
      if (contractFilter !== "전체" && c.contractStatus !== contractFilter) return false;
      if (productFilter !== "전체" && !c.products.some((p) => p.category === productFilter)) return false;
      if (maintFilter !== "전체" && c.maintenanceStatus !== maintFilter) return false;
      if (vipOnly && !c.isVip) return false;
      return true;
    });
  }, [clients, query, contractFilter, productFilter, maintFilter, vipOnly]);

  const contractCounts = useMemo(() => {
    const m: Record<string, number> = { 전체: clients.length };
    clients.forEach((c) => { m[c.contractStatus] = (m[c.contractStatus] ?? 0) + 1; });
    return m;
  }, [clients]);

  const productCounts = useMemo(() => {
    const m: Record<string, number> = { 전체: clients.length };
    clients.forEach((c) => {
      const seen = new Set<string>();
      c.products.forEach((p) => {
        if (!seen.has(p.category)) { seen.add(p.category); m[p.category] = (m[p.category] ?? 0) + 1; }
      });
    });
    return m;
  }, [clients]);

  const maintCounts = useMemo(() => {
    const m: Record<string, number> = { 전체: clients.length };
    clients.forEach((c) => { m[c.maintenanceStatus] = (m[c.maintenanceStatus] ?? 0) + 1; });
    return m;
  }, [clients]);

  const activeFilters = [
    contractFilter !== "전체" && { label: contractFilter, clear: () => setContractFilter("전체") },
    productFilter !== "전체" && { label: productFilter, clear: () => setProductFilter("전체") },
    maintFilter !== "전체" && { label: `유지보수: ${maintFilter}`, clear: () => setMaintFilter("전체") },
    vipOnly && { label: "VIP", clear: () => setVipOnly(false) },
  ].filter(Boolean) as Array<{ label: string; clear: () => void }>;

  return (
    <>
      <div className="flex" style={{ height: "calc(100vh - 56px)" }}>
        {/* 좌측 필터 사이드바 */}
        <aside className="w-48 border-r bg-background shrink-0 overflow-y-auto py-4">
          <FilterSection title="계약 상태">
            {CONTRACT_STATUSES.map((s) => (
              <SidebarItem
                key={s}
                label={s}
                count={contractCounts[s] ?? 0}
                active={contractFilter === s}
                onClick={() => setContractFilter(s)}
              />
            ))}
          </FilterSection>

          <FilterSection title="제품">
            {PRODUCT_CATS.map((s) => (
              <SidebarItem
                key={s}
                label={s}
                count={productCounts[s] ?? 0}
                active={productFilter === s}
                onClick={() => setProductFilter(s)}
              />
            ))}
          </FilterSection>

          <FilterSection title="유지보수">
            {MAINT_STATUSES.map((s) => (
              <SidebarItem
                key={s}
                label={s}
                count={maintCounts[s] ?? 0}
                active={maintFilter === s}
                onClick={() => setMaintFilter(s)}
              />
            ))}
          </FilterSection>

          <div className="px-3 mt-1">
            <label className="flex items-center gap-2 px-2 py-1.5 cursor-pointer text-[13px] text-muted-foreground hover:text-foreground transition-colors">
              <input
                type="checkbox"
                checked={vipOnly}
                onChange={(e) => setVipOnly(e.target.checked)}
                className="rounded border-input size-3.5"
              />
              VIP만 보기
            </label>
          </div>
        </aside>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 상단 툴바 */}
          <div className="flex items-center justify-between px-6 py-3 border-b shrink-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold">고객사</h1>
              <span className="text-xs text-muted-foreground">{filtered.length}개</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="검색..."
                  className="pl-8 h-7 text-xs w-48"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
              <Button size="sm" className="h-7 text-xs gap-1 px-3" onClick={() => setShowDrawer(true)}>
                <Plus className="size-3.5" />
                고객사 추가
              </Button>
            </div>
          </div>

          {/* 활성 필터 칩 */}
          {activeFilters.length > 0 && (
            <div className="flex items-center gap-1.5 px-6 py-2 border-b bg-muted/20 shrink-0">
              {activeFilters.map((f) => (
                <span
                  key={f.label}
                  className="flex items-center gap-1 text-[11px] bg-background border rounded-full px-2.5 py-0.5 text-muted-foreground"
                >
                  {f.label}
                  <button onClick={f.clear} className="hover:text-foreground ml-0.5">
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {activeFilters.length > 1 && (
                <button
                  onClick={() => {
                    setContractFilter("전체");
                    setProductFilter("전체");
                    setMaintFilter("전체");
                    setVipOnly(false);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground ml-1"
                >
                  모두 지우기
                </button>
              )}
            </div>
          )}

          {/* 피드 테이블 */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Search className="size-8 mb-3 opacity-30" />
                <p className="text-sm">검색 결과가 없습니다.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="text-left text-[10px] text-muted-foreground font-medium px-6 py-2.5">고객사</th>
                    <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2.5 w-28">부서</th>
                    <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2.5 w-28">담당 엔지니어</th>
                    <th className="text-right text-[10px] text-muted-foreground font-medium px-3 py-2.5 w-16">작업</th>
                    <th className="text-right text-[10px] text-muted-foreground font-medium px-3 py-2.5 w-16">담당자</th>
                    <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2.5 w-24">유지보수</th>
                    <th className="text-left text-[10px] text-muted-foreground font-medium px-3 py-2.5 w-20">계약</th>
                    <th className="text-left text-[10px] text-muted-foreground font-medium px-4 py-2.5 w-24">등록일</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => {
                    const cats = [...new Set(client.products.map((p) => p.category))];
                    return (
                      <tr
                        key={client.id}
                        className="border-b last:border-b-0 hover:bg-muted/20 transition-colors group"
                      >
                        {/* 고객사명 + 영문명 + 제품 태그 */}
                        <td className="px-6 py-3">
                          <Link href={`/clients/${client.id}`} className="block">
                            <div className="flex items-start gap-3">
                              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0 mt-0.5">
                                {client.companyName.replace(/[^가-힣a-zA-Z]/g, "")[0] ?? "?"}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <span className="font-medium text-[13px] text-foreground group-hover:underline">
                                    {client.companyName}
                                  </span>
                                  {client.isVip && (
                                    <span className="text-[9px] border border-amber-300 text-amber-600 bg-amber-50 rounded px-1 py-0.5 leading-none">
                                      VIP
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {client.companyNameEn && (
                                    <span className="text-[11px] text-muted-foreground">{client.companyNameEn}</span>
                                  )}
                                  {cats.map((cat) => (
                                    <span
                                      key={cat}
                                      className={`text-[9px] border rounded px-1 py-0.5 leading-none ${CAT_STYLE[cat]}`}
                                    >
                                      {cat}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </Link>
                        </td>

                        {/* 부서 */}
                        <td className="px-3 py-3 text-[11px] text-muted-foreground">
                          {client.department || "—"}
                        </td>

                        {/* 담당 엔지니어 — 아바타 스타일 */}
                        <td className="px-3 py-3">
                          {client.engineer ? (
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[9px] font-semibold text-muted-foreground shrink-0">
                                {client.engineer[0]}
                              </div>
                              <span className="text-[11px] text-muted-foreground">{client.engineer}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">—</span>
                          )}
                        </td>

                        {/* 작업 수 */}
                        <td className="px-3 py-3 text-right">
                          <span className="text-[11px] text-muted-foreground">{client.history.length}</span>
                        </td>

                        {/* 담당자 수 */}
                        <td className="px-3 py-3 text-right">
                          <span className="text-[11px] text-muted-foreground">{client.contacts.length}</span>
                        </td>

                        {/* 유지보수 상태 */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] border rounded px-1.5 py-0.5 ${MAINT_STYLE[client.maintenanceStatus]}`}>
                            {client.maintenanceStatus}
                          </span>
                        </td>

                        {/* 계약 상태 */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] border rounded px-1.5 py-0.5 ${CONTRACT_STYLE[client.contractStatus] ?? ""}`}>
                            {client.contractStatus}
                          </span>
                        </td>

                        {/* 등록일 */}
                        <td className="px-4 py-3 text-[11px] text-muted-foreground">{client.registeredAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AddClientDrawer open={showDrawer} onClose={() => setShowDrawer(false)} />
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-3 mb-4">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 px-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function SidebarItem({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[13px] transition-colors ${
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <span>{label}</span>
      <span className="text-[11px] opacity-60">{count}</span>
    </button>
  );
}
