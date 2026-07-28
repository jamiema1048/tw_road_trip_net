import mongoose, { Connection, ConnectOptions } from "mongoose";

const RAILWAY_URI = process.env.MONGODB_RAILWAY_URI!;
const STATION_URI = process.env.MONGODB_STATION_URI!;

if (!RAILWAY_URI || !STATION_URI) {
  throw new Error("請定義 MONGODB_RAILWAY_URI 與 MONGODB_STATION_URI 環境變數");
}

// 1. 定義快取物件的介面
interface MongooseCache {
  railway: { conn: Connection | null; promise: Promise<Connection> | null };
  station: { conn: Connection | null; promise: Promise<Connection> | null };
}

// 2. 擴充全域物件型別，消除 (global as any)
declare global {
  // eslint-disable-next-line no-var
  var mongoose_multi: MongooseCache | undefined;
}

// 3. 初始化全域快取 (使用字面量確保安全)

export async function getConnections() {
  let cached = global.mongoose_multi;

  if (!cached) {
    cached = global.mongoose_multi = {
      railway: { conn: null, promise: null },
      station: { conn: null, promise: null },
    };
  }

  const options: ConnectOptions = {
    bufferCommands: false,
    // 在 Serverless 環境中，建議限制連線池大小
    maxPoolSize: 10,
  };

  // --- 處理 Railway 連線 ---
  if (!cached.railway.conn) {
    if (!cached.railway.promise) {
      cached.railway.promise = mongoose
        .createConnection(RAILWAY_URI, options)
        .asPromise();
    }
    cached.railway.conn = await cached.railway.promise;
  }

  // --- 處理 Station 連線 ---
  if (!cached.station.conn) {
    if (!cached.station.promise) {
      cached.station.promise = mongoose
        .createConnection(STATION_URI, options)
        .asPromise();
    }
    cached.station.conn = await cached.station.promise;
  }

  return {
    railwayConn: cached.railway.conn,
    stationConn: cached.station.conn,
  };
}
