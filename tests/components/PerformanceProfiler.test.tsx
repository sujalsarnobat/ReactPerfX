import React from "react";
import { render } from "@testing-library/react";
import { PerformanceProfiler } from "../../src/components/PerformanceProfiler";

// Mock isDev to return true for testing
jest.mock("../../src/utils/isDev", () => ({
  isDev: () => true,
}));

describe("PerformanceProfiler", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders children", () => {
    const { getByText } = render(
      <PerformanceProfiler>
        <div>Hello World</div>
      </PerformanceProfiler>
    );
    expect(getByText("Hello World")).toBeTruthy();
  });

  it("calls onProfile with duration", () => {
    const onProfile = jest.fn();
    render(
      <PerformanceProfiler id="TestComponent" onProfile={onProfile}>
        <div>Test</div>
      </PerformanceProfiler>
    );
    expect(onProfile).toHaveBeenCalled();
    expect(onProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "TestComponent",
        duration: expect.any(Number),
      })
    );
  });

  it("logs render duration in dev mode", () => {
    render(
      <PerformanceProfiler id="MyComp">
        <div>Test</div>
      </PerformanceProfiler>
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("[MyComp] Render duration:")
    );
  });

  it("uses default id when not provided", () => {
    render(
      <PerformanceProfiler>
        <div>Test</div>
      </PerformanceProfiler>
    );
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("[Component] Render duration:")
    );
  });
});
