/**
 * Opt-in debug logger for the similar-products preload pipeline.
 *
 * Activation (any one is enough):
 *   - URL: append `?preloadDebug=1` (or `&preloadDebug=1`) to any product page
 *   - Console: `localStorage.setItem('lovable:preloadDebug', '1')` then reload
 *   - Disable: `localStorage.removeItem('lovable:preloadDebug')` or `?preloadDebug=0`
 *
 * When active it prints a collapsed `console.groupCollapsed` per render with:
 *   - the warmed-set contents (which dedup keys are already cached)
 *   - the network/Save-Data gate result
 *   - one row per candidate explaining why it was emitted, deduped, or skipped
 *
 * Kept dependency-free + tree-shakeable so the production bundle pays nothing
 * when the toggle is off (the `enabled()` check short-circuits the call sites).
 */

const STORAGE_KEY = "lovable:preloadDebug";

let cached: boolean | null = null;

export function isPreloadDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (cached !== null) return cached;
  try {
    const url = new URL(window.location.href);
    const param = url.searchParams.get("preloadDebug");
    if (param === "1" || param === "true") {
      window.localStorage.setItem(STORAGE_KEY, "1");
      cached = true;
      return true;
    }
    if (param === "0" || param === "false") {
      window.localStorage.removeItem(STORAGE_KEY);
      cached = false;
      return false;
    }
    cached = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    cached = false;
  }
  return cached;
}

export type DebugCandidate = {
  idx: number;
  productId: string;
  productName?: string;
  hasImage: boolean;
  inWindow: boolean; // would have been a candidate (LCP or carouselNear)
  networkGated: boolean; // skipped because of slow connection / Save-Data
};

export type DebugRenderInput = {
  productId: string;
  warmed: Set<string>;
  slowNetwork: boolean;
  effectiveType?: string;
  saveData?: boolean;
  carouselNear: boolean;
  candidates: DebugCandidate[];
};

export function logRenderStart(input: DebugRenderInput) {
  if (!isPreloadDebugEnabled()) return;
<<<<<<< HEAD
  // eslint-disable-next-line no-console
=======

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.groupCollapsed(
    `%c[preload] render for product ${input.productId} — warmed=${input.warmed.size}`,
    "color:#6366f1;font-weight:bold",
  );
<<<<<<< HEAD
  // eslint-disable-next-line no-console
  console.log("warmed dedup keys:", Array.from(input.warmed));
  // eslint-disable-next-line no-console
=======

  console.log("warmed dedup keys:", Array.from(input.warmed));

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.log("network:", {
    slow: input.slowNetwork,
    effectiveType: input.effectiveType,
    saveData: input.saveData,
    carouselNear: input.carouselNear,
  });
  for (const c of input.candidates) {
    let reason: string;
    if (!c.hasImage) reason = "skip · no image";
<<<<<<< HEAD
    else if (!c.inWindow) reason = "skip · outside preload window (carousel not near)";
    else if (c.networkGated) reason = "skip · network gate (idx 1-2 disabled on slow conn)";
    else reason = "candidate · awaiting dedup";
    // eslint-disable-next-line no-console
=======
    else if (!c.inWindow)
      reason = "skip · outside preload window (carousel not near)";
    else if (c.networkGated)
      reason = "skip · network gate (idx 1-2 disabled on slow conn)";
    else reason = "candidate · awaiting dedup";

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    console.log(
      `  idx=${c.idx} id=${c.productId} ${c.productName ? `(${c.productName})` : ""} → ${reason}`,
    );
  }
}

export function logDecision(d: {
  decision: "emit" | "duplicate";
  idx: number;
  productId: string;
  href: string;
  priority: "high" | "low";
}) {
  if (!isPreloadDebugEnabled()) return;
  const tag = d.decision === "emit" ? "✅ EMIT " : "♻️ DUPE ";
  const color = d.decision === "emit" ? "#16a34a" : "#a16207";
<<<<<<< HEAD
  // eslint-disable-next-line no-console
=======

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.log(
    `%c  ${tag} idx=${d.idx} id=${d.productId} priority=${d.priority} → ${d.href}`,
    `color:${color}`,
  );
}

export function logRenderEnd() {
  if (!isPreloadDebugEnabled()) return;
<<<<<<< HEAD
  // eslint-disable-next-line no-console
=======

>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  console.groupEnd();
}
