import onyx from "@/assets/suit-onyx.jpg";
import onyxWebp from "@/assets/suit-onyx.webp";
import onyxAvif from "@/assets/suit-onyx.avif";
import onyxJpg480 from "@/assets/suit-onyx-480.jpg";
import onyxJpg768 from "@/assets/suit-onyx-768.jpg";
import onyxJpg1024 from "@/assets/suit-onyx-1024.jpg";
import onyxWebp480 from "@/assets/suit-onyx-480.webp";
import onyxWebp768 from "@/assets/suit-onyx-768.webp";
import onyxWebp1024 from "@/assets/suit-onyx-1024.webp";
import onyxAvif480 from "@/assets/suit-onyx-480.avif";
import onyxAvif768 from "@/assets/suit-onyx-768.avif";
import onyxAvif1024 from "@/assets/suit-onyx-1024.avif";

import midnight from "@/assets/suit-midnight.jpg";
import midnightWebp from "@/assets/suit-midnight.webp";
import midnightAvif from "@/assets/suit-midnight.avif";
import midnightJpg480 from "@/assets/suit-midnight-480.jpg";
import midnightJpg768 from "@/assets/suit-midnight-768.jpg";
import midnightJpg1024 from "@/assets/suit-midnight-1024.jpg";
import midnightWebp480 from "@/assets/suit-midnight-480.webp";
import midnightWebp768 from "@/assets/suit-midnight-768.webp";
import midnightWebp1024 from "@/assets/suit-midnight-1024.webp";
import midnightAvif480 from "@/assets/suit-midnight-480.avif";
import midnightAvif768 from "@/assets/suit-midnight-768.avif";
import midnightAvif1024 from "@/assets/suit-midnight-1024.avif";

import ivory from "@/assets/suit-ivory.jpg";
import ivoryWebp from "@/assets/suit-ivory.webp";
import ivoryAvif from "@/assets/suit-ivory.avif";
import ivoryJpg480 from "@/assets/suit-ivory-480.jpg";
import ivoryJpg768 from "@/assets/suit-ivory-768.jpg";
import ivoryJpg1024 from "@/assets/suit-ivory-1024.jpg";
import ivoryWebp480 from "@/assets/suit-ivory-480.webp";
import ivoryWebp768 from "@/assets/suit-ivory-768.webp";
import ivoryWebp1024 from "@/assets/suit-ivory-1024.webp";
import ivoryAvif480 from "@/assets/suit-ivory-480.avif";
import ivoryAvif768 from "@/assets/suit-ivory-768.avif";
import ivoryAvif1024 from "@/assets/suit-ivory-1024.avif";

import craft from "@/assets/craft.jpg";
import craftWebp from "@/assets/craft.webp";
import craftAvif from "@/assets/craft.avif";
import craftJpg480 from "@/assets/craft-480.jpg";
import craftJpg768 from "@/assets/craft-768.jpg";
import craftJpg1024 from "@/assets/craft-1024.jpg";
import craftWebp480 from "@/assets/craft-480.webp";
import craftWebp768 from "@/assets/craft-768.webp";
import craftWebp1024 from "@/assets/craft-1024.webp";
import craftAvif480 from "@/assets/craft-480.avif";
import craftAvif768 from "@/assets/craft-768.avif";
import craftAvif1024 from "@/assets/craft-1024.avif";

type ResponsiveSet = {
  avif: { url: string; w: number }[];
  webp: { url: string; w: number }[];
  jpg: { url: string; w: number }[];
  fallback: { avif: string; webp: string; jpg: string };
};

/**
 * Map of original JPG URL → multi-resolution variants in AVIF/WebP/JPG.
 * Use `getImageSources(jpgUrl)` to retrieve srcsets + fallback URLs.
 */
const imageVariants: Record<string, ResponsiveSet> = {
  [onyx]: {
    avif: [{ url: onyxAvif480, w: 480 }, { url: onyxAvif768, w: 768 }, { url: onyxAvif1024, w: 1024 }],
    webp: [{ url: onyxWebp480, w: 480 }, { url: onyxWebp768, w: 768 }, { url: onyxWebp1024, w: 1024 }],
    jpg: [{ url: onyxJpg480, w: 480 }, { url: onyxJpg768, w: 768 }, { url: onyxJpg1024, w: 1024 }],
    fallback: { avif: onyxAvif, webp: onyxWebp, jpg: onyx },
  },
  [midnight]: {
    avif: [{ url: midnightAvif480, w: 480 }, { url: midnightAvif768, w: 768 }, { url: midnightAvif1024, w: 1024 }],
    webp: [{ url: midnightWebp480, w: 480 }, { url: midnightWebp768, w: 768 }, { url: midnightWebp1024, w: 1024 }],
    jpg: [{ url: midnightJpg480, w: 480 }, { url: midnightJpg768, w: 768 }, { url: midnightJpg1024, w: 1024 }],
    fallback: { avif: midnightAvif, webp: midnightWebp, jpg: midnight },
  },
  [ivory]: {
    avif: [{ url: ivoryAvif480, w: 480 }, { url: ivoryAvif768, w: 768 }, { url: ivoryAvif1024, w: 1024 }],
    webp: [{ url: ivoryWebp480, w: 480 }, { url: ivoryWebp768, w: 768 }, { url: ivoryWebp1024, w: 1024 }],
    jpg: [{ url: ivoryJpg480, w: 480 }, { url: ivoryJpg768, w: 768 }, { url: ivoryJpg1024, w: 1024 }],
    fallback: { avif: ivoryAvif, webp: ivoryWebp, jpg: ivory },
  },
  [craft]: {
    avif: [{ url: craftAvif480, w: 480 }, { url: craftAvif768, w: 768 }, { url: craftAvif1024, w: 1024 }],
    webp: [{ url: craftWebp480, w: 480 }, { url: craftWebp768, w: 768 }, { url: craftWebp1024, w: 1024 }],
    jpg: [{ url: craftJpg480, w: 480 }, { url: craftJpg768, w: 768 }, { url: craftJpg1024, w: 1024 }],
    fallback: { avif: craftAvif, webp: craftWebp, jpg: craft },
  },
};

const buildSrcSet = (entries: { url: string; w: number }[]) =>
  entries.map((e) => `${e.url} ${e.w}w`).join(", ");

export type ImageSources = {
  avifSrcSet?: string;
  webpSrcSet?: string;
  /** Always present — falls back to the single JPG URL when no variants exist. */
  jpgSrcSet: string;
  avif?: string;
  webp?: string;
  jpg: string;
};

/**
 * Returns image sources for a given JPG URL. Guarantees a valid `jpg` and
 * `jpgSrcSet` even when no AVIF/WebP/responsive variants are registered
 * for the product, so the `<img>` fallback inside `<picture>` can always
 * use srcSet+sizes safely.
 */
export function getImageSources(src: string): ImageSources {
  const v = imageVariants[src];
  if (!v) {
    // Synthesize a single-candidate srcset so consumers can always pass
    // srcSet+sizes to <img> without conditionals. The 1024w descriptor is
    // a conservative default for our atelier photography.
    return { jpg: src, jpgSrcSet: `${src} 1024w` };
  }
  return {
    avifSrcSet: buildSrcSet(v.avif),
    webpSrcSet: buildSrcSet(v.webp),
    jpgSrcSet: buildSrcSet(v.jpg),
    avif: v.fallback.avif,
    webp: v.fallback.webp,
    jpg: v.fallback.jpg,
  };
}

export type Product = {
  id: string;
  name: string;
  category: string;
  fcfa: number;
  usd: number;
  eur: number;
  image: string;
  gallery: string[];
  description: string;
  story: string;
  fabric: {
    composition: string;
    weight: string;
    mill: string;
    notes: string;
  };
  details: string[];
  sizes: string[];
  soldOutSizes?: string[];
  fits: string[];
  lapels: string[];
  linings: string[];
  monogram: boolean;
};

export const products: Product[] = [
  {
    id: "onyx-double-breasted",
    name: "Onyx Double-Breasted",
    category: "Executive",
    fcfa: 1_250_000,
    usd: 2100,
    eur: 1950,
    image: onyx,
    gallery: [onyx, craft, midnight],
    description: "Hand-finished double-breasted silhouette in pure Italian wool.",
    story:
      "Cut for the boardroom and the gala alike — a six-button double-breasted composition draped in obsidian Super 130s wool. Quiet authority, distilled.",
    fabric: {
      composition: "100% Super 130s Virgin Wool",
      weight: "280 g/m²",
      mill: "Vitale Barberis Canonico — Biella, Italy",
      notes: "A dry, dense hand with a subdued matte finish that holds its line through long days.",
    },
    details: [
      "Full canvas construction, hand-padded lapels",
      "Working surgeon's cuffs, four mother-of-pearl buttons",
      "Bemberg cupro lining, hand-felled seams",
      "Side adjusters — no belt loops",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    soldOutSizes: ["46", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Peak", "Notch"],
    linings: ["Onyx", "Burgundy", "Azure"],
    monogram: true,
  },
  {
    id: "midnight-tuxedo",
    name: "Midnight Tuxedo",
    category: "Cérémonie",
    fcfa: 1_490_000,
    usd: 2490,
    eur: 2310,
    image: midnight,
    gallery: [midnight, craft, onyx],
    description: "A midnight blue tuxedo with grosgrain peak lapels.",
    story:
      "The midnight blue that reads blacker than black under candlelight. Grosgrain peaks, satin braid, and a single jet button — for the long evening ahead.",
    fabric: {
      composition: "100% Mohair-Wool blend",
      weight: "260 g/m²",
      mill: "Drago — Biella, Italy",
      notes: "A subtle lustre that catches low light without ostentation.",
    },
    details: [
      "Hand-stitched grosgrain peak lapels",
      "Satin-faced jet button & covered side adjusters",
      "Silk satin trouser braid",
      "Hand-rolled pocket squares, jetted hip pockets",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    soldOutSizes: ["48"],
    fits: ["Tailored", "Slim"],
    lapels: ["Peak", "Shawl"],
    linings: ["Midnight", "Ivory", "Bordeaux"],
    monogram: true,
  },
  {
    id: "ivory-groom",
    name: "Ivory Groom",
    category: "Wedding",
    fcfa: 1_790_000,
    usd: 2990,
    eur: 2780,
    image: ivory,
    gallery: [ivory, craft, midnight],
    description: "Ivory dinner jacket with satin trim — for the day that defines a life.",
    story:
      "An ivory dinner jacket cut for the moment a man becomes a husband. Quiet, luminous, and uncompromising in its restraint.",
    fabric: {
      composition: "Wool-Silk-Linen blend",
      weight: "240 g/m²",
      mill: "Loro Piana — Quarona, Italy",
      notes: "A whisper of silk through the weave gives the jacket its hushed glow.",
    },
    details: [
      "Hand-padded shawl collar in ivory satin",
      "Mother-of-pearl single button closure",
      "Hand-finished buttonholes, Milanese stitch",
      "Paired with midnight wool dress trousers",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Shawl", "Peak"],
    linings: ["Ivory", "Champagne", "Midnight"],
    monogram: true,
  },
  {
    id: "charcoal-sovereign",
    name: "Charcoal Sovereign",
    category: "Executive",
    fcfa: 1_190_000,
    usd: 1990,
    eur: 1850,
    image: onyx,
    gallery: [onyx, craft, midnight],
    description: "An anthracite worsted wool — the daily armour of decision-makers.",
    story:
      "Cut from a 250g/m² Vitale Barberis worsted, this charcoal two-piece reads as quiet authority across boardrooms, courtrooms, and capitals. The cloth holds a sharp drape from morning negotiations to evening signatures.",
    fabric: {
      composition: "100% Super 130s Wool",
      weight: "250 g/m²",
      mill: "Vitale Barberis Canonico — Biella, Italy",
      notes: "A dense, hard-wearing worsted that resists the long day.",
    },
    details: [
      "Half-canvassed construction",
      "Hand-padded notch lapels",
      "Working surgeon's cuffs (4 buttons)",
      "Single rear vent, cleanly drafted",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Notch", "Peak"],
    linings: ["Charcoal", "Bone", "Azure"],
    monogram: true,
  },
  {
    id: "navy-authority",
    name: "Navy Authority",
    category: "Executive",
    fcfa: 1_290_000,
    usd: 2150,
    eur: 2000,
    image: midnight,
    gallery: [midnight, craft, onyx],
    description: "The international navy — the most diplomatic suit a man can own.",
    story:
      "Navy is the language understood from Tokyo to Lagos. This iteration, in a Loro Piana Super 150s, carries a depth that outperforms in artificial light and natural sunlight alike.",
    fabric: {
      composition: "100% Super 150s Wool",
      weight: "240 g/m²",
      mill: "Loro Piana — Quarona, Italy",
      notes: "A mid-weight cloth tailored for trans-continental travel.",
    },
    details: [
      "Hand-rolled lapels with milanese stitch",
      "Pick-stitched edges",
      "Functional buttonholes",
      "Double back vent for movement",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Notch", "Peak"],
    linings: ["Midnight", "Azure", "Bordeaux"],
    monogram: true,
  },
  {
    id: "pinstripe-heritage",
    name: "Pinstripe Heritage",
    category: "Executive",
    fcfa: 1_390_000,
    usd: 2320,
    eur: 2160,
    image: midnight,
    gallery: [midnight, onyx, craft],
    description: "A chalk-stripe in deep navy — the banker's suit, redrawn.",
    story:
      "Inspired by the City of London of the 1930s, this chalk-stripe is cut with a contemporary silhouette: cleaner shoulder, higher armhole, narrower trouser. Heritage, without nostalgia.",
    fabric: {
      composition: "100% Super 130s Wool",
      weight: "260 g/m²",
      mill: "Drapers — Biella, Italy",
      notes: "A firm-handed cloth that holds the chalk-stripe crisp through years of wear.",
    },
    details: [
      "Peak lapels, hand-padded",
      "Double-breasted option available",
      "Side adjusters in lieu of belt loops",
      "Turn-up trouser hems (3.5cm)",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim"],
    lapels: ["Peak", "Notch"],
    linings: ["Midnight", "Burgundy", "Azure"],
    monogram: true,
  },
  {
    id: "graphite-quiet",
    name: "Graphite Quiet",
    category: "Executive",
    fcfa: 1_240_000,
    usd: 2080,
    eur: 1930,
    image: onyx,
    gallery: [onyx, midnight, craft],
    description: "A mid-grey of unusual depth — for men who let the work speak.",
    story:
      "A solid mid-grey that occupies the precise tonal space between charcoal and silver. The most versatile cloth in a serious wardrobe — works in business, evening, and travel without a single compromise.",
    fabric: {
      composition: "Wool-Mohair blend (95/5)",
      weight: "245 g/m²",
      mill: "Scabal — Huddersfield, UK",
      notes: "The mohair gives a discreet sheen and exceptional wrinkle recovery.",
    },
    details: [
      "Half-canvassed construction",
      "Roped shoulder, lightly padded",
      "Slanted hip pockets with flap",
      "Functional 4-button cuffs",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Notch", "Peak"],
    linings: ["Graphite", "Bone", "Azure"],
    monogram: true,
  },
  {
    id: "weekday-navy",
    name: "Weekday Navy",
    category: "Business",
    fcfa: 790_000,
    usd: 1320,
    eur: 1230,
    image: midnight,
    gallery: [midnight, craft, onyx],
    description: "An everyday navy two-piece — engineered for the working week.",
    story:
      "The most-worn suit in a serious wardrobe. A four-season navy worsted with a clean drape, a softer construction, and the resilience to carry five days of meetings without complaint.",
    fabric: {
      composition: "100% Super 110s Wool",
      weight: "270 g/m²",
      mill: "Reda — Biella, Italy",
      notes: "A naturally elastic fibre that holds its shape between dry cleanings.",
    },
    details: [
      "Half-canvas construction",
      "Soft Neapolitan shoulder",
      "Three interior pockets",
      "Single rear vent, machine-stitched edges",
    ],
    sizes: ["44", "46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Notch"],
    linings: ["Midnight", "Bone"],
    monogram: false,
  },
  {
    id: "ash-grey-everyday",
    name: "Ash Grey Everyday",
    category: "Business",
    fcfa: 790_000,
    usd: 1320,
    eur: 1230,
    image: onyx,
    gallery: [onyx, craft, midnight],
    description: "A lightweight ash grey — for the long week, hot or cold.",
    story:
      "The all-rounder. An ash-grey worsted that travels light, photographs well under any light, and pairs with every shirt in a sensible wardrobe.",
    fabric: {
      composition: "100% Super 110s Wool",
      weight: "240 g/m²",
      mill: "Reda — Biella, Italy",
      notes: "A breathable mid-weight built for long hours indoors and out.",
    },
    details: [
      "Half-canvas construction",
      "Notch lapels, lightly padded",
      "Flap hip pockets",
      "Side vents for movement",
    ],
    sizes: ["44", "46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: ["Notch"],
    linings: ["Bone", "Azure"],
    monogram: false,
  },
  {
    id: "travel-blue-blazer",
    name: "Travel Blue Blazer",
    category: "Business",
    fcfa: 690_000,
    usd: 1150,
    eur: 1070,
    image: midnight,
    gallery: [midnight, onyx, craft],
    description: "A standalone blazer in a high-twist navy — for the man between cities.",
    story:
      "Cut from a high-twist Crispaire cloth that resists wrinkles through long-haul travel. Worn over grey trousers in the morning, with chinos by the evening.",
    fabric: {
      composition: "100% High-Twist Wool",
      weight: "220 g/m²",
      mill: "Holland & Sherry — Huddersfield, UK",
      notes: "An open-weave high-twist that recovers shape after every flight.",
    },
    details: [
      "Unstructured shoulder",
      "Patch pockets, hand-stitched",
      "Half-lined for breathability",
      "Working surgeon's cuffs",
    ],
    sizes: ["44", "46", "48", "50", "52", "54"],
    fits: ["Tailored", "Slim"],
    lapels: ["Notch"],
    linings: ["Bone", "Midnight"],
    monogram: false,
  },
  {
    id: "stone-flannel-trousers",
    name: "Stone Flannel Trouser",
    category: "Business",
    fcfa: 290_000,
    usd: 480,
    eur: 450,
    image: craft,
    gallery: [craft, onyx, midnight],
    description: "A stone-grey flannel trouser — the quiet partner to every blazer.",
    story:
      "The trouser that does the work no one notices. A brushed stone flannel with a clean half-break and a single reverse pleat for ease of movement.",
    fabric: {
      composition: "100% Brushed Wool Flannel",
      weight: "300 g/m²",
      mill: "Vitale Barberis Canonico — Biella, Italy",
      notes: "A soft hand with a discreet nap that hides the small marks of a long day.",
    },
    details: [
      "Single reverse pleat",
      "Side adjusters in lieu of belt loops",
      "Slanted side pockets, two rear",
      "Unfinished hem, finished to order",
    ],
    sizes: ["46", "48", "50", "52", "54", "56"],
    fits: ["Tailored", "Slim", "Classic"],
    lapels: [],
    linings: [],
    monogram: false,
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function formatPrice(p: Product) {
  // Stable across SSR/CSR (no locale-dependent grouping characters)
  const group = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const groupComma = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return {
    fcfa: `${group(p.fcfa)} FCFA`,
    usd: `$${groupComma(p.usd)}`,
    eur: `€${groupComma(p.eur)}`,
  };
}
