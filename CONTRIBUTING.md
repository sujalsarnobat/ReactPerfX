# Contributing to ReactPerfX

Thank you for considering contributing! Here's how to get started.

## Setup

```bash
git clone https://github.com/sujalsarnobat/ReactPerfX.git
cd react-perf-x
npm install
```

## Development Workflow

```bash
npm test              # Run all tests
npm run test:coverage # Run tests with coverage report
npm run lint          # Lint source files
npm run build:ts      # Type-check without emitting
npm run build         # Build ESM + CJS bundles
```

## Project Structure

```
react-perf-x/
├── src/
│   ├── hooks/          # Custom React hooks
│   │   ├── index.ts    # Barrel export
│   │   ├── useRenderTracker.ts
│   │   ├── useDeepCompareEffect.ts
│   │   ├── useDeepCompareMemo.ts
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useWhyDidYouRender.ts
│   │   ├── usePrevious.ts
│   │   ├── useRenderCount.ts
│   │   └── useLazyRef.ts
│   ├── hoc/            # Higher-Order Components
│   │   ├── index.ts
│   │   └── withSmartMemo.ts
│   ├── components/     # React components
│   │   ├── index.ts
│   │   └── PerformanceProfiler.tsx
│   ├── utils/          # Internal utilities
│   │   ├── index.ts
│   │   ├── deepCompare.ts
│   │   └── isDev.ts
│   ├── types.ts        # Shared TypeScript types
│   └── index.ts        # Main entry point
├── tests/              # Tests (mirrors src/ structure)
│   ├── hooks/
│   ├── hoc/
│   ├── components/
│   └── utils/
├── docs/               # Documentation
│   ├── SRS.md
│   └── Implementation.md
└── dist/               # Built output (gitignored)
```

## Guidelines

- **TypeScript only** — no `.js` source files
- **Add tests** — every new feature must have tests
- **85% coverage minimum**
- **JSDoc comments** — all exported functions must have JSDoc
- **No external runtime deps** — only `react` and `react-dom` as peers
- **Tree-shakable** — use named exports only

## Adding a New Hook

1. Create `src/hooks/useYourHook.ts`
2. Add JSDoc with `@example`
3. Export from `src/hooks/index.ts`
4. Create `tests/hooks/useYourHook.test.ts`
5. Update `README.md` with usage example

## Pull Request Checklist

- [ ] All tests pass (`npm test`)
- [ ] Lint passes (`npm run lint`)
- [ ] Types pass (`npm run build:ts`)
- [ ] New features have tests
- [ ] JSDoc added for new exports
- [ ] README updated if adding public API
