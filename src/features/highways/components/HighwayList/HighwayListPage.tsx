import { notFound } from "next/navigation";
import { Metadata } from "next";

import Breadcrumbs from "@/src/components/layout/Breadcrumbs/Breadcrumbs";
import BottomNav from "@/src/components/layout/BottomNav/BottomNav";
import { CountyShell as County, ProvinceShell as Province } from "@/src/features/highways/client";
import Loading from "@/src/components/feedback/LoadingIndicator/LoadingIndicator";
import { getConnections } from "@/src/_lib/db/connections";
import { HighwaySchema, type Highway, type HighwayListItem } from "@/src/features/highways/server";

import styles from "@/src/features/highways/components/HighwayList/HighwayList.module.css";

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

export type HighwayStatus = "active" | "disused" | "unlisted";

type HighwayListDocument = Omit<
  Pick<
    Highway,
    | "id"
    | "name"
    | "routeName"
    | "length"
    | "currentLength"
    | "start"
    | "currentStart"
    | "end"
    | "currentEnd"
  >,
  "status" | "highwayIcon"
> & {
  status?: HighwayStatus;
  highwayIcon?: string;
};

type HighwayPageData = Omit<
  HighwayListDocument,
  "status" | "highwayIcon"
> & {
  status: HighwayStatus;
  highwayIcon: string;
};

export const revalidate = 86400; // 靜態快取更新時間 (24 hrs)

const COUNTY_SECTION_CONFIGS = [
  { id: "110", label: "101-110", min: 101, max: 111 },
  { id: "120", label: "111-120", min: 111, max: 121 },
  { id: "130", label: "121-130", min: 121, max: 131 },
  { id: "140", label: "131-140", min: 131, max: 141 },
  { id: "150", label: "141-150", min: 141, max: 151 },
  { id: "160", label: "151-160", min: 151, max: 161 },
  { id: "170", label: "161-170", min: 161, max: 171 },
  { id: "180", label: "171-180", min: 171, max: 181 },
  { id: "190", label: "181-190", min: 181, max: 191 },
  { id: "200", label: "191-200", min: 191, max: 201 },
  { id: "220", label: "201-", min: 201, max: 221 },
];

const PROVINCE_SECTION_CONFIGS = [
  { id: "410", label: "1-10", min: 401, max: 411 },
  { id: "420", label: "11-20", min: 411, max: 421 },
  { id: "430", label: "21-30", min: 421, max: 431 },
  { id: "439", label: "31-39", min: 431, max: 440 },
  { id: "478", label: "61-78", min: 461, max: 479 },
  { id: "499", label: "82-", min: 482, max: 500 },
];

const toHighwayListItem = ({
  id,
  name,
  status,
  highwayIcon,
}: HighwayListItem): HighwayListItem => ({ id, name, status, highwayIcon });

export default async function HighwayListPage() {
  // 1. 在 try 外宣告變數，用於儲存處理完畢的資料
  let detailedHighways: HighwayPageData[] | null = null;

  try {
    const { highwayConn } = await getConnections();
    const HighwayModel =
      highwayConn.models.Highway || highwayConn.model("Highway", HighwaySchema);

    const allHighways = (await HighwayModel.find({})
      .select(
        "id name status highwayIcon routeName length currentLength start currentStart end currentEnd -_id",
      )
      .lean()) as HighwayListDocument[];

    if (allHighways && allHighways.length > 0) {
      detailedHighways = allHighways.map((hwy) => ({
        ...hwy,
        status: hwy.status || "active",
        highwayIcon: hwy.highwayIcon || "/icons/highways/" + hwy.id + ".svg",
      }));
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

  const provinceSections = PROVINCE_SECTION_CONFIGS.map((config) => {
    const highways = detailedHighways!
      .filter((hwy) => {
        const value = hwy.id / 100;
        return value >= config.min && value < config.max;
      })
      .map(toHighwayListItem);

    return { id: config.id, label: config.label, highways };
  });

  // 在 Server 端預先分類縣市道資料
  const countySections = COUNTY_SECTION_CONFIGS.map((config) => {
    const highways = detailedHighways!
      .filter((hwy) => {
        const val = hwy.id / 100;
        return val >= config.min && val < config.max;
      })
      .map(toHighwayListItem);

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
            <Province sections={provinceSections} />
            <County sections={countySections} />
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
