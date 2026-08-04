// src/app/highways/HighwayContentServer.tsx
export const dynamic = "force-dynamic";
import mongoose from "mongoose";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import HighwayContentClient from "@/src/app/(client)/(highways)/HighwayContentClient";
import { Metadata } from "next";
import { HighwaySchema } from "@/src/models/Highway";

type PageParams = Promise<{ highwayId: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { highwayId } = await params;
    const numericHighwayId = Number(highwayId); // 🟢 修正 3：明確轉為數字

    // 🟢 修正 2：正確取得連線物件 (假設你 lib 是回傳 highwayConn)
    const { highwayConn } = await getConnections();

    const HighwayModel =
      highwayConn.models.Highway ||
      highwayConn.model("Highway", HighwaySchema, "highways");

    // 抓取公路資料
    const highwayData = await HighwayModel.findOne({
      id: numericHighwayId,
    }).lean();
    if (!highwayData) return { title: "找不到公路資料" };

    // 處理陣列與顯示文字
    const otherNames =
      highwayData.otherName?.length > 0
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
    ].filter(Boolean);

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
        // 🟢 修正 1：加上安全導航，防止 images 不存在
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
  try {
    const resolvedParams = await params;
    const highwayIdStr = resolvedParams.highwayId;

    // 🟢 修正 3：明確轉為數字，並阻擋無效 ID
    const numericHighwayId = Number(highwayIdStr);
    if (isNaN(numericHighwayId)) {
      return (
        <div className="p-10 text-center">無效的公路編號：{highwayIdStr}</div>
      );
    }

    // 🟢 修正 2：正確取得連線物件
    const { highwayConn } = await getConnections();

    const HighwayModel =
      highwayConn.models.Highway ||
      highwayConn.model("Highway", HighwaySchema, "highways");

    // 1. 抓取公路資料
    const highwayData = await HighwayModel.findOne({
      id: numericHighwayId,
    }).lean();

    if (!highwayData) {
      return (
        <div className="p-10 text-center">找不到公路編號：{highwayIdStr}</div>
      );
    }

    // 3. 序列化處理 (Serialization)
    const serializedHighway = {
      ...highwayData,
      _id: highwayData._id.toString(),
      // 🟢 修正 1：給予預設空陣列 (highwayData.images || [])，防止 .map() 崩潰
      images: (highwayData.images || []).map((img: any) => ({
        ...img,
        _id: img._id?.toString(),
        capturedAt: img.capturedAt
          ? new Date(img.capturedAt).toISOString()
          : null,
      })),
    };

    // 4. 將單一公路資料傳給 Client 渲染
    return <HighwayContentClient highway={serializedHighway} />;
  } catch (err) {
    // 💡 建議：印出完整的錯誤訊息，幫你下次更好抓蟲
    console.error("載入公路頁面失敗，詳細錯誤:", err);
    return (
      <div className="text-red-500 p-10">
        無法載入公路資料，請檢查資料庫連線。
      </div>
    );
  }
}
