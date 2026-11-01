import { cache } from "react";

import { getConnections } from "@/src/_lib/db/connections";
import { RailwaySchema } from "@/src/features/railways/server/railway.model";
import type { MapPosition } from "./railway-map.service";

export interface RailwayNetworkMapRoute {
  railwayId: number;
  railwayName: string;
  company: number;
  region: string;
  districtID: number;
  districtName: string;
  coordinates: MapPosition[];
}

export interface RailwayNetworkMapData {
  routes: RailwayNetworkMapRoute[];
}

interface RailwayNetworkDocument {
  id: number;
  name: string;
  co: number;
  region?: string;
  district?: Array<{
    districtID: number;
    districtName: string;
    geometry?: { type?: string; coordinates?: unknown };
  }>;
}

function isMapPosition(value: unknown): value is MapPosition {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number"
  );
}

export const getRailwayNetworkMapData = cache(
  async (): Promise<RailwayNetworkMapData> => {
    const { railwayConn } = await getConnections();
    const RailwayModel =
      railwayConn.models.Railway || railwayConn.model("Railway", RailwaySchema);

    const railways = await RailwayModel.find({})
      .select("id name co region district.districtID district.districtName district.geometry")
      .lean<RailwayNetworkDocument[]>();

    const routes = railways.flatMap((railway) =>
      (railway.district || []).flatMap((district): RailwayNetworkMapRoute[] => {
        const coordinates = district.geometry?.coordinates;
        if (
          district.geometry?.type !== "LineString" ||
          !Array.isArray(coordinates)
        ) {
          return [];
        }

        const positions = coordinates.filter(isMapPosition);
        if (positions.length < 2) return [];

        return [
          {
            railwayId: railway.id,
            railwayName: railway.name,
            company: railway.co,
            region: railway.region || "未分類",
            districtID: district.districtID,
            districtName: district.districtName,
            coordinates: positions,
          },
        ];
      }),
    );

    return { routes };
  },
);
