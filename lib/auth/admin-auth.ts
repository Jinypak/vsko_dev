export const OTP_TTL_MS = 5 * 60 * 1000;
export const SESSION_TTL_SECONDS = 60 * 60 * 8;

export const AUTH_COOKIES = {
  otp: 'vsko_admin_otp',
  principal: 'vsko_admin_principal',
  channel: 'vsko_admin_channel',
  otpExp: 'vsko_admin_otp_exp',
  session: 'vsko_admin_session',
} as const;

export type AuthChannel = 'email' | 'kakao';

export function generateOtp() {
  return `${Math.floor(100000 + Math.random() * 900000)}`;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^0-9]/g, '');
}

export function isAllowedAdminEmail(email: string) {
  if (!email.endsWith('@vsko.co.kr')) return false;

  const defaultAllowed = ['jiny3360@vsko.co.kr'];
  const configured = (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  const allowList = configured.length > 0 ? configured : defaultAllowed;
  return allowList.includes(email);
}

export function isAllowedAdminPhone(phone: string) {
  const configured = (process.env.ADMIN_ALLOWED_PHONES ?? '')
    .split(',')
    .map((v) => normalizePhone(v))
    .filter(Boolean);

  if (configured.length === 0) {
    return false;
  }

  return configured.includes(phone);
}
