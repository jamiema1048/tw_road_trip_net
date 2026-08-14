"use client";

import { useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Loading from "@/src/app/(pages)/stations/[stationId]/loading";
import NotFound from "../../(pages)/stations/[stationId]/not-found";
import Breadcrumbs from "../../(components)/(breadcrumbs)/Breadcrumbs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Station, StationLineDistrict, RailwayData } from "@/src/types/railway";

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
  background-color: #000000;
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
  background-color: #000000;
  align-items: center;
  width: 100%;
  padding: 1.75rem 3rem 1.75rem 3rem;
  @media (max-width: 576px) {
    padding: 1.25rem 4.5rem 1.25rem 4.5rem;
  }
`;

const PageTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.25rem auto;
`;
const PageTitle = styled.div`
  color: #ffffff;
  font-family: "Inter-Regular", Helvetica;
  font-size: 3rem;
  font-weight: 400;
  letter-spacing: 0;
  line-height: normal;
`;

const Divider = styled.div`
  background-color: #ffffff;
  height: 1px;
  margin: 1.25rem auto;
  width: 100%;
`;

const RouteInfoSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
`;

const StationDataTitle = styled.h2`
  color: #ffffff;
  font-family: Inter;
  font-size: 3rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
`;

const StationDataDetail = styled.h3`
  color: #ffffff;
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
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
  color: #ffffff;
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
`;

const PhotoDescriptionText = styled.p`
  color: #ffffff;
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const AdjacentStationsSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.75rem;
  margin-top: 1rem;
`;

const PrevStationsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const PrevStationsTitle = styled.h3`
  color: #ffffff;
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const NextStationsArea = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const NextStationsTitle = styled.h3`
  color: #ffffff;
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const AdjacentStationsLink = styled(Link)`
  color: #ffffff;
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
    color: #2f7716; /* hover:text-green-400 */
  }
`;

const AdjacentStationsDisableLinkText = styled.div`
  color: #949494;
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  opacity: 0.6;
`;

const StationBottomNav = styled.nav`
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1.25rem;
  gap: 3rem;
`;

const StationBottomNavButton = styled.button`
  display: block;
  background: none;
  border: none;
  padding: 0;
  color: #fff;
  font-family: Inter, sans-serif;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    text-decoration: underline;
    color: #2f7716;
  }
`;

const StationBottomNavLink = styled(Link)`
  display: block;
  color: #fff;
  font-family: Inter;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  text-decoration: none; /* 繼承外層的刪除線或斜體 */
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  /* Hover 效果 (搭配微調邊距) */
  &:hover {
    text-decoration: underline;
    color: #2f7716; /* hover:text-green-400 */
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
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滾動效果
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!station) {
        setNotFoundPage(true);
        setTitle("無法顯示");
        document.title = "無法顯示";
        return;
      }
      setLoading(false);
      setTitle(station.name);
      document.title = `${station.name}`;
    }, 100); // 延遲模擬

    return () => clearTimeout(timer);
  }, [station.name, setTitle]);
  console.log(station);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <StationPageContainer>
        {loading ? (
          <Loading />
        ) : notFoundPage ? (
          <NotFound />
        ) : (
          <StationContainerArea>
            <PageTitleContainer>
              <PageTitle>{station.name}</PageTitle>
            </PageTitleContainer>
            <Breadcrumbs currentPath={pathname} />
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
                  {station.images.map((img, idx) => (
                    <PhotoFrame key={img._id}>
                      <PhotoBlock>
                        <StationPhoto
                          src={img.url}
                          alt={`${img.description}`}
                          width={800}
                          height={600}
                          layout="intrinsic"
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
                            {
                              new Date(img.capturedAt)
                                .toISOString()
                                .split("T")[0]
                            }
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
                        return match ? (
                          match.hasDetail ? (
                            <AdjacentStationsLink
                              key={id}
                              href={`/stations/${id}`}
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
                        return match ? (
                          match.hasDetail ? (
                            <AdjacentStationsLink
                              href={`/stations/${station.prevStation}`}
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
                        return match ? (
                          match.hasDetail ? (
                            <AdjacentStationsLink
                              key={id}
                              href={`/stations/${id}`}
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
                        return match ? (
                          match.hasDetail ? (
                            <AdjacentStationsLink
                              href={`/stations/${station.nextStation}`}
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
        )}
        <StationBottomNav>
          <StationBottomNavButton onClick={scrollToTop}>
            回到最上方
          </StationBottomNavButton>
          <StationBottomNavLink href="/">回首頁</StationBottomNavLink>
          {station.line.map((line) => {
            // 1. 利用 find 找不到會回傳 undefined 的特性，搭配 || 做預設值
            const railwayName =
              railways.find((r) => Number(r.id) === Number(line.lineID))
                ?.name || `ID: ${line.lineID}`;

            return (
              <StationBottomNavLink
                key={line.lineID}
                href={`/railways/${line.lineID}`}
              >
                回{railwayName}
              </StationBottomNavLink>
            );
          })}
        </StationBottomNav>
      </StationPageContainer>
    </>
  );
}
