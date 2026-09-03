"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import styles from "@/src/styles/components/header/ThemeToggle.module.css";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  // SSR 階段渲染骨架佔位，使用對應 class 保持響應式尺寸一致
  if (!isMounted) {
    return <div className={styles.skeleton} />;
  }

  return (
    <button
      type="button"
      className={`${styles.switchButton} component-button-light-mode-switch`}
      aria-label="切換模式"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        style={{ width: "100%", height: "100%" }}
      >
        <path
          d="M16.926 31.076C14.9753 29.1253 14 26.7667 14 24C14 21.2333 14.9753 18.8753 16.926 16.926C18.8767 14.9767 21.2347 14.0013 24 14C26.7653 13.9987 29.124 14.974 31.076 16.926C33.028 18.878 34.0027 21.236 34 24C33.9973 26.764 33.022 29.1227 31.074 31.076C29.126 33.0293 26.768 34.004 24 34C21.232 33.996 18.874 33.0207 16.926 31.074M10 26H2V22H10V26ZM46 26H38V22H46V26ZM22 10V2H26V10H22ZM22 46V38H26V46H22ZM12.8 15.5L7.75 10.65L10.6 7.7L15.4 12.7L12.8 15.5ZM37.4 40.3L32.55 35.25L35.2 32.5L40.25 37.35L37.4 40.3ZM32.5 12.8L37.35 7.75L40.3 10.6L35.3 15.4L32.5 12.8ZM7.7 37.4L12.75 32.55L15.5 35.2L10.65 40.25L7.7 37.4Z"
          fill="var(--text-white-aaa)"
        />
      </svg>
    </button>
  );
}
