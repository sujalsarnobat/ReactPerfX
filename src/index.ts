/**
 * ReactPerfX — Lightweight React Performance Optimization Library
 *
 * @packageDocumentation
 */

// Hooks
export {
    useRenderTracker,
    useDeepCompareEffect,
    useDeepCompareMemo,
    useDebounce,
    useThrottle,
    useWhyDidYouRender,
    usePrevious,
    useRenderCount,
    useLazyRef,
} from "./hooks";

// Higher-Order Components
export { withSmartMemo } from "./hoc";

// Components
export { PerformanceProfiler } from "./components";

// Utilities
export { deepCompare, isDev } from "./utils";

// Types (re-exported for consumers)
export type {
    UseRenderTrackerOptions,
    ProfileMetrics,
    PerformanceProfilerProps,
} from "./types";
