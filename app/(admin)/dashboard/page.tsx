import Link from 'next/link';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const stats = [
  { label: '계약 고객사', value: '2곳' },
  { label: '운영중 HSM', value: '20대' },
  { label: '금주 히스토리 등록', value: '5건' },
];

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Badge>Admin</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">관리자 대시보드</h1>
        <p className="mt-2 text-slate-500">통계 페이지는 현재 구조와 UI 중심으로 구성했습니다.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-white/90">
                <CardHeader className="pb-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-slate-50/80">
            <CardHeader>
              <CardTitle>다음 단계 제안</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                <li>주간/월간 장애 및 문의 추세 차트</li>
                <li>고객사별 SLA 이행률 카드</li>
                <li>엔지니어별 작업 분배 현황</li>
              </ul>
              <Link href="/dashboard/customers" className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">고객사 관리 바로가기</Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
