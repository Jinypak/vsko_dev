import type { Metadata } from 'next';
import '../globals.css';
import Header from '@/components/Header';
import TrafficTracker from '@/components/analytics/TrafficTracker';

export const metadata: Metadata = {
  title: 'Vision Square | 보안 솔루션',
  description:
    '비전 스퀘어는 HSM과 PSE 기반의 기업 보안 솔루션을 제공하는 전문 보안 기업입니다.',
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        <TrafficTracker />
        {children}
      </body>
    </html>
  );
}
