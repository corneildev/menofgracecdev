import { defineConfig } from "@playwright/test";

/**
 * Playwright config for cross-browser preload tests.
 *
 * - Runs Chromium + WebKit (Safari engine) so we catch divergence between
 *   Blink's and WebKit's `<link rel="preload">` handling.
 * - Boots `vite dev` automatically unless BASE_URL is provided (so CI or
 *   manual runs can target a deployed preview).
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: process.env.BASE_URL ?? "http://localhost:8080",
    trace: "retain-on-failure",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "bun run dev",
        url: "http://localhost:8080",
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
