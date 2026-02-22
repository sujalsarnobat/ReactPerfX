# ReactPerfX ⚡

> Lightweight, tree-shakable React performance optimization library — zero external dependencies, TypeScript-first.

[![CI](https://github.com/sujalsarnobat/ReactPerfX/actions/workflows/ci.yml/badge.svg)](https://github.com/sujalsarnobat/ReactPerfX/actions)
[![npm](https://img.shields.io/npm/v/react-perf-x)](https://www.npmjs.com/package/react-perf-x)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/react-perf-x)](https://bundlephobia.com/result?p=react-perf-x)

## Install

```bash
npm install react-perf-x
```

## Features

| Feature | Import | Description |
|---------|--------|-------------|
| `useRenderTracker` | Hook | Log render counts with optional warning threshold |
| `useWhyDidYouRender` | Hook | Log exactly which props/state changed on re-render |
| `useDeepCompareEffect` | Hook | `useEffect` with deep dependency comparison |
| `useDeepCompareMemo` | Hook | `useMemo` with deep dependency comparison |
| `useDebounce` | Hook | Debounce any value |
| `useThrottle` | Hook | Throttle any value |
| `usePrevious` | Hook | Track previous value of any state/prop |
| `useRenderCount` | Hook | Get current render count as a number |
| `useLazyRef` | Hook | Lazy initialization for expensive refs |
| `withSmartMemo` | HOC | Deep-comparison memoization with custom comparator |
| `PerformanceProfiler` | Component | Measure component render duration |
| `deepCompare` | Utility | Deep equality comparison |
| `isDev` | Utility | Check if running in development mode |

## Quick Start

### Track Re-renders
```tsx
import { useRenderTracker } from "react-perf-x";

function Dashboard() {
  useRenderTracker("Dashboard", { warnAfter: 10 });
  return <div>...</div>;
}
```

### Debug Why Components Re-render
```tsx
import { useWhyDidYouRender } from "react-perf-x";

function UserCard({ name, age, filters }) {
  useWhyDidYouRender("UserCard", { name, age, filters });
  // Console: [UserCard] Re-rendered because:
  //   filters changed:
  //     prev: {status: "active"}
  //     next: {status: "inactive"}
  return <div>{name}</div>;
}
```

### Deep Compare Effect
```tsx
import { useDeepCompareEffect } from "react-perf-x";

function DataList({ filters }) {
  useDeepCompareEffect(() => {
    fetchData(filters); // Only re-fetches when filters *deeply* change
  }, [filters]);
  return <div>...</div>;
}
```

### Debounce & Throttle
```tsx
import { useDebounce, useThrottle } from "react-perf-x";

function SearchBox({ query }) {
  const debouncedQuery = useDebounce(query, 300);
  const throttledScroll = useThrottle(scrollPosition, 100);
}
```

### Smart Memoization
```tsx
import { withSmartMemo } from "react-perf-x";

const MemoizedCard = withSmartMemo(UserCard);
// Uses deep comparison — won't re-render if props are deeply equal

// With custom comparator:
const CustomMemo = withSmartMemo(UserCard, (prev, next) => prev.id === next.id);
```

### Performance Profiling
```tsx
import { PerformanceProfiler } from "react-perf-x";

function App() {
  return (
    <PerformanceProfiler
      id="Dashboard"
      onProfile={({ id, duration }) => console.log(`${id}: ${duration}ms`)}
    >
      <Dashboard />
    </PerformanceProfiler>
  );
}
```

## API Reference

### Hooks

#### `useRenderTracker(componentName, options?)`
- `componentName: string` — Name shown in logs
- `options.warnAfter?: number` — Warn after this many renders

#### `useWhyDidYouRender(componentName, props)`
- `componentName: string` — Name shown in logs
- `props: Record<string, any>` — Object of values to track

#### `useDeepCompareEffect(effect, deps)`
- Same API as `useEffect`, but deep-compares dependencies

#### `useDeepCompareMemo(factory, deps)`
- Same API as `useMemo`, but deep-compares dependencies

#### `useDebounce<T>(value, delay): T`
- Returns debounced value after `delay` ms of inactivity

#### `useThrottle<T>(value, delay): T`
- Returns throttled value, updating at most once per `delay` ms

#### `usePrevious<T>(value): T | undefined`
- Returns value from the previous render

#### `useRenderCount(): number`
- Returns current render count

#### `useLazyRef<T>(initializer): MutableRefObject<T>`
- Lazily initializes ref value (initializer runs once)

### HOC

#### `withSmartMemo<T>(Component, comparator?)`
- `comparator?: (prev, next) => boolean` — Custom comparator (defaults to `deepCompare`)

### Components

#### `<PerformanceProfiler id? onProfile?>`
- `id?: string` — Identifier for the profiled component
- `onProfile?: (metrics: { id, duration }) => void` — Callback with render metrics

## Requirements

- React 18+
- TypeScript 5+ (recommended)

## Development

```bash
npm install        # Install dependencies
npm test           # Run tests
npm run test:coverage  # Run tests with coverage
npm run lint       # Lint source files
npm run build      # Build ESM + CJS bundles
```

## License

[MIT](LICENSE)
