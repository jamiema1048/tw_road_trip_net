"use client";

import dynamic from "next/dynamic";
import { TrainFront } from "lucide-react";

import type { RailwayNetworkMapData } from "@/src/features/map/server";
import styles from "./RailwayMapPanel.module.css";

const RailwayNetworkMap = dynamic(
  () => import("@/src/features/map/client").then((module) => module.RailwayNetworkMap),
  { ssr: false, loading: () => <div className={styles.mapLoading}>載入地圖中…</div> },
);

export default function RailwayNetworkMapPanel({
  data,
}: {
  data: RailwayNetworkMapData;
}) {
  return (
    <section className={styles.mapPanel} aria-label="全台鐵道路線示意圖">
      <header className={styles.header}>
        <div className={styles.titleGroup}><TrainFront aria-hidden size={24} strokeWidth={2.5} /><h2>全台鐵道路線示意圖</h2></div>
        <p>＊點選路線查看詳細資訊</p>
      </header>
      <div className={styles.divider} />
      <RailwayNetworkMap data={data} />
    </section>
  );
}
