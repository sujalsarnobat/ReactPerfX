import { useState, useRef, useEffect } from "react";

/**
 * Throttles a value, updating at most once per `delay` ms.
 * Unlike the previous ref-based implementation, this uses useState
 * so that value changes actually trigger re-renders.
 */
export function useThrottle<T>(value: T, delay: number): T {
  const [throttled, setThrottled] = useState(value);
  const lastRan = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastRan.current;

    if (elapsed >= delay) {
      // Enough time has passed — update immediately
      setThrottled(value);
      lastRan.current = now;
    } else {
      // Schedule an update for the remaining time
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setThrottled(value);
        lastRan.current = Date.now();
      }, delay - elapsed);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return throttled;
}
