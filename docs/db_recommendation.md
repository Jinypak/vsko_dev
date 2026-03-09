# DB 솔루션 추천 (VSKO 관리자 시스템)

## 결론 (권장)
**Supabase(PostgreSQL) + Prisma ORM** 조합을 권장합니다.

### 이유
1. **PostgreSQL 기반 안정성**
   - 고객사/장비/히스토리처럼 관계형 데이터에 적합
2. **운영 편의성**
   - Supabase는 호스팅 DB + 대시보드 + 백업/권한 관리가 편함
3. **개발 생산성**
   - Prisma로 타입 안전한 쿼리, 스키마 관리, 마이그레이션 운영 가능
4. **확장성**
   - 추후 BI/통계 쿼리, 감사 로그, 권한 분리로 확장 쉬움

---

## 다른 선택지 비교

### 1) PlanetScale(MySQL) + Prisma
- 장점: 서버리스 확장성, 안정성
- 단점: 복잡한 트랜잭션/관계 처리 시 PostgreSQL 대비 제약 체감 가능

### 2) MongoDB Atlas
- 장점: 문서형 유연성
- 단점: 현재 요구(고객사-담당자-장비-히스토리 관계)에는 관계형보다 관리 난이도 상승

### 3) Firebase Firestore
- 장점: 빠른 시작
- 단점: 복잡한 검색/정렬/관계 쿼리에서 비용/구조 복잡도 증가 가능

---

## 현재 코드 기준 권장 전환 순서
1. Supabase 프로젝트 생성
2. PostgreSQL 연결 문자열 발급
3. Prisma 스키마 설계 및 마이그레이션
4. 현재 `lib/data/customer-repository.ts`의 in-memory 구현을 Prisma 구현으로 교체
5. API 레이어(`app/api/admin/customers/*`)는 그대로 유지 (데이터 소스만 교체)

