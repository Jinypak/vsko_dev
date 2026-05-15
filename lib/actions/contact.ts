"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUBJECT_LABELS: Record<string, string> = {
  sales:   "도입 문의",
  qna:     "기술 문의",
  support: "지원 요청",
  etc:     "기타",
};

export async function sendContactEmail(formData: FormData) {
  const name    = (formData.get("name")    as string).trim();
  const email   = (formData.get("email")   as string).trim();
  const subject = (formData.get("subject") as string).trim();
  const message = (formData.get("message") as string).trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "모든 항목을 입력해주세요." };
  }

  const subjectLabel = SUBJECT_LABELS[subject] ?? subject;

  const { error } = await resend.emails.send({
    from:    "VISION SQUARE 문의 <onboarding@resend.dev>",
    to:      "jiny3360@vsko.co.kr",
    replyTo: email,
    subject: `[문의] ${subjectLabel} — ${name}`,
    html: `
      <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; color: #111;">
        <div style="border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px;">
          <p style="font-size: 12px; color: #6b7280; margin: 0;">VISION SQUARE 홈페이지 문의</p>
          <h2 style="font-size: 20px; margin: 4px 0 0;">${subjectLabel}</h2>
        </div>

        <table style="width: 100%; font-size: 14px; border-collapse: collapse; margin-bottom: 24px;">
          <tr>
            <td style="color: #6b7280; padding: 6px 0; width: 80px;">이름</td>
            <td style="padding: 6px 0;">${name}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 6px 0;">이메일</td>
            <td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #111;">${email}</a></td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 6px 0;">문의 유형</td>
            <td style="padding: 6px 0;">${subjectLabel}</td>
          </tr>
        </table>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
${message}
        </div>
      </div>
    `,
  });

  if (error) {
    return { success: false, error: "메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요." };
  }

  return { success: true };
}
