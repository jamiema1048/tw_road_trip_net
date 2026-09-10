import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/src/app/providers";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem";
import Header from "@/src/app/(components)/(header)/header";
import { Footer } from "@/src/app/(components)/(footer)/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
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
      className={inter.variable}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* 把 Providers 包在最外層，讓 Header、Footer、Children 都能共享 Theme 狀態 */}
        <Providers>
          <Header />
          <main className="main-content">{children}</main>
          <LazyItem minHeight="64px">
            <Footer />
          </LazyItem>
        </Providers>
      </body>
    </html>
  );
}
