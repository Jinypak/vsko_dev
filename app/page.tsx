import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const FEATURES = [
  { icon: "🏢", title: "고객사 통합 관리", desc: "고객사 기본 정보, 담당자, 계약 상태를 한 곳에서 관리하세요." },
  { icon: "📦", title: "제품 & 계약 추적", desc: "진행 중인 제품과 계약 현황을 실시간으로 파악할 수 있습니다." },
  { icon: "📋", title: "작업 히스토리", desc: "고객사별 작업 이력과 체크리스트를 체계적으로 기록합니다." },
  { icon: "🔍", title: "빠른 검색", desc: "회사명, 업종, 담당자로 고객사를 즉시 검색하세요." },
];

const STATS = [
  { label: "등록 고객사", value: "5" },
  { label: "진행 중 계약", value: "3" },
  { label: "이번 달 작업", value: "12" },
  { label: "완료 프로젝트", value: "47" },
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Hero */}
      <div className="mb-16 max-w-2xl">
        <Badge variant="secondary" className="mb-5 gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          운영 중
        </Badge>
        <h2 className="text-4xl font-semibold text-foreground leading-tight mb-4">
          고객사 정보를<br />한눈에 관리하세요.
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed mb-8">
          ClientOS는 고객사 정보, 계약 현황, 작업 히스토리를 통합 관리하는
          내부 툴입니다. 빠른 검색과 직관적인 인터페이스로 업무 효율을 높이세요.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/clients">고객사 보기 →</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/docs">문서 보기</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-16">
        {STATS.map((s) => (
          <Card key={s.label} className="py-4 gap-1">
            <CardContent className="px-4 py-0">
              <p className="text-2xl font-semibold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="mb-10" />

      {/* Features */}
      <div>
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-6">주요 기능</h3>
        <div className="grid grid-cols-2 gap-4">
          {FEATURES.map((f) => (
            <Card key={f.title} className="py-5 gap-3 hover:shadow-md transition-shadow">
              <CardContent className="px-5 py-0">
                <span className="text-2xl block mb-3">{f.icon}</span>
                <p className="text-sm font-medium text-foreground mb-1">{f.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
