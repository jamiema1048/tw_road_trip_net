import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem";
import { ABOUT_DATA } from "@/src/data/aboutData";
import styles from "@/src/styles/pages/about/About.module.css";

// 簡化 BottomNav 的 dynamic 載入，去除重複的 loading 佔位
const BottomNav = dynamic(
  () => import("@/src/app/(components)/(bottomnav)/BottomNav"),
  {
    loading: () => <div className="h-16 w-full bg-transparent" />,
    ssr: true,
  },
);

export const metadata: Metadata = {
  title: "關於我們｜台灣鐵道與公路歷史資料庫",
  description:
    "本站為獨立開發的非營利大眾交通與地理文史資料庫，專注於全台鐵路（台鐵、糖鐵、林鐵）與公路（省道、縣道）歷史演變、廢線跡與車站考證整理。",
  openGraph: {
    title: "關於我們｜台灣鐵道與公路歷史資料庫",
    description:
      "本站為獨立開發的非營利大眾交通與地理文史資料庫，專注於全台鐵路與公路歷史演變、廢線跡與車站考證整理。",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export interface AboutItem {
  id?: string;
  subtitle?: string;
  content: string;
}

export interface AboutSection {
  id?: string;
  title: string;
  subtitle?: string;
  items: AboutItem[];
}

// 增加 isFirst 參數，讓首屏 Section 不套用 content-visibility
function SectionBlock({
  section,
  isFirst = false,
}: {
  section: AboutSection;
  isFirst?: boolean;
}) {
  return (
    <section
      className={`${styles.aboutInfoSection} ${
        isFirst ? styles.firstSection : ""
      }`}
    >
      <h2 className={styles.aboutTitle}>{section.title}</h2>

      {section.subtitle && (
        <p className={styles.aboutDetailText}>{section.subtitle}</p>
      )}
      <ul>
        {section.items.map((item, iIndex) => {
          const itemKey = item.id || `item-${iIndex}`;
          return (
            <li
              key={itemKey}
              className={`${styles.aboutDetail} ${styles.aboutDetailText}`}
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

export default function AboutPage() {
  const sections = ABOUT_DATA as AboutSection[];
  const ESTIMATED_HEIGHTS = [460, 430, 340, 1140];
  return (
    <div className={styles.aboutPageContainer}>
      <div className={styles.aboutContainer}>
        {/* 首屏頂部：純靜態 SSR 直出 */}
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.pageTitle}>關於我們（About Us）</h1>
        </div>
        <Breadcrumbs />
        <div className={styles.divider} />

        {/* 內容區塊 */}
        {sections.map((section, sIndex) => {
          const sectionKey = section.id || `section-${sIndex}`;

          // 僅保留第一段首屏 SSR，降低慢速 CPU 的初始文字排版量。
          if (sIndex === 0) {
            return (
              <SectionBlock key={sectionKey} section={section} isFirst={true} />
            );
          }
          const minHeight = `${ESTIMATED_HEIGHTS[sIndex] || 400}px`;

          // 第 3 個區塊起交給 IntersectionObserver Lazy 化
          return (
            <LazyItem key={sectionKey} minHeight={minHeight}>
              <SectionBlock section={section} />
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
