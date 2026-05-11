-- =============================================
-- VisionSquare CRM — Supabase Schema v2
-- Supabase SQL Editor에서 순서대로 실행하세요
-- =============================================

-- 기존 테이블 제거 (역순)
DROP TABLE IF EXISTS attached_files   CASCADE;
DROP TABLE IF EXISTS check_items      CASCADE;
DROP TABLE IF EXISTS history_details  CASCADE;
DROP TABLE IF EXISTS history_items    CASCADE;
DROP TABLE IF EXISTS products         CASCADE;
DROP TABLE IF EXISTS contacts         CASCADE;
DROP TABLE IF EXISTS clients          CASCADE;

-- =============================================
-- 1. 고객사 테이블
-- =============================================
CREATE TABLE clients (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name     TEXT        NOT NULL,
  company_name_en  TEXT        DEFAULT '',
  is_vip           BOOLEAN     DEFAULT false,
  contract_status  TEXT        DEFAULT '계약중'
                               CHECK (contract_status IN ('계약중', '계약종료', '협의중')),
  department       TEXT        DEFAULT '',   -- 부서
  engineer         TEXT        DEFAULT '',   -- 담당 엔지니어
  purpose          TEXT        DEFAULT '',   -- 용도
  maintenance_status TEXT      DEFAULT '해당없음'
                               CHECK (maintenance_status IN ('진행중', '완료', '중단', '해당없음')),
  notes            TEXT        DEFAULT '',   -- 특이사항
  registered_at    TEXT        DEFAULT '',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. 담당자 테이블 (고객사당 여러 명)
-- =============================================
CREATE TABLE contacts (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID    NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL DEFAULT '',
  phone       TEXT    DEFAULT '',
  email       TEXT    DEFAULT '',
  is_primary  BOOLEAN DEFAULT false,
  sort_order  INTEGER DEFAULT 0
);

-- =============================================
-- 3. 제품 상세 테이블
-- =============================================
CREATE TABLE products (
  id                  BIGSERIAL   PRIMARY KEY,
  client_id           UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  sort_order          INTEGER     DEFAULT 0,
  name                TEXT        NOT NULL DEFAULT '',   -- 제품명
  category            TEXT        DEFAULT 'Luna'
                                  CHECK (category IN ('Luna', 'PSE', 'Backup')),
  model               TEXT        DEFAULT '',   -- 모델
  purpose             TEXT        DEFAULT '',   -- 용도
  serial_number       TEXT        DEFAULT '',   -- Serial Number
  firmware            TEXT        DEFAULT '',   -- Firmware
  client_os           TEXT        DEFAULT '',   -- Client OS
  client_count        TEXT        DEFAULT '',   -- Client Count
  maintenance_start   TEXT        DEFAULT '',   -- 유지보수 기간 시작
  maintenance_end     TEXT        DEFAULT '',   -- 유지보수 기간 종료
  maintenance_status  TEXT        DEFAULT '해당없음'
                                  CHECK (maintenance_status IN ('진행중', '완료', '중단', '해당없음'))
);

-- =============================================
-- 4. 작업 히스토리 테이블
-- =============================================
CREATE TABLE history_items (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date           TEXT        DEFAULT '',
  name           TEXT        NOT NULL DEFAULT '',   -- 작업명
  engineer       TEXT        DEFAULT '',            -- 엔지니어
  classification TEXT        DEFAULT '점검'
                             CHECK (classification IN ('점검', '기술지원', '장애')),
  status         TEXT        DEFAULT '진행중'
                             CHECK (status IN ('진행중', '완료', '대기', '수정요청', '계획중')),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. 작업 히스토리 상세 테이블
-- =============================================
CREATE TABLE history_details (
  id              UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  history_item_id UUID    NOT NULL UNIQUE REFERENCES history_items(id) ON DELETE CASCADE,
  author          TEXT    DEFAULT '',   -- 작성자
  date            TEXT    DEFAULT '',   -- 일자
  classification  TEXT    DEFAULT '점검'
                          CHECK (classification IN ('점검', '기술지원', '장애')),
  content         TEXT    DEFAULT ''    -- 상세 내용
);

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE clients          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_details  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all" ON clients         FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON contacts        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON products        FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON history_items   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON history_details FOR ALL TO authenticated USING (true) WITH CHECK (true);
