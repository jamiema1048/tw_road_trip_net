import { notFound } from "next/navigation";
import Link from "next/link";

import StationJsonEditor from "@/src/features/station-admin/components/StationJsonEditor";
import { requireDevelopmentAdmin } from "@/src/features/station-admin/server/admin-auth";
import {
  getStationForAdmin,
  getStationsByNameForAdmin,
} from "@/src/features/station-admin/server/station-admin.actions";
import styles from "./page.module.css";

type SearchParams = Promise<{ id?: string; name?: string }>;

function createStationTemplate(id: number) {
  return {
    id,
    name: "",
    status: "active",
    location: { type: "Point", coordinates: [null, null] },
    historySummary: "",
    chronology: [{ time: "", event: "" }],
    openDate: [],
    closeDate: [],
    originalName: [],
    level: "",
    miles: [],
    height: "",
    stationCode: "",
    line: [],
    prevStation: [],
    nextStation: [],
    hasDetail: true,
    images: [],
  };
}

export default async function StationAdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireDevelopmentAdmin();

  const { id: rawId, name: rawName } = await searchParams;
  const id = rawId ? Number(rawId) : null;
  const hasValidId = id !== null && Number.isSafeInteger(id) && id > 0;
  const name = rawName?.trim() || "";

  if (rawId && !hasValidId) {
    notFound();
  }

  const station = hasValidId ? await getStationForAdmin(id) : null;
  const matchedStations = name ? await getStationsByNameForAdmin(name) : [];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>DEVELOPMENT ONLY</p>
        <h1>車站資料管理</h1>
        <p>僅會讀寫 station_db_dev，正式環境不提供此頁面。</p>
      </header>

      <div className={styles.lookupForms}>
        <form className={styles.lookupForm} action="/admin/stations" method="get">
          <label htmlFor="station-id">車站 ID</label>
          <input
            id="station-id"
            name="id"
            type="number"
            min="1"
            step="1"
            defaultValue={hasValidId ? id : ""}
            required
          />
          <button type="submit">查詢／建立</button>
        </form>

        <form className={styles.lookupForm} action="/admin/stations" method="get">
          <label htmlFor="station-name">車站名稱</label>
          <input
            id="station-name"
            name="name"
            type="search"
            defaultValue={name}
            placeholder="可輸入部分名稱"
            required
          />
          <button type="submit">名稱搜尋</button>
        </form>
      </div>

      {name && (
        <section className={styles.searchResults} aria-live="polite">
          <h2>「{name}」的搜尋結果</h2>
          {matchedStations.length > 0 ? (
            <ul>
              {matchedStations.map((matchedStation) => (
                <li key={matchedStation.id}>
                  <Link href={`/admin/stations?id=${matchedStation.id}`}>
                    {matchedStation.name}（ID：{matchedStation.id}）
                  </Link>
                  <span>{matchedStation.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>找不到相符車站。</p>
          )}
        </section>
      )}

      {hasValidId && (
        <StationJsonEditor
          key={id}
          initialStation={station || createStationTemplate(id)}
          isNew={!station}
        />
      )}
    </main>
  );
}
