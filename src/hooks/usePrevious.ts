import { useRef, useEffect } from "react";

/**
 * Returns the previous value of any state or prop.
 * On the first render, returns `undefined`.
 *
 * @example
 * const prevCount = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}
