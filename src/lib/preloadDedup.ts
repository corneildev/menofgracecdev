/**
 * Pure helpers for the similar-products carousel preload pipeline.
 *
 * Extracted from `src/routes/collection.$productId.tsx` so the dedup gate
 * can be unit-tested in isolation against currency switches, filter changes,
 * and any other re-render trigger that does not actually change the image
 * payload.
 */

export type SimilarItem = {
  id: string;
  image?: string | null;
};

export type ImageSources = {
  jpg: string;
  jpgSrcSet?: string;
  webp?: string;
  webpSrcSet?: string;
  avif?: string;
  avifSrcSet?: string;
};

export type PreloadCandidate = {
  idx: number;
  priority: "high" | "low";
};

export type ResolvedPreload = {
  idx: number;
  priority: "high" | "low";
  item: SimilarItem;
  href: string;
  type: string;
  srcSet?: string;
  dedupKey: string;
};

export type PreloadStats = {
  emitted: number;
  duplicates: number;
  evaluations: number;
};

export type ResolveOptions = {
  avifOk: boolean;
  webpOk: boolean;
  getImageSources: (image: string) => ImageSources;
};

/**
 * Resolve a candidate index list into concrete preload payloads (href + srcSet)
 * picking the best decodable format per the browser's capability flags.
 */
export function resolvePreloadCandidates(
  candidates: PreloadCandidate[],
  items: SimilarItem[],
  opts: ResolveOptions,
): ResolvedPreload[] {
  return candidates.flatMap(({ idx, priority }) => {
    const item = items[idx];
    if (!item?.image) return [];
    const s = opts.getImageSources(item.image);
    let href: string;
    let type: string;
    let srcSet: string | undefined;
    if (opts.avifOk && s.avif) {
      href = s.avif;
      type = "image/avif";
      srcSet = s.avifSrcSet;
    } else if (opts.webpOk && s.webp) {
      href = s.webp;
      type = "image/webp";
      srcSet = s.webpSrcSet;
    } else {
      href = s.jpg;
      type = "image/jpeg";
      srcSet = s.jpgSrcSet;
    }
    const dedupKey = `${href}::${srcSet ?? ""}`;
    return [{ idx, priority, item, href, type, srcSet, dedupKey }];
  });
}

export type PreloadDecision =
  | { decision: "emit"; item: SimilarItem; idx: number; href: string; dedupKey: string; priority: "high" | "low" }
  | { decision: "duplicate"; item: SimilarItem; idx: number; href: string; dedupKey: string; priority: "high" | "low" };

/**
 * Filter resolved preloads against the warmed-set, mutating both the set and
 * the running stats. This mirrors exactly what the route renders inline so
 * tests can drive it without mounting the carousel.
 *
 * Pass `onDecision` to receive a per-candidate trace (used by the debug
 * overlay / console logger). It runs synchronously inside the filter so the
 * function stays pure & test-friendly when no callback is supplied.
 */
export function filterDuplicates(
  resolved: ResolvedPreload[],
  warmed: Set<string>,
  stats: PreloadStats,
  onDecision?: (d: PreloadDecision) => void,
): ResolvedPreload[] {
  stats.evaluations += 1;
  return resolved.filter((r) => {
    const { dedupKey, item, idx, href, priority } = r;
    if (warmed.has(dedupKey)) {
      stats.duplicates += 1;
      onDecision?.({ decision: "duplicate", item, idx, href, dedupKey, priority });
      return false;
    }
    warmed.add(dedupKey);
    stats.emitted += 1;
    onDecision?.({ decision: "emit", item, idx, href, dedupKey, priority });
    return true;
  });
}

