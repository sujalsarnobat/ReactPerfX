import { renderHook } from "@testing-library/react";
import { useDeepCompareMemo } from "../../src/hooks/useDeepCompareMemo";

describe("useDeepCompareMemo", () => {
    it("returns memoized value", () => {
        const factory = jest.fn(() => "result");
        const { result } = renderHook(
            ({ deps }) => useDeepCompareMemo(factory, deps),
            { initialProps: { deps: [{ a: 1 }] } }
        );
        expect(result.current).toBe("result");
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it("does not re-compute when deps are deeply equal", () => {
        const factory = jest.fn(() => "result");
        const { rerender } = renderHook(
            ({ deps }) => useDeepCompareMemo(factory, deps),
            { initialProps: { deps: [{ a: 1 }] } }
        );
        rerender({ deps: [{ a: 1 }] }); // new ref, same value
        expect(factory).toHaveBeenCalledTimes(1);
    });

    it("re-computes when deps deeply change", () => {
        let counter = 0;
        const factory = jest.fn(() => ++counter);
        const { result, rerender } = renderHook(
            ({ deps }) => useDeepCompareMemo(factory, deps),
            { initialProps: { deps: [{ a: 1 }] } }
        );
        expect(result.current).toBe(1);
        rerender({ deps: [{ a: 2 }] });
        expect(result.current).toBe(2);
        expect(factory).toHaveBeenCalledTimes(2);
    });
});
