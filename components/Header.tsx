import React from 'react';
import Link from 'next/link';
import { LayoutDashboard } from 'lucide-react';
import ProductList from './ProductList';
import HamburgerMenu from './mobile/HamburgerMenu';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-slate-50/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/80 text-sm font-bold text-primary-foreground">
            VS
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">VISION SQUARE</p>
            <p className="text-xs text-slate-500">Enterprise Security Partner</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <ProductList />
          <Link
            href="/dashboard"
            className="hidden items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 md:inline-flex"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
          </Link>
          <HamburgerMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
