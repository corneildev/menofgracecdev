import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductImageRow = Database["public"]["Tables"]["product_images"]["Row"];
export type ProductVariantRow = Database["public"]["Tables"]["product_variants"]["Row"];
export type ProductVideoRow = Database["public"]["Tables"]["product_videos"]["Row"];
export type ProductCategory = Database["public"]["Enums"]["product_category"];

export type ProductWithImages = ProductRow & {
  images: ProductImageRow[];
  primaryImage: string;
  gallery: string[];
  variants: ProductVariantRow[];
  videos: ProductVideoRow[];
};

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  suits: "Suits",
  wedding_suits: "Wedding Suits",
  business_suits: "Business Suits",
  executive_suits: "Executive",
  shirts: "Shirts",
  trousers: "Trousers",
  belts: "Belts",
  shoes: "Chaussures",
  accessories: "Accessories",
  bespoke: "Bespoke Collection",
};

export const ALL_CATEGORIES: ProductCategory[] = [
  "suits",
  "wedding_suits",
  "business_suits",
  "executive_suits",
  "shirts",
  "trousers",
  "belts",
  "shoes",
  "accessories",
  "bespoke",
];

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Custom"] as const;

const PLACEHOLDER = "/seed/craft.jpg";

type RawProduct = ProductRow & {
  product_images?: ProductImageRow[];
  product_variants?: ProductVariantRow[];
  product_videos?: ProductVideoRow[];
};

function shape(row: RawProduct): ProductWithImages {
  const images = (row.product_images ?? []).slice().sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.position - b.position;
  });
  const variants = (row.product_variants ?? []).slice().sort((a, b) => a.position - b.position);
  const videos = (row.product_videos ?? []).slice().sort((a, b) => a.position - b.position);
  const primaryImage = images[0]?.url ?? PLACEHOLDER;
  const gallery = images.length > 0 ? images.map((i) => i.url) : [PLACEHOLDER];
  return { ...row, images, primaryImage, gallery, variants, videos };
}

const SELECT = "*, product_images(*), product_variants(*), product_videos(*)";

export async function listPublishedProducts(): Promise<ProductWithImages[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("is_published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(shape);
}

export async function listAllProducts(): Promise<ProductWithImages[]> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(shape);
}

export async function getProductBySlug(slug: string): Promise<ProductWithImages | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? shape(data) : null;
}

export async function getProductById(id: string): Promise<ProductWithImages | null> {
  const { data, error } = await supabase
    .from("products")
    .select(SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? shape(data) : null;
}

export function formatPriceFcfa(n: number) {
  return `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}
export function formatPriceUsd(n: number) {
  return `$${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
export function formatPriceEur(n: number) {
  return `€${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}
