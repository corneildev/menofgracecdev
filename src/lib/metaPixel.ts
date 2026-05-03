type MetaTrackOptions = Record<string, unknown>;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _mogMetaPixelInitialized?: boolean;
  }
}

function pixelId(): string | null {
  const id = import.meta.env.VITE_META_PIXEL_ID;
  return typeof id === "string" && id.trim().length > 0 ? id.trim() : null;
}

function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem("mog:cookie-consent") === "accepted";
}

export function initMetaPixel() {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  const id = pixelId();
  if (!id || window._mogMetaPixelInitialized) return;

  ((
    f,
    b,
    e,
    v,
    n?: (...args: unknown[]) => void,
    t?: HTMLScriptElement,
    s?: Element,
  ) => {
    if ((f as Window).fbq) return;
    n = function (...args: unknown[]) {
      if ((n as { callMethod?: (...a: unknown[]) => void }).callMethod) {
        (n as unknown as { callMethod: (...a: unknown[]) => void }).callMethod(
          ...args,
        );
      } else {
        ((n as { queue?: unknown[] }).queue ||= []).push(args);
      }
    };
    (f as Window).fbq = n as (...args: unknown[]) => void;
    (n as { push?: (...a: unknown[]) => void }).push = n as (
      ...a: unknown[]
    ) => void;
    (n as { loaded?: boolean }).loaded = true;
    (n as { version?: string }).version = "2.0";
    (n as { queue?: unknown[] }).queue = [];
    t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );

  window.fbq?.("init", id);
  window._mogMetaPixelInitialized = true;
}

export function trackMetaPageView() {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  window.fbq?.("track", "PageView");
}

export function trackMetaEvent(eventName: string, options?: MetaTrackOptions) {
  if (typeof window === "undefined") return;
  if (!hasConsent()) return;
  window.fbq?.("track", eventName, options ?? {});
}
