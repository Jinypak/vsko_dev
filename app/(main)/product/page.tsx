const products = [
  {
    title: 'Thales Luna HSM',
    desc: '암호 키를 안전하게 생성·저장하고 고속 암호연산을 지원하는 하드웨어 기반 보안 모듈',
    href: '/product/hsm',
  },
  {
    title: 'Thales PSE',
    desc: '개인정보 보호를 위한 암호화, 접근제어, 감사로그 통합 플랫폼',
    href: '/product/pse',
  },
];

export default function ProductPage() {
  return (
    <section className="space-y-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Products</p>
      <h1 className="text-4xl font-semibold text-slate-900">비전 스퀘어 솔루션 포트폴리오</h1>
      <p className="max-w-3xl text-slate-600">
        비전 스퀘어는 신뢰 기반의 암호 인프라를 위해 검증된 글로벌 솔루션을 제공합니다.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {products.map((product) => (
          <a
            key={product.title}
            href={product.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-900">{product.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{product.desc}</p>
            <p className="mt-5 text-sm font-semibold text-indigo-700">자세히 보기 →</p>
          </a>
        ))}
      </div>
    </section>
  );
}
