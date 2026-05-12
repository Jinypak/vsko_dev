"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-gray-800 mb-2">전송 완료!</h2>
          <p className="text-sm text-gray-400 mb-6">메시지가 전송되었습니다. 빠르게 답변드리겠습니다.</p>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
            className="text-sm border border-gray-200 text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            새 메시지 작성
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-medium text-gray-900 mb-1">Contact</h1>
        <p className="text-[13px] text-gray-400">궁금하신 점이나 도움이 필요하신 경우 연락주세요.</p>
      </div>

      <div className="grid grid-cols-[1fr_280px] gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5">이름</label>
              <input
                type="text" name="name" required
                value={form.name} onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-[11px] text-gray-400 mb-1.5">이메일</label>
              <input
                type="email" name="email" required
                value={form.email} onChange={handleChange}
                placeholder="example@email.com"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors placeholder:text-gray-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">문의 유형</label>
            <select
              name="subject" required
              value={form.subject} onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors text-gray-600 bg-white"
            >
              <option value="">선택해주세요</option>
              <option value="sales">도입 문의</option>
              <option value="qna">기술 문의</option>
              <option value="support">지원 요청</option>
              <option value="etc">기타</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-400 mb-1.5">내용</label>
            <textarea
              name="message" required rows={6}
              value={form.message} onChange={handleChange}
              placeholder="문의 내용을 자유롭게 작성해주세요."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors resize-none placeholder:text-gray-300"
            />
          </div>

          <button
            type="submit"
            className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            보내기
          </button>
        </form>

        {/* Info */}
        <div className="space-y-5">
          {[
            { icon: "📧", label: "이메일", value: "easy@vsko.co.kr" },
            { icon: "💬", label: "응답 시간", value: "평일 기준 24시간 이내" },
            { icon: "📞", label: "전화", value: "010-4722-3360" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <p className="text-[11px] text-gray-400">{item.label}</p>
                <p className="text-sm text-gray-700">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
