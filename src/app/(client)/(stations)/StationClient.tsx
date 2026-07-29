"use client";

import { useContext, useEffect } from "react";
import { TitleContext } from "@/src/app/(context)/title/TitleContext";
import Footer from "@/src/app/(components)/(footer)/footer";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { Station, StationLineDistrict, RailwayData } from "@/src/types/railway";

// interface District {
//   districtID: number;
//   districtName: string;
//   prevArea?: number;
//   nextArea?: number;
// }

// interface Line {
//   id: number;
//   name: string;
//   co: number;
//   district: District[];
// }

// interface StationLineInfo {
//   lineID: number;
//   lineDistrict: StationLineDistrict;
// }

// // 2. 定義圖片的詳細結構
// interface StationImage {
//   _id?: string; // MongoDB 自動產生的 ID
//   url: string;
//   description?: string;
//   capturedAt?: string | Date; // Server 端是 Date，傳到 Client 會變 ISO 字串
// }

// 3. 主介面 Station
// interface Station {
//   _id?: string; // MongoDB 的唯一識別碼 (脫水後為字串)
//   id: number;
//   name: string;
//   status: "active" | "disused" | "plan"; // 配合 Schema 的 enum

//   // 以下皆改為陣列格式，移除問號（因為有 default: []）
//   openDate: string[];
//   closeDate: string[];
//   originalName: string[];
//   miles: string[];

//   level?: string;
//   height?: string;
//   stationCode?: string;

//   line: StationLineInfo[];

//   // 前後站統一為數字陣列
//   prevStation: number[];
//   nextStation: number[];

//   hasDetail: boolean;

//   // 圖片結構更新
//   images: StationImage[];

//   // timestamps 自動生成的欄位
//   createdAt?: string;
//   updatedAt?: string;
// }

export default function StationClient({
  station,
  railways,
  adjacentStations,
}: {
  station: Station;
  railways: RailwayData[];
  adjacentStations: Station[];
}) {
  const { title, setTitle } = useContext(TitleContext);

  useEffect(() => {
    setTitle(station.name);
    document.title = `${station.name}`;
  }, [station.name, setTitle]);
  console.log(station);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="p-4 text-white">
        <h1 className="text-3xl text-black dark:text-white font-bold mb-4">
          {station.name}
        </h1>
        <p className="text-black dark:text-white">
          狀態：
          {station.status === "active"
            ? "營運中"
            : station.status === "disused"
              ? "已廢止"
              : "規劃中"}
        </p>

        <section className="route-info bg-black-100 p-6 rounded-lg mt-8">
          <h2 className="text-3xl text-black dark:text-white font-semibold mb-4">
            車站資料
          </h2>
          {station.openDate && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>設站日期:</strong> {station.openDate.join("、")}
            </h3>
          )}
          {station.closeDate && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>廢止日期:</strong> {station.closeDate.join("、")}
            </h3>
          )}
          {station.originalName && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>舊名:</strong> {station.originalName.join("、")}
            </h3>
          )}

          {station.level && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>站等:</strong> {station.level}
            </h3>
          )}
          {station.miles && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>里程:</strong> {station.miles.join("、")}
            </h3>
          )}
          {station.height && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>海拔高度:</strong> {station.height}
            </h3>
          )}
          {station.stationCode && (
            <h3 className="text-xl text-black dark:text-white mb-4">
              <strong>代碼:</strong> {station.stationCode}
            </h3>
          )}
        </section>

        <section className="media-gallery mt-12">
          <h2 className="text-2xl text-black dark:text-white font-semibold mb-4 auto-rows-auto">
            Images and Descriptions
          </h2>
          {station.images && (
            <div className="columns-1 sm:columns-2 md:columns-3 gap-4 m-2">
              {station.images.map((img, idx) => (
                <div key={img._id} className="media-item inline-block p-4">
                  <div className="image-container overflow-hidden rounded-lg">
                    <Image
                      src={img.url}
                      alt={`${img.description}`}
                      width={800}
                      height={600}
                      layout="intrinsic"
                      className="w-full object-cover rounded-lg"
                    />
                  </div>
                  {img.description && (
                    <p className="mt-2 text-black dark:text-white text-sm sm:text-lg">
                      {img.description}
                    </p>
                  )}
                  {img.capturedAt && (
                    <p className="mt-2 text-black dark:text-white text-sm sm:text-lg">
                      {new Date(img.capturedAt).toISOString().split("T")[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="my-9">
          <h2 className="text-xl mt-6 mb-5 text-black dark:text-white font-semibold">
            所屬路線：
          </h2>
          <ul className="list-disc pl-5 flex items-center gap-2 flex-wrap">
            {station.line.map((line) => {
              // 1. 利用 find 找不到會回傳 undefined 的特性，搭配 || 做預設值
              const railwayName =
                railways.find((r) => Number(r.id) === Number(line.lineID))
                  ?.name || `ID: ${line.lineID}`;

              return (
                <Link
                  key={line.lineID}
                  href={`/railways/${line.lineID}`}
                  className="mx-4 p-4 rounded bg-green-500 text-white transition-all duration-200 ease-in-out 
                 hover:bg-green-600 hover:text-yellow-300 hover:scale-[1.05] 
                 active:bg-green-800 active:text-yellow-600 active:scale-75 active:shadow-md active:shadow-green-400"
                >
                  {railwayName}
                </Link>
              );
            })}
          </ul>
        </div>

        {station.prevStation && (
          <div className="my-4 flex items-center gap-2 flex-wrap">
            <span className="text-lg text-black dark:text-white font-semibold">
              上一站：
            </span>
            {Array.isArray(station.prevStation)
              ? station.prevStation.map((id) => {
                  const match = adjacentStations.find(
                    (s) => String(s.id) === String(id),
                  );
                  return match ? (
                    match.hasDetail ? (
                      <Link
                        key={id}
                        href={`/stations/${id}`}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:text-yellow-300 active:text-yellow-600 active:scale-90 hover:scale-[1.05] px-4 py-2 rounded-lg transition-all duration-200 ease-in-out"
                      >
                        {match.name}
                      </Link>
                    ) : (
                      <div
                        key={id}
                        className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg opacity-70 cursor-not-allowed active:bg-gray-700"
                      >
                        {match.name}
                      </div>
                    )
                  ) : (
                    <span key={id}>ID: {id}</span>
                  );
                })
              : (() => {
                  const match = adjacentStations.find(
                    (s) => String(s.id) === String(station.prevStation),
                  );
                  return match ? (
                    match.hasDetail ? (
                      <Link
                        href={`/stations/${station.prevStation}`}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:text-yellow-300 active:text-yellow-600 active:scale-90 hover:scale-[1.05] px-4 py-2 rounded-lg transition-all duration-200 ease-in-out"
                      >
                        {match.name}
                      </Link>
                    ) : (
                      <div className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg opacity-70 cursor-not-allowed active:bg-gray-700">
                        {match.name}
                      </div>
                    )
                  ) : (
                    <span>ID: {station.prevStation}</span>
                  );
                })()}
          </div>
        )}

        {station.nextStation && (
          <div className="my-4 flex items-center gap-2 flex-wrap">
            <span className="text-lg text-black dark:text-white font-semibold">
              下一站：
            </span>
            {Array.isArray(station.nextStation)
              ? station.nextStation.map((id) => {
                  const match = adjacentStations.find(
                    (s) => String(s.id) === String(id),
                  );
                  return match ? (
                    match.hasDetail ? (
                      <Link
                        key={id}
                        href={`/stations/${id}`}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:text-yellow-300 active:text-yellow-600 active:scale-90 hover:scale-[1.05] px-4 py-2 rounded-lg transition-all duration-200 ease-in-out"
                      >
                        {match.name}
                      </Link>
                    ) : (
                      <div
                        key={id}
                        className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg opacity-70 cursor-not-allowed active:bg-gray-700"
                      >
                        {match.name}
                      </div>
                    )
                  ) : (
                    <span key={id}>ID: {id}</span>
                  );
                })
              : (() => {
                  const match = adjacentStations.find(
                    (s) => String(s.id) === String(station.nextStation),
                  );
                  return match ? (
                    match.hasDetail ? (
                      <Link
                        href={`/stations/${station.nextStation}`}
                        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white hover:text-yellow-300 active:text-yellow-600 active:scale-90 hover:scale-[1.05] px-4 py-2 rounded-lg transition-all duration-200 ease-in-out"
                      >
                        {match.name}
                      </Link>
                    ) : (
                      <div className="bg-gray-600 text-gray-200 px-4 py-2 rounded-lg opacity-70 cursor-not-allowed active:bg-gray-700">
                        {match.name}
                      </div>
                    )
                  ) : (
                    <span>ID: {station.nextStation}</span>
                  );
                })()}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
