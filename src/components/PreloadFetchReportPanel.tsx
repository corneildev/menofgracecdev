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
  canonicaliseUrl,
  ensureSessionResourceObserver,
  getSessionResourceObserverStatus,
  parseSrcSetUrls,
  type FetchReport,
  type FetchCount,
  type PreloadExpectation,
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

export function PreloadFetchReportPanel({ currentSessionId, intervalMs = 2000, thresholds }: Props) {
  const [enabled] = useState(() => isPreloadDebugEnabled());
  const [report, setReport] = useState<FetchReport | null>(null);
  const [expectations, setExpectations] = useState<PreloadExpectation[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const activeThresholds = useMemo<PreloadThresholds>(
    () => thresholds ?? loadThresholds(),
    [thresholds],
  );
  const lastBreachKeyRef = useRef<string>("");

  useEffect(() => {
    if (!enabled || !currentSessionId) return;
    // Defensive: make sure the session-long resource observer is running so
    // lazy/late image fetches stream into the report long after the initial
    // render. Idempotent — the route also calls this on session reset.
    ensureSessionResourceObserver();
    const tick = () => {
      const session = readSession(currentSessionId);
      const expected =
        session?.emittedEntries && session.emittedEntries.length > 0
          ? session.emittedEntries
          : (session?.emittedHrefs ?? []).map((href) => ({ href }));
      setExpectations(expected);
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

  const evaluation = useMemo<ThresholdEvaluation>(() => {
    return evaluateThresholds(
      {
        duplicateFetches: report?.duplicates.length ?? 0,
        unfetchedPreloads: report?.unfetchedPreloads.length ?? 0,
      },
      activeThresholds,
    );
  }, [report, activeThresholds]);

  // Log a session-level failure event whenever the breach signature changes
  // (so we don't spam the event log on every 2s poll when status is steady).
  useEffect(() => {
    if (!enabled || !currentSessionId) return;
    if (evaluation.status !== "fail") {
      lastBreachKeyRef.current = "";
      return;
    }
    const key = evaluation.breaches.map((b) => `${b.metric}:${b.observed}`).join("|");
    if (key === lastBreachKeyRef.current) return;
    lastBreachKeyRef.current = key;
    recordThresholdFailure(currentSessionId, {
      breaches: evaluation.breaches,
      thresholds: evaluation.thresholds,
      observed: {
        duplicateFetches: report?.duplicates.length ?? 0,
        unfetchedPreloads: report?.unfetchedPreloads.length ?? 0,
      },
    });
    // eslint-disable-next-line no-console
    console.warn(
      `%c[preload·threshold-fail] ${evaluation.breaches.map((b) => b.message).join(" · ")}`,
      "color:#f59e0b;font-weight:bold",
    );
  }, [enabled, currentSessionId, evaluation, report]);

  if (!enabled) return null;

  const failing = evaluation.status === "fail";
  const headerBg = failing ? "bg-amber-500/95 text-black" : "bg-black/90 text-white";

  return (
    <div
      className={`fixed bottom-4 left-4 z-[9999] w-[360px] max-h-[60vh] overflow-auto text-[11px] font-mono border ${
        failing ? "border-amber-300" : "border-white/20"
      } shadow-2xl backdrop-blur bg-black/90 text-white`}
      role="region"
      aria-label="Preload fetch report"
    >
      <div className={`sticky top-0 flex items-center justify-between gap-2 px-3 py-2 border-b border-white/10 ${headerBg}`}>
        <span className="font-semibold tracking-wide">
          preload · fetch report {failing ? "· ⚠ FAIL" : "· ✓ OK"}
        </span>
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
              <div className="text-[10px] opacity-70">
                thresholds: dup ≤ {evaluation.thresholds.duplicateFetches} · unfetched ≤{" "}
                {evaluation.thresholds.unfetchedPreloads}
              </div>
              {failing && (
                <div className="border border-amber-300 bg-amber-500/10 p-2 text-amber-200">
                  <div className="font-semibold mb-1">⚠ session failure</div>
                  <ul className="space-y-0.5">
                    {evaluation.breaches.map((b) => (
                      <li key={b.metric}>· {b.message}</li>
                    ))}
                  </ul>
                </div>
              )}
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
                <div className="border border-sky-400/40 p-2 space-y-2">
                  <div className="text-sky-300">
                    ⓘ {report.unfetchedPreloads.length} preload(s) not yet fetched
                  </div>
                  <p className="opacity-80 text-[10px] leading-relaxed">
                    A preload is flagged unfetched when none of the URLs it
                    advertised in <code>imagesrcset</code> appeared in the
                    Resource Timing buffer. Most often this means the{" "}
                    <code>&lt;picture&gt;</code> element picked a different
                    srcset variant (different width/DPR) than the preload
                    listed — same image, different file. The "likely
                    mismatched fetches" below are observed image requests
                    whose filename stem matches but whose variant doesn't.
                  </p>
                  <ul className="space-y-2 break-all">
                    {report.unfetchedDiagnostics.map((d) => (
                      <li key={d.primary} className="border-t border-white/10 pt-2">
                        <div className="opacity-90">· {d.primary}</div>
                        <details className="mt-1">
                          <summary className="cursor-pointer opacity-70 text-[10px]">
                            expected variants ({d.expectedVariants.length})
                          </summary>
                          <ul className="mt-1 space-y-0.5 opacity-70 pl-3">
                            {d.expectedVariants.map((v) => (
                              <li key={v}>
                                {v === d.primary ? "↳ primary" : "↳ srcset"} ·{" "}
                                {v}
                              </li>
                            ))}
                          </ul>
                        </details>
                        {d.likelyMismatchedFetches.length > 0 ? (
                          <div className="mt-1">
                            <div className="text-amber-300 text-[10px]">
                              ⚠ {d.likelyMismatchedFetches.length} likely
                              mismatched fetch(es)
                            </div>
                            <ul className="space-y-0.5 opacity-90 pl-3">
                              {d.likelyMismatchedFetches.map((m) => (
                                <li key={m.url}>
                                  <div className="opacity-60 text-[10px]">
                                    {m.reason}
                                  </div>
                                  <div>{m.url}</div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="opacity-60 text-[10px] mt-1">
                            no near-miss fetches observed yet — preload may
                            simply not have triggered (carousel scrolled past
                            before hydration, or network gate skipped it).
                          </div>
                        )}
                      </li>
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
  const obs = getSessionResourceObserverStatus();
  const obsAge = obs.startedAt ? Math.round((Date.now() - obs.startedAt) / 1000) : 0;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Stat label="urls" value={total} />
        <Stat
          label="fetches"
          value={fetched}
          tone={report.duplicates.length > 0 ? "warn" : "good"}
        />
        <Stat label="rows" value={matchedRows} />
      </div>
      <div className="text-[10px] opacity-70 flex items-center justify-between">
        <span>
          live observer:{" "}
          <span className={obs.active ? "text-emerald-300" : "text-amber-300"}>
            {obs.active ? "on" : "off"}
          </span>
        </span>
        <span>
          captured {obs.count} entr{obs.count === 1 ? "y" : "ies"}
          {obs.active && obsAge > 0 ? ` · ${obsAge}s` : ""}
        </span>
      </div>
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
