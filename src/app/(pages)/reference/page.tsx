import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import { Reference_DATA } from "@/src/data/referenceData";
import styles from "@/src/styles/pages/reference/Reference.module.css";

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

// 抽離純向量 Dot 圖示 (Server 端直接繪製 HTML)
const ReferenceHeadIcon = () => (
  <svg
    className={styles.refHeadDot}
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

export default function ReferencePage() {
  const rawSections = Reference_DATA as ReferenceSection[];

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

          return (
            <section key={sectionKey} className={styles.refInfoSection}>
              <h2 className={styles.refTitle}>{section.title}</h2>

              {section.subtitle && (
                <p className={styles.refDetailText}>{section.subtitle}</p>
              )}

              {section.items.map((item, iIndex) => {
                const itemKey = item.id || `ref-item-${iIndex}`;

                return (
                  <div key={itemKey} className={styles.refDetail}>
                    <ReferenceHeadIcon />

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
                      <div className={styles.refDetailText}>
                        {item.subtitle && <strong>{item.subtitle}</strong>}
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </section>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
