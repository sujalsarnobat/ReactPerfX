import { useRef, useEffect } from "react";
import { isDev } from "../utils/isDev";
import type { UseRenderTrackerOptions } from "../types";

/**
 * Tracks the number of renders for a component and logs to console in development mode.
 * Optionally warns if the render count exceeds a threshold.
 *
 * @example
 * useRenderTracker("DashboardCard", { warnAfter: 10 });
 */
export function useRenderTracker(
  componentName: string,
  options: UseRenderTrackerOptions = {}
) {
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current++;
    if (isDev()) {
      console.log(`[${componentName}] Render #${renderCount.current}`);
      if (options.warnAfter && renderCount.current > options.warnAfter) {
        console.warn(
          `[${componentName}] Exceeded render threshold (${options.warnAfter})`
        );
      }
    }
  });
}
