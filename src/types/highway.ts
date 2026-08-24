export interface HighwayImageClient {
  _id?: string; // 或 string，視需求而定
  url: string;
  description?: string; // 建議設為選填
  capturedAt?: string | null; // 💡 RSC 傳遞過來的是 ISO 字串，非 Date 物件
}

export interface Highway {
  _id: string;
  id: number;
  name: string;
  status: "active" | "disused" | "unlisted";
  highwayIcon: string;
  routeName: string;
  length: number;
  currentLength: number;
  start: string;
  currentStart: string;
  end: string;
  currentEnd: string;
  otherName: string[];
  highest: number;
  highestPlace: string;
  remark: string;
  images: HighwayImageClient[]; // 💡 使用支援字串日期的 Client 型別
  currentImageIndex?: number;
}
