import { Metadata } from "next";
// import { Types } from "mongoose"; // 用於定義 ObjectId
import RailwayContentClient from "@/src/app/(client)/(railways)/(railway)/RailwayContentClient";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { RailwaySchema } from "@/src/models/Railway";
import { StationSchema } from "@/src/models/Station";
import {
  Station,
  StationLineDistrict,
  StationLine,
  RailwayData,
  MongoStation,
} from "@/src/types/railway";

interface MongoRawDistrict {
  id?: number;
  districtID?: number;
  order?: number;
  _id?: import("mongoose").Types.ObjectId;
}

type PageParams = Promise<{ railwayId: string }>;

// ----------------------------------------------------------------------
// 1. React Cache 機制：封裝並共享同一次 Request 中的 DB 查詢
// ----------------------------------------------------------------------
const getRailwayData = cache(async (railwayId: number) => {
  const { railwayConn, stationConn } = await getConnections();

  const RailwayModel =
    railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);
  const StationModel =
    stationConn.models.Station || stationConn.model("Station", StationSchema);

  // 平行查詢路線資料、該路線所有車站、以及全線 ID-Name 對照表
  const [rawRailway, rawStations, allRailways] = await Promise.all([
    RailwayModel.findOne({
      id: railwayId,
    }).lean() as Promise<RailwayData | null>,
    StationModel.find({ "line.lineID": railwayId }).lean() as Promise<
      MongoStation[]
    >,
    RailwayModel.find({}, "id name").lean() as Promise<
      { id: number; name: string }[]
    >,
  ]);

  if (!rawRailway) return null;

  // 建立路線 ID 對照地圖
  const railwayNameMap: Record<number, string> = {};
  allRailways.forEach((r) => {
    if (r.id && r.name) {
      railwayNameMap[r.id] = r.name;
    }
  });

  return {
    rawRailway,
    rawStations,
    railwayNameMap,
  };
});

// ----------------------------------------------------------------------
// 2. SSG / ISR 預先渲染設定
// ----------------------------------------------------------------------
// 允許未預渲染的路線頁面於首次造訪時動態生成
export const dynamicParams = true;

// 增量靜態再生 (ISR)：設定頁面快取過期時間（例如：24 小時）
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const { railwayConn } = await getConnections();
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    // 撈取所有路線 ID 預先渲染頁面
    const railways = await RailwayModel.find({}).select("id").lean();

    return railways.map((r: { id: number }) => ({
      railwayId: r.id.toString(),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// 3. Metadata 動態生成 (共享 getRailwayData 快取)
// ----------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { railwayId: rawId } = await params;
    const railwayId = Number(rawId);

    if (isNaN(railwayId)) {
      return { title: "無效的路線 ID" };
    }

    const data = await getRailwayData(railwayId);
    if (!data || !data.rawRailway) {
      return { title: "找不到路線資料" };
    }

    const { rawRailway } = data;

    // 營運單位對照
    const coMap: Record<number, string> = {
      1: "台鐵",
      2: "林鐵",
      3: "糖鐵",
      4: "",
    };

    const coName = coMap[rawRailway.co] || "";
    const systemPrefix = rawRailway.systemName || "";

    const title = systemPrefix
      ? `${systemPrefix}${coName}：${rawRailway.name} | 路線沿革與車站列表`
      : `${coName}${rawRailway.name} | 鐵道路線資料庫`;

    const description = `${systemPrefix}${coName}${rawRailway.name}的完整資料紀錄。收錄路線沿革、歷史背景以及所屬車站清單。`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
      },
      keywords: [rawRailway.name, coName, systemPrefix, "鐵道資料庫"].filter(
        Boolean,
      ),
    };
  } catch (error) {
    console.error("Metadata Generation Error:", error);
    return { title: "路線資料載入錯誤" };
  }
}

// ----------------------------------------------------------------------
// 4. 主頁面 (共享 getRailwayData 快取)
// ----------------------------------------------------------------------
export default async function RailwayContentServer({
  params,
}: {
  params: PageParams;
}) {
  const { railwayId: rawId } = await params;
  const railwayId = Number(rawId);
  if (!railwayId || isNaN(railwayId)) {
    notFound();
  }

  let serializedRailway: RailwayData & { _id: string };
  let serializedStations: Station[];
  let railwayNameMap: Record<number, string>;

  try {
    const data = await getRailwayData(railwayId);
    if (!data || !data.rawRailway) {
      notFound();
    }

    const { rawRailway, rawStations, railwayNameMap: nameMap } = data;
    railwayNameMap = nameMap;

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

          if (Array.isArray(l.lineDistrict)) {
            normalized = l.lineDistrict.map((d): StationLineDistrict => {
              if (typeof d === "number") {
                return { id: d, order: 999 };
              }
              const dObj = d as MongoRawDistrict;
              return {
                id: dObj.id ?? dObj.districtID ?? 0,
                order: dObj.order ?? 999,
                _id: dObj._id?.toString(),
              };
            });
          } else if (typeof l.lineDistrict === "number") {
            normalized = [{ id: l.lineDistrict, order: 999 }];
          } else if (
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
        images: (s.images || []).map((img) => {
          let finalDate: Date;
          if (img.capturedAt instanceof Date) {
            finalDate = img.capturedAt;
          } else if (
            typeof img.capturedAt === "string" &&
            img.capturedAt !== ""
          ) {
            finalDate = new Date(img.capturedAt);
          } else {
            finalDate = new Date();
          }

          return {
            _id: img._id?.toString() || "",
            url: img.url || "",
            description: img.description || "",
            capturedAt: finalDate,
          };
        }),
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

    console.error("載入鐵路頁面失敗，詳細錯誤原因:", err);
    throw new Error(
      error?.message || "無法載入鐵路路線資料，請檢查資料庫連線。",
    );
  }

  // 安全地位於 try...catch 外層，此時變數保證已成功賦值
  return (
    <RailwayContentClient
      data={serializedRailway}
      stations={serializedStations}
      railwayNameMap={railwayNameMap}
    />
  );
}
