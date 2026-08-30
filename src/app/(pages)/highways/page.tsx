import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { HighwaySchema } from "@/src/models/Highway";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import HighwayListClient from "@/src/app/(client)/(highways)/HighwayListClient";

// 🟢 1. 設定符合 SEO 規範的 Metadata
export const metadata: Metadata = {
  title: "省道與縣道公路列表｜公路與廢線遺跡資料庫",
  description:
    "收錄全台省道、縣道及廢棄舊線等公路路線資料，包含里程起終點、路線里程及現場影像紀錄。",
  keywords: [
    "公路列表",
    "台灣省道",
    "台灣縣道",
    "公路歷史",
    "廢線遺跡",
    "舊線跡",
    "公路里程",
  ],
  openGraph: {
    title: "省道與縣道公路列表｜公路與廢線遺跡資料庫",
    description: "完整收錄台灣省道與縣道資料，包含現場照片紀錄。",
    type: "website",
    siteName: "公路與廢線遺跡資料庫",
  },
  twitter: {
    card: "summary_large_image",
    title: "省道與縣道公路列表｜公路與廢線遺跡資料庫",
    description: "完整收錄台灣省道與縣道資料，包含現場照片紀錄。",
  },
};

interface HighwayImage {
  _id: Types.ObjectId;
  url: string; // 圖片位址
  description?: string; // 加 ? 代表選填
  capturedAt?: Date; // 選填：拍攝日期
}

export type HighwayStatus = "active" | "disused" | "unlisted";

export interface MongoHighway {
  _id: Types.ObjectId;
  id: number; // 台1線編號，如 40100
  name: string; // 台1線
  status: HighwayStatus;
  highwayIcon?: string;
  routeName: string; // 台北－楓港
  length: number;
  currentLength: number;
  start: string;
  currentStart: string;
  end: string;
  currentEnd: string;
  otherName: string[]; // 🟢 陣列正確寫法：string[]
  highest: number;
  highestPlace: string;
  remark: string;
  images: HighwayImage[]; // 🟢 嵌套陣列正確寫法：HighwayImage[]
}

export default async function HighwayListServer() {
  let detailedHighways;
  try {
    // 1. 連線到 MongoDB
    const { highwayConn } = await getConnections();

    // 2. 建立/取得 Model (確保連線與 Schema 綁定)
    const HighwayModel =
      highwayConn.models.Highway || highwayConn.model("Highway", HighwaySchema);

    // 3. 抓取所有路線資料，並強型別斷言為 MongoRailway 陣列
    const allHighways = (await HighwayModel.find({}).lean()) as MongoHighway[];

    if (!allHighways || allHighways.length === 0) {
      notFound();
    }
    console.log(HighwayModel);

    // 3. 格式化資料（處理 MongoDB 的 _id 與 Date 物件轉為純字串/數字）
    detailedHighways = allHighways.map((hwy) => ({
      ...hwy,
      _id: hwy._id.toString(), // 把 ObjectId 轉成字串
      status: hwy.status || "active",
      highwayIcon: hwy.highwayIcon || `/icons/highways/${hwy.id}.svg`,
      // 確保 images 裡的日期也能被 Client Component 讀取
      images: hwy.images.map((img) => ({
        ...img,
        _id: img._id ? img._id.toString() : "",
        capturedAt: img.capturedAt
          ? new Date(img.capturedAt).toISOString()
          : null,
      })),
      currentImageIndex: 0, // 為了你的 Client 端切換功能保留
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
    throw new Error(error?.message || "無法載入公路資料，請檢查資料庫連線。");
  }

  // 🟢 2. 建立動態 JSON-LD 結構化資料 (ItemList Schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "台灣公路與廢線目錄",
    description: "收錄全台省道與縣道之路線清單",
    numberOfItems: detailedHighways.length,
    itemListElement: detailedHighways.map((hwy, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: `${hwy.name} (${hwy.routeName})`,
        description: `起點：${hwy.currentStart || hwy.start}，終點：${
          hwy.currentEnd || hwy.end
        }，全長：${hwy.currentLength || hwy.length} 公里。`,
      },
    })),
  };

  // 4. 直接把完整的資料丟給 Client Component
  return (
    <>
      {/* 注入 Schema 結構化資料給 Google 爬蟲 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HighwayListClient highways={detailedHighways} />
    </>
  );
}
