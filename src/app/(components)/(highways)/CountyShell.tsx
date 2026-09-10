"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { CountySection } from "./County";
import styles from "@/src/styles/components/highway/County.module.css";

const DeferredCounty = dynamic(() => import("./County"), {
  ssr: false,
  loading: () => <div role="status">載入縣市道路線中…</div>,
});

export default function CountyShell({ sections }: { sections: CountySection[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="county" data-testid="county" className={styles.highwayArea}>
      <div
        className={styles.highwayAreaTitle}
        onClick={() => setIsOpen((open) => !open)}
        onPointerEnter={() => void import("./County")}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        <h2 className={styles.highwayAreaTitleText}>縣市道</h2>
        <svg className={`${styles.titleArrowIcon} ${isOpen ? styles.iconOpen : styles.iconClosed}`} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 18L24 30L36 18" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      {isOpen && <DeferredCounty sections={sections} hideTitle initiallyOpen />}
    </div>
  );
}
