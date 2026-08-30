import React from "react";
import { Metadata } from "next";
import AboutClient from "@/src/app/(client)/(about)/AboutClient";
export const metadata: Metadata = {
  title: "關於我們｜台灣鐵道與公路歷史資料庫",
  description:
    "本站為獨立開發的非營利大眾交通與地理文史資料庫，專注於全台鐵路（台鐵、糖鐵、林鐵）與公路（省道、縣道）歷史演變、廢線跡與車站考證整理。",
  openGraph: {
    title: "關於我們｜台灣鐵道與公路歷史資料庫",
    description:
      "本站為獨立開發的非營利大眾交通與地理文史資料庫，專注於全台鐵路與公路歷史演變、廢線跡與車站考證整理。",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const About = () => {
  return <AboutClient />;
};

export default About;
