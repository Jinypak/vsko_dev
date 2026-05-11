import { NextResponse, type NextRequest } from "next/server";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function getSupabaseUser(request: NextRequest) {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const { createServerClient } = await import("@supabase/ssr");
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    });
    const { data } = await supabase.auth.getUser();
    return data.user ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname.startsWith("/login");
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/contact") ||
    pathname.startsWith("/docs") ||
    pathname.startsWith("/api/");

  // 로컬 어드민 쿠키 확인
  const isAdminCookie = request.cookies.get("vs_admin")?.value === "1";

  // Supabase 세션 확인 (설정된 경우에만)
  const supabaseUser = isAdminCookie ? null : await getSupabaseUser(request);

  const isAuthenticated = isAdminCookie || !!supabaseUser;

  // 비인증 → 보호 경로 차단
  if (!isAuthenticated && !isLoginPage && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 인증 완료 → 로그인 페이지 접근 시 고객사 목록으로
  if (isAuthenticated && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/clients";
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
