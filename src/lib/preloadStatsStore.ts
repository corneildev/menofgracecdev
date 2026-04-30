/**
 * Per-carousel-session preload statistics, persisted to localStorage.
 *
 * One "session" = one product page visit. We keep a rolling history of the
 * last N sessions so the debug overlay can show recent runs at a glance and
 * developers can compare currency switches / filter changes across loads.
 *
 * Storage shape (key: "lovable:preloadStats:v1"):
 *   {
 *     sessions: [{
 *       sessionId,        // random per visit
 *       productId,
 *       startedAt,        // ISO
 *       lastUpdatedAt,    // ISO
 *       evaluations,      // # of render-time filter runs
 *       emitted,          // # of <link> tags actually rendered
 *       duplicates,       // # of candidates blocked by the dedup gate
 *       emittedHrefs,     // unique hrefs emitted in this session
 *       events: [{ at, kind, detail }]   // capped event log
 *     }]
 *   }
 *
 * The module is dependency-free, SSR-safe (no-ops without `window`), and
 * tree-shakes cleanly when the debug overlay is not imported.
 */

const STORAGE_KEY = "lovable:preloadStats:v1";
const MAX_SESSIONS = 10;
const MAX_EVENTS_PER_SESSION = 50;

export type PreloadEventKind =
  | "session-start"
  | "session-reset"
  | "emit"
  | "duplicate"
  | "flush"
  | "threshold-fail";

export type PreloadEvent = {
  at: string; // ISO
  kind: PreloadEventKind;
  detail?: Record<string, unknown>;
};

export type PreloadSession = {
  sessionId: string;
  productId: string;
  startedAt: string;
  lastUpdatedAt: string;
  evaluations: number;
  emitted: number;
  duplicates: number;
  emittedHrefs: string[];
  events: PreloadEvent[];
};

export type PreloadStatsStore = {
  sessions: PreloadSession[];
};

function safeRead(): PreloadStatsStore {
  if (typeof window === "undefined") return { sessions: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { sessions: [] };
    const parsed = JSON.parse(raw) as PreloadStatsStore;
    if (!parsed || !Array.isArray(parsed.sessions)) return { sessions: [] };
    return parsed;
  } catch {
    return { sessions: [] };
  }
}

function safeWrite(store: PreloadStatsStore) {
  if (typeof window === "undefined") return;
  try {
    // Trim to the most recent MAX_SESSIONS entries before writing.
    const trimmed: PreloadStatsStore = {
      sessions: store.sessions.slice(-MAX_SESSIONS),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Quota exceeded or storage disabled — silently drop.
  }
}

/**
 * Begin a new session for the given product. Returns the session id; pass
 * it to subsequent record* calls. Idempotent if called twice for the same
 * product within ~1s (StrictMode double-mount).
 */
export function startSession(productId: string): string {
  if (typeof window === "undefined") {
    return "ssr";
  }
  const store = safeRead();
  const now = new Date();
  const last = store.sessions[store.sessions.length - 1];
  if (
    last &&
    last.productId === productId &&
    now.getTime() - new Date(last.startedAt).getTime() < 1000
  ) {
    return last.sessionId;
  }
  const sessionId = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`;
  const session: PreloadSession = {
    sessionId,
    productId,
    startedAt: now.toISOString(),
    lastUpdatedAt: now.toISOString(),
    evaluations: 0,
    emitted: 0,
    duplicates: 0,
    emittedHrefs: [],
    events: [
      { at: now.toISOString(), kind: "session-start", detail: { productId } },
    ],
  };
  store.sessions.push(session);
  safeWrite(store);
  return sessionId;
}

function updateSession(
  sessionId: string,
  mutator: (s: PreloadSession) => void,
) {
  if (typeof window === "undefined") return;
  const store = safeRead();
  const idx = store.sessions.findIndex((s) => s.sessionId === sessionId);
  if (idx === -1) return;
  const session = store.sessions[idx];
  mutator(session);
  session.lastUpdatedAt = new Date().toISOString();
  if (session.events.length > MAX_EVENTS_PER_SESSION) {
    session.events = session.events.slice(-MAX_EVENTS_PER_SESSION);
  }
  store.sessions[idx] = session;
  safeWrite(store);
}

export function recordEmit(
  sessionId: string,
  detail: { idx: number; productId: string; href: string; priority: string },
) {
  updateSession(sessionId, (s) => {
    s.emitted += 1;
    if (!s.emittedHrefs.includes(detail.href)) s.emittedHrefs.push(detail.href);
    s.events.push({ at: new Date().toISOString(), kind: "emit", detail });
  });
}

export function recordDuplicate(
  sessionId: string,
  detail: { idx: number; productId: string; href: string; priority: string },
) {
  updateSession(sessionId, (s) => {
    s.duplicates += 1;
    s.events.push({ at: new Date().toISOString(), kind: "duplicate", detail });
  });
}

export function recordFlush(
  sessionId: string,
  detail: { evaluations: number; reason: string },
) {
  updateSession(sessionId, (s) => {
    s.evaluations = detail.evaluations;
    s.events.push({ at: new Date().toISOString(), kind: "flush", detail });
  });
}

export function recordReset(sessionId: string, reason: string) {
  updateSession(sessionId, (s) => {
    s.events.push({
      at: new Date().toISOString(),
      kind: "session-reset",
      detail: { reason },
    });
  });
}

export function readAllSessions(): PreloadSession[] {
  return safeRead().sessions;
}

export function readSession(sessionId: string): PreloadSession | undefined {
  return safeRead().sessions.find((s) => s.sessionId === sessionId);
}

export function clearStoredStats() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
