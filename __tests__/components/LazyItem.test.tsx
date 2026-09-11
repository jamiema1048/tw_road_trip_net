import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LazyItem } from "@/src/app/(components)/(ui)/LazyItem";

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

let observerCallback: ObserverCallback | undefined;

class IntersectionObserverMock {
  constructor(callback: ObserverCallback) {
    observerCallback = callback;
  }

  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();
  takeRecords = vi.fn(() => []);
  root = null;
  rootMargin = "0px";
  thresholds = [0];
}

describe("LazyItem", () => {
  afterEach(() => {
    observerCallback = undefined;
    vi.unstubAllGlobals();
  });

  it("renders its content once its placeholder enters the viewport", () => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);

    render(
      <LazyItem minHeight="64px">
        <span>延遲內容</span>
      </LazyItem>,
    );

    expect(screen.queryByText("延遲內容")).not.toBeInTheDocument();
    expect(observerCallback).toBeDefined();

    act(() => {
      observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry]);
    });

    expect(screen.getByText("延遲內容")).toBeInTheDocument();
  });
});
