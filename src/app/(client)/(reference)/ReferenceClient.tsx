"use client";
import React, { useState, useEffect, useContext, memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Loading from "@/src/app/(pages)/reference/loading";
import { Reference_DATA } from "@/src/data/referenceData";

const ReferencePageContainer = styled.div`
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
const ReferenceContainer = styled.div`
  background-color: var(--background);
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

const ReferenceInfoSection = styled.section`
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

const ReferenceTitle = styled.h2`
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

const ReferenceDetail = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  gap: 0.75rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ReferenceHeadDot = styled.svg`
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const ReferenceDetailText = styled.h3`
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

const ReferenceDetailLinkText = styled(Link)`
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

const LoadingPlaceholder = styled(Loading)`
  min-height: 400px; /* 👈 預留列表高度，避免從 0 變大引發 CLS */
`;

// 抽離重複 SVG 節點，使用 memo 防止不必要的重繪
const ReferenceHeadIcon = memo(() => (
  <ReferenceHeadDot
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M9.6 16C9.6 17.6974 10.2743 19.3253 11.4745 20.5255C12.6747 21.7257 14.3026 22.4 16 22.4C17.6974 22.4 19.3253 21.7257 20.5255 20.5255C21.7257 19.3253 22.4 17.6974 22.4 16C22.4 14.3026 21.7257 12.6748 20.5255 11.4745C19.3253 10.2743 17.6974 9.60001 16 9.60001C14.3026 9.60001 12.6747 10.2743 11.4745 11.4745C10.2743 12.6748 9.6 14.3026 9.6 16Z"
      fill="var(--text-white-aaaa)"
    />
  </ReferenceHeadDot>
));
ReferenceHeadIcon.displayName = "ReferenceHeadIcon";

export default function ReferenceClient() {
  const [loading, setLoading] = useState(true);
  const { setTitle } = useContext(TitleContext);
  const pathname = usePathname();
  useEffect(() => {
    // 模擬載入動畫
    setTitle("參考資料");
    document.title = "參考資料";
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]);
  return (
    <ReferencePageContainer>
      <ReferenceContainer>
        <PageTitleContainer>
          <PageTitle>
            參考資料與來源聲明（Data Sources & Attributions）
          </PageTitle>
        </PageTitleContainer>
        <Breadcrumbs currentPath={pathname} />
        <Divider />
        {loading ? (
          <LoadingPlaceholder />
        ) : (
          Reference_DATA.map((section, sIndex) => (
            <ReferenceInfoSection key={sIndex}>
              <ReferenceTitle>{section.title}</ReferenceTitle>
              {section.subtitle && (
                <ReferenceDetailText>{section.subtitle}</ReferenceDetailText>
              )}
              {section.items.map((item, iIndex) => (
                <ReferenceDetail key={iIndex}>
                  <ReferenceHeadIcon />
                  {item.link ? (
                    <ReferenceDetailLinkText href={item.link}>
                      <strong>{item.subtitle}</strong>
                      {item.content}
                    </ReferenceDetailLinkText>
                  ) : (
                    <ReferenceDetailText>
                      <strong>{item.subtitle}</strong>
                      {item.content}
                    </ReferenceDetailText>
                  )}
                </ReferenceDetail>
              ))}
            </ReferenceInfoSection>
          ))
        )}
      </ReferenceContainer>
      <BottomNav />
    </ReferencePageContainer>
  );
}
