"use client";
import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Header from "@/src/app/(components)/(header)/header";
import Footer from "@/src/app/(components)/(footer)/footer";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";

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

export default function TermsClient() {
  const [loading, setLoading] = useState(false);
  const { title, setTitle } = useContext(TitleContext);
  const pathname = usePathname();
  useEffect(() => {
    // 模擬載入動畫
    const timer = setTimeout(() => {
      setLoading(false);
      setTitle("使用條款");
      document.title = "使用條款";
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]);
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <TermsPageContainer>
        <TermsContainer>
          <PageTitleContainer>
            <PageTitle>
              <h1>使用條款</h1>
            </PageTitle>
          </PageTitleContainer>
          <Breadcrumbs currentPath={pathname} />
          <Divider />
          <div>Terms</div>
        </TermsContainer>
        <BottomNav />
      </TermsPageContainer>
    </>
  );
}
