import { useRef, useEffect } from "react";
import { deepCompare } from "../utils/deepCompare";

/**
 * Like `useEffect`, but uses deep comparison on dependencies
 * instead of reference equality. Avoids unnecessary effect runs
 * when dependencies are deeply equal but have different references.
 *
 * @example
 * useDeepCompareEffect(() => {
 *   fetchData(filters);
 * }, [filters]);
 */
export function useDeepCompareEffect(
  effect: () => void | (() => void),
  deps: any[]
) {
  const prevDeps = useRef<any[]>();
  const signalRef = useRef(0);

  if (!deepCompare(prevDeps.current, deps)) {
    prevDeps.current = deps;
    signalRef.current++;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [signalRef.current]);
}
