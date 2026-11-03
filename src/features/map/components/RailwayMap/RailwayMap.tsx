"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { LatLngBoundsExpression, LatLngExpression } from "leaflet";

import type {
  RailwayMapData,
  RailwayMapStation,
} from "@/src/features/map/server";
import styles from "./RailwayMap.module.css";

const TAIWAN_CENTER: LatLngExpression = [23.7, 121];
const TAIWAN_ZOOM = 7;

function toLatLng([longitude, latitude]: [number, number]): LatLngExpression {
  return [latitude, longitude];
}

function MapViewport({ data }: { data: RailwayMapData }) {
  const map = useMap();
  const bounds = useMemo(() => {
    const positions = [
      ...data.routes.flatMap((route) => route.coordinates),
      ...data.stations.map((station) => station.coordinates),
    ];

    return positions.length > 0
      ? (positions.map(toLatLng) as LatLngBoundsExpression)
      : null;
  }, [data]);

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 14 });
      return;
    }

    map.setView(TAIWAN_CENTER, TAIWAN_ZOOM);
  }, [bounds, map]);

  return null;
}

function statusLabel(status: RailwayMapStation["status"]) {
  return { active: "營運中", disused: "已廢止", plan: "規劃中" }[status];
}

function statusColor(status: RailwayMapStation["status"]) {
  return { active: "#008e9b", disused: "#949494", plan: "#6cb4fc" }[status];
}

function StationPopupContent({
  station,
  railwayId,
}: {
  station: RailwayMapStation;
  railwayId: number;
}) {
  const map = useMap();

  return (
    <>
      <button
        className={styles.closeButton}
        type="button"
        aria-label="關閉車站資訊"
        onClick={() => map.closePopup()}
      >
        ×
      </button>
      <div className={styles.popupHeader}>{station.name}</div>
      <div className={styles.popupBody}>
        <div className={styles.popupStatus}>
          <span>營運狀態：</span>
          <span
            className={styles.statusDot}
            style={{ backgroundColor: statusColor(station.status) }}
          />
          <span>{statusLabel(station.status)}</span>
        </div>
        {station.hasDetail ? (
          <Link className={styles.stationLink} href={`/stations/${station.id}?line=${railwayId}`}>
            進入車站頁面 <span aria-hidden>›</span>
          </Link>
        ) : <span className={styles.noDetail}>暫無車站詳情</span>}
      </div>
    </>
  );
}

export default function RailwayMap({ data }: { data: RailwayMapData }) {
  const hasMapContent = data.routes.length > 0 || data.stations.length > 0;

  return (
    <div className={styles.mapShell}>
      <MapContainer center={TAIWAN_CENTER} zoom={TAIWAN_ZOOM} className={styles.map} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewport data={data} />
        {data.routes.map((route) => (
          <Polyline key={route.districtID} positions={route.coordinates.map(toLatLng)} pathOptions={{ color: "#008e9b", weight: 4, opacity: 0.9 }} />
        ))}
        {data.stations.map((station) => (
          <CircleMarker key={station.id} center={toLatLng(station.coordinates)} radius={8} pathOptions={{ color: "#ffffff", fillColor: statusColor(station.status), fillOpacity: 1, weight: 2 }}>
            <Popup className={styles.stationPopup} closeButton={false}>
              <StationPopupContent station={station} railwayId={data.railwayId} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <aside className={styles.legend} aria-label="地圖圖例">
        <strong>圖例</strong>
        <span><i className={styles.routeLegend} />鐵道路線</span>
        <span><i className={styles.stationLegend} />車站</span>
      </aside>
      {!hasMapContent && <p className={styles.emptyState}>此路線尚無可繪製的座標資料。</p>}
    </div>
  );
}
