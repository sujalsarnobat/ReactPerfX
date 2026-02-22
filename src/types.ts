/**
 * Shared types for ReactPerfX
 */

/** Options for useRenderTracker hook */
export interface UseRenderTrackerOptions {
    /** Warn in console after this many renders */
    warnAfter?: number;
}

/** Metrics returned by PerformanceProfiler */
export interface ProfileMetrics {
    /** Identifier for the profiled component */
    id: string;
    /** Render duration in milliseconds */
    duration: number;
}

/** Props for the PerformanceProfiler component */
export interface PerformanceProfilerProps {
    /** Children to render and profile */
    children: React.ReactNode;
    /** Identifier for this profiler instance */
    id?: string;
    /** Callback invoked after each render with timing metrics */
    onProfile?: (metrics: ProfileMetrics) => void;
}
