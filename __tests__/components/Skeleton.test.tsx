import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Skeleton from "@/src/app/(components)/(ui)/Skeleton";

describe("Skeleton", () => {
  it("uses the supplied dimensions and remains hidden from assistive technology", () => {
    const { container } = render(
      <Skeleton height="48px" className="route-placeholder" style={{ width: "50%" }} />,
    );
    const skeleton = container.firstElementChild;

    expect(skeleton).toHaveClass("route-placeholder");
    expect(skeleton).toHaveStyle({ height: "48px", width: "50%" });
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });
});
