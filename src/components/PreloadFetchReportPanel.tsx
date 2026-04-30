/**
 * In-app report panel: counts actual image network fetches per preload
 * candidate during the current carousel session, flags duplicates, and
 * highlights any preloaded URL the browser never used.
 *
 * Activation matches the rest of the preload-debug suite: visible whenever
 * `?preloadDebug=1` (or `localStorage["lovable:preloadDebug"]="1"`) is set,
 * so it works on mobile Safari + iPhone home-screen PWAs without dev tools.
 *
 * Reads the per-session emitted hrefs from the persisted stats store and
 * walks the Resource Timing buffer every 2s — no PerformanceObserver hook
 * needed because resource entries persist for the page's lifetime.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { isPreloadDebugEnabled } from "@/lib/preloadDebug";
import { readSession, recordThresholdFailure } from "@/lib/preloadStatsStore";
import {
  buildFetchReport,
  type FetchReport,
  type FetchCount,
} from "@/lib/preloadFetchReport";
import {
  loadThresholds,
  evaluateThresholds,
  type PreloadThresholds,
  type ThresholdEvaluation,
} from "@/lib/preloadThresholds";

type Props = {
  currentSessionId: string | null;
  /** Polling interval for refreshing the report. Default 2000ms. */
  intervalMs?: number;
  /** Override thresholds; defaults to URL/localStorage/defaults. */
  thresholds?: PreloadThresholds;
};

export function PreloadFetchReportPanel({ currentSessionId, intervalMs = 2000 }: Props) {
  const [enabled] = useState(() => isPreloadDebugEnabled());
  const [report, setReport] = useState<FetchReport | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!enabled || !currentSessionId) return;
    const tick = () => {
      const session = readSession(currentSessionId);
      const expected = session?.emittedHrefs ?? [];
      setReport(buildFetchReport(expected));
    };
    tick();
    const id = window.setInterval(tick, intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, currentSessionId, intervalMs]);

  const rows = useMemo<FetchCount[]>(() => {
    if (!report) return [];
    return [...report.countsByUrl.values()]
      .filter((r) => r.wasPreloaded || r.count > 1)
      .sort((a, b) => {
        // Duplicates first, then preloaded, then by count desc.
        if (a.count !== b.count) return b.count - a.count;
        if (a.wasPreloaded !== b.wasPreloaded) return a.wasPreloaded ? -1 : 1;
        return a.url.localeCompare(b.url);
      });
  }, [report]);

  if (!enabled) return null;

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] w-[360px] max-h-[60vh] overflow-auto bg-black/90 text-white text-[11px] font-mono border border-white/20 shadow-2xl backdrop-blur"
      role="region"
      aria-label="Preload fetch report"
    >
      <div className="sticky top-0 flex items-center justify-between gap-2 px-3 py-2 bg-black/90 border-b border-white/10">
        <span className="font-semibold tracking-wide">preload · fetch report</span>
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="px-2 py-0.5 border border-white/30 hover:bg-white/10"
          aria-label={collapsed ? "Expand fetch report" : "Collapse fetch report"}
        >
          {collapsed ? "▾" : "▴"}
        </button>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3">
          {!report?.supported ? (
            <div className="opacity-70">
              Resource Timing API not available in this browser.
            </div>
          ) : (
            <>
              <Summary report={report} matchedRows={rows.length} />
              {report.duplicates.length > 0 && (
                <div className="border border-amber-400/60 p-2">
                  <div className="text-amber-300 mb-1">
                    ⚠ {report.duplicates.length} duplicate fetch(es)
                  </div>
                  <ul className="space-y-1 break-all">
                    {report.duplicates.map((d) => (
                      <li key={d.url}>
                        <span className="text-amber-300">×{d.count}</span>{" "}
                        {d.wasPreloaded && (
                          <span className="text-emerald-300">[preloaded] </span>
                        )}
                        {d.url}
                        <div className="opacity-60 pl-4">
                          startTimes: {d.startTimes.join(", ")}ms
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.unfetchedPreloads.length > 0 && (
                <div className="border border-sky-400/40 p-2">
                  <div className="text-sky-300 mb-1">
                    ⓘ {report.unfetchedPreloads.length} preload(s) not yet fetched
                  </div>
                  <ul className="space-y-0.5 break-all opacity-80">
                    {report.unfetchedPreloads.map((u) => (
                      <li key={u}>· {u}</li>
                    ))}
                  </ul>
                </div>
              )}
              <details>
                <summary className="cursor-pointer opacity-80">
                  per-candidate counts ({rows.length})
                </summary>
                <table className="w-full mt-2">
                  <thead>
                    <tr className="opacity-60 text-left">
                      <th className="pr-2">#</th>
                      <th className="pr-2">pre</th>
                      <th>url</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.url} className="align-top">
                        <td
                          className={`pr-2 ${
                            r.count > 1 ? "text-amber-300" : "text-emerald-300"
                          }`}
                        >
                          {r.count}
                        </td>
                        <td className="pr-2 opacity-70">
                          {r.wasPreloaded ? "✓" : "·"}
                        </td>
                        <td className="break-all opacity-90">{r.url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Summary({
  report,
  matchedRows,
}: {
  report: FetchReport;
  matchedRows: number;
}) {
  const total = report.countsByUrl.size;
  const fetched = [...report.countsByUrl.values()].reduce((n, r) => n + r.count, 0);
  return (
    <div className="grid grid-cols-3 gap-2">
      <Stat label="urls" value={total} />
      <Stat
        label="fetches"
        value={fetched}
        tone={report.duplicates.length > 0 ? "warn" : "good"}
      />
      <Stat label="rows" value={matchedRows} />
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "good" | "warn";
}) {
  const color =
    tone === "good"
      ? "text-emerald-300"
      : tone === "warn"
      ? "text-amber-300"
      : "text-white";
  return (
    <div className="border border-white/10 p-1.5 text-center">
      <div className={`text-base ${color}`}>{value}</div>
      <div className="opacity-60 text-[10px] uppercase tracking-wider">{label}</div>
    </div>
  );
}
