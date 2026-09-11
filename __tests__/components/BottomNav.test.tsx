import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BottomNav from "@/src/app/(components)/(bottomnav)/BottomNav";
import type { RailwayData, Station } from "@/src/types/railway";

describe("BottomNav", () => {
  it("renders the site navigation and resolves the station's railway names", () => {
    const station = {
      line: [
        { lineID: 100, lineDistrict: [] },
        { lineID: 200, lineDistrict: [] },
      ],
    } as unknown as Station;
    const railways = [
      { id: 100, name: "測試甲線" },
    ] as RailwayData[];

    render(<BottomNav station={station} railways={railways} />);

    expect(screen.getByRole("navigation", { name: "bottomnav" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "回首頁" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "回測試甲線" })).toHaveAttribute(
      "href",
      "/railways/100",
    );
    expect(screen.getByRole("link", { name: "回ID: 200" })).toHaveAttribute(
      "href",
      "/railways/200",
    );
  });
});
