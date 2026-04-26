import { describe, it, expect } from "vitest";
import {
  resolvePreloadCandidates,
  filterDuplicates,
  type SimilarItem,
  type ImageSources,
  type PreloadStats,
} from "./preloadDedup";

// Stub `getImageSources` — returns deterministic URLs derived from the
// input path so tests can assert exact dedup keys.
const stubSources = (image: string): ImageSources => ({
  jpg: `${image}.jpg`,
  jpgSrcSet: `${image}-400.jpg 400w, ${image}-800.jpg 800w`,
  webp: `${image}.webp`,
  webpSrcSet: `${image}-400.webp 400w, ${image}-800.webp 800w`,
  avif: `${image}.avif`,
  avifSrcSet: `${image}-400.avif 400w, ${image}-800.avif 800w`,
});

const items: SimilarItem[] = [
  { id: "p1", image: "/img/p1" },
  { id: "p2", image: "/img/p2" },
  { id: "p3", image: "/img/p3" },
];

const candidates = [
  { idx: 0, priority: "high" as const },
  { idx: 1, priority: "low" as const },
  { idx: 2, priority: "low" as const },
];

const resolveOpts = { avifOk: true, webpOk: true, getImageSources: stubSources };

const newStats = (): PreloadStats => ({ emitted: 0, duplicates: 0, evaluations: 0 });

describe("preload dedup gate", () => {
  it("emits each candidate exactly once on the first render", () => {
    const warmed = new Set<string>();
    const stats = newStats();
    const resolved = resolvePreloadCandidates(candidates, items, resolveOpts);
    const out = filterDuplicates(resolved, warmed, stats);

    expect(out).toHaveLength(3);
    expect(stats.emitted).toBe(3);
    expect(stats.duplicates).toBe(0);
    expect(warmed.size).toBe(3);
  });

  it("emits zero duplicates across simulated currency-switch re-renders", () => {
    // Currency switching triggers re-renders but the image payload is
    // identical — every subsequent pass must be a full duplicate.
    const warmed = new Set<string>();
    const stats = newStats();

    for (let i = 0; i < 5; i++) {
      const resolved = resolvePreloadCandidates(candidates, items, resolveOpts);
      filterDuplicates(resolved, warmed, stats);
    }

    expect(stats.emitted).toBe(3); // only the initial pass produced tags
    expect(stats.duplicates).toBe(12); // 4 redundant passes × 3 candidates
    expect(stats.evaluations).toBe(5);
  });

  it("does not re-emit when a filter change adds a NEW first item that pushes existing items right", () => {
    // Filter widens the list: a new product becomes idx 0, the previous
    // idx 0 shifts to idx 1, etc. Only the genuinely new image should emit.
    const warmed = new Set<string>();
    const stats = newStats();

    filterDuplicates(
      resolvePreloadCandidates(candidates, items, resolveOpts),
      warmed,
      stats,
    );

    const widened: SimilarItem[] = [
      { id: "p0-new", image: "/img/p0-new" },
      ...items,
    ];
    const after = filterDuplicates(
      resolvePreloadCandidates(candidates, widened, resolveOpts),
      warmed,
      stats,
    );

    // Only the brand-new image emits; the two shifted items are duplicates.
    expect(after).toHaveLength(1);
    expect(after[0].item.id).toBe("p0-new");
    expect(stats.duplicates).toBe(2);
  });

  it("emits a fresh preload when a product variant swaps to a different image", () => {
    // Same product id but a new image URL (variant change) — the dedup key
    // is the resolved href, so this MUST re-emit.
    const warmed = new Set<string>();
    const stats = newStats();

    filterDuplicates(
      resolvePreloadCandidates(candidates, items, resolveOpts),
      warmed,
      stats,
    );

    const variantSwapped: SimilarItem[] = [
      { id: "p1", image: "/img/p1-variantB" },
      items[1],
      items[2],
    ];
    const after = filterDuplicates(
      resolvePreloadCandidates(candidates, variantSwapped, resolveOpts),
      warmed,
      stats,
    );

    expect(after).toHaveLength(1);
    expect(after[0].href).toBe("/img/p1-variantB.avif");
  });

  it("falls back through avif → webp → jpg and dedups per resolved format", () => {
    const warmed = new Set<string>();
    const stats = newStats();

    // First render: AVIF supported, picks .avif
    filterDuplicates(
      resolvePreloadCandidates(candidates, items, resolveOpts),
      warmed,
      stats,
    );
    // Second render: only WebP supported (different browser session would
    // never happen mid-page, but proves the key truly reflects the URL).
    const webpOnly = filterDuplicates(
      resolvePreloadCandidates(candidates, items, {
        ...resolveOpts,
        avifOk: false,
      }),
      warmed,
      stats,
    );

    expect(webpOnly).toHaveLength(3);
    expect(webpOnly[0].href.endsWith(".webp")).toBe(true);
  });
});
