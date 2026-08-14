import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { HighwaySchema } from "@/src/models/Highway";
import { Types } from "mongoose";
import { notFound } from "next/navigation";
import HighwayListClient from "@/src/app/(client)/(highways)/HighwayListClient";

interface HighwayImage {
  _id?: Types.ObjectId;
  url: string; // 圖片位址
  description?: string; // 加 ? 代表選填
  capturedAt?: Date; // 選填：拍攝日期
}

export interface MongoHighway {
  _id: Types.ObjectId;
  id: number; // 台1線編號，如 40100
  name: string; // 台1線
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
    const detailedHighways = allHighways.map((hwy) => ({
      ...hwy,
      _id: hwy._id.toString(), // 把 ObjectId 轉成字串
      // 確保 images 裡的日期也能被 Client Component 讀取
      images: hwy.images.map((img: any) => ({
        ...img,
        _id: img._id?.toString(),
        capturedAt: img.capturedAt
          ? new Date(img.capturedAt).toISOString()
          : null,
      })),
      currentImageIndex: 0, // 為了你的 Client 端切換功能保留
    }));

    // 4. 直接把完整的資料丟給 Client Component
    return <HighwayListClient highways={detailedHighways} />;
  } catch (err: any) {
    if (
      err?.digest?.includes("NEXT_HTTP_ERROR_FALLBACK") ||
      err?.message === "NEXT_NOT_FOUND"
    ) {
      throw err;
    }

    console.error("載入公路頁面失敗，詳細錯誤原因:", err);

    // 🟢 4. 將「真正的錯誤訊息」傳遞給 error.tsx，方便除錯
    throw new Error(err?.message || "無法載入公路資料，請檢查資料庫連線。");
  }
}
