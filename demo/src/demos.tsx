import { useState, useCallback, useRef, useEffect } from "react";
import {
    useRenderTracker,
    useWhyDidYouRender,
    useDeepCompareEffect,
    useDebounce,
    useThrottle,
    usePrevious,
    useRenderCount,
    withSmartMemo,
    PerformanceProfiler,
} from "react-perf-x";

/* ═══════════════════════════════════════════ */
/* useRenderTracker Demo                       */
/* ═══════════════════════════════════════════ */
export function RenderTrackerDemo() {
    const [count, setCount] = useState(0);
    const [logs, setLogs] = useState<string[]>([]);

    // Capture console.log
    useEffect(() => {
        const orig = console.log;
        console.log = (...args: unknown[]) => {
            const msg = args.join(" ");
            if (msg.includes("[TrackerDemo]")) {
                setLogs((prev) => [...prev.slice(-5), msg]);
            }
            orig(...args);
        };
        return () => {
            console.log = orig;
        };
    }, []);

    useRenderTracker("TrackerDemo", { warnAfter: 5 });

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">useRenderTracker</span>
            </h3>
            <p className="description">
                Counts renders and warns when exceeding a threshold. Click the button
                and watch the console output.
            </p>
            <div className="controls">
                <button className="btn primary" onClick={() => setCount((c) => c + 1)}>
                    Re-render ({count})
                </button>
                <button className="btn danger" onClick={() => setLogs([])}>
                    Clear
                </button>
            </div>
            <div className="output">
                {logs.length === 0 && (
                    <span className="info">Click "Re-render" to see logs...</span>
                )}
                {logs.map((log, i) => (
                    <span
                        key={i}
                        className={`line ${log.includes("Exceeded") ? "warn" : ""}`}
                    >
                        {log}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* useWhyDidYouRender Demo                     */
/* ═══════════════════════════════════════════ */
export function WhyDidYouRenderDemo() {
    const [name, setName] = useState("Alice");
    const [age, setAge] = useState(25);
    const [changeLog, setChangeLog] = useState<string[]>([]);

    useEffect(() => {
        const origGroup = console.group;
        const origLog = console.log;
        const origEnd = console.groupEnd;
        const buffer: string[] = [];

        console.group = (...args: unknown[]) => {
            const msg = args.join(" ");
            if (msg.includes("[WhyDemo]")) buffer.push(msg);
            origGroup(...args);
        };
        console.log = (...args: unknown[]) => {
            const msg = args.join(" ");
            if (msg.includes("WhyDemo") || buffer.length > 0) {
                if (msg.includes("changed") || msg.includes("prev") || msg.includes("next") || msg.includes("no prop")) {
                    buffer.push(msg);
                }
            }
            origLog(...args);
        };
        console.groupEnd = (...args: unknown[]) => {
            if (buffer.length > 0) {
                setChangeLog((prev) => [...prev.slice(-4), ...buffer]);
                buffer.length = 0;
            }
            origEnd(...args);
        };

        return () => {
            console.group = origGroup;
            console.log = origLog;
            console.groupEnd = origEnd;
        };
    }, []);

    useWhyDidYouRender("WhyDemo", { name, age });

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">useWhyDidYouRender</span>
            </h3>
            <p className="description">
                Shows exactly which props changed on re-render. Change a value to see.
            </p>
            <div className="controls">
                <button
                    className="btn"
                    onClick={() => setName(name === "Alice" ? "Bob" : "Alice")}
                >
                    Toggle Name ({name})
                </button>
                <button className="btn" onClick={() => setAge((a) => a + 1)}>
                    Increment Age ({age})
                </button>
            </div>
            <div className="output">
                {changeLog.length === 0 && (
                    <span className="info">Change a prop to see what triggered the re-render...</span>
                )}
                {changeLog.map((log, i) => (
                    <span
                        key={i}
                        className={`line ${log.includes("changed") ? "changed" : ""} ${log.includes("no prop") ? "info" : ""}`}
                    >
                        {log}
                    </span>
                ))}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* useRenderCount Demo                         */
/* ═══════════════════════════════════════════ */
export function RenderCountDemo() {
    const [, setTick] = useState(0);
    const count = useRenderCount();

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">useRenderCount</span>
            </h3>
            <p className="description">
                Returns the current render count as a number — useful for logic, not just logging.
            </p>
            <div className="controls">
                <button className="btn primary" onClick={() => setTick((t) => t + 1)}>
                    Re-render
                </button>
            </div>
            <div className="metrics-row">
                <span className={`metric ${count > 10 ? "red" : count > 5 ? "orange" : "accent"}`}>
                    Renders: {count}
                </span>
                {count > 10 && (
                    <span className="metric red">⚠️ High render count!</span>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* withSmartMemo Demo                          */
/* ═══════════════════════════════════════════ */
function ExpensiveChild({ data }: { data: { x: number } }) {
    const renders = useRenderCount();
    return (
        <div style={{ marginTop: "0.5rem" }}>
            <span className="metric green">
                SmartMemo renders: {renders}
            </span>
            <span style={{ marginLeft: "0.5rem", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                (data.x = {data.x})
            </span>
        </div>
    );
}
const MemoizedChild = withSmartMemo(ExpensiveChild);

function NormalChild({ data }: { data: { x: number } }) {
    const renders = useRenderCount();
    return (
        <div style={{ marginTop: "0.5rem" }}>
            <span className="metric red">
                Normal renders: {renders}
            </span>
            <span style={{ marginLeft: "0.5rem", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                (data.x = {data.x})
            </span>
        </div>
    );
}

export function SmartMemoDemo() {
    const [, setTick] = useState(0);
    const [value, setValue] = useState(1);

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">withSmartMemo</span>
            </h3>
            <p className="description">
                Deep-compares props to skip unnecessary re-renders. Watch the render count difference.
            </p>
            <div className="controls">
                <button
                    className="btn"
                    onClick={() => setTick((t) => t + 1)}
                >
                    Parent Re-render (same data)
                </button>
                <button
                    className="btn primary"
                    onClick={() => setValue((v) => v + 1)}
                >
                    Change Data (x={value})
                </button>
            </div>
            <MemoizedChild data={{ x: value }} />
            <NormalChild data={{ x: value }} />
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* useDeepCompareEffect Demo                   */
/* ═══════════════════════════════════════════ */
export function DeepCompareEffectDemo() {
    const [filters, setFilters] = useState({ status: "active", page: 1 });
    const [effectRuns, setEffectRuns] = useState(0);
    const [normalRuns, setNormalRuns] = useState(0);
    const normalRef = useRef(0);

    useDeepCompareEffect(() => {
        setEffectRuns((r) => r + 1);
    }, [filters]);

    // Normal useEffect for comparison
    useEffect(() => {
        normalRef.current++;
        setNormalRuns(normalRef.current);
    }, [filters]);

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">useDeepCompareEffect</span>
            </h3>
            <p className="description">
                Runs effect only when dependencies <em>deeply</em> change. Compare with
                normal useEffect.
            </p>
            <div className="controls">
                <button
                    className="btn"
                    onClick={() => setFilters({ status: "active", page: 1 })}
                >
                    Same Data (new ref)
                </button>
                <button
                    className="btn primary"
                    onClick={() =>
                        setFilters((f) => ({
                            ...f,
                            page: f.page + 1,
                        }))
                    }
                >
                    Change Page
                </button>
            </div>
            <div className="comparison">
                <div className="comparison-side after">
                    <div className="label">Deep Compare Effect</div>
                    <div className="value">{effectRuns} runs</div>
                </div>
                <div className="comparison-side before">
                    <div className="label">Normal useEffect</div>
                    <div className="value">{normalRuns} runs</div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* useDebounce Demo                            */
/* ═══════════════════════════════════════════ */
export function DebounceDemo() {
    const [query, setQuery] = useState("");
    const debouncedQuery = useDebounce(query, 500);
    const [searchCount, setSearchCount] = useState(0);

    useEffect(() => {
        if (debouncedQuery) {
            setSearchCount((c) => c + 1);
        }
    }, [debouncedQuery]);

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">useDebounce</span>
            </h3>
            <p className="description">
                Waits 500ms after you stop typing before updating. Type fast to see the
                difference.
            </p>
            <input
                className="demo-input"
                placeholder="Type something fast..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="metrics-row">
                <span className="metric accent">
                    <span className={`status-dot ${query !== debouncedQuery ? "active" : "idle"}`} />
                    {query !== debouncedQuery ? "Waiting..." : "Settled"}
                </span>
                <span className="metric cyan">Searches: {searchCount}</span>
            </div>
            <div className="output" style={{ marginTop: "0.5rem" }}>
                <span className="info">Raw: "{query}"</span>
                <span className="line">Debounced: "{debouncedQuery}"</span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* useThrottle Demo                            */
/* ═══════════════════════════════════════════ */
export function ThrottleDemo() {
    const [position, setPosition] = useState(0);
    const throttledPos = useThrottle(position, 200);
    const rawUpdates = useRef(0);
    const throttledUpdates = useRef(0);
    const prevThrottled = usePrevious(throttledPos);

    if (prevThrottled !== throttledPos) {
        throttledUpdates.current++;
    }

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        setPosition(x);
        rawUpdates.current++;
    }, []);

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">useThrottle</span>
            </h3>
            <p className="description">
                Limits updates to one per 200ms. Move your mouse over the bar below.
            </p>
            <div
                onMouseMove={handleMouseMove}
                style={{
                    height: "48px",
                    background: "var(--bg-primary)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border)",
                    position: "relative",
                    cursor: "crosshair",
                    marginBottom: "0.75rem",
                    overflow: "hidden",
                }}
            >
                {/* Raw position */}
                <div
                    style={{
                        position: "absolute",
                        left: `${position}%`,
                        top: 0,
                        bottom: 0,
                        width: "2px",
                        background: "var(--red)",
                        opacity: 0.4,
                        transition: "none",
                    }}
                />
                {/* Throttled position */}
                <div
                    style={{
                        position: "absolute",
                        left: `${throttledPos}%`,
                        top: 0,
                        bottom: 0,
                        width: "3px",
                        background: "var(--green)",
                        boxShadow: "0 0 10px var(--green-glow)",
                        transition: "left 0.1s ease-out",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                    }}
                >
                    Move mouse here →
                </div>
            </div>
            <div className="metrics-row">
                <span className="metric red">Raw: {rawUpdates.current}</span>
                <span className="metric green">
                    Throttled: {throttledUpdates.current}
                </span>
                <span className="metric cyan">
                    Saved: {rawUpdates.current - throttledUpdates.current} updates
                </span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* usePrevious Demo                            */
/* ═══════════════════════════════════════════ */
export function PreviousDemo() {
    const [value, setValue] = useState(0);
    const prev = usePrevious(value);

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">usePrevious</span>
            </h3>
            <p className="description">
                Returns the previous value of any state. Click buttons to see it track.
            </p>
            <div className="controls">
                <button className="btn" onClick={() => setValue((v) => v + 1)}>
                    +1
                </button>
                <button className="btn" onClick={() => setValue((v) => v + 5)}>
                    +5
                </button>
                <button className="btn" onClick={() => setValue((v) => v * 2)}>
                    ×2
                </button>
                <button className="btn danger" onClick={() => setValue(0)}>
                    Reset
                </button>
            </div>
            <div className="metrics-row">
                <span className="metric accent">
                    Current: {value}
                </span>
                <span className="metric pink">
                    Previous: {prev ?? "undefined"}
                </span>
                {prev !== undefined && (
                    <span className={`metric ${value > prev ? "green" : value < prev ? "red" : "cyan"}`}>
                        {value > prev ? `↑ +${value - prev}` : value < prev ? `↓ ${value - prev}` : "= 0"}
                    </span>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════ */
/* PerformanceProfiler Demo                    */
/* ═══════════════════════════════════════════ */
export function ProfilerDemo() {
    const [items, setItems] = useState(50);
    const [metrics, setMetrics] = useState<{ duration: number }[]>([]);

    const handleProfile = useCallback(
        (m: { id: string; duration: number }) => {
            setMetrics((prev) => [...prev.slice(-9), m]);
        },
        []
    );

    const avgDuration =
        metrics.length > 0
            ? (metrics.reduce((s, m) => s + m.duration, 0) / metrics.length).toFixed(2)
            : "0.00";

    return (
        <div className="demo-card">
            <h3>
                <span className="hook-name">PerformanceProfiler</span>
            </h3>
            <p className="description">
                Measures component render time in milliseconds. Change the list size to
                see timing differences.
            </p>
            <div className="controls">
                <button className="btn" onClick={() => setItems(50)}>
                    50 items
                </button>
                <button className="btn" onClick={() => setItems(200)}>
                    200 items
                </button>
                <button className="btn" onClick={() => setItems(500)}>
                    500 items
                </button>
                <button className="btn danger" onClick={() => setMetrics([])}>
                    Clear
                </button>
            </div>
            <PerformanceProfiler id="ListDemo" onProfile={handleProfile}>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "2px",
                        maxHeight: "60px",
                        overflow: "hidden",
                        marginBottom: "0.5rem",
                    }}
                >
                    {Array.from({ length: items }, (_, i) => (
                        <div
                            key={i}
                            style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "2px",
                                background: `hsl(${(i * 360) / items}, 70%, 60%)`,
                            }}
                        />
                    ))}
                </div>
            </PerformanceProfiler>
            <div className="metrics-row">
                <span className="metric accent">Items: {items}</span>
                <span className="metric green">Avg: {avgDuration}ms</span>
                <span className="metric cyan">Samples: {metrics.length}</span>
                {metrics.length > 0 && (
                    <span className={`metric ${metrics[metrics.length - 1].duration > 5 ? "orange" : "green"}`}>
                        Last: {metrics[metrics.length - 1].duration.toFixed(2)}ms
                    </span>
                )}
            </div>
        </div>
    );
}
