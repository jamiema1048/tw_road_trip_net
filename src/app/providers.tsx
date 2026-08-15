"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false} // 🟢 避免自動被作業系統設定覆蓋，優先使用你指定的值
    >
      {children}
    </ThemeProvider>
  );
}
