'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function TrafficTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const key = `vsko-visit:${pathname}:${new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' })}`;
    if (sessionStorage.getItem(key)) {
      return;
    }
    sessionStorage.setItem(key, '1');

    const payload = JSON.stringify({ path: pathname });
    const blob = new Blob([payload], { type: 'application/json' });

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', blob);
      return;
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname]);

  return null;
}
