# 다음 작업 실행 플랜 (30분 복귀용)

아래 순서대로 진행하면, 현재 시점의 리스크(메모리 저장/취약점 스캔/운영 미완료)를 가장 빠르게 줄일 수 있습니다.

---

## 0) 오늘 바로 확인할 상태 (5분)
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `/sign-in -> /dashboard` 로그인 동선 확인
- [ ] `/dashboard/customers/[id]` 수정/기록추가 동작 확인

> 목적: 작업 재개 직후 현재 브랜치가 깨지지 않았는지 확인

---

## 1) 최우선: 실제 DB 붙이기 (30~60분)

### 1-1. 우선 기술 스택 확정
- 권장: **Supabase(PostgreSQL) + Prisma**

### 1-2. 환경변수 준비
- [ ] `DATABASE_URL`
- [ ] `DATABASE_URL`

### 1-3. 현재 추상화 연결 포인트
- 파일: `lib/data/customer-repository.ts`
- TODO 위치: `createRepository()` 내부

해야 할 일:
- [ ] `PrismaCustomerRepository` 구현 추가
- [ ] `list/getById/updateById/addHistory`를 Prisma 쿼리로 매핑
- [ ] `DATABASE_URL`일 때 해당 구현 반환

---

## 2) 고객사 상세 편집 “임시상태” -> “영구저장” 검증 (15~30분)

현재:
- UI는 API 호출까지 완료
- API는 메모리 리포지토리 저장

DB 연결 후 체크:
- [ ] 편집 후 새로고침해도 값 유지되는지
- [ ] 새 기록 추가 후 순서/시간 포맷이 정상인지
- [ ] 동시 수정 시 최근 저장값 기준 정책 확인(낙관적 잠금은 추후)

---

## 3) 문의 폼 운영화 (20~40분)

현재:
- `/contact`에서 문의 유형 선택 후 API 전송 가능
- Resend 미설정 시 fallback 로그

해야 할 일:
- [ ] `RESEND_API_KEY`, `RESEND_FROM_EMAIL` 실제 주입
- [ ] 관리자 수신 메일함(도입/기술지원) 수신 확인
- [ ] 스팸/중복 방지(간단 rate-limit) 추가
- [ ] 폼 입력 유효성(이메일 형식, 최소 글자 수) 강화

---

## 4) 인증/보안 마감 (30~60분)

현재:
- OTP 쿠키 세션 기반 로그인

보완할 것:
- [ ] OTP 요청 rate-limit(이메일/전화/IP)
- [ ] OTP 재시도 횟수 제한
- [ ] 세션 만료/강제 로그아웃 정책 명확화
- [ ] 관리자 계정 allowlist를 DB 테이블로 이관

---

## 5) 취약점 스캔 경고 대응 (환경 이슈 포함) (15~30분)

현재 이슈:
- 이 환경에서 npm registry 403으로 설치/감사 일부 제한

실제 배포/CI 환경에서 할 일:
- [ ] `npm ci`로 lockfile 재해석
- [ ] `npm audit` 또는 SCA(예: Snyk/GHAS) 재실행
- [ ] `next`, `react-server-dom-webpack`, `react-server-dom-parcel` 최종 resolved 버전 확인
- [ ] 결과 리포트 캡처 후 배포 승인

---

## 6) UX 후속(여유 있으면)
- [ ] 대시보드 KPI 카드 실데이터 연결
- [ ] 고객사 목록 정렬(최근 이슈순/이름순)
- [ ] 히스토리 필터(기간/엔지니어/키워드)
- [ ] 변경 이력(audit trail) 별도 저장

---

## 바로 시작 명령어
```bash
npm run lint
npm run build
npm run dev
```

복귀 후 30분만 쓸 수 있다면, **1번(DB 연결) + 2번(영구저장 검증)** 까지 먼저 끝내는 걸 추천합니다.
