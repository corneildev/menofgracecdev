/**
 * One-click "iPhone Safari" quick-run for the similar-products preload pipeline.
 *
 * Replays the same resolve+filter scenarios as `runProfileTests` but pinned
 * to a single realistic iPhone Safari preset (4G, no Save-Data — what most
 * iOS users actually see) and snapshots the resulting report to localStorage
 * under `lovable:preloadQuickRun:v1` (rolling history of last N runs).
 *
 * The snapshot is intentionally self-contained: each entry stores the
 * profile, per-candidate decisions, current fetch report, and a wall-clock
 * timestamp so the developer can compare runs across sessions without
 * needing to re-open devtools.
 */

import {
  resolvePreloadCandidates,
  filterDuplicates,
  type PreloadStats,
  type SimilarItem,
  type ImageSources,
  type PreloadDecision,
} from "./preloadDedup";
import { buildFetchReport, type FetchReport } from "./preloadFetchReport";
import type { MobileProfile } from "./preloadTestProfiles";

const STORAGE_KEY = "lovable:preloadQuickRun:v1";
const MAX_RUNS = 10;

/**
 * iPhone Safari preset — modern iOS user on LTE/5G, Save-Data off.
 * Matches what the production gate sees for the typical mobile Safari
 * visitor we want to optimise for.
 */
export const IPHONE_SAFARI_PROFILE: MobileProfile = {
  id: "iphone-safari",
  label: "iPhone Safari (4G, no Save-Data)",
  effectiveType: "4g",
  saveData: false,
};

export type QuickRunDecision = {
  decision: "emit" | "duplicate";
  idx: number;
  productId: string;
  href: string;
  priority: "high" | "low";
};

export type QuickRunSnapshot = {
  runId: string;
  takenAt: string; // ISO
  profile: MobileProfile;
  userAgent: string;
  productId: string;
  rawCandidateCount: number;
  emitted: number;
  duplicates: number;
  emittedHrefs: string[];
  decisions: QuickRunDecision[];
  fetchReport: {
    supported: boolean;
    duplicateUrls: { url: string; count: number }[];
    unfetchedPreloads: string[];
    totalTrackedUrls: number;
  };
};

export type QuickRunStore = {
  runs: QuickRunSnapshot[];
};

function safeRead(): QuickRunStore {
  if (typeof window === "undefined") return { runs: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { runs: [] };
    const parsed = JSON.parse(raw) as QuickRunStore;
    if (!parsed || !Array.isArray(parsed.runs)) return { runs: [] };
    return parsed;
  } catch {
    return { runs: [] };
  }
}

function safeWrite(store: QuickRunStore) {
  if (typeof window === "undefined") return;
  try {
    const trimmed: QuickRunStore = { runs: store.runs.slice(-MAX_RUNS) };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore quota / disabled storage
  }
}

export type QuickRunInput = {
  productId: string;
  similarInStock: SimilarItem[];
  avifOk: boolean;
  webpOk: boolean;
  getImageSources: (image: string) => ImageSources;
};

/**
 * Replay the carousel preload pipeline once with the iPhone Safari preset,
 * snapshot the result (plus the current fetch report) to localStorage, and
 * return the snapshot for live UI display.
 */
<<<<<<< HEAD
export function runIphoneSafariQuickRun(input: QuickRunInput): QuickRunSnapshot {
=======
export function runIphoneSafariQuickRun(
  input: QuickRunInput,
): QuickRunSnapshot {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const profile = IPHONE_SAFARI_PROFILE;

  // iPhone Safari on 4G is NOT slow — full LCP + 2 near candidates apply.
  const raw: { idx: number; priority: "high" | "low" }[] = [];
  if (input.similarInStock[0]?.image) raw.push({ idx: 0, priority: "high" });
  if (input.similarInStock[1]?.image) raw.push({ idx: 1, priority: "low" });
  if (input.similarInStock[2]?.image) raw.push({ idx: 2, priority: "low" });

  const resolved = resolvePreloadCandidates(raw, input.similarInStock, {
    avifOk: input.avifOk,
    webpOk: input.webpOk,
    getImageSources: input.getImageSources,
  });

  const stats: PreloadStats = { emitted: 0, duplicates: 0, evaluations: 0 };
  const warmed = new Set<string>();
  const decisions: QuickRunDecision[] = [];
  const onDecision = (d: PreloadDecision) => {
    decisions.push({
      decision: d.decision,
      idx: d.idx,
      productId: d.item.id,
      href: d.href,
      priority: d.priority,
    });
  };
  const kept = filterDuplicates(resolved, warmed, stats, onDecision);

  const fetchReport: FetchReport = buildFetchReport(
    kept.map((k) => ({ href: k.href, srcSet: k.srcSet })),
  );

  const snapshot: QuickRunSnapshot = {
    runId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    takenAt: new Date().toISOString(),
    profile,
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
    productId: input.productId,
    rawCandidateCount: raw.length,
    emitted: stats.emitted,
    duplicates: stats.duplicates,
    emittedHrefs: kept.map((k) => k.href),
    decisions,
    fetchReport: {
      supported: fetchReport.supported,
      duplicateUrls: fetchReport.duplicates.map((d) => ({
        url: d.url,
        count: d.count,
      })),
      unfetchedPreloads: fetchReport.unfetchedPreloads,
      totalTrackedUrls: fetchReport.countsByUrl.size,
    },
  };

  const store = safeRead();
  store.runs.push(snapshot);
  safeWrite(store);

  // Pretty-print to console so devs see it inline without opening localStorage.
<<<<<<< HEAD
  // eslint-disable-next-line no-console
=======

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.groupCollapsed(
    `%c[preload·quickrun] iPhone Safari → emitted=${snapshot.emitted}, dupes=${snapshot.duplicates}, fetched=${snapshot.fetchReport.totalTrackedUrls}`,
    "color:#0ea5e9;font-weight:bold",
  );
<<<<<<< HEAD
  // eslint-disable-next-line no-console
  console.log("snapshot:", snapshot);
  // eslint-disable-next-line no-console
=======

  console.log("snapshot:", snapshot);

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.groupEnd();

  return snapshot;
}

export function readQuickRunHistory(): QuickRunSnapshot[] {
  return safeRead().runs;
}

export function clearQuickRunHistory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

/**
 * Auto-run is opt-in even when `?preloadDebug=1` is on, so opening the panel
 * to inspect prior runs doesn't surprise the developer with a fresh write.
 * Activation (any one):
 *   - URL: `?preloadAutoRun=1` (also accepted: `&preloadAutoRun=1`)
 *   - Storage: `localStorage["lovable:preloadAutoRun"] = "1"` (sticky)
 *   - URL `?preloadAutoRun=0` clears the sticky flag.
 */
export function isPreloadAutoRunEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const params = new URLSearchParams(window.location.search);
    const v = params.get("preloadAutoRun");
    if (v === "1" || v === "true") {
      window.localStorage.setItem("lovable:preloadAutoRun", "1");
      return true;
    }
    if (v === "0" || v === "false") {
      window.localStorage.removeItem("lovable:preloadAutoRun");
      return false;
    }
    return window.localStorage.getItem("lovable:preloadAutoRun") === "1";
  } catch {
    return false;
  }
}
