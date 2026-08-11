import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { HighwaySchema } from "@/src/models/Highway";
import { RailwaySchema } from "@/src/models/Railway";
import { StationSchema } from "@/src/models/Station";

export interface SearchResultItem {
  _id: string;
  id: number;
  title: string;
  subtitle: string | string[];
  url: string;
  type: "highway" | "railway" | "station";
}

const companyMap: Record<number, string> = {
  1: "台鐵",
  2: "林業鐵路",
  3: "糖業鐵路",
  4: "其他鐵路",
};

export async function getGlobalSearchResults(
  query: string,
): Promise<SearchResultItem[]> {
  const q = query.trim();
  if (!q) return [];

  try {
    const { highwayConn, stationConn, railwayConn } = await getConnections();

    const HighwayModel =
      highwayConn.models.Highway ||
      highwayConn.model("Highway", HighwaySchema, "highways");

    const RailwayModel =
      railwayConn.models.Railway ||
      railwayConn.model("Railway", RailwaySchema, "railways");

    const StationModel =
      stationConn.models.Station ||
      stationConn.model("Station", StationSchema, "stations");

    const searchRegex = new RegExp(q, "i");

    // 平行查詢公路與鐵路資料庫
    const [highways, matchedRailways, stations] = await Promise.all([
      HighwayModel.find({
        $or: [
          { name: searchRegex },
          { routeName: searchRegex },
          { otherName: searchRegex },
        ],
      }).lean(),

      RailwayModel.find({
        $or: [
          { name: searchRegex },
          { lineName: searchRegex },
          { otherName: searchRegex },
        ],
      }).lean(),

      StationModel.find({
        $or: [
          { name: searchRegex },
          { lineName: searchRegex },
          { otherName: searchRegex },
        ],
      }).lean(),
    ]);

    // 2. 收集搜尋到的車站中所有的 lineID
    const stationLineIDs = stations.flatMap((station: any) => {
      const lines = Array.isArray(station.line)
        ? station.line
        : station.line
          ? [station.line]
          : [];
      return lines.map((l: any) => l.lineID).filter(Boolean);
    });

    // 3. 補抓「車站有用到，但關鍵字沒搜尋到」的鐵路路線資料，確保 railwayMap 永遠查得到名稱
    const extraRailways =
      stationLineIDs.length > 0
        ? await RailwayModel.find({ id: { $in: stationLineIDs } }).lean()
        : [];

    // 4. 合併關鍵字查到的鐵路與補抓的鐵路（使用 Map 去重）
    const allRailwaysMap = new Map();
    [...matchedRailways, ...extraRailways].forEach((item: any) => {
      allRailwaysMap.set(item.id.toString(), item);
    });

    // 5. 最終的 railways（僅包含關鍵字搜尋出來的鐵路結果，避免把沒中關鍵字的鐵路混進搜尋結果頁面）
    const railways = matchedRailways;

    // 6. 用於建立 ID -> 名稱映射的字典（包含補抓的鐵路資料）
    const railwayMap = new Map<number | string, string>(
      Array.from(allRailwaysMap.values()).map((item: any) => [
        item.id,
        item.name,
      ]),
    );

    // 資料結構統一化
    const highwayResults: SearchResultItem[] = highways.map((item: any) => ({
      _id: item._id.toString(),
      id: item.id,
      title: item.name,
      subtitle: item.routeName || "公路",
      url: `/highways/${item.id}`,
      type: "highway",
    }));

    const railwayResults: SearchResultItem[] = railways.map((item: any) => ({
      _id: item._id.toString(),
      id: item.id,
      title: item.name,
      subtitle: companyMap[Number(item.co)] || "鐵路",
      url: `/railways/${item.id}`,
      type: "railway",
    }));

    const stationResults: SearchResultItem[] = stations.map((item: any) => {
      // 將 item.line 或 item.lines 統一轉為陣列 (相容單一物件或陣列的情況)
      const linesArray = Array.isArray(item.line)
        ? item.line
        : item.line
          ? [item.line]
          : [];

      // 將 lineID 轉換為對應的路線名稱（若找不到則顯示原本的 lineID 或 "車站"）
      const subtitles = linesArray.map(
        (lineObj: any) =>
          railwayMap.get(lineObj.lineID) || lineObj.lineID || "車站",
      );

      return {
        _id: item._id.toString(),
        id: item.id,
        title: item.name,
        // 若沒有任何路線資料，給予預設值 ["車站"]
        subtitle: subtitles.length > 0 ? subtitles : ["車站"],
        url: `/stations/${item.id}`,
        type: "station",
      };
    });

    return [...highwayResults, ...railwayResults, ...stationResults];
  } catch (error) {
    console.error("MongoDB 查詢失敗:", error);
    return [];
  }
}
