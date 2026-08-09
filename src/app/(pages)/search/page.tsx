export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getGlobalSearchResults } from "@/src/app/_lib/search";
import SearchResultsClient from "@/src/app/(client)/(search)/SearchResultsClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

// 全域 SEO 動態標題
export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `「${q}」的搜尋結果 | 全域資料庫` : "全域搜尋",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() || "";

  // 伺服器端直接取得 DB 資料（不透過 API Route HTTP 請求）
  const results = query ? await getGlobalSearchResults(query) : [];

  return <SearchResultsClient query={query} results={results} />;
}
