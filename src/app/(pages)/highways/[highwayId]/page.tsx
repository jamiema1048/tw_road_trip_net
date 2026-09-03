import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Types } from "mongoose";

import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { HighwaySchema } from "@/src/models/Highway";
import { Highway } from "@/src/types/highway";

import styles from "@/src/styles/pages/highway/HighwayContent.module.css";

export interface HighwayImageDoc {
  _id?: Types.ObjectId | string;
  url?: string;
  description?: string;
  capturedAt?: string | Date | null;
  [key: string]: unknown;
}

export interface HighwayDoc {
  _id?: Types.ObjectId | string;
  id?: number;
  name?: string;
  status?: "active" | "disused" | "unlisted";
  highwayIcon?: string;
  routeName?: string;
  length?: number;
  currentLength?: number;
  start?: string;
  currentStart?: string;
  end?: string;
  currentEnd?: string;
  otherName?: string[];
  highest?: number;
  highestPlace?: string;
  remark?: string;
  images?: HighwayImageDoc[];
  [key: string]: unknown;
}

type PageParams = Promise<{ highwayId: string }>;

// 1. React Cache 機制：同一次 Request 內共享 DB 查詢
const getHighwayData = cache(async (highwayId: number) => {
  const { highwayConn } = await getConnections();

  const HighwayModel =
    highwayConn.models.Highway ||
    highwayConn.model<HighwayDoc>("Highway", HighwaySchema, "highways");

  return await HighwayModel.findOne({
    id: highwayId,
  }).lean<HighwayDoc | null>();
});

// 2. SSG / ISR 設定
export const dynamicParams = true;
export const revalidate = 86400; // 快取過期時間 24 小時

export async function generateStaticParams() {
  try {
    const { highwayConn } = await getConnections();
    const HighwayModel =
      highwayConn.models.Highway ||
      highwayConn.model<HighwayDoc>("Highway", HighwaySchema, "highways");

    const highways = await HighwayModel.find({}).select("id").lean();

    return highways
      .map((h) => ({
        highwayId: h.id?.toString() || "",
      }))
      .filter((p) => p.highwayId !== "");
  } catch (error) {
    console.error("generateStaticParams error:", error);
    return [];
  }
}

// 3. Dynamic Metadata 生成
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  try {
    const { highwayId } = await params;
    const numericHighwayId = Number(highwayId);

    if (isNaN(numericHighwayId)) return { title: "無效的公路 ID" };

    const highwayData = await getHighwayData(numericHighwayId);
    if (!highwayData) return { title: "找不到公路資料" };

    const otherNames =
      Array.isArray(highwayData.otherName) && highwayData.otherName.length > 0
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
    ].filter((item): item is string => Boolean(item));

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: "article",
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

export default async function HighwayPage({ params }: { params: PageParams }) {
  const resolvedParams = await params;
  const numericHighwayId = Number(resolvedParams.highwayId);

  // 阻擋非數字 ID
  if (isNaN(numericHighwayId)) {
    notFound();
  }

  // 1. 在 try 外宣告變數以利 try/catch 後調用
  let serializedHighway: Highway | null = null;

  try {
    const highwayData = await getHighwayData(numericHighwayId);

    if (highwayData) {
      serializedHighway = {
        _id: highwayData._id?.toString() || "",
        id: highwayData.id ?? numericHighwayId,
        name: highwayData.name || "",
        status: highwayData.status || "active",
        highwayIcon: highwayData.highwayIcon || "/icons/highways/default.svg",
        routeName: highwayData.routeName || "",
        length: highwayData.length ?? 0,
        currentLength: highwayData.currentLength ?? 0,
        start: highwayData.start || "",
        currentStart: highwayData.currentStart || "",
        end: highwayData.end || "",
        currentEnd: highwayData.currentEnd || "",
        otherName: Array.isArray(highwayData.otherName)
          ? highwayData.otherName
          : [],
        highest: highwayData.highest ?? 0,
        highestPlace: highwayData.highestPlace || "",
        remark: highwayData.remark || "",
        images: (highwayData.images || []).map((img) => ({
          _id: img._id?.toString() || "",
          url: img.url || "",
          description: img.description || "",
          capturedAt: img.capturedAt
            ? new Date(img.capturedAt).toISOString()
            : null,
        })),
      } as unknown as Highway;
    }
  } catch (err: unknown) {
    console.error("載入公路頁面失敗，詳細錯誤原因:", err);
    const error = err as (Error & { digest?: string }) | null | undefined;
    throw new Error(error?.message || "無法載入公路資料，請檢查資料庫連線。");
  }

  // 2. 查無資料時於 try/catch 外部觸發 404
  if (!serializedHighway) {
    notFound();
  }

  const highway = serializedHighway;

  // 3. 在 try/catch 外部進行渲染與 return JSX
  return (
    <div className={styles.highwayPageContainer}>
      <div className={styles.highwayContainerArea}>
        <div className={styles.pageTitleContainer}>
          <Image
            src={
              highway.highwayIcon ||
              `/highway_mark/${highway.id}/${highway.id}.svg`
            }
            alt={`${highway.name} 圖示`}
            width={48}
            height={48}
            priority
            className={styles.highwayIcon}
          />
          <h1 className={styles.pageTitle}>{highway.name}</h1>
        </div>
        <Breadcrumbs
          customNames={{
            [highway.id]: highway.name,
          }}
        />
        <div className={styles.divider} />
        <p className="text-black dark:text-white">
          狀態：
          {highway.status === "active"
            ? "營運中"
            : highway.status === "disused"
              ? "已廢止"
              : "規劃中"}
        </p>

        <section className={styles.routeInfoSection}>
          <h2 className={styles.highwayDataTitle}>路線資料</h2>
          {highway.routeName && (
            <h3 className={styles.highwayDataDetail}>
              <strong>路線名稱:</strong> {highway.routeName}
            </h3>
          )}
          <h3 className={styles.highwayDataDetail}>
            <strong>起點:</strong> {highway.start}
          </h3>
          {highway.currentStart && (
            <h3 className={styles.highwayDataDetail}>
              <strong>通車起點:</strong> {highway.currentStart}
            </h3>
          )}
          <h3 className={styles.highwayDataDetail}>
            <strong>終點:</strong> {highway.end}
          </h3>
          {highway.currentEnd && (
            <h3 className={styles.highwayDataDetail}>
              <strong>通車終點:</strong> {highway.currentEnd}
            </h3>
          )}
          <h3 className={styles.highwayDataDetail}>
            <strong>長度:</strong> {highway.length} km
          </h3>
          {highway.currentLength && (
            <h3 className={styles.highwayDataDetail}>
              <strong>通車長度:</strong> {highway.currentLength} km
            </h3>
          )}
          {highway.highest && (
            <h3 className={styles.highwayDataDetail}>
              <strong>最高海拔:</strong> {highway.highest} m
            </h3>
          )}
          {highway.highestPlace && (
            <h3 className={styles.highwayDataDetail}>
              <strong>最高點:</strong> {highway.highestPlace}
            </h3>
          )}
          {highway.otherName && highway.otherName.length > 0 && (
            <h3 className={styles.highwayDataDetail}>
              <strong>別稱:</strong> {highway.otherName.join("、")}
            </h3>
          )}
          {highway.remark && (
            <h3 className={styles.highwayDataDetail}>
              <strong>備註:</strong> {highway.remark}
            </h3>
          )}
        </section>

        <section className={styles.highwayMediaGallerySection}>
          <h2 className={styles.highwayPhotoTitle}>Images and Descriptions</h2>
          {highway.images && highway.images.length > 0 && (
            <div className={styles.frameContainer}>
              {highway.images.map((img, idx) => (
                <div key={img._id || idx} className={styles.photoFrame}>
                  <div className={styles.photoBlock}>
                    <Image
                      src={img.url}
                      alt={`${highway.name} - ${idx}`}
                      width={800}
                      height={600}
                      className={styles.highwayPhoto}
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
      </div>
      <BottomNav />
    </div>
  );
}
