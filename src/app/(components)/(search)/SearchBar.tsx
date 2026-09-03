"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "@/src/styles/components/search/SearchBar.module.css";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. 直接讀取 URL query 作為初始 State
  const initialQuery = searchParams.get("q") || "";
  const [keyword, setKeyword] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = keyword.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className={styles.searchContainer}>
      <form
        action="/search"
        method="GET"
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.searchInputBox}>
          <div className={styles.searchIconDiv} aria-label="搜尋圖示">
            <svg
              className={styles.searchIcon}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              fill="none"
            >
              <path
                d="M42 41.9999L33.314 33.3139M33.314 33.3139C34.7998 31.8281 35.9784 30.0643 36.7825 28.123C37.5866 26.1818 38.0005 24.1011 38.0005 21.9999C38.0005 19.8987 37.5866 17.8181 36.7825 15.8768C35.9784 13.9356 34.7998 12.1717 33.314 10.6859C31.8283 9.20015 30.0644 8.02157 28.1231 7.21747C26.1819 6.41337 24.1012 5.99951 22 5.99951C19.8988 5.99951 17.8182 6.41337 15.877 7.21747C13.9357 8.02157 12.1718 9.20015 10.686 10.6859C7.68539 13.6866 5.99963 17.7564 5.99963 21.9999C5.99963 26.2435 7.68539 30.3133 10.686 33.3139C13.6867 36.3146 17.7565 38.0003 22 38.0003C26.2436 38.0003 30.3134 36.3146 33.314 33.3139Z"
                stroke="var(--text-white-aaa)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <input
            name="q"
            type="text"
            className={styles.input}
            placeholder="搜尋公路、車站..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />

          {keyword && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setKeyword("")}
              aria-label="清除輸入內容"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className={styles.searchButton}
          aria-label="提交搜尋"
        >
          <p className={styles.searchButtonText}>搜尋</p>
        </button>
      </form>
    </div>
  );
}
