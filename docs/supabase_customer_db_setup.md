# Supabase 고객사 DB 연결 가이드

## 1) 테이블 생성
1. Supabase SQL Editor 열기
2. `docs/supabase_customers_table.sql` 전체 실행
3. 홈페이지 접속량 통계를 사용하려면 `docs/supabase_traffic_events_table.sql`도 실행

## 2) 환경변수 설정
`.env.local`에 아래 추가:

```env
DATA_PROVIDER=supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
# 대체 키(권장도 낮음): SUPABASE_ANON_KEY=...
SUPABASE_CUSTOMERS_TABLE=customers
SUPABASE_TRAFFIC_TABLE=traffic_events
```

> 참고: `SUPABASE_URL` 대신 `NEXT_PUBLIC_SUPABASE_URL`도 인식합니다.  
> 키는 `SUPABASE_SERVICE_ROLE_KEY` → `SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` 순서로 읽습니다.

## 3) DB 업데이트가 안 될 때 체크리스트
- 서버 재시작/재배포 했는지 확인 (`.env` 변경 후 필수)
- `DATA_PROVIDER=supabase`인지 확인
- `SUPABASE_URL`/키 오탈자 확인
- Supabase SQL Editor에서 아래 권한/정책 상태 확인
  - `public.customers` 테이블 존재
  - RLS 상태 확인 (`disable row level security` 또는 적절한 update 정책)
- 대시보드/고객사 화면의 오류 메시지에서 Supabase 에러 코드(`42501` 등) 확인

## 4) 동작 확인
- `/dashboard/customers` 진입 시 고객사 리스트가 DB에서 조회되는지 확인
- 상세 페이지 편집 후 저장 → 새로고침해도 값 유지 확인
- 새 기록 추가 후 새로고침해도 유지 확인
- 메인 페이지 접속 후 `/dashboard`에서 방문 통계 수치 변화 확인

## 5) 운영 전 권장
- 운영에서는 RLS 활성화 + 최소 권한 정책으로 전환
- 서버에서만 `SUPABASE_SERVICE_ROLE_KEY`를 사용하고, 브라우저에는 노출하지 마세요.
