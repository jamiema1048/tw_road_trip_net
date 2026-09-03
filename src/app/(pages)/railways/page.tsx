// src/app/railways/LinePageServer.tsx
import { notFound } from "next/navigation";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { RailwaySchema } from "@/src/models/Railway";
import { Types } from "mongoose";
import { Metadata } from "next";
import styles from "@/src/styles/pages/railway/RailwayList.module.css";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { RailwayCompanyGroup } from "@/src/app/(components)/(railways)/RailwayCompanyGroup";

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

const COMPANY_MAP: Record<number, string> = {
  1: "台鐵",
  2: "林業鐵路",
  3: "糖業鐵路",
  4: "其他鐵路",
};

export default async function LinePageServer() {
  let allRailways: MongoRailway[] = [];

  try {
    const { railwayConn } = await getConnections();
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    allRailways = (await RailwayModel.find({}).lean()) as MongoRailway[];

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

  // 純 JS 物件化並排序
  const safeRailways = JSON.parse(
    JSON.stringify(allRailways),
  ) as MongoRailway[];

  safeRailways.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));

  // 依據 co 分組
  const groupedByCo = safeRailways.reduce<Record<number, MongoRailway[]>>(
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

          {Object.entries(groupedByCo).map(([co, lineList]) => (
            <RailwayCompanyGroup
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
