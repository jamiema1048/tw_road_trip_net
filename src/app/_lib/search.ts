import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { HighwaySchema } from "@/src/models/Highway";
import { RailwaySchema } from "@/src/models/Railway";
import { StationSchema } from "@/src/models/Station";

export interface SearchResultItem {
  _id: string;
  id: number;
  title: string;
  subtitle: string;
  url: string;
  type: "highway" | "railway" | "station";
}

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
    const [highways, railways, stations] = await Promise.all([
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
      subtitle: item.lineName || "鐵路",
      url: `/railways/${item.id}`,
      type: "railway",
    }));

    const stationResults: SearchResultItem[] = stations.map((item: any) => ({
      _id: item._id.toString(),
      id: item.id,
      title: item.name,
      subtitle: item.lineName || "車站",
      url: `/stations/${item.id}`,
      type: "station",
    }));

    return [...highwayResults, ...railwayResults, ...stationResults];
  } catch (error) {
    console.error("MongoDB 查詢失敗:", error);
    return [];
  }
}
