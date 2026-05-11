import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ClientsProvider } from "@/lib/clients-context";

export const metadata: Metadata = {
  title: "ClientOS",
  description: "고객사 정보 관리 시스템",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-white">
        <ClientsProvider>
          <Header />
          <main>{children}</main>
        </ClientsProvider>
      </body>
    </html>
  );
}
