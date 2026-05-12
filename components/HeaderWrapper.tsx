"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";

const HIDDEN_PATHS = ["/login", "/dashboard"];

export default function HeaderWrapper() {
  const pathname = usePathname();
  const hidden = HIDDEN_PATHS.some((p) => pathname.startsWith(p));
  if (hidden) return null;
  return <Header />;
}
