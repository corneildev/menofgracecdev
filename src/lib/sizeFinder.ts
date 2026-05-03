/**
 * MEN OF GRACE — Size Finder
 *
 * Questionnaire-only size recommendation for ready-to-wear jackets and suits
 * in Italian sizing (IT 46–56). No body scan, no AI vision — just a small,
 * principled mapping between height, weight and build.
 *
 * The recommendation is presented as guidance, not a guarantee. The maison
 * still recommends a fitting whenever possible.
 */

export type Build = "lean" | "regular" | "athletic" | "fuller";

export type SizeFinderInput = {
  /** centimetres */
  heightCm: number;
  /** kilograms */
  weightKg: number;
  build: Build;
};

export type SizeFinderResult = {
  /** Primary recommendation (e.g. "50") */
  recommended: string;
  /** Alternate to consider if between sizes (e.g. "52") */
  alternate?: string;
  /** Short editorial note */
  note: string;
  /** Underlying BMI for transparency / debugging */
  bmi: number;
};

/**
 * Italian jacket sizes — chest (cm) ≈ size × 2.
 * 46 → ~92 cm chest · 48 → ~96 · 50 → ~100 · 52 → ~104 · 54 → ~108 · 56 → ~112
 */
const IT_SIZES = ["46", "48", "50", "52", "54", "56"] as const;

function clampToScale(idx: number): string {
  const i = Math.max(0, Math.min(IT_SIZES.length - 1, idx));
  return IT_SIZES[i];
}

/**
 * Estimate IT jacket size from chest circumference (cm).
 * IT size ≈ chest / 2, rounded to the nearest even integer.
 */
function chestToIt(chestCm: number): string {
  const raw = chestCm / 2;
  const even = Math.round(raw / 2) * 2;
<<<<<<< HEAD
  return clampToScale(IT_SIZES.indexOf(String(even) as (typeof IT_SIZES)[number]));
=======
  return clampToScale(
    IT_SIZES.indexOf(String(even) as (typeof IT_SIZES)[number]),
  );
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
}

/**
 * Approximate chest circumference (cm) from height, weight and build.
 * Reference points calibrated against menswear sizing tables (Brioni, Boggi,
 * Suitsupply): a regular build at 178 cm / 76 kg sits around a 100 cm chest
 * (IT 50). Build adjusts ±2 to 4 cm.
 */
function estimateChest({ heightCm, weightKg, build }: SizeFinderInput): number {
  // BMI-driven baseline. Each BMI point above 22 ≈ +1.5 cm of chest girth.
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const base = 96 + (bmi - 22) * 1.5;

  // Slight height correction — taller frames carry circumference differently.
  const heightAdj = (heightCm - 178) * 0.1;

  const buildAdj = {
    lean: -3,
    regular: 0,
    athletic: 3,
    fuller: 5,
  }[build];

  return base + heightAdj + buildAdj;
}

export function recommendSize(input: SizeFinderInput): SizeFinderResult {
  const bmi = input.weightKg / Math.pow(input.heightCm / 100, 2);
  const chest = estimateChest(input);
  const recommended = chestToIt(chest);

  // Suggest an alternate when within 1.5 cm of the next size up.
  const recIdx = IT_SIZES.indexOf(recommended as (typeof IT_SIZES)[number]);
  const recChest = (recIdx === -1 ? 50 : Number(recommended)) * 2;
  let alternate: string | undefined;
  if (chest - recChest > 1) {
    alternate = IT_SIZES[Math.min(IT_SIZES.length - 1, recIdx + 1)];
  } else if (recChest - chest > 1) {
    alternate = IT_SIZES[Math.max(0, recIdx - 1)];
  }

  let note: string;
  if (input.build === "athletic") {
<<<<<<< HEAD
    note = "Athletic builds often size up a half on the chest while keeping a tailored waist — consider a fitting.";
  } else if (input.build === "fuller") {
    note = "A fuller build wears better in the larger of two adjacent sizes.";
  } else if (input.build === "lean") {
    note = "Lean builds wear better in the smaller of two adjacent sizes, kept close to the body.";
=======
    note =
      "Athletic builds often size up a half on the chest while keeping a tailored waist — consider a fitting.";
  } else if (input.build === "fuller") {
    note = "A fuller build wears better in the larger of two adjacent sizes.";
  } else if (input.build === "lean") {
    note =
      "Lean builds wear better in the smaller of two adjacent sizes, kept close to the body.";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  } else {
    note = "A regular build sits true to size on our cuts.";
  }

  return {
    recommended,
    alternate: alternate && alternate !== recommended ? alternate : undefined,
    note,
    bmi: Math.round(bmi * 10) / 10,
  };
}

<<<<<<< HEAD
export const BUILD_LABELS: { value: Build; label: string; description: string }[] = [
  { value: "lean", label: "Lean", description: "Slim, narrow shoulders, low body mass." },
  { value: "regular", label: "Regular", description: "Average proportions, comfortable in standard cuts." },
  { value: "athletic", label: "Athletic", description: "Developed shoulders and chest, narrower waist." },
  { value: "fuller", label: "Fuller", description: "More circumference at chest and waist." },
=======
export const BUILD_LABELS: {
  value: Build;
  label: string;
  description: string;
}[] = [
  {
    value: "lean",
    label: "Lean",
    description: "Slim, narrow shoulders, low body mass.",
  },
  {
    value: "regular",
    label: "Regular",
    description: "Average proportions, comfortable in standard cuts.",
  },
  {
    value: "athletic",
    label: "Athletic",
    description: "Developed shoulders and chest, narrower waist.",
  },
  {
    value: "fuller",
    label: "Fuller",
    description: "More circumference at chest and waist.",
  },
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
];

export const IT_SIZE_SCALE = IT_SIZES;
