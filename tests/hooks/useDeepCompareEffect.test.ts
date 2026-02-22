import { renderHook } from "@testing-library/react";
import { useDeepCompareEffect } from "../../src/hooks/useDeepCompareEffect";

describe("useDeepCompareEffect", () => {
  it("runs effect on mount", () => {
    let count = 0;
    renderHook(({ deps }) => {
      useDeepCompareEffect(() => { count++; }, deps);
    }, { initialProps: { deps: [{ a: 1 }] } });
    expect(count).toBe(1);
  });

  it("does not re-run effect when deps are deeply equal", () => {
    let count = 0;
    const { rerender } = renderHook(({ deps }) => {
      useDeepCompareEffect(() => { count++; }, deps);
    }, { initialProps: { deps: [{ a: 1 }] } });
    rerender({ deps: [{ a: 1 }] }); // same deep value, new reference
    expect(count).toBe(1); // should not re-run
  });

  it("re-runs effect when deps deeply change", () => {
    let count = 0;
    const { rerender } = renderHook(({ deps }) => {
      useDeepCompareEffect(() => { count++; }, deps);
    }, { initialProps: { deps: [{ a: 1 }] } });
    rerender({ deps: [{ a: 2 }] });
    expect(count).toBe(2);
  });

  it("handles empty deps array", () => {
    let count = 0;
    const { rerender } = renderHook(({ deps }) => {
      useDeepCompareEffect(() => { count++; }, deps);
    }, { initialProps: { deps: [] as any[] } });
    rerender({ deps: [] });
    expect(count).toBe(1);
  });

  it("handles nested object changes", () => {
    let count = 0;
    const { rerender } = renderHook(({ deps }) => {
      useDeepCompareEffect(() => { count++; }, deps);
    }, { initialProps: { deps: [{ nested: { value: 1 } }] } });
    rerender({ deps: [{ nested: { value: 1 } }] });
    expect(count).toBe(1);
    rerender({ deps: [{ nested: { value: 2 } }] });
    expect(count).toBe(2);
  });
});
