"use client";

import { useState } from "react";
import Link from "next/link";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import { SearchResultItem } from "@/src/app/_lib/search";
import SearchBar from "@/src/app/(components)/(search)/SearchBar";
import Loading from "@/src/app/(pages)/search/loading";

import styles from "@/src/styles/pages/search/SearchResults.module.css";

interface Props {
  query: string;
  results: SearchResultItem[];
}

export default function SearchResultsClient({ query, results }: Props) {
  const [loading, setLoading] = useState(false);
  const [prevQuery, setPrevQuery] = useState(query);
  const [activeTab, setActiveTab] = useState<
    "all" | "highway" | "railway" | "station"
  >("all");

  const highwayList = results.filter((item) => item.type === "highway");
  const railwayList = results.filter((item) => item.type === "railway");
  const stationList = results.filter((item) => item.type === "station");

  const displayedResults = results.filter((item) => {
    if (activeTab === "highway") return item.type === "highway";
    if (activeTab === "railway") return item.type === "railway";
    if (activeTab === "station") return item.type === "station";
    return true;
  });

  if (query !== prevQuery) {
    setPrevQuery(query);
    setLoading(false);
  }

  return (
    <div className={styles.searchResultsPageContainer}>
      {!query ? (
        <div className={styles.container}>
          <div className={styles.emptyBox}>
            <h1 className={styles.title}>全域公路與鐵路搜尋</h1>
            <p className={styles.subText}>請在上方搜尋列輸入關鍵字進行查詢。</p>
          </div>
        </div>
      ) : (
        <div className={styles.container}>
          <div className={styles.searchHeader}>
            <SearchBar />
            <h1 className={styles.title}>
              「<span className={styles.highlight}>{query}</span>」的搜尋結果
            </h1>
            <p className={styles.subText}>
              共找到 {results.length} 筆資料（公路：{highwayList.length}{" "}
              筆，鐵路：
              {railwayList.length} 筆，車站：{stationList.length} 筆）
            </p>
          </div>
          <div className={styles.divider} />
          <div className={styles.resultsContainerArea}>
            {/* 分頁 Tab 切換 */}
            {results.length > 0 && (
              <div className={styles.tabContainer}>
                <button
                  type="button"
                  className={`${styles.tabButton} ${
                    activeTab === "all" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab("all")}
                >
                  全部 ({results.length})
                </button>
                <button
                  type="button"
                  className={`${styles.tabButton} ${
                    activeTab === "highway" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab("highway")}
                >
                  🛣️ 公路 ({highwayList.length})
                </button>
                <button
                  type="button"
                  className={`${styles.tabButton} ${
                    activeTab === "railway" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab("railway")}
                >
                  🚆 鐵路 ({railwayList.length})
                </button>
                <button
                  type="button"
                  className={`${styles.tabButton} ${
                    activeTab === "station" ? styles.tabButtonActive : ""
                  }`}
                  onClick={() => setActiveTab("station")}
                >
                  🚆 車站 ({stationList.length})
                </button>
              </div>
            )}

            {/* 搜尋結果列表 */}
            {loading ? (
              <Loading />
            ) : displayedResults.length > 0 ? (
              <div className={styles.grid}>
                {displayedResults.map((item) => (
                  <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    className={styles.resultCard}
                  >
                    <div className={styles.cardInfo}>
                      <span className={styles.cardTitle}>{item.title}</span>
                      <span className={styles.cardSubtitle}>
                        {Array.isArray(item.subtitle)
                          ? item.subtitle.map((lineName, index) => (
                              <span key={index}>
                                {lineName}
                                {index < item.subtitle.length - 1 && (
                                  <span
                                    className={styles.cardSubtitleSeparator}
                                  >
                                    、
                                  </span>
                                )}
                              </span>
                            ))
                          : item.subtitle}
                      </span>
                    </div>
                    <div className={styles.cardGoIconDiv}>
                      <svg
                        className={styles.cardGoIcon}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        fill="none"
                      >
                        <path
                          d="M26 36L38 24L26 12M38 24H10"
                          stroke="var(--text-white-aaaa)"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyBox}>
                <div className={styles.emptyIcon}>
                  <svg
                    width="240"
                    height="262"
                    viewBox="0 0 240 262"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M223.548 111.774C223.548 173.505 173.505 223.548 111.774 223.548C50.043 223.548 0 173.505 0 111.774C0 50.043 50.043 0 111.774 0C173.505 0 223.548 50.043 223.548 111.774ZM16.7661 111.774C16.7661 164.246 59.3027 206.782 111.774 206.782C164.246 206.782 206.782 164.246 206.782 111.774C206.782 59.3027 164.246 16.7661 111.774 16.7661C59.3027 16.7661 16.7661 59.3027 16.7661 111.774Z"
                      fill="var(--text-white-aaaa)"
                    />
                    <path
                      d="M175.511 200.743C172.205 196.802 172.719 190.927 176.659 187.62C180.6 184.314 186.475 184.828 189.782 188.768L237.68 245.851C240.987 249.792 240.473 255.667 236.532 258.974C232.591 262.28 226.716 261.766 223.409 257.826L175.511 200.743Z"
                      fill="var(--text-white-aaaa)"
                    />
                    <path
                      d="M85.6935 110.843C85.6935 121.646 81.1062 130.403 75.4476 130.403C69.7889 130.403 65.2016 121.646 65.2016 110.843C65.2016 100.04 69.7889 91.2822 75.4476 91.2822C81.1062 91.2822 85.6935 100.04 85.6935 110.843Z"
                      fill="var(--text-white-aaaa)"
                    />
                    <path
                      d="M151.827 110.843C151.827 121.646 147.239 130.403 141.581 130.403C135.922 130.403 131.335 121.646 131.335 110.843C131.335 100.04 135.922 91.2822 141.581 91.2822C147.239 91.2822 151.827 100.04 151.827 110.843Z"
                      fill="var(--text-white-aaaa)"
                    />
                    <path
                      d="M111.308 181.633L89.9319 160.675L111.308 174.647L132.685 160.675L111.308 181.633Z"
                      fill="var(--text-white-aaaa)"
                    />
                    <path
                      d="M49.5231 70.4965L79.1304 54.7541L80.8795 58.0437L51.2723 73.7862L49.5231 70.4965Z"
                      fill="var(--text-white-aaaa)"
                    />
                    <path
                      d="M137.741 54.9556L167.348 70.6981L165.599 73.9878L135.992 58.2453L137.741 54.9556Z"
                      fill="var(--text-white-aaaa)"
                    />
                  </svg>
                </div>
                <p className={styles.subText}>
                  找不到與「{query}」相關的公路或車站資料。
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
