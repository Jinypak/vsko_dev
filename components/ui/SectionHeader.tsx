interface SectionHeaderProps {
  num: string;
  title: string;
  sub?: string;
}

export default function SectionHeader({ num, title, sub }: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-medium bg-gray-900 text-white rounded px-1.5 py-0.5 leading-none">
          {num}
        </span>
        <span className="text-sm font-medium">{title}</span>
        {sub && <span className="text-xs text-gray-400">{sub}</span>}
      </div>
      <hr className="border-t border-gray-200" />
    </div>
  );
}
