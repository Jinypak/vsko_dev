import AdminDashboardNav from '@/components/admin/AdminDashboardNav';
import { Badge } from '@/components/ui/badge';

export default function CustomersLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      <div className="mb-6">
        <Badge>Customer Management</Badge>
        <h1 className="mt-2 text-3xl font-semibold text-slate-800">고객사 관리</h1>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <AdminDashboardNav />

        <section className="flex-1 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-64 animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-4 w-52 animate-pulse rounded bg-slate-100" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-10 w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="space-y-3">
            <div className="h-24 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
            <div className="h-24 w-full animate-pulse rounded-xl border border-slate-200 bg-slate-100" />
          </div>
        </section>
      </div>
    </main>
  );
}
