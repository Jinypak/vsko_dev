"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const PUBLIC_NAV = [
  { label: "소개", href: "/" },
  { label: "Contact", href: "/contact" },
];

const PRIVATE_NAV = [
  { label: "소개", href: "/" },
  { label: "고객사", href: "/clients" },
  { label: "문서", href: "/docs" },
  { label: "Contact", href: "/contact" },
];

const HIDDEN_PATHS = ["/login", "/dashboard"];

interface HeaderProps {
  user: User | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const initial = user?.email?.[0]?.toUpperCase() ?? "?";
  const navItems = user ? PRIVATE_NAV : PUBLIC_NAV;

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 bg-foreground rounded-md flex items-center justify-center shrink-0">
            <span className="text-background text-[10px] font-semibold leading-none">VS</span>
          </div>
          <span className="text-sm font-medium text-foreground group-hover:text-muted-foreground transition-colors">
            VISION SQUARE
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={isActive(item.href) ? "secondary" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        {/* 우측 — 로그인 상태에 따라 분기 */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              {/* 유저 아바타 + 이메일 */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[11px] font-semibold text-foreground shrink-0">
                  {initial}
                </div>
                <span className="hidden sm:block max-w-[140px] truncate">
                  {user.email}
                </span>
              </div>

              {/* 로그아웃 */}
              <form action={signOut}>
                <Button type="submit" variant="ghost" size="sm">
                  로그아웃
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/login">시작하기</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
