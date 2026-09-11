import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import HeaderSearchBar from "@/src/app/(components)/(header)/HeaderSearchBar";

const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(),
}));

describe("HeaderSearchBar", () => {
  it("opens, focuses, submits, and closes the header search", async () => {
    const user = userEvent.setup();
    render(<HeaderSearchBar />);

    const button = screen.getByRole("button", { name: "搜尋" });
    const input = screen.getByPlaceholderText("搜尋公路、車站...");
    const form = button.closest("form");

    expect(form).toHaveAttribute("data-open", "false");
    await user.click(button);
    expect(form).toHaveAttribute("data-open", "true");
    expect(input).toHaveFocus();

    await user.type(input, "阿里山");
    await user.click(button);
    expect(router.push).toHaveBeenCalledWith(
      "/search?q=%E9%98%BF%E9%87%8C%E5%B1%B1",
    );

    await user.click(screen.getByRole("button", { name: "關閉搜尋" }));
    expect(form).toHaveAttribute("data-open", "false");
    expect(input).toHaveValue("");
  });
});
