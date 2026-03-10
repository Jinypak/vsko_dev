import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCustomerRepository } from '@/lib/data/customer-repository';

export const preferredRegion = 'sin1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { customerId } = await params;
    const { title, note, category } = (await request.json()) as {
      title?: string;
      note?: string;
      category?: 'work' | 'inspection' | 'consulting' | 'etc';
    };

    if (!title?.trim()) {
      return NextResponse.json({ message: '기록 제목을 입력해 주세요.' }, { status: 400 });
    }

    if (category && !['work', 'inspection', 'consulting', 'etc'].includes(category)) {
      return NextResponse.json({ message: '유효하지 않은 히스토리 카테고리입니다.' }, { status: 400 });
    }

    const repository = getCustomerRepository();
    const updated = await repository.addHistory(customerId, {
      category: category ?? 'etc',
      title: title.trim(),
      note: note?.trim() || undefined,
    });

    if (!updated) {
      return NextResponse.json({ message: '고객사를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '히스토리 등록 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
