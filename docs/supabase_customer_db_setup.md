# Supabase 고객사 DB 연결 가이드

## 1) 테이블 생성
1. Supabase SQL Editor 열기
2. `docs/supabase_customers_table.sql` 전체 실행

## 2) 환경변수 설정
`.env.local`에 아래 추가:

```env
DATA_PROVIDER=supabase
SUPABASE_CUSTOMERS_TABLE=customers
NEXT_PUBLIC_SUPABASE_URL=https://oapnvqwhektsjgzqexzi.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=...
# 또는 NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

> `DATA_PROVIDER=supabase`인데 URL/키가 비어 있으면, 이제 메모리 저장소로 조용히 폴백하지 않고 서버에서 에러를 반환합니다.
> ("저장은 되는 것처럼 보이는데 DB에는 안 들어가는" 상황을 빠르게 찾기 위한 변경)

## 3) 동작 확인
- `/dashboard/customers` 진입 시 고객사 리스트가 DB에서 조회되는지 확인
- 상세 페이지 편집 후 저장 → 새로고침해도 값 유지 확인
- 새 기록 추가 후 새로고침해도 유지 확인

## 4) 운영 전 권장
- 현재 SQL은 개발 편의를 위해 RLS 비활성화 상태
- 운영 전에는 RLS 정책을 활성화하고 관리자 인증 기반 정책을 추가하세요.
