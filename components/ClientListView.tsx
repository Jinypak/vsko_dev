"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useClients } from "@/lib/clients-context";
import { STATUS_STYLES } from "@/lib/utils";
import AddClientDrawer from "@/components/AddClientDrawer";

const CONTRACT_FILTERS = ["전체", "계약중", "협의중", "계약종료"] as const;
type ContractFilter = (typeof CONTRACT_FILTERS)[number];

export default function ClientListView() {
  const { clients } = useClients();
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
        c.industry.toLowerCase().includes(q) ||
        c.manager.toLowerCase().includes(q) ||
        c.ceo.toLowerCase().includes(q);

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
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-gray-900">고객사</h1>
            <p className="text-[12px] text-gray-400 mt-0.5">
              총 {clients.length}개 · 검색 결과 {filtered.length}개
            </p>
          </div>
          <button
            onClick={() => setShowDrawer(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            고객사 추가
          </button>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="회사명, 업종, 담당자, 대표자로 검색..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1.5">
            {CONTRACT_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setContractFilter(f)}
                className={`text-[12px] px-3 py-1 rounded-full border transition-colors ${
                  contractFilter === f
                    ? "border-gray-800 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {f}
                <span className="ml-1 opacity-60">{contractCounts[f] ?? 0}</span>
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 cursor-pointer text-[12px] text-gray-500">
            <input
              type="checkbox"
              checked={vipOnly}
              onChange={(e) => setVipOnly(e.target.checked)}
              className="rounded border-gray-300 text-gray-800 cursor-pointer"
            />
            VIP만 보기
          </label>
        </div>

        {/* Client table */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-300">
            <svg className="w-10 h-10 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2">고객사</th>
                <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-28">업종</th>
                <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">담당자</th>
                <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">상태</th>
                <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">등록일</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-2.5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-500 shrink-0">
                        {client.companyName.replace(/[^가-힣a-zA-Z]/g, "")[0] ?? "?"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-gray-800">{client.companyName}</span>
                          {client.isVip && (
                            <span className="text-[10px] border border-amber-300 text-amber-500 rounded-full px-1.5 py-0.5 leading-none">
                              VIP
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-400">{client.companyNameEn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2.5 py-3 text-gray-500">{client.industry}</td>
                  <td className="px-2.5 py-3 text-gray-500">{client.manager}</td>
                  <td className="px-2.5 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[
                      client.contractStatus === "계약중" ? "진행중"
                      : client.contractStatus === "계약종료" ? "완료"
                      : "계획중"
                    ]}`}>
                      {client.contractStatus}
                    </span>
                  </td>
                  <td className="px-2.5 py-3 text-gray-400 text-[12px]">{client.registeredAt}</td>
                  <td className="px-2.5 py-3 text-right">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-[11px] text-gray-300 group-hover:text-gray-500 transition-colors"
                    >
                      →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showDrawer && <AddClientDrawer onClose={() => setShowDrawer(false)} />}
    </>
  );
}
