import { supabase } from "@/integrations/supabase/client";

export type ProductEventType =
  | "sold_out_tooltip_shown"
  | "sold_out_booking_click"
  | "all_sold_out_booking_click"
  | "similar_select_size_click"
  | "similar_carousel_impression"
  | "similar_carousel_card_click"
  | "similar_carousel_filter_change"
  | "similar_preload_stats";

type Args = {
  type: ProductEventType;
  productSlug?: string;
  productName?: string;
  size?: string | null;
  metadata?: Record<string, unknown>;
};

// Fire-and-forget. Never throws.
export function trackProductEvent({ type, productSlug, productName, size, metadata }: Args) {
  const payload = {
    event_type: type,
    product_slug: productSlug ?? null,
    product_name: productName ?? null,
    size: size ?? null,
    metadata: metadata ?? null,
  };
  void (supabase.from("product_events") as unknown as {
    insert: (row: typeof payload) => Promise<{ error: { message: string } | null }>;
  })
    .insert(payload)
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn("[analytics] failed to log event", type, error.message);
      }
    });
}
