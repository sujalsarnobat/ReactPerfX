import { renderHook } from "@testing-library/react";
import { useRenderTracker } from "../../src/hooks/useRenderTracker";

// Mock isDev to return true for testing
jest.mock("../../src/utils/isDev", () => ({
  isDev: () => true,
}));

describe("useRenderTracker", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logs render count on each render", () => {
    const { rerender } = renderHook(() => useRenderTracker("TestComponent"));
    expect(console.log).toHaveBeenCalledWith("[TestComponent] Render #1");
    rerender();
    expect(console.log).toHaveBeenCalledWith("[TestComponent] Render #2");
  });

  it("warns when render count exceeds threshold", () => {
    const { rerender } = renderHook(() =>
      useRenderTracker("TestComponent", { warnAfter: 2 })
    );
    rerender();
    rerender();
    expect(console.warn).toHaveBeenCalledWith(
      "[TestComponent] Exceeded render threshold (2)"
    );
  });

  it("does not warn when under threshold", () => {
    const { rerender } = renderHook(() =>
      useRenderTracker("TestComponent", { warnAfter: 10 })
    );
    rerender();
    expect(console.warn).not.toHaveBeenCalled();
  });
});
