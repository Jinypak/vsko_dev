const stats = [
  { label: '보안 인증 프로젝트', value: '120+' },
  { label: '공공/금융 고객사', value: '60+' },
  { label: '솔루션 운영 연수', value: '15년' },
];

const products = [
  {
    title: 'HSM (Hardware Security Module)',
    description:
      '국내외 표준을 만족하는 키 관리와 암호 연산을 위한 고성능 보안 모듈.',
    points: ['국제 표준 인증 지원', '키 수명주기 자동화', '고가용성 클러스터'],
  },
  {
    title: 'PSE (Private Security Environment)',
    description:
      '개인정보 보호를 위한 접근 제어, 암·복호화, 감사 로그 통합 플랫폼.',
    points: ['실시간 모니터링', '정책 기반 접근 제어', '데이터 마스킹 지원'],
  },
];

const values = [
  {
    title: '신뢰 기반 보안',
    description: '검증된 암호 기술과 투명한 운영으로 신뢰를 구축합니다.',
  },
  {
    title: '지속 가능한 운영',
    description: '서비스 안정성과 확장성을 고려한 아키텍처를 제공합니다.',
  },
  {
    title: '맞춤형 기술 지원',
    description: '전담 엔지니어가 도입부터 운영까지 함께합니다.',
  },
];

export default function Home() {
  return (
    <main className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-900 text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-20 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Vision Square Security
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              미래형 보안을 설계하는
              <span className="block text-indigo-200">기업 전용 암호 인프라</span>
            </h1>
            <p className="text-base text-slate-200 md:text-lg">
              비전 스퀘어는 금융·공공·기업 고객을 위한 HSM과 PSE 솔루션을
              제공합니다. 인증된 보안 모듈과 안정적인 기술 지원으로 핵심 데이터를
              보호합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
              >
                상담 문의하기
              </a>
              <a
                href="/product"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white"
              >
                제품 살펴보기
              </a>
            </div>
          </div>
          <div className="flex-1">
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="space-y-2">
                <p className="text-sm text-indigo-100">솔루션 구축 프로세스</p>
                <h2 className="text-2xl font-semibold">보안 진단 → 설계 → 구축 → 운영</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl bg-white/10 p-4">
                    <p className="text-2xl font-semibold">{stat.value}</p>
                    <p className="text-xs text-indigo-100">{stat.label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-indigo-100">
                “고객의 보안을 설계하는 파트너가 되겠습니다.”
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto w-full max-w-6xl space-y-12 px-6 py-20">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
              Company
            </p>
            <h2 className="text-3xl font-semibold">기업 보안을 위한 전문성</h2>
            <p className="max-w-3xl text-base text-slate-600">
              비전 스퀘어는 암호 모듈, 보안 정책, 운영 자동화 분야의 경험을
              기반으로 기업 맞춤형 보안 아키텍처를 구축합니다. 고객의
              비즈니스 연속성을 최우선으로 고려합니다.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl space-y-10 px-6 py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Products
              </p>
              <h2 className="text-3xl font-semibold">보안 핵심 솔루션</h2>
              <p className="max-w-2xl text-base text-slate-600">
                핵심 인프라를 보호하는 HSM과 개인정보를 보호하는 PSE로 보안
                체계를 완성합니다.
              </p>
            </div>
            <a
              href="/product"
              className="text-sm font-semibold text-indigo-700 hover:text-indigo-500"
            >
              모든 제품 보기 →
            </a>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <div
                key={product.title}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {product.title}
                  </h3>
                  <p className="text-sm text-slate-600">{product.description}</p>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {product.points.map((point) => (
                      <li key={point} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href="/product"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700"
                >
                  자세히 보기 →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-indigo-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-20 text-white md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold">프로젝트 상담이 필요하신가요?</h2>
            <p className="max-w-2xl text-sm text-indigo-100">
              전문 컨설턴트가 보안 요구사항을 진단하고 최적의 솔루션을
              제안합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-900"
            >
              문의하기
            </a>
            <a
              href="/about"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
            >
              회사 소개
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
