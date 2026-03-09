export type CustomerHistory = {
  dateTime: string;
  title: string;
  note?: string;
};

export type Customer = {
  id: string;
  name: string;
  hsmCount: number;
  model: string;
  serials: string[];
  engineer: string;
  contacts: {
    name: string;
    team: string;
    phone: string;
    email: string;
  }[];
  histories: CustomerHistory[];
};

export const customers: Customer[] = [
  {
    id: 'samsung-electronics',
    name: '삼성전자',
    hsmCount: 12,
    model: 'Thales Luna 7 Network HSM',
    serials: ['SE-HSM-23001', 'SE-HSM-23002', 'SE-HSM-23003', 'SE-HSM-23004'],
    engineer: '박진우 책임 엔지니어',
    contacts: [
      {
        name: '김민수',
        team: '보안운영팀',
        phone: '010-1111-2222',
        email: 'minsu.kim@samsung.com',
      },
      {
        name: '이소영',
        team: '인프라보안파트',
        phone: '010-2222-3333',
        email: 'soyoung.lee@samsung.com',
      },
    ],
    histories: [
      {
        dateTime: '2026-03-09 09:40',
        title: '고객사 대표번호 인바운드 상담',
        note: '운영 환경 점검 요청 관련 문의 대응 및 1차 가이드 제공.',
      },
      {
        dateTime: '2026-03-10 11:00',
        title: '기술 문의 접수',
        note: '서명 처리 구간 지연 이슈 문의. 로그 수집 요청.',
      },
      {
        dateTime: '2026-03-14 14:00',
        title: '현장 방문 및 점검 수행',
        note: '작업 후 이상 없음 확인. 특이사항으로 인증서 만료 예정 알림 설정 요청.',
      },
    ],
  },
  {
    id: 'sk-hynix',
    name: 'SK하이닉스',
    hsmCount: 8,
    model: 'Thales Luna PCIe HSM',
    serials: ['SK-HSM-13021', 'SK-HSM-13022', 'SK-HSM-13023'],
    engineer: '최도윤 수석 엔지니어',
    contacts: [
      {
        name: '정하늘',
        team: '정보보호팀',
        phone: '010-4444-5555',
        email: 'haneul.jung@skhynix.com',
      },
    ],
    histories: [
      {
        dateTime: '2026-03-08 16:20',
        title: '정기 점검 리포트 공유',
      },
      {
        dateTime: '2026-03-11 10:10',
        title: '암호 정책 변경 요청 협의',
        note: '다음 주 반영 일정 확정 예정.',
      },
    ],
  },
];
