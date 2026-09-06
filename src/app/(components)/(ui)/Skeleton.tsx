// src/app/(components)/(ui)/Skeleton.tsx
import React from "react";
import styles from "@/src/styles/ui/Skeleton.module.css";

interface SkeletonProps {
  /** 骨架屏占位高度 (預設 100px) */
  height?: string;
  /** 可選的額外 CSS class */
  className?: string;
  /** 可選的行內樣式 */
  style?: React.CSSProperties;
}

export default function Skeleton({
  height = "100px",
  className = "",
  style = {},
}: SkeletonProps) {
  return (
    <div
      className={`${styles.skeleton} ${className}`.trim()}
      style={{ height, ...style }}
      aria-hidden="true"
    />
  );
}
