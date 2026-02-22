import { renderHook } from "@testing-library/react";
import { usePrevious } from "../../src/hooks/usePrevious";

describe("usePrevious", () => {
    it("returns undefined on first render", () => {
        const { result } = renderHook(() => usePrevious(1));
        expect(result.current).toBeUndefined();
    });

    it("returns previous value after re-render", () => {
        const { result, rerender } = renderHook(
            ({ value }) => usePrevious(value),
            { initialProps: { value: "a" } }
        );
        rerender({ value: "b" });
        expect(result.current).toBe("a");
        rerender({ value: "c" });
        expect(result.current).toBe("b");
    });

    it("works with objects", () => {
        const obj1 = { x: 1 };
        const obj2 = { x: 2 };
        const { result, rerender } = renderHook(
            ({ value }) => usePrevious(value),
            { initialProps: { value: obj1 } }
        );
        rerender({ value: obj2 });
        expect(result.current).toBe(obj1);
    });
});
