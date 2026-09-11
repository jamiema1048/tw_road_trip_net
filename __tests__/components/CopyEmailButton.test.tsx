import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import CopyEmailButton from "@/src/app/(components)/(footer)/CopyEmailButton";

describe("CopyEmailButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("copies the email address and briefly confirms the action", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn();
    vi.spyOn(navigator, "clipboard", "get").mockReturnValue(
      { writeText } as unknown as Clipboard,
    );

    render(<CopyEmailButton />);
    await user.click(screen.getByRole("button", { name: "複製 Email" }));

    expect(writeText).toHaveBeenCalledWith("stu1030113@gmail.com");
    expect(screen.getByText("已複製信箱！")).toBeInTheDocument();
  });
});
