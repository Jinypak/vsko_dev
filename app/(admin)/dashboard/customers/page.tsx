import Link from 'next/link';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { customers } from '@/lib/admin-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
        <Badge>Customer Management</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">고객사 관리</h1>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-4">
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

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
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
                      <tr key={customer.id} className="border-t border-slate-100">
                        <td className="px-4 py-3 font-medium text-slate-700">{customer.name}</td>
                        <td className="px-4 py-3 text-slate-600">{customer.hsmCount}대</td>
                        <td className="px-4 py-3 text-slate-600">{customer.model}</td>
                        <td className="px-4 py-3">
                          <Link href={`/dashboard/customers/${customer.id}`} className="text-sm font-semibold text-primary">
                            상세 보기
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredCustomers.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-foreground">검색 결과가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
