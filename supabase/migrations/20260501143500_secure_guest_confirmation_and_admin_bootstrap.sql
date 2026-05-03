-- Secure guest order confirmation links and remove public ID-based reads.
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS guest_access_token_hash text,
  ADD COLUMN IF NOT EXISTS guest_access_token_expires_at timestamptz;

DROP POLICY IF EXISTS "Recent guest orders readable" ON public.orders;
DROP POLICY IF EXISTS "Recent guest order items readable" ON public.order_items;

CREATE OR REPLACE FUNCTION public.get_guest_order_confirmation(
  p_order_id uuid,
  p_access_token text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order public.orders%ROWTYPE;
  v_items jsonb;
BEGIN
  IF p_access_token IS NULL OR length(trim(p_access_token)) = 0 THEN
    RETURN NULL;
  END IF;

  SELECT *
    INTO v_order
  FROM public.orders
  WHERE id = p_order_id
    AND user_id IS NULL
    AND guest_access_token_hash = encode(digest(trim(p_access_token), 'sha256'), 'hex')
    AND guest_access_token_expires_at > now()
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'product_name', oi.product_name,
        'quantity', oi.quantity,
        'unit_price_fcfa', oi.unit_price_fcfa,
        'unit_price_usd', oi.unit_price_usd,
        'size', oi.size,
        'fit', oi.fit,
        'lapel', oi.lapel,
        'lining', oi.lining,
        'monogram', oi.monogram,
        'product_image', oi.product_image
      )
      ORDER BY oi.created_at
    ),
    '[]'::jsonb
  )
    INTO v_items
  FROM public.order_items oi
  WHERE oi.order_id = v_order.id;

  RETURN jsonb_build_object(
    'order',
    jsonb_build_object(
      'id', v_order.id,
      'order_number', v_order.order_number,
      'customer_full_name', v_order.customer_full_name,
      'customer_email', v_order.customer_email,
      'customer_phone', v_order.customer_phone,
      'shipping_address', v_order.shipping_address,
      'shipping_city', v_order.shipping_city,
      'shipping_country', v_order.shipping_country,
      'notes', v_order.notes,
      'subtotal_fcfa', v_order.subtotal_fcfa,
      'subtotal_usd', v_order.subtotal_usd,
      'delivery_fcfa', v_order.delivery_fcfa,
      'total_fcfa', v_order.total_fcfa,
      'total_usd', v_order.total_usd,
      'status', v_order.status,
      'payment_method', v_order.payment_method,
      'created_at', v_order.created_at
    ),
    'items', v_items
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_guest_order_confirmation(uuid, text) TO anon, authenticated;

-- Harden bootstrap: first registered account is no longer auto-admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'customer');

  RETURN NEW;
END;
$$;

-- place_order: return a short-lived access token for guest confirmation pages.
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
  v_guest_access_token text := NULL;
BEGIN
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id, order_number INTO v_existing_id, v_existing_number
    FROM public.orders WHERE idempotency_key = p_idempotency_key LIMIT 1;
    IF v_existing_id IS NOT NULL THEN
      RETURN jsonb_build_object('id', v_existing_id, 'order_number', v_existing_number, 'access_token', NULL);
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

  IF v_user_id IS NULL THEN
    v_guest_access_token := replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '');
  END IF;

  INSERT INTO public.orders (
    user_id, guest_email, customer_full_name, customer_email, customer_phone,
    shipping_address, shipping_city, shipping_country, notes,
    payment_method, payment_status, status,
    subtotal_fcfa, subtotal_usd, delivery_fcfa, total_fcfa, total_usd,
    idempotency_key, guest_access_token_hash, guest_access_token_expires_at
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
    p_idempotency_key,
    CASE WHEN v_guest_access_token IS NULL THEN NULL ELSE encode(digest(v_guest_access_token, 'sha256'), 'hex') END,
    CASE WHEN v_guest_access_token IS NULL THEN NULL ELSE now() + interval '24 hours' END
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

    UPDATE public.products
       SET stock = stock - v_qty
     WHERE id = (v_item->>'product_id')::uuid;
  END LOOP;

  RETURN jsonb_build_object('id', v_order_id, 'order_number', v_order_number, 'access_token', v_guest_access_token);
END;
$$;
