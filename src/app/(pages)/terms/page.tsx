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

function TermsHeadIcon() {
  return (
    <svg
      className={styles.termsHeadDot}
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

export default function TermsPage() {
  const sections = TERMS_DATA as TermSection[];

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

        {/* 條款內容區塊使用 LazyItem 延遲渲染 */}
        {sections.map((section, sIndex) => {
          const sectionKey = section.id || `section-${sIndex}`;

          return (
            <LazyItem key={sectionKey}>
              <section className={styles.termsInfoSection}>
                <h2 className={styles.termsTitle}>{section.title}</h2>

                {section.items.map((item, iIndex) => {
                  const itemKey = item.id || `item-${iIndex}`;

                  return (
                    <div key={itemKey} className={styles.termsDetail}>
                      <TermsHeadIcon />
                      <p className={styles.termsDetailText}>
                        <strong>{item.subtitle}</strong>
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
