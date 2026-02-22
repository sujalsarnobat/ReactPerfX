import React, { useRef, useEffect } from "react";
import { isDev } from "../utils/isDev";
import type { PerformanceProfilerProps } from "../types";

/**
 * Wraps children and measures render duration.
 * Logs to console in development mode and calls onProfile callback with metrics.
 *
 * @example
 * <PerformanceProfiler id="Dashboard" onProfile={({ id, duration }) => log(id, duration)}>
 *   <Dashboard />
 * </PerformanceProfiler>
 */
export const PerformanceProfiler: React.FC<PerformanceProfilerProps> = ({
    children,
    id = "Component",
    onProfile,
}) => {
    const start = useRef(performance.now());

    useEffect(() => {
        const end = performance.now();
        const duration = end - start.current;
        if (isDev()) {
            console.log(`[${id}] Render duration: ${duration.toFixed(2)}ms`);
        }
        onProfile?.({ id, duration });
        start.current = performance.now();
    });

    return <>{children}</>;
};
