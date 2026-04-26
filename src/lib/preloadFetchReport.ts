/**
 * Counts actual image network fetches per resolved preload URL using the
 * Resource Timing API. Lets the in-app report verify that:
 *
 *   1. Every URL we emitted as `<link rel="preload" as="image">` was fetched
 *      exactly once by the browser (the dedup gate's whole point).
 *   2. No image was fetched more than once per session — a duplicate fetch
 *      means either our dedup leaked a key or the carousel's `<picture>`
 *      asked for a different srcset variant than the preload pointed at.
 *
 * Works in mobile Safari + iPhone PWA (Resource Timing API is supported back
 * to iOS Safari 9). When the API is missing, callers see an empty result
 * set and can render a "not supported" hint instead.
 */

export type FetchCount = {
  url: string;
  count: number;
  /** wall-clock timestamps (ms relative to navigationStart) for each fetch */
  startTimes: number[];
  /** whether we ever emitted this URL as a preload candidate */
  wasPreloaded: boolean;
};

export type FetchReport = {
  supported: boolean;
  observedAt: number;
  /** entries indexed by `URL.href` (absolute) */
  countsByUrl: Map<string, FetchCount>;
  /** convenience: rows where count > 1 */
  duplicates: FetchCount[];
  /** convenience: preloaded URLs the browser never fetched (wasted preload) */
  unfetchedPreloads: string[];
};

/**
 * Build a fetch report by walking the resource-timing buffer and matching
 * any resource whose initiatorType is "img" or "link" (preloads count as
 * "link" in some engines). Pass the set of URLs we *expected* to preload
 * — they will be flagged in the result for the panel UI.
 */
export function buildFetchReport(expectedPreloadUrls: Iterable<string>): FetchReport {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return {
      supported: false,
      observedAt: Date.now(),
      countsByUrl: new Map(),
      duplicates: [],
      unfetchedPreloads: [...expectedPreloadUrls],
    };
  }
  const expected = new Set<string>();
  for (const u of expectedPreloadUrls) expected.add(normaliseUrl(u));

  const counts = new Map<string, FetchCount>();
  const entries = performance.getEntriesByType?.("resource") ?? [];
  for (const e of entries) {
    const r = e as PerformanceResourceTiming;
    if (r.initiatorType !== "img" && r.initiatorType !== "link") continue;
    const url = normaliseUrl(r.name);
    if (!isLikelyImage(url)) continue;
    const existing = counts.get(url);
    if (existing) {
      existing.count += 1;
      existing.startTimes.push(Math.round(r.startTime));
    } else {
      counts.set(url, {
        url,
        count: 1,
        startTimes: [Math.round(r.startTime)],
        wasPreloaded: expected.has(url),
      });
    }
  }
  // Make sure preloaded URLs that *did* get fetched are flagged correctly,
  // and that ones we expected but never saw show up in unfetchedPreloads.
  for (const url of expected) {
    const row = counts.get(url);
    if (row) row.wasPreloaded = true;
  }
  const duplicates = [...counts.values()]
    .filter((c) => c.count > 1)
    .sort((a, b) => b.count - a.count);
  const unfetchedPreloads = [...expected].filter((u) => !counts.has(u));

  return {
    supported: true,
    observedAt: Date.now(),
    countsByUrl: counts,
    duplicates,
    unfetchedPreloads,
  };
}

/** Heuristic: only count things that look like image URLs. */
function isLikelyImage(url: string): boolean {
  return /\.(?:png|jpe?g|webp|avif|gif|svg)(?:\?|$)/i.test(url);
}

/** Resolve relative URLs and strip cache-busting fragments. */
function normaliseUrl(url: string): string {
  try {
    const u = new URL(url, window.location.href);
    u.hash = "";
    return u.href;
  } catch {
    return url;
  }
}
