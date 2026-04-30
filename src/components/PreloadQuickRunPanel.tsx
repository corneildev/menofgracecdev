/**
 * In-page panel for the latest iPhone Safari quick-run snapshot.
 *
 * Reads from `lovable:preloadQuickRun:v1` (written by `runIphoneSafariQuickRun`)
 * and renders the most recent snapshot's emitted/duplicate decisions plus a
 * mini fetch summary. Visible whenever `?preloadDebug=1` is set so QA on
 * mobile Safari + iPhone PWA can inspect snapshots without devtools.
 *
 * Polls localStorage every 2s and also listens to the `storage` event so
 * a snapshot taken in another tab refreshes this panel live.
 */

import { useEffect, useState } from "react";
import { isPreloadDebugEnabled } from "@/lib/preloadDebug";
import {
  readQuickRunHistory,
  clearQuickRunHistory,
  type QuickRunSnapshot,
} from "@/lib/preloadQuickRun";
import { buildFetchReport } from "@/lib/preloadFetchReport";

export function PreloadQuickRunPanel() {
  const [enabled] = useState(() => isPreloadDebugEnabled());
  const [history, setHistory] = useState<QuickRunSnapshot[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => setHistory(readQuickRunHistory());
    tick();
    const id = window.setInterval(tick, 2000);
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === "lovable:preloadQuickRun:v1") tick();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("storage", onStorage);
    };
  }, [enabled]);

  if (!enabled) return null;

  const latest = history[history.length - 1];

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] w-[360px] max-h-[60vh] overflow-auto bg-black/90 text-white text-[11px] font-mono border border-white/20 shadow-2xl backdrop-blur"
      role="region"
      aria-label="Preload quick-run snapshot"
    >
      <div className="sticky top-0 flex items-center justify-between gap-2 px-3 py-2 bg-black/90 border-b border-white/10">
        <span className="font-semibold tracking-wide">
          preload · quick-run{" "}
          {history.length > 0 && (
            <span className="opacity-60">({history.length})</span>
          )}
        </span>
        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearQuickRunHistory();
                setHistory([]);
              }}
              className="px-2 py-0.5 border border-white/30 hover:bg-white/10"
              aria-label="Clear quick-run history"
            >
              clear
            </button>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="px-2 py-0.5 border border-white/30 hover:bg-white/10"
            aria-label={collapsed ? "Expand quick-run panel" : "Collapse quick-run panel"}
          >
            {collapsed ? "▾" : "▴"}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-3">
          {!latest ? (
            <div className="opacity-70">
              No snapshot yet — click <span className="text-sky-300">⚡ iPhone Safari quick-run</span>.
            </div>
          ) : (
            <SnapshotView snapshot={latest} />
          )}
        </div>
      )}
    </div>
  );
}

function SnapshotView({ snapshot }: { snapshot: QuickRunSnapshot }) {
  const emits = snapshot.decisions.filter((d) => d.decision === "emit");
  const dupes = snapshot.decisions.filter((d) => d.decision === "duplicate");
  return (
    <div className="space-y-3">
      <header className="space-y-1">
        <div className="opacity-80">
          <span className="text-sky-300">{snapshot.profile.label}</span>
        </div>
        <div className="opacity-60 text-[10px]">
          {new Date(snapshot.takenAt).toLocaleString()} · product{" "}
          <span className="opacity-90">{snapshot.productId}</span>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="emitted" value={snapshot.emitted} tone="good" />
        <Stat
          label="dupes"
          value={snapshot.duplicates}
          tone={snapshot.duplicates > 0 ? "warn" : "neutral"}
        />
        <Stat label="cands" value={snapshot.rawCandidateCount} />
      </div>

      {emits.length > 0 && (
        <section>
          <div className="text-emerald-300 mb-1">✅ emitted ({emits.length})</div>
          <ul className="space-y-1 break-all">
            {emits.map((d, i) => (
              <li key={`emit-${i}`}>
                <span className="opacity-60">idx {d.idx}</span>{" "}
                <span className="opacity-70">[{d.priority}]</span>{" "}
                <span className="opacity-90">{d.productId}</span>
                <div className="opacity-70 pl-4">{d.href}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dupes.length > 0 && (
        <section>
          <div className="text-amber-300 mb-1">♻️ duplicates ({dupes.length})</div>
          <ul className="space-y-1 break-all">
            {dupes.map((d, i) => (
              <li key={`dupe-${i}`}>
                <span className="opacity-60">idx {d.idx}</span>{" "}
                <span className="opacity-70">[{d.priority}]</span>{" "}
                <span className="opacity-90">{d.productId}</span>
                <div className="opacity-70 pl-4">{d.href}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="border-t border-white/10 pt-2">
        <div className="opacity-80 mb-1">fetch report</div>
        {!snapshot.fetchReport.supported ? (
          <div className="opacity-60">Resource Timing API not supported.</div>
        ) : (
          <div className="space-y-1">
            <div>
              tracked URLs:{" "}
              <span className="text-white">
                {snapshot.fetchReport.totalTrackedUrls}
              </span>
            </div>
            <div>
              duplicate URLs:{" "}
              <span
                className={
                  snapshot.fetchReport.duplicateUrls.length > 0
                    ? "text-amber-300"
                    : "text-emerald-300"
                }
              >
                {snapshot.fetchReport.duplicateUrls.length}
              </span>
            </div>
            <div>
              unfetched preloads:{" "}
              <span
                className={
                  snapshot.fetchReport.unfetchedPreloads.length > 0
                    ? "text-amber-300"
                    : "text-emerald-300"
                }
              >
                {snapshot.fetchReport.unfetchedPreloads.length}
              </span>
            </div>
          </div>
        )}
      </section>

      <details className="opacity-80">
        <summary className="cursor-pointer">user agent</summary>
        <div className="mt-1 break-all opacity-70">{snapshot.userAgent}</div>
      </details>
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
  tone?: "good" | "warn" | "neutral";
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
