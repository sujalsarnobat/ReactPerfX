import React from "react";
import { render } from "@testing-library/react";
import { withSmartMemo } from "../../src/hoc/withSmartMemo";

describe("withSmartMemo", () => {
    it("memoizes component and skips re-render on same props", () => {
        let renderCount = 0;
        const Dummy = ({ value }: { value: number }) => {
            renderCount++;
            return <div>{value}</div>;
        };
        const Memoized = withSmartMemo(Dummy);

        const { rerender } = render(<Memoized value={1} />);
        expect(renderCount).toBe(1);

        rerender(<Memoized value={1} />);
        expect(renderCount).toBe(1); // skipped — deep equal

        rerender(<Memoized value={2} />);
        expect(renderCount).toBe(2); // re-rendered — value changed
    });

    it("deep-compares object props", () => {
        let renderCount = 0;
        const Dummy = ({ data }: { data: { x: number } }) => {
            renderCount++;
            return <div>{data.x}</div>;
        };
        const Memoized = withSmartMemo(Dummy);

        const { rerender } = render(<Memoized data={{ x: 1 }} />);
        expect(renderCount).toBe(1);

        rerender(<Memoized data={{ x: 1 }} />); // new ref, same value
        expect(renderCount).toBe(1); // skipped

        rerender(<Memoized data={{ x: 2 }} />);
        expect(renderCount).toBe(2);
    });

    it("supports custom comparator", () => {
        let renderCount = 0;
        const Dummy = ({ id, name }: { id: number; name: string }) => {
            renderCount++;
            return <div>{name}</div>;
        };
        const Memoized = withSmartMemo(Dummy, (prev, next) => prev.id === next.id);

        const { rerender } = render(<Memoized id={1} name="Alice" />);
        expect(renderCount).toBe(1);

        rerender(<Memoized id={1} name="Bob" />); // different name, same id
        expect(renderCount).toBe(1); // skipped by custom comparator

        rerender(<Memoized id={2} name="Bob" />);
        expect(renderCount).toBe(2);
    });

    it("preserves displayName", () => {
        const MyComponent = ({ value }: { value: number }) => <div>{value}</div>;
        MyComponent.displayName = "MyComponent";
        const Memoized = withSmartMemo(MyComponent);
        expect(Memoized.displayName).toBe("WithSmartMemo(MyComponent)");
    });
});
