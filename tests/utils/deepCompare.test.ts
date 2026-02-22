import { deepCompare } from "../../src/utils/deepCompare";

describe("deepCompare", () => {
    // Primitives
    it("compares primitives", () => {
        expect(deepCompare(1, 1)).toBe(true);
        expect(deepCompare(1, 2)).toBe(false);
        expect(deepCompare("a", "a")).toBe(true);
        expect(deepCompare("a", "b")).toBe(false);
        expect(deepCompare(true, true)).toBe(true);
        expect(deepCompare(true, false)).toBe(false);
    });

    it("handles null and undefined", () => {
        expect(deepCompare(null, null)).toBe(true);
        expect(deepCompare(undefined, undefined)).toBe(true);
        expect(deepCompare(null, undefined)).toBe(false);
        expect(deepCompare(null, 0)).toBe(false);
        expect(deepCompare(undefined, "")).toBe(false);
    });

    it("handles NaN", () => {
        expect(deepCompare(NaN, NaN)).toBe(true);
        expect(deepCompare(NaN, 1)).toBe(false);
    });

    // Objects
    it("compares flat objects", () => {
        expect(deepCompare({ a: 1 }, { a: 1 })).toBe(true);
        expect(deepCompare({ a: 1 }, { a: 2 })).toBe(false);
        expect(deepCompare({ a: 1 }, { b: 1 })).toBe(false);
        expect(deepCompare({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    });

    it("compares nested objects", () => {
        expect(deepCompare({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
        expect(deepCompare({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
    });

    // Arrays
    it("compares arrays", () => {
        expect(deepCompare([1, 2, 3], [1, 2, 3])).toBe(true);
        expect(deepCompare([1, 2, 3], [1, 2, 4])).toBe(false);
        expect(deepCompare([1, 2], [1, 2, 3])).toBe(false);
    });

    it("compares nested arrays", () => {
        expect(deepCompare([[1, [2]]], [[1, [2]]])).toBe(true);
        expect(deepCompare([[1, [2]]], [[1, [3]]])).toBe(false);
    });

    // Date
    it("compares Date objects", () => {
        const d1 = new Date("2024-01-01");
        const d2 = new Date("2024-01-01");
        const d3 = new Date("2025-01-01");
        expect(deepCompare(d1, d2)).toBe(true);
        expect(deepCompare(d1, d3)).toBe(false);
    });

    // RegExp
    it("compares RegExp objects", () => {
        expect(deepCompare(/abc/gi, /abc/gi)).toBe(true);
        expect(deepCompare(/abc/g, /abc/i)).toBe(false);
        expect(deepCompare(/abc/, /def/)).toBe(false);
    });

    // Map
    it("compares Maps", () => {
        const m1 = new Map([["a", 1], ["b", 2]]);
        const m2 = new Map([["a", 1], ["b", 2]]);
        const m3 = new Map([["a", 1], ["b", 3]]);
        expect(deepCompare(m1, m2)).toBe(true);
        expect(deepCompare(m1, m3)).toBe(false);
    });

    // Set
    it("compares Sets", () => {
        const s1 = new Set([1, 2, 3]);
        const s2 = new Set([1, 2, 3]);
        const s3 = new Set([1, 2, 4]);
        expect(deepCompare(s1, s2)).toBe(true);
        expect(deepCompare(s1, s3)).toBe(false);
    });

    // Circular references
    it("handles circular references", () => {
        const a: any = { x: 1 };
        a.self = a;
        const b: any = { x: 1 };
        b.self = b;
        expect(deepCompare(a, b)).toBe(true);
    });

    // Mixed types
    it("returns false for different types", () => {
        expect(deepCompare(1, "1")).toBe(false);
        expect(deepCompare([], {})).toBe(false);
        expect(deepCompare(null, {})).toBe(false);
        expect(deepCompare(new Date(), /regex/)).toBe(false);
    });

    // undefined values in objects
    it("handles undefined values in objects", () => {
        expect(deepCompare({ a: undefined }, { a: undefined })).toBe(true);
        expect(deepCompare({ a: undefined }, {})).toBe(false);
    });
});
