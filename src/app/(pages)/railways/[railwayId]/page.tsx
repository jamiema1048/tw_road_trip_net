import { Metadata } from "next";
// import { Types } from "mongoose"; // 用於定義 ObjectId
import RailwayContentClient from "@/src/app/(client)/(railways)/(railway)/RailwayContentClient";
import { notFound } from "next/navigation";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { RailwaySchema } from "@/src/models/Railway";
import { StationSchema } from "@/src/models/Station";
import {
  Station,
  StationLineDistrict,
  StationLine,
  RailwayData,
} from "@/src/types/railway";

interface MongoRawDistrict {
  id?: number;
  districtID?: number;
  order?: number;
  _id?: import("mongoose").Types.ObjectId;
}

type PageParams = Promise<{ railwayId: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    // Await params (Next.js 15 必備)
    const { railwayId: rawId } = await params;
    const railwayId = Number(rawId);

    if (isNaN(railwayId)) {
      return { title: "無效的路線 ID" };
    }

    const { railwayConn } = await getConnections();
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    // 關鍵修正：透過斷言或泛型告訴 TS 這是 MongoRailway 結構
    // 使用 lean<MongoRailway>() 或是 as MongoRailway | null
    const railwayData = (await RailwayModel.findOne({
      id: railwayId,
    }).lean()) as RailwayData | null;

    if (!railwayData) {
      return { title: "找不到路線資料" };
    }

    // 3. 營運單位對照
    const coMap: Record<number, string> = {
      1: "台鐵",
      2: "林鐵",
      3: "糖鐵",
      4: "",
    };

    // 此時 railwayData 已經有型別提示，不會有 any 報錯
    const coName = coMap[railwayData.co] || "";
    const systemPrefix = railwayData.systemName || "";

    const title = systemPrefix
      ? `${systemPrefix}${coName}：${railwayData.name} | 路線沿革與車站列表`
      : `${coName}${railwayData.name} | 鐵道路線資料庫`;

    const description = `${systemPrefix}${coName}${railwayData.name}的完整資料紀錄。收錄路線沿革、歷史背景以及所屬車站清單。`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      // 建議也補上 keywords
      keywords: [railwayData.name, coName, "鐵道資料庫"].filter(Boolean),
    };
  } catch (error) {
    // 部署時建議打印更詳細的錯誤到 log
    console.error("Metadata Generation Error:", error);
    return { title: "路線資料載入錯誤" };
  }
}

export default async function RailwayContentServer({
  params,
}: {
  params: Promise<{ railwayId: string }>;
}) {
  const { railwayId: rawId } = await params;
  const railwayId = Number(rawId);
  if (!railwayId) {
    notFound();
  }

  let serializedRailway;
  let serializedStations: Station[];
  const railwayNameMap: Record<number, string> = {};
  try {
    const { railwayConn, stationConn } = await getConnections();

    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);
    const StationModel =
      stationConn.models.Station || stationConn.model("Station", StationSchema);

    // 強型別化查詢結果
    const rawRailway = (await RailwayModel.findOne({
      id: railwayId,
    }).lean()) as RailwayData | null;
    const rawStations = (await StationModel.find({
      "line.lineID": railwayId,
    }).lean()) as Station[];

    if (!rawRailway) {
      notFound();
    }

    // 💡 關鍵新增：一次性撈取所有路線 ID 與 Name 來建立對照地圖
    const allRailways = await RailwayModel.find({}, "id name").lean();
    allRailways.forEach((r) => {
      if (r.id && r.name) {
        railwayNameMap[r.id] = r.name;
      }
    });

    // --- 序列化處理 (Serialization) ---

    serializedRailway = {
      ...rawRailway,
      _id: rawRailway._id.toString(),
      district: (rawRailway.district || []).map((d) => ({
        ...d,
        _id: d._id?.toString(),
      })),
    };

    serializedStations = rawStations.map((s): Station => {
      return {
        _id: s._id.toString(),
        id: s.id,
        name: s.name,
        status: s.status,
        openDate: Array.isArray(s.openDate) ? s.openDate : [],
        closeDate: Array.isArray(s.closeDate) ? s.closeDate : [],
        originalName: Array.isArray(s.originalName) ? s.originalName : [],
        level: s.level || "",
        miles: Array.isArray(s.miles) ? s.miles : [],
        height: s.height || "",
        stationCode: s.stationCode || "",
        hasDetail: !!s.hasDetail,

        // 處理 line 陣列
        line: s.line.map((l): StationLine => {
          let normalized: StationLineDistrict[] = [];

          // 1. 處理陣列情況
          if (Array.isArray(l.lineDistrict)) {
            normalized = l.lineDistrict.map((d): StationLineDistrict => {
              if (typeof d === "number") {
                return { id: d, order: 999 };
              }
              // 將 d 斷言為我們定義的 Raw 結構，但不使用 any
              const dObj = d as MongoRawDistrict;
              return {
                id: dObj.id ?? dObj.districtID ?? 0, // 優先取 id，若無則取 districtID
                order: dObj.order ?? 999,
                _id: dObj._id?.toString(),
              };
            });
          }
          // 2. 處理單一數字情況
          else if (typeof l.lineDistrict === "number") {
            normalized = [{ id: l.lineDistrict, order: 999 }];
          }
          // 3. 處理單一物件情況
          else if (
            l.lineDistrict !== null &&
            typeof l.lineDistrict === "object"
          ) {
            const dObj = l.lineDistrict as MongoRawDistrict;
            normalized = [
              {
                id: dObj.id ?? dObj.districtID ?? 0,
                order: dObj.order ?? 999,
                _id: dObj._id?.toString(),
              },
            ];
          }

          return {
            lineID: l.lineID,
            lineDistrict: normalized,
            _id: l._id?.toString(),
          };
        }),

        prevStation: Array.isArray(s.prevStation)
          ? s.prevStation
          : s.prevStation
            ? [s.prevStation]
            : [],
        nextStation: Array.isArray(s.nextStation)
          ? s.nextStation
          : s.nextStation
            ? [s.nextStation]
            : [],

        // 處理圖片
        images: s.images.map((img) => ({
          _id: img._id?.toString(),
          url: img.url || "",
          description: img.description || "",
          capturedAt: img.capturedAt || "",
        })),
      };
    });
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

  // 3. 直接回傳，不再需要 JSON.parse
  return (
    <RailwayContentClient
      data={serializedRailway}
      stations={serializedStations}
      railwayNameMap={railwayNameMap} // 💡 將地圖傳入 Client 組件
    />
  );
}
