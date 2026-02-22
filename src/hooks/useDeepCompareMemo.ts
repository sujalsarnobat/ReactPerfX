import { useRef, useMemo } from "react";
import { deepCompare } from "../utils/deepCompare";

/**
 * Like `useMemo`, but uses deep comparison on dependencies
 * instead of reference equality.
 *
 * @example
 * const processed = useDeepCompareMemo(
 *   () => expensiveComputation(data),
 *   [data]
 * );
 */
export function useDeepCompareMemo<T>(
    factory: () => T,
    deps: any[]
): T {
    const prevDeps = useRef<any[]>();
    const signalRef = useRef(0);

    if (!deepCompare(prevDeps.current, deps)) {
        prevDeps.current = deps;
        signalRef.current++;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useMemo(factory, [signalRef.current]);
}
