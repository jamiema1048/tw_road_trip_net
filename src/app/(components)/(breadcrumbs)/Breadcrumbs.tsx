"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/src/styles/components/breadcrumbs/Breadcrumbs.module.css";

// 🔴 關鍵 1：路徑對照表 (Path Name Dictionary)
// 負責判斷 URL 英文片段對應到的中文名稱
const BREADCRUMB_MAP: Record<string, string> = {
  home: "首頁",
  railways: "鐵路總覽",
  highways: "公路總覽",
  lines: "路線列表",
  stations: "車站列表",
  reference: "參考資料",
  about: "關於我們",
  terms: "使用條款",
  // 若有動態 ID (例如 /railways/123)，可以由組件邏輯過濾或動態處理
};

interface BreadcrumbsProps {
  /** 手動傳入路徑（選填，若沒傳入會自動使用目前網址 pathname） */
  currentPath?: string;
  /** 動態 ID 名稱對照表，例如：{ "40900": "台9線", "mountain": "台中線（山線）" } */
  customNames?: Record<string, string>;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentPath,
  customNames = {},
}) => {
  console.log(customNames);
  const pathnameFromHook = usePathname();
  // 若沒有手動帶 currentPath，預設直接抓當前網址
  const pathname = currentPath || pathnameFromHook || "";
  // 🔴 關鍵 2：將路徑拆解為陣列
  // 例如 "/railways/lines" -> ["railways", "lines"]
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  // 組合出路徑物件陣列 [{ name: '首頁', url: '/' }, { name: '鐵道資訊', url: '/railways' }, ...]
  const breadcrumbItems = [
    { name: BREADCRUMB_MAP["home"] || "首頁", url: "/" },
    ...pathSegments.map((segment, index) => {
      // 算出當前節點的完整 URL
      const url = `/${pathSegments.slice(0, index + 1).join("/")}`;

      // 優先權：自訂名稱 > 對照表名稱 > 原始路徑文字
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
                  <Link href={item.url} className={styles.navLink}>
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
};

export default Breadcrumbs;
