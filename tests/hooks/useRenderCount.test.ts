import { renderHook } from "@testing-library/react";
import { useRenderCount } from "../../src/hooks/useRenderCount";

describe("useRenderCount", () => {
    it("returns 1 on first render", () => {
        const { result } = renderHook(() => useRenderCount());
        expect(result.current).toBe(1);
    });

    it("increments on each re-render", () => {
        const { result, rerender } = renderHook(() => useRenderCount());
        expect(result.current).toBe(1);
        rerender();
        expect(result.current).toBe(2);
        rerender();
        expect(result.current).toBe(3);
    });
});
