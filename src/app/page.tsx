import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TempImg from "@/public/Logo/Header.png";
import styles from "@/src/styles/pages/home/Home.module.css";

export const metadata: Metadata = {
  title: "首頁 | 探索台灣鐵路與公路歷史遺蹟",
  description:
    "揹起背包，踏上尋找地圖上未標示的廢棄火車站與歷史公路的旅途。帶你深入探索台灣交通歷史遺跡與古道故事。",
  keywords: ["台灣交通", "廢棄車站", "歷史公路", "鐵道探索", "公路旅途"],
  openGraph: {
    title: "來場探索台灣交通的旅途吧",
    description: "尋找地圖上沒出現的廢棄火車站與公路遺跡",
    images: [
      {
        url: "/Logo/Header.png",
        width: 1200,
        height: 630,
        alt: "台灣交通探索",
      },
    ],
  },
};

export default function HomePage(): React.ReactElement {
  return (
    <div className={styles.homeContainer}>
      <main className={styles.contentWrapper}>
        <h1 className={styles.title}>來場探索台灣交通的旅途吧</h1>
        <div className={styles.description}>
          小時候翻開地圖，心裡不禁疑問著，鐵路和公路，真的只有這些嗎?
          <br />
          意外找到了地圖上沒出現的廢棄火車站，讓我更篤定答案不只如此
          <br />
          揹起背包，就踏上了這條不回頭尋找答案的旅途了
        </div>
        <div className={styles.divider} />
        <div className={styles.journeyCards}>
          <Link
            href="/railways"
            className={styles.journeyCard}
            prefetch={false}
          >
            <Image
              alt="車站旅途"
              src={TempImg}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 360px"
              className={styles.cardImage}
            />
            <div className={styles.journeyLabel}>車站旅途</div>
          </Link>
          <Link
            href="/highways"
            className={styles.journeyCard}
            prefetch={false}
          >
            <Image
              alt="公路旅途"
              src={TempImg}
              fill
              sizes="(max-width: 768px) 100vw, 360px"
              className={styles.cardImage}
            />
            <div className={styles.journeyLabel}>公路旅途</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
