/**
 * One-time runtime detection for modern image formats.
 *
 * Why: <link rel="preload" as="image" type="image/avif" imagesrcset="…">
 * is wasted bytes on a browser that won't actually decode AVIF (the matching
 * <picture> <source> will be skipped, so the preload never resolves to the
 * <img> fetch). By picking a `type` the browser can decode, we guarantee the
 * preload primes the same network request the <picture> will issue.
 *
 * Detection uses the canonical 1-pixel encodings; results are cached so the
 * decode runs at most once per format, per session. SSR-safe (returns
 * `unknown` until first browser tick).
 */

type FormatSupport = "supported" | "unsupported" | "unknown";

const TEST_IMAGES: Record<"avif" | "webp", string> = {
  // 1x1 AVIF (transparent) — minimal valid bitstream.
<<<<<<< HEAD
  avif:
    "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",
=======
  avif: "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=",
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  // 1x1 WebP (lossy).
  webp: "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vshgAA=",
};

const cache: Record<"avif" | "webp", FormatSupport> = {
  avif: "unknown",
  webp: "unknown",
};

const inflight: Partial<Record<"avif" | "webp", Promise<FormatSupport>>> = {};

function probe(format: "avif" | "webp"): Promise<FormatSupport> {
  if (cache[format] !== "unknown") return Promise.resolve(cache[format]);
  if (inflight[format]) return inflight[format]!;
  if (typeof Image === "undefined") return Promise.resolve("unknown");

  const p = new Promise<FormatSupport>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ok = img.width > 0 && img.height > 0;
      cache[format] = ok ? "supported" : "unsupported";
      resolve(cache[format]);
    };
    img.onerror = () => {
      cache[format] = "unsupported";
      resolve("unsupported");
    };
    img.src = TEST_IMAGES[format];
  });
  inflight[format] = p;
  return p;
}

/** Fire-and-forget warm-up; lets later sync `getFormatSupport` calls return `supported`/`unsupported`. */
export function detectImageFormats(): void {
  if (typeof window === "undefined") return;
  void probe("avif");
  void probe("webp");
}

/** Sync read of the cached result. Returns "unknown" until the probe resolves. */
export function getFormatSupport(format: "avif" | "webp"): FormatSupport {
  return cache[format];
}
