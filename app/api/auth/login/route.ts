import { NextRequest, NextResponse } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@visionsquare.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin1234";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("vs_admin", "1", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });
    return res;
  }

  return NextResponse.json(
    { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
    { status: 401 }
  );
}
