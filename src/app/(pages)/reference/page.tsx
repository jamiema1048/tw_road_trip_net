import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import { Reference_DATA } from "@/src/data/referenceData";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem";
import styles from "@/src/styles/pages/reference/Reference.module.css";

const BottomNav = dynamic(
  () => import("@/src/app/(components)/(bottomnav)/BottomNav"),
  {
    loading: () => <div className="h-16 w-full bg-transparent" />,
    ssr: true,
  },
);

export const metadata: Metadata = {
  title: "參考資料與引用文獻｜台灣鐵道與公路歷史資料庫",
  description:
    "本站收錄之台灣鐵路（台鐵、糖鐵、林鐵）與公路（省道、縣道）歷史數據、舊地圖圖資、官方公報與學術著作等參考資料與引用文獻來源標示。",
  openGraph: {
    title: "參考資料與引用文獻｜台灣鐵道與公路歷史資料庫",
    description:
      "本站收錄之台灣鐵路與公路歷史數據、舊地圖圖資、官方公報與學術著作等參考資料與引用文獻來源標示。",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export interface ReferenceItem {
  id?: string;
  subtitle: string;
  content?: string;
  link?: string;
}

export interface ReferenceSection {
  id?: string;
  title: string;
  subtitle?: string;
  items: ReferenceItem[];
}

// 抽出單一 Section 內容，保持程式碼乾淨
function ReferenceSectionBlock({ section }: { section: ReferenceSection }) {
  return (
    <section className={styles.refInfoSection}>
      <h2 className={styles.refTitle}>{section.title}</h2>

      {section.subtitle && (
        <p className={styles.refDetailText}>{section.subtitle}</p>
      )}
      <ul>
        {section.items.map((item, iIndex) => {
          const itemKey = item.id || `ref-item-${iIndex}`;

          return (
            <li
              key={itemKey}
              className={`${styles.refDetail} ${styles.refDetailText}`}
            >
              {item.link ? (
                <Link
                  className={styles.refDetailLink}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                >
                  {item.subtitle && <strong>{item.subtitle}</strong>}
                  {item.content}
                </Link>
              ) : (
                <>
                  {item.subtitle && <strong>{item.subtitle}</strong>}
                  {item.content}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ReferencePage() {
  const rawSections = Reference_DATA as ReferenceSection[];
  const ESTIMATED_HEIGHTS = [480, 470, 590, 1400, 500, 290];
  return (
    <div className={styles.refPageContainer}>
      <div className={styles.refContainer}>
        <div className={styles.refTitleContainer}>
          <h1 className={styles.refPageTitle}>
            參考資料與來源聲明（Data Sources & Attributions）
          </h1>
        </div>

        <Breadcrumbs />

        <div className={styles.refDivider} />

        {rawSections.map((section, sIndex) => {
          const sectionKey = section.id || `ref-section-${sIndex}`;

          // 僅保留第一段首屏 SSR，降低慢速 CPU 的初始文字排版量。
          if (sIndex === 0) {
            return <ReferenceSectionBlock key={sectionKey} section={section} />;
          }
          const minHeight = `${ESTIMATED_HEIGHTS[sIndex] || 90}px`;

          // 🟢 2. 針對離屏區塊給予預估 minHeight 佔位，避免 Layout Shift (CLS)
          return (
            <LazyItem key={sectionKey} minHeight={minHeight}>
              <ReferenceSectionBlock section={section} />
            </LazyItem>
          );
        })}
      </div>

      <LazyItem minHeight="64px">
        <BottomNav />
      </LazyItem>
    </div>
  );
}
