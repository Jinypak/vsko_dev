import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "비전스퀘어 | VISION SQUARE",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased bg-white">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
