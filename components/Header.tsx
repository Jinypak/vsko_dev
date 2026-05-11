"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "소개", href: "/" },
  { label: "문서", href: "/docs" },
  { label: "고객사", href: "/clients" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center">
            <span className="text-white text-[10px] font-semibold leading-none">C</span>
          </div>
          <span className="text-sm font-medium text-gray-800 group-hover:text-gray-600 transition-colors">
            ClientOS
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                isActive(item.href)
                  ? "bg-gray-100 text-gray-900 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors px-2 py-1">
            로그인
          </button>
          <button className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors">
            시작하기
          </button>
        </div>
      </div>
    </header>
  );
}
