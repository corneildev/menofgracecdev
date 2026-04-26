import { useEffect, type RefObject } from "react";

/**
 * Module-level cache of fully-decoded HTMLImageElements.
 * Survives route changes within a single SPA session, so repeat visits to a
 * product page render thumbnails from memory without re-decoding.
 *
 * We keep the Image objects (not just URLs) so the browser keeps the decoded
 * bitmap alive — dropping refs would let the GC reclaim it.
 */
const imageCache = new Map<string, HTMLImageElement>();

/** Soft cap to avoid unbounded growth on long sessions. */
const MAX_CACHED = 60;

function evictIfNeeded() {
  if (imageCache.size <= MAX_CACHED) return;
  // Drop oldest entries (Map preserves insertion order).
  const overflow = imageCache.size - MAX_CACHED;
  let i = 0;
  for (const key of imageCache.keys()) {
    if (i++ >= overflow) break;
    imageCache.delete(key);
  }
}

export function prefetchImage(src: string): Promise<void> {
  if (!src) return Promise.resolve();
  if (imageCache.has(src)) return Promise.resolve();
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    // fetchpriority is best-effort; not all browsers honour it.
    (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "low";
    img.onload = () => {
      // Decode then cache, so the bitmap is GPU-ready on next render.
      const done = () => {
        imageCache.set(src, img);
        evictIfNeeded();
        resolve();
      };
      if (typeof img.decode === "function") {
        img.decode().then(done, done);
      } else {
        done();
      }
    };
    img.onerror = () => resolve(); // never throw on prefetch failure
    img.src = src;
  });
}

export function isImageCached(src: string): boolean {
  return imageCache.has(src);
}

type PrefetchOptions = {
  /**
   * If provided, prefetch is gated on this element approaching the viewport.
   * Combined with `rootMargin`, this lets us load just-in-time during scroll
   * rather than burning bandwidth on mount.
   */
  target?: RefObject<Element | null>;
  /** IntersectionObserver rootMargin. Defaults to a generous 600px lookahead. */
  rootMargin?: string;
  /** Skip prefetching entirely. Useful for conditional sections. */
  enabled?: boolean;
};

/**
 * Prefetch a list of thumbnails. Three modes:
 *  1. No `target`: prefetch on idle as soon as the hook mounts.
 *  2. With `target`: wait for the element to approach the viewport, then prefetch on idle.
 *  3. `enabled: false`: do nothing.
 *
 * Skips work entirely on slow connections or data-saver mode.
 */
export function useImagePrefetch(
  srcs: readonly string[],
  options: PrefetchOptions = {},
): void {
  const { target, rootMargin = "600px 0px", enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (srcs.length === 0) return;

    type Conn = { saveData?: boolean; effectiveType?: string };
    const conn = (navigator as Navigator & { connection?: Conn }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && /^(slow-2g|2g)$/.test(conn.effectiveType)) return;

    const idle =
      (window as Window & {
        requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));

    const cancelIdle =
      (window as Window & { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback ??
      ((id: number) => window.clearTimeout(id));

    let cancelled = false;
    let idleHandle: number | null = null;
    let observer: IntersectionObserver | null = null;

    const startPrefetch = () => {
      if (cancelled) return;
      idleHandle = idle(
        () => {
          if (cancelled) return;
          // Sequential prefetch — gentler on the network than parallel bursts.
          void srcs.reduce(
            (chain, src) => chain.then(() => (cancelled ? undefined : prefetchImage(src))),
            Promise.resolve(),
          );
        },
        { timeout: 1500 },
      ) as unknown as number;
    };

    const node = target?.current ?? null;
    if (node && typeof IntersectionObserver !== "undefined") {
      // Just-in-time: wait until the section is within `rootMargin` of the viewport.
      observer = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              observer?.disconnect();
              observer = null;
              startPrefetch();
              break;
            }
          }
        },
        { rootMargin, threshold: 0 },
      );
      observer.observe(node);
    } else {
      // No target (or no IO support) — fall back to idle-on-mount.
      startPrefetch();
    }

    return () => {
      cancelled = true;
      if (idleHandle !== null) cancelIdle(idleHandle);
      observer?.disconnect();
    };
  }, [srcs, target, rootMargin, enabled]);
}
