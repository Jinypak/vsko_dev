const features = [
  '민감정보 암호화 및 데이터 마스킹 정책 통합',
  '사용자/시스템 접근제어와 감사로그 추적',
  '규제 대응을 위한 리포팅 및 운영 대시보드 제공',
];

export default function PsePage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">PSE</p>
      <h1 className="text-4xl font-semibold text-slate-900">Thales PSE</h1>
      <p className="max-w-3xl text-slate-600">
        Thales PSE는 개인정보 처리 환경을 중앙에서 통제하고, 암호화와 접근통제를 통해
        내부·외부 위협에 대응하는 통합 보안 플랫폼입니다.
      </p>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li key={feature} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
}
