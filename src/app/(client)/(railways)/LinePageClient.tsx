"use client";
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Head from "next/head";
import { usePathname } from "next/navigation";
import Loading from "@/src/app/(pages)/railways/loading";
import { RailwayCompanyGroup } from "@/src/app/(components)/(railways)/RailwayCompanyGroup";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";

interface Line {
  id: number;
  name: string;
  co: number;
  district: {
    districtID: number;
    districtName: string;
    prevArea?: number;
    nextArea?: number;
  }[];
}

interface Props {
  lines: Line[];
}

const RailwayListPageContainer = styled.div`
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
const RailwayListContainer = styled.div`
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

export default function LinePageClient({ lines }: Props) {
  const { title, setTitle } = useContext(TitleContext);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // 模擬載入動畫
    const timer = setTimeout(() => {
      setLoading(false);
      setTitle("鐵路總覽");
      document.title = "鐵路總覽";
    }, 100); // 可自行調整延遲，測試可縮短

    return () => clearTimeout(timer);
  }, [setTitle]); //Context完成後補回setTitle

  // 根據 co 分組
  const groupedByCo = lines.reduce<Record<number, Line[]>>((acc, line) => {
    if (!acc[line.co]) acc[line.co] = [];
    acc[line.co].push(line);
    return acc;
  }, {});

  const companyMap: Record<number, string> = {
    1: "台鐵",
    2: "林業鐵路",
    3: "糖業鐵路",
    4: "其他鐵路",
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <RailwayListPageContainer>
        {loading ? (
          <Loading />
        ) : (
          <RailwayListContainer>
            <PageTitleContainer>
              <PageTitle>
                <h1>🚉 鐵路總覽</h1>
              </PageTitle>
            </PageTitleContainer>
            <Breadcrumbs currentPath={pathname} />
            <Divider />
            {Object.entries(groupedByCo).map(([co, lineList]) => (
              <RailwayCompanyGroup
                key={co}
                co={co}
                companyMap={companyMap}
                lineList={lineList} // 這裡直接傳入該 co 專屬的路線陣列
              />
            ))}
          </RailwayListContainer>
        )}
        <BottomNav />
      </RailwayListPageContainer>
    </>
  );
}
