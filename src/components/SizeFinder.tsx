import { useState } from "react";
import {
  recommendSize,
  BUILD_LABELS,
  type Build,
  type SizeFinderResult,
} from "@/lib/sizeFinder";

type Props = {
  /** Optional: only suggest a size that exists in this product's available sizes */
  availableSizes?: string[];
  /** Optional: callback when the user accepts a recommendation */
  onPick?: (size: string) => void;
  /** Compact (inline on PDP) or full (page) layout */
  variant?: "compact" | "full";
};

const inputCls =
  "w-full bg-transparent border-b border-hairline py-3 text-bone placeholder:text-bone/30 outline-none focus:border-bone transition-colors text-sm font-light";

<<<<<<< HEAD
export function SizeFinder({ availableSizes, onPick, variant = "full" }: Props) {
=======
export function SizeFinder({
  availableSizes,
  onPick,
  variant = "full",
}: Props) {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [build, setBuild] = useState<Build>("regular");
  const [result, setResult] = useState<SizeFinderResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const h = Number(height);
    const w = Number(weight);
    if (!h || h < 140 || h > 220) {
      setError("Please enter a height between 140 and 220 cm.");
      return;
    }
    if (!w || w < 40 || w > 180) {
      setError("Please enter a weight between 40 and 180 kg.");
      return;
    }
    setError(null);
    const r = recommendSize({ heightCm: h, weightKg: w, build });
    setResult(r);
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  const recommendedAvailable =
    !result || !availableSizes || availableSizes.includes(result.recommended);

  const wrapperCls =
    variant === "compact"
      ? "bg-ink/40 border border-hairline p-6 md:p-8"
      : "max-w-2xl mx-auto";

  if (result) {
    return (
      <div className={wrapperCls}>
        <div className="eyebrow text-bone/60 mb-6">— Recommendation —</div>

        <div className="flex items-baseline gap-6 mb-8">
<<<<<<< HEAD
          <span className="display text-6xl md:text-7xl text-bone">IT {result.recommended}</span>
=======
          <span className="display text-6xl md:text-7xl text-bone">
            IT {result.recommended}
          </span>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
          {result.alternate && (
            <span className="font-serif italic text-bone/60 text-lg">
              or IT {result.alternate}
            </span>
          )}
        </div>

        <p className="font-serif italic text-bone/85 text-base md:text-lg leading-relaxed mb-8">
          {result.note}
        </p>

        {!recommendedAvailable && (
          <p className="text-sm text-bone/70 font-light mb-8 border-l border-hairline pl-4">
            IT {result.recommended} is not currently in stock for this piece.
            Consider {result.alternate ? `IT ${result.alternate}, ` : ""}
            or speak to the maison for a made-to-measure commission.
          </p>
        )}

        <div className="hairline w-12 my-8" />

        <p className="text-bone/60 font-light text-sm leading-relaxed mb-8">
<<<<<<< HEAD
          This is editorial guidance, not a measurement. For a piece composed
          to your exact body, we recommend a fitting at the next trunk show.
=======
          This is editorial guidance, not a measurement. For a piece composed to
          your exact body, we recommend a fitting at the next trunk show.
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
        </p>

        <div className="flex flex-wrap gap-4">
          {onPick && recommendedAvailable && (
            <button
              type="button"
              onClick={() => onPick(result.recommended)}
              className="luxury-btn luxury-btn-solid"
            >
              Select IT {result.recommended}
            </button>
          )}
          <button type="button" onClick={reset} className="luxury-btn">
            Refine
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={wrapperCls}>
      {variant === "full" && (
        <div className="text-center mb-12">
          <div className="eyebrow text-bone/60 mb-6">— Size Finder —</div>
          <h2 className="display text-4xl md:text-5xl mb-6">Find your size.</h2>
          <p className="text-bone/65 font-light max-w-lg mx-auto leading-relaxed">
            Three questions. A guide, not a guarantee. For the exact silhouette,
            a fitting at our trunk show.
          </p>
        </div>
      )}

      {variant === "compact" && (
        <div className="mb-6">
          <div className="eyebrow text-bone/60 mb-2">— Size Finder —</div>
          <p className="font-serif italic text-bone/80 text-base">
            Three questions. A guided recommendation.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
<<<<<<< HEAD
            <label className="eyebrow text-bone/50 block mb-2">Height (cm)</label>
=======
            <label className="eyebrow text-bone/50 block mb-2">
              Height (cm)
            </label>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
            <input
              required
              inputMode="numeric"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className={inputCls}
              placeholder="178"
            />
          </div>
          <div>
<<<<<<< HEAD
            <label className="eyebrow text-bone/50 block mb-2">Weight (kg)</label>
=======
            <label className="eyebrow text-bone/50 block mb-2">
              Weight (kg)
            </label>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
            <input
              required
              inputMode="numeric"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={inputCls}
              placeholder="76"
            />
          </div>
        </div>

        <div>
          <label className="eyebrow text-bone/50 block mb-3">Build</label>
          <div className="grid grid-cols-2 gap-3">
            {BUILD_LABELS.map((b) => {
              const active = build === b.value;
              return (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => setBuild(b.value)}
                  className={`text-left border p-4 transition-colors ${
                    active
                      ? "border-bone bg-bone/5"
                      : "border-hairline hover:border-bone/60"
                  }`}
                >
<<<<<<< HEAD
                  <div className="font-serif text-lg text-bone mb-1">{b.label}</div>
=======
                  <div className="font-serif text-lg text-bone mb-1">
                    {b.label}
                  </div>
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
                  <div className="text-bone/55 font-light text-xs leading-relaxed">
                    {b.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-sm text-bone/70 font-light border-l border-bone/40 pl-4">
            {error}
          </p>
        )}

        <div className="pt-4">
          <button type="submit" className="luxury-btn luxury-btn-solid">
            See my size
          </button>
        </div>
      </form>
    </div>
  );
}
