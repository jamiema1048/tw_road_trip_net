"use client";

import { useState, useEffect, useRef, ReactNode } from "react";

export function LazyItem({ children }: { children: ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // 進入視口後就掛載，並停止監聽
        }
      },
      { rootMargin: "200px 0px" }, // 提早 200px 預先渲染，使用者滑過來時完全感覺不到延遲
    );

    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} style={{ minHeight: "60px" }}>
      {isVisible ? children : null}
    </div>
  );
}
