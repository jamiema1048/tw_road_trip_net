import { describe, expect, it } from "vitest";
import Highway from "@/src/models/Highway";
import Railway from "@/src/models/Railway";
import Station from "@/src/models/Station";

describe("database schemas", () => {
  it("requires a railway id and each district field", async () => {
    const railway = new Railway({
      name: "測試線",
      district: [{ districtID: 1 }],
    });

    await expect(railway.validate()).rejects.toMatchObject({
      errors: {
        id: expect.anything(),
        "district.0.districtName": expect.anything(),
      },
    });
  });

  it("accepts only known station statuses and requires a station line id", async () => {
    const station = new Station({
      id: 1,
      status: "unknown",
      line: [{ lineDistrict: [] }],
    });

    await expect(station.validate()).rejects.toMatchObject({
      errors: {
        status: expect.anything(),
        "line.0.lineID": expect.anything(),
      },
    });
  });

  it("requires a URL for every highway image", async () => {
    const highway = new Highway({ id: 1, name: "台一線", images: [{}] });

    await expect(highway.validate()).rejects.toMatchObject({
      errors: { "images.0.url": expect.anything() },
    });
  });
});
