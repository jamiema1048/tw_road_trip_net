import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import MobileMenuToggle from "@/src/app/(components)/(header)/MobileMenuToggle";
import ScrollToTopButton from "@/src/app/(components)/(bottomnav)/ScrollToTopButton";

describe("navigation controls", () => {
  it("opens the mobile menu and closes it after a menu link is selected", async () => {
    const user = userEvent.setup();
    render(
      <header data-menu-open="false">
        <MobileMenuToggle />
        <a href="/about" data-mobile-menu-link onClick={(event) => event.preventDefault()}>
          關於我們
        </a>
      </header>,
    );

    const button = screen.getByLabelText("開啟選單");
    const header = button.closest("header");

    await user.click(button);
    expect(header).toHaveAttribute("data-menu-open", "true");
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("link", { name: "關於我們" }));
    expect(header).toHaveAttribute("data-menu-open", "false");
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("scrolls smoothly to the beginning of the page", async () => {
    const user = userEvent.setup();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);

    render(<ScrollToTopButton />);
    await user.click(screen.getByRole("button", { name: "回到最上方" }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    vi.unstubAllGlobals();
  });
});
