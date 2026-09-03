"use client";

import React, { useEffect } from "react";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import styles from "@/src/styles/pages/error/Error.module.css";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const errorMessage = error?.message || "發生未知錯誤，請稍後再試。";
  const errorDigest = error?.digest;

  useEffect(() => {
    // 1. 動態更新 Client-side 標題 (替換原先 next/head)
    document.title = errorMessage;

    // 2. 錯誤紀錄
    console.error("抓取到的系統錯誤：", error);
  }, [error, errorMessage]);

  return (
    <div className={styles.container}>
      {/* 1. 錯誤編號區 */}
      <h1 className={styles.errorCode}>500</h1>

      {/* 2. 錯誤內容重點區 */}
      <h2 className={styles.errorMessage}>{errorMessage}</h2>
      {errorDigest && (
        <div className={styles.digestCode}>
          Digest ID: <span>{errorDigest}</span>
        </div>
      )}

      <svg
        width="363"
        height="480"
        viewBox="0 0 363 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="31"
          y="364"
          width="312"
          height="40"
          fill="var(--text-gray-a)"
        />
        <rect
          x="31"
          y="436"
          width="312"
          height="40"
          fill="var(--text-gray-a)"
        />
        <rect
          x="31"
          y="292"
          width="312"
          height="40"
          fill="var(--text-gray-a)"
        />
        <rect
          x="31"
          y="220"
          width="312"
          height="40"
          fill="var(--text-gray-a)"
        />
        <rect
          x="31"
          y="148"
          width="312"
          height="40"
          fill="var(--text-gray-a)"
        />
        <rect
          y="73.5941"
          width="106"
          height="40"
          transform="rotate(-31 0 73.5941)"
          fill="var(--text-gray-a)"
        />
        <rect
          x="262.269"
          y="19"
          width="106"
          height="40"
          transform="rotate(24 262.269 19)"
          fill="var(--text-gray-a)"
        />
        <path
          d="M70.871 480H91V128.802L79.4258 86.3371L67.8516 66.2522L56.7806 41.0027L40.6774 0L38.6645 7.14539L33.129 4.27613V12.3101L27.5935 7.14539V17.4747L22.0581 9.4408L19.0387 17.4747L13 4.27613C13 54.6169 70.871 87.0618 70.871 128.802V480Z"
          fill="var(--text-white-aaaa)"
        />
        <path
          d="M283 480H303V125.167L307 93.0144L322 41.9139L363 9.76077L351.5 13.2057V9.76077L345.5 13.2057L348.5 6.88995L342.5 9.76077L345.5 2.87081L342.5 4.5933V0L310 33.3014L291.5 75.7895L283 125.167V480Z"
          fill="var(--text-white-aaaa)"
        />
      </svg>

      {/* 3. 按鈕操作區 */}
      <BottomNav />
      <button className={styles.primaryButton} onClick={() => reset()}>
        重新嘗試 (Reset)
      </button>
    </div>
  );
}
