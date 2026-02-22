import { useRef } from "react";

/**
 * Returns the current render count of the component as a number.
 * Unlike `useRenderTracker`, this doesn't log — it just returns the count
 * for use in conditional logic or testing.
 *
 * @example
 * const count = useRenderCount();
 * console.log(`This component has rendered ${count} times`);
 */
export function useRenderCount(): number {
    const count = useRef(0);
    count.current++;
    return count.current;
}
