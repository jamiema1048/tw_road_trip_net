// src/app/railways/LinePageServer.tsx
import LinePageClient from "@/src/app/(client)/(railways)/LinePageClient";
import { getConnections } from "@/src/app/_lib/mongodb_connections";
import { RailwaySchema } from "@/src/models/Railway";
import { Types } from "mongoose";

interface BaseDistrict {
  districtID: number;
  districtName: string;
  prevArea?: number;
  nextArea?: number;
}

interface MongoDistrict extends BaseDistrict {
  _id?: Types.ObjectId;
}

interface MongoRailway {
  _id: Types.ObjectId;
  id: number;
  name: string;
  co: number;
  systemName?: string;
  district: MongoDistrict[];
}

export default async function LinePageServer() {
  try {
    // 1. 取得 railway 專屬連線
    const { railwayConn } = await getConnections();

    // 2. 建立/取得 Model (確保連線與 Schema 綁定)
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    // 3. 抓取所有路線資料，並強型別斷言為 MongoRailway 陣列
    const allRailways = (await RailwayModel.find({}).lean()) as MongoRailway[];

    if (!allRailways || allRailways.length === 0) {
      return <div>暫無路線資料</div>;
    }

    // 4. 資料標準化 (將所有的 ObjectId 轉成字串)
    // 透過確切的介面定義，這裡不再需要 any
    const serializedLines = allRailways.map((line) => ({
      ...line,
      _id: line._id.toString(),
      district: (line.district || []).map((d) => ({
        ...d,
        _id: d._id?.toString(),
      })),
    }));

    // 5. 將處理好的陣列傳給 Client 端
    return <LinePageClient lines={serializedLines} />;
  } catch (err) {
    console.error("MongoDB Fetch Error:", err);
    return <div>資料載入失敗</div>;
  }
}
