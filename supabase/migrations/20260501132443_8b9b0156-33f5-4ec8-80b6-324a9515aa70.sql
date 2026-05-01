-- Add idempotency_key to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS orders_idempotency_key_uniq ON public.orders(idempotency_key) WHERE idempotency_key IS NOT NULL;

-- place_order: server-side price validation + stock decrement, atomic, idempotent
CREATE OR REPLACE FUNCTION public.place_order(
  p_items jsonb,
  p_customer jsonb,
  p_payment payment_method,
  p_idempotency_key text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_id uuid;
  v_existing_number text;
  v_order_id uuid;
  v_order_number text;
  v_user_id uuid := auth.uid();
  v_subtotal_fcfa integer := 0;
  v_subtotal_usd integer := 0;
  v_item jsonb;
  v_product RECORD;
  v_qty integer;
  v_size text;
BEGIN
  -- Idempotency: return existing order if key already used
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

  -- Validate each item, lock product rows
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    v_qty := COALESCE((v_item->>'quantity')::int, 0);
    v_size := v_item->>'size';
    IF v_qty <= 0 THEN RAISE EXCEPTION 'Quantité invalide'; END IF;

    SELECT id, name, price_fcfa, price_usd, stock, sold_out_sizes, sizes
      INTO v_product
    FROM public.products
    WHERE id = (v_item->>'product_id')::uuid AND is_published = true
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produit introuvable';
    END IF;

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

  -- Insert order
  INSERT INTO public.orders (
    user_id, guest_email, customer_full_name, customer_email, customer_phone,
    shipping_address, shipping_city, shipping_country, notes,
    payment_method, payment_status, status,
    subtotal_fcfa, subtotal_usd, delivery_fcfa, total_fcfa, total_usd,
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
    v_subtotal_fcfa, v_subtotal_usd, 0, v_subtotal_fcfa, v_subtotal_usd,
    p_idempotency_key
  )
  RETURNING id, order_number INTO v_order_id, v_order_number;

  -- Insert items + decrement stock
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

    UPDATE public.products
       SET stock = stock - v_qty
     WHERE id = (v_item->>'product_id')::uuid;
  END LOOP;

  RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number);
END;
$$;

GRANT EXECUTE ON FUNCTION public.place_order(jsonb, jsonb, payment_method, text) TO anon, authenticated;