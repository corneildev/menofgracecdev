import onyx from "@/assets/suit-onyx.jpg";
import midnight from "@/assets/suit-midnight.jpg";
import ivory from "@/assets/suit-ivory.jpg";

export type Product = {
  id: string;
  name: string;
  category: string;
  fcfa: number;
  usd: number;
  eur: number;
  image: string;
  description: string;
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
    description: "Hand-finished double-breasted silhouette in pure Italian wool.",
  },
  {
    id: "midnight-tuxedo",
    name: "Midnight Tuxedo",
    category: "Cérémonie",
    fcfa: 1_490_000,
    usd: 2490,
    eur: 2310,
    image: midnight,
    description: "A midnight blue tuxedo with grosgrain peak lapels.",
  },
  {
    id: "ivory-groom",
    name: "Ivory Groom",
    category: "Wedding",
    fcfa: 1_790_000,
    usd: 2990,
    eur: 2780,
    image: ivory,
    description: "Ivory dinner jacket with satin trim — for the day that defines a life.",
  },
];

export function formatPrice(p: Product) {
  const fcfa = p.fcfa.toLocaleString("fr-FR");
  const usd = p.usd.toLocaleString("en-US");
  return { fcfa: `${fcfa} FCFA`, usd: `$${usd}`, eur: `€${p.eur.toLocaleString("en-US")}` };
}
