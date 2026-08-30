import React from "react";
import { Metadata } from "next";
import TermsClient from "../../(client)/(terms)/TermsClient";
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

const Terms = () => {
  return (
    <>
      <TermsClient />
    </>
  );
};
export default Terms;
