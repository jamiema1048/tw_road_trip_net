"use client";

import { useContext, useEffect, useMemo } from "react";
import { useSearchParams, notFound } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Station, RailwayData } from "@/src/types/railway";

// interface District {
//   districtID: number;
//   districtName: string;
//   prevArea?: number;
//   nextArea?: number;
// }

// interface Line {
//   id: number;
//   name: string;
//   co: number;
//   district: District[];
// }

// interface StationLineInfo {
//   lineID: number;
//   lineDistrict: StationLineDistrict;
// }

// // 2. 定義圖片的詳細結構
// interface StationImage {
//   _id?: string; // MongoDB 自動產生的 ID
//   url: string;
//   description?: string;
//   capturedAt?: string | Date; // Server 端是 Date，傳到 Client 會變 ISO 字串
// }

// 3. 主介面 Station
// interface Station {
//   _id?: string; // MongoDB 的唯一識別碼 (脫水後為字串)
//   id: number;
//   name: string;
//   status: "active" | "disused" | "plan"; // 配合 Schema 的 enum

//   // 以下皆改為陣列格式，移除問號（因為有 default: []）
//   openDate: string[];
//   closeDate: string[];
//   originalName: string[];
//   miles: string[];

//   level?: string;
//   height?: string;
//   stationCode?: string;

//   line: StationLineInfo[];

//   // 前後站統一為數字陣列
//   prevStation: number[];
//   nextStation: number[];

//   hasDetail: boolean;

//   // 圖片結構更新
//   images: StationImage[];

//   // timestamps 自動生成的欄位
//   createdAt?: string;
//   updatedAt?: string;
// }

const StationPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--background);
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    display: none;
    width: 0;
  }
`;
const StationContainerArea = styled.div`
  background-color: var(--background);
  align-items: center;
  width: 100%;
  padding: 1.75rem 3rem 1.75rem 3rem;
  @media (max-width: 768px) {
    padding: 1.25rem 2.5rem 1.25rem 2.5rem;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.25rem auto;
`;
const PageTitle = styled.div`
  color: var(--text-white-aaaa);
  font-family: "Inter-Regular", Helvetica;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Divider = styled.div`
  background-color: var(--text-white-aaaa);
  height: 1px;
  margin: 1.25rem auto;
  width: 100%;
  @media (max-width: 768px) {
    margin: 0.75rem auto;
  }
`;

const RouteInfoSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StationDataTitle = styled.h2`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const StationDataDetail = styled.h3`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const StationMediaGallerySection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
`;

const StationPhotoTitle = styled.h2`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
`;

const FrameContainer = styled.div`
  display: grid;
  width: 100%;
  gap: 3rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  position: relative;
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

const PhotoFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
`;

const PhotoBlock = styled.div`
  border-radius: 2rem;
  overflow: hidden;
  box-shadow:
    4px 4px 4px 0 rgba(0, 0, 0, 0.25) inset,
    8px 8px 4px 0 rgba(255, 255, 255, 0.25);
`;

const StationPhoto = styled(Image)`
  width: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
`;

const PhotoDescriptionContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  @media (max-width: 576px) {
    gap: 0.5rem;
  }
`;

const PhotoDescriptionText = styled.p`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 576px) {
    font-size: 1rem;
  }
`;

const AdjacentStationsSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.75rem;
  margin-top: 1rem;
  @media (max-width: 576px) {
    gap: 1rem;
  }
`;

const PrevStationsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  @media (max-width: 576px) {
    gap: 1rem;
  }
`;

const PrevStationsTitle = styled.h3`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

const NextStationsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  @media (max-width: 576px) {
    gap: 1rem;
  }
`;

const NextStationsTitle = styled.h3`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

const AdjacentStationsLink = styled(Link)`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    text-decoration: underline;
    color: var(--text-success); /* hover:text-green-400 */
  }
  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

const AdjacentStationsDisableLinkText = styled.div`
  color: var(--text-gray-aa);
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.6;
  @media (max-width: 576px) {
    font-size: 1.25rem;
  }
`;

export default function StationClient({
  station,
  railways,
  adjacentStations,
}: {
  station: Station;
  railways: RailwayData[];
  adjacentStations: Station[];
}) {
  const { title, setTitle } = useContext(TitleContext);
  const searchParams = useSearchParams();

  const lineMap = useMemo(() => {
    return railways.reduce<Record<string, string>>((acc, railway) => {
      acc[String(railway.id)] = railway.name;
      return acc;
    }, {});
  }, [railways]);

  if (!station) {
    notFound(); // 這會自動渲染該層級或根目錄下的 not-found.tsx
  }

  // 2. 收集「彰化站自身擁有的所有 lineID 集合」
  const stationLineIds = useMemo(() => {
    return new Set<string>((station.line || []).map((l) => String(l.lineID)));
  }, [station.line]);

  // 2. 預設路線 ID（預設取車站所屬的第一條路線）
  const defaultLineID =
    station.line?.[0]?.lineID !== undefined
      ? String(station.line[0].lineID)
      : "";

  // 3. 計算「當前使用的 lineID」與「當前路線中文名稱」
  const urlLineID = searchParams.get("line");
  // 檢查 URL 帶入的 lineID 是否確實屬於該車站；若不是（或沒帶），則退回 defaultLineID
  const currentLineID =
    urlLineID && stationLineIds.has(urlLineID) ? urlLineID : defaultLineID;

  const currentLineName = lineMap[currentLineID] || "";

  // 4. 組裝虛擬 Breadcrumb 路徑 (/railways/[lineID]/[stationId])
  const virtualPath = `/railways/${currentLineID}/${station.id}`;

  // 5. 核心邏輯：點擊鄰近車站（adjacentStations）時計算應該帶什麼 ?line= 參數
  const getTargetLineParam = (targetStation: Station) => {
    if (!targetStation || !targetStation.line) return "";

    // 檢查「目標車站」隸屬的路線 ID 中，是否包含「我們目前的 currentLineID」
    const isSameLine = targetStation.line.some(
      (l) => String(l.lineID) === String(currentLineID),
    );

    if (isSameLine) {
      // 若目標車站也在當前路線上，繼續沿用 currentLineID
      return currentLineID;
    }

    const currentStationLineIds = new Set(
      (station.line || []).map((l) => String(l.lineID)),
    );

    const sharedLine = targetStation.line.find((l) =>
      currentStationLineIds.has(String(l.lineID)),
    );

    if (sharedLine) {
      // 🔴 關鍵點：如果找到了兩站重疊的路線（例如：縱貫線 嘉義=高雄），就切換到這條路線！
      return String(sharedLine.lineID);
    }

    // 3. 最後退路：完全沒有交集時，才使用目標車站自身的第 1 條預設路線
    return targetStation.line[0]?.lineID !== undefined
      ? String(targetStation.line[0].lineID)
      : "";
  };

  useEffect(() => {
    const pageTitle = station ? station.name : "無法顯示";
    setTitle(pageTitle);
    document.title = pageTitle;
  }, [station, setTitle]);
  console.log(station);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <StationPageContainer>
        <StationContainerArea>
          <PageTitleContainer>
            <PageTitle>{station.name}</PageTitle>
          </PageTitleContainer>
          <Breadcrumbs
            currentPath={virtualPath}
            customNames={{
              [currentLineID]: currentLineName, // 例如 "mountain": "山線"
              [station.id]: station.name, // 例如 "106": "彰化站"
            }}
          />
          <Divider />
          <p className="text-black dark:text-white">
            狀態：
            {station.status === "active"
              ? "營運中"
              : station.status === "disused"
                ? "已廢止"
                : "規劃中"}
          </p>

          <RouteInfoSection>
            <StationDataTitle>車站資料</StationDataTitle>
            {station.openDate && (
              <StationDataDetail>
                <strong>設站日期:</strong> {station.openDate.join("、")}
              </StationDataDetail>
            )}
            {station.closeDate && (
              <StationDataDetail>
                <strong>廢止日期:</strong> {station.closeDate.join("、")}
              </StationDataDetail>
            )}
            {station.originalName && (
              <StationDataDetail>
                <strong>舊名:</strong> {station.originalName.join("、")}
              </StationDataDetail>
            )}

            {station.level && (
              <StationDataDetail>
                <strong>站等:</strong> {station.level}
              </StationDataDetail>
            )}
            {station.miles && (
              <StationDataDetail>
                <strong>里程:</strong> {station.miles.join("、")}
              </StationDataDetail>
            )}
            {station.height && (
              <StationDataDetail>
                <strong>海拔高度:</strong> {station.height}
              </StationDataDetail>
            )}
            {station.stationCode && (
              <StationDataDetail>
                <strong>代碼:</strong> {station.stationCode}
              </StationDataDetail>
            )}
          </RouteInfoSection>

          <StationMediaGallerySection>
            <StationPhotoTitle>Images and Descriptions</StationPhotoTitle>
            {station.images && (
              <FrameContainer>
                {station.images.map((img) => (
                  <PhotoFrame key={img._id}>
                    <PhotoBlock>
                      <StationPhoto
                        src={img.url}
                        alt={`${img.description}`}
                        width={800}
                        height={600}
                        style={{ width: "100%", height: "auto" }}
                        priority
                      />
                    </PhotoBlock>
                    <PhotoDescriptionContainer>
                      {img.description && (
                        <PhotoDescriptionText>
                          {img.description}
                        </PhotoDescriptionText>
                      )}
                      {img.capturedAt && (
                        <PhotoDescriptionText>
                          {new Date(img.capturedAt).toISOString().split("T")[0]}
                        </PhotoDescriptionText>
                      )}
                    </PhotoDescriptionContainer>
                  </PhotoFrame>
                ))}
              </FrameContainer>
            )}
          </StationMediaGallerySection>

          <AdjacentStationsSection>
            {station.prevStation && (
              <PrevStationsArea>
                <PrevStationsTitle>上一站：</PrevStationsTitle>
                {Array.isArray(station.prevStation)
                  ? station.prevStation.map((id) => {
                      const match = adjacentStations.find(
                        (s) => String(s.id) === String(id),
                      );
                      // 修正：找到 match 後才去計算 targetLine
                      const targetLine = match ? getTargetLineParam(match) : "";

                      return match ? (
                        match.hasDetail ? (
                          <AdjacentStationsLink
                            key={id}
                            href={`/stations/${id}?line=${targetLine}`}
                          >
                            {match.name}
                          </AdjacentStationsLink>
                        ) : (
                          <AdjacentStationsDisableLinkText key={id}>
                            {match.name}
                          </AdjacentStationsDisableLinkText>
                        )
                      ) : (
                        <span key={id}>ID: {id}</span>
                      );
                    })
                  : (() => {
                      const match = adjacentStations.find(
                        (s) => String(s.id) === String(station.prevStation),
                      );
                      // 修正：找到 match 後才去計算 targetLine
                      const targetLine = match ? getTargetLineParam(match) : "";

                      return match ? (
                        match.hasDetail ? (
                          <AdjacentStationsLink
                            href={`/stations/${station.prevStation}?line=${targetLine}`}
                          >
                            {match.name}
                          </AdjacentStationsLink>
                        ) : (
                          <AdjacentStationsDisableLinkText>
                            {match.name}
                          </AdjacentStationsDisableLinkText>
                        )
                      ) : (
                        <span>ID: {station.prevStation}</span>
                      );
                    })()}
              </PrevStationsArea>
            )}

            {station.nextStation && (
              <NextStationsArea>
                <NextStationsTitle>下一站：</NextStationsTitle>
                {Array.isArray(station.nextStation)
                  ? station.nextStation.map((id) => {
                      const match = adjacentStations.find(
                        (s) => String(s.id) === String(id),
                      );
                      const targetLine = match ? getTargetLineParam(match) : "";
                      return match ? (
                        match.hasDetail ? (
                          <AdjacentStationsLink
                            key={id}
                            href={`/stations/${id}?line=${targetLine}`}
                          >
                            {match.name}
                          </AdjacentStationsLink>
                        ) : (
                          <AdjacentStationsDisableLinkText key={id}>
                            {match.name}
                          </AdjacentStationsDisableLinkText>
                        )
                      ) : (
                        <span key={id}>ID: {id}</span>
                      );
                    })
                  : (() => {
                      const match = adjacentStations.find(
                        (s) => String(s.id) === String(station.nextStation),
                      );
                      const targetLine = match ? getTargetLineParam(match) : "";
                      return match ? (
                        match.hasDetail ? (
                          <AdjacentStationsLink
                            href={`/stations/${station.nextStation}?line=${targetLine}`}
                          >
                            {match.name}
                          </AdjacentStationsLink>
                        ) : (
                          <AdjacentStationsDisableLinkText>
                            {match.name}
                          </AdjacentStationsDisableLinkText>
                        )
                      ) : (
                        <AdjacentStationsDisableLinkText>
                          ID: {station.nextStation}
                        </AdjacentStationsDisableLinkText>
                      );
                    })()}
              </NextStationsArea>
            )}
          </AdjacentStationsSection>
        </StationContainerArea>
        <BottomNav station={station} railways={railways} />
      </StationPageContainer>
    </>
  );
}
