import Sidebar from '@/components/Sidebar';
import React from 'react';

const ProductLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="mx-auto flex w-full max-w-6xl gap-8 px-6 py-14">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </main>
  );
};

export default ProductLayout;
