import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sendContactInquiryEmail } from '@/lib/auth/delivery';

export async function POST(request: NextRequest) {
  const { inquiryType, name, email, message } = (await request.json()) as {
    inquiryType?: '도입 문의' | '기술 지원';
    name?: string;
    email?: string;
    message?: string;
  };

  if (!inquiryType || !name || !email || !message) {
    return NextResponse.json({ message: '필수 항목을 모두 입력해 주세요.' }, { status: 400 });
  }

  const result = await sendContactInquiryEmail({ inquiryType, name, email, message });

  return NextResponse.json({
    message: result.delivered
      ? '문의 메일이 정상적으로 접수되었습니다.'
      : `문의 메일 발송 연동이 설정되지 않아 개발 모드로 처리되었습니다. (${result.provider})`,
  });
}
