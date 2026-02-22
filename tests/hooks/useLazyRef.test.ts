import { renderHook } from "@testing-library/react";
import { useLazyRef } from "../../src/hooks/useLazyRef";

describe("useLazyRef", () => {
    it("initializes with the value from the initializer", () => {
        const { result } = renderHook(() => useLazyRef(() => 42));
        expect(result.current.current).toBe(42);
    });

    it("runs the initializer only once", () => {
        const initializer = jest.fn(() => "expensive");
        const { rerender } = renderHook(() => useLazyRef(initializer));
        expect(initializer).toHaveBeenCalledTimes(1);
        rerender();
        rerender();
        expect(initializer).toHaveBeenCalledTimes(1);
    });

    it("works with complex objects", () => {
        const { result } = renderHook(() =>
            useLazyRef(() => ({ data: [1, 2, 3], computed: true }))
        );
        expect(result.current.current).toEqual({ data: [1, 2, 3], computed: true });
    });
});
