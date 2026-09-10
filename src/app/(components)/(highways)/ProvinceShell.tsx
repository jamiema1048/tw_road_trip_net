"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { HighwayListItem } from "@/src/types/highway";
import styles from "@/src/styles/components/highway/Province.module.css";

const DeferredProvince = dynamic(() => import("./Province"), {
  ssr: false,
  loading: () => <div role="status">載入省道路線中…</div>,
});

interface Props {
  section420: HighwayListItem[];
  section440: HighwayListItem[];
}

export default function ProvinceShell(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="province" data-testid="province" className={styles.highwayArea}>
      <div
        className={styles.highwayAreaTitle}
        onClick={() => setIsOpen((open) => !open)}
        onPointerEnter={() => void import("./Province")}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
      >
        <h2 className={styles.highwayAreaTitleText}>省道</h2>
        <svg className={`${styles.titleArrowIcon} ${isOpen ? styles.isOpen : ""}`} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 18L24 30L36 18" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </div>
      {isOpen && <DeferredProvince {...props} hideTitle initiallyOpen />}
    </div>
  );
}
