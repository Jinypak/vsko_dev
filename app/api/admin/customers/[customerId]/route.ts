import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCustomerRepository } from '@/lib/data/customer-repository';

export const preferredRegion = 'sin1';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { customerId } = await params;
    const repository = getCustomerRepository();
    const customer = await repository.getById(customerId);

    if (!customer) {
      return NextResponse.json({ message: '고객사를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '고객사 조회 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> },
) {
  try {
    const { customerId } = await params;
    const patch = (await request.json()) as {
      hsmCount?: number;
      model?: string;
      engineer?: string;
      serials?: string[];
      contacts?: {
        name: string;
        team: string;
        phone: string;
        email: string;
      }[];
    };

    const repository = getCustomerRepository();
    const updated = await repository.updateById(customerId, patch);

    if (!updated) {
      return NextResponse.json({ message: '고객사를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '고객사 수정 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
