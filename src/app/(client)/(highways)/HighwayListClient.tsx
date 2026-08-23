"use client";

import { useState, useEffect, useContext, useRef } from "react";
import Head from "next/head";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Province from "@/src/app/(components)/(highways)/Province";
import County from "@/src/app/(components)/(highways)/County";
import Loading from "@/src/app/(pages)/highways/loading";
import NotFound from "../../(pages)/highways/not-found";
import { Highway } from "@/src/types/highway";

interface Props {
  highways: Highway[];
}

const HighwayListPageContainer = styled.div`
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

const HighwayListContainer = styled.div`
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

const HighwayContentContainer = styled.div`
  margin: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  @media (max-width: 768px) {
    margin: 0;
  }
`;

export default function HighwayListClient({ highways }: Props) {
  const [loading, setLoading] = useState(false);
  const { title, setTitle } = useContext(TitleContext);
  const pathname = usePathname();

  useEffect(() => {
    // 模擬載入動畫
    const timer = setTimeout(() => {
      setLoading(false);
      setTitle("公路列表");
      document.title = "公路列表";
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <HighwayListPageContainer>
        {loading ? (
          <Loading />
        ) : (
          <HighwayListContainer>
            <PageTitleContainer>
              <PageTitle>公路列表</PageTitle>
            </PageTitleContainer>
            <Breadcrumbs currentPath={pathname} />
            <Divider />
            <HighwayContentContainer>
              <Province
                highways={highways}
                loading={loading}
                setLoading={setLoading}
              />
              <County
                highways={highways}
                loading={loading}
                setLoading={setLoading}
              />
            </HighwayContentContainer>
          </HighwayListContainer>
        )}
        <BottomNav />
      </HighwayListPageContainer>
    </>
  );
}
