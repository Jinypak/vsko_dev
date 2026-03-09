const milestones = [
  { year: '2010', detail: '비전 스퀘어 설립 및 보안 컨설팅 사업 시작' },
  { year: '2016', detail: '금융권 HSM 구축 프로젝트 다수 수행' },
  { year: '2020', detail: 'PSE 기반 통합 개인정보보호 체계 고도화' },
  { year: '2024', detail: '클라우드 보안 운영 자동화 서비스 확장' },
];

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">About Us</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">신뢰할 수 있는 보안 파트너</h1>
        <p className="mt-6 max-w-3xl text-slate-600">
          비전 스퀘어는 기업의 핵심 데이터 보호를 위해 암호 인프라 설계, 구축, 운영 전 과정을
          지원합니다. 고객 비즈니스의 연속성과 규제 준수를 동시에 달성하는 것이 우리의 목표입니다.
        </p>
      </section>

      <section className="bg-slate-50">
        <div className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-slate-900">주요 연혁</h2>
          <div className="mt-8 space-y-4">
            {milestones.map((item) => (
              <div key={item.year} className="flex gap-6 rounded-xl border border-slate-200 bg-white px-5 py-4">
                <p className="w-16 text-sm font-semibold text-indigo-700">{item.year}</p>
                <p className="text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
