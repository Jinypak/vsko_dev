const features = [
  'FIPS 기반의 강력한 키 보호 체계',
  '대량 트랜잭션 처리를 위한 고성능 암호 연산',
  'HA/이중화 구성을 통한 서비스 연속성 보장',
];

export default function HsmPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">HSM</p>
      <h1 className="text-4xl font-semibold text-slate-900">Thales Luna HSM</h1>
      <p className="max-w-3xl text-slate-600">
        Thales Luna HSM은 물리적으로 분리된 보안 하드웨어에서 암호키를 안전하게 관리하며,
        핵심 업무 시스템의 신뢰성을 높입니다.
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
