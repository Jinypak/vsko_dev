# API Key / 환경변수 목록

아래는 현재 관리자 OTP 인증(메일/카카오톡) + 문의 메일 + Neon DB 연동에 필요한 환경변수 목록입니다.

## 1) 관리자 세션 JWT
- `AUTH_JWT_SECRET`
  - 관리자 로그인 세션 JWT 서명용 비밀키
  - 32자 이상의 랜덤 문자열 권장

## 2) 메일 OTP 발송 / 문의 메일 발송 (Resend)
- `RESEND_API_KEY`
  - Resend API 호출용 비밀 키
- `RESEND_FROM_EMAIL`
  - 발신자 메일 주소 (예: `no-reply@vsko.co.kr`)

## 3) 카카오톡 OTP 발송
- `KAKAO_MESSAGE_WEBHOOK_URL`
  - 카카오톡 메시지 발송을 연결한 내부/외부 웹훅 엔드포인트

## 4) 관리자 접근 허용 목록
- `ADMIN_ALLOWED_EMAILS`
  - OTP 로그인 허용 메일 목록(쉼표 구분)
  - 예: `jiny3360@vsko.co.kr,admin2@vsko.co.kr`
- `ADMIN_ALLOWED_PHONES`
  - 카카오톡 OTP 허용 번호 목록(쉼표 구분, 숫자만 권장)
  - 예: `01012345678,01098765432`

## 5) Neon + Drizzle DB
- `DATABASE_URL`
  - Neon pooled/direct PostgreSQL 연결 문자열
  - 예: `postgresql://USER:PASSWORD@HOST/DB?sslmode=require`

---

## 참고
- `AUTH_JWT_SECRET`가 없으면 관리자 세션 생성/검증이 실패합니다.
- `ADMIN_ALLOWED_EMAILS`를 비우면 코드 기본값으로 `jiny3360@vsko.co.kr`만 허용됩니다.
- `ADMIN_ALLOWED_PHONES` 미설정 시 카카오톡 OTP 인증은 허용되지 않습니다.
- 메일/카카오 전송 연동 키가 없으면 개발용 fallback 동작(로그/응답 기반 OTP 확인)으로 동작합니다.
