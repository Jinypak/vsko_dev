const channels = [
  { title: '도입 문의', value: 'sales@vsko.co.kr' },
  { title: '기술 지원', value: 'support@vsko.co.kr' },
  { title: '대표 번호', value: '02-0000-0000' },
];

export default function ContactPage() {
  return (
    <main className="bg-slate-50">
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Contact</p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">프로젝트 상담 문의</h1>
        <p className="mt-5 max-w-2xl text-slate-600">
          산업/규제 환경, 현재 인프라 상황을 간단히 공유해 주시면 적합한 보안 아키텍처를 제안해 드립니다.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {channels.map((channel) => (
            <div key={channel.title} className="rounded-2xl border border-slate-200 bg-white p-6">
              <p className="text-sm font-medium text-slate-500">{channel.title}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{channel.value}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
