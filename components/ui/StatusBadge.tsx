import { StatusType } from "@/types/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_BADGE_STYLES: Record<StatusType, string> = {
  진행중:   "border-blue-300 text-blue-600 bg-blue-50",
  완료:     "border-green-300 text-green-600 bg-green-50",
  대기:     "border-gray-300 text-gray-500 bg-gray-50",
  수정요청: "border-amber-300 text-amber-600 bg-amber-50",
  계획중:   "border-purple-300 text-purple-600 bg-purple-50",
};

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(STATUS_BADGE_STYLES[status])}>
      {status}
    </Badge>
  );
}
