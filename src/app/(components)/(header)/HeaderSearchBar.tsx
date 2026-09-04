"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/src/styles/components/header/HeaderSearchBar.module.css";

// 1. 將包含 useSearchParams 的核心邏輯抽出來
function HeaderSearchBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 控制搜尋框開關狀態
  const [isOpen, setIsOpen] = useState(false);
  // 輸入關鍵字
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 1. 當展開時，自動聚焦 input
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // 2. 點擊元件外部區域 (Click Outside) 或按下 Esc 鍵時自動收合
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (!keyword.trim()) {
          setIsOpen(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyword]);

  // 處理提交搜尋
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    router.push(`/search?q=${encodeURIComponent(keyword.trim())}`);
  };

  // 切換展開/收合
  const toggleOpen = () => {
    if (isOpen && !keyword.trim()) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <form className={styles.form} onSubmit={handleSearch} data-open={isOpen}>
        {/* 放大鏡按鈕 */}
        <button
          type={isOpen ? "submit" : "button"}
          className={`${styles.searchButton} logo`}
          aria-label="搜尋"
          onClick={!isOpen ? toggleOpen : undefined}
        >
          <svg
            className={styles.searchButtonIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M42 41.9999L33.314 33.3139M33.314 33.3139C34.7998 31.8281 35.9784 30.0643 36.7825 28.123C37.5866 26.1818 38.0005 24.1011 38.0005 21.9999C38.0005 19.8987 37.5866 17.8181 36.7825 15.8768C35.9784 13.9356 34.7998 12.1717 33.314 10.6859C31.8283 9.20015 30.0644 8.02157 28.1231 7.21747C26.1819 6.41337 24.1012 5.99951 22 5.99951C19.8988 5.99951 17.8182 6.41337 15.877 7.21747C13.9357 8.02157 12.1718 9.20015 10.686 10.6859C7.68539 13.6866 5.99963 17.7564 5.99963 21.9999C5.99963 26.2435 7.68539 30.3133 10.686 33.3139C13.6867 36.3146 17.7565 38.0003 22 38.0003C26.2436 38.0003 30.3134 36.3146 33.314 33.3139Z"
              stroke="var(--text-white-aaaa)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 動態展開的輸入框 */}
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="搜尋公路、車站..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          data-open={isOpen}
        />

        {/* 展開時顯示的清除/關閉按鈕 */}
        {isOpen && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => {
              setKeyword("");
              setIsOpen(false);
            }}
            aria-label="關閉搜尋"
          >
            ✕
          </button>
        )}
      </form>
    </div>
  );
}

// 2. 主元件外層加上 Suspense 邊界導出
export default function HeaderSearchBar() {
  return (
    <Suspense fallback={null}>
      <HeaderSearchBarContent />
    </Suspense>
  );
}
