import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Breadcrumbs from "@/src/app/(components)/(breadcrumbs)/Breadcrumbs";

vi.mock("next/navigation", () => ({
  usePathname: () => "/railways/3700",
}));

describe("Breadcrumbs", () => {
  it("creates links for ancestor routes and marks the final item as current", () => {
    render(<Breadcrumbs customNames={{ "3700": "阿里山林業鐵路" }} />);

    expect(screen.getByRole("link", { name: "首頁" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "鐵路總覽" })).toHaveAttribute(
      "href",
      "/railways",
    );
    expect(screen.getByText("阿里山林業鐵路")).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("uses a supplied path instead of the browser pathname", () => {
    render(<Breadcrumbs currentPath="/about" />);

    expect(screen.getByText("關於我們")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText("鐵路總覽")).not.toBeInTheDocument();
  });
});
