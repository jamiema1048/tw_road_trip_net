"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem"; // 匯入 LazyItem
import { Station, RailwayData } from "@/src/types/railway";
import styles from "@/src/styles/components/railway/DistrictGroupedStations.module.css";

interface DistrictGroupedStationsProps {
  lineID: number;
  lineData: RailwayData;
  stations: Station[];
  railwayNameMap?: Record<number, string>;
}

interface OrderedStation extends Station {
  _order: number;
}

// 輔助函式：將車站依區劃進行分組與排序
function getGroupedStations(
  lineID: number,
  lineData: RailwayData,
  stations: Station[],
) {
  const map: Record<number, OrderedStation[]> = {};

  // 1. 初始化區塊
  lineData.district.forEach((d) => {
    map[d.districtID] = [];
  });

  // 2. 分發車站
  stations.forEach((station) => {
    const stationLines = Array.isArray(station.line)
      ? station.line
      : [station.line];

    stationLines.forEach((l) => {
      if (Number(l.lineID) === Number(lineID)) {
        const districts = Array.isArray(l.lineDistrict)
          ? l.lineDistrict
          : l.lineDistrict
            ? [l.lineDistrict]
            : [];

        districts.forEach((dInfo) => {
          const dID = typeof dInfo === "number" ? dInfo : dInfo?.id;
          const order =
            typeof dInfo === "number" ? Infinity : (dInfo?.order ?? Infinity);

          if (map[dID]) {
            map[dID].push({ ...station, _order: order });
          }
        });
      }
    });
  });

  // 3. 各區排序
  Object.keys(map).forEach((id) => {
    map[Number(id)].sort((a, b) => (a._order ?? 0) - (b._order ?? 0));
  });

  return map;
}

// 狀態對應的 CSS Module Class Name
const STATUS_CLASS_MAP: Record<Station["status"], string> = {
  active: styles.statusActive,
  disused: styles.statusDisused,
  plan: styles.statusPlan,
};

export default function DistrictGroupedStations({
  lineID,
  lineData,
  stations,
  railwayNameMap,
}: DistrictGroupedStationsProps) {
  // 使用 useMemo 計算，避免重複排序
  const groupedStations = useMemo(
    () => getGroupedStations(lineID, lineData, stations),
    [lineID, lineData, stations],
  );

  return (
    <div className={styles.groupedStations}>
      {lineData.district.map((district) => (
        <LazyItem key={district.districtID}>
          <div className={styles.lineAreaContentContainer}>
            <div className={styles.lineAreaTitle}>
              <div className={styles.lineAreaTitleDot}>
                <svg
                  className={styles.lineAreaTitleDotIcon}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  fill="none"
                >
                  <path
                    d="M14.4 23.9999C14.4 26.546 15.4115 28.9878 17.2118 30.7881C19.0121 32.5885 21.4539 33.5999 24 33.5999C26.5461 33.5999 28.9879 32.5885 30.7883 30.7881C32.5886 28.9878 33.6 26.546 33.6 23.9999C33.6 21.4538 32.5886 19.012 30.7883 17.2117C28.9879 15.4113 26.5461 14.3999 24 14.3999C21.4539 14.3999 19.0121 15.4113 17.2118 17.2117C15.4115 19.012 14.4 21.4538 14.4 23.9999Z"
                    fill="#008E9B"
                  />
                </svg>
              </div>
              <h2 className={styles.lineAreaTitleText}>
                {district.districtName}
              </h2>
            </div>

            <div className={styles.lineAreaContentBlock}>
              <div className={styles.lineAreaDecoration} />
              <div className={styles.lineAreaContent}>
                {district.prevArea && (
                  <Link
                    href={`/railways/${district.prevArea}`}
                    className={styles.adjacentAreaLink}
                  >
                    ↑ 上接{" "}
                    {railwayNameMap?.[district.prevArea] ||
                      `路線 ${district.prevArea}`}
                  </Link>
                )}

                <ul className={styles.stationList}>
                  {groupedStations[district.districtID]?.length > 0 ? (
                    groupedStations[district.districtID].map((station) => {
                      const statusClass =
                        STATUS_CLASS_MAP[station.status] ||
                        styles.statusDisused;

                      return (
                        <li
                          key={station.id}
                          className={styles.stationsListItem}
                        >
                          <div
                            className={`${styles.stationBlock} ${statusClass}`}
                          >
                            {station.hasDetail ? (
                              <Link
                                href={`/stations/${station.id}?line=${lineData.id}`}
                                className={styles.stationLink}
                              >
                                {station.name}
                              </Link>
                            ) : (
                              <span className={styles.stationDisabled}>
                                {station.name}{" "}
                                <span className={styles.disabledBadge}>
                                  (無細節)
                                </span>
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li className={styles.emptyNotice}>
                      （此區段暫無車站資料）
                    </li>
                  )}
                </ul>

                {district.nextArea && (
                  <Link
                    href={`/railways/${district.nextArea}`}
                    className={styles.adjacentAreaLink}
                  >
                    ↓ 下接{" "}
                    {railwayNameMap?.[district.nextArea] ||
                      `路線 ${district.nextArea}`}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </LazyItem>
      ))}
    </div>
  );
}
