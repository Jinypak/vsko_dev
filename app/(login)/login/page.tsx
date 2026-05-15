import LoginForm from "@/components/forms/loginForm";
import Image from "next/image";

const FEATURES = [
  { label: "고객사 통합 관리", desc: "고객사 기본 정보, 담당자, 계약 현황" },
  { label: "제품 & 계약 추적", desc: "납품 제품과 유지보수 상태 실시간 파악" },
  { label: "작업 히스토리", desc: "고객사별 작업 이력을 체계적으로 기록" },
];

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">

      {/* 좌측 — 폼 영역 */}
      <div className="flex flex-col w-full lg:w-[55%] h-full bg-background px-10 py-10">
        {/* 로고 */}
        <div className="flex items-center gap-2.5 mb-auto">
          <Image
            src="/assets/icons/vs_logo.png"
            alt="VISION SQUARE 로고"
            width={120}
            height={40}
            className="h-7 w-auto"
          />
        </div>

        {/* 폼 */}
        <div className="flex flex-col justify-center flex-1 max-w-[360px] w-full mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-1.5">
              로그인
            </h1>
            <p className="text-sm text-muted-foreground">
              내부 고객사 관리 시스템에 접속합니다.
            </p>
          </div>

          <LoginForm />
        </div>

        {/* 하단 여백 맞춤용 */}
        <div className="mt-auto pt-10">
          <p className="text-[11px] text-muted-foreground/50">
            © {new Date().getFullYear()} VISION SQUARE. All rights reserved.
          </p>
        </div>
      </div>

      {/* 우측 — 브랜드 패널 */}
      <div className="hidden lg:flex flex-col w-[45%] h-full bg-foreground px-12 py-14">
        {/* 상단 — 제품 소개 */}
        <div className="mt-auto">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
            VISION SQUARE
          </p>
          <h2 className="text-3xl font-semibold text-white leading-snug mb-4">
            고객사 정보를<br />한눈에 관리하세요.
          </h2>
          <p className="text-sm text-white/50 leading-relaxed mb-12">
            고객사 정보, 계약 현황, 작업 히스토리를 통합 관리하는
            내부 툴입니다.
          </p>

          {/* 기능 목록 */}
          <div className="space-y-5">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-white/40 mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-white/80">{f.label}</p>
                  <p className="text-xs text-white/40 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 — 장식 */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex gap-1.5">
            {["계약중", "유지보수 진행중", "작업 완료"].map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-white/30 border border-white/10 rounded-full px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
