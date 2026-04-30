/**
 * Configurable health thresholds for the preload fetch report.
 *
 * The defaults reflect the production invariants we want to hold:
 *   - duplicateFetches:     0 → any image fetched twice = dedup leak
 *   - unfetchedPreloads:    3 → up to 3 emitted preloads may legitimately
 *                              go unused (carousel scrolled past before
 *                              browser hydrated) before we flag waste.
 *
 * Overrides can come from URL params (single-session tuning) or
 * localStorage (sticky across reloads), so QA on mobile Safari can adjust
 * without code changes:
 *
 *   ?preloadDupMax=0&preloadUnfetchedMax=3
 *   localStorage["lovable:preloadThresholds"] = '{"duplicateFetches":0,"unfetchedPreloads":3}'
 *
 * `evaluateThresholds()` returns the pass/fail status plus a list of human-
 * readable breach messages for the panel header + session log.
 */

const STORAGE_KEY = "lovable:preloadThresholds";

export type PreloadThresholds = {
  /** Max allowed count of URLs fetched more than once in the session. */
  duplicateFetches: number;
  /** Max allowed count of emitted preloads that were never fetched. */
  unfetchedPreloads: number;
};

export const DEFAULT_THRESHOLDS: PreloadThresholds = {
  duplicateFetches: 0,
  unfetchedPreloads: 3,
};

export function loadThresholds(): PreloadThresholds {
  if (typeof window === "undefined") return DEFAULT_THRESHOLDS;
  let next: PreloadThresholds = { ...DEFAULT_THRESHOLDS };
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<PreloadThresholds>;
      if (typeof parsed.duplicateFetches === "number") {
        next.duplicateFetches = Math.max(0, parsed.duplicateFetches);
      }
      if (typeof parsed.unfetchedPreloads === "number") {
        next.unfetchedPreloads = Math.max(0, parsed.unfetchedPreloads);
      }
    }
  } catch {
    // ignore
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const dup = params.get("preloadDupMax");
    const unf = params.get("preloadUnfetchedMax");
    if (dup !== null && !Number.isNaN(Number(dup))) {
      next.duplicateFetches = Math.max(0, Number(dup));
    }
    if (unf !== null && !Number.isNaN(Number(unf))) {
      next.unfetchedPreloads = Math.max(0, Number(unf));
    }
  } catch {
    // ignore
  }
  return next;
}

export function saveThresholds(t: PreloadThresholds) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(t));
  } catch {
    // ignore
  }
}

export type ThresholdBreach = {
  metric: keyof PreloadThresholds;
  threshold: number;
  observed: number;
  message: string;
};

export type ThresholdEvaluation = {
  status: "pass" | "fail";
  breaches: ThresholdBreach[];
  thresholds: PreloadThresholds;
};

export function evaluateThresholds(
  observed: { duplicateFetches: number; unfetchedPreloads: number },
  thresholds: PreloadThresholds = DEFAULT_THRESHOLDS,
): ThresholdEvaluation {
  const breaches: ThresholdBreach[] = [];
  if (observed.duplicateFetches > thresholds.duplicateFetches) {
    breaches.push({
      metric: "duplicateFetches",
      threshold: thresholds.duplicateFetches,
      observed: observed.duplicateFetches,
      message: `duplicate fetches ${observed.duplicateFetches} > ${thresholds.duplicateFetches}`,
    });
  }
  if (observed.unfetchedPreloads > thresholds.unfetchedPreloads) {
    breaches.push({
      metric: "unfetchedPreloads",
      threshold: thresholds.unfetchedPreloads,
      observed: observed.unfetchedPreloads,
      message: `unfetched preloads ${observed.unfetchedPreloads} > ${thresholds.unfetchedPreloads}`,
    });
  }
  return {
    status: breaches.length === 0 ? "pass" : "fail",
    breaches,
    thresholds,
  };
}
