/**
 * Cross-browser preload uniqueness test.
 *
 * Visits a product page with the dev-only `?forceCarousel=1` flag (so the
 * similar-products carousel renders without needing a sold-out product),
 * exercises the currency switcher and the collection / price filters, and
 * asserts that no `<link rel="preload" as="image">` href is ever emitted
 * twice during the session — the exact regression we hardened against in
 * src/lib/preloadDedup.ts.
 *
 * Runs against Chromium AND WebKit (Safari engine) so we catch any
 * Safari-specific preload behaviour the unit tests can't see.
 *
 * Usage:
 *   bunx playwright install chromium webkit          # one-time
 *   BASE_URL=http://localhost:8080 bunx playwright test tests/preload-uniqueness.spec.ts
 *
 * The default BASE_URL targets the local Vite dev server. Point it at a
 * preview/staging URL to validate a deployed build. The product slug is
 * configurable via PRODUCT_SLUG (default: "onyx-double-breasted").
 */

import { test, expect, type Page, type BrowserContext } from "@playwright/test";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:8080";
const PRODUCT_SLUG = process.env.PRODUCT_SLUG ?? "onyx-double-breasted";

type PreloadRecord = {
  href: string;
  imagesrcset: string;
  fetchpriority: string;
  /** dedupKey mirrors the production logic: href + "::" + srcSet */
  dedupKey: string;
  /** Render tick when first observed — useful for debugging duplicates. */
  firstSeenAt: number;
};

/**
 * Snapshot every `<link rel="preload" as="image">` currently in the DOM.
 * We use the exact same dedup key shape as src/lib/preloadDedup.ts so any
 * mismatch here is meaningful.
 */
async function snapshotPreloads(page: Page, tick: number): Promise<PreloadRecord[]> {
  return page.evaluate((t) => {
    const links = Array.from(
      document.querySelectorAll<HTMLLinkElement>('link[rel="preload"][as="image"]'),
    );
    return links.map((l) => {
      const href = l.href;
      const imagesrcset = l.getAttribute("imagesrcset") ?? "";
      return {
        href,
        imagesrcset,
        fetchpriority: l.getAttribute("fetchpriority") ?? "",
        dedupKey: `${href}::${imagesrcset}`,
        firstSeenAt: t,
      };
    });
  }, tick);
}

/**
 * Merge a fresh snapshot into the running history; only records dedup keys
 * not seen before. Returns any *new* duplicates observed in this snapshot
 * (the same dedupKey appearing more than once *within* one render).
 */
function mergeSnapshot(
  history: Map<string, PreloadRecord>,
  snapshot: PreloadRecord[],
): { intraRenderDuplicates: PreloadRecord[]; newlyAdded: PreloadRecord[] } {
  const seenInThisSnapshot = new Set<string>();
  const intraRenderDuplicates: PreloadRecord[] = [];
  const newlyAdded: PreloadRecord[] = [];
  for (const rec of snapshot) {
    if (seenInThisSnapshot.has(rec.dedupKey)) {
      intraRenderDuplicates.push(rec);
      continue;
    }
    seenInThisSnapshot.add(rec.dedupKey);
    if (!history.has(rec.dedupKey)) {
      history.set(rec.dedupKey, rec);
      newlyAdded.push(rec);
    }
  }
  return { intraRenderDuplicates, newlyAdded };
}

/**
 * Click the named filter button (currency / collection / price) and wait
 * for React to commit before snapshotting. Embla + React 19 transitions
 * settle within a microtask, but we add a short rAF wait to be safe across
 * Chromium and WebKit timings.
 */
async function clickFilter(page: Page, name: string) {
  await page
    .getByRole("button", { name, exact: true })
    .first()
    .click();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

async function gotoCarousel(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  // Forward browser console for easier triage when an assertion fails.
  page.on("console", (msg) => {
    if (msg.type() === "error" || msg.type() === "warning") {
      // eslint-disable-next-line no-console
      console.log(`[browser:${msg.type()}]`, msg.text());
    }
  });
  await page.goto(
    `${BASE_URL}/collection/${PRODUCT_SLUG}?forceCarousel=1&preloadDebug=1`,
    { waitUntil: "domcontentloaded" },
  );
  // The carousel renders below the fold; scroll to it so `carouselNear`
  // becomes true and the LCP+near-viewport preloads fire.
  await page.getByRole("group", { name: "Devise" }).scrollIntoViewIfNeeded();
  // Allow the IntersectionObserver to flip carouselNear=true and React to commit.
  await page.waitForTimeout(400);
  return page;
}

for (const browserName of ["chromium", "webkit"] as const) {
  test.describe(`[${browserName}] similar-products preload uniqueness`, () => {
    test.use({ browserName });

    test("currency + filter changes never emit duplicate preload tags", async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 }, // iPhone 14 — mobile path
      });
      const page = await gotoCarousel(context);

      const history = new Map<string, PreloadRecord>();
      let tick = 0;
      const allDuplicates: PreloadRecord[] = [];

      const snapshotAndMerge = async (label: string) => {
        tick += 1;
        const snap = await snapshotPreloads(page, tick);
        const { intraRenderDuplicates, newlyAdded } = mergeSnapshot(history, snap);
        // eslint-disable-next-line no-console
        console.log(
          `  · [${label}] tags=${snap.length} new=${newlyAdded.length} intra-dup=${intraRenderDuplicates.length}`,
        );
        if (intraRenderDuplicates.length > 0) {
          allDuplicates.push(...intraRenderDuplicates);
        }
      };

      await snapshotAndMerge("initial render");

      // 1) Currency sweep — should re-render the carousel (price labels change)
      //    but NOT change image URLs, so no new preloads should appear.
      const baselineSize = history.size;
      for (const cur of ["usd", "eur", "fcfa"]) {
        await clickFilter(page, cur);
        await snapshotAndMerge(`currency=${cur}`);
      }
      expect(
        history.size,
        "currency switching must not introduce new preload hrefs",
      ).toBe(baselineSize);

      // 2) Collection filter sweep — changes the dataset, so new images may
      //    appear. The invariant is uniqueness per dedupKey, not "no growth".
      const collectionButtons = await page
        .getByRole("group", { name: "Collection" })
        .getByRole("button")
        .allInnerTexts();
      for (const label of collectionButtons.slice(0, 4)) {
        await clickFilter(page, label.trim());
        await snapshotAndMerge(`collection=${label.trim()}`);
      }

      // 3) Price tier sweep.
      for (const label of ["Tous", "− abordable", "Équivalent", "+ premium"]) {
        await clickFilter(page, label);
        await snapshotAndMerge(`price=${label}`);
      }

      // 4) Re-apply the original currency to simulate the round-trip the
      //    user took earlier in the session — must still be a no-op for hrefs.
      const sizeBeforeRoundTrip = history.size;
      await clickFilter(page, "fcfa");
      await snapshotAndMerge("currency=fcfa (round-trip)");
      expect(
        history.size,
        "round-trip currency must not introduce new preload hrefs",
      ).toBe(sizeBeforeRoundTrip);

      // Final assertion: at no point did a snapshot contain duplicate keys.
      expect(
        allDuplicates,
        `duplicate preload tags detected:\n${allDuplicates
          .map((d) => `  ${d.dedupKey} (firstSeenAt=${d.firstSeenAt})`)
          .join("\n")}`,
      ).toEqual([]);

      await context.close();
    });
  });
}
