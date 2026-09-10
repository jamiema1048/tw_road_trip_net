// src/app/(components)/(ui)/LazyItem.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import Skeleton from "@/src/app/(components)/(ui)/Skeleton";

interface LazyItemProps {
  children: React.ReactNode;
  /** 預估該區塊的高度，維護穩定 Layout 防止 CLS */
  minHeight?: string;
  /** 當延遲內容載入後仍保留最小高度，避免內容比 skeleton 矮時造成 CLS。 */
  preserveMinHeight?: boolean;
  className?: string;
}

export function LazyItem({
  children,
  minHeight = "200px",
  preserveMinHeight = false,
  className,
}: LazyItemProps) {
  const [hasRendered, setHasRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. 如果已經渲染過，就永遠不再發動監聽與重新渲染
    if (hasRendered) return;

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // 2. 一旦進入視窗範圍（包含 rootMargin 提前預載），觸發渲染
          setHasRendered(true);
          // 3. 立即斷開監聽，防止後續滾動再次引發運算
          observer.disconnect();
        }
      },
      {
        // 提前 400px 預載，讓使用者滑到時已經渲染完成，感受不到白塊
        rootMargin: "400px 0px 400px 0px",
        threshold: 0,
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasRendered]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        // 未渲染前使用固定 minHeight 佔位，渲染後交給真實內容
        minHeight: hasRendered && !preserveMinHeight ? "auto" : minHeight,
        // CSS contain 屬性：告訴瀏覽器此區域尺寸獨立，極大幅度降低微小重繪引起的 Layout 鏈鎖反應
        contain: "content",
      }}
    >
      {hasRendered ? children : <Skeleton height={minHeight} />}
    </div>
  );
}
