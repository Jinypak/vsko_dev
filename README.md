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

## 고객사 데이터 저장소 선택 규칙

고객사 데이터 저장소는 아래 순서로 결정됩니다.

1. `DATA_PROVIDER`가 설정되어 있으면 해당 값 사용 (`supabase`, `memory`)
2. `DATA_PROVIDER`가 비어 있고 Supabase URL/KEY가 모두 존재하면 자동으로 `supabase`
3. 그 외에는 `memory`

즉, Supabase 환경변수를 넣었는데 `DATA_PROVIDER`를 깜빡해도 자동으로 DB 저장을 사용합니다.
