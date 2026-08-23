const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb://ciuyi_022:aaron1120@cluster1-shard-00-00.931rl.mongodb.net:27017,cluster1-shard-00-01.931rl.mongodb.net:27017,cluster1-shard-00-02.931rl.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fhip-shard-0&authSource=admin&appName=Cluster1";

const RAILWAY_DB_NAME = "railway_db";
const COLLECTION_NAME = "railways"; // 請確認你的 Collection 名稱

async function updateRailwayDistrict() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("連線至 MongoDB 成功！");

    const railwayDb = client.db(RAILWAY_DB_NAME);
    const railwaysCollection = railwayDb.collection(COLLECTION_NAME);

    const result = await railwaysCollection.updateMany(
      { district: { $exists: true, $type: "array" } },
      [
        {
          $set: {
            district: {
              $map: {
                input: "$district",
                as: "item",
                in: {
                  $mergeObjects: [
                    "$$item",
                    {
                      // 若原本沒有值，預設為數字 0 (也可以改為 -1 或其他預設數字)
                      prevArea: { $ifNull: ["$$item.prevArea", null] },
                      nextArea: { $ifNull: ["$$item.nextArea", null] },
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
      `✅ 鐵路資料庫更新完成！共修改了 ${result.modifiedCount} 筆資料。`,
    );
  } catch (error) {
    console.error("❌ 更新過程中發生錯誤：", error);
  } finally {
    await client.close();
    console.log("MongoDB 連線已關閉。");
  }
}

updateRailwayDistrict();
