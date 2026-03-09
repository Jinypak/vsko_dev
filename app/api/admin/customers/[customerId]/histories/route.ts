import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCustomerRepository } from '@/lib/data/customer-repository';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  const { customerId } = await params;
  const { title, note } = (await request.json()) as { title?: string; note?: string };

  if (!title?.trim()) {
    return NextResponse.json({ message: '기록 제목을 입력해 주세요.' }, { status: 400 });
  }

  const repository = getCustomerRepository();
  const updated = await repository.addHistory(customerId, {
    title: title.trim(),
    note: note?.trim() || undefined,
  });

  if (!updated) {
    return NextResponse.json({ message: '고객사를 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(updated);
}
