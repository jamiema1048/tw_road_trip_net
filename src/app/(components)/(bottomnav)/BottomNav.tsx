import React from "react";
import Link from "next/link";
import styles from "@/src/styles/components/bottomnav/BottomNav.module.css";
import { Station, RailwayData } from "@/src/types/railway";
import ScrollToTopButton from "@/src/app/(components)/(bottomnav)/ScrollToTopButton";

interface BottomNavProps {
  station?: Station;
  railways?: RailwayData[];
}

export default function BottomNav({ station, railways = [] }: BottomNavProps) {
  return (
    <nav className={styles.nav} aria-label="bottomnav">
      {/* 獨立極小的 Client 元件處理點擊事件 */}
      <ScrollToTopButton className={styles.bottomNavButton} />

      <Link className={styles.bottomNavLink} href="/" prefetch={false}>
        回首頁
      </Link>
      <Link className={styles.bottomNavLink} href="/highways" prefetch={false}>
        公路旅途
      </Link>
      <Link className={styles.bottomNavLink} href="/railways" prefetch={false}>
        車站旅途
      </Link>

      {/* 在 Server 端直接處理好陣列尋找與 DOM 渲染 */}
      {station?.line.map((line) => {
        const railwayName =
          railways.find((r) => Number(r.id) === Number(line.lineID))?.name ||
          `ID: ${line.lineID}`;

        return (
          <Link
            key={line.lineID}
            className={styles.bottomNavLink}
            href={`/railways/${line.lineID}`}
            prefetch={false}
          >
            回{railwayName}
          </Link>
        );
      })}
    </nav>
  );
}
