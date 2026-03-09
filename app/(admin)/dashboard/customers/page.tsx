import Link from 'next/link';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { customers } from '@/lib/admin-data';

export default async function CustomerListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();

  const filteredCustomers = query
    ? customers.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase()))
    : customers;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Customer Management</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">고객사 관리</h1>
        <p className="mt-3 text-slate-600">계약 고객사 리스트를 조회하고, 고객사별 상세 운영 정보를 관리할 수 있습니다.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-4">
          <form className="rounded-2xl border border-slate-200 bg-white p-4" method="get">
            <label htmlFor="q" className="mb-2 block text-sm font-medium text-slate-700">
              고객사 검색
            </label>
            <div className="flex gap-2">
              <input
                id="q"
                name="q"
                defaultValue={query}
                placeholder="예: 삼성전자, SK하이닉스"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                검색
              </button>
            </div>
          </form>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">고객사</th>
                  <th className="px-4 py-3 font-medium">도입 HSM 수</th>
                  <th className="px-4 py-3 font-medium">대표 모델</th>
                  <th className="px-4 py-3 font-medium">상세</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-medium text-slate-900">{customer.name}</td>
                    <td className="px-4 py-3 text-slate-600">{customer.hsmCount}대</td>
                    <td className="px-4 py-3 text-slate-600">{customer.model}</td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/customers/${customer.id}`} className="font-semibold text-indigo-700">
                        상세 보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-500">검색 결과가 없습니다.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
