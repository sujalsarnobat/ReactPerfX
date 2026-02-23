import { useState, useEffect } from "react";
import {
  RenderTrackerDemo,
  WhyDidYouRenderDemo,
  DeepCompareEffectDemo,
  DebounceDemo,
  ThrottleDemo,
  PreviousDemo,
  RenderCountDemo,
  SmartMemoDemo,
  ProfilerDemo,
} from "./demos";

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button className="theme-toggle" onClick={() => setDark((d) => !d)}>
      <span className="icon">{dark ? "☀️" : "🌙"}</span>
      {dark ? "Light" : "Dark"}
    </button>
  );
}

function App() {
  return (
    <div className="app">
      <ThemeToggle />

      {/* Hero */}
      <header className="hero">
        <h1>
          ReactPerfX <span className="bolt">⚡</span>
        </h1>
        <p className="tagline">
          Lightweight React performance optimization library — interactive demo
          of every hook, HOC, and component.
        </p>
        <div className="install-cmd">
          <span className="dollar">$</span> npm install react-perf-x
        </div>
        <div className="badges">
          <span className="badge ts">TypeScript</span>
          <span className="badge zero">0 Dependencies</span>
          <span className="badge size">3.6 KB</span>
          <span className="badge tree">Tree-shakable</span>
        </div>
      </header>

      {/* Render Debugging */}
      <h2 className="section-title">
        <span className="emoji">🔍</span> Render Debugging
      </h2>
      <div className="demo-grid">
        <RenderTrackerDemo />
        <WhyDidYouRenderDemo />
        <RenderCountDemo />
      </div>

      {/* Smart Optimization */}
      <h2 className="section-title">
        <span className="emoji">🧠</span> Smart Optimization
      </h2>
      <div className="demo-grid">
        <SmartMemoDemo />
        <DeepCompareEffectDemo />
      </div>

      {/* Input Performance */}
      <h2 className="section-title">
        <span className="emoji">⏱️</span> Input Performance
      </h2>
      <div className="demo-grid">
        <DebounceDemo />
        <ThrottleDemo />
      </div>

      {/* Utilities & Profiling */}
      <h2 className="section-title">
        <span className="emoji">🛠️</span> Utilities & Profiling
      </h2>
      <div className="demo-grid">
        <PreviousDemo />
        <ProfilerDemo />
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with ❤️ by{" "}
          <a
            href="https://github.com/sujalsarnobat"
            target="_blank"
            rel="noopener"
          >
            Sujal Sarnobat
          </a>{" "}
          ·{" "}
          <a
            href="https://www.npmjs.com/package/react-perf-x"
            target="_blank"
            rel="noopener"
          >
            npm
          </a>{" "}
          ·{" "}
          <a
            href="https://github.com/sujalsarnobat/ReactPerfX"
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
