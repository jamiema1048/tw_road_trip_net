import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import SearchBar from "@/src/app/(components)/(search)/SearchBar";

const router = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams("q=台鐵"),
}));

describe("SearchBar", () => {
  it("starts from the URL query, clears input, and navigates with an encoded query", async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("台鐵");

    await user.click(screen.getByRole("button", { name: "清除輸入內容" }));
    expect(input).toHaveValue("");

    await user.type(input, "  阿里山 森林鐵路  ");
    await user.click(screen.getByRole("button", { name: "提交搜尋" }));

    expect(router.push).toHaveBeenCalledWith(
      "/search?q=%E9%98%BF%E9%87%8C%E5%B1%B1%20%E6%A3%AE%E6%9E%97%E9%90%B5%E8%B7%AF",
    );
  });
});
