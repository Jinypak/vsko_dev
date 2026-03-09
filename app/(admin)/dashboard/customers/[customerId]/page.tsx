import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { customers } from '@/lib/admin-data';
import { Badge } from '@/components/ui/badge';
import CustomerDetailEditor from './CustomerDetailEditor';

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const customer = customers.find((item) => item.id === customerId);

  if (!customer) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Badge>Customer Detail</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">{customer.name}</h1>
        <p className="mt-2 text-sm text-slate-500">편집 모드에서 값을 바로 수정하고 새 히스토리를 추가할 수 있습니다.</p>
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
}
