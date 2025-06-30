'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

import Link from 'next/link';
import React from 'react';

const HamburgerMenu = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="md:hidden block hover:cursor-pointer">
      <Sheet>
        <SheetTrigger>HAM</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-center">비전 스퀘어</SheetTitle>
            <SheetDescription className="flex flex-col text-center">
              <SheetClose asChild>
                <Link
                  href="/about"
                  className="hover:bg-gray-400 transition p-4 rounded-2xl"
                >
                  회사 소개
                </Link>
              </SheetClose>
              <div
                className="hover:bg-gray-400 transition p-4 rounded-2xl"
                onClick={() => setOpen(!open)}
              >
                제품 소개
              </div>
              {open && (
                <div className="flex flex-col items-center justify-center">
                  <SheetClose asChild>
                    <Link
                      href="/product/hsm"
                      className="hover:bg-gray-400 transition p-4 rounded-2xl"
                      onClick={() => setOpen(false)}
                    >
                      HSM
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/product/pse"
                      className="hover:bg-gray-400 transition p-4 rounded-2xl"
                      onClick={() => setOpen(false)}
                    >
                      PSE
                    </Link>
                  </SheetClose>
                </div>
              )}
              <SheetClose asChild>
                <Link
                  href="/contact"
                  className="hover:bg-gray-400 transition p-4 rounded-2xl"
                >
                  Contact
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
