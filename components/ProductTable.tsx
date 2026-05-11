import { Product } from "@/types/client";
import StatusBadge from "@/components/ui/StatusBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import { formatPrice, formatQuantity } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="mb-8">
      <SectionHeader num="01" title="제품 상세" sub="· 계약 중인 제품" />

      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-8">#</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2">제품명</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-24">구분</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-32">단가</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-16">수량</th>
            <th className="text-left text-[11px] text-gray-400 font-medium px-2.5 py-2 w-20">상태</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-2.5 py-2.5 text-gray-300">{product.id}</td>
              <td className="px-2.5 py-2.5 text-gray-800">{product.name}</td>
              <td className="px-2.5 py-2.5 text-gray-500">{product.category}</td>
              <td className="px-2.5 py-2.5 text-gray-800">{formatPrice(product.unitPrice)}</td>
              <td className="px-2.5 py-2.5 text-gray-600">{formatQuantity(product.quantity)}</td>
              <td className="px-2.5 py-2.5">
                <StatusBadge status={product.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
