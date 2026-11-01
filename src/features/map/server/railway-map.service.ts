import { cache } from "react";

import { getConnections } from "@/src/_lib/db/connections";
import { RailwaySchema } from "@/src/features/railways/server/railway.model";
import { StationSchema } from "@/src/features/stations/server/station.model";

export type MapPosition = [number, number];

export interface RailwayMapRoute {
  districtID: number;
  districtName: string;
  coordinates: MapPosition[];
}

export interface RailwayMapStation {
  id: number;
  name: string;
  status: "active" | "disused" | "plan";
  hasDetail: boolean;
  coordinates: MapPosition;
}

export interface RailwayMapData {
  railwayId: number;
  railwayName: string;
  routes: RailwayMapRoute[];
  stations: RailwayMapStation[];
}

interface RailwayMapDocument {
  id: number;
  name: string;
  district?: Array<{
    districtID: number;
    districtName: string;
    geometry?: { type?: string; coordinates?: unknown };
  }>;
}

interface StationMapDocument {
  id: number;
  name: string;
  status?: "active" | "disused" | "plan";
  hasDetail?: boolean;
  location?: { type?: string; coordinates?: unknown };
}

function isMapPosition(value: unknown): value is MapPosition {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

export const getRailwayMapData = cache(
  async (railwayId: number): Promise<RailwayMapData | null> => {
    const { railwayConn, stationConn } = await getConnections();
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);
    const StationModel =
      stationConn.models.Station || stationConn.model("Station", StationSchema);

    const [railway, stations] = await Promise.all([
      RailwayModel.findOne({ id: railwayId })
        .select("id name district.districtID district.districtName district.geometry")
        .lean<RailwayMapDocument | null>(),
      StationModel.find({ "line.lineID": railwayId })
        .select("id name status hasDetail location")
        .lean<StationMapDocument[]>(),
    ]);

    if (!railway) return null;

    const routes = (railway.district || [])
      .map((district): RailwayMapRoute | null => {
        const coordinates = district.geometry?.coordinates;
        if (
          district.geometry?.type !== "LineString" ||
          !Array.isArray(coordinates)
        ) {
          return null;
        }

        const positions = coordinates.filter(isMapPosition);
        if (positions.length < 2) return null;

        return {
          districtID: district.districtID,
          districtName: district.districtName,
          coordinates: positions,
        };
      })
      .filter((route): route is RailwayMapRoute => route !== null);

    const mapStations = stations
      .map((station): RailwayMapStation | null => {
        if (
          station.location?.type !== "Point" ||
          !isMapPosition(station.location.coordinates)
        ) {
          return null;
        }

        return {
          id: station.id,
          name: station.name,
          status: station.status || "active",
          hasDetail: Boolean(station.hasDetail),
          coordinates: station.location.coordinates,
        };
      })
      .filter((station): station is RailwayMapStation => station !== null);

    return {
      railwayId: railway.id,
      railwayName: railway.name,
      routes,
      stations: mapStations,
    };
  },
);
