import { StatusType } from "@/types/client";
import { STATUS_STYLES } from "@/lib/utils";

interface StatusBadgeProps {
  status: StatusType;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block text-[11px] px-2 py-0.5 rounded-full border ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
