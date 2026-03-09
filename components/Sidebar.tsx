import Link from 'next/link';
import React from 'react';

const links = [
  { href: '/product', label: '제품 개요' },
  { href: '/product/hsm', label: 'Thales Luna HSM' },
  { href: '/product/pse', label: 'Thales PSE' },
];

const Sidebar = () => {
  return (
    <aside className="sticky top-24 hidden h-fit min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 p-4 md:block">
      <p className="px-2 pb-3 text-sm font-semibold text-slate-900">제품 소개</p>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
