CREATE TABLE public.product_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  product_slug text,
  product_name text,
  size text,
  metadata jsonb,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_product_events_type_created ON public.product_events(event_type, created_at DESC);
CREATE INDEX idx_product_events_slug ON public.product_events(product_slug);

ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log product events"
  ON public.product_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(event_type) BETWEEN 1 AND 80
    AND (product_slug IS NULL OR length(product_slug) <= 200)
    AND (size IS NULL OR length(size) <= 30)
  );

CREATE POLICY "Admins view product events"
  ON public.product_events
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
