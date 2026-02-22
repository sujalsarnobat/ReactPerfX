import React from "react";
import { deepCompare } from "../utils/deepCompare";

/**
 * Wraps a component with optimized memoization using deep comparison.
 * Supports custom comparator functions and preserves displayName.
 *
 * @example
 * const MemoizedCard = withSmartMemo(UserCard);
 * // Or with custom comparator:
 * const MemoizedCard = withSmartMemo(UserCard, (prev, next) => prev.id === next.id);
 */
export function withSmartMemo<T>(
  Component: React.ComponentType<T>,
  comparator?: (prev: T, next: T) => boolean
) {
  const Memoized = React.memo(Component, comparator || deepCompare);
  Memoized.displayName = `WithSmartMemo(${Component.displayName || Component.name
    })`;
  return Memoized;
}
