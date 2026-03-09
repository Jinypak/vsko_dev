-- 홈페이지 접속 통계 이벤트 테이블
create table if not exists public.traffic_events (
  id bigint generated always as identity primary key,
  path text not null,
  visited_at timestamptz not null default now()
);

create index if not exists traffic_events_visited_at_idx
  on public.traffic_events (visited_at desc);

create index if not exists traffic_events_path_idx
  on public.traffic_events (path);

alter table public.traffic_events disable row level security;
