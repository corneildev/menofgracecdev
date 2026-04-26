/**
 * Floating debug overlay that visualises the persisted preload-dedup stats
 * from `src/lib/preloadStatsStore.ts`.
 *
 * Activation matches `isPreloadDebugEnabled()` (`?preloadDebug=1` or
 * `localStorage["lovable:preloadDebug"]="1"`). When inactive, this component
 * renders nothing and pays no runtime cost beyond the toggle check.
 *
 * Shows the *current* session at the top (live counters + emitted hrefs) and
 * the rolling history of the last few sessions, with a one-click "clear"
 * button to wipe localStorage. Auto-refreshes every second to pick up the
 * counter updates the route writes synchronously inside the dedup filter.
 */

import { useEffect, useState } from "react";
import { isPreloadDebugEnabled } from "@/lib/preloadDebug";
import {
  readAllSessions,
  clearStoredStats,
  type PreloadSession,
} from "@/lib/preloadStatsStore";

type Props = {
  currentSessionId: string | null;
};

export function PreloadDebugOverlay({ currentSessionId }: Props) {
  const [enabled] = useState(() => isPreloadDebugEnabled());
  const [collapsed, setCollapsed] = useState(false);
  const [sessions, setSessions] = useState<PreloadSession[]>([]);

  useEffect(() => {
    if (!enabled) return;
    const tick = () => setSessions(readAllSessions());
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  const current =
    currentSessionId !== null
      ? sessions.find((s) => s.sessionId === currentSessionId)
      : undefined;
  const history = sessions
    .filter((s) => s.sessionId !== currentSessionId)
    .slice()
    .reverse()
    .slice(0, 5);

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] w-[360px] max-h-[70vh] overflow-auto bg-black/90 text-white text-[11px] font-mono border border-white/20 shadow-2xl backdrop-blur"
      role="region"
      aria-label="Preload debug overlay"
    >
      <div className="sticky top-0 flex items-center justify-between gap-2 px-3 py-2 bg-black/90 border-b border-white/10">
        <span className="font-semibold tracking-wide">preload · dedup stats</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="px-2 py-0.5 border border-white/30 hover:bg-white/10"
            aria-label={collapsed ? "Expand overlay" : "Collapse overlay"}
          >
            {collapsed ? "▾" : "▴"}
          </button>
          <button
            type="button"
            onClick={() => {
              clearStoredStats();
              setSessions([]);
            }}
            className="px-2 py-0.5 border border-white/30 hover:bg-white/10"
            aria-label="Clear stored preload stats"
          >
            clear
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="p-3 space-y-4">
          <SessionBlock title="current session" session={current} highlight />
          {history.length > 0 && (
            <div>
              <div className="opacity-60 mb-1">recent sessions ({history.length})</div>
              <div className="space-y-3">
                {history.map((s) => (
                  <SessionBlock key={s.sessionId} title={s.productId} session={s} />
                ))}
              </div>
            </div>
          )}
          {!current && history.length === 0 && (
            <div className="opacity-60">No sessions recorded yet.</div>
          )}
        </div>
      )}
    </div>
  );
}

function SessionBlock({
  title,
  session,
  highlight,
}: {
  title: string;
  session: PreloadSession | undefined;
  highlight?: boolean;
}) {
  if (!session) {
    return (
      <div className={`border ${highlight ? "border-emerald-400/40" : "border-white/15"} p-2`}>
        <div className="opacity-60">{title}: (no data)</div>
      </div>
    );
  }
  const startedAt = new Date(session.startedAt).toLocaleTimeString();
  const updatedAt = new Date(session.lastUpdatedAt).toLocaleTimeString();
  return (
    <div
      className={`border ${highlight ? "border-emerald-400/60" : "border-white/15"} p-2`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={highlight ? "text-emerald-300" : "text-white"}>{title}</span>
        <span className="opacity-50">{session.sessionId.slice(-6)}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <Stat label="emitted" value={session.emitted} tone="good" />
        <Stat label="deduped" value={session.duplicates} tone="warn" />
        <Stat label="evals" value={session.evaluations} />
      </div>
      <div className="opacity-60 mb-2">
        started {startedAt} · updated {updatedAt}
      </div>
      {session.emittedHrefs.length > 0 && (
        <details>
          <summary className="cursor-pointer opacity-80">
            {session.emittedHrefs.length} unique href(s)
          </summary>
          <ul className="mt-1 space-y-0.5 pl-3 list-disc opacity-80 break-all">
            {session.emittedHrefs.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </details>
      )}
      {session.events.length > 0 && (
        <details className="mt-1">
          <summary className="cursor-pointer opacity-80">
            event log ({session.events.length})
          </summary>
          <ul className="mt-1 space-y-0.5 pl-3 opacity-70 break-all">
            {session.events.slice(-12).map((e, i) => (
              <li key={`${e.at}-${i}`}>
                <span className="opacity-60">
                  {new Date(e.at).toLocaleTimeString()}
                </span>{" "}
                <span
                  className={
                    e.kind === "emit"
                      ? "text-emerald-300"
                      : e.kind === "duplicate"
                      ? "text-amber-300"
                      : "text-sky-300"
                  }
                >
                  {e.kind}
                </span>
                {e.detail ? ` ${JSON.stringify(e.detail)}` : ""}
              </li>
            ))}
          </ul>
        </details>
      )}
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
