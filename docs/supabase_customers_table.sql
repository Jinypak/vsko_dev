-- 고객사 관리 테이블 (Supabase SQL Editor에서 실행)

create table if not exists public.customers (
  id text primary key,
  name text not null,
  hsm_count integer not null default 0,
  model text not null,
  serials jsonb not null default '[]'::jsonb,
  engineer text not null,
  contacts jsonb not null default '[]'::jsonb,
  histories jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_customers_updated_at on public.customers;
create trigger trg_customers_updated_at
before update on public.customers
for each row execute function public.set_updated_at();

-- 개발 단계: 공개 anon key로 테스트할 경우 RLS 비활성(운영 시 정책 기반으로 전환 권장)
alter table public.customers disable row level security;

insert into public.customers (id, name, hsm_count, model, serials, engineer, contacts, histories)
values
(
  'samsung-electronics',
  '삼성전자',
  12,
  'Thales Luna 7 Network HSM',
  '["SE-HSM-23001", "SE-HSM-23002", "SE-HSM-23003", "SE-HSM-23004"]'::jsonb,
  '박진우 책임 엔지니어',
  '[{"name":"김민수","team":"보안운영팀","phone":"010-1111-2222","email":"minsu.kim@samsung.com"},{"name":"이소영","team":"인프라보안파트","phone":"010-2222-3333","email":"soyoung.lee@samsung.com"}]'::jsonb,
  '[{"dateTime":"2026-03-09 09:40","title":"고객사 대표번호 인바운드 상담","note":"운영 환경 점검 요청 관련 문의 대응 및 1차 가이드 제공."},{"dateTime":"2026-03-10 11:00","title":"기술 문의 접수","note":"서명 처리 구간 지연 이슈 문의. 로그 수집 요청."}]'::jsonb
),
(
  'sk-hynix',
  'SK하이닉스',
  8,
  'Thales Luna PCIe HSM',
  '["SK-HSM-13021", "SK-HSM-13022", "SK-HSM-13023"]'::jsonb,
  '최도윤 수석 엔지니어',
  '[{"name":"정하늘","team":"정보보호팀","phone":"010-4444-5555","email":"haneul.jung@skhynix.com"}]'::jsonb,
  '[{"dateTime":"2026-03-08 16:20","title":"정기 점검 리포트 공유"}]'::jsonb
)
on conflict (id) do nothing;
