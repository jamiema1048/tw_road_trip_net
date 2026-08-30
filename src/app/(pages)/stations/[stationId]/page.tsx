import { Metadata } from "next";
import StationClient from "@/src/app/(client)/(stations)/StationClient";
import { notFound } from "next/navigation";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { cache } from "react";
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

type PageParams = Promise<{ stationId: string }>;

// ----------------------------------------------------------------------
// 1. React Cache 機制：封裝並共享同一次 Request 中的 DB 查詢
// ----------------------------------------------------------------------
const getStationData = cache(async (stationId: number) => {
  const { railwayConn, stationConn } = await getConnections();
  const RailwayModel =
    railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);
  const StationModel =
    stationConn.models.Station || stationConn.model("Station", StationSchema);

  const [rawStation, allRailways] = await Promise.all([
    StationModel.findOne({
      id: stationId,
    }).lean() as Promise<MongoStation | null>,
    RailwayModel.find({}).lean() as Promise<RailwayData[]>,
  ]);

  if (!rawStation) return null;

  // 處理鄰近車站 ID
  const toArr = (val: number | number[] | undefined) =>
    Array.isArray(val) ? val : val ? [val] : [];

  const uniqueAdjacentIDs = [
    ...new Set([
      ...toArr(rawStation.prevStation),
      ...toArr(rawStation.nextStation),
    ]),
  ].filter((id): id is number => id != null);

  const rawAdjacentStations =
    uniqueAdjacentIDs.length > 0
      ? ((await StationModel.find({
          id: { $in: uniqueAdjacentIDs },
        }).lean()) as MongoStation[])
      : [];

  return {
    rawStation,
    allRailways,
    rawAdjacentStations,
  };
});

// ----------------------------------------------------------------------
// 2. SSG / ISR 預先渲染設定
// ----------------------------------------------------------------------
// 允許未預渲染的車站頁面於首次造訪時動態生成
export const dynamicParams = true;

// 增量靜態再生 (ISR)：設定頁面快取過期時間（例如：24 小時）
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const { stationConn } = await getConnections();
    const StationModel =
      stationConn.models.Station || stationConn.model("Station", StationSchema);

    // 建議僅預渲染「有詳細考證資料」或「重點車站」，節省部署 Build 時間
    const stations = await StationModel.find({ hasDetail: true })
      .select("id")
      .lean();

    return stations.map((s: { id: number }) => ({
      stationId: s.id.toString(),
    }));
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

// ----------------------------------------------------------------------
// 3. Metadata 動態生成 (共享 getStationData 快取)
// ----------------------------------------------------------------------
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { stationId: rawId } = await params;
    const stationId = Number(rawId);
    if (!stationId || isNaN(stationId)) return { title: "無效的車站 ID" };

    const data = await getStationData(stationId);
    if (!data || !data.rawStation) return { title: "找不到車站" };

    const { rawStation, allRailways } = data;

    // 匹配所屬路線名稱
    const lineIDs = rawStation.line.map((l) => l.lineID);
    const matchedRailways = allRailways.filter((r) => lineIDs.includes(r.id));
    const allLineNames = matchedRailways.map((r) => r.name).join("、");
    const primaryLine = matchedRailways[0]?.name || "未知路線";

    const displayOpenDate = rawStation.openDate?.[0] || "資料暫缺";
    const displayCloseDate = rawStation.closeDate?.[0] || "尚在使用中";
    const displayOriginalName = rawStation.originalName?.join("、") || "";

    const isDisused = rawStation.status === "disused";

    const title = isDisused
      ? `${allLineNames}${rawStation.name} | 廢線遺構與歷史紀錄`
      : `${rawStation.name} | 車站基本資料 - ${primaryLine}`;

    const nameInfo = displayOriginalName
      ? `（舊名：${displayOriginalName}）`
      : "";
    const description = isDisused
      ? `收錄已廢止的${allLineNames}${rawStation.name}${nameInfo}。啟用於 ${displayOpenDate}、廢止於 ${displayCloseDate}。`
      : `${rawStation.name}${nameInfo}位於${allLineNames}。提供車站構造與歷史紀錄。`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        images: rawStation.images?.[0]?.url
          ? [{ url: rawStation.images[0].url }]
          : [],
      },
    };
  } catch (error) {
    console.error("Metadata error:", error);
    return { title: "載入錯誤" };
  }
}

// ----------------------------------------------------------------------
// 4. 主頁面 (共享 getStationData 快取)
// ----------------------------------------------------------------------
export default async function StationPage({ params }: { params: PageParams }) {
  let station;
  let matchedRailways;
  let adjacentStations: Station[];
  try {
    const { stationId: rawStationId } = await params;
    const stationId = Number(rawStationId);
    if (isNaN(stationId)) {
      notFound();
    }

    const data = await getStationData(stationId);
    if (!data || !data.rawStation) {
      notFound();
    }

    const { rawStation, allRailways, rawAdjacentStations } = data;

    // 輔助函式
    const toArr = (val: number | number[] | undefined) =>
      Array.isArray(val) ? val : val ? [val] : [];

    // 強型別脫水轉換
    const sanitizeStation = (s: MongoStation): Station => {
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

        line: s.line.map((l): StationLine => {
          let normalized: StationLineDistrict[] = [];

          if (Array.isArray(l.lineDistrict)) {
            normalized = l.lineDistrict.map((d): StationLineDistrict => {
              if (typeof d === "number") return { id: d, order: 999 };
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

        prevStation: toArr(s.prevStation),
        nextStation: toArr(s.nextStation),
      };
    };

    station = sanitizeStation(rawStation);
    adjacentStations = rawAdjacentStations.map(sanitizeStation);

    matchedRailways = station.line
      .map((l) => allRailways.find((r) => r.id === l.lineID))
      .filter((r): r is RailwayData => r !== undefined)
      .map((r) => ({
        ...r,
        _id: r._id.toString(),
        district: (r.district || []).map((d) => ({
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

    console.error("載入車站頁面失敗，詳細錯誤原因:", err);
    throw new Error(error?.message || "無法載入車站資料，請檢查資料庫連線。");
  }
  return (
    <StationClient
      station={station}
      railways={matchedRailways}
      adjacentStations={adjacentStations}
    />
  );
}
