import { NextResponse } from 'next/server';
import { getTrafficRepository } from '@/lib/analytics/traffic-repository';

export async function GET() {
  try {
    const summary = await getTrafficRepository().getSummary();
    return NextResponse.json(summary);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Analytics summary failed' },
      { status: 500 },
    );
  }
}
