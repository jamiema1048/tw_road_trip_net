// src/app/railways/LinePageServer.tsx
import { notFound } from "next/navigation";
import { getConnections } from "@/src/_lib/db/connections";
import { RailwaySchema } from "@/src/features/railways/server";
import { Metadata } from "next";
import styles from "@/src/features/railways/components/RailwayList/RailwayList.module.css";
import Breadcrumbs from "@/src/components/layout/Breadcrumbs/Breadcrumbs";
import BottomNav from "@/src/components/layout/BottomNav/BottomNav";
import { RailwayCompanyGroupShell } from "@/src/features/railways/client";
import RailwayNetworkMapPanel from "@/src/components/layout/map/RailwayNetworkMapPanel";
import {
  getRailwayNetworkMapData,
  type RailwayNetworkMapData,
} from "@/src/features/map/server";

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

interface RailwayDistrict {
  districtID: number;
  districtName: string;
}

interface MongoRailway {
  id: number;
  name: string;
  co: number;
  district: RailwayDistrict[];
}

type RailwayListItem = Pick<MongoRailway, "id" | "name" | "co">;

const COMPANY_MAP: Record<number, string> = {
  1: "台鐵",
  2: "林業鐵路",
  3: "糖業鐵路",
  4: "其他鐵路",
};

export default async function LinePageServer() {
  let allRailways: MongoRailway[] = [];
  let railwayNetworkMapData: RailwayNetworkMapData;

  try {
    const { railwayConn } = await getConnections();
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    const [railways, mapData] = await Promise.all([
      RailwayModel.find({})
        .select("id name co district.districtID district.districtName -_id")
        .sort({ id: 1 })
        .lean() as Promise<MongoRailway[]>,
      getRailwayNetworkMapData(),
    ]);

    allRailways = railways;
    railwayNetworkMapData = mapData;

    if (!allRailways || allRailways.length === 0) {
      notFound();
    }
  } catch (err: unknown) {
    const error = err as (Error & { digest?: string }) | null | undefined;
    if (
      error?.digest?.includes("NEXT_HTTP_ERROR_FALLBACK") ||
      error?.message === "NEXT_NOT_FOUND"
    ) {
      throw err;
    }

    console.error("載入鐵路頁面失敗，詳細錯誤原因:", err);
    throw new Error(error?.message || "無法載入鐵路資料，請檢查資料庫連線。");
  }

  // 排除 Mongo 子文件的 _id，保留清單與 JSON-LD 所需的資料；排序已交給資料庫。
  const safeRailways = allRailways.map(({ id, name, co, district }) => ({
    id,
    name,
    co,
    district: district.map(({ districtID, districtName }) => ({
      districtID,
      districtName,
    })),
  }));

  const railwayListItems: RailwayListItem[] = safeRailways.map(
    ({ id, name, co }) => ({ id, name, co }),
  );

  // 依據 co 分組
  const groupedByCo = railwayListItems.reduce<Record<number, RailwayListItem[]>>(
    (acc, line) => {
      if (!acc[line.co]) acc[line.co] = [];
      acc[line.co].push(line);
      return acc;
    },
    {},
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "全台鐵路路線與廢線目錄",
    description: "收錄全台台鐵、林鐵、糖鐵與廢線之路線清單",
    numberOfItems: safeRailways.length,
    itemListElement: safeRailways.map((line, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: line.name,
        description: `包含 ${line.district?.length || 0} 個營運/歷史區間`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.railwayListPageContainer}>
        <div className={styles.railwayListContainer}>
          <div className={styles.pageTitleContainer}>
            <h1 className={styles.pageTitle}>🚉 鐵路總覽</h1>
          </div>
          <Breadcrumbs />
          <div className={styles.divider} />
          <div className={styles.networkMapArea}>
            <RailwayNetworkMapPanel data={railwayNetworkMapData} />
          </div>

          {Object.entries(groupedByCo).map(([co, lineList]) => (
            <RailwayCompanyGroupShell
              key={co}
              co={co}
              companyName={COMPANY_MAP[Number(co)] || `公司 ${co}`}
              lineList={lineList}
            />
          ))}
        </div>
        <BottomNav />
      </div>
    </>
  );
}
