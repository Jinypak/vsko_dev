import { ClientInfo } from "@/types/client";

// Supabase 미연결 시 표시되는 샘플 데이터
export const mockClients: ClientInfo[] = [
  {
    id: "sample-001",
    companyName: "(주) 샘플 고객사",
    companyNameEn: "Sample Corp.",
    isVip: false,
    contractStatus: "계약중",
    department: "IT 인프라팀",
    engineer: "홍길동",
    purpose: "백업 및 재해복구",
    maintenanceStatus: "진행중",
    notes: "Supabase 연결 후 실제 데이터가 표시됩니다.",
    registeredAt: "2026. 01. 01",
    contacts: [
      { id: "c1", name: "김담당", phone: "010-0000-0000", email: "contact@sample.com", isPrimary: true, sortOrder: 0 },
    ],
    products: [
      {
        id: 1, sortOrder: 1, name: "Luna Storage", category: "Luna",
        model: "L-2000", purpose: "주 스토리지", serialNumber: "SN-000001",
        firmware: "v3.2.1", clientOs: "Windows Server 2022", clientCount: "50",
        maintenanceStart: "2025.01.01", maintenanceEnd: "2026.12.31", maintenanceStatus: "진행중",
      },
    ],
    history: [
      {
        id: "h1", date: "2026.05.01", name: "정기 점검", engineer: "홍길동",
        classification: "점검", status: "완료",
        detail: { id: "d1", author: "홍길동", date: "2026.05.01", classification: "점검", content: "정기 점검 완료." },
      },
    ],
  },
];

export const mockClient = mockClients[0];
