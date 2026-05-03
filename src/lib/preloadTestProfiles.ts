/**
 * Dev-only mobile test harness for the similar-products preload pipeline.
 *
 * Activation:
 *   - Append `?preloadTest=1` to a product URL (only in `import.meta.env.DEV`)
 *   - A small floating "Run preload test" button appears bottom-left.
 *   - Clicking it runs the full preload resolve+filter pipeline once per
 *     profile below, against a *fresh* warmed-set each time, and logs:
 *       • the simulated connection (effectiveType, saveData)
 *       • how many tags were emitted vs skipped (deduped/network-gated)
 *       • per-candidate decision rows
 *
 * Profiles intentionally cover the network gates the production code relies
 * on (`saveData`, `effectiveType: "2g" | "slow-2g" | "3g" | "4g"`).
 *
 * The harness never mutates the real `warmedPreloadsRef` and never affects
 * the real network — it is a pure simulation that exercises the same helpers
 * the route renders with.
 */

import {
  resolvePreloadCandidates,
  filterDuplicates,
  type PreloadStats,
  type SimilarItem,
  type ImageSources,
} from "./preloadDedup";

export type MobileProfile = {
  id: string;
  label: string;
  effectiveType: "slow-2g" | "2g" | "3g" | "4g";
  saveData: boolean;
};

export const MOBILE_PROFILES: MobileProfile[] = [
<<<<<<< HEAD
  { id: "slow-2g", label: "Slow 2G (Lagos rural)", effectiveType: "slow-2g", saveData: false },
  { id: "2g-savedata", label: "2G + Save-Data", effectiveType: "2g", saveData: true },
  { id: "3g", label: "Regular 3G", effectiveType: "3g", saveData: false },
  { id: "4g", label: "Fast 4G", effectiveType: "4g", saveData: false },
  { id: "4g-savedata", label: "4G + Save-Data (data saver)", effectiveType: "4g", saveData: true },
=======
  {
    id: "slow-2g",
    label: "Slow 2G (Lagos rural)",
    effectiveType: "slow-2g",
    saveData: false,
  },
  {
    id: "2g-savedata",
    label: "2G + Save-Data",
    effectiveType: "2g",
    saveData: true,
  },
  { id: "3g", label: "Regular 3G", effectiveType: "3g", saveData: false },
  { id: "4g", label: "Fast 4G", effectiveType: "4g", saveData: false },
  {
    id: "4g-savedata",
    label: "4G + Save-Data (data saver)",
    effectiveType: "4g",
    saveData: true,
  },
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
];

export type TestRunInput = {
  similarInStock: SimilarItem[];
  carouselNear: boolean;
  avifOk: boolean;
  webpOk: boolean;
  getImageSources: (image: string) => ImageSources;
};

export type ProfileResult = {
  profile: MobileProfile;
  slowNetwork: boolean;
  rawCandidateCount: number;
  emitted: number;
  duplicates: number;
  skippedByNetwork: number;
  emittedHrefs: string[];
};

function isSlow(p: MobileProfile) {
<<<<<<< HEAD
  return p.saveData || p.effectiveType === "2g" || p.effectiveType === "slow-2g";
=======
  return (
    p.saveData || p.effectiveType === "2g" || p.effectiveType === "slow-2g"
  );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
}

/**
 * Run the same gate + resolve + filter sequence as the route, once per profile,
 * against a fresh warmed-set. Returns structured results so callers can log,
 * snapshot, or assert on them.
 */
export function runProfileTests(input: TestRunInput): ProfileResult[] {
  return MOBILE_PROFILES.map((profile) => {
    const slowNetwork = isSlow(profile);
    const raw: { idx: number; priority: "high" | "low" }[] = [];
    if (input.similarInStock[0]?.image) raw.push({ idx: 0, priority: "high" });
    if (input.carouselNear && !slowNetwork) {
      if (input.similarInStock[1]?.image) raw.push({ idx: 1, priority: "low" });
      if (input.similarInStock[2]?.image) raw.push({ idx: 2, priority: "low" });
    }

    // How many candidates would have existed on a fast network with the
    // carousel near — anything below that on this profile is "skipped by gate".
    const maxPossible =
      (input.similarInStock[0]?.image ? 1 : 0) +
      (input.carouselNear
<<<<<<< HEAD
        ? (input.similarInStock[1]?.image ? 1 : 0) + (input.similarInStock[2]?.image ? 1 : 0)
=======
        ? (input.similarInStock[1]?.image ? 1 : 0) +
          (input.similarInStock[2]?.image ? 1 : 0)
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        : 0);
    const skippedByNetwork = Math.max(0, maxPossible - raw.length);

    const resolved = resolvePreloadCandidates(raw, input.similarInStock, {
      avifOk: input.avifOk,
      webpOk: input.webpOk,
      getImageSources: input.getImageSources,
    });

    const stats: PreloadStats = { emitted: 0, duplicates: 0, evaluations: 0 };
    const warmed = new Set<string>();
    const kept = filterDuplicates(resolved, warmed, stats);

    return {
      profile,
      slowNetwork,
      rawCandidateCount: raw.length,
      emitted: stats.emitted,
      duplicates: stats.duplicates,
      skippedByNetwork,
      emittedHrefs: kept.map((k) => k.href),
    };
  });
}

/**
 * Pretty-print a test run to the browser console as one collapsed group per
 * profile. Used by the floating dev button.
 */
export function logProfileResults(results: ProfileResult[]) {
<<<<<<< HEAD
  // eslint-disable-next-line no-console
=======
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.groupCollapsed(
    "%c[preload·test] mobile profile sweep",
    "color:#0ea5e9;font-weight:bold",
  );
<<<<<<< HEAD
  // eslint-disable-next-line no-console
=======

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.table(
    results.map((r) => ({
      profile: r.profile.label,
      effectiveType: r.profile.effectiveType,
      saveData: r.profile.saveData,
      gate: r.slowNetwork ? "SLOW · LCP only" : "FAST · LCP + 2 near",
      emitted: r.emitted,
      deduped: r.duplicates,
      "skipped(net)": r.skippedByNetwork,
    })),
  );
  for (const r of results) {
<<<<<<< HEAD
    // eslint-disable-next-line no-console
=======
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    console.groupCollapsed(
      `%c${r.profile.label} → ${r.emitted} emitted, ${r.skippedByNetwork} gated, ${r.duplicates} deduped`,
      `color:${r.slowNetwork ? "#a16207" : "#16a34a"}`,
    );
    for (const href of r.emittedHrefs) {
<<<<<<< HEAD
      // eslint-disable-next-line no-console
      console.log("  ✅ EMIT", href);
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
  // eslint-disable-next-line no-console
=======
      console.log("  ✅ EMIT", href);
    }

    console.groupEnd();
  }

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.groupEnd();
}

export function isPreloadTestEnabled(): boolean {
  if (!import.meta.env.DEV) return false;
  if (typeof window === "undefined") return false;
  try {
<<<<<<< HEAD
    return new URLSearchParams(window.location.search).get("preloadTest") === "1";
=======
    return (
      new URLSearchParams(window.location.search).get("preloadTest") === "1"
    );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  } catch {
    return false;
  }
}
