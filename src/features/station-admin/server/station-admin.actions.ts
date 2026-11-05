"use server";

import { revalidatePath } from "next/cache";

import { getConnections } from "@/src/_lib/db/connections";
import { StationSchema } from "@/src/features/stations/server";
import { requireDevelopmentAdmin } from "./admin-auth";

export type StationAdminActionState = {
  message: string;
  success: boolean;
};

const initialActionState: StationAdminActionState = {
  message: "",
  success: false,
};

const DEVELOPMENT_STATION_DATABASE = "station_db_dev";

function getDatabaseName(uri: string) {
  const withoutQuery = uri.split("?", 1)[0];
  return withoutQuery.slice(withoutQuery.lastIndexOf("/") + 1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getStationModel() {
  const stationUri = process.env.MONGODB_STATION_URI;
  if (!stationUri || getDatabaseName(stationUri) !== DEVELOPMENT_STATION_DATABASE) {
    throw new Error(
      `管理後台僅允許連線至 ${DEVELOPMENT_STATION_DATABASE}。`,
    );
  }

  const { stationConn } = await getConnections();
  return (
    stationConn.models.Station ||
    stationConn.model("Station", StationSchema, "stations")
  );
}

export async function getStationForAdmin(id: number) {
  await requireDevelopmentAdmin();

  const StationModel = await getStationModel();
  const station = await StationModel.findOne({ id }).lean();

  return station ? JSON.parse(JSON.stringify(station)) : null;
}

function escapeRegularExpression(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getStationsByNameForAdmin(name: string) {
  await requireDevelopmentAdmin();

  const normalizedName = name.trim();
  if (!normalizedName) return [];

  const StationModel = await getStationModel();
  const stations = await StationModel.find({
    name: { $regex: escapeRegularExpression(normalizedName), $options: "i" },
  })
    .select("id name status -_id")
    .sort({ id: 1 })
    .limit(20)
    .lean();

  return JSON.parse(JSON.stringify(stations)) as Array<{
    id: number;
    name: string;
    status: string;
  }>;
}

export async function saveStation(
  _previousState: StationAdminActionState = initialActionState,
  formData: FormData,
): Promise<StationAdminActionState> {
  void _previousState;
  await requireDevelopmentAdmin();

  const rawJson = formData.get("stationJson");
  if (typeof rawJson !== "string") {
    return { success: false, message: "找不到車站 JSON 資料。" };
  }

  let station: Record<string, unknown>;
  try {
    const parsed = JSON.parse(rawJson);
    if (!isRecord(parsed)) {
      return { success: false, message: "車站資料必須是 JSON 物件。" };
    }
    station = parsed;
  } catch {
    return { success: false, message: "JSON 格式不正確，請修正後再儲存。" };
  }

  const id = station.id;
  if (typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0) {
    return { success: false, message: "id 必須是大於 0 的整數。" };
  }

  delete station._id;
  delete station.__v;
  delete station.createdAt;
  delete station.updatedAt;

  try {
    const StationModel = await getStationModel();
    const result = await StationModel.replaceOne(
      { id },
      station,
      { upsert: true, runValidators: true },
    );

    revalidatePath(`/stations/${id}`);
    revalidatePath("/stations");
    revalidatePath("/railways");

    return {
      success: true,
      message:
        result.upsertedCount > 0
          ? `已新增車站 id ${id}。`
          : `已更新車站 id ${id}。`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知資料庫錯誤。";
    return { success: false, message: `儲存失敗：${message}` };
  }
}
