export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { getCustomerRepository, getCustomerRepositoryInfo } from '@/lib/data/customer-repository';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomerDetailEditor from './CustomerDetailEditor';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const repositoryInfo = getCustomerRepositoryInfo();

  try {
    const repository = getCustomerRepository();
    const customer = await repository.getById(customerId);

    if (!customer) notFound();

    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6">
          <Badge>Customer Detail</Badge>
          <h1 className="mt-2 text-3xl font-semibold text-slate-800">{customer.name}</h1>
          <p className="mt-2 text-sm text-slate-500">편집 모드에서 값을 바로 수정하고 새 히스토리를 추가할 수 있습니다.</p>
          <p className="mt-1 text-xs text-slate-400">
            data source: {repositoryInfo.provider}
            {repositoryInfo.table ? ` / ${repositoryInfo.table}` : ''}
            {repositoryInfo.supabaseUrlHost ? ` / ${repositoryInfo.supabaseUrlHost}` : ''}
          </p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <AdminDashboardNav />
          <CustomerDetailEditor customer={customer} />
        </div>

        <Link href="/dashboard/customers" className="mt-6 inline-flex text-sm font-semibold text-primary">
          ← 고객사 리스트로 돌아가기
        </Link>
      </main>
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '고객사 상세 데이터를 불러오는 중 오류가 발생했습니다.';

    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12">
        <div className="mb-6">
          <Badge>Customer Detail</Badge>
          <h1 className="mt-2 text-3xl font-semibold text-slate-800">고객사 상세</h1>
        </div>

        <div className="flex flex-col gap-6 md:flex-row">
          <AdminDashboardNav />
          <Card className="flex-1 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">설정 오류 안내</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700">{message}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }
}
