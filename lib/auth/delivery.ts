type DeliveryResult = {
  delivered: boolean;
  provider: string;
};

async function sendViaResend(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    return { delivered: false, provider: 'resend-not-configured' } as DeliveryResult;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    return { delivered: false, provider: 'resend-failed' };
  }

  return { delivered: true, provider: 'resend' };
}

export async function sendEmailOtp(email: string, otp: string) {
  const subject = '[VSKO Admin] OTP 인증 코드 안내';
  const html = `<p>관리자 OTP 인증코드는 <b>${otp}</b> 입니다.</p><p>5분 내 입력해 주세요.</p>`;

  const result = await sendViaResend(email, subject, html);
  if (!result.delivered) {
    console.log(`[OTP-EMAIL:FALLBACK] ${email} => ${otp}`);
  }

  return result;
}

export async function sendKakaoOtp(phone: string, otp: string) {
  const webhookUrl = process.env.KAKAO_MESSAGE_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log(`[OTP-KAKAO:FALLBACK] ${phone} => ${otp}`);
    return { delivered: false, provider: 'kakao-webhook-not-configured' } as DeliveryResult;
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone,
      message: `[VSKO Admin] OTP 인증코드: ${otp} (5분 내 입력)`,
    }),
  });

  if (!response.ok) {
    return { delivered: false, provider: 'kakao-webhook-failed' };
  }

  return { delivered: true, provider: 'kakao-webhook' };
}
