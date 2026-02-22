import { renderHook } from "@testing-library/react";
import { useWhyDidYouRender } from "../../src/hooks/useWhyDidYouRender";

// Mock isDev to return true for testing
jest.mock("../../src/utils/isDev", () => ({
    isDev: () => true,
}));

describe("useWhyDidYouRender", () => {
    beforeEach(() => {
        jest.spyOn(console, "group").mockImplementation(() => { });
        jest.spyOn(console, "groupEnd").mockImplementation(() => { });
        jest.spyOn(console, "log").mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("does not log on first render", () => {
        renderHook(() => useWhyDidYouRender("TestComp", { name: "Alice" }));
        expect(console.group).not.toHaveBeenCalled();
    });

    it("logs changed props on re-render", () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouRender("TestComp", props),
            { initialProps: { props: { name: "Alice", age: 25 } } }
        );
        rerender({ props: { name: "Bob", age: 25 } });
        expect(console.group).toHaveBeenCalledWith(
            expect.stringContaining("[TestComp] Re-rendered because:")
        );
    });

    it("logs parent re-render when no props changed", () => {
        const { rerender } = renderHook(
            ({ props }) => useWhyDidYouRender("TestComp", props),
            { initialProps: { props: { name: "Alice" } } }
        );
        rerender({ props: { name: "Alice" } });
        expect(console.log).toHaveBeenCalledWith(
            expect.stringContaining("no prop changes")
        );
    });
});
