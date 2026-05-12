import { Separator } from "@/components/ui/separator";

interface SectionHeaderProps {
  num: string;
  title: string;
  sub?: string;
}

export default function SectionHeader({ num, title, sub }: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-semibold bg-foreground text-background rounded px-1.5 py-0.5 leading-none">
          {num}
        </span>
        <span className="text-sm font-medium text-foreground">{title}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
      <Separator />
    </div>
  );
}
