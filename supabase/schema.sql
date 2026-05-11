-- =============================================
-- VisionSquare CRM — Supabase Schema
-- Supabase SQL Editor에서 순서대로 실행하세요
-- =============================================

-- 1. 고객사 테이블
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  company_name_en TEXT DEFAULT '',
  is_vip BOOLEAN DEFAULT false,
  contract_status TEXT DEFAULT '계약중'
    CHECK (contract_status IN ('계약중', '계약종료', '협의중')),
  ceo TEXT DEFAULT '',
  business_number TEXT DEFAULT '',
  industry TEXT DEFAULT '',
  founded_at TEXT DEFAULT '',
  scale TEXT DEFAULT '',
  manager TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  registered_at TEXT DEFAULT '',
  memo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 계약 제품 테이블
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT '서비스'
    CHECK (category IN ('서비스', '구독', '인쇄', '출력', '기타')),
  unit_price BIGINT DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  status TEXT DEFAULT '진행중'
    CHECK (status IN ('진행중', '완료', '대기', '수정요청', '계획중')),
  sort_order INTEGER DEFAULT 0
);

-- 3. 작업 히스토리 테이블
CREATE TABLE history_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  date TEXT DEFAULT '',
  name TEXT NOT NULL,
  assignee TEXT DEFAULT '',
  status TEXT DEFAULT '진행중'
    CHECK (status IN ('진행중', '완료', '대기', '수정요청', '계획중')),
  note TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. 히스토리 상세 테이블 (history_items 1:1)
CREATE TABLE history_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  history_item_id UUID NOT NULL UNIQUE REFERENCES history_items(id) ON DELETE CASCADE,
  summary TEXT DEFAULT '',
  requested_at TEXT DEFAULT '',
  due_date TEXT DEFAULT '',
  members TEXT DEFAULT '',
  budget TEXT DEFAULT ''
);

-- 5. 체크 항목 테이블
CREATE TABLE check_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  history_detail_id UUID NOT NULL REFERENCES history_details(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

-- 6. 첨부 파일 테이블
CREATE TABLE attached_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  history_detail_id UUID NOT NULL REFERENCES history_details(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'pdf'
    CHECK (type IN ('pdf', 'psd', 'ai', 'png', 'jpg', 'xlsx', 'docx')),
  sort_order INTEGER DEFAULT 0
);

-- =============================================
-- RLS (Row Level Security) 설정
-- =============================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE history_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE attached_files ENABLE ROW LEVEL SECURITY;

-- 로그인한 사용자만 모든 CRUD 허용
CREATE POLICY "authenticated_all" ON clients FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON history_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON history_details FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON check_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON attached_files FOR ALL TO authenticated USING (true) WITH CHECK (true);
