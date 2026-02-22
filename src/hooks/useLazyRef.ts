import { useRef } from "react";

/**
 * Creates a ref with lazy initialization.
 * The initializer function runs only once, on the first render.
 * Useful for expensive initial values that React's `useRef` doesn't
 * natively support lazy initialization for.
 *
 * @example
 * const heavyData = useLazyRef(() => computeExpensiveValue());
 */
export function useLazyRef<T>(initializer: () => T): React.MutableRefObject<T> {
    const ref = useRef<T | null>(null);
    const initialized = useRef(false);

    if (!initialized.current) {
        ref.current = initializer();
        initialized.current = true;
    }

    return ref as React.MutableRefObject<T>;
}
