"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

import type {
  RailwayNetworkMapData,
  RailwayNetworkMapRoute,
} from "@/src/features/map/server";
import styles from "./RailwayNetworkMap.module.css";

const TAIWAN_CENTER: LatLngExpression = [23.7, 121];
const TAIWAN_ZOOM = 7;

const COMPANY_NAME: Record<number, string> = {
  1: "台鐵",
  2: "林業鐵路",
  3: "糖業鐵路",
  4: "其他鐵路",
};

function toLatLng([longitude, latitude]: [number, number]): LatLngExpression {
  return [latitude, longitude];
}

function MapViewport({ routes }: { routes: RailwayNetworkMapRoute[] }) {
  const map = useMap();
  const bounds = useMemo(
    () =>
      routes.length > 0
        ? (routes.flatMap((route) => route.coordinates).map(toLatLng) as LatLngBoundsExpression)
        : null,
    [routes],
  );

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 12 });
      return;
    }

    map.setView(TAIWAN_CENTER, TAIWAN_ZOOM);
  }, [bounds, map]);

  return null;
}

export default function RailwayNetworkMap({
  data,
}: {
  data: RailwayNetworkMapData;
}) {
  const [selectedRailwayId, setSelectedRailwayId] = useState<number | null>(null);
  const selectedRoute = data.routes.find(
    (route) => route.railwayId === selectedRailwayId,
  );

  return (
    <div className={styles.mapShell}>
      <MapContainer center={TAIWAN_CENTER} zoom={TAIWAN_ZOOM} className={styles.map} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport routes={data.routes} />
        {data.routes.map((route) => {
          const isSelected = route.railwayId === selectedRailwayId;
          return (
            <Polyline
              key={`${route.railwayId}-${route.districtID}`}
              positions={route.coordinates.map(toLatLng)}
              pathOptions={{
                color: isSelected ? "#ffbc42" : "#008e9b",
                weight: isSelected ? 7 : 4,
                opacity: isSelected ? 1 : 0.68,
              }}
              eventHandlers={{ click: () => setSelectedRailwayId(route.railwayId) }}
            />
          );
        })}
      </MapContainer>

      <aside className={styles.legend} aria-label="地圖圖例">
        <strong>圖例</strong>
        <span><i className={styles.routeLegend} />鐵道路線</span>
        <span><i className={styles.selectedLegend} />已選取路線</span>
      </aside>

      {selectedRoute && (
        <section className={styles.routeDialog} aria-live="polite">
          <button
            className={styles.closeButton}
            type="button"
            aria-label="關閉路線資訊"
            onClick={() => setSelectedRailwayId(null)}
          >
            ×
          </button>
          <div className={styles.dialogHeader}>{selectedRoute.railwayName}</div>
          <div className={styles.dialogBody}>
            <p>{selectedRoute.region}・{COMPANY_NAME[selectedRoute.company] || "鐵路"}</p>
            <p className={styles.districtName}>已選取：{selectedRoute.districtName}</p>
            <Link className={styles.railwayLink} href={`/railways/${selectedRoute.railwayId}`}>
              進入路線頁面 <span aria-hidden>›</span>
            </Link>
          </div>
        </section>
      )}

      {data.routes.length === 0 && (
        <p className={styles.emptyState}>目前尚無可繪製的路線座標資料。</p>
      )}
    </div>
  );
}
