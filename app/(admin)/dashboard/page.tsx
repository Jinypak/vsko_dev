import Link from 'next/link';
import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getCustomerRepository } from '@/lib/data/customer-repository';
import { getTrafficRepository, type TrafficSummary } from '@/lib/analytics/traffic-repository';

const emptyTrafficSummary: TrafficSummary = {
  totalVisits: 0,
  todayVisits: 0,
  last7DaysVisits: 0,
  uniquePathsLast7Days: 0,
  topPagesLast7Days: [],
  dailyVisitsLast7Days: [],
};

export default async function AdminDashboardPage() {
  let errorMessage: string | null = null;
  let customerCount = 0;
  let hsmTotal = 0;
  let traffic = emptyTrafficSummary;

  const [customersResult, trafficResult] = await Promise.allSettled([
    getCustomerRepository().list(),
    getTrafficRepository().getSummary(),
  ]);

  const errors: string[] = [];

  if (customersResult.status === 'fulfilled') {
    customerCount = customersResult.value.length;
    hsmTotal = customersResult.value.reduce((sum, customer) => sum + customer.hsmCount, 0);
  } else {
    errors.push(
      customersResult.reason instanceof Error
        ? customersResult.reason.message
        : '고객사 데이터를 불러오지 못했습니다.',
    );
  }

  if (trafficResult.status === 'fulfilled') {
    traffic = trafficResult.value;
  } else {
    errors.push(
      trafficResult.reason instanceof Error
        ? trafficResult.reason.message
        : '접속 통계 데이터를 불러오지 못했습니다.',
    );
  }

  if (errors.length > 0) {
    errorMessage = errors.join(' | ');
  }

  const stats = [
    { label: '계약 고객사', value: `${customerCount}곳` },
    { label: '운영중 HSM', value: `${hsmTotal}대` },
    { label: '오늘 홈페이지 방문', value: `${traffic.todayVisits}회` },
    { label: '최근 7일 방문', value: `${traffic.last7DaysVisits}회` },
    { label: '최근 7일 방문 페이지', value: `${traffic.uniquePathsLast7Days}개` },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Badge>Admin</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">관리자 대시보드</h1>
        <p className="mt-2 text-slate-500">홈페이지 접속량과 고객사 운영 현황을 한 번에 확인할 수 있습니다.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-6">
          {errorMessage && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-700">설정 오류 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">{errorMessage}</p>
                <p className="mt-2 text-xs text-red-600">
                  `.env.local`에 `DATABASE_URL`(Neon pooled/direct)을 설정한 뒤 서버를 재시작해 주세요.
                </p>
              </CardContent>
            </Card>
          )}

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

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>최근 7일 일별 방문수</CardTitle>
              </CardHeader>
              <CardContent>
                {traffic.dailyVisitsLast7Days.length === 0 ? (
                  <p className="text-sm text-slate-500">아직 수집된 방문 데이터가 없습니다.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {traffic.dailyVisitsLast7Days.map((item) => (
                      <li key={item.date} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                        <span>{item.date}</span>
                        <span className="font-semibold">{item.count}회</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>인기 페이지 TOP 5 (7일)</CardTitle>
              </CardHeader>
              <CardContent>
                {traffic.topPagesLast7Days.length === 0 ? (
                  <p className="text-sm text-slate-500">아직 수집된 방문 데이터가 없습니다.</p>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-700">
                    {traffic.topPagesLast7Days.map((item) => (
                      <li key={item.path} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                        <span>{item.path}</span>
                        <span className="font-semibold">{item.count}회</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-slate-50/80">
            <CardHeader>
              <CardTitle>메모</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-slate-600">
                <li>현재 접속량은 방문 이벤트 기반(페이지 진입 1회)으로 집계됩니다.</li>
                <li>정확한 운영 통계를 위해 Supabase의 `traffic_events` 테이블 연결을 권장합니다.</li>
              </ul>
              <Link
                href="/dashboard/customers"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                고객사 관리 바로가기
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
