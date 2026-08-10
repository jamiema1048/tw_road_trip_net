"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Header from "@/src/app/(components)/(header)/header";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import Footer from "@/src/app/(components)/(footer)/footer";
import { SearchResultItem } from "@/src/app/_lib/search";
import SearchBar from "@/src/app/(components)/(search)/SearchBar";

interface Props {
  query: string;
  results: SearchResultItem[];
}

export default function SearchResultsClient({ query, results }: Props) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "highway" | "railway" | "station"
  >("all");
  //   const { title, setTitle } = useContext(TitleContext);

  const highwayList = results.filter((item) => item.type === "highway");
  const railwayList = results.filter((item) => item.type === "railway");
  const stationList = results.filter((item) => item.type === "station");

  const displayedResults = results.filter((item) => {
    if (activeTab === "highway") return item.type === "highway";
    if (activeTab === "railway") return item.type === "railway";
    if (activeTab === "station") return item.type === "station";
    return true;
  });

  //   useEffect(() => {
  //     // 模擬載入動畫
  //     const timer = setTimeout(() => {
  //       setLoading(false);
  //       setTitle("公路列表");
  //       document.title = "公路列表";
  //     }, 100); // 可自行調整延遲，測試可縮短

  //     return () => clearTimeout(timer);
  //   }, [setTitle]);

  return (
    <>
      {/* <Head>
        <title>{title}</title>
      </Head> */}
      <SearchResultsPageContainer>
        <Header />
        {!query ? (
          <Container>
            <EmptyBox>
              <Title>全域公路與鐵路搜尋</Title>
              <SubText>請在上方搜尋列輸入關鍵字進行查詢。</SubText>
            </EmptyBox>
          </Container>
        ) : (
          <Container>
            <SearchHeader>
              <SearchBar />
              <Title>
                「<Highlight>{query}</Highlight>」的搜尋結果
              </Title>
              <SubText>
                共找到 {results.length} 筆資料（公路：{highwayList.length}{" "}
                筆，鐵路：{railwayList.length} 筆，車站：{stationList.length}{" "}
                筆）
              </SubText>
            </SearchHeader>
            <Divider />

            {/* 分頁 Tab 切換 */}
            {results.length > 0 && (
              <TabContainer>
                <TabButton
                  $active={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                >
                  全部 ({results.length})
                </TabButton>
                <TabButton
                  $active={activeTab === "highway"}
                  onClick={() => setActiveTab("highway")}
                >
                  🛣️ 公路 ({highwayList.length})
                </TabButton>
                <TabButton
                  $active={activeTab === "railway"}
                  onClick={() => setActiveTab("railway")}
                >
                  🚆 鐵路 ({railwayList.length})
                </TabButton>
                <TabButton
                  $active={activeTab === "station"}
                  onClick={() => setActiveTab("station")}
                >
                  🚆 車站 ({stationList.length})
                </TabButton>
              </TabContainer>
            )}

            {/* 搜尋結果列表 */}
            {displayedResults.length > 0 ? (
              <Grid>
                {displayedResults.map((item) => (
                  <ResultCard key={`${item.type}-${item.id}`} href={item.url}>
                    <CardInfo>
                      <CardTitle>{item.title}</CardTitle>
                      <CardSubtitle>{item.subtitle}</CardSubtitle>
                    </CardInfo>
                    <Badge $type={item.type}>
                      {item.type === "highway"
                        ? "公路"
                        : item.type === "railway"
                          ? "鐵路"
                          : "車站"}
                    </Badge>
                  </ResultCard>
                ))}
              </Grid>
            ) : (
              <EmptyBox>
                <SubText>找不到與「{query}」相關的公路或車站資料。</SubText>
              </EmptyBox>
            )}
          </Container>
        )}
        <BottomNav />
        <Footer />
      </SearchResultsPageContainer>
    </>
  );
}

/* Styled Components */

const SearchResultsPageContainer = styled.div`
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 1.75rem 3rem 1.75rem 3rem;
  overflow-y: auto;
  position: relative;
`;

const SearchHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #ffffff;
  /* text/H2 */
  font-family: Inter;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Highlight = styled.span`
  color: #008e9b;
`;

const SubText = styled.p`
  color: #ffffff;
  font-family: Inter;
  font-size: 1.75rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Divider = styled.div`
  background-color: #ffffff;
  height: 1px;
  margin: 1.25rem auto;
  width: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border-radius: 9999px;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  display: inline-flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  border: 1px solid ${({ $active }) => ($active ? "#4b4bff" : "#333333")};
  background-color: ${({ $active }) => ($active ? "#067ae0" : "#343434")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#d9d9d9")};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #4b4bff;
    color: #ffffff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ResultCard = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  background-color: #1a1a1a;
  border: 1px solid #2e2e2e;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #2f7716;
    transform: translateY(-2px);
  }
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CardTitle = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: #ffffff;
`;

const CardSubtitle = styled.span`
  font-size: 0.875rem;
  color: #888888;
`;

const Badge = styled.span<{ $type: "highway" | "railway" }>`
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 6px;
  font-weight: 600;
  background-color: ${({ $type }) =>
    $type === "highway" ? "rgba(47, 119, 22, 0.2)" : "rgba(0, 102, 204, 0.2)"};
  color: ${({ $type }) => ($type === "highway" ? "#4ade80" : "#60a5fa")};
  border: 1px solid
    ${({ $type }) =>
      $type === "highway"
        ? "rgba(47, 119, 22, 0.5)"
        : "rgba(0, 102, 204, 0.5)"};
`;

const EmptyBox = styled.div`
  text-align: center;
  padding: 4rem 1rem;
`;
