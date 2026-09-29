"use client";

import React from "react";

interface ScrollToTopButtonProps {
  className?: string;
}

export default function ScrollToTopButton({
  className,
}: ScrollToTopButtonProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button type="button" className={className} onClick={scrollToTop}>
      回到最上方
    </button>
  );
}
