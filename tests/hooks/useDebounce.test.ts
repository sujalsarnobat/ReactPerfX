import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../src/hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  it("returns initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 200));
    expect(result.current).toBe("hello");
  });

  it("does not update value before delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );
    rerender({ value: "b", delay: 300 });
    expect(result.current).toBe("a"); // not yet updated
  });

  it("updates value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 200 } }
    );
    rerender({ value: "b", delay: 200 });
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(result.current).toBe("b");
  });

  it("resets timer on rapid updates", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 300 } }
    );
    rerender({ value: "b", delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });
    rerender({ value: "c", delay: 300 });
    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe("a"); // timer reset, still waiting
    act(() => { jest.advanceTimersByTime(200); });
    expect(result.current).toBe("c"); // final value
  });

  it("works with zero delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 0 } }
    );
    rerender({ value: "b", delay: 0 });
    act(() => { jest.advanceTimersByTime(0); });
    expect(result.current).toBe("b");
  });

  it("supports generic types", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 42, delay: 100 } }
    );
    rerender({ value: 99, delay: 100 });
    act(() => { jest.advanceTimersByTime(100); });
    expect(result.current).toBe(99);
  });
});
