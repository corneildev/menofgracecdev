import onyx from "@/assets/suit-onyx.jpg";
import midnight from "@/assets/suit-midnight.jpg";
import ivory from "@/assets/suit-ivory.jpg";
import craft from "@/assets/craft.jpg";

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
