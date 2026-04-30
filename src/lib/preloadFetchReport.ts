/**
 * Counts actual image network fetches per resolved preload candidate using
 * the Resource Timing API, with strict URL normalization and srcset variant
 * matching so the panel correctly correlates `<link rel="preload">` tags to
 * the variant the browser actually fetched from a `<picture>` srcset.
 *
 * Why this is non-trivial:
 *
 *   - A preload's `imagesrcset` may list 3+ variants (e.g. 400w/800w/1200w);
 *     mobile Safari picks ONE based on viewport+DPR. Without parsing the
 *     srcset we'd flag the unselected variants as "unfetched preloads".
 *   - CDN URLs include cache-busting params (`?v=…`, `?t=…`, `?cb=…`) that
 *     differ between the preload tag and the actual `<img>` request even
 *     though the bytes are identical. Stripping them is required for match.
 *   - Some CDNs accept query params in any order — `?w=400&q=80` and
 *     `?q=80&w=400` are the same asset; we sort params for canonical match.
 *
 * Works in mobile Safari + iPhone PWA (Resource Timing API supported back
 * to iOS Safari 9). When the API is missing, callers see an empty result.
 */

export type FetchCount = {
  url: string;
  count: number;
  /** wall-clock timestamps (ms relative to navigationStart) for each fetch */
  startTimes: number[];
  /** whether we ever emitted this URL (or one of its srcset variants) as a preload */
  wasPreloaded: boolean;
  /** the canonical preload key this fetch fulfilled, if any */
  matchedPreloadKey?: string;
};

export type PreloadExpectation = {
  /** primary href emitted on the `<link rel=preload>` tag */
  href: string;
  /** raw `imagesrcset` value, if any */
  srcSet?: string;
};

export type UnfetchedPreloadDiagnostic = {
  /** canonical primary href of the unfetched preload */
  primary: string;
  /** raw primary href as supplied to buildFetchReport (pre-canonicalization) */
  primaryRaw: string;
  /** canonical variants advertised by the preload's srcset (incl. primary) */
  expectedVariants: string[];
  /**
   * Observed image fetches whose canonical URL is NOT in expectedVariants
   * but whose filename/path stem matches the preload's filename — the most
   * common cause of an "unfetched" flag is the carousel's <picture> picking
   * a different srcset width than the one the preload listed.
   */
  likelyMismatchedFetches: { url: string; reason: string }[];
};

export type FetchReport = {
  supported: boolean;
  observedAt: number;
  /** entries indexed by canonical URL */
  countsByUrl: Map<string, FetchCount>;
  /** convenience: rows where count > 1 */
  duplicates: FetchCount[];
  /**
   * Preloads the browser never fulfilled — none of their srcset variants
   * appeared in the resource timing buffer. Indexed by the primary href.
   */
  unfetchedPreloads: string[];
  /**
   * Per-unfetched-preload diagnostic: which variants we expected and which
   * observed fetches looked like a near-miss (same filename, different
   * query/srcset variant).
   */
  unfetchedDiagnostics: UnfetchedPreloadDiagnostic[];
};

/**
 * Build a fetch report. Accepts either:
 *   - an iterable of plain URLs (legacy callers), or
 *   - an iterable of {href, srcSet?} expectations (variant-aware callers).
 */
export function buildFetchReport(
  expected: Iterable<string | PreloadExpectation>,
): FetchReport {
  const expectations = normaliseExpectations(expected);

  if (typeof window === "undefined" || typeof performance === "undefined") {
    return {
      supported: false,
      observedAt: Date.now(),
      countsByUrl: new Map(),
      duplicates: [],
      unfetchedPreloads: expectations.map((e) => e.href),
    };
  }

  // canonical variant URL -> primary preload href that owns it
  const variantToPrimary = new Map<string, string>();
  // primary href -> canonical (so we can mark fulfilled later)
  const primaries = new Set<string>();
  for (const exp of expectations) {
    const primary = canonicaliseUrl(exp.href);
    primaries.add(primary);
    variantToPrimary.set(primary, primary);
    for (const v of parseSrcSetUrls(exp.srcSet)) {
      const canon = canonicaliseUrl(v);
      // Don't overwrite an existing primary mapping with a different one;
      // first writer wins so duplicate variants stay attached to their
      // original preload.
      if (!variantToPrimary.has(canon)) variantToPrimary.set(canon, primary);
    }
  }

  const counts = new Map<string, FetchCount>();
  const fulfilledPrimaries = new Set<string>();
  const entries = performance.getEntriesByType?.("resource") ?? [];
  for (const e of entries) {
    const r = e as PerformanceResourceTiming;
    if (r.initiatorType !== "img" && r.initiatorType !== "link") continue;
    const canon = canonicaliseUrl(r.name);
    if (!isLikelyImage(canon)) continue;
    const matchedPrimary = variantToPrimary.get(canon);
    if (matchedPrimary) fulfilledPrimaries.add(matchedPrimary);
    const existing = counts.get(canon);
    if (existing) {
      existing.count += 1;
      existing.startTimes.push(Math.round(r.startTime));
      if (matchedPrimary && !existing.matchedPreloadKey) {
        existing.matchedPreloadKey = matchedPrimary;
        existing.wasPreloaded = true;
      }
    } else {
      counts.set(canon, {
        url: canon,
        count: 1,
        startTimes: [Math.round(r.startTime)],
        wasPreloaded: Boolean(matchedPrimary),
        matchedPreloadKey: matchedPrimary,
      });
    }
  }

  const duplicates = [...counts.values()]
    .filter((c) => c.count > 1)
    .sort((a, b) => b.count - a.count);

  // A preload is "unfetched" only if NONE of its srcset variants showed up.
  const unfetchedPreloads = [...primaries].filter((p) => !fulfilledPrimaries.has(p));

  return {
    supported: true,
    observedAt: Date.now(),
    countsByUrl: counts,
    duplicates,
    unfetchedPreloads,
  };
}

function normaliseExpectations(
  input: Iterable<string | PreloadExpectation>,
): PreloadExpectation[] {
  const out: PreloadExpectation[] = [];
  for (const item of input) {
    if (typeof item === "string") out.push({ href: item });
    else if (item && typeof item.href === "string") out.push(item);
  }
  return out;
}

/**
 * Parse a `srcset` / `imagesrcset` attribute value into the list of URLs
 * it advertises. Descriptors (`400w`, `2x`) are dropped — we only care
 * which assets the browser may pick from.
 */
export function parseSrcSetUrls(srcSet: string | undefined | null): string[] {
  if (!srcSet) return [];
  const out: string[] = [];
  // srcset entries are comma-separated, but commas can also legally appear
  // inside data: URLs. Splitting on `,\s+` (comma + whitespace) is the
  // pragmatic compromise the HTML spec parser uses for typical CDN output.
  for (const part of srcSet.split(/,\s+/)) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    // first whitespace-separated token is the URL; the rest are descriptors
    const url = trimmed.split(/\s+/)[0];
    if (url) out.push(url);
  }
  return out;
}

/** Heuristic: only count things that look like image URLs. */
function isLikelyImage(url: string): boolean {
  return /\.(?:png|jpe?g|webp|avif|gif|svg)(?:\?|$|#)/i.test(url);
}

/**
 * Cache-busting / analytics params we strip before comparing URLs. The
 * underlying byte payload is identical regardless of these — they're only
 * present to defeat HTTP caches or to attribute traffic.
 */
const CACHE_BUST_PARAMS = new Set([
  "v",
  "ver",
  "version",
  "t",
  "_t",
  "ts",
  "cb",
  "cache",
  "_",
  "rev",
]);

/**
 * Strict URL normalization shared by both the expected-preload set and the
 * observed-fetch set. Two URLs that point at the same logical asset must
 * produce the same canonical form.
 *
 * Rules:
 *   - resolve relative URLs against the page origin
 *   - lowercase scheme + host
 *   - drop default ports (80 for http, 443 for https)
 *   - drop the URL fragment (never sent to the network)
 *   - drop cache-bust / analytics query params (see CACHE_BUST_PARAMS)
 *   - sort remaining query params alphabetically (canonical order)
 *   - collapse a trailing `/` on path-less URLs (`https://x.com/` → `https://x.com`)
 */
export function canonicaliseUrl(url: string): string {
  try {
    const base =
      typeof window !== "undefined" ? window.location.href : "http://localhost/";
    const u = new URL(url, base);
    u.hash = "";
    u.protocol = u.protocol.toLowerCase();
    u.hostname = u.hostname.toLowerCase();
    if (
      (u.protocol === "http:" && u.port === "80") ||
      (u.protocol === "https:" && u.port === "443")
    ) {
      u.port = "";
    }
    // Filter + sort query params for canonical order.
    const kept: [string, string][] = [];
    for (const [k, v] of u.searchParams) {
      if (CACHE_BUST_PARAMS.has(k.toLowerCase())) continue;
      kept.push([k, v]);
    }
    kept.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    // Rebuild the search string deterministically.
    const sp = new URLSearchParams();
    for (const [k, v] of kept) sp.append(k, v);
    u.search = sp.toString() ? `?${sp.toString()}` : "";
    let href = u.href;
    if (u.pathname === "/" && !u.search) href = href.replace(/\/$/, "");
    return href;
  } catch {
    return url;
  }
}
