"use client";

import { Fragment, useState } from "react";
import { HistoryItem } from "@/types/client";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import HistoryDetailPanel from "@/components/HistoryDetailPanel";

interface HistoryTableProps {
  history: HistoryItem[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <SectionHeader
        num="02"
        title="작업 히스토리"
        sub="· 최근 6개월 · 클릭하여 상세보기"
      />

      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">일자</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2">작업명</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">담당</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">상태</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2">비고</th>
            <th className="w-24" />
          </tr>
        </thead>
        <tbody>
          {history.map((item) => {
            const isOpen = openId === item.id;

            return (
              <Fragment key={item.id}>
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-2.5 py-2.5 text-gray-400 text-[12px]">{item.date}</td>
                  <td className="px-2.5 py-2.5 text-gray-800">{item.name}</td>
                  <td className="px-2.5 py-2.5 text-gray-500">{item.assignee}</td>
                  <td className="px-2.5 py-2.5">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-2.5 py-2.5 text-gray-400 text-[12px]">{item.note}</td>
                  <td className="px-2.5 py-2.5 text-right">
                    <button
                      onClick={() => item.detail && toggle(item.id)}
                      disabled={!item.detail}
                      className={`flex items-center gap-1 text-[11px] px-2.5 py-1 border rounded-md transition-colors ml-auto ${
                        !item.detail
                          ? "border-gray-100 text-gray-300 cursor-not-allowed"
                          : isOpen
                          ? "border-gray-800 bg-gray-900 text-white"
                          : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                      }`}
                    >
                      {isOpen ? "닫기" : "상세보기"}
                      <svg
                        className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </td>
                </tr>

                {item.detail && isOpen && (
                  <tr>
                    <td colSpan={6} className="p-0">
                      <HistoryDetailPanel
                        detail={item.detail}
                        onClose={() => setOpenId(null)}
                      />
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
