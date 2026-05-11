// ─── 공통 ──────────────────────────────────────────────────────────

export type StatusType =
  | "진행중"
  | "완료"
  | "대기"
  | "수정요청"
  | "계획중";

export type MaintenanceStatus = "진행중" | "완료" | "중단" | "해당없음";

export type ProductCategory = "Luna" | "PSE" | "Backup";

export type HistoryClassification = "점검" | "기술지원" | "장애";

// ─── 담당자 ────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  sortOrder: number;
}

// ─── 제품 상세 ─────────────────────────────────────────────────────

export interface Product {
  id: number;
  sortOrder: number;
  name: string;
  category: ProductCategory;
  model: string;
  purpose: string;
  serialNumber: string;
  firmware: string;
  clientOs: string;
  clientCount: string;
  maintenanceStart: string;
  maintenanceEnd: string;
  maintenanceStatus: MaintenanceStatus;
}

// ─── 히스토리 상세 ─────────────────────────────────────────────────

export interface HistoryDetail {
  id?: string;
  author: string;
  date: string;
  classification: HistoryClassification;
  content: string;
}

// ─── 히스토리 항목 ─────────────────────────────────────────────────

export interface HistoryItem {
  id: string;
  date: string;
  name: string;
  engineer: string;
  classification: HistoryClassification;
  status: StatusType;
  detail?: HistoryDetail;
}

// ─── 고객사 ────────────────────────────────────────────────────────

export interface ClientInfo {
  id: string;
  companyName: string;
  companyNameEn: string;
  isVip: boolean;
  contractStatus: "계약중" | "계약종료" | "협의중";
  department: string;
  engineer: string;
  purpose: string;
  maintenanceStatus: MaintenanceStatus;
  notes: string;
  registeredAt: string;
  contacts: Contact[];
  products: Product[];
  history: HistoryItem[];
}
