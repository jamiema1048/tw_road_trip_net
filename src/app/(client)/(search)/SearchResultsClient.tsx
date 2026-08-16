"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import Head from "next/head";
import { usePathname } from "next/navigation";
import styled from "styled-components";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
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
            <ResultsContainerArea>
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
                        <CardSubtitle>
                          {Array.isArray(item.subtitle)
                            ? item.subtitle.map((lineName, index) => (
                                <span key={index}>
                                  {lineName}
                                  {/* 如果不是最後一個項目，補上逗號 */}
                                  {index < item.subtitle.length - 1 && (
                                    <span
                                      style={{
                                        color: "#666666",
                                        margin: "0 4px",
                                      }}
                                    >
                                      、
                                    </span>
                                  )}
                                </span>
                              ))
                            : item.subtitle}
                        </CardSubtitle>
                      </CardInfo>
                      <CardGoIcon>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          viewBox="0 0 48 48"
                          fill="none"
                        >
                          <path
                            d="M26 36L38 24L26 12M38 24H10"
                            stroke={"var(--text-white-aaaa)"}
                            stroke-width="4"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </CardGoIcon>
                    </ResultCard>
                  ))}
                </Grid>
              ) : (
                <EmptyBox>
                  <EmptyIcon>
                    <svg
                      width="240"
                      height="262"
                      viewBox="0 0 240 262"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M223.548 111.774C223.548 173.505 173.505 223.548 111.774 223.548C50.043 223.548 0 173.505 0 111.774C0 50.043 50.043 0 111.774 0C173.505 0 223.548 50.043 223.548 111.774ZM16.7661 111.774C16.7661 164.246 59.3027 206.782 111.774 206.782C164.246 206.782 206.782 164.246 206.782 111.774C206.782 59.3027 164.246 16.7661 111.774 16.7661C59.3027 16.7661 16.7661 59.3027 16.7661 111.774Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                      <path
                        d="M175.511 200.743C172.205 196.802 172.719 190.927 176.659 187.62C180.6 184.314 186.475 184.828 189.782 188.768L237.68 245.851C240.987 249.792 240.473 255.667 236.532 258.974C232.591 262.28 226.716 261.766 223.409 257.826L175.511 200.743Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                      <path
                        d="M85.6935 110.843C85.6935 121.646 81.1062 130.403 75.4476 130.403C69.7889 130.403 65.2016 121.646 65.2016 110.843C65.2016 100.04 69.7889 91.2822 75.4476 91.2822C81.1062 91.2822 85.6935 100.04 85.6935 110.843Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                      <path
                        d="M151.827 110.843C151.827 121.646 147.239 130.403 141.581 130.403C135.922 130.403 131.335 121.646 131.335 110.843C131.335 100.04 135.922 91.2822 141.581 91.2822C147.239 91.2822 151.827 100.04 151.827 110.843Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                      <path
                        d="M111.308 181.633L89.9319 160.675L111.308 174.647L132.685 160.675L111.308 181.633Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                      <path
                        d="M49.5231 70.4965L79.1304 54.7541L80.8795 58.0437L51.2723 73.7862L49.5231 70.4965Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                      <path
                        d="M137.741 54.9556L167.348 70.6981L165.599 73.9878L135.992 58.2453L137.741 54.9556Z"
                        fill={"var(--text-white-aaaa)"}
                      />
                    </svg>
                  </EmptyIcon>
                  <SubText>找不到與「{query}」相關的公路或車站資料。</SubText>
                </EmptyBox>
              )}
            </ResultsContainerArea>
          </Container>
        )}
        <BottomNav />
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
  @media (max-width: 768px) {
    padding: 1.25rem 2.5rem 1.25rem 2.5rem;
  }
`;

const SearchHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--text-white-aaaa);
  /* text/H2 */
  font-family: Inter;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Highlight = styled.span`
  color: var(--text-info);
`;

const SubText = styled.p`
  color: var(--text-white-aaaa);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Divider = styled.div`
  background-color: var(--text-white-aaaa);
  height: 1px;
  margin: 0 auto;
  width: 100%;
`;

const ResultsContainerArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  width: 60%;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const TabButton = styled.button<{ $active: boolean }>`
  border-radius: 9999px;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  cursor: pointer;
  display: inline-flex;
  padding: 0.5rem 1rem;
  justify-content: center;
  align-items: center;
  border: 1px solid
    ${({ $active }) => ($active ? "var(--border-route-cell)" : "#333333")};
  background-color: ${({ $active }) =>
    $active ? "#067ae0" : "var(--text-gray-aaa)"};
  color: ${({ $active }) =>
    $active ? "var(--text-white-aaaa)" : "var(--text-gray-a)"};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: var(--border-route-cell);
    color: var(--text-white-aaaa);
  }
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.5rem;
`;

const ResultCard = styled(Link)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  padding: 1.25rem 2.25rem;
  background-color: var(--background);
  border: 1px solid #2e2e2e;
  border-radius: 1.25rem;
  text-decoration: none;
  transition: all 0.2s ease-in-out;

  &:hover {
    border: 3px solid var(--text-info);
    transform: translateY(-2px);
  }

  &:active {
    border: 3px solid var(--text-white-aaaa);
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
  color: var(--text-white-aaaa);
`;

const CardSubtitle = styled.span`
  font-size: 0.875rem;
  color: var(--text-gray-aa);
`;

const CardGoIcon = styled.div`
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;

const EmptyBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  padding: 4rem 1rem;
`;

const EmptyIcon = styled.div`
  flex-shrink: 0;
  aspect-ratio: 1/1;
`;
