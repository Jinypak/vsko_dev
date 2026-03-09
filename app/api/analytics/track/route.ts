import { NextResponse } from 'next/server';
import { getTrafficRepository } from '@/lib/analytics/traffic-repository';

export async function POST(request: Request) {
  try {
    const { path } = (await request.json()) as { path?: string };

    if (!path || typeof path !== 'string' || !path.startsWith('/')) {
      return NextResponse.json({ ok: false, message: 'Invalid path' }, { status: 400 });
    }

    const ignoredPrefixes = ['/api', '/dashboard', '/_next'];
    if (ignoredPrefixes.some((prefix) => path.startsWith(prefix))) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    await getTrafficRepository().track(path);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Track failed',
      },
      { status: 500 },
    );
  }
}
