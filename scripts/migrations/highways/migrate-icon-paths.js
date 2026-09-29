const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb://ciuyi_022:aaron1120@cluster1-shard-00-00.931rl.mongodb.net:27017,cluster1-shard-00-01.931rl.mongodb.net:27017,cluster1-shard-00-02.931rl.mongodb.net:27017/?ssl=true&replicaSet=atlas-12fhip-shard-0&authSource=admin&appName=Cluster1";

const HIGHWAY_DB_NAME = "highway_db";
const COLLECTION_NAME = "highways";

async function updateHighwayIconPath() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("連線至 MongoDB 成功！");

    const highwayDb = client.db(HIGHWAY_DB_NAME);
    const highwaysCollection = highwayDb.collection(COLLECTION_NAME);

    // 💡 拼接成新結構：/highway_mark/<id>/<id>.svg
    const result = await highwaysCollection.updateMany({}, [
      {
        $set: {
          highwayIcon: {
            $concat: [
              "/highway_mark/",
              { $toString: "$id" },
              "/",
              { $toString: "$id" },
              ".svg",
            ],
          },
        },
      },
    ]);

    console.log(
      `✅ 圖示路徑更新完成！共修改了 ${result.modifiedCount} 筆資料。`,
    );
  } catch (error) {
    console.error("❌ 更新過程中發生錯誤：", error);
  } finally {
    await client.close();
    console.log("MongoDB 連線已關閉。");
  }
}

updateHighwayIconPath();
