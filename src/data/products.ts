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
  jpgSrcSet?: string;
  avif?: string;
  webp?: string;
  jpg: string;
};

export function getImageSources(src: string): ImageSources {
  const v = imageVariants[src];
  if (!v) return { jpg: src };
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
