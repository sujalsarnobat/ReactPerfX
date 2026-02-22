/**
 * Deep comparison utility for ReactPerfX.
 * Handles primitives, Date, RegExp, Map, Set, arrays, objects, NaN, and circular references.
 */
export function deepCompare(a: any, b: any): boolean {
  return internalDeepCompare(a, b, new WeakSet(), new WeakSet());
}

function internalDeepCompare(
  a: any,
  b: any,
  seenA: WeakSet<object>,
  seenB: WeakSet<object>
): boolean {
  // Strict equality (covers primitives, null, undefined, same reference)
  if (a === b) return true;

  // Handle NaN
  if (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b)) {
    return true;
  }

  // If either is null/undefined (and they're not equal — checked above), not equal
  if (a == null || b == null) return false;

  // Different types
  if (typeof a !== typeof b) return false;

  // Non-object primitives that aren't equal
  if (typeof a !== "object") return false;

  // Date comparison
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (a instanceof Date !== b instanceof Date) return false;

  // RegExp comparison
  if (a instanceof RegExp && b instanceof RegExp) {
    return a.source === b.source && a.flags === b.flags;
  }
  if (a instanceof RegExp !== b instanceof RegExp) return false;

  // Map comparison
  if (a instanceof Map && b instanceof Map) {
    if (a.size !== b.size) return false;
    for (const [key, val] of a) {
      if (!b.has(key) || !internalDeepCompare(val, b.get(key), seenA, seenB)) {
        return false;
      }
    }
    return true;
  }
  if (a instanceof Map !== b instanceof Map) return false;

  // Set comparison
  if (a instanceof Set && b instanceof Set) {
    if (a.size !== b.size) return false;
    for (const val of a) {
      if (!b.has(val)) return false;
    }
    return true;
  }
  if (a instanceof Set !== b instanceof Set) return false;

  // Circular reference detection
  if (seenA.has(a) && seenB.has(b)) return true;
  if (seenA.has(a) || seenB.has(b)) return false;
  seenA.add(a);
  seenB.add(b);

  // Array comparison
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!internalDeepCompare(a[i], b[i], seenA, seenB)) return false;
    }
    return true;
  }
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  // Object comparison
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (
      !Object.prototype.hasOwnProperty.call(b, key) ||
      !internalDeepCompare(a[key], b[key], seenA, seenB)
    ) {
      return false;
    }
  }

  return true;
}
