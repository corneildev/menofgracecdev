import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductImageRow, ProductVideoRow } from "@/lib/products";

export type MediaItem =
  | { kind: "image"; id: string; url: string; variantId: string | null }
  | { kind: "video"; id: string; url: string; poster: string | null; source: string };

export function buildMedia(
  images: ProductImageRow[],
  videos: ProductVideoRow[],
  filterVariantId?: string | null,
): MediaItem[] {
  const filteredImages = filterVariantId
    ? images.filter((i) => i.variant_id === filterVariantId || i.variant_id === null)
    : images;
  const imgs: MediaItem[] = filteredImages.map((i) => ({
    kind: "image" as const,
    id: i.id,
    url: i.url,
    variantId: i.variant_id,
  }));
  const vids: MediaItem[] = videos.map((v) => ({
    kind: "video" as const,
    id: v.id,
    url: v.url,
    poster: v.poster_url,
    source: v.source,
  }));
  return [...imgs, ...vids];
}

// --- Provider detection ---------------------------------------------------
function youTubeId(url: string): string | null {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{6,})/);
  return m?.[1] ?? null;
}
function vimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

function resolvePoster(item: Extract<MediaItem, { kind: "video" }>, fallback?: string | null): string | null {
  if (item.poster) return item.poster;
  const yt = youTubeId(item.url);
  if (yt) return `https://i.ytimg.com/vi/${yt}/hqdefault.jpg`;
  // Vimeo posters require an API call; fall back to first image instead.
  return fallback ?? null;
}

// --- Premium video player -------------------------------------------------
function PremiumVideo({ src, poster, alt }: { src: string; poster: string | null; alt: string }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="group relative h-full w-full bg-ink">
      <video
        ref={ref}
        src={src}
        poster={poster ?? undefined}
        playsInline
        muted={muted}
        loop
        preload="metadata"
        className="h-full w-full object-cover"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={`${alt} video`}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors hover:bg-ink/10"
      >
        <span
          className={`flex h-16 w-16 items-center justify-center rounded-full border border-bone/70 bg-ink/60 backdrop-blur-sm transition-opacity ${
            playing ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-bone" fill="currentColor">
              <path d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-0.5 text-bone" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </span>
      </button>
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const v = ref.current;
            if (!v) return;
            v.muted = !v.muted;
            setMuted(v.muted);
          }}
          aria-label={muted ? "Unmute" : "Mute"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/40 bg-ink/70 text-bone backdrop-blur-sm hover:bg-ink/90"
        >
          {muted ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M16.5 12L19 9.5l-1.5-1.5L15 10.5 12.5 8 11 9.5 13.5 12 11 14.5 12.5 16 15 13.5 17.5 16 19 14.5zM4 9v6h4l5 5V4L8 9H4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

export function ProductMediaGallery({
  images,
  videos,
  alt,
  filterVariantId,
}: {
  images: ProductImageRow[];
  videos: ProductVideoRow[];
  alt: string;
  filterVariantId?: string | null;
}) {
  const media = useMemo(() => buildMedia(images, videos, filterVariantId), [images, videos, filterVariantId]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive(0);
  }, [filterVariantId]);

  if (media.length === 0) {
    return <div className="aspect-[4/5] bg-secondary" />;
  }

  const fallbackImage = images[0]?.url ?? null;
  const current = media[Math.min(active, media.length - 1)];

  return (
    <div>
      <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4 relative">
        {current.kind === "image" ? (
          <img
            src={current.url}
            alt={alt}
            className="h-full w-full object-cover transition-opacity duration-700"
          />
        ) : (() => {
          const yt = youTubeId(current.url);
          if (yt) {
            return (
              <iframe
                src={`https://www.youtube.com/embed/${yt}?rel=0&modestbranding=1&playsinline=1`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${alt} video`}
              />
            );
          }
          const vm = vimeoId(current.url);
          if (vm) {
            return (
              <iframe
                src={`https://player.vimeo.com/video/${vm}?title=0&byline=0&portrait=0`}
                className="h-full w-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={`${alt} video`}
              />
            );
          }
          return (
            <PremiumVideo
              src={current.url}
              poster={resolvePoster(current, fallbackImage)}
              alt={alt}
            />
          );
        })()}
      </div>
      {media.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {media.map((m, i) => {
            const isActive = i === active;
            const thumbPoster = m.kind === "video" ? resolvePoster(m, fallbackImage) : null;
            return (
              <button
                key={`${m.kind}-${m.id}`}
                onClick={() => setActive(i)}
                className={`aspect-[4/5] bg-secondary overflow-hidden border transition-colors relative ${
                  isActive ? "border-bone" : "border-transparent hover:border-hairline"
                }`}
                aria-label={`View ${m.kind} ${i + 1}`}
              >
                {m.kind === "image" ? (
                  <img src={m.url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <>
                    {thumbPoster ? (
                      <img src={thumbPoster} alt="" className="h-full w-full object-cover opacity-80" />
                    ) : (
                      <div className="h-full w-full bg-ink/60" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="h-7 w-7 rounded-full bg-ink/80 border border-bone/60 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-bone" fill="currentColor">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
