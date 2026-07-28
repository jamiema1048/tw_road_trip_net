import React, { useMemo } from "react";
import Link from "next/link";
// import Loading from "@/src/app/(pages)/stations/[stationId]/loading";
import { Station, RailwayData } from "@/src/types/railway";

// // 修正後的介面定義，對齊你的 MongoDB Schema
// interface StationLineDistrictInfo {
//   id: number;
//   order: number;
// }

// interface StationLineInfo {
//   lineID: number;
//   lineDistrict: StationLineDistrictInfo[]; // 現在是一個物件
// }

// interface Station {
//   id: number;
//   name: string;
//   status: "active" | "disused" | "plan";
//   hasDetail: boolean;
//   line: StationLineInfo[];
//   _order?: number; // 暫時存放排序用
// }

// ... 其餘 Interface 保持不變

interface DistrictGroupedStationsProps {
  lineID: number; // 補上這個
  lineData: RailwayData; // 補上這個
  stations: Station[]; // 補上這個
  loading: boolean; // 補上這個
  setLoading: React.Dispatch<React.SetStateAction<boolean>>; // 補上這個
}

interface OrderedStation extends Station {
  _order: number;
}

const DistrictGroupedStations: React.FC<DistrictGroupedStationsProps> = ({
  lineID,
  lineData,
  stations,
  loading,
  setLoading,
}) => {
  // 使用 useMemo 處理複雜的分組與排序邏輯
  const groupedStations = useMemo(() => {
    const map: Record<number, OrderedStation[]> = {};

    // 1. 初始化區塊
    lineData.district.forEach((d) => {
      map[d.districtID] = [];
    });

    // 2. 分發車站
    stations.forEach((station) => {
      const stationLines = Array.isArray(station.line)
        ? station.line
        : [station.line];

      stationLines.forEach((l) => {
        // 確保 lineID 匹配 (轉換成 Number 避免字串比對失敗)
        if (Number(l.lineID) === Number(lineID)) {
          const districts = Array.isArray(l.lineDistrict)
            ? l.lineDistrict
            : l.lineDistrict
              ? [l.lineDistrict]
              : [];
          districts.forEach((dInfo) => {
            // 支援兩種格式：純數字 ID 或 物件 { id, order }
            const dID = typeof dInfo === "number" ? dInfo : dInfo?.id;
            const order =
              typeof dInfo === "number" ? Infinity : (dInfo?.order ?? Infinity);

            // 檢查該區 ID 是否屬於目前 Railway 頁面定義的區間
            if (map[dID]) {
              // 💡 為了避免同一個站在同一區重複出現（雖然機率低），可以加檢查
              // 但在這裡直接 push 是正確的，因為虎尾站可能在 District 1 出現，也在 District 2 出現
              map[dID].push({ ...station, _order: order });
            }
          });
        }
      });
    });

    // 3. 各區排序
    Object.keys(map).forEach((id) => {
      map[Number(id)].sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
    });

    return map;
  }, [lineID, lineData, stations]);

  // if (loading) return <Loading />;

  return (
    <div className="space-y-8">
      {lineData.district.map((district) => (
        <div
          key={district.districtID}
          className="border-l-2 border-gray-700 pl-4"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            {district.districtName}
          </h2>

          {district.prevArea && (
            <div className="mb-2">
              <Link
                href={`/railways/${district.prevArea}`}
                className="text-blue-400 text-sm text-black dark:text-white hover:underline"
              >
                ↑ 上接區段
              </Link>
            </div>
          )}

          <ul className="space-y-2">
            {groupedStations[district.districtID]?.length > 0 ? (
              groupedStations[district.districtID].map((station) => (
                <li key={station.id} className="group">
                  <div
                    className={`text-xl transition-all ${
                      station.status === "active"
                        ? "text-black dark:text-white"
                        : station.status === "disused"
                          ? "text-gray-500 line-through"
                          : "text-blue-400 italic"
                    }`}
                  >
                    {station.hasDetail ? (
                      <Link
                        href={`/stations/${station.id}`}
                        className="hover:text-green-400 hover:pl-2 transition-all block"
                      >
                        {station.name}
                      </Link>
                    ) : (
                      <span className="opacity-70">
                        {station.name} (無細節)
                      </span>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-600 italic text-sm">
                （此區段暫無車站資料）
              </li>
            )}
          </ul>

          {district.nextArea && (
            <div className="mt-4">
              <Link
                href={`/railways/${district.nextArea}`}
                className="text-blue-400 text-sm hover:underline"
              >
                ↓ 下接區段
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DistrictGroupedStations;
