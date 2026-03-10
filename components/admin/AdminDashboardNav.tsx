import Link from 'next/link';

const items = [
  { href: '/dashboard', label: '통계' },
  { href: '/dashboard/customers', label: '고객사 관리' },
];

export default function AdminDashboardNav() {
  return (
    <aside className="w-full rounded-2xl border border-slate-200 bg-white p-3 md:w-52 md:shrink-0 lg:w-56">
      <p className="px-2 pb-3 text-sm font-semibold text-slate-900">관리자 메뉴</p>
      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <a
        href="/api/auth/logout"
        className="mt-4 block rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
      >
        로그아웃
      </a>
    </aside>
  );
}
