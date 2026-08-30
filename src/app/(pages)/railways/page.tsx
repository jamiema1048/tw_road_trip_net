// src/app/railways/LinePageServer.tsx
import LinePageClient from "@/src/app/(client)/(railways)/LinePageClient";
import { notFound } from "next/navigation";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { RailwaySchema } from "@/src/models/Railway";
import { Types } from "mongoose";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "全台鐵路路線總覽｜台鐵、林鐵、糖鐵與廢線遺跡",
  description:
    "收錄台灣鐵路路線總覽，包含台鐵主支線、阿里山林業鐵路、糖業鐵路及歷史廢線軌跡，提供完整營運區間與車站歷史紀錄。",
  keywords: [
    "台灣鐵路",
    "台鐵路線",
    "阿里山林鐵",
    "糖業鐵路",
    "鐵路廢線",
    "車站遺跡",
    "鐵道歷史",
  ],
  openGraph: {
    title: "全台鐵路路線總覽｜台鐵、林鐵、糖鐵與廢線遺跡",
    description:
      "完整收錄全台鐵路路線，涵蓋台鐵、林鐵、糖鐵與歷史廢線之路線營運區間與車站紀錄。",
    type: "website",
    siteName: "鐵道與公路廢線遺跡資料庫",
  },
  twitter: {
    card: "summary_large_image",
    title: "全台鐵路路線總覽｜台鐵、林鐵、糖鐵與廢線遺跡",
    description:
      "完整收錄全台鐵路路線，涵蓋台鐵、林鐵、糖鐵與歷史廢線之路線營運區間與車站紀錄。",
  },
};

interface BaseDistrict {
  districtID: number;
  districtName: string;
  prevArea?: number;
  nextArea?: number;
}

interface MongoDistrict extends BaseDistrict {
  _id?: Types.ObjectId;
}

interface MongoRailway {
  _id: Types.ObjectId;
  id: number;
  name: string;
  co: number;
  systemName?: string;
  district: MongoDistrict[];
}

export default async function LinePageServer() {
  let serializedLines;
  try {
    // 1. 取得 railway 專屬連線
    const { railwayConn } = await getConnections();

    // 2. 建立/取得 Model (確保連線與 Schema 綁定)
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    // 3. 抓取所有路線資料，並強型別斷言為 MongoRailway 陣列
    const allRailways = (await RailwayModel.find({}).lean()) as MongoRailway[];

    if (!allRailways || allRailways.length === 0) {
      notFound();
    }

    // 4. 資料標準化 (將所有的 ObjectId 轉成字串)
    // 透過確切的介面定義，這裡不再需要 any
    serializedLines = allRailways.map((line) => ({
      ...line,
      _id: line._id.toString(),
      district: (line.district || []).map((d) => ({
        ...d,
        _id: d._id?.toString(),
      })),
    }));
  } catch (err: unknown) {
    const error = err as (Error & { digest?: string }) | null | undefined;
    if (
      error?.digest?.includes("NEXT_HTTP_ERROR_FALLBACK") ||
      error?.message === "NEXT_NOT_FOUND"
    ) {
      throw err;
    }

    console.error("載入公路頁面失敗，詳細錯誤原因:", err);

    // 🟢 4. 將「真正的錯誤訊息」傳遞給 error.tsx，方便除錯
    throw new Error(error?.message || "無法載入鐵路資料，請檢查資料庫連線。");
  }

  // 🟢 2. 建立網頁結構化資料 (ItemList Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "全台鐵路路線與廢線目錄",
    description: "收錄全台台鐵、林鐵、糖鐵與廢線之路線清單",
    numberOfItems: serializedLines.length,
    itemListElement: serializedLines.map((line, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: line.name,
        description: `包含 ${line.district.length} 個營運/歷史區間`,
      },
    })),
  };

  // 5. 將處理好的陣列傳給 Client 端
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LinePageClient lines={serializedLines} />
    </>
  );
}
