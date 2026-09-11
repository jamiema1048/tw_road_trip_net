import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RailwayCompanyGroup } from "@/src/app/(components)/(railways)/RailwayCompanyGroup";

const lineList = [
  { id: 100, name: "測試甲線", co: 1 },
  { id: 200, name: "測試乙線", co: 1 },
];

describe("RailwayCompanyGroup", () => {
  it("renders a closed native disclosure with all route links", () => {
    render(
      <RailwayCompanyGroup co={1} companyName="測試鐵路" lineList={lineList} />,
    );

    const details = screen.getByText("測試鐵路").closest("details");

    expect(details).not.toBeNull();
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "測試甲線" })).toHaveAttribute(
      "href",
      "/railways/100",
    );
    expect(screen.getByRole("link", { name: "測試乙線" })).toHaveAttribute(
      "href",
      "/railways/200",
    );
  });

  it("opens and closes without a client-side state update", async () => {
    const user = userEvent.setup();
    render(
      <RailwayCompanyGroup co={1} companyName="測試鐵路" lineList={lineList} />,
    );

    const summary = screen.getByText("測試鐵路").closest("summary");
    const details = summary?.closest("details");

    expect(summary).not.toBeNull();
    expect(details).not.toHaveAttribute("open");

    await user.click(summary!);
    expect(details).toHaveAttribute("open");

    await user.click(summary!);
    expect(details).not.toHaveAttribute("open");
  });
});
