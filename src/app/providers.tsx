"use client";

import { ThemeProvider } from "next-themes";
import styled from "styled-components";

// 🟢 1. 建立一個吃滿全螢幕高度（100vh）的垂直 Flex 容器
const AppLayoutWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
    >
      <AppLayoutWrapper>{children}</AppLayoutWrapper>
    </ThemeProvider>
  );
}
