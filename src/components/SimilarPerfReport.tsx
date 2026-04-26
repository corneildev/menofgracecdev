import { useEffect, useState } from "react";

/**
 * Dev-only performance report for the similar-products carousel.
 *
 * Tracks:
 *  - LCP (Largest Contentful Paint) of the page
 *  - Total bytes transferred for thumbnail images (filtered to /assets/* image files)
 *  - Format hit-rate: AVIF / WebP / JPG (which format the browser actually picked)
 *
 * Renders a small fixed overlay in dev only; logs to console as well.
 * Returns `null` outside dev or on the server.
 */
type FormatCounts = { avif: number; webp: number; jpg: number; other: number };

type Report = {
  lcpMs: number | null;
  thumbBytes: number;
  thumbCount: number;
  formats: FormatCounts;
};

const isImageAsset = (url: string) =>
  /\/assets\/.+\.(avif|webp|jpe?g|png)(\?|$)/i.test(url);

const detectFormat = (url: string): keyof FormatCounts => {
  const m = url.match(/\.(avif|webp|jpe?g|png)(?:\?|$)/i);
  if (!m) return "other";
  const ext = m[1].toLowerCase();
  if (ext === "avif") return "avif";
  if (ext === "webp") return "webp";
  if (ext === "jpg" || ext === "jpeg") return "jpg";
  return "other";
};

export function SimilarPerfReport({ enabled = true }: { enabled?: boolean }) {
  const [report, setReport] = useState<Report>({
    lcpMs: null,
    thumbBytes: 0,
    thumbCount: 0,
    formats: { avif: 0, webp: 0, jpg: 0, other: 0 },
  });

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;
    if (!import.meta.env.DEV) return;
    if (typeof PerformanceObserver === "undefined") return;

    let lcpObserver: PerformanceObserver | null = null;
    let resObserver: PerformanceObserver | null = null;
    const seen = new Set<string>();

    // --- LCP ---
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceEntry[];
        const last = entries[entries.length - 1] as PerformanceEntry & {
          startTime: number;
        };
        if (last) {
          setReport((r) => ({ ...r, lcpMs: Math.round(last.startTime) }));
        }
      });
      lcpObserver.observe({
        type: "largest-contentful-paint",
        buffered: true,
      } as PerformanceObserverInit);
    } catch {
      // Browser doesn't support LCP — skip silently.
    }

    // --- Resource bytes + format hit-rate ---
    try {
      const ingest = (entries: PerformanceEntryList) => {
        let deltaBytes = 0;
        let deltaCount = 0;
        const deltaFmt: FormatCounts = { avif: 0, webp: 0, jpg: 0, other: 0 };
        for (const e of entries) {
          const r = e as PerformanceResourceTiming;
          if (!isImageAsset(r.name)) continue;
          if (seen.has(r.name)) continue;
          seen.add(r.name);
          // transferSize is 0 for cached responses; encodedBodySize is the
          // payload before decoding — best estimate when warm.
          const bytes = r.transferSize > 0 ? r.transferSize : r.encodedBodySize;
          deltaBytes += bytes;
          deltaCount += 1;
          deltaFmt[detectFormat(r.name)] += 1;
        }
        if (deltaCount === 0) return;
        setReport((prev) => ({
          ...prev,
          thumbBytes: prev.thumbBytes + deltaBytes,
          thumbCount: prev.thumbCount + deltaCount,
          formats: {
            avif: prev.formats.avif + deltaFmt.avif,
            webp: prev.formats.webp + deltaFmt.webp,
            jpg: prev.formats.jpg + deltaFmt.jpg,
            other: prev.formats.other + deltaFmt.other,
          },
        }));
      };

      // Replay any resources already loaded before mount.
      ingest(performance.getEntriesByType("resource"));

      resObserver = new PerformanceObserver((list) => ingest(list.getEntries()));
      resObserver.observe({ type: "resource", buffered: true } as PerformanceObserverInit);
    } catch {
      // Browser doesn't support resource timing — skip silently.
    }

    return () => {
      lcpObserver?.disconnect();
      resObserver?.disconnect();
    };
  }, [enabled]);

  // Log a single summary line whenever the report meaningfully changes.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (report.thumbCount === 0 && report.lcpMs === null) return;
    const total = report.formats.avif + report.formats.webp + report.formats.jpg;
    const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
    // eslint-disable-next-line no-console
    console.info(
      `[similar-perf] LCP=${report.lcpMs ?? "…"}ms  thumbs=${report.thumbCount} (${(report.thumbBytes / 1024).toFixed(1)} KB)  AVIF ${pct(report.formats.avif)}% / WebP ${pct(report.formats.webp)}% / JPG ${pct(report.formats.jpg)}%`,
    );
  }, [report]);

  if (!import.meta.env.DEV) return null;

  const total =
    report.formats.avif + report.formats.webp + report.formats.jpg + report.formats.other;
  const pct = (n: number) => (total === 0 ? 0 : Math.round((n / total) * 100));
  const kb = (report.thumbBytes / 1024).toFixed(1);

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-3 right-3 z-50 max-w-[280px] rounded-md border border-bone/20 bg-ink/90 px-3 py-2 text-[10px] font-mono leading-relaxed text-bone/80 shadow-lg backdrop-blur"
    >
      <div className="mb-1 text-bone uppercase tracking-[0.15em] text-[9px]">
        Similar perf (dev)
      </div>
      <div>LCP: {report.lcpMs !== null ? `${report.lcpMs} ms` : "measuring…"}</div>
      <div>
        Thumbs: {report.thumbCount} · {kb} KB
      </div>
      <div>
        AVIF {pct(report.formats.avif)}% · WebP {pct(report.formats.webp)}% · JPG{" "}
        {pct(report.formats.jpg)}%
      </div>
    </div>
  );
}
