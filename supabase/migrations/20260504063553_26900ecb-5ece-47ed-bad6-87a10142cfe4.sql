-- 1) Product variants
CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size TEXT,
  color TEXT,
  sku TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  price_fcfa INTEGER,
  price_usd INTEGER,
  price_eur INTEGER,
  is_available BOOLEAN NOT NULL DEFAULT true,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_variants_product ON public.product_variants(product_id);
CREATE UNIQUE INDEX idx_variants_unique_combo ON public.product_variants(product_id, COALESCE(size,''), COALESCE(color,''));

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Variants public read"
  ON public.product_variants FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND (p.is_published OR public.has_role(auth.uid(),'admin'))));

CREATE POLICY "Admins manage variants"
  ON public.product_variants FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trg_variants_updated
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2) Link images to variants
ALTER TABLE public.product_images
  ADD COLUMN variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL;
CREATE INDEX idx_product_images_variant ON public.product_images(variant_id);

-- 3) Product videos
CREATE TABLE public.product_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  poster_url TEXT,
  source TEXT NOT NULL DEFAULT 'upload', -- 'upload' | 'youtube' | 'vimeo' | 'external'
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_videos_product ON public.product_videos(product_id);

ALTER TABLE public.product_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Videos public read"
  ON public.product_videos FOR SELECT
  TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = product_id AND (p.is_published OR public.has_role(auth.uid(),'admin'))));

CREATE POLICY "Admins manage videos"
  ON public.product_videos FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 4) Storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-videos','product-videos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Product videos public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-videos');

CREATE POLICY "Admins upload product videos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-videos' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update product videos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-videos' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete product videos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-videos' AND public.has_role(auth.uid(),'admin'));