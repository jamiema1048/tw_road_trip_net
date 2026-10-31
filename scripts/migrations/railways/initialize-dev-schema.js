const { MongoClient } = require("mongodb");

const RAILWAY_DB_NAME = "railway_db_dev";
const COLLECTION_NAME = "railways";
const RAILWAY_URI = process.env.MONGODB_RAILWAY_URI;

function getDatabaseName(uri) {
  const withoutQuery = uri.split("?", 1)[0];
  return withoutQuery.slice(withoutQuery.lastIndexOf("/") + 1);
}

async function initializeRailwayDevSchema() {
  if (!RAILWAY_URI) {
    throw new Error("請在 .env.local 定義 MONGODB_RAILWAY_URI");
  }

  if (getDatabaseName(RAILWAY_URI) !== RAILWAY_DB_NAME) {
    throw new Error(
      `拒絕執行：MONGODB_RAILWAY_URI 必須指向 ${RAILWAY_DB_NAME}。`,
    );
  }

  const client = new MongoClient(RAILWAY_URI);

  try {
    await client.connect();

    const collection = client.db(RAILWAY_DB_NAME).collection(COLLECTION_NAME);
    const result = await collection.updateMany(
      {},
      [
        {
          $set: {
            region: { $ifNull: ["$region", ""] },
            historySummary: { $ifNull: ["$historySummary", ""] },
            chronology: { $ifNull: ["$chronology", []] },
            district: {
              $map: {
                input: "$district",
                as: "district",
                in: {
                  $mergeObjects: [
                    "$$district",
                    {
                      geometry: {
                        $ifNull: [
                          "$$district.geometry",
                          {
                            type: "LineString",
                            coordinates: [],
                          },
                        ],
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
      `完成 ${RAILWAY_DB_NAME}.${COLLECTION_NAME} 結構初始化：` +
        `符合條件 ${result.matchedCount} 筆，實際更新 ${result.modifiedCount} 筆。`,
    );
  } finally {
    await client.close();
  }
}

initializeRailwayDevSchema().catch((error) => {
  console.error("鐵路開發資料庫結構初始化失敗：", error.message);
  process.exitCode = 1;
});
