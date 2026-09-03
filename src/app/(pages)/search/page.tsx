// page.tsx (Server Component)
export const dynamic = "force-dynamic";

import { Metadata } from "next";
import { getGlobalSearchResults } from "@/src/app/_lib/search";
import SearchResultsClient from "@/src/app/(client)/(search)/SearchResultsClient";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `「${q}」的搜尋結果 | 全域資料庫` : "全域搜尋",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";
  let results: Awaited<ReturnType<typeof getGlobalSearchResults>> = [];

  if (query) {
    try {
      results = await getGlobalSearchResults(query);
    } catch (error) {
      console.error("搜尋過程發生錯誤:", error);
    }
  }

  return <SearchResultsClient query={query} results={results} />;
}
