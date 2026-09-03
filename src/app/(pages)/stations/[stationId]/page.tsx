import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cache } from "react";

import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
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

import styles from "@/src/styles/pages/station/StationPage.module.css";

interface MongoRawDistrict {
  id?: number;
  districtID?: number;
  order?: number;
  _id?: import("mongoose").Types.ObjectId;
}

type PageParams = Promise<{ stationId: string }>;
type SearchParams = Promise<{ line?: string }>;

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

  return { rawStation, allRailways, rawAdjacentStations };
});

export const dynamicParams = true;
export const revalidate = 86400;

export async function generateStaticParams() {
  try {
    const { stationConn } = await getConnections();
    const StationModel =
      stationConn.models.Station || stationConn.model("Station", StationSchema);

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

export default async function StationPage({
  params,
  searchParams,
}: {
  params: PageParams;
  searchParams: SearchParams;
}) {
  // 1. 在 try 外宣告儲存變數
  let pageData: {
    station: Station;
    adjacentStations: Station[];
    matchedRailways: (RailwayData & { _id: string })[];
    currentLineID: string;
    currentLineName: string;
    virtualPath: string;
  } | null = null;

  try {
    const [{ stationId: rawStationId }, { line: urlLineID }] =
      await Promise.all([params, searchParams]);

    const stationId = Number(rawStationId);
    if (isNaN(stationId)) {
      // 識別號非數字直接跳過後續資料獲取
      pageData = null;
    } else {
      const data = await getStationData(stationId);

      if (data && data.rawStation) {
        const { rawStation, allRailways, rawAdjacentStations } = data;

        const toArr = (val: number | number[] | undefined) =>
          Array.isArray(val) ? val : val ? [val] : [];

        const sanitizeStation = (s: MongoStation): Station => ({
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
          images: (s.images || []).map((img) => ({
            _id: img._id?.toString() || "",
            url: img.url || "",
            description: img.description || "",
            capturedAt:
              img.capturedAt instanceof Date
                ? img.capturedAt
                : typeof img.capturedAt === "string" && img.capturedAt !== ""
                  ? new Date(img.capturedAt)
                  : new Date(),
          })),
          prevStation: toArr(s.prevStation),
          nextStation: toArr(s.nextStation),
        });

        const station = sanitizeStation(rawStation);
        const adjacentStations = rawAdjacentStations.map(sanitizeStation);

        const matchedRailways = station.line
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

        const lineMap = matchedRailways.reduce<Record<string, string>>(
          (acc, r) => {
            acc[String(r.id)] = r.name;
            return acc;
          },
          {},
        );

        const stationLineIds = new Set<string>(
          (station.line || []).map((l) => String(l.lineID)),
        );

        const defaultLineID =
          station.line?.[0]?.lineID !== undefined
            ? String(station.line[0].lineID)
            : "";

        const currentLineID =
          urlLineID && stationLineIds.has(urlLineID)
            ? urlLineID
            : defaultLineID;
        const currentLineName = lineMap[currentLineID] || "";
        const virtualPath = `/railways/${currentLineID}/${station.id}`;

        pageData = {
          station,
          adjacentStations,
          matchedRailways,
          currentLineID,
          currentLineName,
          virtualPath,
        };
      }
    }
  } catch (err: unknown) {
    console.error("載入車站頁面失敗，詳細錯誤原因:", err);
    const error = err as (Error & { digest?: string }) | null | undefined;
    throw new Error(error?.message || "無法載入車站資料，請檢查資料庫連線。");
  }

  // 2. 如果沒有資料，在 try/catch 外觸發 Next.js 404 機制
  if (!pageData) {
    notFound();
  }

  // 3. 解構資料
  const {
    station,
    adjacentStations,
    matchedRailways,
    currentLineID,
    currentLineName,
    virtualPath,
  } = pageData;

  const getTargetLineParam = (targetStation: Station) => {
    if (!targetStation || !targetStation.line) return "";

    const isSameLine = targetStation.line.some(
      (l) => String(l.lineID) === String(currentLineID),
    );
    if (isSameLine) return currentLineID;

    const currentStationLineIds = new Set(
      (station.line || []).map((l) => String(l.lineID)),
    );
    const sharedLine = targetStation.line.find((l) =>
      currentStationLineIds.has(String(l.lineID)),
    );
    if (sharedLine) return String(sharedLine.lineID);

    return targetStation.line[0]?.lineID !== undefined
      ? String(targetStation.line[0].lineID)
      : "";
  };

  // 4. 在 try/catch 外渲染並 Return JSX
  return (
    <div className={styles.stationPageContainer}>
      <div className={styles.stationContainerArea}>
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.pageTitle}>{station.name}</h1>
        </div>
        <Breadcrumbs
          currentPath={virtualPath}
          customNames={{
            [currentLineID]: currentLineName,
            [station.id]: station.name,
          }}
        />
        <div className={styles.divider} />
        <p className="text-black dark:text-white">
          狀態：
          {station.status === "active"
            ? "營運中"
            : station.status === "disused"
              ? "已廢止"
              : "規劃中"}
        </p>

        <section className={styles.routeInfoSection}>
          <h2 className={styles.stationDataTitle}>車站資料</h2>
          {station.openDate.length > 0 && (
            <h3 className={styles.stationDataDetail}>
              <strong>設站日期:</strong> {station.openDate.join("、")}
            </h3>
          )}
          {station.closeDate.length > 0 && (
            <h3 className={styles.stationDataDetail}>
              <strong>廢止日期:</strong> {station.closeDate.join("、")}
            </h3>
          )}
          {station.originalName.length > 0 && (
            <h3 className={styles.stationDataDetail}>
              <strong>舊名:</strong> {station.originalName.join("、")}
            </h3>
          )}
          {station.level && (
            <h3 className={styles.stationDataDetail}>
              <strong>站等:</strong> {station.level}
            </h3>
          )}
          {station.miles.length > 0 && (
            <h3 className={styles.stationDataDetail}>
              <strong>里程:</strong> {station.miles.join("、")}
            </h3>
          )}
          {station.height && (
            <h3 className={styles.stationDataDetail}>
              <strong>海拔高度:</strong> {station.height}
            </h3>
          )}
          {station.stationCode && (
            <h3 className={styles.stationDataDetail}>
              <strong>代碼:</strong> {station.stationCode}
            </h3>
          )}
        </section>

        <section className={styles.stationMediaGallerySection}>
          <h2 className={styles.stationPhotoTitle}>Images and Descriptions</h2>
          {station.images && station.images.length > 0 && (
            <div className={styles.frameContainer}>
              {station.images.map((img) => (
                <div key={img._id} className={styles.photoFrame}>
                  <div className={styles.photoBlock}>
                    <Image
                      src={img.url}
                      alt={img.description}
                      width={800}
                      height={600}
                      className={styles.stationPhoto}
                      priority
                    />
                  </div>
                  <div className={styles.photoDescriptionContainer}>
                    {img.description && (
                      <p className={styles.photoDescriptionText}>
                        {img.description}
                      </p>
                    )}
                    {img.capturedAt && (
                      <p className={styles.photoDescriptionText}>
                        {new Date(img.capturedAt).toISOString().split("T")[0]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.adjacentStationsSection}>
          {station.prevStation && (
            <div className={styles.prevStationsArea}>
              <h3 className={styles.prevStationsTitle}>上一站：</h3>
              {station.prevStation.map((id) => {
                const match = adjacentStations.find(
                  (s) => String(s.id) === String(id),
                );
                const targetLine = match ? getTargetLineParam(match) : "";

                return match ? (
                  match.hasDetail ? (
                    <Link
                      key={id}
                      href={`/stations/${id}?line=${targetLine}`}
                      className={styles.adjacentStationsLink}
                    >
                      {match.name}
                    </Link>
                  ) : (
                    <div
                      key={id}
                      className={styles.adjacentStationsDisableLinkText}
                    >
                      {match.name}
                    </div>
                  )
                ) : (
                  <span key={id}>ID: {id}</span>
                );
              })}
            </div>
          )}

          {station.nextStation && (
            <div className={styles.nextStationsArea}>
              <h3 className={styles.nextStationsTitle}>下一站：</h3>
              {station.nextStation.map((id) => {
                const match = adjacentStations.find(
                  (s) => String(s.id) === String(id),
                );
                const targetLine = match ? getTargetLineParam(match) : "";

                return match ? (
                  match.hasDetail ? (
                    <Link
                      key={id}
                      href={`/stations/${id}?line=${targetLine}`}
                      className={styles.adjacentStationsLink}
                    >
                      {match.name}
                    </Link>
                  ) : (
                    <div
                      key={id}
                      className={styles.adjacentStationsDisableLinkText}
                    >
                      {match.name}
                    </div>
                  )
                ) : (
                  <span key={id}>ID: {id}</span>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <BottomNav station={station} railways={matchedRailways} />
    </div>
  );
}
