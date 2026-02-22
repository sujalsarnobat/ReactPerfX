/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/tests"],
    testMatch: ["**/*.test.{ts,tsx}"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/index.ts",
        "!src/types.ts",
    ],
    coverageDirectory: "coverage",
    coverageThreshold: {
        global: {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
    },
};
