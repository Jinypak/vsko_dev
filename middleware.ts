import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 실제 인증 및 관리자 확인 로직으로 교체해야 합니다.
  const isAuthenticated = false;
  const isAdmin = false;

  const loginPageUrl = new URL('/auth/sign-in', request.url); // 로그인 페이지 경로
  const adminDashboardUrl = new URL('/dashboard', request.url); // 관리자 대시보드 경로 (예시)
  const mainDashboardUrl = new URL('/product', request.url); // 일반 사용자 대시보드 경로 (예시)

  const currentPath = request.nextUrl.pathname;

  // 1. 루트 경로 ('/') 접근 시 처리
  if (currentPath === '/') {
    if (!isAuthenticated) {
      // 인증되지 않았다면 로그인 페이지로 리다이렉트
      return NextResponse.redirect(loginPageUrl);
    } else if (isAdmin) {
      // 인증되었고 관리자라면 관리자 대시보드로 리다이렉트
      return NextResponse.redirect(adminDashboardUrl);
    } else {
      // 인증되었지만 관리자가 아니라면 일반 사용자 대시보드로 리다이렉트
      return NextResponse.redirect(mainDashboardUrl);
    }
  }

  // 2. 관리자 경로 ('/dashboard' 등 실제 관리자 페이지) 접근 시 처리
  // (이 예시에서는 /dashboard를 관리자 대시보드로 가정)
  if (currentPath.startsWith('/dashboard')) {
    // 실제 관리자 페이지의 경로에 따라 수정
    if (!isAuthenticated) {
      return NextResponse.redirect(loginPageUrl); // 인증되지 않았다면 로그인 페이지로
    }
    if (!isAdmin) {
      return NextResponse.redirect(mainDashboardUrl); // 관리자가 아니라면 일반 사용자 대시보드로
    }
  }

  // 3. 로그인 페이지 접근 시 처리
  if (currentPath.startsWith('/auth/sign-in')) {
    if (isAuthenticated) {
      // 이미 로그인했다면 (관리자 여부에 따라) 해당 대시보드로 리다이렉트
      if (isAdmin) {
        return NextResponse.redirect(adminDashboardUrl);
      } else {
        return NextResponse.redirect(mainDashboardUrl);
      }
    }
  }

  // 위의 조건에 해당하지 않으면 요청을 계속 진행
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/', // 루트 경로
    '/dashboard/:path*', // 관리자 대시보드 및 하위 경로 (실제 관리자 경로로 변경하세요)
    '/auth/sign-in', // 로그인 페이지
  ],
};
