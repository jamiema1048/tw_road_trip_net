"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/src/styles/components/breadcrumbs/Breadcrumbs.module.css";

// 🔴 路徑對照表 (Path Name Dictionary)
const BREADCRUMB_MAP: Record<string, string> = {
  home: "首頁",
  railways: "鐵路總覽",
  highways: "公路總覽",
  lines: "路線列表",
  stations: "車站列表",
  reference: "參考資料",
  about: "關於我們",
  terms: "使用條款",
};

interface BreadcrumbsProps {
  /** 手動傳入路徑（未傳入時自動讀取目前網址 Pathname） */
  currentPath?: string;
  /** 動態 ID 名稱對照表，例如：{ "40900": "台9線", "mountain": "台中線（山線）" } */
  customNames?: Record<string, string>;
}

const EMPTY_CUSTOM_NAMES: Record<string, string> = {};

const Breadcrumbs: React.FC<BreadcrumbsProps> = memo(
  ({ currentPath, customNames = EMPTY_CUSTOM_NAMES }) => {
    // 優先使用 props 傳進來的 currentPath，若無則透過 usePathname 取得當前網址
    const pathname = usePathname();
    const activePath = currentPath ?? pathname ?? "";

    // 將路徑拆解為陣列，例如 "/railways/lines" -> ["railways", "lines"]
    const pathSegments = activePath.split("/").filter(Boolean);

    // 組合出路徑物件陣列 [{ name: '首頁', url: '/' }, ...]
    const breadcrumbItems = [
      { name: BREADCRUMB_MAP["home"] || "首頁", url: "/" },
      ...pathSegments.map((segment, index) => {
        const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const displayName =
          customNames[segment] || BREADCRUMB_MAP[segment] || segment;

        return { name: displayName, url };
      }),
    ];

    return (
      <nav className={styles.nav} aria-label="breadcrumb">
        <ol className={styles.list}>
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;

            return (
              <li key={item.url} className={styles.item}>
                {isLast ? (
                  <span className={styles.currentPage} aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link
                      href={item.url}
                      className={styles.navLink}
                      prefetch={false}
                    >
                      {item.name}
                    </Link>

                    <svg
                      className={styles.separator}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9.5 6L15.5 12L9.5 18"
                        stroke="var(--text-white-aaaa)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = "Breadcrumbs";
export default Breadcrumbs;
