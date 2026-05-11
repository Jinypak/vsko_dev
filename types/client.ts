export type StatusType =
  | "진행중"
  | "완료"
  | "대기"
  | "수정요청"
  | "계획중";

export type ProductCategory = "서비스" | "구독" | "인쇄" | "출력" | "기타";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  unitPrice: number;
  quantity: number;
  status: StatusType;
}

export interface CheckItem {
  id: string;
  label: string;
  done: boolean;
}

export interface AttachedFile {
  id: string;
  name: string;
  type: "pdf" | "psd" | "ai" | "png" | "jpg" | "xlsx" | "docx";
}

export interface HistoryDetail {
  summary: string;
  requestedAt: string;
  dueDate: string;
  members: string;
  budget: string;
  checkItems: CheckItem[];
  files: AttachedFile[];
}

export interface HistoryItem {
  id: string;
  date: string;
  name: string;
  assignee: string;
  status: StatusType;
  note: string;
  detail?: HistoryDetail;
}

export interface ClientInfo {
  id: string;
  logoUrl?: string;
  companyName: string;
  companyNameEn: string;
  isVip: boolean;
  contractStatus: "계약중" | "계약종료" | "협의중";
  ceo: string;
  businessNumber: string;
  industry: string;
  foundedAt: string;
  scale: string;
  manager: string;
  phone: string;
  email: string;
  address: string;
  registeredAt: string;
  memo: string;
  products: Product[];
  history: HistoryItem[];
}
