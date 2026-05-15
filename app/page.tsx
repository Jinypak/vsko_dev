import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/server";
import {
  ArrowRight,
  Shield,
  Server,
  Headphones,
  BarChart3,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";

const STATS = [
  { value: "200+", label: "도입 고객사" },
  { value: "15년", label: "업력" },
  { value: "99.9%", label: "서비스 가용성" },
  { value: "24/7", label: "기술 지원" },
];

const SERVICES = [
  {
    icon: Server,
    title: "IT 인프라 구축",
    desc: "서버·스토리지·네트워크 인프라 설계부터 구축, 운영까지 통합 지원합니다.",
  },
  {
    icon: Shield,
    title: "백업 & 재해복구",
    desc: "비즈니스 연속성을 위한 데이터 백업과 재해복구 솔루션을 제공합니다.",
  },
  {
    icon: Headphones,
    title: "기술 지원",
    desc: "전담 엔지니어가 365일 24시간 기술 지원 및 유지보수 서비스를 제공합니다.",
  },
  {
    icon: BarChart3,
    title: "IT 컨설팅",
    desc: "환경 분석을 바탕으로 최적화된 솔루션과 로드맵을 제시합니다.",
  },
  {
    icon: Users,
    title: "유지보수",
    desc: "도입 후 지속적인 모니터링과 유지보수로 안정적인 운영을 보장합니다.",
  },
  {
    icon: Zap,
    title: "신속 대응",
    desc: "장애 발생 시 즉각적인 현장 출동과 원격 지원으로 다운타임을 최소화합니다.",
  },
];

const VALUES = [
  "고객 비즈니스를 최우선으로 생각합니다",
  "기술 역량과 현장 경험을 동시에 갖춥니다",
  "도입부터 운영까지 끝까지 책임집니다",
  "투명한 커뮤니케이션으로 신뢰를 쌓습니다",
];

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-background">

      {/* ── Hero ─────────────────────────────── */}
      <section className="relative min-h-[calc(100vh-56px)] bg-zinc-950 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_50%,rgba(255,255,255,0.04),transparent)]" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_60%_80%_at_80%_30%,rgba(255,255,255,0.03),transparent)]" />
        <div className="absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-white/5 hidden lg:block" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 w-full">
          <div className="max-w-xl">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-[0.2em] mb-6">
              Vision Square · IT Solutions
            </p>
            <h1 className="text-5xl font-semibold text-white leading-[1.1] mb-6">
              기술로<br />
              비즈니스의<br />
              <span className="text-zinc-400">내일을 잇습니다.</span>
            </h1>
            <p className="text-base text-zinc-400 leading-relaxed mb-10 max-w-sm">
              비전스퀘어는 IT 인프라 구축부터 백업·재해복구, 유지보수까지
              고객사의 안정적인 운영을 위한 모든 솔루션을 제공합니다.
            </p>

            {/* CTA — 로그인 여부로 분기 */}
            <div className="flex flex-wrap gap-3">
              {user ? (
                <>
                  <Button
                    asChild
                    className="bg-white text-zinc-900 hover:bg-zinc-100 h-11 px-6 text-sm font-medium"
                  >
                    <Link href="/clients">
                      고객사 보기
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white h-11 px-6 text-sm bg-transparent"
                  >
                    <Link href="/docs">문서 보기</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    asChild
                    className="bg-white text-zinc-900 hover:bg-zinc-100 h-11 px-6 text-sm font-medium"
                  >
                    <Link href="/contact">
                      문의하기
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 hover:text-white h-11 px-6 text-sm bg-transparent"
                  >
                    <Link href="/login">엔지니어 로그인</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* 우측 장식 카드 */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 w-52">
            {["Luna", "PSE", "Backup"].map((product) => (
              <div
                key={product}
                className="border border-white/10 rounded-xl px-4 py-3 bg-white/5 backdrop-blur-sm"
              >
                <p className="text-xs text-zinc-500 mb-0.5">제품군</p>
                <p className="text-sm font-medium text-white">{product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Band ───────────────────────── */}
      <section className="bg-zinc-900 border-y border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-semibold text-white mb-1">{s.value}</p>
              <p className="text-sm text-zinc-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services ─────────────────────────── */}
      <section className="bg-background py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">
              핵심 역량
            </p>
            <h2 className="text-3xl font-semibold text-foreground leading-tight">
              고객사의 IT 환경을<br />처음부터 끝까지.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SERVICES.map((s) => (
              <div
                key={s.title}
                className="border rounded-xl p-6 hover:border-foreground/20 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center mb-4">
                  <s.icon className="size-4 text-background" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* ── Vision / Values ──────────────────── */}
      <section className="bg-zinc-950 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4">
                우리의 약속
              </p>
              <h2 className="text-3xl font-semibold text-white leading-tight mb-6">
                단순한 공급사가 아닌<br />
                <span className="text-zinc-400">신뢰할 수 있는 파트너.</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed mb-8">
                비전스퀘어는 제품 납품에서 끝나지 않습니다.
                고객사의 인프라가 안정적으로 운영되는 그날까지,
                함께 고민하고 함께 해결하는 파트너십을 지향합니다.
              </p>
              <Button
                asChild
                className="bg-white text-zinc-900 hover:bg-zinc-100"
              >
                <Link href="/contact">
                  파트너십 문의
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>

            <div className="space-y-4">
              {VALUES.map((v) => (
                <div
                  key={v}
                  className="flex items-start gap-3 border border-zinc-800 rounded-xl p-4 bg-zinc-900/50"
                >
                  <CheckCircle2 className="size-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-zinc-300">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-foreground py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-medium text-background/50 uppercase tracking-widest mb-4">
            {user ? "내부 시스템" : "시작하기"}
          </p>
          <h2 className="text-3xl font-semibold text-background leading-tight mb-4">
            {user ? "내부 관리 시스템으로\n이동하세요." : "지금 바로 상담을\n시작하세요."}
          </h2>
          <p className="text-sm text-background/60 mb-8 whitespace-pre-line">
            {user
              ? `${user.email}으로 로그인되어 있습니다.`
              : "비전스퀘어 전문 엔지니어가 귀사에 맞는 최적의 솔루션을 제안합니다."}
          </p>
          <div className="flex justify-center gap-3">
            {user ? (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-background/30 text-background bg-transparent hover:bg-background/10 hover:text-background h-11 px-6"
                >
                  <Link href="/docs">문서 보기</Link>
                </Button>
                <Button
                  asChild
                  className="bg-background text-foreground hover:bg-background/90 h-11 px-6"
                >
                  <Link href="/clients">
                    고객사 보기
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  className="border-background/30 text-background bg-transparent hover:bg-background/10 hover:text-background h-11 px-6"
                >
                  <Link href="/contact">문의하기</Link>
                </Button>
                <Button
                  asChild
                  className="bg-background text-foreground hover:bg-background/90 h-11 px-6"
                >
                  <Link href="/login">
                    엔지니어 로그인
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
