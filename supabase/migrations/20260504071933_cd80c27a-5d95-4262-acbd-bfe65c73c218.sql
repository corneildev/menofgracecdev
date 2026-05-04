-- 1. Promo codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value integer not null check (discount_value > 0),
  min_cart_fcfa integer not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  max_uses integer,
  uses_count integer not null default 0,
  is_active boolean not null default true,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage promo codes" ON public.promo_codes;
CREATE POLICY "Admins manage promo codes" ON public.promo_codes
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Active promo codes readable" ON public.promo_codes;
CREATE POLICY "Active promo codes readable" ON public.promo_codes
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE TRIGGER trg_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. Add promo fields to orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS promo_code_id uuid REFERENCES public.promo_codes(id),
  ADD COLUMN IF NOT EXISTS promo_code text,
  ADD COLUMN IF NOT EXISTS discount_fcfa integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_usd integer NOT NULL DEFAULT 0;

-- 3. Update place_order to support promo codes
CREATE OR REPLACE FUNCTION public.place_order(
  p_items jsonb,
  p_customer jsonb,
  p_payment payment_method,
  p_idempotency_key text DEFAULT NULL,
  p_promo_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_existing_id uuid;
  v_existing_number text;
  v_order_id uuid;
  v_order_number text;
  v_user_id uuid := auth.uid();
  v_subtotal_fcfa integer := 0;
  v_subtotal_usd integer := 0;
  v_discount_fcfa integer := 0;
  v_discount_usd integer := 0;
  v_promo RECORD;
  v_promo_id uuid;
  v_promo_code_used text;
  v_item jsonb;
  v_product RECORD;
  v_qty integer;
  v_size text;
BEGIN
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id, order_number INTO v_existing_id, v_existing_number
    FROM public.orders WHERE idempotency_key = p_idempotency_key LIMIT 1;
    IF v_existing_id IS NOT NULL THEN
      RETURN jsonb_build_object('id', v_existing_id, 'order_number', v_existing_number);
    END IF;
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Panier vide';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := COALESCE((v_item->>'quantity')::int, 0);
    v_size := v_item->>'size';
    IF v_qty <= 0 THEN RAISE EXCEPTION 'Quantité invalide'; END IF;

    SELECT id, name, price_fcfa, price_usd, stock, sold_out_sizes, sizes
      INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::uuid AND is_published = true
    FOR UPDATE;

    IF NOT FOUND THEN RAISE EXCEPTION 'Produit introuvable'; END IF;
    IF v_size IS NOT NULL AND array_length(v_product.sizes, 1) IS NOT NULL
       AND NOT (v_size = ANY(v_product.sizes)) THEN
      RAISE EXCEPTION 'Taille indisponible pour %', v_product.name;
    END IF;
    IF v_size IS NOT NULL AND v_size = ANY(v_product.sold_out_sizes) THEN
      RAISE EXCEPTION 'Taille épuisée pour %', v_product.name;
    END IF;
    IF v_product.stock < v_qty THEN
      RAISE EXCEPTION 'Stock insuffisant pour %', v_product.name;
    END IF;

    v_subtotal_fcfa := v_subtotal_fcfa + v_product.price_fcfa * v_qty;
    v_subtotal_usd := v_subtotal_usd + v_product.price_usd * v_qty;
  END LOOP;

  -- Apply promo if provided
  IF p_promo_code IS NOT NULL AND length(trim(p_promo_code)) > 0 THEN
    SELECT * INTO v_promo
    FROM public.promo_codes
    WHERE upper(code) = upper(trim(p_promo_code))
      AND is_active = true
    FOR UPDATE;

    IF NOT FOUND THEN RAISE EXCEPTION 'Code promo invalide'; END IF;
    IF v_promo.starts_at IS NOT NULL AND now() < v_promo.starts_at THEN
      RAISE EXCEPTION 'Code promo non encore actif';
    END IF;
    IF v_promo.ends_at IS NOT NULL AND now() > v_promo.ends_at THEN
      RAISE EXCEPTION 'Code promo expiré';
    END IF;
    IF v_promo.max_uses IS NOT NULL AND v_promo.uses_count >= v_promo.max_uses THEN
      RAISE EXCEPTION 'Code promo épuisé';
    END IF;
    IF v_subtotal_fcfa < v_promo.min_cart_fcfa THEN
      RAISE EXCEPTION 'Panier minimum non atteint pour ce code';
    END IF;

    IF v_promo.discount_type = 'percent' THEN
      v_discount_fcfa := (v_subtotal_fcfa * v_promo.discount_value) / 100;
      v_discount_usd := (v_subtotal_usd * v_promo.discount_value) / 100;
    ELSE
      v_discount_fcfa := LEAST(v_promo.discount_value, v_subtotal_fcfa);
      v_discount_usd := 0;
    END IF;

    v_promo_id := v_promo.id;
    v_promo_code_used := v_promo.code;

    UPDATE public.promo_codes SET uses_count = uses_count + 1 WHERE id = v_promo.id;
  END IF;

  INSERT INTO public.orders (
    user_id, guest_email, customer_full_name, customer_email, customer_phone,
    shipping_address, shipping_city, shipping_country, notes,
    payment_method, payment_status, status,
    subtotal_fcfa, subtotal_usd, delivery_fcfa,
    discount_fcfa, discount_usd, promo_code_id, promo_code,
    total_fcfa, total_usd,
    idempotency_key
  ) VALUES (
    v_user_id,
    CASE WHEN v_user_id IS NULL THEN p_customer->>'email' ELSE NULL END,
    p_customer->>'full_name',
    p_customer->>'email',
    p_customer->>'phone',
    p_customer->>'address',
    p_customer->>'city',
    p_customer->>'country',
    NULLIF(p_customer->>'notes', ''),
    p_payment, 'pending', 'pending_payment',
    v_subtotal_fcfa, v_subtotal_usd, 0,
    v_discount_fcfa, v_discount_usd, v_promo_id, v_promo_code_used,
    GREATEST(v_subtotal_fcfa - v_discount_fcfa, 0),
    GREATEST(v_subtotal_usd - v_discount_usd, 0),
    p_idempotency_key
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := (v_item->>'quantity')::int;
    SELECT name, price_fcfa, price_usd INTO v_product
    FROM public.products WHERE id = (v_item->>'product_id')::uuid;

    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_image,
      quantity, unit_price_fcfa, unit_price_usd,
      size, fit, lapel, lining, monogram
    ) VALUES (
      v_order_id, (v_item->>'product_id')::uuid, v_product.name, v_item->>'product_image',
      v_qty, v_product.price_fcfa, v_product.price_usd,
      v_item->>'size', v_item->>'fit', v_item->>'lapel', v_item->>'lining',
      NULLIF(v_item->>'monogram', '')
    );

    UPDATE public.products SET stock = stock - v_qty WHERE id = (v_item->>'product_id')::uuid;
  END LOOP;

  RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number);
END;
$function$;