import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem";
import { TERMS_DATA } from "@/src/data/termsData";
import styles from "@/src/styles/pages/terms/Terms.module.css";

// 動態載入 BottomNav，獨立拆分 Bundle 降低首屏 TBT
const BottomNav = dynamic(
  () => import("@/src/app/(components)/(bottomnav)/BottomNav"),
  {
    loading: () => <div className="h-16 w-full bg-transparent" />,
    ssr: true,
  },
);

export const metadata: Metadata = {
  title: "使用條款與隱私權政策｜台灣鐵道與公路歷史資料庫",
  description:
    "台灣鐵道與公路歷史資料庫之服務條款、版權聲明、免責聲明與個人資料保護隱私權政策說明。",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export interface TermItem {
  id?: string;
  subtitle: string;
  content: string;
}

export interface TermSection {
  id?: string;
  title: string;
  items: TermItem[];
}

function TermSectionBlock({ section }: { section: TermSection }) {
  return (
    <section className={styles.termsInfoSection}>
      <h2 className={styles.termsTitle}>{section.title}</h2>

      <ul>
        {section.items.map((item, iIndex) => {
          const itemKey = item.id || `item-${iIndex}`;

          return (
            <li
              key={itemKey}
              className={`${styles.termsDetail} ${styles.termsDetailText}`}
            >
              {item.subtitle && <strong>{item.subtitle}</strong>}
              {item.content}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function TermsPage() {
  const sections = TERMS_DATA as TermSection[];
  const ESTIMATED_HEIGHTS = [400, 540, 380, 450, 350];

  return (
    <div className={styles.termsPageContainer}>
      <div className={styles.termsContainer}>
        {/* 首屏頂部資訊：立即渲染 */}
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.pageTitle}>
            使用條款與免責聲明（Terms of Service & Disclaimer）
          </h1>
        </div>

        <Breadcrumbs />
        <div className={styles.divider} />

        {sections.map((section, sIndex) => {
          const sectionKey = section.id || `section-${sIndex}`;

          // 僅保留第一段首屏 SSR，降低慢速 CPU 的初始文字排版量。
          if (sIndex === 0) {
            return <TermSectionBlock key={sectionKey} section={section} />;
          }
          const minHeight = `${ESTIMATED_HEIGHTS[sIndex] || 400}px`;

          // 第 3 個區塊起交給 IntersectionObserver Lazy 化，並給予預估 minHeight 佔位
          return (
            <LazyItem key={sectionKey} minHeight={minHeight}>
              <TermSectionBlock section={section} />
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
