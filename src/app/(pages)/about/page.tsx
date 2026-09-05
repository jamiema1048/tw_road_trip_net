import React from "react";
import { Metadata } from "next";
import dynamic from "next/dynamic";

import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem";
import { ABOUT_DATA } from "@/src/data/aboutData";
import styles from "@/src/styles/pages/about/About.module.css";

// 動態載入 BottomNav，獨立拆分 Client Bundle
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

export default function AboutPage() {
  const sections = ABOUT_DATA as AboutSection[];

  return (
    <div className={styles.aboutPageContainer}>
      <div className={styles.aboutContainer}>
        {/* 首屏頂部資訊：立即渲染 */}
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.pageTitle}>關於我們（About Us）</h1>
        </div>
        <Breadcrumbs />
        <div className={styles.divider} />

        {/* 內容區塊使用 LazyItem 延遲渲染 */}
        {sections.map((section, sIndex) => {
          const sectionKey = section.id || `section-${sIndex}`;

          return (
            <LazyItem key={sectionKey}>
              <section className={styles.aboutInfoSection}>
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
            </LazyItem>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
