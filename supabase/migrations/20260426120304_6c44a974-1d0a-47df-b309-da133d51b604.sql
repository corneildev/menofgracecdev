-- Restock alerts: customers ask to be notified when a product/size is back in stock
CREATE TABLE public.restock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  product_slug text,
  product_name text,
  size text,
  email text,
  whatsapp text,
  notified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_restock_alerts_product ON public.restock_alerts(product_id);

ALTER TABLE public.restock_alerts ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a restock request (form is public on product page)
CREATE POLICY "Anyone can submit restock alerts"
  ON public.restock_alerts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    (email IS NOT NULL AND length(email) BETWEEN 3 AND 255)
    OR (whatsapp IS NOT NULL AND length(whatsapp) BETWEEN 5 AND 30)
  );

-- Only admins can read / manage
CREATE POLICY "Admins view restock alerts"
  ON public.restock_alerts
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update restock alerts"
  ON public.restock_alerts
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete restock alerts"
  ON public.restock_alerts
  FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));
