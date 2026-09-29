import { Types } from "mongoose";

// --- A. 基礎屬性 (Shared) ---
export interface BaseDistrict {
  districtID: number;
  districtName: string;
  prevArea?: number;
  nextArea?: number;
}

// --- B. 車站專用 (Station Database) ---
// 對應你截圖中 Station 內的 lineDistrict 結構
export interface StationLineDistrict {
  id: number; // 資料庫中的 id
  order: number; // 資料庫中的 order
  _id?: string; // 序列化後的字串
}

export interface StationLine {
  lineID: number;
  lineDistrict: StationLineDistrict[];
  _id?: string;
}

export interface Station {
  _id: string; // 序列化後傳給 Client 必須是 string
  id: number;
  name: string;
  status: "active" | "disused" | "plan";
  openDate: string[];
  closeDate: string[];
  originalName: string[];
  level: string;
  miles: string[];
  height: string;
  stationCode: string;
  line: StationLine[];
  prevStation: number[];
  nextStation: number[];
  images: {
    _id: string;
    url: string;
    description: string;
    capturedAt: Date;
  }[];
  hasDetail: boolean;
}

// --- C. 路線專用 (Railway Database) ---
export interface RailwayData {
  _id: string;
  id: number;
  name: string;
  co: number;
  systemName?: string;
  district: (BaseDistrict & { _id?: string })[];
}

// --- D. 伺服器端專用的原始 MongoDB 型別 (給 .lean() 使用) ---
export interface MongoStation extends Omit<Station, "_id" | "line" | "images"> {
  _id: Types.ObjectId;
  line: {
    lineID: number;
    lineDistrict: number; // 資料庫可能很亂
    _id?: Types.ObjectId;
  }[];
  images?: {
    _id?: Types.ObjectId;
    url?: string;
    description?: string;
    capturedAt?: Date | string; // 資料庫可能是 Date
  }[];
}

// export interface MongoRailway extends Omit<RailwayData, "_id" | "district"> {
//   _id: Types.ObjectId;
//   district: (BaseDistrict & { _id?: Types.ObjectId })[];
// }
