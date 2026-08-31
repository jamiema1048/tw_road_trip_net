"use client";
import React, { useEffect, useContext, memo } from "react";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { TERMS_DATA } from "@/src/data/termsData"; // 引入靜態資料

const TermsPageContainer = styled.div`
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
const TermsContainer = styled.div`
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

const TermsInfoSection = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  margin-top: 1.25rem;
  content-visibility: auto;
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const TermsTitle = styled.h2`
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

const TermsDetail = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: baseline;
  gap: 0.75rem;
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const TermsHeadDot = styled.svg`
  width: 2rem;
  height: 2rem;
  aspect-ratio: 1/1;
  flex-shrink: 0;
  @media (max-width: 768px) {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const TermsDetailText = styled.h3`
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

// 抽離重複 SVG 節點，使用 memo 防止不必要的重繪
const TermsHeadIcon = memo(() => (
  <TermsHeadDot
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
  </TermsHeadDot>
));
TermsHeadIcon.displayName = "TermsHeadIcon";

export default function TermsClient() {
  const { setTitle } = useContext(TitleContext);
  const pathname = usePathname();
  useEffect(() => {
    setTitle("使用條款");
    document.title = "使用條款";
  }, [setTitle]);
  return (
    <TermsPageContainer>
      <TermsContainer>
        <PageTitleContainer>
          <PageTitle>
            使用條款與免責聲明（Terms of Service & Disclaimer）
          </PageTitle>
        </PageTitleContainer>

        <Breadcrumbs currentPath={pathname} />
        <Divider />

        {/* 使用地圖式渲染，大符減少動態/靜態 Bundle 包大小 */}
        {TERMS_DATA.map((section, sIndex) => (
          <TermsInfoSection key={sIndex}>
            <TermsTitle>{section.title}</TermsTitle>
            {section.items.map((item, iIndex) => (
              <TermsDetail key={iIndex}>
                <TermsHeadIcon />
                <TermsDetailText>
                  <strong>{item.subtitle}</strong>
                  {item.content}
                </TermsDetailText>
              </TermsDetail>
            ))}
          </TermsInfoSection>
        ))}
      </TermsContainer>

      <BottomNav />
    </TermsPageContainer>
  );
}
