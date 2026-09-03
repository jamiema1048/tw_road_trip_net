import { Types } from "mongoose";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Province from "@/src/app/(components)/(highways)/Province";
import County from "@/src/app/(components)/(highways)/County";
import Loading from "@/src/app/(pages)/highways/loading";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { HighwaySchema } from "@/src/models/Highway";
import { Highway } from "@/src/types/highway";

import styles from "@/src/styles/pages/highway/HighwayList.module.css";

// 🟢 1. SEO Metadata
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
  url: string;
  description?: string;
  capturedAt?: Date;
}

export type HighwayStatus = "active" | "disused" | "unlisted";

export interface MongoHighway {
  _id: Types.ObjectId;
  id: number;
  name: string;
  status: HighwayStatus;
  highwayIcon?: string;
  routeName: string;
  length: number;
  currentLength: number;
  start: string;
  currentStart: string;
  end: string;
  currentEnd: string;
  otherName: string[];
  highest: number;
  highestPlace: string;
  remark: string;
  images: HighwayImage[];
}

export const revalidate = 86400; // 靜態快取更新時間 (24 hrs)

const COUNTY_SECTION_CONFIGS = [
  { id: "120", label: "101~120", min: 100, max: 121 },
  { id: "140", label: "121~140", min: 121, max: 141 },
  { id: "160", label: "141~160", min: 141, max: 161 },
  { id: "180", label: "161~180", min: 161, max: 181 },
  { id: "200", label: "181~200", min: 181, max: 201 },
  { id: "220", label: "201~", min: 201, max: Infinity },
];

export default async function HighwayListPage() {
  // 1. 在 try 外宣告變數，用於儲存處理完畢的資料
  let detailedHighways: (Highway & { currentImageIndex?: number })[] | null =
    null;

  try {
    const { highwayConn } = await getConnections();
    const HighwayModel =
      highwayConn.models.Highway || highwayConn.model("Highway", HighwaySchema);

    const allHighways = (await HighwayModel.find({}).lean()) as MongoHighway[];

    if (allHighways && allHighways.length > 0) {
      detailedHighways = allHighways.map((hwy) => ({
        ...hwy,
        _id: hwy._id.toString(),
        status: hwy.status || "active",
        highwayIcon: hwy.highwayIcon || `/icons/highways/${hwy.id}.svg`,
        images: (hwy.images || []).map((img) => ({
          ...img,
          _id: img._id ? img._id.toString() : "",
          capturedAt: img.capturedAt
            ? new Date(img.capturedAt).toISOString()
            : null,
        })),
        currentImageIndex: 0,
      })) as unknown as (Highway & { currentImageIndex?: number })[];
    }
  } catch (err: unknown) {
    console.error("載入公路頁面失敗，詳細錯誤原因:", err);
    const error = err as (Error & { digest?: string }) | null | undefined;
    throw new Error(error?.message || "無法載入公路資料，請檢查資料庫連線。");
  }

  // 2. 判斷無資料時，於 try/catch 外部觸發 Next.js notFound 機制
  if (!detailedHighways || detailedHighways.length === 0) {
    notFound();
  }

  // 3. 建立動態 JSON-LD 結構化資料
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

  const province420 = detailedHighways.filter(
    (hwy) => hwy.id / 100 >= 400 && hwy.id / 100 < 421,
  );

  const province440 = detailedHighways.filter(
    (hwy) => hwy.id / 100 >= 421 && hwy.id / 100 < 500,
  );

  // 在 Server 端預先分類縣市道資料
  const countySections = COUNTY_SECTION_CONFIGS.map((config) => {
    const highways = detailedHighways!.filter((hwy) => {
      const val = hwy.id / 100;
      return val >= config.min && val < config.max;
    });

    return {
      id: config.id,
      label: config.label,
      highways,
    };
  });

  // 4. 在 try/catch 外層進行渲染與 Return
  return (
    <div className={styles.highwayListPageContainer}>
      {/* 注入 Schema 結構化資料 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.highwayListContainer}>
        <div className={styles.pageTitleContainer}>
          <h1 className={styles.pageTitle}>公路列表</h1>
        </div>
        <Breadcrumbs />
        <div className={styles.divider} />

        {detailedHighways.length === 0 ? (
          <div className={styles.loadingPlaceholderWrapper}>
            <Loading />
          </div>
        ) : (
          <div className={styles.highwayContentContainer}>
            <Province section420={province420} section440={province440} />
            <County sections={countySections} />
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
