"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DOCS_LIST } from "@/lib/docs-meta";

export default function DocsPage() {
  const [activeProduct, setActiveProduct] = useState(DOCS_LIST[0].product);
  const current = DOCS_LIST.find((d) => d.product === activeProduct)!;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground mb-1">문서</h1>
        <p className="text-sm text-muted-foreground">
          제품별 클라이언트, 펌웨어, 이슈사항 문서를 확인하고 편집하세요.
        </p>
      </div>

      {/* 제품 탭 */}
      <div className="flex items-center gap-2 mb-8">
        {DOCS_LIST.map((d) => (
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
                  activeProduct === d.product ? "bg-white/20 text-white border-0" : ""
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
                <Link
                  key={item.slug}
                  href={`/docs/${item.slug}`}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-muted-foreground/40 font-mono w-4 shrink-0 mt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground mb-0.5">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0 ml-4" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
