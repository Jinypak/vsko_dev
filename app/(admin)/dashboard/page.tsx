import Link from 'next/link';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';

const stats = [
  { label: '계약 고객사', value: '2곳' },
  { label: '운영중 HSM', value: '20대' },
  { label: '금주 히스토리 등록', value: '5건' },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">관리자 대시보드</h1>
        <p className="mt-3 text-slate-600">통계 페이지 내용은 추후 확정 예정이며, 현재는 기본 구조만 구성했습니다.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">다음 단계 제안</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>주간/월간 장애 및 문의 추세 차트</li>
              <li>고객사별 SLA 이행률 카드</li>
              <li>엔지니어별 작업 분배 현황</li>
            </ul>
            <Link href="/dashboard/customers" className="mt-5 inline-flex text-sm font-semibold text-indigo-700">
              고객사 관리 바로가기 →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
