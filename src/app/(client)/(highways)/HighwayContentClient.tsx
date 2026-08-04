"use client";

import { useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import styled from "styled-components";
import Image from "next/image";
import Head from "next/head";
import Footer from "@/src/app/(components)/(footer)/footer";
import Header from "@/src/app/(components)/(header)/header";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Loading from "@/src/app/(pages)/highways/[highwayId]/loading";
import NotFound from "@/src/app/(pages)/highways/[highwayId]/not-found";
import { Highway } from "@/src/types/highway";

interface Props {
  highway: Highway;
}

const HighwayPageContainer = styled.div`
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
const HighwayContainerArea = styled.div`
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

const HighwayDataTitle = styled.h2`
  color: #ffffff;
  font-family: Inter;
  font-size: 3rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
`;

const HighwayDataDetail = styled.h3`
  color: #ffffff;
  font-family: Inter;
  font-size: 2rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 1rem;
`;
const HighwayMediaGallerySection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
`;

const HighwayPhotoTitle = styled.h2`
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

const HighwayPhoto = styled.img`
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

export default function HighwayContentClient({ highway }: Props) {
  const { title, setTitle } = useContext(TitleContext);
  const [loading, setLoading] = useState(true);
  const [notFoundPage, setNotFoundPage] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!highway) {
        setNotFoundPage(true);
        setTitle("無法顯示");
        document.title = "無法顯示";
        return;
      }
      setLoading(false);
      setTitle(highway.name);
      document.title = highway.name;
    }, 100); // 延遲模擬

    return () => clearTimeout(timer);
  }, [highway.name, setTitle]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HighwayPageContainer>
        <Header />
        {loading ? (
          <Loading />
        ) : notFoundPage ? (
          <NotFound />
        ) : (
          <HighwayContainerArea>
            <PageTitleContainer>
              <PageTitle>{highway.name}</PageTitle>
            </PageTitleContainer>
            <Breadcrumbs currentPath={pathname} />
            <Divider />
            <p className="text-black dark:text-white">
              狀態：
              {highway.status === "active"
                ? "營運中"
                : highway.status === "disused"
                  ? "已廢止"
                  : "規劃中"}
            </p>

            <RouteInfoSection>
              <HighwayDataTitle>路線資料</HighwayDataTitle>
              {highway.routeName && (
                <HighwayDataDetail>
                  <strong>路線名稱:</strong> {highway.routeName}
                </HighwayDataDetail>
              )}
              <HighwayDataDetail>
                <strong>起點:</strong> {highway.start}
              </HighwayDataDetail>
              {highway.currentStart && (
                <HighwayDataDetail>
                  <strong>通車起點:</strong> {highway.currentStart}
                </HighwayDataDetail>
              )}
              <HighwayDataDetail>
                <strong>終點:</strong> {highway.end}
              </HighwayDataDetail>
              {highway.currentEnd && (
                <HighwayDataDetail>
                  <strong>通車終點:</strong> {highway.currentEnd}
                </HighwayDataDetail>
              )}
              <HighwayDataDetail>
                <strong>長度:</strong> {highway.length} km
              </HighwayDataDetail>
              {highway.currentLength && (
                <HighwayDataDetail>
                  <strong>通車長度:</strong> {highway.currentLength} km
                </HighwayDataDetail>
              )}
              {highway.highest && (
                <HighwayDataDetail>
                  <strong>最高海拔:</strong> {highway.highest} m
                </HighwayDataDetail>
              )}
              {highway.highestPlace && (
                <HighwayDataDetail>
                  <strong>最高點:</strong> {highway.highestPlace}
                </HighwayDataDetail>
              )}
              {highway.otherName && (
                <HighwayDataDetail>
                  <strong>別稱:</strong> {highway.otherName.join("、")}
                </HighwayDataDetail>
              )}
              {highway.remark && (
                <HighwayDataDetail>
                  <strong>備註:</strong> {highway.remark}
                </HighwayDataDetail>
              )}
            </RouteInfoSection>

            <HighwayMediaGallerySection>
              <HighwayPhotoTitle>Images and Descriptions</HighwayPhotoTitle>
              {highway.images && (
                <FrameContainer>
                  {highway.images.map((img, idx) => (
                    <PhotoFrame key={img._id}>
                      <PhotoBlock>
                        <HighwayPhoto
                          src={img.url}
                          alt={`${highway.name} - ${idx}`}
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
            </HighwayMediaGallerySection>
          </HighwayContainerArea>
        )}
        <BottomNav />
        <Footer />
      </HighwayPageContainer>
    </>
  );
}
