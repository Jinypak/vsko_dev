import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { customers } from '@/lib/admin-data';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Customer Detail</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">{customer.name}</h1>
        <p className="mt-3 text-slate-600">고객사 시스템 정보와 작업 히스토리를 한 곳에서 관리합니다.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">도입 장비 정보</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>HSM 개수: {customer.hsmCount}대</li>
                <li>모델: {customer.model}</li>
                <li>담당 엔지니어: {customer.engineer}</li>
              </ul>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold text-slate-500">SERIAL</p>
                <p className="mt-2 text-sm text-slate-700">{customer.serials.join(', ')}</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-lg font-semibold text-slate-900">고객사 담당자</h2>
              <div className="mt-3 space-y-3">
                {customer.contacts.map((contact) => (
                  <div key={contact.email} className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                    <p className="font-semibold text-slate-900">{contact.name}</p>
                    <p>{contact.team}</p>
                    <p>{contact.phone}</p>
                    <p>{contact.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">작업/상담 히스토리</h2>
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
              >
                + 새 기록 (예정)
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {customer.histories.map((history) => (
                <div key={`${history.dateTime}-${history.title}`} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold text-indigo-700">{history.dateTime}</p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{history.title}</p>
                  {history.note && <p className="mt-2 text-sm text-slate-600">{history.note}</p>}
                </div>
              ))}
            </div>
          </div>

          <Link href="/dashboard/customers" className="inline-flex text-sm font-semibold text-indigo-700">
            ← 고객사 리스트로 돌아가기
          </Link>
        </section>
      </div>
    </main>
  );
}
