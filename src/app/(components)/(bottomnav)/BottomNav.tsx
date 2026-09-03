"use client";
import React from "react";
import styles from "@/src/styles/components/bottomnav/BottomNav.module.css";
import Link from "next/link";
import { Station, RailwayData } from "@/src/types/railway";

interface BottomNavProps {
  station?: Station;
  railways?: RailwayData[];
}

export default function BottomNav({ station, railways = [] }: BottomNavProps) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滾動效果
    });
  };
  return (
    <nav className={styles.nav} aria-label="bottomnav">
      <button
        type="button"
        className={styles.bottomNavButton}
        onClick={scrollToTop}
      >
        回到最上方
      </button>
      <Link className={styles.bottomNavLink} href="/">
        回首頁
      </Link>
      <Link className={styles.bottomNavLink} href="/highways">
        公路旅途
      </Link>
      <Link className={styles.bottomNavLink} href="/railways">
        車站旅途
      </Link>
      {station?.line.map((line) => {
        const railwayName =
          railways.find((r) => Number(r.id) === Number(line.lineID))?.name ||
          `ID: ${line.lineID}`;

        return (
          <Link
            key={line.lineID}
            className={styles.bottomNavLink}
            href={`/railways/${line.lineID}`}
          >
            回{railwayName}
          </Link>
        );
      })}
    </nav>
  );
}
