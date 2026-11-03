"use client";

import Link from "next/link";
import {
  Fragment,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MapContainer, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
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

const COMPANY_COLOR: Record<number, string> = {
  1: "#090980",
  2: "#159b62",
  3: "#d84b4b",
  4: "#e88824",
};

const DEFAULT_ROUTE_COLOR = "#008e9b";

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

function RoutePopupContent({
  route,
  onClose,
}: {
  route: RailwayNetworkMapRoute;
  onClose: () => void;
}) {
  const map = useMap();

  const closePopup = () => {
    map.closePopup();
    onClose();
  };

  return (
    <>
      <button
        className={styles.closeButton}
        type="button"
        aria-label="關閉路線資訊"
        onClick={closePopup}
      >
        ×
      </button>
      <div className={styles.popupHeader}>{route.railwayName}</div>
      <div className={styles.popupBody}>
        <p>{COMPANY_NAME[route.company] || `co：${route.company}`}</p>
        <Link className={styles.railwayLink} href={`/railways/${route.railwayId}`}>
          進入路線頁面 <span aria-hidden>›</span>
        </Link>
      </div>
    </>
  );
}

export default function RailwayNetworkMap({
  data,
}: {
  data: RailwayNetworkMapData;
}) {
  const [selectedRailwayId, setSelectedRailwayId] = useState<number | null>(null);
  const [selectedPopupPosition, setSelectedPopupPosition] =
    useState<LatLngExpression | null>(null);
  const selectedRoute = data.routes.find(
    (route) => route.railwayId === selectedRailwayId,
  );
  const selectedRoutes = data.routes.filter(
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
        {data.routes.map((route) => (
          <Polyline
            key={`${route.railwayId}-${route.districtID}`}
            positions={route.coordinates.map(toLatLng)}
            pathOptions={{
              color: COMPANY_COLOR[route.company] || DEFAULT_ROUTE_COLOR,
              weight: 4,
              opacity: 0.78,
            }}
            eventHandlers={{
              click: (event) => {
                setSelectedRailwayId(route.railwayId);
                setSelectedPopupPosition([event.latlng.lat, event.latlng.lng]);
              },
            }}
          />
        ))}
        {selectedRoutes.map((route) => (
          <Fragment key={`selected-${route.railwayId}-${route.districtID}`}>
            <Polyline
              positions={route.coordinates.map(toLatLng)}
              pathOptions={{ color: "#ffffff", weight: 10, opacity: 1 }}
              eventHandlers={{
                click: (event) => {
                  setSelectedRailwayId(route.railwayId);
                  setSelectedPopupPosition([event.latlng.lat, event.latlng.lng]);
                },
              }}
            />
            <Polyline
              positions={route.coordinates.map(toLatLng)}
              pathOptions={{
                color: COMPANY_COLOR[route.company] || DEFAULT_ROUTE_COLOR,
                weight: 6,
                opacity: 1,
              }}
              eventHandlers={{
                click: (event) => {
                  setSelectedRailwayId(route.railwayId);
                  setSelectedPopupPosition([event.latlng.lat, event.latlng.lng]);
                },
              }}
            />
          </Fragment>
        ))}
        {selectedRoute && selectedPopupPosition && (
          <Popup
            position={selectedPopupPosition}
            className={styles.routePopup}
            closeButton={false}
            closeOnClick={false}
          >
            <RoutePopupContent
              route={selectedRoute}
              onClose={() => {
                setSelectedRailwayId(null);
                setSelectedPopupPosition(null);
              }}
            />
          </Popup>
        )}
      </MapContainer>
      <aside className={styles.legend} aria-label="地圖圖例">
        <strong>圖例</strong>
        {Object.entries(COMPANY_NAME).map(([company, name]) => (
          <span key={company}>
            <i
              className={styles.companyLegend}
              style={{ backgroundColor: COMPANY_COLOR[Number(company)] }}
            />
            {name}
          </span>
        ))}
        <span><i className={styles.selectedLegend} />白框：已選取</span>
      </aside>

      {data.routes.length === 0 && (
        <p className={styles.emptyState}>目前尚無可繪製的路線座標資料。</p>
      )}
    </div>
  );
}
