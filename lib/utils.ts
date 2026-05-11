import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { StatusType } from "@/types/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number): string {
  return `₩ ${value.toLocaleString("ko-KR")}`;
}

export function formatQuantity(value: number): string {
  return value >= 1000 ? value.toLocaleString("ko-KR") : String(value);
}

export const STATUS_STYLES: Record<StatusType, string> = {
  진행중:   "border-blue-400 text-blue-600 bg-blue-50",
  완료:     "border-green-400 text-green-600 bg-green-50",
  대기:     "border-gray-300 text-gray-500 bg-gray-50",
  수정요청: "border-amber-400 text-amber-600 bg-amber-50",
  계획중:   "border-purple-400 text-purple-600 bg-purple-50",
};

export const FILE_ICON: Record<string, string> = {
  pdf:  "📄",
  psd:  "🎨",
  ai:   "✏️",
  png:  "🖼️",
  jpg:  "🖼️",
  xlsx: "📊",
  docx: "📝",
};
