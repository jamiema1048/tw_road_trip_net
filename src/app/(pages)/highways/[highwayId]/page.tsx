// src/app/highways/HighwayContentServer.tsx
export const dynamic = "force-dynamic";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import HighwayContentClient from "@/src/app/(client)/(highways)/HighwayContentClient";
import { notFound } from "next/navigation";
import { cache } from "react";
import { Metadata } from "next";
import { HighwaySchema } from "@/src/models/Highway";
import { Types } from "mongoose";

// 1. 定義單張圖片在 MongoDB 內的型別
export interface HighwayImageDoc {
  _id?: Types.ObjectId | string;
  url?: string;
  description?: string;
  capturedAt?: string | Date | null;
  [key: string]: unknown; // 容許圖片可能包含的其他延伸欄位
}

// 2. 定義 Highway Document 型別
export interface HighwayDoc {
  _id?: Types.ObjectId | string;
  id?: number;
  name?: string;
  status?: "active" | "disused" | "unlisted";
  highwayIcon?: string;
  routeName?: string;
  length?: number;
  currentLength?: number;
  start?: string;
  currentStart?: string;
  end?: string;
  currentEnd?: string;
  otherName?: string[];
  highest?: number;
  highestPlace?: string;
  remark?: string;
  images?: Array<{
    _id?: Types.ObjectId | string;
    url?: string;
    description?: string;
    capturedAt?: string | Date | null;
  }>;
  [key: string]: unknown;
}

type PageParams = Promise<{ highwayId: string }>;

// ----------------------------------------------------------------------
// 1. React Cache 機制：封裝並共享同一次 Request 中的 DB 查詢
// ----------------------------------------------------------------------
const getHighwayData = cache(async (highwayId: number) => {
  const { highwayConn } = await getConnections();

  const HighwayModel =
    highwayConn.models.Highway ||
    highwayConn.model<HighwayDoc>("Highway", HighwaySchema, "highways");

  const highwayData = await HighwayModel.findOne({
    id: highwayId,
  }).lean<HighwayDoc | null>();

  return highwayData;
});

// ----------------------------------------------------------------------
// 2. SSG / ISR 預先渲染設定
// ----------------------------------------------------------------------
// 允許未預渲染的公路頁面於首次造訪時動態生成
export const dynamicParams = true;

// 增量靜態再生 (ISR)：設定頁面快取過期時間（例如：24 小時）
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const { highwayConn } = await getConnections();
    const HighwayModel =
      highwayConn.models.Highway ||
      highwayConn.model<HighwayDoc>("Highway", HighwaySchema, "highways");

    // 撈取所有公路 ID 預先渲染頁面
    const highways = await HighwayModel.find({}).select("id").lean();

    return highways
      .map((h) => ({
        highwayId: h.id?.toString() || "",
      }))
      .filter((p) => p.highwayId !== "");
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// 3. Metadata 動態生成 (共享 getHighwayData 快取)
// ----------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { highwayId } = await params;
    const numericHighwayId = Number(highwayId);

    if (isNaN(numericHighwayId)) return { title: "無效的公路 ID" };

    const highwayData = await getHighwayData(numericHighwayId);
    if (!highwayData) return { title: "找不到公路資料" };

    // 處理陣列與顯示文字（安全性檢查）
    const otherNames =
      Array.isArray(highwayData.otherName) && highwayData.otherName.length > 0
        ? `（${highwayData.otherName.join("、")}）`
        : "";

    const highestInfo = highwayData.highestPlace
      ? ` | 最高點：${highwayData.highestPlace}`
      : "";
    const title = `${highwayData.name}${otherNames}：${highwayData.routeName}${highestInfo} | 公路資料庫`;

    const description =
      `${highwayData.name}${highwayData.routeName}完整紀錄。` +
      `起點：${highwayData.currentStart || highwayData.start}，` +
      `終點：${highwayData.currentEnd || highwayData.end}。` +
      `全長約 ${highwayData.currentLength || highwayData.length} 公里。` +
      `收錄公路沿革、${highwayData.highestPlace ? "最高點位置及" : ""}實地探查紀錄照片。`;

    const keywords = [
      highwayData.name,
      highwayData.routeName,
      "公路沿革",
      "公路紀錄",
      "里程資訊",
      "台灣公路",
      ...(highwayData.otherName || []),
      highwayData.highestPlace,
    ].filter((item): item is string => Boolean(item));

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
        images: highwayData.images?.[0]?.url
          ? [{ url: highwayData.images[0].url }]
          : [],
      },
    };
  } catch (error) {
    console.error("Highway Metadata error:", error);
    return { title: "公路資料載入錯誤" };
  }
}

export default async function HighwayContentServer({
  params,
}: {
  params: PageParams;
}) {
  const resolvedParams = await params;
  const highwayIdStr = resolvedParams.highwayId;

  // 🟢 修正 3：明確轉為數字，並阻擋無效 ID
  const numericHighwayId = Number(highwayIdStr);
  if (isNaN(numericHighwayId)) {
    notFound();
  }

  let serializedHighway;
  try {
    const highwayData = await getHighwayData(numericHighwayId);

    if (!highwayData) {
      notFound();
    }

    // 序列化處理 (Serialization)
    serializedHighway = {
      _id: highwayData._id?.toString() || "",
      id: highwayData.id ?? numericHighwayId,
      name: highwayData.name || "",
      status: highwayData.status || "active",
      highwayIcon: highwayData.highwayIcon || "/icons/highways/default.svg",
      routeName: highwayData.routeName || "",
      length: highwayData.length ?? 0,
      currentLength: highwayData.currentLength ?? 0,
      start: highwayData.start || "",
      currentStart: highwayData.currentStart || "",
      end: highwayData.end || "",
      currentEnd: highwayData.currentEnd || "",
      otherName: Array.isArray(highwayData.otherName)
        ? highwayData.otherName
        : [],
      highest: highwayData.highest ?? 0,
      highestPlace: highwayData.highestPlace || "",
      remark: highwayData.remark || "",
      images: (highwayData.images || []).map((img) => ({
        _id: img._id?.toString(),
        url: img.url || "",
        description: img.description || "",
        capturedAt: img.capturedAt
          ? new Date(img.capturedAt).toISOString()
          : null,
      })),
    };
  } catch (err: unknown) {
    const error = err as (Error & { digest?: string }) | null | undefined;
    if (
      error?.digest?.includes("NEXT_HTTP_ERROR_FALLBACK") ||
      error?.message === "NEXT_NOT_FOUND"
    ) {
      throw err;
    }

    console.error("載入公路頁面失敗，詳細錯誤原因:", err);
    throw new Error(error?.message || "無法載入公路資料，請檢查資料庫連線。");
  }
  // 4. 將單一公路資料傳給 Client 渲染
  return <HighwayContentClient highway={serializedHighway} />;
}
