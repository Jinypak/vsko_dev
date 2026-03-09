import type { Metadata } from 'next';
import '../globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Vision Square Admin',
  description: 'Vision Square 관리자 대시보드',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
