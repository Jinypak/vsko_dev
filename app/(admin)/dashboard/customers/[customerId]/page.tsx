import Link from 'next/link';
import { notFound } from 'next/navigation';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { customers } from '@/lib/admin-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>도입 장비 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <p>HSM 개수: {customer.hsmCount}대</p>
                <p>모델: {customer.model}</p>
                <p>담당 엔지니어: {customer.engineer}</p>
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs font-semibold text-muted-foreground">SERIAL</p>
                  <p className="mt-1">{customer.serials.join(', ')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>고객사 담당자</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.contacts.map((contact) => (
                  <div key={contact.email} className="rounded-md border border-slate-100 p-3 text-sm text-slate-600">
                    <p className="font-semibold text-slate-700">{contact.name}</p>
                    <p>{contact.team}</p>
                    <p>{contact.phone}</p>
                    <p>{contact.email}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>작업/상담 히스토리</CardTitle>
              <Button size="sm" variant="outline">+ 새 기록 (예정)</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.histories.map((history) => (
                <div key={`${history.dateTime}-${history.title}`} className="rounded-md border border-slate-100 bg-slate-50/70 p-4">
                  <p className="text-xs font-semibold text-primary">{history.dateTime}</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{history.title}</p>
                  {history.note && <p className="mt-1.5 text-sm text-slate-600">{history.note}</p>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Link href="/dashboard/customers" className="inline-flex text-sm font-semibold text-primary">← 고객사 리스트로 돌아가기</Link>
        </section>
      </div>
    </main>
  );
}
