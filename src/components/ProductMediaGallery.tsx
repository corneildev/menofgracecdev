import { useEffect, useMemo, useState } from "react";
import type { ProductImageRow, ProductVideoRow } from "@/lib/products";

export type MediaItem =
  | { kind: "image"; id: string; url: string; variantId: string | null }
  | { kind: "video"; id: string; url: string; poster: string | null; source: string };

export function buildMedia(images: ProductImageRow[], videos: ProductVideoRow[], filterVariantId?: string | null): MediaItem[] {
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

function isYouTube(url: string) {
  return /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(url);
}
function youTubeEmbed(url: string) {
  const m = url.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}
function isVimeo(url: string) {
  return /vimeo\.com\//.test(url);
}
function vimeoEmbed(url: string) {
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m ? `https://player.vimeo.com/video/${m[1]}` : url;
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

  const current = media[Math.min(active, media.length - 1)];

  return (
    <div>
      <div className="aspect-[4/5] bg-secondary overflow-hidden mb-4 relative">
        {current.kind === "image" ? (
          <img src={current.url} alt={alt} className="h-full w-full object-cover transition-opacity duration-700" />
        ) : isYouTube(current.url) ? (
          <iframe
            src={youTubeEmbed(current.url)}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${alt} video`}
          />
        ) : isVimeo(current.url) ? (
          <iframe src={vimeoEmbed(current.url)} className="h-full w-full" allow="autoplay; fullscreen" allowFullScreen title={`${alt} video`} />
        ) : (
          <video src={current.url} poster={current.poster ?? undefined} controls playsInline className="h-full w-full object-cover" />
        )}
      </div>
      {media.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {media.map((m, i) => (
            <button
              key={`${m.kind}-${m.id}`}
              onClick={() => setActive(i)}
              className={`aspect-[4/5] bg-secondary overflow-hidden border transition-colors relative ${
                i === active ? "border-bone" : "border-transparent hover:border-hairline"
              }`}
              aria-label={`View ${m.kind} ${i + 1}`}
            >
              {m.kind === "image" ? (
                <img src={m.url} alt="" className="h-full w-full object-cover" />
              ) : (
                <>
                  <div className="h-full w-full bg-ink/60 flex items-center justify-center">
                    {m.poster ? (
                      <img src={m.poster} alt="" className="h-full w-full object-cover opacity-70" />
                    ) : null}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-7 w-7 rounded-full bg-ink/80 border border-bone/60 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-bone" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
