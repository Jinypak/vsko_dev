"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const SUB_ITEMS = [
  { title: "버전 리스트", desc: "출시된 모든 버전 목록과 릴리즈 날짜를 확인합니다." },
  { title: "버전 별 특징", desc: "각 버전의 주요 변경사항과 개선 내용을 설명합니다." },
];

const ISSUE_ITEMS = [
  { title: "QnA", desc: "자주 묻는 질문과 답변을 정리한 페이지입니다." },
  { title: "버그", desc: "알려진 버그 목록과 임시 해결방법을 안내합니다." },
];

const FIRMWARE_ITEMS = [
  { title: "펌웨어 리스트 (FIPS)", desc: "FIPS 인증 펌웨어 버전 목록을 제공합니다." },
  { title: "버전 별 특징", desc: "펌웨어 버전별 기능 변경사항을 설명합니다." },
];

const DOCS: {
  product: string;
  badge?: string;
  subcategories: { name: string; items: { title: string; desc: string }[] }[];
}[] = [
  {
    product: "Luna",
    badge: "주력 제품",
    subcategories: [
      {
        name: "Luna Client",
        items: SUB_ITEMS,
      },
      {
        name: "Firmware",
        items: FIRMWARE_ITEMS,
      },
      {
        name: "이슈사항",
        items: ISSUE_ITEMS,
      },
    ],
  },
  {
    product: "PSE",
    subcategories: [
      {
        name: "PTK",
        items: SUB_ITEMS,
      },
      {
        name: "Firmware",
        items: FIRMWARE_ITEMS,
      },
      {
        name: "이슈사항",
        items: ISSUE_ITEMS,
      },
    ],
  },
];

export default function DocsPage() {
  const [activeProduct, setActiveProduct] = useState(DOCS[0].product);

  const current = DOCS.find((d) => d.product === activeProduct)!;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground mb-1">문서</h1>
        <p className="text-sm text-muted-foreground">
          제품별 클라이언트, 펌웨어, 이슈사항 문서를 확인하세요.
        </p>
      </div>

      {/* 제품 탭 */}
      <div className="flex items-center gap-2 mb-8">
        {DOCS.map((d) => (
          <Button
            key={d.product}
            variant={activeProduct === d.product ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveProduct(d.product)}
            className="gap-2"
          >
            {d.product}
            {d.badge && (
              <Badge
                variant="secondary"
                className={`text-[10px] h-4 px-1.5 ${
                  activeProduct === d.product
                    ? "bg-white/20 text-white border-0"
                    : ""
                }`}
              >
                {d.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <Separator className="mb-8" />

      {/* 서브카테고리 목록 */}
      <div className="space-y-8">
        {current.subcategories.map((sub) => (
          <div key={sub.name}>
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
              {current.product} · {sub.name}
            </h2>
            <div className="divide-y border rounded-xl overflow-hidden">
              {sub.items.map((item, idx) => (
                <button
                  key={item.title}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground/50 font-mono w-4 shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-0.5">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0 ml-4" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
