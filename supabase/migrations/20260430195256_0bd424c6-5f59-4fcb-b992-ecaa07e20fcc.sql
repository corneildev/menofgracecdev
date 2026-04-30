-- Allow anonymous guest checkout: guests (anon role) can insert orders only when user_id IS NULL,
-- and can insert order_items only attached to such guest orders.
CREATE POLICY "Guests create guest orders"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

CREATE POLICY "Guests create guest order items"
ON public.order_items
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id IS NULL
  )
);

-- Allow anyone holding the order id to read the freshly created order (and its items)
-- so we can render the confirmation page for guests. Constrained to last 24h.
CREATE POLICY "Recent guest orders readable"
ON public.orders
FOR SELECT
TO anon, authenticated
USING (user_id IS NULL AND created_at > now() - interval '24 hours');

CREATE POLICY "Recent guest order items readable"
ON public.order_items
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND o.user_id IS NULL
      AND o.created_at > now() - interval '24 hours'
  )
);

-- updated_at trigger on orders
CREATE TRIGGER orders_touch_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();