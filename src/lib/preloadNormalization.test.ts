/**
 * Test harness for URL normalization (`canonicaliseUrl`) and srcset variant
 * matching (`parseSrcSetUrls` + `buildFetchReport`).
 *
 * Why these tests matter for CI:
 *
 *   - Normalization rules (cache-bust stripping, query-param sorting, host
 *     case folding, default-port dropping) silently drift when contributors
 *     touch `CACHE_BUST_PARAMS` or the URL canonicalizer; a regression
 *     produces false-positive "duplicate fetch" / "unfetched preload" rows
 *     in the debug panel, which is exactly the noise the panel was built to
 *     eliminate.
 *   - srcset parsing must tolerate the multiple legal CDN whitespace styles
 *     (`,\s+` vs `, `, descriptors like `2x` and `800w`, data: URLs).
 *   - Variant matching is the part most likely to break: a preload listing
 *     three widths must be considered "fetched" if the browser picked any
 *     ONE of them, and an observed fetch of an unlisted width should land
 *     in `unfetchedDiagnostics.likelyMismatchedFetches` (same stem) rather
 *     than being silently ignored.
 *
 * Run via `bun run test` (vitest). The `buildFetchReport` cases stub
 * `performance.getEntriesByType("resource")` so the harness is fully
 * deterministic and runs in jsdom-less Node.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildFetchReport,
  canonicaliseUrl,
  parseSrcSetUrls,
  type PreloadExpectation,
} from "./preloadFetchReport";

/* ------------------------------------------------------------------ *
 * canonicaliseUrl
 * ------------------------------------------------------------------ */

describe("canonicaliseUrl", () => {
  it("strips cache-bust params (v, t, cb, _, ver, ts, rev)", () => {
    const cases = [
      "https://cdn.example.com/img/a.jpg?v=123",
      "https://cdn.example.com/img/a.jpg?t=999",
      "https://cdn.example.com/img/a.jpg?cb=abc",
      "https://cdn.example.com/img/a.jpg?_=171234",
      "https://cdn.example.com/img/a.jpg?ver=2",
      "https://cdn.example.com/img/a.jpg?ts=5&rev=7",
    ];
    const expected = "https://cdn.example.com/img/a.jpg";
    for (const url of cases) {
      expect(canonicaliseUrl(url)).toBe(expected);
    }
  });

  it("preserves non-cache-bust params (w, q, fm, fit, …)", () => {
    expect(canonicaliseUrl("https://cdn.example.com/img/a.jpg?w=800&q=80")).toBe(
      "https://cdn.example.com/img/a.jpg?w=800&q=80",
    );
  });

  it("sorts query params alphabetically for canonical order", () => {
    const a = canonicaliseUrl("https://cdn.example.com/img/a.jpg?w=800&q=80");
    const b = canonicaliseUrl("https://cdn.example.com/img/a.jpg?q=80&w=800");
    expect(a).toBe(b);
    expect(a).toBe("https://cdn.example.com/img/a.jpg?q=80&w=800");
  });

  it("strips cache-bust params while keeping + sorting real ones", () => {
    expect(
      canonicaliseUrl("https://cdn.example.com/img/a.jpg?w=800&v=123&q=80&t=9"),
    ).toBe("https://cdn.example.com/img/a.jpg?q=80&w=800");
  });

  it("lowercases scheme + host but not path", () => {
    expect(canonicaliseUrl("HTTPS://CDN.Example.COM/IMG/Hero.JPG")).toBe(
      "https://cdn.example.com/IMG/Hero.JPG",
    );
  });

  it("drops default ports (80/443) and the fragment", () => {
    expect(canonicaliseUrl("https://cdn.example.com:443/a.jpg#hero")).toBe(
      "https://cdn.example.com/a.jpg",
    );
    expect(canonicaliseUrl("http://cdn.example.com:80/a.jpg")).toBe(
      "http://cdn.example.com/a.jpg",
    );
  });

  it("keeps non-default ports", () => {
    expect(canonicaliseUrl("https://cdn.example.com:8443/a.jpg")).toBe(
      "https://cdn.example.com:8443/a.jpg",
    );
  });

  it("returns identical canonical for case-only host differences", () => {
    expect(canonicaliseUrl("https://CDN.example.com/a.jpg?v=1")).toBe(
      canonicaliseUrl("https://cdn.example.com/a.jpg?cb=zzz"),
    );
  });

  it("is idempotent", () => {
    const messy = "HTTPS://CDN.Example.com:443/img/a.jpg?w=800&v=1&q=80#x";
    const once = canonicaliseUrl(messy);
    expect(canonicaliseUrl(once)).toBe(once);
  });
});

/* ------------------------------------------------------------------ *
 * parseSrcSetUrls
 * ------------------------------------------------------------------ */

describe("parseSrcSetUrls", () => {
  it("parses width descriptors", () => {
    expect(
      parseSrcSetUrls(
        "https://cdn.example.com/a-400.jpg 400w, https://cdn.example.com/a-800.jpg 800w, https://cdn.example.com/a-1200.jpg 1200w",
      ),
    ).toEqual([
      "https://cdn.example.com/a-400.jpg",
      "https://cdn.example.com/a-800.jpg",
      "https://cdn.example.com/a-1200.jpg",
    ]);
  });

  it("parses density descriptors (1x/2x/3x)", () => {
    expect(
      parseSrcSetUrls(
        "https://cdn.example.com/a.jpg 1x, https://cdn.example.com/a@2x.jpg 2x",
      ),
    ).toEqual([
      "https://cdn.example.com/a.jpg",
      "https://cdn.example.com/a@2x.jpg",
    ]);
  });

  it("returns [] for empty / null / undefined", () => {
    expect(parseSrcSetUrls("")).toEqual([]);
    expect(parseSrcSetUrls(null)).toEqual([]);
    expect(parseSrcSetUrls(undefined)).toEqual([]);
  });

  it("tolerates URLs with their own query strings", () => {
    expect(
      parseSrcSetUrls(
        "https://cdn.example.com/a.jpg?w=400 400w, https://cdn.example.com/a.jpg?w=800 800w",
      ),
    ).toEqual([
      "https://cdn.example.com/a.jpg?w=400",
      "https://cdn.example.com/a.jpg?w=800",
    ]);
  });
});

/* ------------------------------------------------------------------ *
 * buildFetchReport — variant matching
 *
 * We stub the Resource Timing API so each test can describe exactly which
 * URLs the browser "fetched", then assert how the report correlates them
 * with the supplied preload expectations.
 * ------------------------------------------------------------------ */

type StubEntry = {
  name: string;
  startTime: number;
  entryType: "resource";
  initiatorType: "img" | "link";
};

function stubResourceTimings(urls: string[]) {
  const entries: StubEntry[] = urls.map((name, i) => ({
    name,
    startTime: 100 + i,
    entryType: "resource",
    initiatorType: "img",
  }));
  vi.spyOn(performance, "getEntriesByType").mockImplementation((type) =>
    type === "resource" ? (entries as unknown as PerformanceEntryList) : [],
  );
}

describe("buildFetchReport — srcset variant matching", () => {
  beforeEach(() => {
    // jsdom-less Node: minimal globals so canonicaliseUrl() resolves
    // relative URLs and the report sees `performance` defined.
    if (typeof (globalThis as { window?: unknown }).window === "undefined") {
      (globalThis as { window: unknown }).window = {
        location: { href: "https://shop.example.com/" },
      };
    }
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("counts a fetched srcset variant as fulfilling its preload", () => {
    // Preload advertises 3 widths; browser picked the 800w one.
    const expectation: PreloadExpectation = {
      href: "https://cdn.example.com/hero-400.jpg",
      srcSet:
        "https://cdn.example.com/hero-400.jpg 400w, https://cdn.example.com/hero-800.jpg 800w, https://cdn.example.com/hero-1200.jpg 1200w",
    };
    stubResourceTimings(["https://cdn.example.com/hero-800.jpg?v=cache123"]);

    const report = buildFetchReport([expectation]);

    expect(report.unfetchedPreloads).toEqual([]);
    expect(report.unfetchedDiagnostics).toEqual([]);
    const matched = report.countsByUrl.get(
      canonicaliseUrl("https://cdn.example.com/hero-800.jpg"),
    );
    expect(matched?.count).toBe(1);
    expect(matched?.wasPreloaded).toBe(true);
  });

  it("ignores cache-bust params when matching preloads to fetches", () => {
    const expectation: PreloadExpectation = {
      href: "https://cdn.example.com/hero-800.jpg?v=deploy42",
    };
    stubResourceTimings(["https://cdn.example.com/hero-800.jpg?cb=runtime99"]);

    const report = buildFetchReport([expectation]);
    expect(report.unfetchedPreloads).toEqual([]);
    const row = report.countsByUrl.get(
      canonicaliseUrl("https://cdn.example.com/hero-800.jpg"),
    );
    expect(row?.wasPreloaded).toBe(true);
    expect(row?.count).toBe(1);
  });

  it("treats two fetches of the same canonical URL as duplicates", () => {
    const expectation: PreloadExpectation = {
      href: "https://cdn.example.com/hero.jpg?w=800&q=80",
    };
    stubResourceTimings([
      "https://cdn.example.com/hero.jpg?q=80&w=800", // same, params reordered
      "https://cdn.example.com/hero.jpg?w=800&q=80&v=2", // same, +cache-bust
    ]);

    const report = buildFetchReport([expectation]);
    const canon = canonicaliseUrl(
      "https://cdn.example.com/hero.jpg?w=800&q=80",
    );
    expect(report.countsByUrl.get(canon)?.count).toBe(2);
    expect(report.duplicates.map((d) => d.url)).toContain(canon);
  });

  it("flags an unfetched preload + records the near-miss variant", () => {
    // Preload listed the 400w variant; browser picked 1200w (NOT in srcset).
    const expectation: PreloadExpectation = {
      href: "https://cdn.example.com/banner-400.jpg",
      srcSet: "https://cdn.example.com/banner-400.jpg 400w",
    };
    stubResourceTimings(["https://cdn.example.com/banner-1200.jpg"]);

    const report = buildFetchReport([expectation]);

    expect(report.unfetchedPreloads).toEqual([
      canonicaliseUrl("https://cdn.example.com/banner-400.jpg"),
    ]);
    expect(report.unfetchedDiagnostics).toHaveLength(1);
    const diag = report.unfetchedDiagnostics[0];
    expect(diag.expectedVariants).toEqual([
      canonicaliseUrl("https://cdn.example.com/banner-400.jpg"),
    ]);
    // The 1200w fetch shares the `banner` stem, so it's flagged as a
    // likely srcset mismatch (not a totally unrelated image).
    expect(diag.likelyMismatchedFetches.length).toBeGreaterThan(0);
    expect(diag.likelyMismatchedFetches[0].url).toContain("banner-1200.jpg");
  });

  it("does NOT flag a fetch with an unrelated stem as a near-miss", () => {
    const expectation: PreloadExpectation = {
      href: "https://cdn.example.com/banner-400.jpg",
      srcSet: "https://cdn.example.com/banner-400.jpg 400w",
    };
    stubResourceTimings(["https://cdn.example.com/footer-logo.jpg"]);

    const report = buildFetchReport([expectation]);
    expect(report.unfetchedPreloads).toHaveLength(1);
    expect(report.unfetchedDiagnostics[0].likelyMismatchedFetches).toEqual([]);
  });
});
