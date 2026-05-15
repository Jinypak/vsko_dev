"use client";

import { useTransition, useRef, useState } from "react";
import { sendContactEmail } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SELECT_CLS = "w-full h-9 px-3 text-sm border border-input rounded-md bg-transparent focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring transition-[color,box-shadow] text-foreground";
const TEXTAREA_CLS = "w-full px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:border-ring transition-[color,box-shadow] resize-none placeholder:text-muted-foreground";

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await sendContactEmail(formData);
      if (result.success) {
        setSubmitted(true);
        formRef.current?.reset();
      } else {
        setError(result.error ?? "오류가 발생했습니다.");
      }
    });
  };

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="max-w-md mx-auto text-center py-24">
          <div className="w-11 h-11 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-foreground mb-2">문의가 전달됐습니다</h2>
          <p className="text-sm text-muted-foreground mb-8">
            평일 기준 24시간 이내로 회신드리겠습니다.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSubmitted(false)}
          >
            새 문의 작성
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-xl font-semibold text-foreground mb-1">문의하기</h1>
        <p className="text-sm text-muted-foreground">
          궁금하신 점이나 도움이 필요하신 경우 아래 양식을 작성해 주세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
        {/* 폼 */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">이름</Label>
              <Input name="name" required placeholder="홍길동" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">이메일 (회신 받으실 주소)</Label>
              <Input type="email" name="email" required placeholder="example@company.kr" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">문의 유형</Label>
            <select name="subject" required defaultValue="" className={SELECT_CLS}>
              <option value="" disabled>선택해주세요</option>
              <option value="sales">도입 문의</option>
              <option value="qna">기술 문의</option>
              <option value="support">지원 요청</option>
              <option value="etc">기타</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">내용</Label>
            <textarea
              name="message"
              required
              rows={7}
              placeholder="문의 내용을 자유롭게 작성해주세요."
              className={TEXTAREA_CLS}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "전송 중..." : "보내기"}
          </Button>
        </form>

        {/* 안내 */}
        <div className="space-y-6 pt-1">
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              안내
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">응답 시간</p>
                  <p className="text-xs text-muted-foreground mt-0.5">평일 기준 24시간 이내</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">회신 방법</p>
                  <p className="text-xs text-muted-foreground mt-0.5">입력하신 이메일로 직접 회신드립니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">긴급 지원</p>
                  <p className="text-xs text-muted-foreground mt-0.5">기존 고객사의 긴급 장애는 담당 엔지니어에게 직접 연락해주세요.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
