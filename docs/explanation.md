# ReactPerfX — Simple Explanation

> **TL;DR:** ReactPerfX is a small toolkit that makes React apps faster by helping you find and fix performance problems. Think of it like a health checkup for your React components.

---

## What Is This Project?

When you build a React app, your components **re-render** (rebuild themselves) every time something changes. In small apps, this is fine. But in big apps — dashboards, SaaS products, real-time data apps — unnecessary re-renders make the app **slow and laggy**.

ReactPerfX gives you **hooks and tools** to:
1. **Find** which components are re-rendering too much
2. **Fix** those problems with smarter memoization and comparison
3. **Measure** exactly how long renders take

**No paid APIs. No external services. Just a lightweight npm package.**

---

## How Does React Re-rendering Work? (The Problem)

Imagine a restaurant kitchen:

- **React component** = a chef
- **Re-render** = the chef cooking a dish from scratch
- **Props/state change** = a new order comes in

The problem? React sometimes tells the chef to **cook the same dish again** even when nothing changed. In a big kitchen (big app), this wastes a LOT of time.

ReactPerfX helps you:
- 🔍 **See** which chefs are re-cooking unnecessarily
- 🛑 **Stop** them from re-cooking when the order hasn't changed
- ⏱️ **Time** how long each dish takes to cook

---

## Every Feature Explained Simply

### 🔍 `useRenderTracker` — "How many times did this component re-render?"

**What it does:** Counts and logs every time a component re-renders. Warns you if it exceeds a threshold.

**Real-world analogy:** Like a step counter, but for your component. If it hits 100 renders when it should only have 5, something is wrong.

```tsx
function Dashboard() {
  useRenderTracker("Dashboard", { warnAfter: 10 });
  // Console: [Dashboard] Render #1
  // Console: [Dashboard] Render #2
  // ...
  // Console: ⚠️ [Dashboard] Exceeded render threshold (10)
  return <div>...</div>;
}
```

**When to use:** Put it in any component you suspect is re-rendering too much.

---

### 🕵️ `useWhyDidYouRender` — "WHY did this component re-render?"

**What it does:** Tells you *exactly which prop or state value* changed to cause a re-render.

**Real-world analogy:** Like a detective that tells you "the customer changed their drink order, but the food order is the same."

```tsx
function UserCard({ name, age, filters }) {
  useWhyDidYouRender("UserCard", { name, age, filters });
  // Console: [UserCard] Re-rendered because:
  //   filters changed:
  //     prev: {status: "active"}
  //     next: {status: "inactive"}
  return <div>{name}</div>;
}
```

**When to use:** When `useRenderTracker` shows too many renders and you need to find *why*.

---

### 🧠 `withSmartMemo` — "Don't re-render if the data is the same"

**What it does:** Wraps a component so it only re-renders when its props **actually change** (using deep comparison, not just reference checks).

**The problem it solves:** Normally, React checks if props changed by checking if they're the *same object in memory*. So `{name: "Alice"}` and `{name: "Alice"}` look "different" to React because they're two separate objects — even though the data is identical.

**Real-world analogy:** Like telling a chef "don't re-cook if the order is the same words, even if it's written on a different piece of paper."

```tsx
const SmartUserCard = withSmartMemo(UserCard);
// Won't re-render if you pass {name: "Alice"} twice,
// even if they're different object references
```

**When to use:** On any component that receives objects/arrays as props and re-renders too much.

---

### 🔄 `useDeepCompareEffect` — "Only run this effect when data truly changes"

**What it does:** Works like `useEffect`, but compares dependencies **by value** instead of by reference.

**The problem it solves:** React's `useEffect` re-runs when its dependency array changes. But if you pass an object like `{page: 1}` as a dependency, it re-runs *every render* because React creates a new object each time.

```tsx
// ❌ BAD — runs every render because filters is a new object each time
useEffect(() => {
  fetchData(filters);
}, [filters]);

// ✅ GOOD — only runs when filters actually changes
useDeepCompareEffect(() => {
  fetchData(filters);
}, [filters]);
```

**When to use:** When your effect's dependencies are objects or arrays.

---

### 🔄 `useDeepCompareMemo` — "Only re-compute when data truly changes"

**What it does:** Same idea as `useDeepCompareEffect`, but for `useMemo`. Only re-computes the memoized value when dependencies **deeply change**.

```tsx
const processedData = useDeepCompareMemo(
  () => expensiveTransform(rawData),
  [rawData]
);
// Only re-runs expensiveTransform when rawData content changes
```

**When to use:** When you have an expensive computation with object/array dependencies.

---

### ⏳ `useDebounce` — "Wait until the user stops typing"

**What it does:** Delays updating a value until the user stops changing it for a specified time.

**Real-world analogy:** Like a search bar that waits until you *stop typing* before searching, instead of searching after every single keystroke.

```tsx
function SearchBox() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300); // Wait 300ms

  useEffect(() => {
    searchAPI(debouncedQuery); // Only called after user stops typing
  }, [debouncedQuery]);

  return <input onChange={(e) => setQuery(e.target.value)} />;
}
```

**When to use:** Search inputs, form validation, API calls triggered by user input.

---

### 🚦 `useThrottle` — "Don't update more than once per X milliseconds"

**What it does:** Limits how often a value updates. Even if the source changes 100 times per second, the throttled value only updates once per interval.

**Real-world analogy:** Like a news ticker that updates once per minute, even though news comes in every second.

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScroll = useThrottle(scrollY, 100); // Update max once per 100ms

  // throttledScroll updates smoothly without overwhelming your app
}
```

**When to use:** Scroll handlers, resize listeners, mouse move tracking, real-time data feeds.

---

### ⏮️ `usePrevious` — "What was this value on the last render?"

**What it does:** Returns the previous value of any state or prop.

```tsx
function Counter({ count }) {
  const prevCount = usePrevious(count);
  // First render: prevCount = undefined
  // After count changes from 5 to 10: prevCount = 5
  return <div>Was {prevCount}, now {count}</div>;
}
```

**When to use:** Animations (animate from old value to new), comparison logic, undo functionality.

---

### 🔢 `useRenderCount` — "How many renders as a number"

**What it does:** Returns the render count as a number (unlike `useRenderTracker` which just logs).

```tsx
function MyComponent() {
  const count = useRenderCount();
  return <div>Rendered {count} times</div>;
}
```

**When to use:** When you need the render count in your logic or UI, not just in console.

---

### 🦥 `useLazyRef` — "Don't compute this until you need it, and only once"

**What it does:** Creates a ref whose initial value is computed lazily (the function only runs once, on first render).

**The problem it solves:** `useRef(expensiveFunction())` calls `expensiveFunction()` on *every* render, even though only the first result is used.

```tsx
// ❌ BAD — parseConfig runs every render
const config = useRef(parseHugeConfig());

// ✅ GOOD — parseConfig runs only once
const config = useLazyRef(() => parseHugeConfig());
```

**When to use:** Heavy initial computations, parsing large configs, creating WebSocket connections.

---

### ⏱️ `PerformanceProfiler` — "How long did this component take to render?"

**What it does:** Wraps a component and measures how long each render takes in milliseconds.

```tsx
<PerformanceProfiler id="Dashboard" onProfile={({ duration }) => {
  console.log(`Dashboard took ${duration}ms`);
}}>
  <Dashboard />
</PerformanceProfiler>
```

**When to use:** Wrap slow components to measure their render time. Find your bottlenecks.

---

### 🔧 `deepCompare` & `isDev` — Utility Functions

- **`deepCompare(a, b)`** — Compares two values deeply (handles objects, arrays, Date, RegExp, Map, Set, circular references, NaN). This is the engine behind `withSmartMemo` and `useDeepCompareEffect`.

- **`isDev()`** — Returns `true` if running in development mode. Used internally to disable console logging in production.

---

## Project Structure (How the Code is Organized)

```
ReactPerfX/
├── src/                    # 📦 Source code
│   ├── hooks/              # All custom hooks (the main features)
│   ├── hoc/                # Higher-Order Components (withSmartMemo)
│   ├── components/         # React components (PerformanceProfiler)
│   ├── utils/              # Helper functions (deepCompare, isDev)
│   ├── types.ts            # Shared TypeScript types
│   └── index.ts            # Main entry — exports everything
│
├── tests/                  # 🧪 Tests (mirrors src/ structure)
│   ├── hooks/              # Tests for hooks
│   ├── hoc/                # Tests for HOCs
│   ├── components/         # Tests for components
│   └── utils/              # Tests for utilities
│
├── dist/                   # 📤 Built output (what npm publishes)
│   ├── index.js            # ESM bundle (modern imports)
│   ├── index.cjs.js        # CJS bundle (require() style)
│   └── *.d.ts              # TypeScript type definitions
│
├── docs/                   # 📖 Documentation
│   ├── SRS.md              # Software Requirements Specification
│   ├── Implementation.md   # Implementation phases
│   └── explanation.md      # This file!
│
├── .github/workflows/      # 🤖 CI/CD (auto-runs tests on push)
├── package.json            # Project config
├── tsconfig.json           # TypeScript config
├── rollup.config.js        # Bundler config (creates dist/)
├── jest.config.js          # Test runner config
├── .eslintrc.json          # Code linting rules
├── README.md               # What people see on GitHub/npm
├── CONTRIBUTING.md         # How to contribute
└── LICENSE                 # MIT license (free for everyone)
```

---

## How It All Fits Together

```
You write a hook  →  Export it from src/hooks/index.ts
                  →  Re-export from src/index.ts
                  →  Rollup bundles it into dist/
                  →  User installs from npm
                  →  User imports: import { useDebounce } from "react-perf-x"
```

**The build pipeline:**
```
TypeScript Source  →  Rollup  →  ESM + CJS bundles  →  npm package
     (.ts)                        (dist/)              (published)
```

**The test pipeline:**
```
Tests  →  Jest + ts-jest  →  Run with jsdom  →  53 tests, 85%+ coverage
```

**The CI pipeline (GitHub Actions):**
```
Push to GitHub  →  Install deps  →  Lint  →  Test  →  Build  →  ✅ or ❌
```

---

## Tech Stack (All Free)

| Tool | What It Does | Cost |
|------|-------------|------|
| TypeScript | Type-safe JavaScript | Free |
| React 18 | UI library (peer dependency) | Free |
| Rollup | Bundles code for npm | Free |
| Jest | Runs tests | Free |
| ESLint | Catches code issues | Free |
| GitHub Actions | Auto-tests on every push | Free (public repos) |
| npm | Publishes the package | Free (public packages) |

**Total cost: $0**

---

## Quick Summary

| Feature | One-Line Description |
|---------|---------------------|
| `useRenderTracker` | Count and log re-renders |
| `useWhyDidYouRender` | Find out WHY a component re-rendered |
| `withSmartMemo` | Skip re-renders when props are deeply equal |
| `useDeepCompareEffect` | useEffect but with deep dependency comparison |
| `useDeepCompareMemo` | useMemo but with deep dependency comparison |
| `useDebounce` | Wait until user stops changing a value |
| `useThrottle` | Limit how often a value updates |
| `usePrevious` | Get the previous value of anything |
| `useRenderCount` | Get render count as a number |
| `useLazyRef` | Initialize expensive ref values only once |
| `PerformanceProfiler` | Measure component render time |
| `deepCompare` | Deep equality check utility |
| `isDev` | Check if running in dev mode |
