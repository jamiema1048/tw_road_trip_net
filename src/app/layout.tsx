import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/app/providers";
import Header from "@/src/app/(components)/(header)/header";
import { Footer } from "@/src/app/(components)/(footer)/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter", // 🟢 變數名稱改為 --font-inter
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
  ),

  title: {
    default: "來場探索台灣交通的旅途吧",
    template: "%s | 來場探索台灣交通的旅途吧",
  },
  description: "網站描述",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* 把 Providers 包在最外層，讓 Header、Footer、Children 都能共享 Theme 狀態 */}
        <Providers>
          <Header />
          <main style={{ flex: 1 }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
