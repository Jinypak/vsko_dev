# API Key / 환경변수 목록

아래는 현재 관리자 OTP 인증(메일/카카오톡) + 문의 메일 + DB 연동 준비에 필요한 환경변수 목록입니다.

## 1) 메일 OTP 발송 / 문의 메일 발송 (Resend)
- `RESEND_API_KEY`
  - Resend API 호출용 비밀 키
- `RESEND_FROM_EMAIL`
  - 발신자 메일 주소 (예: `no-reply@vsko.co.kr`)

## 2) 카카오톡 OTP 발송
- `KAKAO_MESSAGE_WEBHOOK_URL`
  - 카카오톡 메시지 발송을 연결한 내부/외부 웹훅 엔드포인트

## 3) 관리자 접근 허용 목록
- `ADMIN_ALLOWED_EMAILS`
  - OTP 로그인 허용 메일 목록(쉼표 구분)
  - 예: `jiny3360@vsko.co.kr,admin2@vsko.co.kr`
- `ADMIN_ALLOWED_PHONES`
  - 카카오톡 OTP 허용 번호 목록(쉼표 구분, 숫자만 권장)
  - 예: `01012345678,01098765432`

## 4) 데이터 소스 전환(DB 연동 준비)
- `DATA_PROVIDER`
  - `supabase`로 설정하면 고객사 데이터 API가 Supabase 테이블을 사용합니다
  - 예: `DATA_PROVIDER=supabase`
- `SUPABASE_CUSTOMERS_TABLE`
  - 고객사 데이터 테이블명
  - 기본값: `customers`

- `DATABASE_URL`
  - (Prisma 경로로 갈 경우) PostgreSQL 연결 문자열
  - 예: `postgresql://USER:PASSWORD@HOST:5432/DB?schema=public`

---

## 참고
- `ADMIN_ALLOWED_EMAILS`를 비우면 코드 기본값으로 `jiny3360@vsko.co.kr`만 허용됩니다.
- `ADMIN_ALLOWED_PHONES` 미설정 시 카카오톡 OTP 인증은 허용되지 않습니다.
- 메일/카카오 전송 연동 키가 없으면 개발용 fallback 동작(로그/응답 기반 OTP 확인)으로 동작합니다.
- 현재 고객/히스토리 데이터는 리포지토리 추상화(`lib/data/customer-repository.ts`)를 통해 관리되며,
  추후 DB 구현으로 교체할 수 있도록 준비되어 있습니다.
