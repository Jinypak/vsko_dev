# 비전 스퀘어 홈페이지 리뉴얼

### 개발 대상 페이지

- **회사 소개**
- **제품 소개**
  - **HSM**
    - HSM 소개
    - 업데이트 내역
    - 기술지원 항목
  - **PSE**
    - PSE 소개
    - 업데이트 내역
    - 기술지원 항목
- **Contact**
  - 위치
  - 연락 Form

## Admin JWT 환경변수 설정

관리자 로그인 세션 JWT는 아래 우선순위로 시크릿을 찾습니다.

1. `AUTH_JWT_SECRET` (공통)
2. `NODE_ENV`별 전용 값
   - production: `AUTH_JWT_SECRET_PRODUCTION`
   - development: `AUTH_JWT_SECRET_DEVELOPMENT`
   - test: `AUTH_JWT_SECRET_TEST`
3. development에서만 기본값(`local-dev-auth-jwt-secret`) 사용

운영에서는 반드시 `AUTH_JWT_SECRET` 또는 `AUTH_JWT_SECRET_PRODUCTION`을 설정하세요.

## Neon + Drizzle DB 설정

이 프로젝트의 고객사/트래픽 저장소는 `DATABASE_URL` 기준으로 동작합니다.

- `DATABASE_URL`이 있으면 Drizzle(Neon PostgreSQL) 사용
- `DATABASE_URL`이 없으면 메모리 저장소 fallback 사용

마이그레이션 파일은 `drizzle/0000_init.sql`에 있습니다.
