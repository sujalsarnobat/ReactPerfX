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

---

## The Demo App — Interactive Playground

The project includes a **live demo app** inside the `demo/` folder. It's a separate React app (built with Vite) that imports `react-perf-x` from npm and lets you interact with every hook in real-time. Think of it as a playground where you can click buttons and immediately see what each hook does.

### How to Run the Demo

```bash
cd demo
npm install
npm run dev
# Open http://localhost:5173
```

### What You'll See

The demo is split into **4 sections**, each covering a different category of performance tools. Here's what each section does and why it matters:

---

### 🔍 Section 1: Render Debugging

This section helps you **find performance problems**. It has 3 demo cards:

#### `useRenderTracker` Card

**What you see:** A "Re-render" button and a console output area.

**What to do:** Click "Re-render" multiple times.

**What happens:** Every time you click, the component re-renders and you see logs like:
- `[TrackerDemo] Render #1`
- `[TrackerDemo] Render #2`
- `[TrackerDemo] Render #3`

After 5 clicks, you'll see an **orange warning**: `Exceeded render threshold (5)`. This shows how the hook catches components that are re-rendering too much.

**Why it matters:** In a real app, you'd put this in a component you suspect is slow. If it logs 50 renders when it should be 3, you've found your problem.

#### `useWhyDidYouRender` Card

**What you see:** Two buttons — "Toggle Name" and "Increment Age".

**What to do:** Click either button.

**What happens:** The console output tells you *exactly which prop* changed:
- Click "Toggle Name" → It shows `name changed: prev: "Alice", next: "Bob"`
- Click "Increment Age" → It shows `age changed: prev: 25, next: 26`

**Why it matters:** When you know a component is re-rendering too much (from `useRenderTracker`), this hook tells you *why*. Maybe it's a prop that's changing unexpectedly.

#### `useRenderCount` Card

**What you see:** A "Re-render" button and a colored counter.

**What to do:** Click "Re-render" multiple times.

**What happens:** The counter goes up: Renders: 1, 2, 3... The color changes:
- **Blue** (1-5): Normal
- **Orange** (6-10): Getting high
- **Red** (11+): Too many renders!

**Why it matters:** Unlike `useRenderTracker` (which logs to console), this gives you the count as a **number** you can use in your code — like showing it in the UI or triggering logic based on render count.

---

### 🧠 Section 2: Smart Optimization

This section helps you **fix performance problems**. It has 2 demo cards:

#### `withSmartMemo` Card

**What you see:** Two buttons and two counters — one green ("SmartMemo renders") and one red ("Normal renders").

**What to do:** 
1. Click **"Parent Re-render (same data)"** a few times
2. Then click **"Change Data"**

**What happens:**
- When you click "Parent Re-render": The **green counter stays the same** (SmartMemo skips the re-render) but the **red counter goes up** (normal component re-renders every time)
- When you click "Change Data": **Both counters go up** (because the data actually changed)

**Why it matters:** This is the power of deep comparison. React normally re-renders even if you pass `{x: 1}` and `{x: 1}` because they're two different objects in memory. `withSmartMemo` checks if the *content* is the same, and skips the re-render if it is.

#### `useDeepCompareEffect` Card

**What you see:** Two buttons and a green/red comparison panel.

**What to do:**
1. Click **"Same Data (new ref)"** a few times
2. Then click **"Change Page"**

**What happens:**
- "Same Data" creates a new object `{status: "active", page: 1}` each time — the data is identical but it's a new object
- **Green side** (Deep Compare Effect): Only counts runs when data *actually* changes
- **Red side** (Normal useEffect): Counts every single re-render

After clicking "Same Data" 5 times then "Change Page" twice:
- Green might show: `3 runs` (only real changes)
- Red might show: `8 runs` (every single time)

**Why it matters:** If you use `useEffect` with an object dependency, it runs on *every* render. `useDeepCompareEffect` only runs when the data content changes. This prevents unnecessary API calls, database queries, or heavy computations.

---

### ⏱️ Section 3: Input Performance

This section handles **rate-limiting** — controlling how often things update. It has 2 demo cards:

#### `useDebounce` Card

**What you see:** A text input, a status indicator, and a raw vs. debounced comparison.

**What to do:** Type something quickly in the input box — like "hello world".

**What happens:**
- **As you type:** The "Raw" value updates instantly with every keystroke
- **While typing:** The status shows a pulsing green "Waiting..." indicator
- **After you stop typing for 500ms:** The "Debounced" value catches up, the "Searches" counter goes up by 1, and status shows "Settled"

If you type "hello" (5 keystrokes), the search only fires **once** instead of 5 times.

**Why it matters:** Without debouncing, a search input would fire an API call on every keystroke — "h", "he", "hel", "hell", "hello". That's 5 API calls. With debouncing, it waits until you stop typing and fires just 1 call with "hello". Huge savings.

#### `useThrottle` Card

**What you see:** A dark bar area with "Move mouse here →" and three colored counters.

**What to do:** Move your mouse back and forth across the bar area quickly.

**What happens:**
- A **red line** follows your mouse instantly (raw position)
- A **green line** follows with a slight delay, updating max once per 200ms (throttled position)
- The counters show:
  - **Red (Raw):** Total mouse move events (could be 200+)
  - **Green (Throttled):** Throttled updates (much smaller number)
  - **Cyan (Saved):** How many unnecessary updates were prevented

**Why it matters:** Mouse move events fire hundreds of times per second. If each one triggers a state update and re-render, your app freezes. Throttling limits it to once every 200ms — smooth for the user, light on the app.

---

### 🛠️ Section 4: Utilities & Profiling

This section covers **tracking and measuring**. It has 2 demo cards:

#### `usePrevious` Card

**What you see:** Four buttons (+1, +5, ×2, Reset) and two colored pills showing "Current" and "Previous" values.

**What to do:** Click the buttons in sequence — for example: +1, +1, +5, ×2, Reset.

**What happens:**
- **Current** shows the current value
- **Previous** shows what the value was *before the last change*
- A **green/red arrow** shows the difference (↑ +5 or ↓ -10)

Example sequence:
1. Start: Current: 0, Previous: undefined
2. Click +1: Current: 1, Previous: 0 (↑ +1)
3. Click +5: Current: 6, Previous: 1 (↑ +5)
4. Click ×2: Current: 12, Previous: 6 (↑ +6)
5. Click Reset: Current: 0, Previous: 12 (↓ -12)

**Why it matters:** You need the previous value for animations (animate from old position to new), for showing "change since last update" indicators, or for undo functionality.

#### `PerformanceProfiler` Card

**What you see:** Three buttons (50 items, 200 items, 500 items), a row of colorful dots, and timing metrics.

**What to do:** Click the different item count buttons.

**What happens:**
- The colorful dots represent rendered items
- Metrics update after each render:
  - **Items:** How many items are being rendered
  - **Avg:** Average render time across all samples
  - **Samples:** How many measurements have been taken
  - **Last:** The most recent render time

50 items might take 2ms, 200 items might take 8ms, 500 items might take 15ms.

**Why it matters:** This is how you find your bottlenecks. Wrap any component with `<PerformanceProfiler>` and it tells you exactly how many milliseconds each render takes. If a component takes 50ms, that's a problem. If it takes 0.5ms, it's fine.

---

### 🌙 Theme Toggle

**What you see:** A pill-shaped button in the top-right corner showing 🌙 Dark or ☀️ Light.

**What to do:** Click it.

**What happens:** The entire app switches between:
- **Light mode** (default): Clean white background, subtle shadows, easy to read
- **Dark mode**: Deep navy background with softer colors, easier on the eyes at night

Your preference is saved in the browser — when you come back later, it remembers your choice.

---

### Demo App Folder Structure

```
demo/
├── index.html          # The HTML page that loads the app
├── package.json        # Demo app dependencies (react, vite, react-perf-x)
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
└── src/
    ├── main.tsx        # Entry point — renders <App />
    ├── App.tsx         # Main layout — hero, sections, theme toggle, footer
    ├── demos.tsx       # All 9 interactive demo components
    └── index.css       # Full design system (light mode + dark mode)
```

**Key files:**
- **`demos.tsx`** — This is where all the magic happens. Each demo is a separate React component that imports a hook from `react-perf-x` and creates an interactive UI around it.
- **`index.css`** — The design system uses CSS variables (`--bg-primary`, `--accent`, etc.) that change when you toggle themes. This is how the same HTML looks completely different in light vs dark mode.
- **`App.tsx`** — The `ThemeToggle` component sets `data-theme="dark"` on the `<html>` element, which triggers all the CSS variable changes.

---

### How the Console Capture Works

You might wonder: "How does the demo show console.log output inside the UI?"

The demo uses a clever trick — it temporarily **overrides** `console.log`:

```
Original console.log  →  Custom function  →  Checks if the message
                                              matches the demo name
                                              → If yes: adds to UI state
                                              → Always: calls original console.log
```

This way, the console still works normally in DevTools, but the demo can also show the output inline. Don't worry — this is only in the demo app, not in the library itself.

