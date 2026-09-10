"use client";

import { startTransition, useState } from "react";
import { RailwayCompanyGroup } from "./RailwayCompanyGroup";
import styles from "@/src/styles/components/railway/RailwayGroup.module.css";

interface Line {
  id: number;
  name: string;
  co: number;
}

export function RailwayCompanyGroupShell({
  co,
  companyName,
  lineList,
}: {
  co: string | number;
  companyName: string;
  lineList: Line[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const arrowClass = `${styles.arrowIcon} ${isOpen ? styles.arrowIconOpen : styles.arrowIconClosed}`;

  const handleToggle = () => {
    if (isPreparing) return;

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    // 先繪製可回應的載入狀態；完整清單在下一個工作階段以低優先序掛載。
    setIsPreparing(true);
    requestAnimationFrame(() => {
      window.setTimeout(() => {
        startTransition(() => {
          setIsOpen(true);
          setIsPreparing(false);
        });
      }, 0);
    });
  };

  return (
    <div className={styles.railwayGroup}>
      <button
        type="button"
        className={styles.railwayCoTitle}
        onClick={handleToggle}
        aria-expanded={isOpen}
      >
        <h2 className={styles.railwayText}>{companyName}</h2>
        <svg className={arrowClass} viewBox="0 0 48 48" aria-hidden="true">
          <path d="M12 18L24 30L36 18" fill="none" stroke="currentColor" strokeWidth="3" />
        </svg>
      </button>
      {isPreparing && (
        <div className={styles.openingLoader} role="status">
          <span className={styles.loadingSpinner} aria-hidden="true" />
          正在載入鐵路路線…
        </div>
      )}
      {isOpen && (
        <RailwayCompanyGroup
          co={co}
          companyName={companyName}
          lineList={lineList}
          hideTitle
          initiallyOpen
        />
      )}
    </div>
  );
}
