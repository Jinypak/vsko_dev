import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCustomerRepository } from '@/lib/data/customer-repository';

export async function POST(request: NextRequest) {
  try {
    const { name } = (await request.json()) as { name?: string };
    const trimmed = (name ?? '').trim();

    if (!trimmed) {
      return NextResponse.json({ message: '고객사 이름을 입력해 주세요.' }, { status: 400 });
    }

    const repository = getCustomerRepository();
    const created = await repository.create({ name: trimmed });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '고객사 생성 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
