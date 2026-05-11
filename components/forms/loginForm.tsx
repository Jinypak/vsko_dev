"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1. 로컬 어드민 계정 시도
    const localRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (localRes.ok) {
      router.push("/clients");
      router.refresh();
      return;
    }

    // 2. Supabase Auth fallback (환경변수가 설정된 경우)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const { createBrowserClient } = await import("@supabase/ssr");
        const supabase = createBrowserClient(supabaseUrl, supabaseKey);
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!authError) {
          router.push("/clients");
          router.refresh();
          return;
        }
      } catch {
        // Supabase 미설정 시 무시
      }
    }

    setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[360px]">
      <div>
        <label className="block text-[11px] text-gray-400 mb-1.5">이메일</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="admin@visionsquare.com"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
        />
      </div>
      <div>
        <label className="block text-[11px] text-gray-400 mb-1.5">비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
        />
      </div>

      {error && <p className="text-[12px] text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
