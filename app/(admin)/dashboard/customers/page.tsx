export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const preferredRegion = 'sin1';

import Link from 'next/link';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { getCustomerRepository, getCustomerRepositoryInfo } from '@/lib/data/customer-repository';
import type { Customer } from '@/lib/admin-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AddCustomerForm from './AddCustomerForm';

export default async function CustomerListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();
  const repositoryInfo = getCustomerRepositoryInfo();

  let filteredCustomers: Customer[] = [];
  let listErrorMessage = '';

  try {
    const repository = getCustomerRepository();
    filteredCustomers = await repository.list(query);
  } catch (error) {
    console.error('[dashboard/customers] list failed', error);
    listErrorMessage = '고객사 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    filteredCustomers = [];
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Badge>Customer Management</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">고객사 관리</h1>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">현재 데이터 소스</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-slate-600">
              <p>provider: {repositoryInfo.provider}</p>
              <p>mode: {repositoryInfo.provider === 'drizzle' ? 'DATABASE_URL(Neon/Drizzle)' : 'memory fallback'}</p>
              {repositoryInfo.table && <p>table: {repositoryInfo.table}</p>}
              {repositoryInfo.dbHost && <p>db host: {repositoryInfo.dbHost}</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">고객사 검색</CardTitle>
            </CardHeader>
            <CardContent>
              <form method="get" className="flex gap-2">
                <Input name="q" defaultValue={query} placeholder="예: 삼성전자, SK하이닉스" />
                <Button type="submit">검색</Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {filteredCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/dashboard/customers/${customer.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-primary/40 hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-base font-semibold text-slate-800">{customer.name}</p>
                  <p className="text-xs font-semibold text-primary">클릭하여 상세 보기</p>
                </div>
                <div className="mt-2 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
                  <p>도입 HSM 수: {customer.hsmCount}대</p>
                  <p>대표 모델: {customer.model}</p>
                </div>
              </Link>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="space-y-3">
              <p className="rounded-xl border border-slate-200 bg-white px-4 py-6 text-sm text-muted-foreground">
                {listErrorMessage || '검색 결과가 없습니다.'}
              </p>
              <AddCustomerForm />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
