import { renderHook, act } from "@testing-library/react";
import { useThrottle } from "../../src/hooks/useThrottle";

jest.useFakeTimers();

describe("useThrottle", () => {
  it("returns initial value", () => {
    const { result } = renderHook(() => useThrottle("hello", 200));
    expect(result.current).toBe("hello");
  });

  it("updates value after delay passes", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useThrottle(value, delay),
      { initialProps: { value: "a", delay: 200 } }
    );
    // Rerender with new value — not enough time has passed
    rerender({ value: "b", delay: 200 });
    // Value should still be "a" until trailing timer fires
    expect(result.current).toBe("a");
    // Advance timer to let the trailing update fire
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe("b");
  });

  it("supports generic types", () => {
    const { result } = renderHook(() => useThrottle(42, 100));
    expect(result.current).toBe(42);
  });
});
