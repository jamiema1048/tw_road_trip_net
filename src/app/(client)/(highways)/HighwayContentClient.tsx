"use client";
import { notFound } from "next/navigation";
import styled from "styled-components";
import Image from "next/image";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { Highway } from "@/src/types/highway";

interface Props {
  highway: Highway;
}

const HighwayPageContainer = styled.div`
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
const HighwayContainerArea = styled.div`
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
  flex-direction: row;
  justify-content: center;
  margin: 1.25rem auto;
  align-items: center;
  gap: 1rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const HighwayIcon = styled(Image)`
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 32px; /* 相當於原本的 2rem */
    height: 32px;
  }
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

const HighwayDataTitle = styled.h2`
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

const HighwayDataDetail = styled.h3`
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
const HighwayMediaGallerySection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
`;

const HighwayPhotoTitle = styled.h2`
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
  width: 100%;
  border-radius: 2rem;
  aspect-ratio: 4 / 3; /* 根據照片比例鎖定，例如 16/9 或 4/3 */
  position: relative;
  background-color: var(--bg-placeholder, #f0f0f0);
  overflow: hidden;
  box-shadow:
    4px 4px 4px 0 rgba(0, 0, 0, 0.25) inset,
    8px 8px 4px 0 rgba(255, 255, 255, 0.25);
`;

const HighwayPhoto = styled(Image)`
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
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

export default function HighwayContentClient({ highway }: Props) {
  if (!highway) {
    notFound();
  }

  return (
    <HighwayPageContainer>
      <HighwayContainerArea>
        <PageTitleContainer>
          <HighwayIcon
            src={
              highway.highwayIcon ||
              `/highway_mark/${highway.id}/${highway.id}.svg`
            }
            alt={`${highway.name} 圖示`}
            width={48}
            height={48}
            priority
            className="object-contain"
          />
          <PageTitle>{highway.name}</PageTitle>
        </PageTitleContainer>
        <Breadcrumbs
          customNames={{
            [highway.id]: highway.name,
          }}
        />
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
        </HighwayMediaGallerySection>
      </HighwayContainerArea>
      <BottomNav />
    </HighwayPageContainer>
  );
}
