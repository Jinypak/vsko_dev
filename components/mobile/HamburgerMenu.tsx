'use client';

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import Link from 'next/link';
import React from 'react';

const HamburgerMenu = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="block md:hidden">
      <Sheet>
        <SheetTrigger className="rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium">
          메뉴
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-center">비전 스퀘어</SheetTitle>
            <SheetDescription className="mt-6 flex flex-col gap-2 text-center text-slate-700">
              <SheetClose asChild>
                <Link href="/" className="rounded-xl p-3 transition hover:bg-slate-100">
                  홈
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/about" className="rounded-xl p-3 transition hover:bg-slate-100">
                  회사 소개
                </Link>
              </SheetClose>
              <button
                className="rounded-xl p-3 transition hover:bg-slate-100"
                onClick={() => setOpen(!open)}
                type="button"
              >
                제품 소개
              </button>
              {open && (
                <div className="flex flex-col items-center justify-center">
                  <SheetClose asChild>
                    <Link
                      href="/product"
                      className="rounded-xl p-3 text-sm transition hover:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      제품 개요
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/product/hsm"
                      className="rounded-xl p-3 text-sm transition hover:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      HSM
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/product/pse"
                      className="rounded-xl p-3 text-sm transition hover:bg-slate-100"
                      onClick={() => setOpen(false)}
                    >
                      PSE
                    </Link>
                  </SheetClose>
                </div>
              )}
              <SheetClose asChild>
                <Link href="/contact" className="rounded-xl p-3 transition hover:bg-slate-100">
                  문의하기
                </Link>
              </SheetClose>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default HamburgerMenu;
