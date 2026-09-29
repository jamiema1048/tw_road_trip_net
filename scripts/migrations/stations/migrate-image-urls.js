const { MongoClient } = require("mongodb");

// 1. 請填入你的 MongoDB 連線字串與資料庫名稱
const MONGODB_URI =
  "mongodb://ciuyi_022:aaron1120@cluster1-shard-00-00.931rl.mongodb.net:27017,cluster1-shard-00-01.931rl.mongodb.net:27017,cluster1-shard-00-02.931rl.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fhip-shard-0&authSource=admin&appName=Cluster1";
const STATION_DB_NAME = "station_db";
const HIGHWAY_DB_NAME = "highway_db";

// 2. 填入你在 AWS S3 建立的 Bucket 名稱 (例: my-railway-archive-photos)
const S3_BUCKET_NAME = "my-road-trip-archive-photos";
const S3_DOMAIN = `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;

async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("連線至 MongoDB 成功！");
    const stationDb = client.db(STATION_DB_NAME);
    const highwayDb = client.db(HIGHWAY_DB_NAME);

    // ==========================================
    // A. 更新「車站 (Stations)」Collection
    // 舊: /image/005/12345678.jpg
    // 新: https://bucket.s3.amazonaws.com/image/station/005/12345678.jpg
    // ==========================================
    const oldHost = "my-road-trip-archive-photos.s3.amazonaws.com/";
    const newHost = "my-road-trip-archive-photos.s3.ap-east-2.amazonaws.com/";

    const stationsCollection = stationDb.collection("stations"); // 請確認你的 Collection 名稱
    const stationResult = await stationsCollection.updateMany(
      {
        "images.url": {
          $regex: "my-road-trip-archive-photos\\.s3\\.amazonaws\\.com/",
        },
      },
      [
        {
          $set: {
            images: {
              $map: {
                input: "$images",
                as: "img",
                in: {
                  $mergeObjects: [
                    "$$img",
                    {
                      url: {
                        $replaceOne: {
                          input: "$$img.url",
                          find: oldHost,
                          replacement: newHost,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    );
    console.log(
      `✅ 車站資料庫更新完成！共修改了 ${stationResult.modifiedCount} 筆資料。`,
    );

    // ==========================================
    // B. 更新「公路 (Highways)」Collection
    // 舊: /image/42000/12345678.jpg
    // 新: https://bucket.s3.amazonaws.com/image/railways/42000/12345678.jpg
    // ==========================================
    const highwaysCollection = highwayDb.collection("highways"); // 請確認你的 Collection 名稱
    const highwayResult = await highwaysCollection.updateMany(
      {
        "images.url": {
          $regex: "my-road-trip-archive-photos\\.s3\\.amazonaws\\.com/",
        },
      },
      [
        {
          $set: {
            images: {
              $map: {
                input: "$images",
                as: "img",
                in: {
                  $mergeObjects: [
                    "$$img",
                    {
                      url: {
                        $replaceOne: {
                          input: "$$img.url",
                          find: oldHost,
                          replacement: newHost,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
    );
    console.log(
      `✅ 公路資料庫更新完成！共修改了 ${highwayResult.modifiedCount} 筆資料。`,
    );
  } catch (error) {
    console.error("更新過程中發生錯誤：", error);
  } finally {
    await client.close();
    console.log("MongoDB 連線已關閉。");
  }
}

main();
