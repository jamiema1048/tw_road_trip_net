import React from "react";
import { Metadata } from "next";
import HomeContentClient from "@/src/app/(client)/(home)/HomeContentClient";
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
  return <HomeContentClient />;
}
