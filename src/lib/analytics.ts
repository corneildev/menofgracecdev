import { supabase } from "@/integrations/supabase/client";

export type ProductEventType =
  | "sold_out_tooltip_shown"
  | "sold_out_booking_click"
  | "all_sold_out_booking_click"
  | "similar_select_size_click"
  | "similar_carousel_impression"
  | "similar_carousel_card_click"
  | "similar_carousel_filter_change"
<<<<<<< HEAD
  | "similar_preload_stats";
=======
  | "similar_preload_stats"
  | "checkout_step_view"
  | "checkout_place_order_attempt"
  | "checkout_place_order_success"
  | "checkout_place_order_failed"
  | "checkout_abandoned";
>>>>>>> 9091cf2 (Initial commit of graceful-threads)

type Args = {
  type: ProductEventType;
  productSlug?: string;
  productName?: string;
  size?: string | null;
  metadata?: Record<string, unknown>;
};

// Fire-and-forget. Never throws.
<<<<<<< HEAD
export function trackProductEvent({ type, productSlug, productName, size, metadata }: Args) {
=======
export function trackProductEvent({
  type,
  productSlug,
  productName,
  size,
  metadata,
}: Args) {
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
  const payload = {
    event_type: type,
    product_slug: productSlug ?? null,
    product_name: productName ?? null,
    size: size ?? null,
    metadata: metadata ?? null,
  };
<<<<<<< HEAD
  void (supabase.from("product_events") as unknown as {
    insert: (row: typeof payload) => Promise<{ error: { message: string } | null }>;
  })
=======
  void (
    supabase.from("product_events") as unknown as {
      insert: (
        row: typeof payload,
      ) => Promise<{ error: { message: string } | null }>;
    }
  )
>>>>>>> 9091cf2 (Initial commit of graceful-threads)
    .insert(payload)
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn("[analytics] failed to log event", type, error.message);
      }
    });
}
