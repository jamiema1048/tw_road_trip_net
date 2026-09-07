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

function AboutHeadIcon() {
  return (
    <svg
      className={styles.aboutHeadDot}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
        fill="var(--text-white-aaaa)"
      />
    </svg>
  );
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

      {section.items.map((item, iIndex) => {
        const itemKey = item.id || `item-${iIndex}`;
        return (
          <div key={itemKey} className={styles.aboutDetail}>
            <AboutHeadIcon />
            <p className={styles.aboutDetailText}>
              {item.subtitle && <strong>{item.subtitle}</strong>}
              {item.content}
            </p>
          </div>
        );
      })}
    </section>
  );
}

export default function AboutPage() {
  const sections = ABOUT_DATA as AboutSection[];
  const ESTIMATED_HEIGHTS = [460, 470, 340, 1140];
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

          // 前 2 個區塊純 SSR 直出，完全不走任何 Lazy 邏輯
          if (sIndex < 2) {
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
