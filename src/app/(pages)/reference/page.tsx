import React from "react";
import { Metadata } from "next";
import ReferenceClient from "@/src/app/(client)/(reference)/ReferenceClient";
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
const Reference = () => {
  return (
    <>
      <ReferenceClient />
    </>
  );
};
export default Reference;
