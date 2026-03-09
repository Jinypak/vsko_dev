const capabilities = [
  '암호 키 생성/보관/폐기 전주기 관리',
  '금융·공공 규제 대응형 보안 아키텍처',
  '24/7 기술 지원 및 운영 자동화 컨설팅',
];

const sectors = [
  { title: '금융', desc: '전자금융감독규정 및 내부통제 기준에 최적화된 키관리 체계 구축' },
  { title: '공공', desc: '국가정보보안 기본지침 기반 인증 체계 및 접근통제 정책 설계' },
  { title: '엔터프라이즈', desc: '클라우드·온프레미스 혼합 환경에서의 데이터 보호 체계 확립' },
];

export default function Home() {
  return (
    <main>
      <section className="bg-gradient-to-br from-sky-100 via-indigo-50 to-slate-100 text-slate-800">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Next Security Standard</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-6xl">
            비전 스퀘어,
            <span className="block text-primary">기업 보안 인프라를 새롭게 설계합니다.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-base text-slate-600 md:text-lg">
            HSM과 PSE 중심의 고신뢰 보안 솔루션으로 고객의 핵심 데이터를 보호하고,
            규제 준수부터 운영 안정성까지 한 번에 해결합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/contact" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              도입 상담 요청
            </a>
            <a href="/product" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-slate-800">
              솔루션 둘러보기
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Core Capability</p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900">안전성과 확장성을 동시에</h2>
            <ul className="mt-6 space-y-3 text-slate-600">
              {capabilities.map((item) => (
                <li key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-sky-50 p-8">
            <p className="text-sm font-semibold text-indigo-700">대표 메시지</p>
            <p className="mt-4 text-lg leading-relaxed text-slate-700">
              “보안은 단일 솔루션이 아니라 설계와 운영의 결과입니다. 비전 스퀘어는 고객의
              비즈니스 환경에 맞는 현실적인 보안 아키텍처를 제공합니다.”
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Industry Focus</p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900">산업별 맞춤 보안 전략</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {sectors.map((sector) => (
              <div key={sector.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">{sector.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{sector.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
