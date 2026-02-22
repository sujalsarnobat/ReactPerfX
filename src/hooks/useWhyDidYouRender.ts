import { useRef, useEffect } from "react";
import { isDev } from "../utils/isDev";
import { deepCompare } from "../utils/deepCompare";

/**
 * Logs exactly which props/state values changed on re-render.
 * Only logs in development mode.
 *
 * @example
 * useWhyDidYouRender("MyComponent", { userId, filters, data });
 * // Console: [MyComponent] Re-rendered because:
 * //   filters changed:
 * //     prev: {status: "active"}
 * //     next: {status: "inactive"}
 */
export function useWhyDidYouRender(
    componentName: string,
    props: Record<string, any>
): void {
    const prevProps = useRef<Record<string, any> | undefined>();

    useEffect(() => {
        if (!isDev()) return;

        if (prevProps.current) {
            const changedProps: Record<
                string,
                { prev: any; next: any }
            > = {};

            // Check all current keys
            const allKeys = new Set([
                ...Object.keys(prevProps.current),
                ...Object.keys(props),
            ]);

            for (const key of allKeys) {
                if (!deepCompare(prevProps.current[key], props[key])) {
                    changedProps[key] = {
                        prev: prevProps.current[key],
                        next: props[key],
                    };
                }
            }

            if (Object.keys(changedProps).length > 0) {
                console.group(`[${componentName}] Re-rendered because:`);
                for (const [key, { prev, next }] of Object.entries(changedProps)) {
                    console.log(`  ${key} changed:`);
                    console.log(`    prev:`, prev);
                    console.log(`    next:`, next);
                }
                console.groupEnd();
            } else {
                console.log(
                    `[${componentName}] Re-rendered with no prop changes (parent re-rendered)`
                );
            }
        }

        prevProps.current = { ...props };
    });
}
