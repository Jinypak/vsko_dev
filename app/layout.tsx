import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
      <body className={`${plusJakartaSans.variable} antialiased bg-background`}>
        <HeaderWrapper />
        <main>{children}</main>
      </body>
    </html>
  );
}
