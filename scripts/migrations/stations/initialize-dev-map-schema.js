const { MongoClient } = require("mongodb");

const STATION_DB_NAME = "station_db_dev";
const COLLECTION_NAME = "stations";
const STATION_URI = process.env.MONGODB_STATION_URI;

function getDatabaseName(uri) {
  const withoutQuery = uri.split("?", 1)[0];
  return withoutQuery.slice(withoutQuery.lastIndexOf("/") + 1);
}

async function initializeStationDevMapSchema() {
  if (!STATION_URI) {
    throw new Error("請在 .env.local 定義 MONGODB_STATION_URI");
  }

  if (getDatabaseName(STATION_URI) !== STATION_DB_NAME) {
    throw new Error(
      `拒絕執行：MONGODB_STATION_URI 必須指向 ${STATION_DB_NAME}。`,
    );
  }

  const client = new MongoClient(STATION_URI);

  try {
    await client.connect();

    const collection = client.db(STATION_DB_NAME).collection(COLLECTION_NAME);
    const result = await collection.updateMany(
      {},
      [
        {
          $set: {
            location: {
              $ifNull: [
                "$location",
                {
                  type: "Point",
                  coordinates: [null, null],
                },
              ],
            },
            historySummary: { $ifNull: ["$historySummary", ""] },
            chronology: {
              $ifNull: [
                "$chronology",
                [
                  {
                    time: "",
                    event: "",
                  },
                ],
              ],
            },
          },
        },
      ],
    );

    console.log(
      `完成 ${STATION_DB_NAME}.${COLLECTION_NAME} 結構初始化：` +
        `符合條件 ${result.matchedCount} 筆，實際更新 ${result.modifiedCount} 筆。`,
    );
  } finally {
    await client.close();
  }
}

initializeStationDevMapSchema().catch((error) => {
  console.error("車站開發資料庫結構初始化失敗：", error.message);
  process.exitCode = 1;
});
